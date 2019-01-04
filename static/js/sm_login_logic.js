function pwdlogin(loginName, passwd) {
	var loginStep = "auth_passwd";
	var date = {
		"loginName" : loginName,
		"passwd" : passwd
	};
	
	return ajaxLogin(loginStep, date);
	 // $.when(ajaxLogin(loginStep, date)).done(function(data){
        // $(".loadingicon").hide();
        // alert(data);
        // return data
    // });

}

function func_submit_login(){
	var lrd;
	var verifymethod = $("#verifymethod").children('option:selected').val();
	if (verifymethod == "znk") {
		var admname=getUkLoginName();
		var hrd = getAdmUkeyHand();
		if(!hrd['ret']){
			_resetLogin();
			myAlert(hrd['errMsg']);
			return false;
		}
		var hand=hrd['hand'];
		var b64Cert=getCertBase64(hand, 1);
		if(!b64Cert['ret']){
			_resetLogin();
			myAlert(b64Cert['errMsg']);
			return false;
		}else{
			var url="/home/admng/verifySMCert/";
			var param={"admcert":b64Cert['cert'],"dt":new Date().getTime()};
			var validate_ret=ajaxRequest(url, param);
			if(!validate_ret['ret']){
				_resetLogin();
				myAlert(validate_ret['errMsg']);
				return false;
			}else{
				
				var signcert_ret= kbmGetCert(hrd['hand'], 1);
				if(!signcert_ret['ret']){
					_resetLogin();
					myAlert(signcert_ret['errMsg']);
					return false;
				}
				var sign_cert=signcert_ret['cert'];
				
				//客户端16进制签名证书
				var url = '/auth/get_sm_random/';
				var param={"dt":new Date().getTime()};
				var hand_result=ajaxRequest(url,param);
				if(!hand_result['ret']){
					_resetLogin();
					myAlert(hand_result['errMsg']);
					return false;
				}else{
					var random=hand_result['random'];
					var sign_res=KpfKeySignData(hrd['hand'],random);
					if(!sign_res['ret']){
						_resetLogin();
						myAlert(sign_res['errMsg']);
						return false;
					}else{
						var sign_data=sign_res['sign_data'];
						var url = '/auth/verify_sm_challenge/';
						var param={"admname":admname,"sign_data":sign_data,"dt":new Date().getTime()};
						var verify_res=ajaxRequest(url,param);
						if(!verify_res['ret']){
							_resetLogin();
							myAlert(sign_res['errMsg']);
							return false;
						}else{
							var pin = $("#passwd").val();
							lrd = loginVerifyCert(admname, pin);			
							if (!lrd['ret']) {
								myAlert(lrd['errMsg'], 'error');
								_resetLogin();
								return false;
							}else {
								$("#loginForm").submit();
							}
						}
						
					}
				}
			}
		}
		
		
		
		
	}else{
		loginName = $("#loginName").val();
		var passwd = $("#passwd").val();
		lrd = pwdlogin(loginName, passwd);
	}
	if (!lrd['ret']) {
		myAlert(lrd['errMsg'], 'error');
		_resetLogin();
		return false;
	} else {
		$("#loginForm").submit();
	}
}

function func_zb_usblogin(accout, passwd) {
	var loginName = accout;
	//验证证书是否是商密key
	var loginName=$("#loginName").val();
	var param={"loginName":loginName};
	var url="/devadm/kmjconf/keyauth/verifyAuth/";
	var result=ajaxRequest(url,param);
	if(!result['ret']){
		return result;
	}else{
		var rd=loginVerifyCert(loginName, passwd);
		return rd;
	}
	
}