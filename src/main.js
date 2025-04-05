// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')


import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import '../src/assets/Css/login.css';
// import './assets/image/login-image/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import './assets/fonts/vazir';
const app = createApp(App);
app.use(router); // Make sure Vue Router is used
app.mount('#app'); // Mount the app

