// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faMinusSquare
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheckSquare, faMinusSquare);

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

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
