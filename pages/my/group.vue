<template>
	<view>

		<!--查看所推广的人员列表-->
		<view class='top'>
		  <view class="thumb"></view>
		  <view class='nickname'>师傅信息</view>
		  <view class='realname'>年龄</view>
		  <view class='order'>发展成员</view>
		</view>
		<block v-for='(item,index) in data' :key='index'>
		  <view class='item'>
		    <view class="thumb"><image :src="item.thumb" mode="widthFix"></image></view>
		    <view class='nickname'>
		      <view>{{item.realname}}</view>
		      <view class="time">{{item.examine_time}}</view>
		    </view>
		    <view class='realname'>{{item.age}}</view>
		    <view class='order'>{{item.group_count}}</view>
		  </view>
		</block>

	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	export default {
		data() {
			return {
				master_info: '',
				data: ''
			}
		},
		onShow() {
			this.master_info = app.globalData.master_info;
			if(app.isAuth()){
				this.initData();
			}
		},
		methods: {
			initData(){
				//请求异步ajax获取师傅的团队
				this.request({
					url: interfaces.masterGroup,
					header: {
						token:this.master_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							this.data=res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			}
		}
	}
</script>

<style>
	/* page{
	  background-color: #fff;
	} */
	.top{
	  display: flex;
	  background-color: #fff;
	  border-bottom: 1px #f5f5f5 solid;
	  height: 40px;
	  line-height: 40px;
	  text-align: center;
	}
	.item{
	  display: flex;
	  background-color: #fff;
	  border-bottom: 1px #f5f5f5 solid;
	  height: 60px;
	  align-items: center; 
	  text-align: center;
	  margin: 5px 0;
	}
	.thumb{
	  width: 60px;
	  padding-left: 5px;
	}
	.thumb image{
	  width: 100%;
	}
	.nickname{
	  width: calc(60% - 65px);
	}
	.time{
	  color: #ccc;
	}
	.realname{
	  width: 20%;
	}
	.order{
	  width: 20%;
	}
</style>
