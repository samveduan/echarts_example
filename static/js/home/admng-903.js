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
		if(ukeytype !="business_key"  && ukeytype !="sm"){
			$('#fg-certlvl').show();
		}else{
			$('#fg-certlvl').hide();
			$("#certlvl").val("1");
		}		
		$('#fgpw').hide();
		$('#fgpw2').hide();
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
		var devnum = 0;
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
	$("#admAddForm [name='ukcn']").val(cnrd['cn']);
	
	if(ukeytype=="sm"){
		var sig_pubkey=kbmGetPubkey(hand,1);
		if(sig_pubkey['ret']){
			$("#admAddForm [name='sig_pubkey']").val(sig_pubkey['pubkey']);
		}else{
			myAlert(sig_pubkey['errMsg'],"error");
			return false;
		}
		
		var b64Cert=getCertBase64(hand, 1);
		if(!b64Cert['ret']){
			myAlert('获取签名证书失败，' + b64Cert['errMsg']);
			return false;
		}else{
			var url="/home/admng/verifySMCert/";
			var param={"admcert":b64Cert['cert'],"dt":new Date().getTime()};
			var validate_ret=ajaxRequest(url, param);
			if(!validate_ret['ret']){
				myAlert(validate_ret['errMsg']);
				return false;
			}else{
				kbmReleaseHand(hand);
				
				var myForm = $('#admAddForm');
				var url = '/home/upadm/903/';
				myForm.attr('action', url);
				myForm.submit();
			}
		}
		
		
	}else{
		kbmReleaseHand(hand);
		var myForm = $('#admAddForm');
		var url = '/home/upadm/903/';
		myForm.attr('action', url);
		myForm.submit();
	}
	
	
	
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
	var type = $(this).attr('for')
	showAccountItem(type);
	
});

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
	if(ukeyType != 'none'){
		var detected = detected903Activex();
		if (!detected){
			//toastr.error("未检测到控件，请正确安装控件", "错误提示");
			myAlert('未检测到控件，请正确安装控件',"error");
		}
	}

	$('#btnAddAdm').bind('click', function() {
		$("#notice_messages").empty();
		var obj = $('#admAddModal');
		clearValidateMsg(obj);
		clearModalMsg(obj);
		$('#admname').attr('disabled', false);
		$('#otype').val('add');
		$('#admrole').attr('disabled', false);
		$('#cbUkeyUser').attr('disabled', false);
		$('#cbUkeyUser').attr('checked', false);
		changeShowKeyItem(false);
		//$('#fg-certlvl').show();
		$('#myModalLabel').html('创建管理员');
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
		//key类型  0口令 1自定义 2cn 3sn		
		var ukidtype =  $("#actvUKForm [name='ukeytype']").val();
		var flag = 0;
		if(ukidtype != 0){
			flag=ukidtype - 1;
		}
		//用户句柄：flag 0 自定义，1 证书CN，2 证书SN
		var ghrd = kbmGetHand(userid, pin, devnum, certLevel, container, flag,"");
		if (!ghrd['ret']){
			//toastr.error('控件错误，' + rd['errMsg'], "错误提示");
			myAlert('控件错误，' + rd['errMsg'],"error");
			return ghrd;
		}
		var hand = ghrd['hand'];
		var rd;
		if(ukeyType=="business_key"){//商用key
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
		//  toastr.error('获取加密证书失败，' + rd['errMsg'], "错误提示");
		///	return false;
		//}
		$("#actvUKForm [name='ecert']").val(rd['cert']);
		var srd;
		if(ukeyType=="business_key"){//商用key
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
		
		
		$("#actvUKForm [name='scert']").val(srd['cert']);
		
		var snrd = kbmGetSN(ghrd['hand']);
		if (!snrd['ret']) {
			myAlert(snrd['errMsg'],"error");
			return false;
		}else{
			$("#actvUKForm [name='ukeysn']").val(snrd['sn']);
		}
		if (ukidtype == 3){//sn账户
			var sn = snrd['sn'];
			$("#actvUKForm [name='haccount']").val(sn);
		}
		
		if(ukidtype == 2){//cn账户
			var cnrd=kbmGetCN(ghrd['hand']);
			if(cnrd['ret']){
				var cn=cnrd['cn'];
				$("#actvUKForm [name='haccount']").val(cn);
			}else{
				myAlert(cnrd['errMsg'],"error");
				return false;
			}
		}
		
		if(ukeyType=="sm"){//商密key
			var sig_pubkey=kbmGetPubkey(hand,1);
			if(sig_pubkey['ret']){
				$("#actvUKForm [name='sig_pubkey']").val(sig_pubkey['pubkey']);
			}else{
				myAlert(sig_pubkey['errMsg'],"error");
				return false;
			}
			
			var b64Cert=getCertBase64(hand, 1);
			if(!b64Cert['ret']){
				myAlert('获取签名证书失败，' + b64Cert['errMsg']);
				return false;
			}else{
				var url="/home/admng/verifySMCert/";
				var param={"admcert":b64Cert['cert'],"dt":new Date().getTime()};
				var validate_ret=ajaxRequest(url, param);
				if(!validate_ret['ret']){
					myAlert(validate_ret['errMsg']);
					return false;
				}else{
					var url = '/home/actvuk/';
					myActvUKForm.attr('action', url);
					myActvUKForm.submit();
					return false;	             //this line is very important, it will be a huge bug if here return true;	
				}
			}
		}else{
			var url = '/home/actvuk/';
			myActvUKForm.attr('action', url);
			myActvUKForm.submit();
			return false;	             //this line is very important, it will be a huge bug if here return true;	
		}
		
	});
});

function beforeDelAdm(admname, admid) {
	$("#notice_messages").empty();
	var gLoginName = $('#gLoginName').val();
	if (admname === gLoginName){
		//toastr.error("当前登录管理员不能删除自身", "错误提示");
		myAlert('当前登录管理员不能删除自身',"error");
		return false;
	}
	$('#dAdmID').val(admid);
	$('#dAdmName').val(admname);
	$('#admDeleteModal').modal('show');
}

function beforeActivePwd(admname, admid){
	$("#notice_messages").empty();
	$('#actvid').val(admid);
	$('#avAccount').val(admname);
	var ukIdType = $('#ukIdType').val();
	if (ukIdType == 'custom'){
		$('#avAccount').attr('disabled', true);
	}
	$('#actvPwdModal').modal('show');
}

function beforeActiveUK(admname, admid){
	$("#notice_messages").empty();
	$("#actvUKForm [name='ukeytype']").val("1");
	$('#avukAccount').val(admname);
	$("#actvUKForm [name='haccount']").val(admname);	
	var ukeytype=$("#ukeyType").val();
	if(ukeytype == "sm"){
		$("#div_uk_certlvl").hide();
	}
	
	$('#actvukid').val(admid);	
	$('#actvLable').html('激活USBKEY认证');
	$('#avukAccount').attr('disabled', true);
	$("#actvUKForm [name='type']").val('active');
	$('#actvUKModal').modal('show');
}

function beforeEditAdm(username, alias, rid, dsp, id, login_type) {
	$("#notice_messages").empty();
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

function beforeChangeUK(username, admid,ukeytype,certlvl){
	$("#notice_messages").empty();
	if (ukeytype == 1) {
		$('#avukAccount').val(username);
		$("#actvUKForm [name='haccount']").val(username);
	} else if (ukeytype == 2){
		$('#avukAccount').val('CN用户');
	} else {
		$('#avukAccount').val('SN用户');
	}
	$("#actvUKForm [name='ukeytype']").val(ukeytype);
	$('#actvukid').val(admid);
	$('#actvLable').html('更换USBKEY');
	$("#actvUKForm [name='type']").val('update');
	$('#avukAccount').attr('disabled', true);
	$("#actvUKForm [name='admpin']").val("");
	
	var ukeytype=$("#ukeyType").val();
	if(ukeytype !="business_key" && ukeytype !="sm"){
		$('#div_uk_certlvl').show();
	}else{
		$('#div_uk_certlvl').hide();
		$("#acertlvl").val("1");
	}		
	
	$('#actvUKModal').modal('show');
}
