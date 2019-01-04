

$(function() {
	var myForm = $("#admRoleAddModal");
	myForm.validation();
	
	$('#subBtnAddRole').bind('click', function(){
		if (!myForm.validate()) {
				return false;
			}
		return true;
	});
	
	$('#btnAddRole').bind('click', function(){
		addRoleAction();
	});
});

function onEnterDown(){
	if(window.event.keyCode == 13){
		addRoleAction();
	}
}

// function keyUpAction(){
// 	
	// var tmp = $(this).val();
	// alert(tmp);
// }

function addRoleAction(){
	var obj = $('#admRoleAddModal')
	clearValidateMsg(obj);
	clearModalMsg(obj);
	$('#otype').val('add');
	$('#rolename').attr('disabled', false);
	$('#headRoleLable').html('创建角色');
	showModal('#admRoleAddModal');
}

function beforeDelRole(rname){
	$('#dRoleName').val(rname);
	$('#roleDeleteModal').modal('show');
}

function beforeEditRole(rid, rname, dsp){
	clearValidateMsg($('#admRoleAddModal'));
	$('#rolename').val(rname);
	$('#rolename').attr('disabled',true);
	$('#dsp').val(dsp);
	$('#otype').val('edit');
	$('#rid').val(rid);
	$('#headRoleLable').html('编辑角色');
	$('#admRoleAddModal').modal('show');
}
