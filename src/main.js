import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faMinusSquare,
  faSignOutAlt,
  faSpinner,
  faQuestionCircle,
  faPlusSquare,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheckSquare, faMinusSquare, faPlusSquare, faSignOutAlt, faSpinner,faQuestionCircle, faTimesCircle);

Vue.component("font-awesome-icon", FontAwesomeIcon);

import VueFire from "vuefire";
import firebase from "firebase/app";
import "firebase/firestore";
Vue.use(VueFire);

var config = {
  apiKey: "AIzaSyABZAEyNBTjC9CtxnfyGNZ6OMfJoaMK8sY",
  authDomain: "harvard-capstone.firebaseapp.com",
  databaseURL: "https://harvard-capstone.firebaseio.com",
  projectId: "harvard-capstone",
  storageBucket: "harvard-capstone.appspot.com",
  messagingSenderId: "986064499697"
};
firebase.initializeApp(config);

export const db = firebase.firestore();

Vue.config.productionTip = false;

let app;


window.onload = function () {
  firebase.auth().onAuthStateChanged(async () => {
    if (!app) {
      app = new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app');
    }
  });
}