<script setup>
import { onMounted, reactive, watch } from 'vue';

import { useGeocodeStore } from './stores/geocode';
const geocodeStore = useGeocodeStore();

const state = reactive({
    data: '', // 주소 선택 select의 value
    addresses: [ // 임의의 주소들
        '부산광역시 연제구 해맞이로127번길 7',
        '대전광역시 서구 조달청길 160(도마동)',
        '강원도 춘천시 미려골길11번길 1(효자동)',
        '경상남도 거제시 거제중앙로1길 16-9(상동동)',
        '경상남도 창원시 진해구 편백로 8(회현동)',
        '전라북도 부안군 부안읍 옹중신기길 27-15',
        '충청남도 태안군 근흥면 근흥로 1200-37',
        '대전광역시 대덕구 비래동로7번길 61(비래동)',
        '경상북도 영천시 임고면 운주로 918',
        '경상북도 울진군 온정면 외선미1길 70',
        '경기도 부천시 안곡로149번길 5(괴안동)',
        '경상남도 산청군 시천면 지리산대로 520',
        'asdf'
    ]
});

let map = null; // 지도를 띄우기 위한 변수
let marker = null; // 지도에 마커를 찍기 위한 변수

onMounted(() => {
    // 화면 마운트 시 지도가 그려지고,
    // 지도 중심에 마커를 찍음
    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
    });

    marker = new naver.maps.Marker({
        map,
        position: map.getCenter()
    });
});

// state.data가 바뀔 때마다(선택한 주소가 바뀔 때마다)
// 선택한 주소가 파라미터로 들어간 geocodeStore의 fetchCoordinates 함수를 호출
// 함수를 호출하면 선택한 주소의 위도, 경도가 결과값으로 옴
watch(() => state.data, async address => {
    console.log('선택한 주소:', state.data);
    if (address && address !== '') {
        try {
            const geocodeRes = await geocodeStore.fetchCoordinates(address);
            if (geocodeRes === undefined) {
                console.log('주소를 검색하는 데 실패했습니다.');
                return;
            }
            const position = new naver.maps.LatLng(geocodeRes.lat, geocodeRes.lng);

            // 지도를 검색한 주소의 좌표값으로 이동시키고,
            // 마커도 그 좌표값으로 옮긴다.
            map.setCenter(position);
            marker.setPosition(position);
        } catch (e) {
            console.log(e.message);
        }
    }
});
</script>

<template>
    <div id="map" style="width: 400px; height: 400px;"></div>
    <select v-model="state.data">
        <option value="">주소 선택</option>
        <option v-for="(addr, idx) in state.addresses" :key="idx" :value="addr">
            {{ addr }}
        </option>
    </select>
</template>

<style scoped>

</style>
