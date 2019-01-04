
function ajaxGenAuthFile(machinecode,expireddate,pin) {         
	
	var url = "/gencode/";
	var dict = {
		'ret' : false,
		'errMsg' : '操作失败'
	};
	var jsonDate = {
		'machinecode':machinecode,
		'expireddate':expireddate,
		'pin':pin
		};
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


function testclick() {

	var machinecode = $("#inputMcode").val();
	var expireddate = $("#expiredDate").val();
	var checked = $('#expiredDate').is(":checked");
	var expireddate = '1000000';
	if(!checked){
		expireddate = $("#expiredDate").val();
	}
	var pin = $("#pinCode").val();

	var rd = ajaxGenAuthFile(machinecode, expireddate, pin);
	if (rd['ret']) {
		Modal.alert({
		    msg: '生存授权文件成功！',
		    title: '成功',
		    btnok:'关闭'
		});
		$("#formExport").show();
	} else {
		var msg = "生存授权文件失败 " + rd['errMsg'];
		Modal.alert({
		    msg: msg,
		    title: '失败',
		    btnok:'关闭'
		});
	}
	return;

}

function exportfile(){
	var url = '/exportcode/';
	window.location = url;
	
}

$(document).ready(function() {
	
	var myFormMain = $("#myFormMain");                            
	ret = myFormMain.validation();
	
	$("#formExport").hide();
	$("#genAuthCode").click(function () {
		if(!myFormMain.validate()){
			return false;
		}
		testclick();
		
		return false;
	});
	
	$("#exportAuthFile").click(function () {
		exportfile();
		return false;
	});
	
	
	$('#dateInfinity').click(function(){
		var val= $(this).is(":checked");
		if(val)	{
			$('#expiredDate').attr('disabled',true);
		}
		else {
			$('#expiredDate').attr('disabled',false);
		}
	});
});
	