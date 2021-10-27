const domain = "https://www.lianhexiu.com.cn/lhxshifuapi/";
const interfaces = {
	//首页抢单大厅数据
	initIndex:domain+"index/index",
	//更改接单状态
	autoOrder:domain+"master/auto",
	//师傅接单连锁店的订单
	orderLsStart: domain + 'order/lsstart',
	//接单大厅
	orderHall: domain + 'order/hall',
	//初始化师傅认证页面
	initReg: domain + 'master/initreg',
	//师傅注册页面上传图片
	masterUpload: domain + "master/upload",
	//根据id获取地区数组
	getArea: domain + "master/getarea",
	// 根据地区id获取省市区详细信息
	masterAddress:domain+"master/address",
	//师傅认证
	masterReg: domain + "master/reg",
	//普通客户订单列表
	orderPtList:domain+"order/orderptlist",
	//师傅确认完工连锁店订单
	orderLsFinish:domain+"order/lsfinish",
	//师傅确认完工普通客户订单
	orderPtFinish:domain+"order/ptfinish",
	//师傅对普通客户订单增加费用
	orderAddOffer:domain+"order/ptaddoffer",
	//师傅报名抢单
	orderBaoMing:domain+"order/ptbaoming",
	//普通客户订单的明细
	orderPtBill:domain+"order/ptbill",
	//连锁店客户订单的明细
	orderLsBill:domain+"order/lsbill",
	//连锁店客户的订单列表
	orderLsList:domain+"order/orderlslist",
	//普通客户的订单详情
	orderPtDetail: domain + "order/ptdetail",
	//普通客户的抢单大厅的订单详情
	orderHallDetail: domain + "order/halldetail",
	//连锁店的订单详情
	orderLsDetail: domain + "order/lsdetail",
	//我的页面师傅数据
	masterInfo:domain+"master/info",
	//删除普通客户额外报价项
	orderPtDelOffer:domain+"order/ptdeloffer",
	//师傅我的页面上传头像
	masterUploadThumb: domain + "master/uploadthumb",
	//维修图片初始化
	orderPicsDetail: domain + "order/picsdetail",
	//师傅我上传维修图片
	orderEditPics: domain + "order/uploadpics",
	//获取师傅分享二维码
	getQrcode:domain+"qrcode/getqrcode",
	//我的团队
	masterGroup:domain+"master/group",
	//学习中心-文章列表
	studyArticle:domain+"study/article",
	//学习中心-文章详情
	studyArticleDetail:domain+"study/articledetail",
	
	
	
	
}
module.exports = interfaces;
