<template>
	<view>	
		<view class="tab">
			<picker @change="tabChange" :range="tab.name">
				<view class="picker">
					<view>
						{{tab.name[tab_index]}}
					</view>
					<view>
						<image src="../../static/images/xiala.png" mode="widthFix"></image>
					</view>
				</view>
			</picker>
		</view>
		<view class="order">
			<block v-if="sum>0">
			<view class="box" v-for="(item,index) in list" :key="index" @tap="goDetail(item.id)">
				<view class="title" v-if="item.type==1">一口价订单</view>
				<view class="title" v-else>报价订单</view>
				<view class="main">
					<view class="top">
						<view class="name">
							{{item.categ_name}}
						</view>
						<view class="top_right">
							<view v-if="item.status==0">
								待审核
							</view>
							<view v-else-if="item.status==1">
								已发布
							</view>
							<view v-else-if="item.status==2">
								已接单
							</view>
							<view v-else-if="item.status==3">
								待付款
							</view>
							<view v-else-if="item.status==4">
								待评价
							</view>
							<view v-else-if="item.status==5">
								已完成
							</view>
							<view v-else-if="item.status==9">
								已取消
							</view>
							<!-- <view class="entry">
								<image src="../../static/images/blue_entry.png" mode="widthFix"></image>
							</view> -->
						</view>
					</view>
					
					<view class="time">
						<view class="icon">
							<image src="../../static/images/time.png" mode="widthFix"></image>
						</view>
						<view class="content">
							{{item.customer_time}}
						</view>
						<view class="price">
							￥{{item.total_price}}
						</view>
					</view>
					<view class="item">
						<view class="icon">
							<image src="../../static/images/order_people.png" mode="widthFix"></image>
						</view>
						<view class="content">
							{{item.linkman}} | {{item.mobile}}
						</view>
					</view>
					<view class="item">
						<view class="icon">
							<image src="../../static/images/order_position.png" mode="widthFix"></image>
						</view>
						<view class="content">
							{{item.position_address}}
						</view>
					</view>
					<view class="line"></view>
					<view class="gz">故障描述</view>
					<view class="desc">{{item.remark}}</view>
				</view>
				
				<view class="foot">
					<view class="blue" @tap.stop="goStore(index)" v-if="item.status>1&&item.status<9">开始导航</view>
					<view class="blue" @tap.stop="finish(item.id)" v-if="item.status==2">确认完工</view>
					<view class="while" @tap.stop="add(index)" v-if="item.status<3">增加报价</view>
					<view class="while" @tap.stop="callPhone(item.mobile)">电话联系</view>
				</view>
			</view>
			</block>
			<block v-else>
				
				<view class="empty">
					<image src="../../static/images/empty.png" mode="widthFix"></image>
					您还没有订单噢
				</view>
				
			</block>
		</view>
		
		<pop ref="pop" :direction="direction" :is_close="true" :is_mask="true" :width="80">
			<form @submit="formSubmit">
				<view class="dialog">
					<view class="yk">
						<view class="name">费用名称：</view>
						<view class="price">
							<input placeholder="请输入费用名称" name="name" />
						</view>
					</view>
					<view class="yk">
						<view class="name">填写价格：</view>
						<view class="price">
							<input type="number" placeholder="请输入价格" name="price" />
						</view>
					</view>
					<view class="sub">
						<button formType="submit" type="default">确定</button>
					</view>
				</view>
			</form>
		</pop>
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	//弹窗
	import pop from "@/components/ming-pop.vue";
	var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
	var qqmapsdk;
	export default {
		components:{
			pop
		},
		data() {
			return {
				tab:{
					name:["最新订单","待审核","已发布","已接单","待付款","待评价","已完成","已取消"],
					value:["new","0","1","2","3","4","5","9"]
				},
				tab_index:0,
				master_info: '',
				tip: '',
				sum: 0,
				list: [],
				page: 1,
				complete: true,
				//弹窗位置，默认上方
				direction: "up",
				//切换一口价或者报价下单的订单索引index
				price_index:0,
				mapCtx: '',
			}
		},
		onReady() {
			//console.log(1);
			this.mapCtx = wx.createMapContext('myMap')
		},
		onShow() {
			this.master_info = app.globalData.master_info;
			if(app.isAuth()){
				this.loadData(1);
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
		 	if (!this.complete) {
		 		this.page++;
		 		this.loadData(this.page);
			}
		},
		methods: {
			//拨打客户电话
			callPhone(n) {
				wx.makePhoneCall({
					phoneNumber: n
				});
			},
			//获取数据
			loadData(page) {
				var status= this.tab.value[this.tab_index];
				this.request({
					url: interfaces.orderPtList,
					data: {
						page: page,
						status: status
					},
					header: {
						token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							
							if (page == 1) {
								this.list = [];
							}

							this.sum=res.sum;

							if (!common.isBlank(res.data)) {
					
								this.list = this.list.concat(res.data);
								this.page = page;

								if (this.list.length >= res.sum) {
									this.complete = true;
									this.tip = '数据已全部加载，暂无其他数据';
								} else {
									this.complete = false;
									this.tip = '上拉加载更多';
								}
								
							} else {
								this.complete = true;
								this.tip = '数据已全部加载，暂无其他数据';
							}
							
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},
			tabChange(e) {
				this.tab_index=e.detail.value;
				this.loadData(1);
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
										_this.loadData(1);
									} else {
										app.isLogin(res.code, res.msg);
									}
								}
							})
						}
					}
				})
			},
			
			//弹出新增报价框
			add(index){
				this.open('center');
				this.price_index=index;
			},
			
			//表单提交事件，报价下单改为一口价下单，或者一口价下单修改价格
			formSubmit(e) {
				var _this = this;
				var data = e.detail.value;
				data.order_no=this.list[this.price_index].order_no;
				if (data.name=='') {
					wx.showToast({
						title: '请输入费用名称',
						icon: "none",
					});
					return;
				}
				if (!data.price >0) {
					wx.showToast({
						title: '请输入正确的价格',
						icon: "none",
					});
					return;
				}
				//console.log(data);
				this.request({
					url: interfaces.orderAddOffer,
					data: data,
					header: {
						token: _this.master_info.token
					},
					method: 'POST',
					success: res => {
						if (res.code == 200) {
							wx.showToast({
								title: res.msg,
								icon: 'success'
							})
							this.list[this.price_index].total_price=res.data;
							this.$refs.pop.close();
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},
			
			//跳转订单详情页
			goDetail(id) {
				wx.navigateTo({
					url: 'ptdetail?id=' + id,
				})
			},
			
			//弹窗组件
			open(direction) {
				this.direction = direction;
				//打开弹窗
				this.$refs.pop.show();
			},
			//打开地图导航
			goStore(index){
				var _this = this;
				// 实例化API核心类
				qqmapsdk = new QQMapWX({
					key: 'WCYBZ-EWVC4-CC3U2-DZGZI-UWGK2-E2BMM'
				});
				wx.getLocation({
					type: 'gcj02',
					success: res => {
						wx.openLocation({
							latitude: Number(_this.list[index].latitude),
							longitude: Number(_this.list[index].longitude),
							scale: 16,
							name: _this.list[index].position_address //打开后显示的地址名称
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
	.empty{
		width: 70%;
		padding-top: 70px;
		margin: 0 auto;
		text-align: center;
		color: #64A4FF;
		font-size: 14px;
		image{
			width: 100%;
		};
	}
	.dialog{
		padding-top: 20px;
	}
	.yk{
		display: flex;
		padding-top: 20px;
		line-height: 20px;
		height: 20px;
		.name{
			width: 80px;
		}
		.price{
			width: calc(100% - 80px);
			input{
				line-height: 20px;
				height: 20px;
			}
		}
	}
	.sub{
		padding-top: 50px;
		button{
			background-color: #257AFA;
			color: #fff;
			height: 40px;
			line-height: 40px;
			border-radius: 20px;
			width: 150px;
			font-size: 14px;
		}
	}
	.tab{
		background-color: #257AFA;
		line-height: 50px;
		color: #fff;
		padding-left: 15px;
		.picker{
			display: flex;
			image{
				width: 18px;
				padding-left: 10px;
				padding-top: 15px;
			}
		}
	}
	.order{
		margin-bottom: 15px;
		.box{
			margin: 15px 15px 0 15px;
			box-shadow:0 0 9px 3px #ccc;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			.title{
				background-color: #FFF5D3;
				color: #B5A15C;
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				font-size: 16px;
				line-height: 40px;
				padding-left: 10px;
			}
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
						display: flex;
						color: #DD6800;
						.entry{
							width: 6px;
							padding-left: 5px;
							image{
								width: 100%;
								padding-top: 4px;
							}
						}
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
						width: calc(100% - 30px - 65px);
					}
					.price{
						width: 65px;
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
				.gz{
					color: #257AFA;
					font-size: 16px;
					padding: 10px 0;
				}
				.desc{
					color: #676767;
					padding-bottom:10px;
				}
			}
			.foot{
				height: 50px;
				view{
					float: right;
					height: 30px;
					border-radius: 15px;
					line-height: 30px;
					width: 20%;
					text-align: center;
					margin-right: 8px;
				}
				.while{
					border: 1px #257AFA solid;
					color: #257AFA;
					background-color: #fff;
				}
				.blue{
					border: 1px #257AFA solid;
					background-color: #257AFA;
					color: #fff;
				}
			}
		}
	}
	
</style>
