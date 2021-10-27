<template>
	<view>
		<view class="status">
			<view class="pic">
				<block v-if="data.status<=5">
					<block v-if="data.status==0">
						<view class="qiu"><image src="../../static/images/blue_qiu.png" mode="widthFix"></image></view>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					</block>
					<block v-else>
						<view class="qiu"><image src="../../static/images/blue_qiu.png" mode="widthFix"></image></view>
						<block v-for="t in data.status" :key="t">
							<view class="blue"></view>
							<view class="qiu"><image src="../../static/images/blue_qiu.png" mode="widthFix"></image></view>
						</block>
						<block v-for="t in (5-data.status)" :key="t">
							<view class="hui"></view>
							<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
						</block>
						<view class="hui"></view>
						<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					</block>
				</block>
				<block v-else>
					<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					<view class="hui"></view>
					<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					<view class="hui"></view>
					<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					<view class="hui"></view>
					<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					<view class="hui"></view>
					<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					<view class="hui"></view>
					<view class="qiu"><image src="../../static/images/hui_qiu.png" mode="widthFix"></image></view>
					<view class="hui"></view>
					<view class="qiu"><image src="../../static/images/blue_qiu.png" mode="widthFix"></image></view>
				</block>
			</view>
			<view class="name">
				<view :class="[data.status>=0&&data.status!=9 ? 'blue' : 'hui']">待审核</view>
				<view :class="[data.status>=1&&data.status!=9 ? 'blue' : 'hui']">已发布</view>
				<view :class="[data.status>=2&&data.status!=9 ? 'blue' : 'hui']">已接单</view>
				<view :class="[data.status>=3&&data.status!=9 ? 'blue' : 'hui']">待付款</view>
				<view :class="[data.status>=4&&data.status!=9 ? 'blue' : 'hui']">待评价</view>
				<view :class="[data.status>=5&&data.status!=9 ? 'blue' : 'hui']">已完成</view>
				<view :class="[data.status==9 ? 'blue' : 'hui']">已取消</view>
			</view>
		</view>
		
		<view class="box">
			<view class="main">
				<view class="top">
					<view class="name">
						{{data.categ_name}} <block v-if="data.type==1">一口价订单</block><block v-else>报价订单</block>
					</view>
					<view class="top_right">
						￥{{data.total_price}}
					</view>
				</view>
				
				<view class="time">
					<view class="icon">
						<image src="../../static/images/time.png" mode="widthFix"></image>
					</view>
					<view class="content">
						{{data.customer_time}}
					</view>
					<view class="price" v-if="data.yongjin_type==1">
						抽成：{{data.yongjin_price}}%
					</view>
					<view class="price" v-else>
						抽成：{{data.yongjin_price}}元
					</view>
				</view>
				<view class="item">
					<view class="icon">
						<image src="../../static/images/order_people.png" mode="widthFix"></image>
					</view>
					<view class="content">
						{{data.linkman}} | {{data.mobile}}
					</view>
				</view>
				<view class="item">
					<view class="icon">
						<image src="../../static/images/order_position.png" mode="widthFix"></image>
					</view>
					<view class="content">
						{{data.position_address}}
					</view>
				</view>
				
				<view class="line"></view>
				<view class="title">故障描述</view>
				<view class="desc">{{data.remark}}</view>
				<view class="pic">
					<view v-for="(item,index) in data.pics" :key='index' class="pics">
						<image :src="item" mode="aspectFit" @tap='preImage(item)'></image>
					</view>
				</view>
				<view class="title">备注</view>
				<view class="desc">{{data.matter}}</view>
			</view>
		</view>
		
		<view class="order">
			<view class="info">订单编号：{{data.order_no}}</view>
			<view class="info">下单时间：{{data.create_time_txt}}</view>
			<view class="info">接单时间：{{data.status2_time_txt}}</view>
		</view>
		
		<!-- <view class="picture">
			<view v-for="(item,index) in data.report_pic" :key='index' class="pics">
				<image :src="item" mode="aspectFit" @tap='preImage(item)'></image>
			</view>
		</view>
		
		<view class="picture">
			<view v-for="(item,index) in data.before_repair_pic" :key='index' class="pics">
				<image :src="item" mode="aspectFit" @tap='preImage(item)'></image>
			</view>
		</view>
		
		<view class="picture">
			<view v-for="(item,index) in data.after_repair_pic" :key='index' class="pics">
				<image :src="item" mode="aspectFit" @tap='preImage(item)'></image>
			</view>
		</view>
		
		<view class="picture">
			<view v-for="(item,index) in data.parts_pic" :key='index' class="pics">
				<image :src="item" mode="aspectFit" @tap='preImage(item)'></image>
			</view>
		</view>
		
		<view class="picture">
			<view v-for="(item,index) in data.work_pic" :key='index' class="pics">
				<image :src="item" mode="aspectFit" @tap='preImage(item)'></image>
			</view>
		</view> -->
		
		<view class="foot">
			<view v-if="data.status>1&&data.status<9"><button class="check" @tap="goStore()">开始导航</button></view>
			<view v-if="data.status==2"><button class="check" @tap="goUpload(id)">上传图片</button></view>
			<view v-if="data.status==2"><button class="check" @tap="finish(id)">完成确认</button></view>
			<view><button class="mx" @tap="goBill(id)">费用明细</button></view>
			<view class="contact"><button openType="contact">联系客服</button></view>
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
				master_info: '',
				data:[],
				id: 0,
				is_preview:false,
				mapCtx: '',
			}
		},
		onReady() {
			//console.log(1);
			this.mapCtx = wx.createMapContext('myMap')
		},
		onLoad(options) {
			this.id = options.id ? options.id : 0;
		},
		onShow() {
			this.master_info = app.globalData.master_info;
			if (this.master_info) {
				if(!this.is_preview){
					this.initData();
				}
			} else {
				wx.reLaunch({
					url: '/pages/auth/index',
				})
			}
		},
		methods: {
			//初始化订单详情
			initData(){
				this.request({
					url: interfaces.orderPtDetail,
					data: {
						id: this.id,
					},
					header: {
						token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							this.is_preview=true;

							if(res.data.pics!=''){
								res.data.pics = res.data.pics.split(",");
							}else{
								res.data.pics=[];
							}
							
							res.data.create_time_txt = common.formatDT(res.data.create_time, 'yyyy.MM.dd h:m');
							res.data.status2_time_txt = common.formatDT(res.data.status2_time, 'yyyy.MM.dd h:m');
							res.data.status3_time_txt = common.formatDT(res.data.status3_time, 'yyyy.MM.dd h:m');
							res.data.status9_time_txt = common.formatDT(res.data.status9_time, 'yyyy.MM.dd h:m');
							this.data=res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},
			//点击报修图片预览图片事件
			preImage(url) {
				wx.previewImage({
					current: url,
					urls: this.data.pics,
				})
			},
			//拨打师傅电话
			callPhone(n) {
				wx.makePhoneCall({
					phoneNumber: n
				});
			},
			//师傅确认完工
			finish(id){
				var _this = this;
				wx.showModal({
					title: '提示',
					content: '确认完工了吗？',
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: interfaces.orderPtFinish,
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
										_this.initData();
									} else {
										app.isLogin(res.code, res.msg);
									}
								}
							})
						}
					}
				})
			},
			//跳转费用明细
			goBill(id) {
				wx.navigateTo({
					url: 'ptbill?id=' + id,
				})
			},
			//跳转上传维修照片页面
			goUpload(id){
				if(this.data.status==2){
					wx.navigateTo({
						url: 'upload?role=0&id=' + id,
					})
				}
			},
			//打开地图导航
			goStore(){
				var _this = this;
				// 实例化API核心类
				qqmapsdk = new QQMapWX({
					key: 'WCYBZ-EWVC4-CC3U2-DZGZI-UWGK2-E2BMM'
				});
				wx.getLocation({
					type: 'gcj02',
					success: res => {
						wx.openLocation({
							latitude: Number(_this.data.latitude),
							longitude: Number(_this.data.longitude),
							scale: 16,
							name: _this.data.position_address //打开后显示的地址名称
						})
					},
					fail: err => {
						//console.log(err);
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
												//console.log(settingdata)
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
		}
	}
</script>

<style lang="scss">
	.status{
		.pic{
			display: flex;
			padding: 0 calc((750rpx - 18px * 7) / 14);
			.qiu{
				width: 18px;
				image{
					width: 100%;
				}
			}
			.blue{
				height: 2px;
				margin: 8px 0;
				background-color: #257AFA;
				width: calc((750rpx - 18px * 7) / 7);
			}
			.hui{
				height: 2px;
				margin: 8px 0;
				background-color: #DFDFDF;
				width: calc((750rpx - 18px * 7) / 7);
			}
		}
		.name{
			display: flex;
			//padding: 0 12px;
			justify-content: space-around;
			.blue{
				color: #257AFA;
			}
			.hui{
				color: #848484;
			}
		}
	}
	
	.box{
		margin: 15px 15px 0 15px;
		box-shadow:0 0 9px 3px #ccc;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		.main{
			padding: 10px;
			.top{
				display: flex;
				justify-content: space-between;
				line-height: 20px;
				padding: 10px 0;
				margin-bottom: 10px;
				.name{
					font-size: 16px;
				}
				.top_right{
					color: #FFAE00;
				}
			}
			.time{
				display: flex;
				padding-bottom: 10px;
				.icon{
					width: 20px;
					padding-right: 10px;
					image{
						width: 100%;
					}
				}
				.content{
					color: #676767;
					width: calc(100% - 30px - 50px);
				}
				.price{
					width: 100px;
					color: #FFAE00;
					text-align: right;
				}
			}
			.item{
				display: flex;
				padding-bottom: 10px;
				.icon{
					width: 20px;
					padding-right: 10px;
					image{
						width: 100%;
					}
				}
				.content{
					color: #676767;
				}
			}
			.line{
				width: 100%;
				border-bottom: 1px #ccc solid;
			}
			.title{
				color: #257AFA;
				font-size: 16px;
				padding: 10px 0;
			}
			.desc{
				color: #676767;
				padding-bottom:10px;
			}
			.pic{
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			}
			.pics{
				display: flex;
				width: calc(((750rpx - 50px) / 3) - 10px);
				height: calc(((750rpx - 50px) / 3) - 10px);
				margin: 5px;
				justify-content: center;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}	
	}
	.order{
		color: #676767;
		padding: 5px 8px;
		line-height: 20px;
		margin: 15px 15px 70px 15px;
		box-shadow:0 0 9px 3px #ccc;
		border-radius: 10px;
		.info{
			padding: 5px 0;
		}
	}
	
	// .picture{
	// 	color: #676767;
	// 	padding: 5px 8px;
	// 	line-height: 20px;
	// 	margin: 15px 15px 0 15px;
	// 	box-shadow:0 0 9px 3px #ccc;
	// 	border-radius: 10px;
	// 	display: flex;
	// 	align-items: center;
	// 	flex-wrap: wrap;
	// 	.pics{
	// 		display: flex;
	// 		width: calc(((750rpx - 50px) / 3) - 10px);
	// 		height: calc(((750rpx - 50px) / 3) - 10px);
	// 		margin: 5px;
	// 		justify-content: center;
	// 		image{
	// 			width: 100%;
	// 			height: 100%;
	// 		}
	// 	}
	// }
	
	
	.foot{
		color: #257AFA;
		padding: 10px 0;
		box-shadow:0 0 9px 3px #ccc;
		margin-top: 20px;
		text-align: center;
		height: 40px;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		view{
			float: right;
			padding: 5px 0;
			width: calc(100% / 4);
		}
		button{
			height: 30px;
			font-size: 14px;
			width: 80px;
			padding: 0 5px;
			line-height: 30px;
			border-radius: 15px;
		}
		.contact{
			button{
				background-color:transparent;
				color: #257AFA;
			}
			button::after {
				border: 0;
			}
		}
		.mx{
			border: 1px #257AFA solid;
			color: #257AFA;
			background-color: #fff;
		}
		.check{
			color: #fff;
			background-color: #257AFA;
		}
		
	}
	
	
</style>
