window.groupObjectList = [];
window.encryObjectList = [];
function updateAdmStatus(id, status, admname) {
	var gLoginName = $('#gLoginName').val();
	if (admname === gLoginName){
		//toastr.error("当前登录管理员不能操作自身！", "错误提示");
		myAlert('当前登录管理员不能操作自身！',"error");
		return false;
	}
	var pdata = {
		'id' : id,
		'status' : status
	};
	var url = "/home/upstatus/";
	var rd = ajaxRequest(url, pdata);
	reloadUrl('/home/admng/');
}

function updatePwdStatus(id, status, admname) {
	var gLoginName = $('#gLoginName').val();
	if (admname === gLoginName){
		//toastr.error("当前登录管理员不能操作自身！", "错误提示");
		myAlert('当前登录管理员不能操作自身！',"error");
		return false;
	}
	var pdata = {
		'id' : id,
		'status' : status
	};
	var url = "/home/uppwd/status/";
	var rd = ajaxRequest(url, pdata);
	reloadUrl('/home/admng/');
}

function updateUkStatus(id, status, admname) {
	var gLoginName = $('#gLoginName').val();
	if (admname === gLoginName){
		//toastr.error("当前登录管理员不能操作自身！", "错误提示");
		myAlert('当前登录管理员不能操作自身！',"error");
		return false;
	}
	var pdata = {
		'id' : id,
		'status' : status
	};
	var url = "/home/upuk/status/";
	var rd = ajaxRequest(url, pdata);
	reloadUrl('/home/admng/');
}

function getAdmFormData() {
	return {
		'otype' : $('#otype').val(),
		'admname' : $('#admname').val(),
		'admalias' : $('#admalias').val(),
		'admrole' : $('#admrole').children('option:selected').val(),
		'admdsp' : $('#admdsp').val()
	};
}

function pchangeAction() {

	var username = $('#admname').val();
	$('#admalias').val(username);
}

function switchIDTypeRadio(val) {
	$("#admAddForm :radio[name='idtype']").each(function() {
		if ($(this).val() == val) {
			$(this).attr('checked', true);
		}
	});
}

function changeShowKeyItem(isUkey) {
	var ukIdType = $('#ukIdType').val();
	showAccountItem(ukIdType);
	if (isUkey) {
		// $('#admname').val(ukIdType);
		if (ukIdType == 'sn') {
			$('#usesn').prop('checked', true);
			$('#admname').val('SN字段');
			$('#admalias').val('');
			$('#admname').attr('disabled', true);
		}
		if (ukIdType == 'cn') {
			$('#usecn').prop('checked', true);
			$('#admname').val('CN字段');
			$('#admalias').val('');
			$('#admname').attr('disabled', true);
		}
		if (ukIdType == 'custom') {
			$('#usecustom').prop('checked', true);
			$('#admname').val('');
			$('#admalias').val('');
			$('#admname').attr('disabled', false);
		}
		$('#admtype').val('ukey');
		$('#fg-idtype').show();
		$('#fgpin').show();
		//如果是第三方商密key,则隐藏证书等级
		var ukeytype=$("#ukeyType").val();
		if(ukeytype !="business_key" && ukeytype !="sm"){
			$('#fg-certlvl').show();
		}else{
			$('#fg-certlvl').hide();
			$("#certlvl").val("1");
		}		
		$('#fgpw').hide();
		$('#fgpw2').hide();
		
		var oem=$("#oem").val();
		if(oem=="006a"){
			$("#div_curkey").hide();
			$("#cbCurKey").attr("checked",true);
		}else{
			$("#div_curkey").hide();
		}		
		
	} else {
		$('#admtype').val('passwd');
		$('#admname').val('');
		$('#admname').attr('disabled', false);
		$('#fg-idtype').hide();
		$('#fgpin').hide();
		$('#fg-certlvl').hide();
		$('#fgpw').show();
		$('#fgpw2').show();
	}
}

ukmap = {
	'custom': 0,
	'sn': 1,
	'cn': 2
};

function getUkeyHand(userid,pin){
		var devnum = 1;
		if($("#cbCurKey").prop("checked")){
			devnum=0;
		}
		var ilevel = parseInt($('#certlvl').val());//证书级别
		var container = "";
		//验证是否第三方商密key
		var ukeyType=$("#ukeyType").val();
		if(ukeyType=="business_key"){
			//获取第一个容器名
			container=getActiveContainer(0);
			ilevel=1;
		}		
		var ukidtype = $('#ukIdType').val();
		var flag = ukmap[ukidtype];
		var rd = kbmGetHand(userid, pin, devnum, ilevel, container, flag,"");
		return rd;		
}


function addUkeyAdm() {
	//判断管理员是否为key用户
	var keyuser=$("#keyuser").val();
	var innerboxsek=$("#innerboxsek").val();
	if(keyuser==false && innerboxsek==""){
		//toastr.error("请使用key管理员登录系统！", "错误提示");
		myAlert('请使用key管理员登录系统！',"error");
		return false;
	}
	
	var userid = $('#admalias').val();
	var pin = $("#admpin").val();
	var ghrd = getUkeyHand(userid,pin);
	if (!ghrd['ret']){
		//toastr.error("获取句柄失败，请确认是否正确安装控件！", "错误提示");
		myAlert('获取句柄失败，请确认是否正确安装控件！',"error");
		return false;
	}
	var hand = ghrd['hand'];
	
	var ukeytype=$("#ukeyType").val();
	var rd;	
	if(ukeytype=="business_key"){//商用key
		rd=getCertBase64(hand,0);	
	}else{
		rd = kbmGetCert(hand, 0);
	}
	if(!rd['ret']){
		//toastr.error('获取加密证书失败，' + rd['errMsg'], "错误提示");
		myAlert('获取加密证书失败，' + rd['errMsg'],"error");
		return false;
	}
	var ecert = rd['cert'];
	$("#admAddForm [name='ecert']").val(ecert);

	var srd;
	if(ukeytype=="business_key"){//商用key
		srd = getCertBase64(hand, 1);
	}else{
		srd = kbmGetCert(hand, 1);
	}
	if(!srd['ret']){
		//toastr.error('获取签名证书失败，' + rd['errMsg'], "错误提示");
		myAlert('获取签名证书失败，' + rd['errMsg'],"error");
		return false;
	}
	var scert = srd['cert'];
	$("#admAddForm [name='scert']").val(scert);
	
	var snrd = kbmGetSN(hand);
	if(!snrd['ret']){
		//toastr.error('获取sn失败，' + snrd['errMsg'], "错误提示");
		myAlert('获取sn失败，' + snrd['errMsg'],"error");
		return false;
	}	
	$("#admAddForm [name='uksn']").val(snrd['sn']);
	var cnrd = kbmGetCN(hand);
	if(!cnrd['ret']){
		//toastr.error('获取cn失败，' + cnrd['errMsg'], "错误提示");
		myAlert('获取cn失败，' + cnrd['errMsg'],"error");
		return false;
	}
	
	
	//用户加密
	var url="/home/add903/generateSek/";
	var data={"dt":new Date().getTime() };
	var sek_ret=ajaxRequest(url, data);
	if (!sek_ret['ret']) {
		//toastr.error('获取sek失败，' + sek_ret['errMsg'], "错误提示");
		myAlert('获取sek失败，' + sek_ret['errMsg'],"error");
		return false;
	}else{
		var sek=sek_ret['data'];
		$("#admAddForm [name='sek']").val(sek_ret['data']);
		var encryret=kbmEncrypt(hand,sek);
		if(!encryret['ret']){
			//toastr.error(encryret['errMsg'], "错误提示");
			myAlert(encryret['errMsg'],"error");
			return false;
		}else{
			$("#admAddForm [name='esek']").val(encryret['data']);
		}
		var innerbox_encryret=kbmEncrypt(hand,innerboxsek);
		if(!innerbox_encryret['ret']){
			//toastr.error(innerbox_encryret['errMsg'], "错误提示");
			myAlert(innerbox_encryret['errMsg'],"error");
			return false;
		}else{
			$("#admAddForm [name='innerboxesek']").val(innerbox_encryret['data']);
		}
		 
	}
	
	
	
	kbmReleaseHand(hand);
	$("#admAddForm [name='ukcn']").val(cnrd['cn']);
	var myForm = $('#admAddForm');
	var url = '/home/upadm/903/';
	myForm.attr('action', url);
	myForm.submit();
	
}

function upAdm(){
	var myForm = $('#admAddForm');
	var url = '/home/upadm/903/';
	myForm.attr('action', url);
	myForm.submit();
}

function showAccountItem(type) {
	if (type == 'sn') {
		$('#admname').val('SN字段');
		$('#admalias').val('');
		$('#admname').attr('disabled', true);
		$('#ukIdType').val('sn');
	} else if (type == 'cn') {
		$('#admname').val('CN字段');
		$('#admalias').val('');
		$('#admname').attr('disabled', true);
		$('#ukIdType').val('cn');
	} else {
		$('#admname').val('');
		$('#admalias').val('');
		$('#admname').attr('disabled', false);
		$('#ukIdType').val('custom');
	}
}

$('#admAddModal [name="idtype"]').bind('change', function() {
	var type = $(this).attr('for');
	showAccountItem(type);
});


$(function() {
	var rname = 'rpcfmpwd';
	var rule = {
		check : function(value) {
			var newpwd = $('#resetPwdModal [name="newpwd"]').val();
			if (value)
				if (value !== newpwd) {
					return false;
				}

			return true;
		},
		msg : "两次输入口令不一致"
	}
	$.Validation.addRule(rname, rule);

	var ukeyType = $("#ukeyType").val();
	//alert(ukeyType);
	if(ukeyType != 'none'){
		var detected = detected903Activex();
		if (!detected){
			//toastr.error("未检测到控件，请正确安装控件", "错误提示");
			myAlert('未检测到控件，请正确安装控件',"error");
		}
	}

	$('#btnAddAdm').bind('click', function() {
		var obj = $('#admAddModal');
		clearValidateMsg(obj);
		clearModalMsg(obj);
		$('#admname').attr('disabled', false);
		$('#otype').val('add');
		$('#admrole').attr('disabled', false);
		$('#cbUkeyUser').attr('disabled', true);
		$('#cbUkeyUser').attr('checked', true);
		changeShowKeyItem(true);
		// $('#fg-certlvl').show();
		$('#myModalLabel').html('创建管理员');
		
		var dftCertLvl=$("#dftCertLvl").val();
		$("#admAddForm [name='certlvl']").val(dftCertLvl);
		showModal('#admAddModal');
	});

	$('#cbUkeyUser').click(function() {
		var isUkey = $(this).is(':checked');
		changeShowKeyItem(isUkey);
	});
	
	var ukIdType = $("#ukIdType").val();
	switchIDTypeRadio(ukIdType);

	var myForm = $("#admAddModal");
	myForm.validation();
	$('#subBtnAddAdm').bind('click', function() {
		if (!myForm.validate()) {
			return false;
		}
		$('#admAddModal').modal('hide');

		var otype = $('#otype').val();
		var isUkeyUser = $('#cbUkeyUser').is(':checked');
		if (otype == 'add' && isUkeyUser){
			addUkeyAdm();
		}else{
			upAdm();
		}
	});
		
	var myActvForm = $("#actvForm");
	myActvForm.validation();
	$('#btnActivePwdOK').bind('click', function() {
		if (!myActvForm.validate()) {
			return false;
		}
		$('#actvPwdModal').modal('hide');
		
		var url = '/home/actvpwd/';
		myActvForm.attr('action', url);
		myActvForm.submit();
		return false;		
	});

	var myResetPwdForm = $("#resetPwdForm");
	myResetPwdForm.validation();
	$('#btnResetPwdOK').bind('click', function() {
		if (!myResetPwdForm.validate()) {
			return false;
		}
		var url = '/home/resetpwd/';
		myResetPwdForm.attr('action', url);
		myResetPwdForm.submit();
		return false;
	});

	var myActvUKForm = $("#actvUKForm");
	myActvUKForm.validation();
	$('#btnActiveUKOK').bind('click', function() {

		if (!myActvUKForm.validate()) {
			return false;
		}
		$('#actvUKModal').modal('hide');
		
		var certLevel = parseInt($("#acertlvl").val());
		var eclvl = certLevel * 2;
		var pin = $("#actvUKForm [name='admpin']").val();
		
		var userid=$('#avukAccount').val();
		//加密证书
		var devnum = 0;
		var container = "";
		//验证是否第三方商密key
		var ukeyType=$("#ukeyType").val();
		if(ukeyType=="business_key"){
			//获取第一个容器名
			container=getActiveContainer(0);
			certLevel=1;
		}		
		var ukidtype = $('#ukIdType').val();
		var flag = ukmap[ukidtype];
		var ghrd = kbmGetHand(userid, pin, devnum, certLevel, container, flag,"");
		if (!ghrd['ret']){
			//toastr.error('控件错误，' + rd['errMsg'], "错误提示");
			myAlert('控件错误，' + rd['errMsg'],"error");
			return ghrd;
		}
		var hand = ghrd['hand'];
		var ukeytype=$("#ukeytype").val();
		var rd;
		if(ukeytype=="business_key"){//商用key
			rd = getCertBase64(hand, 0);
		}else{
			rd = kbmGetCert(hand, 0);
		}
		if(!rd['ret']){
			//toastr.error('获取加密证书失败，' + rd['errMsg'], "错误提示");
			myAlert('获取加密证书失败，' + rd['errMsg'],"error");
			return false;
		}
		
		
		//var rd = keyGetCert(pin, eclvl);
		//if(!rd['ret']){
		// toastr.error('获取加密证书失败，' + rd['errMsg'], "错误提示");
		///	return false;
		//}
		$("#actvUKForm [name='ecert']").val(rd['cert']);
		var srd;
		if(ukeytype=="business_key"){//商用key
			srd = getCertBase64(hand, 1);
		}else{
			srd = kbmGetCert(hand, 1);
		}
		if(!srd['ret']){
			//toastr.error('获取签名证书失败，' + rd['errMsg'], "错误提示");
			myAlert('获取签名证书失败，' + rd['errMsg'],"error");
			return false;
		}
		var scert = srd['cert'];
		
		//var srd = keyGetCert(pin, certLevel);
		//if(!srd['ret']){
		//  toastr.error('获取签名证书失败，' + srd['errMsg'], "错误提示");
		//	return false;
		//}
		
		$("#actvUKForm [name='scert']").val(srd['cert']);
		
		var ukIdType = $('#ukIdType').val();		
		if (ukIdType == 'sn'){
			
			//ghrd['hand']
			var snrd = kbmGetSN(ghrd['hand']);
			if (!snrd['ret']) {
				return snrd;
			}
			var sn = snrd['sn'];
			$("#actvUKForm [name='haccount']").val(sn);
			
			
			//var rd = keyGetSN(pin);
			//if(!rd['ret']){
			//toastr.error('获取sn失败，' + rd['errMsg'], "错误提示");
			//return false;
			//}
			//var sn = rd['sn'];
			//$("#actvUKForm [name='haccount']").val(sn);
		} 

		var url = '/home/actvuk/';
		myActvUKForm.attr('action', url);
		myActvUKForm.submit();
		return false;	             //this line is very important, it will be a huge bug if here return true;	
	});
	
	
	var upkeyform=$("#upUKForm");
	upkeyform.validation();
	$('#btnDescOK').bind('click', function() {
		if (!upkeyform.validate()) {
			return false;
		}
		
		
		var admname=$("#upkeyAccount").val();
		var admpin=$("#upkeypin").val();
		var upkeylvl=$("#upkeylvl").val();
		var keyfalg=$("#keyflag").val();
		var flag=0;
		if(keyfalg==2){flag=1;}
		if(keyfalg==3){flag=2;}
		var uhand=kbmGetHand(admname, admpin, 0, upkeylvl, "", flag,admname);//flag:0：自定义，1：证书CN，2：证书SN）
		if(!uhand['ret']){
			$("#updateKeyHint").text(uhand['errMsg']);
			$("#updateKeyHint").addClass('text-error');
			$("#updateKeyImg").hide();
			return false;
		}
		var hand=uhand['hand'];
		
		$("#updateKeyHint").text("正在解密...");
		$("#updateKeyImg").show();
		var uid=$("#upkeyuid").val();
		var url="/home/admng/loadGroupData/";
		var data={"uid":uid,"dt":new Date().getTime() };
		var grouprd=ajaxRequest(url,data);
		var validaterd;
		if(grouprd['ret']){
			window.groupObjectList=[];
			var groupdata=grouprd.data;
			if(groupdata.length>0){
				for(var i=0;i<groupdata.length;i++){
					var gid=groupdata[i].gid;
					var esek=groupdata[i].esek;
					var flag=groupdata[i].flag;
					var descret=kbmDescrypt(hand,esek);
					if(!descret['ret']){
						$("#updateKeyHint").text(descret['errMsg']);
						$("#updateKeyHint").addClass('text-error');
						$("#updateKeyImg").hide();
						return false;
					}else{
						var sek=descret['data'];
						var sekdata={"flag":flag,"gid":gid,"sek":sek};
						window.groupObjectList.push(sekdata);
					}
					
				}
				$("#updateKeyHint").text("正在验证密钥...");
				$("#updateKeyHint").removeClass('text-error');
				
				url="/home/admng/validateGroupData/";
				if(window.groupObjectList.length>0){
					for(var k=0;k<window.groupObjectList.length;k++){
						var userobj=window.groupObjectList[k];
						data={"flag":userobj.flag,"gid":userobj.gid,"sek":userobj.sek,"dt":new Date().getTime() };	
						validaterd=ajaxRequest(url,data);
						if(!validaterd['ret']){
							$("#updateKeyHint").text(validaterd['errMsg']);
							$("#updateKeyHint").addClass('text-error');
							$("#updateKeyImg").hide();
							return;
						}
					}
				}
				$("#updateKeyHint").text("验证旧key成功");
				$("#updateKeyImg").hide();
				
				
			}
		}else{
			$("#updateKeyHint").text(grouprd['errMsg']);
			$("#updateKeyImg").hide();
		}
		
		kbmReleaseHand(hand);
		$('#updateKeyHint').text('请插入新的USBKEY，输入PIN码后点击确定。');
		$("#upkeylvl").removeAttr("disabled");
		$("#upkeypin").val("");
		$("#btnDescOK").hide();
		$("#btnEscOK").show(); 
		 
	});
	
	$('#btnEscOK').bind('click', function() {
		var admpin=$("#upkeypin").val();
		if(admpin==""){
			var pinobj = $("#upkeypin");
			var parentGroup = pinobj.parents(".form-group");
			var container = pinobj.parent();
			container.find(".text-error").each(function() {
				$(this).remove();
			});
			var errArea = $(document.createElement("span")).addClass("text-error");
			parentGroup.addClass("error");
			container.append(errArea.empty());
			errArea.append("不能为空");
			return false;
		}
		
		window.encryObjectList = [];
		$("#updateKeyHint").text("正在重新绑定USBKEY...");
		$("#updateKeyImg").show();
		$("#btnDescOK").hide();
		$("#btnEscOK").show(); 
		
		var admname=$("#upkeyAccount").val();
		
		var upkeylvl=$("#upkeylvl").val();
		var keyfalg=$("#keyflag").val();
		var flag=0;//customer
		if(keyfalg==2){flag=1;}//cn
		if(keyfalg==3){flag=2;}//sn
		var uhand=kbmGetHand(admname, admpin, 0, upkeylvl, "", flag,admname);//flag:0：自定义，1：证书CN，2：证书SN）
		if(!uhand['ret']){
			$("#updateKeyHint").text(uhand['errMsg']);
			$("#updateKeyHint").addClass('text-error');
			$("#updateKeyImg").hide();
			return false;
		}
		var hand=uhand['hand'];
		if(window.groupObjectList.length>0){
			for(var i=0;i<window.groupObjectList.length;i++){
				var groupobj=window.groupObjectList[i];
				//{"flag":flag,"gid":gid,"sek":sek}
				var flag=groupobj.flag;
				var gid=groupobj.gid;
				var sek=groupobj.sek;
				var encryret=kbmEncrypt(hand,sek);
				if(!encryret['ret']){
					$("#updateKeyHint").text(encryret['errMsg']);
					$("#updateKeyHint").addClass('text-error');
					$("#updateKeyImg").hide();
					return false;
				}else{
					var esek=encryret['data'];
					var uid=$("#upkeyuid").val();
					var encrydata={"flag":flag,"gid":gid,"esek":esek,"uid":uid };
					window.encryObjectList.push(encrydata);
				}
				
			}
			
			$("#updateKeyHint").text('新密钥提交至服务器...');
			$("#updateKeyImg").show();
			var url="/home/admng/modifyGroupData/";
			if(window.encryObjectList.length>0){
				for(var k=0;k<window.encryObjectList.length;k++){
					var encrydata=window.encryObjectList[k];
					var param={"flag":encrydata.flag,"gid":encrydata.gid,"esek":encrydata.esek,"uid":encrydata.uid,"dt":new Date().getTime() };
					var bindret=ajaxRequest(url,param);
					if(!bindret['ret']){
						$("#updateKeyHint").text(bindret['errMsg']);
						$("#updateKeyHint").addClass('text-error');
						$("#updateKeyImg").hide();
						return false;
					}
					
				}
				
				//新key信息
				var ukeysn="";
				var ukeycn="";
				//cn
				var cnrd=kbmGetCN(hand);
				if(!cnrd['ret']){
					$("#updateKeyHint").text(cnrd['errMsg']);
					$("#updateKeyHint").addClass('text-error');
					$("#updateKeyImg").hide();
					return false;
				}else{
					ukeycn=cnrd['cn'];
				}
				//sn
				var snrd=kbmGetSN(hand);
				if(!snrd['ret']){
					$("#updateKeyHint").text(snrd['errMsg']);
					$("#updateKeyHint").addClass('text-error');
					$("#updateKeyImg").hide();
					return false;
				}else{
					ukeysn=snrd['sn'];
				}
				
				
				var encert="";
				var sigcert="";
				//加密证书
				var encert_ret=kbmGetCert(hand, 0);
				if(encert_ret['ret']){
					encert=encert_ret['cert'];
				}else{
					$("#updateKeyHint").text(encert_ret['errMsg']);
					$("#updateKeyHint").addClass('text-error');
					$("#updateKeyImg").hide();
				}
				//签名证书
				var sigcert_ret=kbmGetCert(hand, 1);
				if(sigcert_ret['ret']){
					sigcert=sigcert_ret['cert'];
				}else{
					$("#updateKeyHint").text(sigcert_ret['errMsg']);
					$("#updateKeyHint").addClass('text-error');
					$("#updateKeyImg").hide();
				}
				
				
				url="/home/admng/upkey/"; 
				param={"uid":$("#upkeyuid").val(),"ukeysn":ukeysn,"ukeycn":ukeycn,"keyflag":keyfalg,"certlvl":upkeylvl,"encert":encert,"sigcert":sigcert,"dt":new Date().getTime()};
				var uprd=ajaxRequest(url,param);
				if(!uprd['ret']){
					$("#updateKeyHint").text(uprd['errMsg']);
					$("#updateKeyHint").addClass('text-error');
					$("#updateKeyImg").hide();
					return false;
				}  
				 
			}
			window.encryObjectList=[];
			$("#updateKeyHint").text("更换新key成功");
			$("#updateKeyImg").hide();
			$('#btnEscOK').hide();
			$("#btnOver").show();
			$("#upkeylvl").prop("disabled",true);
			$("#upkeypin").val("");
			$("#upkeypin").prop("disabled",true);
			
			$("#div_admname").hide();
			$("#div_admcertlvl").hide();
			$("#div_admpin").hide();
			$("#btn_up_cancel").hide();
			
			kbmReleaseHand(hand);
		}
		
		
	});
	
	$("#btnOver").bind('click', function() {
		$("#upUKModal").modal('hide');
		window.location.reload();
	});
	
	
});//end of ready function

function beforeDelAdm(admname, admid) {
	var gLoginName = $('#gLoginName').val();
	if (admname === gLoginName){
		//toastr.error("当前登录管理员不能删除自身！", "错误提示");
		myAlert('当前登录管理员不能删除自身！',"error");
		return false;
	}
	$('#dAdmID').val(admid);
	$('#dAdmName').val(admname);
	$('#admDeleteModal').modal('show');
}

function beforeActivePwd(admname, admid){
	
	$('#actvid').val(admid);
	$('#avAccount').val(admname);
	var ukIdType = $('#ukIdType').val();
	if (ukIdType == 'custom'){
		$('#avAccount').attr('disabled', true);
	}
	$('#actvPwdModal').modal('show');
}

function beforeActiveUK(admname, admid){

	var ukIdType = $('#ukIdType').val();
	if (ukIdType == 'custom') {
		$('#avukAccount').val(admname);
		$('#haccount').val(admname);		
	} else if (ukIdType == 'sn'){
		$('#avukAccount').val('SN字段');
	} else {
		$('#avukAccount').val('CN字段');
	}
	$('#actvukid').val(admid);	
	$('#actvLable').html('激活USBKEY认证');
	$('#avukAccount').attr('disabled', true);
	$("#actvUKForm [name='type']").val('active');
	$('#actvUKModal').modal('show');
}

function beforeEditAdm(username, alias, rid, dsp, id, login_type) {

	clearValidateMsg($('#admAddModal'));
	$('#admname').val(username);
	$('#admname').attr('disabled', true);
	$('#admalias').val(alias);
	$('#admname').val(username);
	$('#admdsp').val(dsp);
	$('#otype').val('edit');
	$('#admrole').val(rid);
	$('#admrole').attr('disabled', true);
	$('#admid').val(id);
	$('#myModalLabel').html('编辑管理员');
	$('#cbUkeyUser').attr('disabled', false);
	if (login_type !== '0') {
		// alert('fei')
		// hack :这而还需要调整，在firefox上表现不正常，IE是对的
		$('#cbUkeyUser').attr('checked', true);
	}else {
		$('#cbUkeyUser').attr('checked', false);
	}
	$('#fg-certlvl').hide();
	$('#fg-idtype').hide();
	$('#cbUkeyUser').attr('disabled', true);
	$('#fgpin').hide();
	$('#fgpw').hide();
	$('#fgpw2').hide();
	$('#admAddModal').modal('show');
}

function beforeChangeUK(username, admid,ukeytype,ukeylvl){
	$("#upkeyuid").val(admid);
	$("#upkeyAccount").attr('disabled', true);
	$("#upkeyAccount").val(username);
	$("#keyflag").val(ukeytype);
	
	$("#btnDescOK").show();
	$("#btnEscOK").hide();
	$("#btnOver").hide();
	$("#updateKeyImg").hide();
	$("#updateKeyHint").text("请插入旧的USBKEY，输入PIN码后点击确定。");
	$("#updateKeyHint").removeClass('text-error');
	$("#updateKeyImg").hide();
	$("#upkeylvl").val(ukeylvl);
	$("#upkeylvl").prop("disabled","true");
	$("#upkeypin").val("");
	$("#upkeypin").prop("disabled",false);
	
	$("#div_admname").show();
	$("#div_admcertlvl").show();
	$("#div_admpin").show();
	$("#btn_up_cancel").show();
			
	$('#upUKModal').modal('show');
}

//重置口令
function beforeResetPwd(admaccount){
	var obj = $('#resetPwdModal');
	clearValidateMsg(obj);
	clearModalMsg(obj);
	$('#rpAccount').val(admaccount);
	// $('#resetPasswd').val('');
	// $('#resetPasswdCommit2').val('');
	$('#resetPwdModal').modal('show');
}

$(document).ready(function(){
	var url="/home/admng/loadInnerbox/";
	var data={"dt":new Date().getTime()};
	var rd = ajaxRequest(url, data);
	if(rd['ret']){
		$("#keyuser").val(rd['keyuser']);
		if(rd['keyuser']){//登录账号为key用户
			if(!rd['descryflag']){//内置保险箱密钥未解开
				//flag:0：自定义，1：证书CN，2：证书SN
				var ukeytype=rd['ukeytype'];
				var flag=0;
				if(parseInt(ukeytype)==2){
					flag=1;
				}else if(parseInt(ukeytype)==3){
					flag=2;
				}
				var handret = kbmGetHand(rd['admname'], rd['admpin'], 0, rd['admlevel'], "", flag,rd['admname']);	
				if(!handret['ret']){
					//toastr.error(handret['errMsg'], "错误提示");
					myAlert(handret['errMsg'],"error");
					return false;
				}else{
					var hand=handret['hand'];
					var descryret=kbmDescrypt(hand,rd['esek']);
					if(!descryret['ret']){
						//toastr.error(descryret['errMsg'], "错误提示");
						myAlert(descryret['errMsg'],"error");
						return false;
					}else{
						$("#innerboxsek").val(descryret['data']);
						url="/home/admng/validateSig/";
						data={"sek":descryret['data'],"dt":new Date().getTime() };
						rd = ajaxRequest(url, data);
						if(!rd['ret']){
							//toastr.error(rd['errMsg'], "错误提示");
							myAlert(rd['errMsg'],"error");
							return false;
						}
					}
				}
			}else{
				$("#innerboxsek").val(rd['innerboxsek']);
			}
		}else{
			$("#innerboxsek").val(rd['innerboxsek']);
		}
		
	}else{
		//toastr.error(rd['errMsg'], "错误提示");
		myAlert(rd['errMsg'],"error");
		return false;
	}
});
