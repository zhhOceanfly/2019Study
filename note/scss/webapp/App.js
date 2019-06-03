import Vue from 'Vue';
import App from './App.vue';
import './App.scss';

const vm = new Vue({
    el: "#app",
    data: {
        name: 5
    },
    methods: {},
    render: function (createElements) {
        return createElements(App);
    },
    mounted() {
    }
});