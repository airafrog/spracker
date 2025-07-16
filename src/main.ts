import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { Quasar, Notify, Loading } from "quasar";
import { createApp } from "vue";

import App from "./App.vue";

// Quasar
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import "quasar/src/css/index.sass";

// Custom
import "./fonts.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(Quasar, {
  plugins: { Notify, Loading },
});
app.use(pinia);
app.mount("#app");
