<template>
	<view>
		<!-- 被抢订单的详情 -->
		<!-- <view class="tab">
			<view class="hover">订单信息</view>
		</view> -->

		<view class="content">
			<view class="nr">
				<view class="baoming">
					<view class="tradename">{{data.good_title}}</view>
					<view class="baoming_but">
						<button v-if='data.baoming'>已报名</button>
						<button @tap="baoming" v-else>立即报名</button>
					</view>
				</view>

				<view class="createtime">下单时间：{{data.create_time_txt}}</view>
				<view class="item">
					<view class="item_l">订单编号:</view>
					<view class="item_r">{{data.order_no}}</view>
				</view>
				<view class="item">
					<view class="item_l">联系人:</view>
					<view class="item_r">{{data.linkman}}</view>
				</view>
				<view class="item">
					<view class="item_l">门店名称:</view>
					<view class="item_r">{{data.storename}}</view>
				</view>
				<view class="item">
					<view class="item_l">服务地址:</view>
					<view class="item_r">{{data.position_address}}</view>
				</view>
				<view class="item" style="border-bottom: 1px #ddd solid;">
					<view class="item_l">详细地址:</view>
					<view class="item_r">{{data.address}}</view>
				</view>
				<view class="item" style="border-bottom: 1px #ddd solid;">
					<view class="item_l">预约时间:</view>
					<view class="item_r">{{data.customer_time}}</view>
				</view>
				<view class="item">
					<view class="item_l">报修故障:</view>
					<view class="item_r">{{data.remark}}</view>
				</view>
				<view class="item" style="border-bottom: 1px #ddd solid;">
					<view class="item_l">注意事项:</view>
					<view class="item_r">{{data.matter}}</view>
				</view>
				<view class="item" style="border-bottom: 1px #ddd solid;">
					<view class="item_l">
						<view>文件在线</view>
						<view>预览下载</view>
					</view>
					<view class="item_gongdan">
						<button @tap="showModal('https://www.lianhexiu.com.cn/static/api/images/master/lianhexiu.jpg')">下载联合修工单</button>
						<button @tap="showModal('https://www.lianhexiu.com.cn/static/api/images/master/400.jpg')">下载400工单</button>
					</view>
				</view>
				<view class="item_title" style="border:0;">报修图片:</view>
				<view class="pics">
					<view v-for="(item,index) in data.pics" :key='index'>
						<image :src="item" mode="aspectFit" @tap="preImage(item)"></image>
					</view>
				</view>
			</view>
		</view>

		<view class='dialog' v-if="showModalStatus">
			<view class="dialog_top">预览图片</view>
			<scroll-view scroll-y="true" class="dialog_main">
				<image :src="yulan" mode="widthFix"></image>
			</scroll-view>
			<view class='dialog_but'>
				<view class="dialog_but1" @tap="hideModal">保存到手机</view>
				<view class='dialog_but2' @tap="closeModal">关闭</view>
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
				data: [],
				id:0,
				showModalStatus:false,
				yulan:''
			}
		},
		onLoad(options) {
			this.id = options.id ? options.id : 0;
		},
		onShow() {
			if (app.globalData.isRequest == 1) {
				if (app.isAuth()) {
					this.master_info = app.globalData.master_info;
					this.detail();
				}
			} else {
				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 所以此处加入 callback 以防止这种情况
				app.isRequestCallback = isRequest => {
					if (isRequest == 1) {
						if (app.isAuth()) {
							this.master_info = app.globalData.master_info;
							this.detail();
						}
					}
				}
			}
		},
		methods: {
			//获取订单详情
			detail() {
				this.request({
					url: interfaces.orderQdDetail,
					data: {
						id: this.id,
					},
					header: {
						token: this.master_info.token,
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							res.data.create_time_txt = common.formatDT(res.data.create_time, 'yyyy.MM.dd h:m');
							res.data.pics = res.data.pics.split(",");	
							this.data=res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},
			//点击报修图片预览图片事件
			preImage(url) {
				uni.previewImage({
					current: url,
					urls: this.data.pics,
				})
			},

			//下载工单图片
			download(e) {
				uni.downloadFile({
					url: this.yulan,
					success: function(res) {
						//console.log(res);
						//图片保存到本地
						uni.saveImageToPhotosAlbum({
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

			showModal(url) {
				this.yulan=url;
				this.showModalStatus= true;	
			},

			//隐藏对话框并保存图片
			hideModal() {
				this.download();
				this.showModalStatus= false;
			},

			//隐藏对话框
			closeModal() {
				this.showModalStatus= false;
			},

			//切换菜单栏
			changetab(tab) {
				this.tab= tab;
			},

			baoming() {
				var id = this.id;
				var token = this.master_info.token;
				var _this=this;
				wx.showModal({
					title: '提示',
					content: '确定要报名此单吗？',
					success: res => {
						if (res.confirm) {
							_this.request({
								url: interfaces.orderBaoming,
								data: {
									id: id,
								},
								header: {
									token:token
								},
								method: 'POST',
								success: res => {
									console.log(res);
									if (res.code == 200) {
										uni.showToast({
											title: res.msg,
											icon: 'none',
											mask: true,
											complete: function() {
												setTimeout(function() {
													uni.navigateBack({
														delta: 1
													})
												}, 1500);
											}
										})
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

<style>
	.content {
		background-color: #fff;
		margin: 15px 10px 0 10px;
		border-radius: 10px;
	}

	.status {
		color: #666666;
		border-bottom: 1px #e8e8e8 solid;
		padding: 12px 10px;
		line-height: 30px;
		font-size: 18px;
	}

	.examine {
		color: #666666;
		border-bottom: 1px #e8e8e8 solid;
		padding: 12px 10px;
		display: flex;
		justify-content: space-between;
	}

	.examine_r {
		display: flex;
	}

	.examine_l {
		line-height: 30px;
		font-size: 18px;
	}

	.examine_r button {
		height: 30px;
		line-height: 30px;
		width: 80px;
		color: #fff;
		background-color: #159be4;
		margin-left: 5px;
		font-size: 13px;
	}

	.nr {
		padding: 10px;
	}

	.tradename {
		color: #333333;
		font-size: 36rpx;
		padding: 6px 0;
	}

	.createtime {
		color: #aaaaaa;
		font-size: 24rpx;
		padding-bottom: 5px;
	}

	.item {
		display: flex;
		line-height: 1.2;
		padding: 5px 0;
		font-size: 28rpx;
	}

	.item_l {
		width: 160rpx;
		color: #666666;
	}

	.item_r {
		width: calc(100% - 160rpx);
		color: #333333;
	}

	.box {
		padding-bottom: 15px;
	}

	.tip {
		text-align: center;
		padding: 15px 0;
	}

	.item_master {
		width: calc(100% - 160rpx);
		color: #333333;
		display: flex;
	}

	.item_master image {
		width: 10px;
		margin-left: 10px;
	}

	.price {
		display: flex;
		flex-wrap: wrap;
	}

	.price .item {
		width: 50%;
	}

	.nr_top {
		display: flex;
		justify-content: space-between;
	}

	.detail {
		padding: 6px 0;
	}



	.tab {
		color: #666666;
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
	}

	.tab view {
		width: 50%;
		text-align: center;
		padding: 10px 0;
	}

	.hover {
		color: #03b3ff;
		border-bottom: 1px #03b3ff solid;
	}

	.content {
		margin: 10px;
		border-radius: 10px;
		border: 1px #159be4 solid;
	}

	.item_title {
		padding: 5px 0;
		color: #666666;
		line-height: 1.2;
	}

	.pics {
		display: flex;
		background-color: #fff;
		align-items: center;
		flex-wrap: wrap;
	}

	.pics view {
		display: flex;
		position: relative;
		width: calc((750rpx - 50px) / 3 - 10px);
		height: calc((750rpx - 50px) / 3 - 10px);
		margin: 5px;
		justify-content: center;
	}

	.pics image {
		width: 100%;
		height: 100%;
	}

	.status {
		display: flex;
		justify-content: space-between;
		line-height: 30px;
		font-size: 18px;
	}

	.status button {
		height: 30px;
		line-height: 30px;
		width: 80px;
		color: #fff;
		background-color: #03b3ff;
	}


	.itempics {
		display: flex;
		background-color: #fff;
		margin-top: 10px;
		padding: 10px;
		justify-content: space-between;
		border-bottom: 1px #e5e5e5 solid;
	}

	.mpics {
		display: flex;
		flex-wrap: wrap;
		padding: 8px 5px;
		background-color: #fff;
		border-bottom: 1px #e5e5e5 solid;
	}

	.mpics view {
		width: calc((750rpx - 10px) / 3 - 10px);
		height: calc((750rpx - 10px) / 3 - 10px);
		margin: 5px;
	}

	.mpics image {
		width: 100%;
		height: 100%;
	}

	.mpics .addpics {
		position: relative;
		width: calc((750rpx - 10px) / 3 - 10px);
		height: calc((750rpx - 10px) / 3 - 10px);
		margin: 5px;
		border: 2px #eeeeee solid;
	}

	.mpics .addpics image {
		position: absolute;
		width: 50px;
		left: calc(50% - 25px);
	}

	.item_r textarea {
		line-height: 20px;
		padding: 5px;
		height: 80px;
		width: calc(100% - 20px);
	}

	.submit {
		padding-top: 10px;
	}

	.submit button {
		margin: 10px;
		font-size: 16px;
		color: #fff;
		background-color: #03b3ff;
	}

	.item {
		padding: 5px 0px;
		line-height: 1.5;
	}

	.item_gongdan {
		text-align: right;
	}

	.item_gongdan view {
		display: inline-block;
		text-decoration: underline;
		padding-left: 10px;
	}

	/* 底部弹出框样式 */
	.dialog {
		width: 70%;
		left: 50%;
		top: 15%;
		position: fixed;
		transform: translate(-50%, 0);
		background: #fff;
		border-radius: 10px;
		z-index: 999;
	}

	.dialog_top {
		background-color: #03b3ff;
		color: #fff;
		text-align: center;
		height: 30px;
		line-height: 30px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.dialog_main {
		padding: 10px 10px 5px 10px;
		box-sizing: border-box;
		line-height: 1.5;
		height: 600rpx;
	}

	.dialog_main image {
		width: 100%;
	}

	.dialog_but {
		color: #fff;
		position: relative;
		height: 70rpx;
		width: 100%;
		font-size: 30rpx;
		line-height: 70rpx;
		text-align: center;
		margin: 5px 0;
		display: flex;
	}

	.dialog_but1 {
		background-color: #03b3ff;
		height: 70rpx;
		width: 30%;
		margin: 5px 0 5px 15%;
		border-radius: 10rpx;
	}

	.dialog_but2 {
		background-color: #03b3ff;
		height: 70rpx;
		width: 30%;
		margin: 5px 0 5px 15%;
		border-radius: 10rpx;
	}

	.title {
		text-align: center;
		font-weight: bold;
		font-size: 18px;
		border-bottom: 1px #000 solid;
		line-height: 50px;
		margin: 0 5px;
	}

	.item_title {
		font-weight: bold;
		display: flex;
		line-height: 35px;
		border-bottom: 1px #000 solid;
		text-align: center;
	}

	.item_nr {
		display: flex;
		border-bottom: 1px #000 solid;
	}

	.item1 {
		width: calc(25% - 1px);
		text-align: center;
		border-right: 1px #000 solid;
	}

	.item2 {
		width: calc(25% - 1px);
		border-right: 1px #000 solid;
	}

	.item3 {
		width: calc(15% - 1px);
		border-right: 1px #000 solid;
	}

	.item4 {
		width: calc(15% - 1px);
		border-right: 1px #000 solid;
	}

	.item5 {
		width: 20%;
		text-align: center;
	}

	.rgf {
		line-height: 105px;
		text-align: center;
	}

	.parts {
		line-height: 105px;
		text-align: center;
	}

	.other {
		line-height: 70px;
		text-align: center;
	}

	input {
		/* border: 1px #ccc solid; */
		height: 30px;
		margin: 2px 0;
		padding-left: 3px;
	}

	.item2 input {
		width: calc(100% - 15px);
		margin-left: 5px;
	}

	.item3 input {
		width: calc(100% - 15px);
		margin-left: 5px;
	}

	.item4 input {
		width: calc(100% - 15px);
		margin-left: 5px;
	}

	.item_total {
		display: flex;
		border-bottom: 1px #000 solid;
		line-height: 35px;
	}

	.box {
		border-left: 1px #000 solid;
		border-right: 1px #000 solid;
		margin: 0 5px;
		padding: 0;
	}

	.total {
		padding-left: 10px;
	}

	.zhusu {
		padding-left: 5px;
	}

	.zhusu input {
		width: 60px;
	}

	.remark_title {
		line-height: 30px;
	}

	.item_remark {
		padding: 10px;
		border-bottom: 1px #000 solid;
	}

	.remark {
		line-height: 25px;
	}

	.item_gongdan {
		display: flex;
	}

	.item_gongdan button {
		background-color: #159be4;
		font-size: 13px;
		margin-left: 10px;
		color: #fff;
		padding: 0 5px;
		line-height: 3;
	}

	.item_l {
		color: #090909;
		font-weight: bold;
	}

	.tradename {
		font-weight: bold;
	}

	.item_r {
		color: #1f1f1f;
	}

	.tab1,
	.tab2 {
		font-weight: bold;
	}

	.hover {
		color: #159be4;
		border-bottom: 1px #159be4 solid;
	}

	.tab2 view {
		width: 50%;
	}

	.baoming {
		display: flex;
		justify-content: space-between;
	}

	.baoming_but button {
		height: 30px;
		line-height: 30px;
		width: 80px;
		color: #fff;
		background-color: #159be4;
		margin-left: 5px;
		font-size: 13px;
	}
</style>
