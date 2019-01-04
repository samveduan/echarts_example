function pwdlogin(loginName, passwd) {
	var loginStep = "auth_passwd";
	var date = {
		"loginName" : loginName,
		"passwd" : passwd
	};
	
	return ajaxLogin(loginStep, date);
}

function func_submit_login(){
	
	var loginName = "";
	var lrd = "";
	var passwd = $("#passwd").val();

	var verifymethod = $("#verifymethod").children('option:selected').val();
	if (verifymethod == "znk") {
		loginName = getUkLoginName(passwd);
		var clvlStr = $('#certlvl').val();
		var ilevel = parseInt(clvlStr);
		if (!loginName)	{
			_resetLogin();
			return false;
		}
		var authtype=$("#authtype").val();
		if(authtype=="005" || authtype=="903f"){
			if(authtype==""){
				myAlert("请配置认证类型！", "error");
				_resetLogin();
				return false;
			}
			var rd = kmjmanRandom();
			if (rd['ret'] != true) {
				myAlert(rd['errMsg'], "error");
				_resetLogin();
				return false;
			}
			var pRandom = rd['random'];//获取随机数
			if(getSystem() !="Linux"){//windows
				if(authtype=="005"){
					var psecIp=formatServerIP();
					//var psecIp=$("#authip").val();
					lrd=kbmSecClientToken(psecIp,passwd,ilevel,loginName,pRandom,func_usblogin);
				}else{//903f
					lrd=KbmSecClientToken903F(ilevel,passwd,pRandom,loginName,func_usblogin);
				}
			}else{
				
			}
		}else{
			lrd = usblogin(loginName, passwd);
		}
		
	} else {
		loginName = $("#loginName").val();
		lrd = pwdlogin(loginName, passwd);
	}
	if (!lrd['ret']) {
		myAlert(lrd['errMsg'], "error");
		_resetLogin();
		return false;
	} else {
		$("#loginForm").submit();
	}
}


