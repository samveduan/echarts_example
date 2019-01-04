
function displayVerifyMethod(type) {
	$('#passwd').val('');
	var val = type;
	if (val == 'kl') {
			$('#guserName').show();
			$('#lpasswd').html('口 令：');
		} else {
			$('#guserName').hide();
			$('#lpasswd').html('PIN 码：');
		}
		
		var detected = detectedActivex();
		if (!detected){
//			toastr.error("未检测到控件，请正确安装控件！", "错误提示");
			myAlert('未检测到控件，请正确安装控件！',"error");
			// $('#activexModal').modal('show');
		}
}

$(function() {
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

	function base64encode(str) {
		var out = "", i = 0, len = str.length, c1, c2, c3;

		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}

			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}

			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}

	function base64decode(str) {
		var c1, c2, c3, c4, i = 0, len = str.length, out = "";

		while (i < len) {
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while(i < len && c1 == -1);
			if (c1 == -1)
				break;

			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while(i < len && c2 == -1);
			if (c2 == -1)
				break;

			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61)
					return out;
				c3 = base64DecodeChars[c3];
			} while(i < len && c3 == -1);
			if (c3 == -1)
				break;

			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61)
					return out;
				c4 = base64DecodeChars[c4];
			} while(i < len && c4 == -1);
			if (c4 == -1)
				break;

			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	}


	$("#certLevel").val($("#certLevel").attr('defval'));
	if ($("#loginName").val().length == 0) {
		$("#loginName").focus();
	} else {
		$("#passwd").focus();
	}
	function ajaxLogin(loginStep, date) {
		var url = "/devadm/accounts/" + loginStep + "/";
		var dict = {
			'ret' : false,
			'errMsg' : '登录失败'
		};
		var jsonDate = date;
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			data : jsonDate,
			dataType : 'json',
			timeout : 10000,
			success : function(obj) {
				dict = obj;
			},
			error : function() {

			}
		});
		return dict;
	}

	function loginAuthPasswd(loginName, passwd) {
		var loginStep = "auth_passwd";
		var date = {
			"loginName" : loginName,
			"passwd" : passwd
		};
		return ajaxLogin(loginStep, date);
	}

	function loginGetSidCh(loginName) {
		var loginStep = "serverinfo";
		var date = {
			"loginName" : loginName,
		};
		return ajaxLogin(loginStep, date);
	}

	// added by gxd.kylin
	logger = ( function() {
			if ( typeof console !== 'undefined' && console !== null) {
				return console;
			} else if (window.console) {
				return window.console;
			} else {
				return {
					log : function() {
						return;
					}
				};
			}
		}());
	function loginGenSK(uid, uk, s_id, s_tfm_ch) {
		var u_ch = uk.random();
		
		var param ='AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
 			   		'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
 			   		'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
 			   		'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
 			   		'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
		var u_tfm_ch = uk.transform(param, u_ch, 'bbbb');
	
		var sk = uk.transform(s_tfm_ch, u_ch, 'bbbb');
		
		var u_tfm_ch_str = base64decode(u_tfm_ch); 
		var s_tfm_ch_str = base64decode(s_tfm_ch);	
		
		var msgData = uid.toString() + u_tfm_ch_str + s_id.toString() + s_tfm_ch_str;
		
		var b64data = base64encode(msgData); // Base64.encode(msgData);
	
		var Su = uk.signature(b64data);

		var Mu = uk.symencrypt(sk, Su);

		var retd = {
			'ret' : true,
			'sk' : sk,
			'Mu' : Mu,
			'u_tfm_ch' : u_tfm_ch,
			'args' : b64data
		};
		return retd;
	}

	function loginSverifyU(loginName, u_tfm_ch, Mu, args) {
		var loginStep = "sverifyu";
		var date = {
			"loginName" : loginName,
			"u_tfm_ch" : u_tfm_ch,
			"Mu" : Mu,
			"args" : args
		};
		return ajaxLogin(loginStep, date);
	}

	function loginUverifyS(uk, sk, Ms, args) {
		var Ss = uk.symdecrypt(sk, Ms);

		var msgData = args[0] + args[1] + args[2];
		var b64data = base64encode(msgData); 

		var s_pk = uk.get_s_pk();
		var verified = uk.verify(s_pk, Ss, b64data);
		return verified;
	}

	function usblogin(passwd) {
		var retd = {
			'ret' : false,
			'errMsg' : ''
		};
		try {
			var uk = new U_USBKey(passwd);
			var uid = uk.get_u_id();
		} catch (e) {
			retd['errMsg'] = '打开设备失败';
			return retd;
		}

		var rd = loginGetSidCh(uid);
		if (!rd['ret']) {
			return rd;
		}

		var s_id = rd['data']['s_id'];
		var s_tfm_ch = rd['data']['s_tfm_ch'];

		try {
			var genskrd = loginGenSK(uid, uk, s_id, s_tfm_ch);
			
		} catch (e) {
			retd['errMsg'] = '生成会话密钥失败';
			return retd;
		}

		var u_tfm_ch = genskrd['u_tfm_ch'];
		var Mu = genskrd['Mu'];
		var sk = genskrd['sk'];
		var args = genskrd['args'];



		var svurd = loginSverifyU(uid, u_tfm_ch, Mu, args);
		if (!svurd['ret']) {
			return svurd;
		}

		var Ms = svurd['data']['Ms'];
		var args = [uid.toString(), base64decode(u_tfm_ch), base64decode(s_tfm_ch)];

		try {
			var uvsrd = loginUverifyS(uk, sk, Ms, args);
		} catch (e) {
			retd['errMsg'] = '控件异常';
			return retd;
		}
		if (!uvsrd) {
			retd['errMsg'] = '认证服务器失败';
			return retd;
		}
		retd['ret'] = true;
		return retd;
	}

	function pwdlogin(loginName, passwd) {
		var loginStep = "auth_passwd";
		var date = {
			"loginName" : loginName,
			"passwd" : passwd
		};
		return ajaxLogin(loginStep, date);
	}

	var myForm = $("#loginForm");
	myForm.validation();

	function _preparLogin() {
		$('#subBtn').hide();
		// $('#subBtn').attr('disabled', true);
	}

	function _resetLogin() {
		$('#subBtn').show();
		// $('#subBtn').attr('disabled', false);
	}


	$('#subBtn').bind('click', function() {
		_preparLogin();
		if (!myForm.validate()) {
			_resetLogin();
			return false;
		}

		var loginName = "";
		var lrd = "";
		var passwd = $("#passwd").val();

		var verifymethod = $("#verifymethod").children('option:selected').val();
		if (verifymethod == "znk") {
			lrd = usblogin(passwd);
		} else {
			loginName = $("#loginName").val();
			lrd = pwdlogin(loginName, passwd);
		}

		if (!lrd['ret']) {
			myAlert(lrd['errMsg'], "error");
//			toastr.error(lrd['errMsg'], "错误提示");
			_resetLogin();
			return false;
		} else {
			return true;
		}
	});

	$('#loginSetLink').bind('click', function() {
		$("#loginSetModal").modal('show');
		return false;
	});

	$('#loginSetBtn').bind('click', function() {
		$("#loginSetModal").modal('hide');
	});

	$('#verifymethod').change(function() {
		var val = $(this).children('option:selected').val();
		displayVerifyMethod(val);
	});
});

