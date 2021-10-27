<template>
	<view>
		<view class="box">
			<form @submit="formSubmit">
				<view class="title">
					<view class="left">维修描述</view>
				</view>
				<view class="nr">
					<textarea placeholder="请填写维修描述" :value="repair_desc" name="repair_desc"></textarea>
				</view>
				<view class="title">
					<view class="left">签到照片</view>
					<view>{{img_num[0]}}/6</view>
				</view>
				<view class="mpics">
					<view v-for="(item,index) in report_pic" :key="index">
						<image :src="item" mode="aspectFit"></image>
					</view>
					<view class="addpics" @tap="choosePic(1,6)">
						<image src="/static/images/upload.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="title">
					<view class="left">维修前照片</view>
					<view>{{img_num[1]}}/6</view>
				</view>
				<view class="mpics">
					<view v-for="(item,index) in before_repair_pic" :key="index">
						<image :src="item" mode="aspectFit"></image>
					</view>
					<view class="addpics" @tap="choosePic(2,6)">
						<image src="/static/images/upload.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="title">
					<view class="left">维修后照片</view>
					<view>{{img_num[2]}}/6</view>
				</view>
				<view class="mpics">
					<view v-for="(item,index) in after_repair_pic" :key="index">
						<image :src="item" mode="aspectFit"></image>
					</view>
					<view class="addpics" @tap="choosePic(3,6)">
						<image src="/static/images/upload.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="title">
					<view class="left">更换配件照片</view>
					<view>{{img_num[3]}}/6</view>
				</view>
				<view class="mpics">
					<view v-for="(item,index) in parts_pic" :key="index">
						<image :src="item" mode="aspectFit"></image>
					</view>
					<view class="addpics" @tap="choosePic(4,6)">
						<image src="/static/images/upload.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="title">
					<view class="left">工单照片</view>
					<view>{{img_num[4]}}/6</view>
				</view>
				<view class="mpics">
					<view v-for="(item,index) in work_pic" :key="index">
						<image :src="item" mode="aspectFit"></image>
					</view>
					<view class="addpics" @tap="choosePic(5,6)">
						<image src="/static/images/upload.png" mode="aspectFit"></image>
					</view>
				</view>
				`
				<view class="submit"><button formType="submit">保存</button></view>
			</form>
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
				id: 0,
				role: 0,
				repair_desc: '',
				report_pic: [],
				before_repair_pic: [],
				after_repair_pic: [],
				parts_pic: [],
				work_pic: [],
				img_num: [
					0, 0, 0, 0, 0
				],
			}
		},
		onLoad(options) {
			this.id = options.id ? options.id : 0;
			this.role = options.role ? options.role : 0;
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
			initData() {
				this.request({
					url: interfaces.orderPicsDetail,
					data: {
						id: this.id,
						role: this.role
					},
					header: {
						token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						if (res.code == 200) {

							if (res.data.report_pic != '') {
								this.report_pic = res.data.report_pic.split(",");
							}

							if (res.data.before_repair_pic != '') {
								this.before_repair_pic = res.data.before_repair_pic.split(",");
							}

							if (res.data.after_repair_pic != '') {
								this.after_repair_pic = res.data.after_repair_pic.split(",");
							}

							if (res.data.parts_pic != '') {
								this.parts_pic = res.data.parts_pic.split(",");
							}

							if (res.data.work_pic != '') {
								this.work_pic = res.data.work_pic.split(",");
							}
							
							
							this.repair_desc = res.data.repair_desc;

						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},

			choosePic(index,count) {
				var a = this;
				wx.chooseImage({
					count: count,
					sizeType: ["compressed"],
					sourceType: ["album", "camera"],
					success: function(e) {
						e.tempFilePaths;
						var t = e.tempFilePaths.length;
						a.uploadDIY(e.tempFilePaths, 0, 0, 0, t, index);
					}
				});
			},

			//参数一 e 数据源
			//参数二 t 成功success的数量
			//参数三 a 失败fail的数量
			//参数四 i 完成comlete的数量
			//参数五 n 要上传的图片数量
			uploadDIY: function(e, t, a, i, n, index) {
				var o = this,
					s = this;

				wx.uploadFile({
					url: interfaces.masterUpload,
					filePath: e[i],
					name: "file",
					header: {
						'content-type': 'application/json'
					},
					formData: {
						token: s.master_info.token
					},
					success: function(e) {
						e.data=JSON.parse(e.data);
						if (index == 1) {
							s.img_num[index-1] = s.report_pic.length + 1;
							t++;
							s.report_pic.push(e.data);						
						} else if (index == 2) {
							s.img_num[index-1] = s.before_repair_pic.length + 1;
							t++;
							s.before_repair_pic.push(e.data);	
						} else if (index == 3) {  
							s.img_num[index-1] = s.after_repair_pic.length + 1;
							t++;
							s.after_repair_pic.push(e.data);
						} else if (index == 4) {
							s.img_num[index-1] = s.parts_pic.length + 1;
							t++;
							s.parts_pic.push(e.data);
						} else if (index == 5) {
							s.img_num[index-1]  = s.work_pic.length + 1;
							t++;
							s.work_pic.push(e.data);
						}
					},
					fail: function(e) {
						a++;
					},
					complete: function() {
						++i == n ? wx.hideLoading() : o.uploadDIY(e, t, a, i, n, tp);
					}
				});
			},
			//表单提交事件
			formSubmit(e){
				var data = e.detail.value;
				var report_pic=this.report_pic;
				var before_repair_pic=this.before_repair_pic;
				var after_repair_pic=this.after_repair_pic;
				var parts_pic=this.parts_pic;
				var work_pic=this.work_pic;
				
				data.report_pic=report_pic.join(",");
				data.before_repair_pic= before_repair_pic.join(",");
				data.after_repair_pic= after_repair_pic.join(",");
				data.parts_pic= parts_pic.join(",");
				data.work_pic= work_pic.join(",");
				data.role=this.role;
				data.id=this.id;
				//console.log(data);
				this.request({
					url: interfaces.orderEditPics,
					data: data,
					header: {
						token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							wx.showToast({
								title: res.msg,
								icon: 'none'
							})
							setTimeout(function() {
								wx.navigateBack({
									delta: 1
								})
							}, 1500);
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},

		},
	}
</script>

<style lang="scss">
	.box {
		padding: 10px;
	}

	.title {
		display: flex;
		justify-content: space-between;
		padding-top: 10px;
		.left {
			color: #090909;
			font-weight: bold;
		}
	}

	.nr textarea {
		line-height: 20px;
		padding: 10px 0;
		height: 80px;
		width: 100%;
	}

	.mpics {
		display: flex;
		flex-wrap: wrap;
		padding: 8px 0;
		border-bottom: 1px #e5e5e5 solid;
	}

	.mpics view {
		width: calc((750rpx - 20px) / 3 - 10px);
		height: calc((750rpx - 20px) / 3 - 10px);
		margin: 5px;
	}

	.mpics image {
		width: 100%;
		height: 100%;
	}

	.mpics .addpics {
		position: relative;
		width: calc((750rpx - 20px) / 3 - 14px);
		height: calc((750rpx - 20px) / 3 - 14px);
		margin: 5px;
		border: 2px #eeeeee solid;
	}

	.mpics .addpics image {
		position: absolute;
		width: 50px;
		left: calc(50% - 25px);
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
</style>
