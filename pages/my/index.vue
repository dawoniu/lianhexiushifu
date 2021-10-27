<template>
	<view>
		
		<view class="main">
			<view class="info">
				<view class="img" @tap="changeThumb">
					<image :src="master.thumb" mode="scaleToFill"></image>
				</view>
				<view class="right">
					<view class="name">{{master.realname}}</view>
					<view class="number">工号：{{master.id}}</view>
				</view>
			</view>
			<view class="income">
				<view class="item">
					<view class="num one">
						{{master.total_shouru}}
					</view>
					<view class="title">
						总收入(元)
					</view>
				</view>
				<view class="item">
					<view class="num two">
						{{master.order_count}}
					</view>
					<view class="title">
						总单数
					</view>
				</view>
				<view class="item">
					<view class="num three">
						{{master.haoping_rate}}
					</view>
					<view class="title">
						好评率
					</view>
				</view>
			</view>
			
			<view class="order">
				<view class="tab">
					<view :class="[tab==1 ? 'item checked' : 'item']" @tap="changeTab(1)">周</view>
					<view :class="[tab==2 ? 'item checked' : 'item']" @tap="changeTab(2)">月</view>
					<view :class="[tab==3 ? 'item checked' : 'item']" @tap="changeTab(3)">年</view>
				</view>
				<view class="box" v-if="tab==1">
					<view class="item">
						<view class="title">
							连锁店
						</view>
						<view class="speed">
							<progress :percent="master.ls_week_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.ls_week_count}}单
						</view>
					</view>
					<view class="item">
						<view class="title">
							客户单
						</view>
						<view class="speed">
							<progress :percent="master.pt_week_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.pt_week_count}}单
						</view>
					</view>
					<view class="item">
						<view class="title">
							总单
						</view>
						<view class="speed">
							<progress :percent="master.total_week_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.total_week_count}}单
						</view>
					</view>
				</view>
				<view class="box" v-if="tab==2">
					<view class="item">
						<view class="title">
							连锁店
						</view>
						<view class="speed">
							<progress :percent="master.ls_month_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.ls_month_count}}单
						</view>
					</view>
					<view class="item">
						<view class="title">
							客户单
						</view>
						<view class="speed">
							<progress :percent="master.pt_month_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.pt_month_count}}单
						</view>
					</view>
					<view class="item">
						<view class="title">
							总单
						</view>
						<view class="speed">
							<progress :percent="master.total_month_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.total_month_count}}单
						</view>
					</view>
				</view>
				<view class="box" v-if="tab==3">
					<view class="item">
						<view class="title">
							连锁店
						</view>
						<view class="speed">
							<progress :percent="master.ls_year_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.ls_year_count}}单
						</view>
					</view>
					<view class="item">
						<view class="title">
							客户单
						</view>
						<view class="speed">
							<progress :percent="master.pt_year_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.pt_year_count}}单
						</view>
					</view>
					<view class="item">
						<view class="title">
							总单
						</view>
						<view class="speed">
							<progress :percent="master.total_year_percent" show-info stroke-width="5" />
						</view>
						<view class="num">
							{{master.total_year_count}}单
						</view>
					</view>
				</view>	
			</view>
			
			<view class="line">
				<image src="../../static/images/my_img.png" mode="widthFix"></image>
			</view>
			
			<view class="skill">
				<view class="title">
					<view class="name">个人认证信息</view>
					<view>></view>
				</view>
				<view class="box">
					<view class="name" v-for="(item,index) in master.skill_name" :key="index">{{item}}</view>
				</view>
			</view>
			
			<view class="menu">
				<view class="title">
					常用功能
				</view>
				<view class="box">
					<view @tap="download">
						<view class="thumb">
							<image src="/static/images/my_icon1.png" mode="widthFix"></image>
						</view>
						<view>
							下载工单
						</view>
					</view>
					<view @tap="goGroup">
						<view class="thumb">
							<image src="/static/images/my_icon2.png" mode="widthFix"></image>
						</view>
						<view>
							我的团队
						</view>
					</view>
					<view @tap="goStudy">
						<view class="thumb">
							<image src="/static/images/my_icon3.png" mode="widthFix"></image>
						</view>
						<view>
							学习中心
						</view>
					</view>
					<view @tap="goCode">
						<view class="thumb">
							<image src="/static/images/my_icon4.png" mode="widthFix"></image>
						</view>
						<view>
							分享码
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	export default {
		data() {
			return {
				master_info:"",
				master:'',
				tab:1,
				yulan: "https://www.lianhexiu.com.cn/static/api/images/master/lianhexiu.jpg",
			}
		},
		onShow() {
			this.master_info = app.globalData.master_info;
			if(app.isAuth()){
				this.initData();
			}
		},
		methods: {
			initData() {
				//请求异步ajax获取收入等参数
				this.request({
					url: interfaces.masterInfo,
					header: {
						token:this.master_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							this.master=res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},
			changeTab(tab){
				this.tab=tab;
			},
			//更换头像
			changeThumb(){
				var _this=this;
				wx.showModal({
					title: '提示',
					content: '更换头像？',
					success: function(res) {
						if (res.confirm) {
							wx.chooseImage({
								count: 1,
								sizeType: ["compressed"],
								sourceType: ["album", "camera"],
								success: function(e) {
									e.tempFilePaths;
									var t = e.tempFilePaths.length;
									_this.uploadDIY(e.tempFilePaths, 0, 0, 0, t);
								}
							});
						}
					}
				})
			},
			//参数一 e 数据源
			//参数二 t 成功success的数量
			//参数三 a 失败fail的数量
			//参数四 i 完成comlete的数量
			//参数五 n 要上传的图片数量
			//参数六 type 要上传哪个图片（身份证正面、反面或技能证书）
			uploadDIY: function(e, t, a, i, n) {
				var o = this,
					s = this;
				wx.uploadFile({
					url: interfaces.masterUploadThumb,
					filePath: e[i],
					name: "file",
					header: {
						'content-type': 'application/json',
						token: s.master_info.token
					},
					formData: {
						//token: s.master_info.token
					},
					success: function(e) {
						if(e.data){
							e.data=JSON.parse(e.data);
							t++;
							s.master.thumb = e.data;
						}else{
							wx.showToast({
								title: '上传头像失败',
								icon: "none",
							});
						}
					},
					fail: function(e) {
						a++;
					},
					complete: function() {
						++i == n ? wx.hideLoading() : o.uploadDIY(e, t, a, i, n);
					}
				});
			},
			tip() {
				wx.showToast({
					title: '功能未开放，敬请期待',
					icon: "none",
				});
			},

			//下载工单图片
			download() {
				wx.downloadFile({
					url: this.yulan,
					success: function(res) {
						//console.log(res);
						//图片保存到本地
						wx.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(data) {
								wx.showToast({
									title: '保存成功',
									icon: 'success',
									duration: 2000
								})
							},
							fail: function(err) {
								//console.log(err);
								if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
									wx.showModal({
										title: '提示',
										content: '只有授权成功才能使用此功能，是否手动开启授权？',
										success: (res) => {
											if (res.confirm) {
												wx.openSetting({
													success(settingdata) {
														console.log(settingdata)
														if (settingdata.authSetting['scope.writePhotosAlbum']) {
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
							},
							complete(res) {
								console.log(res);
							}
						})
					}
				})
			},
			
			//跳转分享码页面
			goCode(){
				wx.navigateTo({
					url: 'qrcode',
				})
			},
			//跳转我的团队页面
			goGroup(){
				wx.navigateTo({
					url: 'group',
				})
			},
			// 显示遮罩层
			// 下单工单
			showModal(url) {
				this.showModalStatus= true;
				this.yulan= url;
			},
			
			//跳转我的团队页面
			goStudy(){
				wx.navigateTo({
					url: '../study/article',
				})
			},
			
			//隐藏对话框并保存图片
			hideModal: function() {
				this.download();
				this.showModalStatus= false;
			},

			//隐藏对话框
			closeModal: function() {
				this.showModalStatus= false;
			},
			
			
		}
	}
</script>

<style lang="scss">
	// page{
		
	// }
	.main{
		background-image: linear-gradient(#DFECFF, #F6F6F6);
		padding: 0 15px 20px 15px;
		.info{
			display: flex;
			image{
				width: 60px;
				height: 60px;
				border-radius: 50%;
			}
			.right{
				margin-left: 10px;
				padding: 5px 0;
				line-height: 25px;
				.name{
					font-size: 16px;
				}
				.number{
					color: #676767;
				}
			}
		}
		.income{
			display: flex;
			justify-content: space-between;
			margin-top: 10px;
			.item{
				padding: 10px 0 10px 10px;
				width: calc(100% / 3 - 15px);
				background-color: #fff;
				//border: 1px #B1D0FF solid;
				border-radius: 10px;
				.one{
					color: #43A9FF;
				}
				.two{
					color: #FEA700;
				}
				.three{
					color: #FF5050;
				}
			}
		}
		.order{
			border-radius: 10px;
			background-color: #fff;
			padding: 10px 0;
			margin-top: 15px;
			.tab{
				width: 200px;
				display: flex;
				justify-content: space-between;
				margin: 5px auto;
				.item{
					width: 60px;
					border: 1px #919191 solid;
					color: #6A6A6A;
					height: 20px;
					line-height: 20px;
					border-radius: 10px;
					text-align: center;
				}
				.checked{
					background-color: #4688FF;
					color: #fff;
					border:1px #4688FF solid;
				}
			}
			.box{
				.item{
					display: flex;
					color: #6A6A6A;
					margin: 10px 10px;
					font-size: 16px;
					line-height: 25px;
					.title{
						width: 80px;
					}
					.speed{
						width: calc(100% - 120px);
					}
					.num{
						width: 60px;
						text-align: right;
					}
				}
			}
		}
		.line{
			width: 100%;
			padding-top: 15px;
			image{
				width: 100%;
			}
		}
		.skill{
			border-radius: 10px;
			background-color: #fff;
			padding: 10px 0;
			margin-top: 15px;
			.title{
				display: flex;
				justify-content: space-between;
				padding: 5px 10px;
				.name{
					font-size: 16px;
				}
			}
			.box{
				.name {
					background-color: #F2F2F2;
					padding: 0 10px;
					line-height: 30px;
					display: inline-block;
					border-radius: 10px;
					height: 30px;
					margin: 5px;
				}
			}	
		}
		.menu{
			background-color: #FFFFFF;
			border-radius: 10px;
			padding: 10px 0;
			margin-top: 15px;
			.title{
				font-size: 16px;
				padding-left: 10px;
			}
			.box{
				display: flex;
				justify-content: space-around;
				text-align: center;
				padding-top: 15px;
				padding-bottom: 10px;
				.thumb{
					image{
						width: 30px;
					}
				}
			}
		}
	}
	
	
</style>
