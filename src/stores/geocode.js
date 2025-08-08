import { defineStore } from "pinia";
import { ref } from "vue";

const TTL_MS = 1 * 24 * 60 * 60 * 1000; // 캐시 최대 보관 시간: 1일 (millisecond)
const MAX_CACHE_SIZE = 200; // 캐시 최대 보관 개수: 200개

export const useGeocodeStore = defineStore('geocode', () => {
    const addressCache = ref({});

    // TTL_MS 를 초과한 캐시, 즉 추가한 지 7일이 넘은 캐시를 삭제하는 함수
    const cleanExpiredCache = () => {
        const now = Date.now();
        for (const address in addressCache.value) {
            if (now - addressCache.value[address].timestamp > TTL_MS) {
                delete addressCache.value[address];
            }
        }
    };

    // 최대 보관 개수를 초과한 개수만큼 캐시를 삭제하는 함수
    const enforceCacheSizeLimit = () => {
        const entries = Object.entries(addressCache.value);

        // 최대 보관 개수를 초과하지 않았을 경우 return
        if (entries.length <= MAX_CACHE_SIZE) {
            return;
        }

        // timestamp 기준으로 오름차순 정렬, 즉 가장 오래된 것일 수록 앞으로 옴
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        // 초과한 개수만큼 가장 오래된 것부터 삭제
        const excess = entries.length - MAX_CACHE_SIZE;
        for (let i = 0; i < excess; i++) {
            delete addressCache.value[entries[i][0]];
        }
    }

    // 지도가 제대로 로드되었는지 확인하는 함수
    const isNaverMapsLoaded = () => {
        return typeof naver && naver.maps && naver.maps.Service;
    };

    // 주소 보관 캐시를 확인한 후, 주소를 검색한 뒤 캐시에 저장하는 함수
    const fetchCoordinates = async address => {
        cleanExpiredCache();
        enforceCacheSizeLimit();

        // 검색하려는 주소가 이미 캐시에 보관되어 있을 경우,
        // 즉 같은 결과값이 나오는 API를 호출한 적 있을 경우
        // 또 API를 호출하지 않게 캐시에 보관된 결과값을 return
        if (addressCache.value[address]) {
            console.log(`📦 캐시에서 가져옴: ${address}`);
            return addressCache.value[address].coords;
        }

        console.log(`🌐 API 호출: ${address}`);
        
        if (!isNaverMapsLoaded()) {
            throw new Error('지도가 로드되지 않았습니다.');
        }

        return new Promise((resolve, reject) => {
            // Geocoding API 호출
            naver.maps.Service.geocode(
                // 속성명은 query 로 해야 하며, 속성값은 address가 들어감
                { query: address },
                (status, response) => {
                    if (status !== naver.maps.Service.Status.OK) {
                        reject(new Error('주소를 검색하는 데 실패했습니다.'));
                    }

                    // 주소 검색이 제대로 됐을 경우
                    const result = response.v2.addresses[0];
                    if (result === undefined) {
                        reject(new Error('주소를 찾을 수 없습니다.'));
                    }

                    // 검색한 주소의 좌표값(위도, 경도)으로 반환하며,
                    // 반환된 좌표값을 coords 객체 변수에 넣음
                    const coords = {
                        lat: result.y,
                        lng: result.x
                    };

                    // coords 변수, 현재 시간이 timestamp로 변환된 값을
                    // 캐시에 보관
                    addressCache.value[address] = {
                        coords,
                        timestamp: Date.now()
                    };

                    resolve(coords);
                }
            );
        });
    }

    return { addressCache, fetchCoordinates };
}, {
    persist: true
    // npm install pinia-plugin-persistedstate 명령을 실행한 뒤,
    // 해당 속성을 입력할 시 별도로 localStorage를 적지 않아도 localStorage에 저장됨
});