const apiurl = 'https://www.lianhexiu.com.cn/lhxshifuapi/';

/*
调起微信支付
@param 支付订单ID,由订单ID在服务器端查询获得金额
*/
function pay(order_id) {
	uni.login({
		success: res => {
			//code 用于获取openID的条件之一
			var code = res.code;
			uni.request({
				url: apiurl + 'pay/pay',
				method: "POST",
				data: {
					order_id: order_id,
					code: code
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' // 默认值
				},
				success: function(res) { //后端返回的数据
					console.log(res);
					if (res.data.code == 200) {
						if (res.data.data == 'ok') {
							wx.redirectTo({
								url: '/pages/order/index?status=4'
							})
						} else {
							var data = res.data.data;
							wx.requestPayment({
								timeStamp: data['timeStamp'],
								nonceStr: data['nonceStr'],
								package: data['package'],
								signType: data['signType'],
								paySign: data['paySign'],
								success: function(res) {
									if(type==1){
										wx.redirectTo({
										  url: '/pages/customer/order/index?status=2'
										})
									}else{
										wx.redirectTo({
										  url: '/pages/customer/order/index?status=3'
										})
									}
									//console.log(res);
								},
								fail: function(res) {
									console.log(res);
									wx.redirectTo({
									  url: '/pages/mall/order/index?status=1'
									})
								}
							})
						}
					}
				}
			});
		}
	})
}

module.exports = {
	pay: pay
};
