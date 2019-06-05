<template>
	<div>
		<table class="table">
			<caption>数据模板定义模拟接口返回值</caption>
			<thead>
				<tr>
					<td class="table-item" v-for="(v,i) in dataShow1[0]" :key="i">{{i}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(v,i) in dataShow1" :key="i">
					<td class="table-item" v-for="(t,j) in v" :key="j">{{t}}</td>
				</tr>
			</tbody>
		</table>
		<button @click="again">再次发起请求，查看|+step规则的数据的变化</button>
		<br/>
		<table class="table">
			<caption>使用Rndom工具类定义模拟接口放回值</caption>
			<thead>
				<tr>
					<td class="table-item" v-for="(v,i) in dataShow2[0]" :key="i">{{i}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(v,i) in dataShow2" :key="i">
					<td class="table-item" v-for="(t,j) in v" :key="j">{{t}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import api from './axios/api.js';

export default {
	name: 'App',
	data() {
		return {
			dataShow1: [],
			dataShow2:[]
		};
	},
	created() {
		this.getdata1();
		this.getdata2();
	},
	methods: {
		//给模拟接口发送请求，获取数据后展示到表格中
		getdata1() {
			api.getMockData('/Get/list1').then(res => {
				console.log(res);
				this.dataShow1 = res;
			});
		},
		//重新给模拟接口发起请求，观察|+step规则的变化
		again() {
			this.getdata1();
		},
		getdata2() {
			api.getMockData('/Get/list2').then(res => {
				console.log(res);
				this.dataShow2 = res;
			});
		},
	}
};
</script>

<style>
	.table {
		border:1px solid #aaa;
		border-right:0;
		border-bottom:0;
		width:100%;
	}
	.table-item {
		border-right:1px solid #aaa;
		border-bottom:1px solid #aaa;
	}
</style>
