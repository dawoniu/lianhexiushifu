<template>
	<view>
		
		<!--pages/index/article.wxml-->
		<web-view :src='article.src'></web-view>
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	export default {
		data() {
			return {
				master_info: "",
				article: '',
			}
		},
		onLoad(options) {
			var id = options.id ? options.id : 0;
			this.master_info = app.globalData.master_info;
			if (app.isAuth()) {
				this.initData(id);
			}
		},
		methods: {
			initData(id) {
				//请求异步ajax获取收入等参数
				this.request({
					url: interfaces.studyArticleDetail,
					header: {
						token: this.master_info.token
					},
					data:{
						id:id
					},
					method: 'POST',
					success: res => {
						//console.log(res);
						if (res.code == 200) {
							this.article = res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},

		}
	}
</script>

<style lang="scss">
	.box {
		padding: 0 10px;
	}
	.item {
		display: flex;
		padding: 10px 0;
		border-bottom: 1px #d9d9d9 solid;
		justify-content: space-between;

		.img {
			display: flex;
			position: relative;
			width: 23%;
			height: 60px;
			justify-content: center;
			line-height: 60px;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.right {
			width: calc(77% - 10px);

			.name {
				height: 36px;
				line-height: 18px;
				color: #000000;
				white-space: wrap;
				letter-spacing: 2rpx;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				margin-bottom: 4px;
			}

			.time {
				line-height: 20px;
				color: #A5A5A5;
			}
		}
	}

	.tip {
		line-height: 60rpx;
		height: 60rpx;
		text-align: center;
		position: relative;
		font-size: 24rpx;
		color: #999;
		margin-top: 20px;
	}

	.tip::after {
		content: "";
		display: block;
		width: 100rpx;
		height: 2rpx;
		background: #999;
		position: absolute;
		right: 180rpx;
		top: 50%;
	}

	.tip::before {
		content: "";
		display: block;
		width: 100rpx;
		height: 2rpx;
		background: #999;
		position: absolute;
		left: 180rpx;
		top: 50%;
	}
</style>
