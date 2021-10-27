<template>
	<view>

		<view class='main'>
			<image :src='url' mode='widthFix' class='qrcode'></image>
			<button @tap='share'>保存图片到相册</button>
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
				url: '',
			}
		},
		onLoad() {
			if (app.globalData.master_info) {
				var token = app.globalData.master_info.token;
				this.request({
					url: interfaces.getQrcode,
					header: {
						token: token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							this.url = res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			} else {
				wx.redirectTo({
					url: '/pages/auth/index',
				})
			}
		},
		methods: {
			share() {
				var imgsrc = this.url;
				wx.downloadFile({
					url: imgsrc,
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

			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}

	.main {
		width: 100%;
	}

	.qrcode {
		width: 100%;
	}

	button {
		background: #03b3ff;
		color: #fff;
		margin-top: 20px;
		font-size: 16px;
		margin: 10px 15px;
	}
</style>
