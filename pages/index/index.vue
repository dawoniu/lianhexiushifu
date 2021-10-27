<template>
	<view>
		<official-account></official-account>
		<view class="head">
			<view class="map">
				<map id="myMap" style="width: 100%; height:350rpx;" show-compass="true" scale="16" show-location="true" :latitude="latitude"
				 :longitude="longitude">
					<cover-view class="location" @tap="moveToLocation">
						<cover-image src="/static/images/dangqian.png" mode="widthFix"></cover-image>
					</cover-view>
				</map>
			</view>
			<view class="jie">
				<view class="top">接单范围</view>
				<view class="skill">
					<view class="name" v-for="(item,index) in data.categ" :key="index">{{item.name}}</view>
				</view>
				<view class="tip">说明：开启自动接单后，平台会给您分配门店订单，请优先完成</view>
				<view class="but1" v-if="auto==0" @tap="autoOrder(0)">开启自动接单</view>
				<view class="but2" v-else @tap="autoOrder(1)">自动接单中...</view>
			</view>
		</view>
		<view class="ordertip">订单提醒</view>
		<view class="store" v-for="(item,index) in data.store" :key="index" @tap="goLsDetail(item.id)">
			<view class="title">
				<view class="icon"></view>
				<view>门店订单</view>
			</view>
			<view class="name">
				<view>{{item.server_name}}</view>
				<view>{{item.customer_time}}</view>
				<view>></view>
			</view>
			<view class="address">
				<view class="icon"><image src="../../static/images/address_position.png" mode="widthFix"></image></view>
				<view>{{item.position_address}}</view>
			</view>
			<view class="foot">
				<view class="left">待接单</view>
				<view class="right" @tap.stop="start(item.id,index)">接单</view>
			</view>
		</view>
		
		<view class="order" @tap="goHall(1)">
			<view class="left">
				<view class="icon"></view>
				<view class="name">一口价订单</view>
			</view>
			<view class="right">
				<view class="count">有{{data.ykj}}单新求助</view>
				<view class="entry">></view>
			</view>
		</view>
		
		<view class="order" @tap="goHall(2)">
			<view class="left">
				<view class="icon"></view>
				<view class="name">报价订单</view>
			</view>
			<view class="right">
				<view class="count">有{{data.bj}}单新求助</view>
				<view class="entry">></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
	var qqmapsdk;
	export default {
		data() {
			return {
				data: {
					ykj:0,
					bj:0
				},
				latitude: "",
				longitude: "",
				dangqian: "",
				master_info:"",
				auto:0
			}
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady() {
			this.mapCtx = wx.createMapContext('myMap')
		},
		onLoad() {
			this.loadMap();
		},
		onShow() {
			//获取用户服务地址
			var _this=this;
			setTimeout(function(){
				if (app.globalData.isRequest == 1) {
					_this.master_info=app.globalData.master_info;
					_this.loadData();
				} else {
					// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
					// 所以此处加入 callback 以防止这种情况
					app.isRequestCallback = isRequest => {
						if (isRequest == 1) {
							_this.master_info=app.globalData.master_info;
							_this.loadData();
						}
					}
				}
			},1000);
		},
		methods: {
			//移到自己定位坐标
			moveToLocation() {
				this.mapCtx.moveToLocation()
			},
			loadMap() {
				qqmapsdk = new QQMapWX({
					key: 'WCYBZ-EWVC4-CC3U2-DZGZI-UWGK2-E2BMM'
				});
				wx.getLocation({
					type: 'gcj02',
					success: res => {
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success: addressRes => {
								this.latitude=res.latitude;
								this.longitude= res.longitude;
								this.dangqian=addressRes.result.address_component.city;
							}
						})
					},
					fail: err => {
						console.log(err);
						if (err.errMsg === "getLocation:fail auth deny") {
							wx.showModal({
								title: '提示',
								showCancel: false,
								confirmText: '好的',
								content: '未获取到你的地理位置，暂时无法为你提供服务。请检查是否开启定位权限。或尝试重新打开小程序。',
								success: (res) => {
									if (res.confirm) {
										wx.openSetting({
											success(settingdata) {
												console.log(settingdata)
												if (settingdata.authSetting['scope.userLocation']) {
													wx.showToast({
														title: '授权成功',
														icon: 'none',
														mask: true,
													})
												} else {
													wx.showToast({
														title: '授权失败',
														icon: 'none',
														mask: true,
													})
												}
											}
										})
									}
								}
							})
						}
					}
				});
			},
			//如果没有授权登陆，则接单范围里显示所有服务项目，不显示门店订单，一口价订单和报价订单显示当前定位的师傅位置
			loadData() {
				if(this.master_info&&this.master_info.status == 5){
					var id=this.master_info.id;
					this.auto=this.master_info.auto;
					this.loadMasterInfo(id);
				}else{
					var id=0;
					this.loadMasterInfo(id);
				}
			},
			loadMasterInfo(id){
				this.request({
					url: interfaces.initIndex,
					data: {
						id: id,
					},
					method: 'POST',
					success: res => {
						if(res.code==200){
							this.data=res.data;
						}
					}
				})
			},
			//开启或关闭自动接单
			autoOrder(auto){
				var _this=this;
				if(auto==1){
					var content="确定要关闭自动接单吗？"
				}else{
					var content="确定要开启自动接单吗？"
				}
				if(this.master_info){
					wx.showModal({
						title: '提示',
						content: content,
						success: function(res) {
							if (res.confirm) {
								_this.request({
									url: interfaces.autoOrder,
									header: {
										token: _this.master_info.token
									},
									data: {
										auto: auto
									},
									method: 'POST',
									success: res => {
										console.log(res);
										if (res.code == 200) {
											wx.showToast({
												title: "操作成功",
												icon: 'success'
											})
											_this.master_info.auto=res.data;
											_this.auto=res.data;
										} else {
											app.isLogin(res.code, res.msg);
										}
									}
								})
							}
						}
					})
				}else{
					wx.reLaunch({
						url: '/pages/auth/index',
					})
				}
			},
			start(id,index){
				var _this=this;
				wx.showModal({
					title: '提示',
					content: '确定要接单吗？',
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: interfaces.orderLsStart,
								header: {
									token: _this.master_info.token
								},
								data: {
									id: id
								},
								method: 'POST',
								success: res => {
									console.log(res);
									if (res.code == 200) {
										wx.showToast({
											title: res.msg,
											icon: 'success'
										})
										_this.data.store.splice(index,1);
									} else {
										app.isLogin(res.code, res.msg);
									}
								}
							})
						}
					}
				})
			},
			//跳转接单大厅
			goHall(type){
				wx.navigateTo({
					url: "../order/hall?type=" + type,
				})
			},
			//跳转连锁店订单详情页
			goLsDetail(id) {
				wx.navigateTo({
					url: '/pages/order/lsdetail?id=' + id,
				})
			},
		}
	}
</script>

<style lang="scss">
	.head {
		border-radius: 10px;
		margin: 10px 15px;
		box-shadow: 0 0 9px 3px #ccc;
		padding-bottom: 15px;
		.map {
			position: relative;
			.location {
				position: absolute;
				top: 10px;
				right: 10px;
				width: 30px;
			}
		}
		.jie {
			.top {
				color: #257AFA;
				font-size: 16px;
				line-height: 40px;
				padding-left: 10px;
			}
			.skill {
				.name {
					background-color: #F2F2F2;
					padding: 0 10px;
					line-height: 30px;
					display: inline-block;
					border-radius: 10px;
					height: 30px;
					margin: 3px;
				}
			}
			.tip {
				color: #676767;
				line-height: 20px;
				padding: 10px;
			}
			.but1{
				background-color: #257AFA;
				height: 30px;
				line-height: 30px;
				border-radius: 15px;
				text-align: center;
				margin: 0 auto;
				width: 70%;
				color: #fff;
			}
			.but2{
				background-color: #FEFEFE;
				height: 30px;
				line-height: 30px;
				border-radius: 15px;
				text-align: center;
				margin: 0 auto;
				width: 70%;
				color: #257AFA;
				border: 1px #257AFA solid;
			}
		}
	}
	.ordertip{
		font-size: 16px;
		padding-left: 15px;
		color: #257AFA;
	}
	.store{
		border-radius: 10px;
		margin: 10px 15px;
		box-shadow: 0 0 9px 3px #ccc;
		padding: 10px;
		.title{
			display: flex;
			color: #257AFA;
			font-size: 12px;
			line-height: 20px;
			.icon{
				width: 12px;
				height: 12px;
				border-radius: 6px;
				background-color: #FF0000;
				margin-right: 5px;
				margin-top: 4px;
			}
		}
		.address{
			display: flex;
			line-height: 16px;
			.icon{
				padding-right: 5px;
				padding-top: 2px;
				image{
					width: 12px;
				}
			}
		}
		.name{
			display: flex;
			justify-content: space-between;
			padding: 10px 0;
		}
		.foot{
			padding-top: 10px;
			display: flex;
			justify-content: space-between;
			line-height: 30px;
			.left{
				color: #DD6800;
				font-size: 16px;
			}
			.right{
				color: #fff;
				background-color: #257AFA;
				height: 30px;
				border-radius: 15px;
				padding: 0 20px;
			}
		}
	}
	
	.order{
		display: flex;
		justify-content: space-between;
		line-height: 50px;
		height: 50px;
		border-radius: 10px;
		margin: 10px 15px;
		box-shadow: 0 0 9px 3px #ccc;
		padding: 0 10px;
		.left{
			display: flex;
			.icon{
				width: 12px;
				height: 12px;
				border-radius: 6px;
				background-color: #FFB14B;
				margin-right: 8px;
				margin-top: 19px;
			}
			.name{
				font-size: 16px;
			}
		}
		.right{
			display: flex;
			.count{
				font-size: 12px;
				color: #676767;
			}
			.entry{
				padding-left: 8px;
				color: #257AFA;
			}
		}
	}
	
</style>
