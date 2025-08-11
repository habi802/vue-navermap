#### Naver Map - Dynamic Map API
- 네이버 지도의 Dynamic Map API를 이용하여 지도를 그린 뒤,
임의의 주소 10개가 적힌 select 태그에서 option을 선택하면,
해당 주소로 지도의 중심과 마커의 위치를 이동시키고,
해당 주소의 좌표를 캐시에 저장하여
나중에 해당 주소로 또 다시 검색할 때 API를 호출하지 않고 캐시에 저장된 좌표를 불러오게 하는 코드

- npm i pinia-plugin-persistedstate 명령어를 실행하여 pinia-plugin-persistedstate 설치

#### .env
```bash
VITE_NAVER_MAP_CLIENT_ID=# 네이버 지도 API 키
```

- pinia의 defineStore를 사용하여 주소 검색, 검색 결과 캐시에 저장을 할 수 있게 함

#### .main.js
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(router)

app.mount('#app')
```

- 자세한 코드는 App.vue, stores/geocode.js 파일의 코드를 참고.
