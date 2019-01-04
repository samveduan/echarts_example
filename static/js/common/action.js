/*
 * icon-chevron-right > -456px -72px;
 * icon-chevron-down  -313px -119px;
 * icon-arrow-right -> -264px -96px;
 * icon-share-alt -240px -144px;
 *
 *
 */

var _isIe = 0;
if ("ActiveXObject" in window) {
	_isIe = 1;
}

if (getSystem() == "Linux") {
	_isIe = 1;
}

var AJAX_TIMEOUT = 0;

function detectedActivex() {
	var vmethod = $('#verifymethod').children('option:selected').val();
	if (vmethod == 'znk') {
		if (_isIe) {
			try {
				var a = KtsActivex.get_last_err();
			} catch(e) {
				return false;
			}
		}
	}
	return true;
}

function detectIE() {
	//飞腾操作系统、Kylin3.2-5
	if (getSystem() == "Linux") {
		return true;
	}
	if ("ActiveXObject" in window) {
		return true;
	} else {
		return false;
	}
}

function addCookie(name, value, expireDays) {
	var cookieString = name + "=" + value;
	if (expireDays > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000);
		cookieString = cookieString + "; expires=" + date.toGMTString();
		cookieString += ";path=/";
	}
	document.cookie = cookieString;
}

function setExpireDays(days) {
	var date = new Date();
	var expiredDays = days;
	date.setTime(date.getTime() + expiredDays * 24 * 3600 * 1000);
	var oldstr = document.cookie;
	var expirestr = "expires=" + date.toGMTString();
	var finalstr = oldstr + ';' + expirestr;
	document.cookie = finalstr;
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

/*根据掩码，判断两个ip是否在同一个网段*/
function isEqualIPAddress (addr1, addr2 ,mask){
	if(!addr1 || !addr2 || !mask){
		alert("各参数不能为空");
		return false;
	}
	var res1 = [], res2 = [];
	addr1 = addr1.split(".");
	addr2 = addr2.split(".");
	mask = mask.split(".");

	for(var i = 0, ilen = addr1.length; i < ilen ; i += 1){
		res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
		res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
	}

	if(res1.join(".") == res2.join(".")){
		//alert("在同一个网段");
		return true;
	}else{
		//alert("不在同一个网段");
		return false;
	}
}

function detected903Activex() {
	try {
		var rd=validateKbmActivex();
		if(!rd['ret']){
			myAlert(rd['errMsg'],"error");
			return false;
		}
	} catch(e) {
		return false;
	}

	return true;
}

function clearModalMsg(obj) {
	obj.find('.form-control').each(function() {
		$(this).val('');
	});
}

function getJsontEntryByKeyVaule(list, key, value) {
	for (var i = 0; i < list.length; i++) {
		var tmp = list[i];
		if (tmp[key] == value) {
			return tmp;
		}
	}
	return null;
}

function getJsonEntryById(list, id) {
	return getJsontEntryByKeyVaule(list, 'id', id);
}

function transDeviceName(deviceName) {
	return deviceName.replace(/\//g, '_');
}

function showPwdModal() {
	var url = window.location.pathname;
	$('#curURL').val(url);
	$('#changePwdModal').modal('show');
}

function showModal(obj) {
	var timeout = $('#sessionTimeoutModal [id="hidd_timetou"]').val();
	$('#sessionTimeoutModal [name="timeout"]').val(timeout);
	$(obj).modal('show');
}

/*自定义confirm提示框*/
$(function() {
	window.Modal = function() {
		var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
		var alr = $("#confirm_alert_id");

		var ahtml = alr.html();

		//关闭时恢复 modal html 原样，供下次调用时 replace 用
		// var _init = function () {
		// alr.on("hidden.bs.modal", function (e) {
		// $(this).html(ahtml);
		// });
		// }();

		/* html 复原不在 _init() 里面做了，重复调用时会有问题，直接在 _alert/_confirm 里面做 */

		var _alert = function(options) {
			alr.html(ahtml);
			// 复原
			alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
			alr.find('.cancel').hide();
			_dialog(options);

			return {
				on : function(callback) {
					if (callback && callback instanceof Function) {
						alr.find('.ok').click(function() {
							callback(true);
						});
					}
				}
			};
		};

		var _confirm = function(options) {
			alr.html(ahtml);
			// 复原
			alr.find('.ok').removeClass('btn-primary').addClass('btn-success');
			alr.find('.cancel').show();
			_dialog(options);

			return {
				on : function(callback) {
					if (callback && callback instanceof Function) {
						alr.find('.ok').click(function() {
							callback(true);
						});
						alr.find('.cancel').click(function() {
							callback(false);
						});
					}
				}
			};
		};

		var _dialog = function(options) {
			var ops = {
				msg : "提示内容",
				title : "操作提示",
				btnok : "确定",
				btncl : "取消"
			};

			$.extend(ops, options);

			var html = alr.html().replace(reg, function(node, key) {
				return {
				Title: ops.title,
				Message: ops.msg,
				BtnOk: ops.btnok,
				BtnCancel: ops.btncl
				}[key];
			});

			alr.html(html);
			alr.modal({
				width : 500,
				backdrop : 'static'
			});
		};

		return {
			alert : _alert,
			confirm : _confirm
		};

	}();
});

/*提示框隐藏，显示*/
function hide_div() {
	$("#div-container").fadeOut(1000*2);
	//$("#div-container").hide();
}

function mouse_hide() {
	setTimeout("hide_div()", 1000);
}

function mouse_show() {
	//$("#div-container").fadeIn();
	$("#div-container").css("display","block");
}

function myAlert(mesg, tags, clean) {
	$("#notice_messages").hide();
	if (!arguments[1])
		tags = 'error';
	if (!arguments[2])
		clean = 1;
		
	if (clean == 1) {
		$("#notice_messages").empty();
	}
	//alert($("#toast-container").length);
	$(".toast-error").each(function(){
    	$(this).hide();
  	});
	if(tags=="error"){
		toastr.error(mesg, "错误提示");
	}else if(tags=="info"){
		toastr.success(mesg, "成功提示");
	}
	
		
	//滚动条滚动到该区域
	$(document).scrollTop(0);

	//10秒后淡出
	//$("#notice_messages").fadeOut(1000*1);

	return true;
}


$(document).ajaxSend(function(event, xhr, settings) {
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	function sameOrigin(url) {
		// url could be relative or scheme relative or absolute
		var host = document.location.host;
		// host + port
		var protocol = document.location.protocol;
		var sr_origin = '//' + host;
		var origin = protocol + sr_origin;
		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') || (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}

	function safeMethod(method) {
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	if (settings.type != "POST" && settings.type != "post") {
		if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
			xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		}
	}

});

function ajaxRequest(url, date) {
	var url = url;
	var dict = {
		'ret' : false,
		'errMsg' : '请求失败'
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
		error : function(data) {
			if (data.responseText.indexOf("loginflag") > 0) {
				//toastr.error("会话超时，3秒后跳转到登录页面！", "错误提示");
				dict['errMsg'] = "会话超时，3秒后跳转到登录页面";
				window.setTimeout(function() {
					window.location.reload();
				}, 3000);
			}
		}
	});
	return dict;
}

function reloadUrl(url) {
	if (!arguments[0]) {
		window.location.reload();
	}
	var href = window.location.href;
	if (href.indexOf(url) < 0) {
		window.location = url;
	} else {
		window.location.reload();
	}
}

function getUrlContent(obj, url, idata) {
	var crturl = url;
	var data = {
		type : 1
	};
	if (idata) {
		data = idata;
	}

	$.ajax({
		type : "GET",
		async : false, //同步请求
		url : crturl,
		data : data,
		timeout : 1000,
		success : function(dates) {
			// $("#deployNav").html(dates);
			obj.html(dates);
		},
		error : function() {
			Modal.alert({
				msg : '失败，请稍后再试！',
				title : '失败',
				btnok : '关闭'
			});
		}
	});
}

function logout() {
	var url = "/devadm/accounts/logout/";
	var menuFrame = parent.frames['menuFrame'];
	if ( typeof (menuFrame) != "undefined") {
		var contentFrame = parent.parent.frames['contentFrame'];
		if ( typeof (contentFrame) != "undefined") {
			parent.parent.location.href = url;
		} else {
			parent.location.href = url;
		}
	} else {
		window.location = url;
	}
}

// $.fn.modal.defaults = {
// backdrop: 'static'
// , keyboard: true
// , show: true
// }

function diskSave() {
	var url = "/kmjman/disk/save/";
	var now = new Date();
	url = url + "?timestamp=" + now.getTime();
	var jsonDate = {
		"random" : Math.random()
	};
	var rd = ajaxRequest(url, jsonDate);
	if (rd['ret']) {
		toastr.success("保存配置成功!", "成功提示");
	} else {
		toastr.error("保存配置失败！", "错误提示");
	}
}


$(".comment .commentTip i").bind('click', function() {
	//alert('eee');
	var _this = $(this);

	var curClass = _this.attr('class');
	var targetObj = _this.parent().next();
	if (curClass == 'fa fa-angle-up') {//已展开，点击收起
		_this.attr('class', 'fa fa-angle-down');
		_this.attr('title', '展开');
		targetObj.hide();
	} else {
		_this.attr('class', 'fa-angle-up');
		_this.attr('title', '收起');
		targetObj.show();
	}
});

// $(document).ready(function() {
// $('#side-menu').metisMenu();
// })

/**
 * 获取操作系统
 */
function getSystem() {
	var plat = navigator.platform, isWin = (plat == "Win32") || (plat == "Windows") || (plat == "Win64"), isMac = (plat == "Mac68K") || (plat == "MacPPC") || (plat == "Macintosh") || (plat == "MacIntel");

	var isLinux = (plat == "Linux x86_64") || (plat == "Linux aarch64");
	if (isLinux) {
		return "Linux";
	}
	if (isMac) {
		return "Mac";
	}
	if (isWin) {
		return "windows";
	}
	var isUnix = (plat == "X11") && !isWin && !isMac;
	if (isUnix) {
		return "Unix";
	}
	return "other";
}

jQuery(function($) {
	// 备份jquery的ajax方法
	var _ajax = $.ajax;
	// 重写ajax方法，先判断登录在执行success函数
	$.ajax = function(opt) {
		var _success = opt && opt.success ||
		function(a, b) {
		};
		var _error = opt && opt.error ||
		function() {
		};
		var _opt = $.extend(opt, {
			success : function(data, textStatus) {
				// 如果后台将请求重定向到了登录页，则data里面存放的就是登录页的源码，这里需要找到data是登录页的证据(标记)
				var dataobj = JSON.stringify(data);
				//alert(dataobj);
				if (dataobj.indexOf("loginflag") != -1) {
					//window.location.href= Globals.ctx + "/devadm/accounts/login/";
					window.location.reload();
					return;
				}
				_success.apply(opt, arguments);
			},
			error : function(r, s, e) {
				if (r.responseText && r.responseText.indexOf("loginflag") > 0) {
					toastr.error("会话超时，3秒后跳转到登录页面！", "错误提示");
					//dict['errMsg']="会话超时，3秒后跳转到登录页面";
					window.setTimeout(function() {
						window.location.reload();
					}, 3000);
					//return  dict;
				}
				_error.apply(opt, arguments);
				// if (data.statusText == 'timeout') {
				// 		if($(".shade .tip")){
				//	$(".shade .tip").text("会话已超时，3s后重新加载该页面！");
				//	window.setTimeout(function(){ window.location.reload();}, 3000);
				//	}
				// }
			}
		});
		return _ajax(_opt);
		//_ajax(_opt);
	};
});

function error(data) {
	var result = data.responseText;
	if (result != null && result != '') {//后台异常时，并在后台捕获
		window.location.reload();
	} else {//后台异常，且没有被捕获
		clickautohide(5);
	}
}

function formatServerIP() {
	var pSrvIp = "";
	var location_url = document.location.href;
	var endsub = 7;
	if (location_url.indexOf('https') != -1) {
		endsub = 8;
	}
	location_url = location_url.substring(endsub, location_url.length);

	if (location_url.indexOf("/") != -1) {
		location_url = location_url.substring(0, location_url.indexOf("/"));
		if (location_url.indexOf(":") != -1) {
			location_url = location_url.substring(0, location_url.indexOf(":"));
		}
	}
	pSrvIp = location_url;
	return pSrvIp;
} 