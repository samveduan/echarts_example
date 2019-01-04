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
		var key_authtype=$("#authtype").val();
		if(key_authtype=="baist_secclient"){//远程在线认证
			var pin = $("#passwd").val();
			lrd=KbmSecClientZB(pin,admname,func_zb_usblogin);
			
		}else{//根证书认证
			//客户端验证服务器的签名
			
			var hrd = getAdmUkeyHand();
			if(!hrd['ret']){
				myAlert(hrd['errMsg']);
				//return hrd;
				return false;
			}
			//控件随机数
			var random_ret=KpfKeyGetRandom(hrd['hand'],64);
			if(!random_ret['ret']){
				myAlert(random_ret['errMsg']);
				//return random_ret;
				return false;
			}
			var client_random=random_ret['random'];
			
			//客户端16进制签名证书
			var signcert_ret= kbmGetCert(hrd['hand'], 1);
			if(!signcert_ret['ret']){
				signcert_ret['errMsg'] = '获取签名证书失败，' + signcert_ret['errMsg'];
				//return signcert_ret;
				return false;
			}
			var sign_cert=signcert_ret['cert'];
			//客户端标识
			var certUid_ret=KpfKeyGetCertUid(hrd['hand']);
			if(!certUid_ret['ret']){
				myAlert(certUid_ret['errMsg']);
				//return hrd;
				return false;
			}
			var client_id = certUid_ret['certuid'];
			var pin = $("#passwd").val();
			var param={"client_random":client_random,"client_id":client_id,"pin":pin,"dt":new Date().getTime() };
			var url = "/devadm/kmjconf/keyauth/verifySign/";
			var server_sign_ret=ajaxRequest(url,param);
			if(!server_sign_ret['ret']){
				myAlert(server_sign_ret['errMsg']);
				//return server_sign_ret;
				return false;
			}else{
				var server_random=server_sign_ret['server_random'];
				var server_sign=server_sign_ret['server_sign'];
				var pInData=client_id+server_random+client_random;
				var client_validate_sign=KpfKeyExtCertVerifySign(hrd['hand'],server_sign_ret['server_sigcert'],pInData,server_sign);
				if(!client_validate_sign['ret']){
					myAlert(client_validate_sign['errMsg']);
					//return client_validate_sign;
					return false;
				}
				
				//服务器验证客户端的签名
				//客户端把服务端标识（IDs）、客户端随机数（Rc）、服务端随机数（Rs）进行签名（SIGc），然后把SIGc和IDc发送给服务器；
				var server_id=server_sign_ret['server_id'];
				var pServerIn=server_id+client_random+server_random;
				var sign_ret=KpfKeySignData(hrd['hand'],pServerIn);
				if(!sign_ret['ret']){
					myAlert(sign_ret['errMsg']);
					//return sign_ret;
					return false;
				}
				var sign_data=sign_ret['sign_data'];
				//客户端把服务端标识（IDs）、客户端随机数（Rc）、服务端随机数（Rs）进行签名（SIGc），然后把SIGc和IDc发送给服务器；
				/**
				 *ukey_ext_cert_verify_sign_data
				 * 参数：iCardIndex<int>, iCertLevel<int>, bPin<string>, bContainerName<string>, bin_cert<string>,  src_data<string>,  sign_data<string>
				 * 第一个值int，Key的序号（支持多张Key）
				 * 第二个值int，证书级别
				 * 第三个值string，pin码。
				 * 第四个值string，容器名。
				 * 第五个值string，证书数据。
				 * 第六个值string,  源数据。
				 * 第七个值string，签名数据值。返回值：(ret<int>)第一个值，接口返回值， 0表示成功。 
				 */
				param={"devnum":0,"certLvl":$("certlvl").val(),"pin":pin,"sign_cert":sign_cert,"src_data":pServerIn,"sign_data":sign_data,"dt":new Date().getTime() };
				var url = "/devadm/kmjconf/keyauth/verifyServerSign/";
				var server_validate_sign_ret=ajaxRequest(url,param);
				if(!server_validate_sign_ret['ret']){
					myAlert(server_validate_sign_ret['errMsg']);
					//return server_validate_sign_ret;
					return false;
				}
				
				lrd = loginVerifyCert(admname, pin);
				//return vcert_rd;
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