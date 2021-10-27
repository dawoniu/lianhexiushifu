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
		<view class="main">
			<block v-if="sum>0">
			<view class="store" v-for="(item,index) in list" :key="index" @tap="goDetail(item.id)">
				<view class="title">
					<view v-if="item.type == 1">一口价订单</view>
					<view v-if="item.type == 2">报价订单</view>
				</view>
				<view class="name">
					<view>{{item.categ_name}}</view>
					<view>{{item.customer_time}}</view>
					<view>></view>
				</view>
				<view class="address">
					<view class="icon"><image src="../../static/images/address_position.png" mode="widthFix"></image></view>
					<view>{{item.position_address}}</view>
				</view>
				<view class="foot">
					<view class="left" v-if="item.baoming==1">已申请</view>
					<view class="left" v-else>待抢单</view>
					<view class="right" @tap="goDetail(item.id)">查看详情</view>
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
		


	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	export default {
		data() {
			return {
				tab:{
					name:["最新订单","一口价","报价"],
					value:["new","1","2"]
				},
				tab_index:0,
				master_info: '',
				tip: '',
				sum: 0,
				list: [],
				page: 1,
				complete: true,
			}
		},
		onLoad(options) {
			this.type=options.type?options.type:0;
			this.tab_index=this.type;
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
			tabChange(e) {
				this.tab_index=e.detail.value;
				this.type=this.tab.value[this.tab_index];
				this.loadData(1);
			},
			loadData(page) {
				this.request({
					url: interfaces.orderHall,
					data: {
						page: page,
						type: this.type
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
								if (res.data.length < res.num) {
									this.complete = true;
									this.tip = '数据已全部加载，暂无其他数据';
								} else {
									this.complete = false;
									this.tip = '上拉加载更多';
								}
				
								for (var k in res.data) {
									res.data[k].create_time_txt = common.formatDT(res.data[k].create_time, 'yyyy.MM.dd h:m');
								}
				
								this.list = this.list.concat(res.data);
								this.page = page;
				
				
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
			//跳转订单详情页
			goDetail(id) {
				wx.navigateTo({
					url: 'halldetail?id=' + id,
				})
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
	.tab{
		background-color: #257AFA;
		line-height: 50px;
		color: #fff;
		padding-left: 15px;
		position: fixed;
		top: 0;
		width: 100%;
		.picker{
			display: flex;
			image{
				width: 18px;
				padding-left: 10px;
				padding-top: 15px;
			}
		}
	}
	.main{
		margin-top: 65px;
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
	}
	
</style>
