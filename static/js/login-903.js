ukmap = {
	'custom' : 0,
	'sn' : 1,
	'cn' : 2
};

function checkUkeyIdType(type) {
	$('#seclvlModal [name="idtype"]').each(function() {
		if ($(this).val() == type) {
			$(this).prop('checked', true);
		}
	});
}

function changeUkeyIdType(type) {
	addCookie('idtype', type, 100);

	if (type !== 'custom') {
		$('#guserName').hide();
	} else {
		$('#guserName').show();
	}
	$('#ukType').val(type);
}

function getUkeyHand(){
	var userid = $('#loginName').val();
	var pin = $("#admpin").val();
	var devnum = 0;
	var ilevel = parseInt($('#certlvl').val());
	var container = "";
	var regukeytype = $('#regukeytype').val();
	//验证证书是否是商密key
	if(regukeytype=="csp"){
		container=getActiveContainer(0);
	}
	var ukidtype = $('#ukType').val();
	var flag = ukmap[ukidtype];
	var rd = kbmGetHand(userid, pin, devnum, ilevel, container, flag);
	return rd;		
}

function displayVerifyMethod(type) {
	$('#passwd').val('');
	var val = type;
	if (val == 'kl') {
		$('#guserName').show();
		$('#divSet').hide();
		$('#lpasswd').html('口 令：');
		addCookie('verifymethod', 'kl', 100);
	} else {
		addCookie('verifymethod', 'znk', 100);
		var ukType = $('#ukType').val();
		if (ukType == 'custom') {
			$('#guserName').show();
		} else {
			$('#guserName').hide();
		}
		$('#divSet').show();
		var regukeytype = $('#regukeytype').val();
		if(regukeytype=="csp" || regukeytype=="sm"){
			$("#div_certlvl").css("display","none");
		}
		
		$('#lpasswd').html('PIN 码：');
		if (!detectIE()) {
			//myAlert("请使用IE浏览器！", "error");
			//return false;
		}

		var detected = detected903Activex();
		if (!detected) {
			myAlert("未检测到控件，请正确安装控件！", "error");
			// $('#activexModal').modal('show');
		}
		//添加cookie全局范围
		addCookie('path', '/', 100);
	}
}

function ajaxLogin(loginStep, date) {
	// var defer = $.Deferred();
	var url = "/devadm/accounts/" + loginStep + "/";
	var dict = {
		'ret' : false,
		'errMsg' : '登录失败'
	};
	var jsonDate = date;
	dict=ajaxRequest(url, jsonDate);
	return dict;
	 
	// return defer.promise();
}

//auth passwd
function loginAuthPasswd(loginName, passwd) {
	var loginStep = "auth_passwd";
	var date = {
		"loginName" : loginName,
		"passwd" : passwd
	};
	return ajaxLogin(loginStep, date);
}

//auth token
function loginAuthToken(userType, loginName, passwd) {
	var rd = kmjmanRandom();
	if (rd['ret'] != true) {
		return rd;
	}
	var gtrd;
	var random = rd['random'];
	if(getSystem()=="Linux"){//linux
		
		var tokenret=keyGetTokenByPin(random,passwd);
		if(tokenret['ret'] != true){
			return tokenret;
		}else{
			gtrd = tokenret;
		}
	}else{//windows
		gtrd = keyGetToken(random);
		if (gtrd['ret'] != true) {
			return gtrd;
		}
	}
	
	var token = gtrd['token'];
	var certlvl = $('#certlvl').val();
	var url = "/auth/vtoken/";
	var date = {
		"userType" : userType,
		"random" : random,
		"token" : token,
		"certlvl" : certlvl
	};

	return ajaxRequest(url, date);
}

//vtoken 回调
function func_loginAuthToken(random, token) {
	var certlvl = $('#certlvl').val();
	var url = "/auth/vtoken/";
	var date = {
		"userType" : "kmjadm",
		"random" : random,
		"token" : token,
		"certlvl" : certlvl
	};

	return ajaxRequest(url, date);
}

function getAdmUkeyHand(){
	var userid = $('#loginName').val();
	var pin = $("#passwd").val();
	var devnum = 0;
	var clvlStr = $('#certlvl').val();
	var ilevel = parseInt(clvlStr);
	var container = "";
	var ukidtype = $('#ukType').val();
	//验证证书是否是商密key
	var regukeytype = $('#regukeytype').val();
	var authtype=$("#authtype").val();
	if(regukeytype=="csp"){
		container=getActiveContainer(0);
	}
	var flag = ukmap[ukidtype];
	var rd = kbmGetHand(userid, pin, devnum, ilevel, container, flag,"");
	return rd;
}

function getUkLoginName(pin) {
	var ukType = $('#ukType').val();
	var ln = "";

	if (ukType == "custom"){
		ln = $('#loginName').val();
	} else if(ukType == "sn") {
		var hrd = getAdmUkeyHand();
		if (!hrd['ret']){
			myAlert(hrd['errMsg'], "error");
			return false;
		}
		hand = hrd['hand'];
		var rd = kbmGetSN(hand);
		if (!rd['ret']) {
			kbmReleaseHand(hand);
			myAlert(rd['errMsg'], "error");
			return false;
		}
		kbmReleaseHand(hand);
		ln = rd['sn'];
	} else {
		var hrd = getAdmUkeyHand();
		if (!hrd['ret']){
			myAlert(hrd['errMsg'], "error");
			return false;
		}
		hand = hrd['hand'];
		var rd = kbmGetCN(hand);
		if (!rd['ret']) {
			kbmReleaseHand(hand);
			myAlert(rd['errMsg'], "error");
			return false;
		}
		kbmReleaseHand(hand);
		ln = rd['cn'];
	}
	return ln;
}

function loginVerifyCert(loginName, passwd) {
	var ghrd = getAdmUkeyHand();
	if (!ghrd['ret']){
		return ghrd;
	}
	var hand = ghrd['hand'];
	//验证证书是否是商密key
	var regukeytype = $('#regukeytype').val();
	var authtype=$("#authtype").val();
	var rd ;
	if(regukeytype == "csp"){//商用key
		rd = getCertBase64(hand, 0);
	}else{
		rd = kbmGetCert(hand, 0);
	}
	if(!rd['ret']){
		rd['errMsg'] = '获取加密证书失败，' + rd['errMsg'];
		return rd;
	}
	var ecert = rd['cert'];
	var srd;
	if(regukeytype == "csp"){//商用key 非商密
		srd = getCertBase64(hand, 1);
	}else{
		srd = kbmGetCert(hand, 1);
	}
	if(!srd['ret']){
		rd['errMsg'] = '获取签名证书失败，' + rd['errMsg'];
		return rd;
	}
	
	var container="";
	if(regukeytype=="csp"){
		var container_res=getActiveContainer(0);
		if(container_res['ret']){
			container=container_res['container'];
		}else{
			rd['errMsg'] = container_res['errMsg'];
			return rd;
		}
	}
	kbmReleaseHand(hand);
	var scert = srd['cert'];
	var clvlStr = $('#certlvl').val();
	var data = {
		'ecert' : ecert,
		'scert' : scert,
		'loginName' : loginName,
		'pin' : passwd,
		'container':container,
		'ukeytype':regukeytype,
		'certLvl':clvlStr
	};
	
	var url = '/auth/vcert/';
	return ajaxRequest(url, data);
}

function func_usblogin(accout, passwd,random,token) {
	var loginName = accout;
	//验证证书是否是商密key
	var regukeytype = $('#regukeytype').val();
	var rd;
	if(regukeytype != "csp"){
		rd = func_loginAuthToken(random,token);
	    if(rd['ret'] != true){
			return rd;
		}
	}	
	rd = loginVerifyCert(loginName, passwd);
	return rd;
}

function usblogin(accout, passwd) {
	var loginName = accout;
	//验证证书是否是商密key
	var regukeytype = $('#regukeytype').val();
	var rd;
	if(regukeytype != "csp"){
		rd = loginAuthToken('kmjadm', loginName, passwd);
	    if(rd['ret'] != true){
			return rd;
		}
	}	
	rd = loginVerifyCert(loginName, passwd);
	return rd;
}

function _preparLogin() {
	// $('#subBtn').attr('readonly', 'readonly');
	$('#subBtn').hide();
	// $('#onloginBtn').show();
	// $('#subBtn').prop('disabled', true)
}

function _resetLogin() {
	// $('#subBtn').attr('disabled', false);
	$('#subBtn').show();
	// $('#onloginBtn').hide();
}


$(function() {

	$('#verifymethod').change(function() {
		var val = $(this).children('option:selected').val();
		displayVerifyMethod(val);
	});
	
	$('#seclvlModal [name="idtype"]').bind('change', function() {
		var type = $(this).val();
		changeUkeyIdType(type);
	});

	var certlvl = getCookie('certlvl');
	if (certlvl == '') {
		certlvl = '3';
	}
	//商用key 证书等级设置为1
	var regukeytype = $('#regukeytype').val();
	if(regukeytype=="csp" || regukeytype=="sm"){
		certlvl=1;
	}
	var idtype = getCookie('idtype');
	if (idtype == '') {
		idtype = $('#ukType').val();
	}
	// alert(idtype)
	$('#certlvl').val(certlvl);
	checkUkeyIdType(idtype);
	changeUkeyIdType(idtype);
	

	
	var myForm = $("#loginForm");
	myForm.validation();


	$('#subBtn').bind('click', function() {
		_preparLogin();
		if (!myForm.validate()) {
			_resetLogin();
			return false;
		}
		func_submit_login();
	});
	
});


	

