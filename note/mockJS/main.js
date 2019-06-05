import Vue from 'Vue';
import App from './src/App.vue';
require('./mock.js');

const vm = new Vue({
    el: "#app",
    data: {
    },
    methods: {},
    render: function (createElements) {
        return createElements(App);
    },
    mounted() {
    }
});