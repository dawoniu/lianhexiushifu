<template>
	<view>
		<view class="box">
			<view class="tip">
				<view class="title">
					报价说明
				</view>
				<view class="content">
					<view class="item">
						<view class="icon"></view>
						<view class="right">此报价不含办证费</view>
					</view>
					<view class="item">
						<view class="icon"></view>
						<view class="right">此报价位一次性施工费、不含辅材费、搬运费、卸货费、仅为到场 安装施工费用</view>
					</view>
					<view class="item">
						<view class="icon"></view>
						<view class="right">师傅按照约定时间到达现场但无法安装，且非师傅原因导致误工/第二次施工/加急，则产生误工/第二次施工/加急得额外费用按照《联合修报价参考表》，单独核算</view>
					</view>
					<view class="item">
						<view class="icon"></view>
						<view class="right">以上最终解释权归联合修所有</view>
					</view>
				</view>
			</view>
			
			<view class="cost">
				<view class="title">
					<view class="left">
						基本费用
					</view>
					<view class="right">
						{{data.order.b_price}}元
					</view>
				</view>
			</view>
			
			<view class="cost">
				<view class="title">
					<view class="left">
						额外费用
					</view>
					<view class="right">
						{{data.order.o_price}}元
					</view>
				</view>
				<view class="item" v-for="(item,index) in data.offer" :key="index">
					<view class="other_l">
						<view class="name">
							费用名称：{{item.name}}
						</view>
						<view class="price">
							价格：{{item.price}}元
						</view>
						<view class="num">
							<!-- 数量：3个 -->
						</view>
					</view>
					<view class="other_r" @tap="del(item.id)">删除</view>
				</view>
			</view>

			<view class="cost">
				<view class="total">
					<view class="left">
						合计
					</view>
					<view class="right">
						{{data.order.total_price}}元
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
				master_info: '',
				data:[],
				id: 0,
			}
		},
		onLoad(options) {
			this.id = options.id ? options.id : 0;
		},
		onShow() {
			this.master_info = app.globalData.master_info;
			if (this.master_info) {
				this.initData();
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
					url: interfaces.orderPtBill,
					data: {
						id: this.id,
					},
					header: {
						token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						//console.log(res);
						if (res.code == 200) {
							this.data=res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},
			del(id){
				var _this=this;
				wx.showModal({
					title: '提示',
					content: '确认删除该项？',
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: interfaces.orderPtDelOffer,
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
			}
		}
	}
</script>

<style lang="scss">
	.box{
		padding: 0 10px;
		margin-bottom: 20px;
		.tip{
			font-size: 12px;
			.title{
				color: #257AFA;
				font-size: 16px;
				padding-bottom: 10px;
			}
			.content{
				line-height: 20px;
				.item{
					display: flex;
					justify-content: space-between;
					.icon{
						background-color: #257AFA;
						width: 10px;
						height: 10px;
						border-radius: 50%;
						margin-top: 5px;
					}
					.right{
						width: calc(100% - 15px);
					}
				}
			}
		}
		.cost{
			padding: 10px 10px;
			box-shadow: 0 0 16px #ccc;
			margin-top: 10px;
			border-radius: 10px;
			.title{
				display: flex;
				justify-content: space-between;
				font-size: 16px;
				line-height: 30px;
				.left{
					font-size: 16px;
				}
				.right{
					color: #257AFA;
				}
			}
			.item{
				display: flex;
				justify-content: space-between;
				padding: 5px 0;
				.other_l{
					display: flex;
					flex-wrap: wrap;
					.name{
						width: 100%;
					}
					.price{
						padding-right: 15px;
					}
				}
				.other_r{
					width: 40px;
					text-align: right;
					color: #f00;
				}
						
			}
			.total{
				font-size: 16px;
				display: flex;
				justify-content: space-between;
				color: #E37700;
				line-height: 30px;
			}
		}
	}
	
	
	
</style>