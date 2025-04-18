import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import "./assets/tailwind.css";
import router from "./router";
import store from "./store";
import './style/tailwind.css'; // Import Tailwind styles
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
