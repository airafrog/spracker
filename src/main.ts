import { createPinia } from "pinia";
import { Quasar, Dialog, Loading, Notify } from "quasar";
import { createApp } from "vue";

import App from "./App.vue";

// Quasar
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import "quasar/src/css/index.sass";

// Custom
import "./fonts.sass";

const app = createApp(App);
app.use(Quasar, {
  plugins: { Dialog, Loading, Notify },
});
app.use(createPinia());
app.mount("#app");
