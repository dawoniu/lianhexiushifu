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
			
			<block v-for="(item,index) in data.offer" :key="index" v-if="item.type == 1">
			<view class="cost">
				<view class="title">
					<view class="left">
						人工费
					</view>
					<view class="right">
						{{item.total}}元
					</view>
				</view>
				<view class="item">
					<view class="name">
						费用名称：{{item.name}}
					</view>
					<view class="price">
						价格：{{item.price}}元
					</view>
					<view class="num">
						数量：{{item.num}}个
					</view>
				</view>
			</view>
			</block>
			
			<view class="cost">
				<view class="title">
					<view class="left">
						其他费用
					</view>
					<view class="right">
						{{data.order.other_price}}元
					</view>
				</view>
				<view class="item" v-for="(item,index) in data.offer" :key="index" v-if="item.type>1">
					<view class="name">
						费用名称：{{item.name}}
					</view>
					<view class="price">
						价格：{{item.price}}元
					</view>
					<view class="num">
						数量：{{item.num}}个
					</view>
				</view>
			</view>

			<view class="cost">
				<view class="total">
					<view class="left">
						合计
					</view>
					<view class="right">
						{{data.order.m_total_price}}元
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
			//this.id=794;
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
			//初始化订单费用明细数据
			initData(){
				this.request({
					url: interfaces.orderLsBill,
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
							this.data=res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},
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
				flex-wrap: wrap;
				padding: 5px 0;
				.name{
					width: 100%;
				}
				.price{
					padding-right: 15px;
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