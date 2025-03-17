import {createApp} from 'vue'
import App from './App.vue'
import router from "./router";
import {syncUser} from "./store/storeUser.ts";

syncUser();
createApp(App)
    .use(router)
    .mount('#app')
