<script setup>
import { onMounted } from 'vue';

const state = {
    address: [
        '부산광역시 연제구 해맞이로127번길 7',
        '대전광역시 서구 조달청길 160(도마동)',
        '강원도 춘천시 미려골길11번길 1(효자동)',
        '경상남도 거제시 거제중앙로1길 16-9(상동동)',
        '경상남도 창원시 진해구 편백로 8(회현동)',
        '전라북도 부안군 부안읍 옹중신기길 27-15'
    ]
};

let lat = 37.5665;
let lon = 126.9780;

onMounted(() => {
    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(lat, lon),
        zoom: 10,
    });

    naver.maps.Service.geocode(
        { query: state.address[0] },
            function (status, response) {
            if (status !== naver.maps.Service.Status.OK) {
                console.log('address: 주소를 찾을 수 없습니다.');
            }

            const result = response.v2.addresses[0];
            if (result.total === 0) {
                console.log('address: 검색 결과가 없습니다.');
            }

            const point = new naver.maps.LatLng(result.y, result.x);
            lat = result.x;
            lon = result.y;

            map.setCenter(point);

            new naver.maps.Marker({
                map: map,
                position: point
            });
        }
    );
});
</script>

<template>
    <div id="map" style="width: 400px; height: 400px;"></div>
</template>

<style scoped>

</style>
