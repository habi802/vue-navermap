<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
    });
});
</script>

<template>
    <div id="map" style="width: 100px; height: 100px;"></div>
</template>

<style scoped>

</style>
