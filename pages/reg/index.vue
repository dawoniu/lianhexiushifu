<template>
	<view>
		<view :hidden="show_adr">
			<!--师傅注册-->
			<form @submit="formSubmit">
				<view class="box">
					<view class="item">
						<view class="left">昵称</view>
						<view class="right"><input placeholder="填写昵称" name="nickname"></input></view>
					</view>
					<view class="item">
						<view class="left">姓名</view>
						<view class="right"><input placeholder="填写您的姓名" name="realname"></input></view>
					</view>
					<view class="item">
						<view class="left">身份证号</view>
						<view class="right"><input placeholder="请输入身份证号码" name="idcard"></input></view>
					</view>
					<view class="item">
						<view class="left">年龄</view>
						<view class="right"><input placeholder="请输入年龄" name="age" type="number"></input></view>
					</view>
					<view class="item">
						<view class="left">性别</view>
						<view class="right">
							<radio-group class="radio-group" name="sex">
								<radio value="1" checked="true" color="#159be4">
									<text>男</text>
								</radio>
								<radio class="radio" color="#159be4" value="2">
									<text>女</text>
								</radio>
							</radio-group>
						</view>
					</view>
					<view class="item">
						<view class="left">联系电话</view>
						<view class="right"><input placeholder="请填写您的联系电话" type="number" name="mobile"></input></view>
					</view>
					<view class="item">
						<view class="left">开户行</view>
						<view class="right"><input placeholder="请填写您的维修费用收取开户行" name="bank"></input></view>
					</view>
					<view class="item">
						<view class="left">开户人</view>
						<view class="right"><input placeholder="请填写您的维修费用收取开户人姓名" name="owner"></input></view>
					</view>
					<view class="item">
						<view class="left">银行卡号</view>
						<view class="right"><input placeholder="请填写您的维修费用收取银行卡号" name="bankcard"></input></view>
					</view>
					<view class="item between" v-if="service_area_id==0">
						<view class="left">服务区域</view>
						<view class="select" @tap="goSelect">去选择服务区域</view>
					</view>
					<view class="item" v-else>
						<view class="left">服务区域</view>
						<view class="mid">{{service_area_name}}</view>
						<view class="entry" @tap="goSelect">></view>
					</view>
					<view class="item between" v-if="position_area_id==0">
						<view class="left">联系地址</view>
						<view class="getadr" @tap="open_map">获取地址</view>
					</view>
					<view class="item" v-else>
						<view class="left">联系地址</view>
						<view class="mid">{{address}}</view>
						<view class="entry" @tap="open_map">></view>
					</view>
					<view class="item">
						<view class="left">个人描述</view>
						<view class="right">
							<textarea placeholder="请填写您的个人描述" name="desc"></textarea>
						</view>
					</view>
				</view>
				<view class="title">选择技能类型</view>
				<view class="box">
					<view class="tip">
						勾选您可以提供得服务类型（多选）
					</view>
					<view class="service">
						<view :class="[item.selected==1 ? 'skill selected' : 'skill']" v-for="(item,index) in data.categ" :key="index" @tap="changeSelect(index)">{{item.name}}</view>
					</view>
				</view>

				<view class="title">上传身份证</view>
				<view class="idcard">
					<view @tap="choosePic(1)">
						<image v-if='idcard1' :src="idcard1" mode="aspectFit"></image>
						<text v-else>正面</text>
						<input name="idcard1" hidden="true" :value="idcard1"></input>
					</view>
					<view @tap="choosePic(2)">
						<image v-if='idcard2' :src="idcard2" mode="aspectFit"></image>
						<text v-else>反面</text>
						<input name="idcard2" hidden="true" :value="idcard2"></input>
					</view>
				</view>
				<view class="title">上传资格证(可不传)</view>
				<view class="idcard">
					<view @tap="choosePic(3)">
						<image v-if='zige1' :src="zige1" mode="aspectFit"></image>
						<text v-else>电工证</text>
						<input name="zige1" hidden="true" :value="zige1"></input>
					</view>
					<view @tap="choosePic(4)">
						<image v-if='zige2' :src="zige2" mode="aspectFit"></image>
						<text v-else>焊接证</text>
						<input name="zige2" hidden="true" :value="zige2"></input>
					</view>
					<view @tap="choosePic(5)">
						<image v-if='zige3' :src="zige3" mode="aspectFit"></image>
						<text v-else>制冷证</text>
						<input name="zige3" hidden="true" :value="zige3"></input>
					</view>
					<view @tap="choosePic(6)">
						<image v-if='zige4' :src="zige4" mode="aspectFit"></image>
						<text v-else>高空作业证</text>
						<input name="zige4" hidden="true" :value="zige4"></input>
					</view>
				</view>
				<view class="agreement">
					<checkbox-group @change="checkboxChange">
						<label class="checkbox">
							<checkbox value="true" />
						</label>
						我已阅读并同意<text @tap="showModal">《入驻申请协议》</text>
					</checkbox-group>
				</view>

				<view class="agreement">
					<checkbox-group @change="checkboxChange2">
						<label class="checkbox">
							<checkbox value="true" />
						</label>
						我已阅读并同意<text @tap="showModal2">《平台服务须知》</text>
					</checkbox-group>
				</view>


				<view class="submit"><button formType="submit">立即认证</button></view>
			</form>

			<view class='dialog' v-if="showModalStatus">
				<view class="dialog_top">《入驻申请协议》</view>
				<scroll-view scroll-y="true" class="dialog_main">
					<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;本协议是联合修售后服务平台（甲方）与你（乙方）之间的合作协议，欲使用联合修售后服务平台（以下简称平台）及服务，你应当阅读并遵守《联合修注册协议》（以下简称“本协议”）。请你务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，并选择接受或不接受。
					</text>
					<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;除非你已阅读并接受本协议所有条款，否则你无法使用平台相关服务。你的获取联合修帐号、登录等行为即视为你已阅读，并同意本协议的约束。如果你未满18周岁，请在法定监护人的陪同下阅读本协议。联合修有权在必要时修改本协议条款。本协议的制定和修改自在平台上公布之日起生效。你应及时更新软件版本，并在软件的最新版本中查阅相关协议条款。本协议条款变更后，如果你继续使用平台提供的服务，即视为你已接受修改后的协议。如果你不接受修改后的协议，应当停止使用相关服务。
					</text>
					<text decode="true" space="emsp">\n—、双方合作内容
						甲方：拥有自主研发的售后服务信息管理平台，通过平台接收用户的售后服务预约信息，并及时将订单信息提供给合作的售后维修师傅。
						乙方：拥有独立民事行为能力的自然人，熟悉专项或多项售后服务技能。</text>
					<text decode="true" space="emsp">\n二、双方合作条件
						甲方：拥有自主研发的售后服务信息管理平台，通过平台接收用户的售后服务预约信息，并及时将订单信息提供给合作的售后维修师傅。
						乙方：拥有独立民事行为能力的自然人，熟悉专项或多项售后服务技能。</text>
					<text decode="true" space="emsp">\n
						三、双方合作流程
						由甲方接收用户预约信息，通过甲方信息平台向乙方在内的师傅推送售后服务信息。乙方接收售后服务信息后，自愿选择是否接单，接单后须按照《联合修售后服务要求》进行服务。</text>
					<text decode="true" space="emsp">\n
						四、双方权利与义务
						1、本协议签订时，乙方须填写与本人信息相符的姓名、身份证号，电话等个人信息；并选择本人所在的能提供服务的省、市、区详细信息以及能提供服务的类目详细信息。除法律法规规定的情形外，未经乙方许可，甲方不会向第三方公开、透露乙方个人信息，保障乙方个人信息的安全。
						2、甲方应根据用户预约合理配置售后服务信息并及时推送，乙方应当及时关注和接收甲方通过平台向乙方推送的消息，乙方根据《联合修售后服务要求》完成售后服务，乙方不能在维修现场诋毁商品质量、商家品牌以及联合修售后服务平台，并有义务向用户推广甲方的服务和产品。
						3、甲方依据本协议及相关规则，可以冻结、使用、先行赔付、退款、处置乙方在联合修平台账户内的资金。因违规而被封号的乙方账户中的资金在按照规定进行处置后尚有余额的，乙方可申请提现。
						4、甲方有权在不通知乙方的前提下，删除或采取其他限制性措施处理下列情形：包括但不限于以规避费用为目的；以炒作信用为目的；存在欺诈等恶意或虚假内容；与网上交易无关或不是以交易为目的；存在恶意竞价或其他试图扰乱正常交易秩序因素；违反公共利益或可能严重损害联合修售后服务平台和其他入驻师傅合法利益。
						5、乙方不得接触用户家内除售后服务操作外的任何财物。如发生财物丢失情况请及时提出，乙方应及时汇报甲方并报警，且须配合警察进行调查，因乙方拒不配合警察调查而被用户认定与财物丢失有关而追究赔偿责任的，由乙方自行承担，甲方不承担任何责任；若乙方因前述不配合而导致甲方损失的，甲方有权利向乙方追偿。
						6、甲方会根据实际情况不定时给乙方提供服务及技能培训，关于培训的内容及相关资料仅限乙方个人使用，若乙方未经甲方同意私自传播，甲方有权利根据情节轻重要求乙方支付违约金1000—10000元。
						7、乙方不得违反《银行卡业务管理办法》使用银行卡，不得利用信用卡套取现金；不得盗刷他人银行卡；不得明知他人可能盗刷银行卡而与对方进行交易。
						8、乙方禁止将联合修售后服务平台业务分包或转包给其他任何单位或个人。</text>
					<text decode="true" space="emsp">\n
						五、乙方违约处理
						1、当确认乙方存在多收费，不按规定收费等违规行为，乙方允许甲方从乙方账户余额中扣除当次售后服务费用返还用户作为赔偿；若因乙方的前述违规行为与用户发生言语争执并引发打架斗殴，给用户造成人身损害的，由乙方依法承担赔偿责任，由此给甲方造成损失的，甲方有权向乙方追索。
						2、若乙方违反本协议（包括本协议附件）或双方其他约定时，甲方根据造成的影响程度，有权单方终止双方合作关系，给甲方造成损失的，乙方须承担赔偿责任。
					</text>
					<text decode="true" space="emsp">\n
						六、争议解决
						1、由于履行本协议产生争议，双方均应通过友好协商方式解决。
						2、协商无法解决时，甲乙双方应提交甲方注册地人民法院管辖。</text>
					<text decode="true" space="emsp">\n
						七、联合修声明
						联合修售后服务平台（甲方）与入驻师傅（乙方）不存在劳动关系或劳务关系，乙方接单时必须基于本身服务能力，提供服务时必须注意施工安全，如因此发生工伤或给用户造成损害由您自行承担相应责任；如因乙方施工原因而产生用户索要赔偿，一经确认，我们将在您的未结算工费中予以扣除，直接支付给用户。</text>
					<text decode="true" space="emsp">\n
						八、联合修售后服务平台对本协议包括基于本协议制定的各项规则拥有最终解释权。</text>
					<text decode="true" space="emsp">\n
						―、服务基本要求
						1、接单后1小时内和用户取得联系，电话确认上门时间；
						2、按预约时间上门服务，如遇不可抗力因素不能准时上门，须第一时间和用户取得联系，征得用户的同意或谅解；
						3、为保持良好的服务形象，上门服务时需要穿戴平台提供的统一工服；
						4、安装完成后需清理现场；
						5、服务完成后，第一时间在平台里操作订单确认完成。</text>
					<text decode="true" space="emsp">\n
						二、服务三要
						1、要守时，及时预约用户的服务时间、按时上门服务，不拖延、不爽约；
						2、要专业，配备必要的工具，钻研专业知识，确保服务技能的专业性；
						3、要超预期的用户体验，服务态度要良好、沟通过程要顺畅，现场施工要规范。重点提示：以上三点是您从优秀走向卓越的必经之道，也是平台确保您足够订单和足够收入的唯一依据。</text>
					<text decode="true" space="emsp">\n
						三、服务五不要
						1、不要上传虚假个人信息；
						2、不要恶意虚假操作任何节点；
						3、不要现场乱收费，多收费；
						4、不要在用户现场诋毁商品质量、商家平台以及联合修平台；
						5、不要产生因服务态度造成任何的用户投诉。
						重点提示：发生以上任何行为，一经发现，我们将毫不犹豫的对您进行处罚直至清理出联合修售后服务平台。</text>
				</scroll-view>
				<view class='dialog_but' @tap="hideModal">确定</view>
			</view>
		</view>

		<!-- 平台服务须知 -->
		<view class='dialog' v-if="showModalStatus2">
			<view class="dialog_top">《平台服务须知》</view>
			<scroll-view scroll-y="true" class="dialog_main">
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;1、联合修师傅平台服务时间为工作日：9:00-21:00，非工作日：9:00-19:00.
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;2、价格表所示价格仅指人工服务费，配件材料费用户可自备，也可由师傅代买，按市场价收取费用，请向师傅索要配件收据或发票。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;3、服务费用为人工服务费和配件材料费之和；若因用户原因只检查不维修，师傅将酌情收取30元检测费（上门服务费）。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;4、维修更换的新配件，从修复之日起质保1-6个月不等，具体质保时间以电子账单和《回执单》填写的日期为准。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;5、高空费（户外高空作业收取。如：清洗或安装空调外机）：1-5楼80元，6-10楼120元，10楼以上200元，200元封顶。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;6、按小时计算的服务项目，未超过半小时则按半小时计算， 超过半小时不足1小时按1小时计算。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;7、如有疑难维修问题或不在参考价格表内的故障，最终报价由服务师傅与用户依照平台指导协商确定。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;8、超出规定城区范围将视距离远近收取30元路程费，城区界定请详询客服电话：林先生18659608055。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;9、超使用年限的设施设备不建议维修，另外购置。
				</text>
				<text decode="true" space="emsp">&nbsp;&nbsp;&nbsp;&nbsp;10、用户订单进度查看及费用支付请到“我的订单”中操作，平台也会实时推送模板消息或短信告知用户订单服务进度，如有疑问请咨询：18659608055。</text>
			</scroll-view>
			<view class='dialog_but' @tap="hideModal2">确定</view>
		</view>

		<view :hidden="!show_adr" style="background-color: #fff;">
			<!--服务区域选择.wxml-->
			<view class="top">
				<view class="top_l">请选择服务区域</view>
				<view class="top_r"><button @tap="submit">确定</button></view>
			</view>
			<view class="main">
				<view class="left">
					<scroll-view scroll-y="true" :style="{height:height}">
						<view v-for='(item,index) in data.areas' :key='index'>
							<view class="province" @tap="showCity(index)">{{item.Name}}</view>

							<block v-for='(citem,cindex) in item.child' :key='cindex' v-if='item.show'>
								<view v-if='citem.checked' class="city checked">{{citem.Name}}</view>
								<view v-else class="city" @tap="showArea(index,cindex)">{{citem.Name}}</view>
							</block>

						</view>
					</scroll-view>
				</view>
				<view class="right">
					<scroll-view scroll-y="true" :style="{height:height}">
						<view class="area" @tap="selectAllArea">
							<view class="area_l">全选</view>
							<view class="area_r">
								<icon type="success" size="20" color="#159be4" v-if="allselect" />
								<icon type="success" size="20" color="#eeeeee" v-else />
							</view>
						</view>
						<block v-for='(item,index) in areas' :key='index'>
							<view class="area" @tap="selectArea(index)">
								<view class="area_l">{{item.Name}}</view>
								<view class="area_r">
									<icon type="success" size="20" :color="item.color" />
								</view>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
	var qqmapsdk;
	export default {
		data() {
			return {
				master_info: '',
				data: '',
				areas:'',
				idcard1: '',
				idcard2: '',
				zige1: '',	//电工证
				zige2: '',	//焊接证
				zige3: '',	//制冷证
				zige4: '',	//高空作业证
				
				position_province_id:0,
				position_province_name:'',
				position_city_id:0,             
				position_city_name:'',
				position_area_id:0,
				position_area_name:'',
				address: '',
				latitude: '',
				longitude: '',
				
				serviceadrtxt: '',

				allselect: false,
				service_province_id: 2, //北京id
				service_province_name:'',
				service_city_id: 52, //城市id
				service_city_name:'',
				service_area_id: 0, //未选择地区，id默认为0
				service_area_name:'',
				
				height: '', //地区的高度
				show_adr:false,
				
				checked: false,
				checked2: false,
				showModalStatus: false,
				showModalStatus2: false,
				
				is_preview:0
			}
		},
		onLoad(options) {
			this.loadData();
			this.master_info = app.globalData.master_info;
		},
		methods: {
			//初始化获取服务项目和地区
			loadData() {
				this.request({
					url: interfaces.initReg,
					header: {
						//token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						//console.log('ok');
						if (res.code == 200) {
							this.data=res.data;
							for(var k in this.data.categ){
								this.data.categ[k].selected=0;
							}
							this.data.areas[0].show = true;
							this.data.areas[0].child[0].checked = true;
							this.getArea(this.data.areas[0].child[0].id);
							this.is_preview=1;
							
							this.service_province_id=this.data.areas[0].id;
							this.service_province_name=this.data.areas[0].Name;
							
							this.service_city_id=this.data.areas[0].child[0].id;
							this.service_city_name=this.data.areas[0].child[0].Name;
							
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},
			//选择技能类型方法
			changeSelect(index) {
				//console.log(this.data.categ);
				var categ=this.data.categ;
				this.data.categ=[];
				categ[index].selected = (categ[index].selected==1)?0:1;
				this.data.categ=categ;
			},

			//参数一 e 数据源
			//参数二 t 成功success的数量
			//参数三 a 失败fail的数量
			//参数四 i 完成comlete的数量
			//参数五 n 要上传的图片数量
			//参数六 type 要上传哪个图片（身份证正面、反面或技能证书）
			uploadDIY: function(e, t, a, i, n, type) {
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
						//access_token: s.data.token
					},
					success: function(e) {
						e.data=JSON.parse(e.data);
						t++;
						if (type == "1") {
							s.idcard1 = e.data;
						} else if (type == "2") {
							s.idcard2 = e.data;
						} else if (type == "3") {
							s.zige1 = e.data;
						} else if (type == "4") {
							s.zige2 = e.data;
						} else if (type == "5") {
							s.zige3 = e.data;
						} else if (type == "6") {
							s.zige4 = e.data;
						}
					},
					fail: function(e) {
						a++;
					},
					complete: function() {
						++i == n ? wx.hideLoading() : o.uploadDIY(e, t, a, i, n, type);
					}
				});
			},
			choosePic(type) {
				var a = this;
				wx.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					sourceType: ["album", "camera"],
					success: function(e) {
						e.tempFilePaths;
						var t = e.tempFilePaths.length;
						a.uploadDIY(e.tempFilePaths, 0, 0, 0, t, type);
					}
				});
			},

			//表单提交事件
			formSubmit: function(e) {
				var data = e.detail.value;
				var skill='';
				var skill_name='';
				for(var k in this.data.categ){
					if(this.data.categ[k].selected){
						if(skill==''){
							skill=this.data.categ[k].id;
							skill_name=this.data.categ[k].name;
						}else{
							skill+=','+this.data.categ[k].id;
							skill_name=this.data.categ[k].name;	
						}
					}
				}

				data.skill = skill;
				data.skill_name = skill_name;
				
				data.position_province_id=this.position_province_id;
				data.position_province_name=this.position_province_name;
				data.position_city_id=this.position_city_id;
				data.position_city_name=this.position_city_name;
				data.position_area_id=this.position_area_id;
				data.position_area_name=this.position_area_name;
				
				data.address=this.address;
				data.latitude=this.latitude;
				data.longitude=this.longitude;
				
				data.service_province_id=this.service_province_id;
				data.service_province_name=this.service_province_name;
				data.service_city_id=this.service_city_id;
				data.service_city_name=this.service_city_name;
				data.service_area_id=this.service_area_id;
				data.service_area_name=this.service_area_name;

				if (this.checked == false) {
					wx.showToast({
						title: '请先阅读并同意入驻申请协议',
						icon: "none",
					});
					return;
				}
				if (this.checked2 == false) {
					wx.showToast({
						title: '请先阅读并同意平台服务须知',
						icon: "none",
					});
					return;
				}
				if (data.nickname == "") {
					wx.showToast({
						title: '请填写昵称',
						icon: "none",
					});
					return;
				}
				if (data.realname == "") {
					wx.showToast({
						title: '请填写您的姓名',
						icon: "none",
					});
					return;
				}
				if (data.idcard == "") {
					wx.showToast({
						title: '请填写您的身份证号码',
						icon: "none",
					});
					return;
				}
				if (data.age == "") {
					wx.showToast({
						title: '请输入年龄',
						icon: "none",
					});
					return;
				}
				if (!common.checkMobile(data.mobile)) {
					wx.showToast({
						title: '手机号码格式有误',
						icon: "none",
					});
					return;
				}
				if (this.service_area_id == "") {
					wx.showToast({
						title: '请选择您的服务区域',
						icon: "none",
					});
					return;
				}
				if (this.position_area_id == "") {
					wx.showToast({
						title: '请选择您的联系地址',
						icon: "none",
					});
					return;
				}
				if (data.skill == "") {
					wx.showToast({
						title: '请选择技能类型',
						icon: "none",
					});
					return;
				}
				if (data.idcard1 == "") {
					wx.showToast({
						title: '请上传您的身份证正面照',
						icon: "none",
					});
					return;
				}
				if (data.idcard2 == "") {
					wx.showToast({
						title: '请上传您的身份证反面照',
						icon: "none",
					});
					return;
				}
				
				// console.log(data);
				// return;
				
				this.request({
					url: interfaces.masterReg,
					data: data,
					header: {
						token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							app.globalData.master_info.status=1;
							wx.showToast({
								title: res.msg,
								icon: 'none'
							})
							setTimeout(function() {
								wx.reLaunch({
									url: '/pages/index/index'
								})
							}, 2000);
						} else if (res.code == 400) {
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

		

			open_map: function() {
				wx.chooseLocation({
					success: e => {
						this.address = e.address;
						this.latitude = e.latitude;
						this.longitude = e.longitude;	
						this.getPositionArea(e.latitude,e.longitude);
					},
					fail: err => {
						//console.log(err);
						if (err.errMsg === "chooseLocation:fail auth deny") {
							wx.showModal({
								title: '提示',
								content: '只有授权成功才能使用此功能，是否手动开启授权？',
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

			//去选择服务区域
			goSelect() {
				this.show_adr = true;
			},

			//服务区域js
			//获得滚动框高度
			getHeight() {
				var winH = wx.getSystemInfoSync().windowHeight;
				this.height = (winH - 55) + "px";
			},

			//根据地区id,获取服务地区数据
			getArea(id){
				this.request({
					url: interfaces.getArea,
					data: {
						id:id
					},
					method: 'POST',
					success: res => {
						this.areas = res;
						for (var k in this.areas) {
							this.areas[k].checked = false;
							this.areas[k].color = '#eeeeee';
						}
						this.service_area_id='';
						this.service_area_name='';
						this.allselect= false; //全选按钮不选中
					}
				})
			},

			//点击省显示城市
			showCity(index) {
				var district=this.data.areas;
				for (var k in district) {
					district[k].show = false;
					for (var k1 in district[k].child) {
						district[k].child[k1].checked = false;
					}
				}
				district[index].show = true;
				district[index].child[0].checked=true;
				this.getArea(district[index].child[0].id);
				
				this.service_province_id= district[index].id; //点击省以后，记录下省ID
				this.service_province_name = district[index].Name;
				this.service_city_id= district[index].child[0].id; //点击省以后，记录下第一个市的ID
				this.service_city_name = district[index].child[0].Name;
				this.data.areas=district;
				
			},
			//点击城市显示地区
			showArea(index,cindex) {
				var district=this.data.areas;
				
				for (var k in district) {
					for (var k1 in district[k].child) {
						district[k].child[k1].checked = false;
					}
				}
				district[index].child[cindex].checked = true;
				this.getArea(district[index].child[cindex].id);
				this.city_id= district[index].child[cindex].id; //点击城市以后，记录下城市ID
			},

			//点击全选，选中所有城市
			selectAllArea() {
				var checked, color;
				var service_area_id = 0;
				var service_area_name='';
				if (this.allselect) {
					checked = false;
					color = "#eeeeee";
					service_area_id = 0;
				} else {
					checked = true;
					color = "#159be4";
					for (var k in this.areas) {
						if (service_area_id == 0) {
							service_area_id = this.areas[k].id;
							service_area_name=this.areas[k].Name;
						} else {
							service_area_id += ',' + this.areas[k].id;
							service_area_name+=',' + this.areas[k].Name;
						}
					}
				}
				this.allselect = !this.allselect;
				for (var k in this.areas) {
					this.areas[k].checked = checked;
					this.areas[k].color = color;
				}
				this.service_area_id=service_area_id;
				this.service_area_name=service_area_name;
			},

			//点击单个城市选中或者取消
			selectArea(index) {
				if (this.areas[index].checked) {
					this.areas[index].color = '#eeeeee';
				} else {
					this.areas[index].color = '#159be4';
				}
				this.areas[index].checked = !this.areas[index].checked;
				
				this.service_area_id=0;
				this.service_area_name='';
				
				for (var k in this.areas) {
					if (this.areas[k].checked) {
						if (this.service_area_id == 0) {
							this.service_area_id = this.areas[k].id;
							this.service_area_name = this.areas[k].Name;
						} else {
							this.service_area_id += ',' + this.areas[k].id;
							this.service_area_name += ',' + this.areas[k].Name;
						}
					}
				}
			},

			submit() {
				if (this.service_area_id == 0) {
					wx.showToast({
						title: '请选择服务区域',
						icon: "none",
					});
					return;
				}

				// this.serviceadr = [this.province_id, this.city_id, this.area_id];
				// this.serviceadrtxt="已选择";
				this.show_adr=false;
			},
			
			
			showModal() {
				this.showModalStatus = true;
			},
			//隐藏对话框
			hideModal() {
				this.showModalStatus = false;
			},
			showModal2() {
				this.showModalStatus2 = true;
			},
			//隐藏对话框
			hideModal2() {
				this.showModalStatus2 = false;
			},
			checkboxChange(e) {
				var length = e.detail.value.length;
				if (length > 0) {
					this.checked = true;
				} else {
					this.checked = false;
				}
			},
			checkboxChange2(e) {
				var length = e.detail.value.length;
				if (length > 0) {
					this.checked2 = true;
			
				} else {
					this.checked2 = false;
				}
			},
			
			//根据定位获取师傅定位数据库数据
			getPositionArea(latitude,longitude) {
				// 实例化API核心类
				qqmapsdk = new QQMapWX({
					key: 'WCYBZ-EWVC4-CC3U2-DZGZI-UWGK2-E2BMM'
				});
				wx.getLocation({
					type: 'gcj02',
					success: res => {
						qqmapsdk.reverseGeocoder({
							location: {
								latitude:latitude,
								longitude:longitude
							},
							success: addressRes => {
								//console.log(addressRes);
								addressRes.result.ad_info.adcode;
								//根据获取到的地区id，去获取省市区id
								this.getAllAddress(addressRes.result.ad_info.adcode);
							}
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
			//根据地区id获取省市区完整数据
			getAllAddress(adcode){
				this.request({
					url: interfaces.masterAddress,
					data: {
						adcode:adcode
					},
					header: {
						//token: this.master_info.token
					},
					method: 'POST',
					success: res => {
						if (res.code == 200) {
							this.position_province_id=res.data.province_id;
							this.position_city_id=res.data.city_id;
							this.position_area_id=res.data.area_id;
							this.position_province_name=res.data.province_name;
							this.position_city_name=res.data.city_name;
							this.position_area_name=res.data.area_name;
						} else {
							wx.showToast({
								title: '请您手动选择您的所属区域',
								icon: 'none',
								mask: true,
							})
						}
					}
				});
			}
			
		}
	}
</script>

<style lang="scss">
	.box {
		margin: 10px;
		box-shadow: 0 0 9px 3px #ccc;
		padding: 10px;
		border-radius: 10px;
		.item {
			display: flex;
			border-bottom: 1px #eeeeee solid;
			background-color: #fff;
			padding: 10px;
			line-height: 40px;
			.left {
				width: 80px;
			}
			.mid {
				width: calc(100% - 110px);
				line-height: 20px;
			}
			.entry{
				width: 30px;
				text-align: right;
			}
			.right{
				width: calc(100% - 80px);
				input {
					line-height: 40px;
					height: 40px;
				}
				textarea {
					width: 100%;
					height: 60px;
					line-height: 20px;
					margin-top:12px;
				}
				text {
					padding-right: 5px;
				}
			}
			.getadr {
				padding: 0 10px;
				background-color: #257AFA;
				height: 30px;
				line-height:30px;
				color: #fff;
				border-radius: 15px;
				margin-top: 5px;
				text-align: center;
			}
			.select {
				padding: 0 10px;
				background-color: #257AFA;
				height: 30px;
				line-height:30px;
				color: #fff;
				border-radius: 15px;
				margin-top: 5px;
				text-align: center;
			}
		}
		.between{
			justify-content: space-between;
		}
		.tip{
			font-size: 12px;
			color: #676767;
		}
		.service{
			padding: 10px 0;
			.skill{
				border: 1px #B0C0D7 solid;
				width: calc(100% / 3 - 12px);
				line-height: 30px;
				margin: 5px 5px;
				text-align: center;
				display: inline-block;
			}
			.selected{
				background-color: #4688FF;
				border: 1px #4688FF solid;
				color: #fff;
			}
		}
	}
	.title{
		padding-left: 10px;
		color: #257AFA;
	}
	.idcard{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 10px;
		margin: 15px 0;
		view{
			box-shadow: 0 0 9px 3px #ccc;
			width: calc(50% - 5px);
			height: 100px;
			line-height: 100px;
			text-align: center;
			image{
			  width: 100%;
			  height: 100%;
			}
		}
	}
	.agreement{
		padding: 5px 10px;
		text{
			color: #FF5050;
		}
	}
	.submit{
		width: 70%;
		margin: 10px auto;
		button{
			background-color: #257AFA;
			line-height: 40px;
			border-radius: 20px;
			color: #fff;
			font-size: 16px;
		}
	}
	/* 底部弹出框样式 */
	.dialog{
	  width: 70%;
	  left: 50%;
	  top: 15%;
	  position: fixed;
	  transform: translate(-50%,0);
	  background: #fff;
	  border-radius: 10px;
	  z-index: 999;
	}
	.dialog_top{
	  background-color: #03b3ff;
	  color: #fff;
	  text-align: center;
	  height: 30px;
	  line-height: 30px;
	  border-top-left-radius: 10px;
	  border-top-right-radius: 10px;
	}
	.dialog_main{
	  padding: 10px 10px 5px 10px;
	  box-sizing: border-box;
	  line-height: 1.5;
	  height: 600rpx;
	}
	.dialog_but{
	  background-color: #03b3ff;
	  color: #fff;
	  position: relative;
	  height: 70rpx;
	  width: 30%;
	  left: 35%;
	  font-size: 30rpx;
	  line-height: 70rpx;
	  text-align: center;
	  border-radius: 10rpx;
	  margin: 5px 0;
	}
	
	
	/* 选择地址 */
	.top {
		border-bottom: 1px #e8e8e8 solid;
		display: flex;
		justify-content: space-between;
		padding: 12px 10px;
		line-height: 30px;
		.top_l {
			font-size: 20px;
		}
		.top_r{
			button {
				font-size: 16px;
				color: #fff;
				background-color: #03b3ff;
				line-height: 2;
			}
		}
	}
	.main {
		display: flex;
		.left {
			width: 45%;
			.province {
				line-height: 50px;
				padding-left: 10px;
				font-size: 20px;
			}
			.city {
				line-height: 30px;
				padding-left: 20px;
				font-size: 16px;
			}
			.checked {
				color: #51aac8;
			}
		}
		.right {
			width: calc(55% - 1px);
			border-left: 1px #e8e8e8 solid;
			.area {
				display: flex;
				justify-content: space-between;
				padding: 0 10px;
			}
			.area_l {
				line-height: 40px;
				height: 40px;
			}
			.area_r {
				padding-top: 10px;
				height: 30px;
			}
		}
	}
</style>