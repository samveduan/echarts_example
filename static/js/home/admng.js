function updateAdmStatus(id, status, admname) {
	var gLoginName = $('#gLoginName').val();
	if (admname === gLoginName){
		//toastr.error("当前登录管理员不能改变自身状态！", "错误提示");
		myAlert('当前登录管理员不能改变自身状态！',"error");
		return false;
	}
	var pdata = {
		'id' : id,
		'status' : status
	};
	var url = "/home/upstatus/"
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
	}
}

function pchangeAction() {

	var username = $('#admname').val();
	$('#admalias').val(username);
}

function changeShowKeyItem(isUkey) {
	var ukIdType = $('#ukIdType').val();
	if (isUkey) {
		// $('#admname').val(ukIdType);
		if (ukIdType !== 'custom') {
			$('#admname').attr('disabled', true);
		}
		$('#admtype').val('ukey')
		$('#fgpin').show();
		$('#fgpw').hide();
		$('#fgpw2').hide();
	} else {
		$('#admtype').val('passwd');
		$('#admname').val('');
		$('#admname').attr('disabled', false);
		$('#fgpin').hide();
		$('#fgpw').show();
		$('#fgpw2').show();
	}
}

function addUkeyAdm() {
	var passwd = $('#admpin').val();
	try {
		var uk = new U_USBKey(passwd);
	} catch (e) {
		//toastr.error("打开设备失败！", "错误提示");
		myAlert('打开设备失败！',"error");
		return false;
	}

	try {
		var u_cert = uk.get_u_cert();
	} catch (e) {
		//toastr.error("获取证书失败！", "错误提示");
		myAlert('获取证书失败！',"error");
		return false;
	}
	var datadict = getAdmFormData();
	datadict['u_cert'] = u_cert;

	var urlStep1 = "/home/vucert/";
	var arrd = ajaxRequest(urlStep1, datadict);
	if (!arrd['ret']) {
		//toastr.error("认证用户证书失败！", "错误提示");
		myAlert('认证用户证书失败！',"error");
		return false;
	}
	var u_id = arrd['u_id'];
	var s_pk = arrd['s_pk'];

	try {
		uk.set_u_id(u_id);
		uk.set_s_pk(s_pk);
	} catch(e) {
		//toastr.error("设置用户id或公钥失败！", "错误提示");
		myAlert('设置用户id或公钥失败！',"error");
		msg = "failed";
	}
	var msg = "success";
	var datapost = {
		'u_id' : u_id,
		'msg' : msg
	};
	uk.close();
	var rde = ajaxRequest('/home/infocr/', datadict);
	window.location.reload();
}

function upAdm(){
	var myForm = $('#admAddForm');
	var url = '/home/upadm/';
	myForm.attr('action', url);
	myForm.submit();
}



$(function() {

	$('#btnAddAdm').bind('click', function() {
		var obj = $('#admAddModal')
		clearValidateMsg(obj);
		clearModalMsg(obj);
		$('#admname').attr('disabled', false);
		$('#otype').val('add');
		$('#admrole').attr('disabled', false);
		$('#cbUkeyUser').attr('disabled', false);
		$('#cbUkeyUser').attr('checked', false);
		changeShowKeyItem(false);
		$('#myModalLabel').html('创建管理员');
		showModal('#admAddModal');
	});

	$('#cbUkeyUser').click(function() {
		var isUkey = $(this).is(':checked')
		changeShowKeyItem(isUkey);
	});
	
	// $('#admalias').focus(function() {
		// var username = $('#admname').val();
		// $(this).val(username);
	// })

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
})

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

function beforeEditAdm(username, alias, rid, dsp, id, login_type) {
	var gLoginName = $('#gLoginName').val();
	if (username === gLoginName){
		//toastr.error("当前登录管理员不能编辑自身！", "错误提示");
		myAlert('当前登录管理员不能删除自身！',"error");
		return false;
	}
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
	$('#cbUkeyUser').attr('disabled', true);
	$('#fgpin').hide();
	$('#fgpw').hide();
	$('#fgpw2').hide();
	$('#admAddModal').modal('show');
}