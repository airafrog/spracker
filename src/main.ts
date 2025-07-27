import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { Quasar, Dialog, Loading, Notify } from "quasar";
import { createApp } from "vue";

import App from "./App.vue";

// Quasar
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import "quasar/src/css/index.sass";

// Custom
import "./fonts.sass";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(Quasar, {
  plugins: { Dialog, Loading, Notify },
});
app.use(pinia);
app.mount("#app");
