<script>
	var handleLogin = require("utils/handleLogin.js");
	export default {
		globalData: {
			isRequest: 0,
			master_info: '',
			serviceadr: ''
		},
		//判断是否需要登录
		isLogin: function(code, msg) {
			uni.showToast({
				title: msg,
				icon: 'none',
				mask: true,
				complete: function() {
					setTimeout(function() {
						if (code < 0) {
							wx.navigateTo({
								url: '/pages/auth/index',
							})
						}
					}, 1500)
				}
			})
		},

		//判断是否登录，如果登录后的状态对应操作。
		isAuth: function() {
			var master_info = this.globalData.master_info;
			console.log(master_info);
			if (master_info) {
				console.log(11);
				if (master_info.status == 0) {
					console.log(55);
					uni.showToast({
						title: "请先注册成师傅",
						icon: 'none',
						mask: true,
						duration: 1500,
						complete: function() {
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/reg/index',
								})
							}, 1500);
						}
					})
				}else if(master_info.status==1){
					console.log(66);
					uni.showToast({
						title: "请等待审核通过",
						icon: 'none',
						mask: true,
						duration: 1500,
						complete: function() {
							setTimeout(function() {
								uni.switchTab({
									url:'/pages/index/index'
								})
							}, 1500);
						}
					})
				}else if (master_info.status == 2) {
					console.log(77);
					uni.showToast({
						title: "您的资料审核不通过，请重新申请！",
						icon: 'none',
						mask: true,
						duration: 1500,
						complete: function() {
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/reg/index',
								})
							}, 1500);
						}
					})
				}else if (master_info.status == 3) {
					console.log(77);
					uni.showToast({
						title: "您的账号已被禁用，请联系管理员！",
						icon: 'none',
						mask: true,
						duration: 1500,
						complete: function() {
							setTimeout(function() {
								uni.switchTab({
									url:'/pages/index/index'
								})
							}, 1500);
						}
					})
				}else{
					console.log(33);
					return true;
				}
			}else {
				console.log(22);
				wx.reLaunch({
					url: '/pages/auth/index',
				})
			}
		},

		onLaunch: function() {
			handleLogin.login(this.$scope);
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("static/icon/iconfont.css");

	page {
		
		color: #000;
		font-size: 28rpx;
	}
</style>
