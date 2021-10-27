<template>
	<view>
		
		<view class="logo">
			<image src='/static/images/logo.jpg' mode='widthFix'></image>
		</view>
		<view class='title1'>申请获取以下权限</view>
		<view class='title2'>获得你的公开信息（昵称、头像等）</view>
		<view class="sub">
			<button open-type="getUserInfo" class='login' type='primary' @getuserinfo="getUserInfoFun">授权登录</button>
			<button class="nologin" @tap="noLogin">暂不登录</button>
		</view>
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	var handleLogin = require("../../utils/handleLogin.js");
	export default {
		data() {
			return {
				guider_id: 0
			}
		},
		onLoad(options) {
			this.guider_id = options.guider_id ? options.guider_id : 0;
		},
		methods: {
			getUserInfoFun() {
				handleLogin.reg(this.guider_id);
			},
			noLogin() {
				uni.reLaunch({
					url: '../index/index',
				})
			}
		}
	}
</script>

<style lang="scss">
	.logo{
		width: 50%;
		margin: 0 auto;
		padding-top: 30px;
		image{
			width: 100%;
		}
	}
	.title1{
		text-align: center;
		font-size: 16px;
		padding: 20px 0;
	}
	.title2{
		text-align: center;
		font-size: 12px;
	}
	.sub{
		width: 70%;
		margin: 0 auto;
		padding-top: 50px;
		button{
			width: 100%;
			height: 40px;
			line-height: 40px;
			border-radius: 20px;
			font-size: 14px;
			border: 0;
		}
		.login{
			background-color: #257AFA;
			margin-bottom: 10px;
		}
		.nologin{
			color: #257AFA;
			background-color: #fff;
			box-shadow: 0 0 9px 2px #ccc;
		}
	}
</style>
