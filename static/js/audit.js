pageData = {};
curIndex = 0;
pageSize = 10;
rstflag = false;

function clearQueryModal() {
	$('#type').val('');
	$('#keyword').val('');
	$('#subject').val('');
	$('#subjectAttr').val('');
	$('#object').val('');
	$('#objectAttr').val('');
	$('#result').val('');
	$('#startTime').val('');
	$('#endTime').val('');
	$('#level').val('');
	$('#productType').val('');
	$('#mType').val('');
	$('#subType').val('');
	$("#mType").empty();
	$("#mType").append("<option value=''>所有</option>");
	$("#subType").empty();
	$("#subType").append("<option value=''>所有</option>");
	clearValidateMsg(document.getElementById("queryForm"));
};

function genQueryParams(params) {
	var newParams = {};

	newParams['pageSize'] = params.limit;
	newParams['pageNumber'] = params.offset;
	if (rstflag) {
		newParams['pageNumber'] = 0;
		rstflag = false;
	}
	newParams['type'] = $('#type').children('option:selected').val();
	newParams['keyword'] = $('#keyword').val();
	newParams['subject'] = $('#subject').val();
	newParams['subjectAttr'] = $('#subjectAttr').val();
	newParams['object'] = $('#object').val();
	newParams['objectAttr'] = $('#objectAttr').val();
	newParams['result'] = $('#result').children('option:selected').val();
	var start_hzst = "";
	if ($('#startTime').val() != "") {
		start_hzst = " 00:00:00";
	}
	newParams['startTime'] = $('#startTime').val() + start_hzst;

	var end_hzst = "";
	if ($('#endTime').val() != "") {
		end_hzst = " 23:59:59";
	}
	newParams['endTime'] = $('#endTime').val() + end_hzst;
	newParams['level'] = $('#level').children('option:selected').val();
	newParams['productType'] = $('#productType').children('option:selected').val();
	newParams['mType'] = $('#mType').children('option:selected').val();
	newParams['subType'] = $('#subType').children('option:selected').val();
	return newParams;
}

function rowStyle(row,index){
	if(row.result == "失败"){
		return {
			classes:'row-color'
		};
	}else{
		return {
			classes: ''
		}
	}
}


$('#datatable-log').bootstrapTable({
	onDblClickRow : function(row, $element) {
		curIndex = $element.attr('data-index');
		pageData = $('#datatable-log').bootstrapTable('getData');
		// alert(pageData.length)
		// var option = $('#datatable-log').bootstrapTable('getOptions');
		pageSize = pageData.length;
		if(row.subject.length>12){
			var spanstr="<span title='"+row.subject+"'>"+row.subject.substring(0,12)+"...</span>";
			$('#psubject').html(spanstr);
		}else{
			$('#psubject').html(row.subject);
		}
		
		
		
		var subject_attr=row.subject_attr;
		if(subject_attr.length>12){
			var spanstr="<span title='"+subject_attr+"'>"+subject_attr.substring(0,12)+"...</span>";
			$('#pSubjectAttr').html(spanstr);
		}else{
			$('#pSubjectAttr').html(row.subject_attr);
		}
		$('#pobject').html(row.object);
		$('#pObjectAttr').html(row.object_attr);
		$('#ptime').html(row.time);
		$('#plevel').html(row.level);
		$('#pproduct').html(row.product);
		$('#ptime').html(row.time);
		$('#ptype').html(row.type);
		$('#pmtype').html(row.mtype);
		$('#pstype').html(row.subtype);
		$('#pdetail').html(row.detail);
		$('#presult').html(row.result);
		showPreNextBtn();
		$('#logDetailModal').modal('show');
	}
});

function showPreNextBtn() {

	if (curIndex == 0 && pageSize == 1) {
		$('#preBtnQuery').prop('disabled', true);
		$('#nextBtnQuery').prop('disabled', true);
	} else if (curIndex == 0 && pageSize > 1) {
		$('#preBtnQuery').prop('disabled', true);
		$('#nextBtnQuery').prop('disabled', false);
	} else if (curIndex > 0 && curIndex < pageSize - 1) {
		$('#preBtnQuery').prop('disabled', false);
		$('#nextBtnQuery').prop('disabled', false);
	} else {
		$('#preBtnQuery').prop('disabled', false);
		$('#nextBtnQuery').prop('disabled', true);
	}
}


$('#preBtnQuery').bind('click', function() {
	var newIndex = parseInt(curIndex) - 1;
	var prow = pageData[newIndex];
	$('#psubject').html(prow.subject);
	var subject_attr=prow.subject_attr;
	if(subject_attr.length>10){
		var spanstr="<span title='"+subject_attr+"'>"+subject_attr.substring(0,10)+"...</span>";
		$('#pSubjectAttr').html(spanstr);
	}else{
		$('#pSubjectAttr').html(prow.subject_attr);
	}
	//$('#pSubjectAttr').html(prow.subject_attr);
	$('#pobject').html(prow.object);
	$('#pObjectAttr').html(prow.object_attr);
	$('#ptime').html(prow.time);
	$('#plevel').html(prow.level);
	$('#pproduct').html(prow.product);
	$('#ptime').html(prow.time);
	$('#ptype').html(prow.type);
	$('#pmtype').html(prow.mtype);
	$('#pstype').html(prow.subtype);
	$('#pdetail').html(prow.detail);
	$('#presult').html(prow.result);
	curIndex = newIndex;
	showPreNextBtn();
	return false;
});

$('#nextBtnQuery').bind('click', function() {
	var newIndex = parseInt(curIndex) + 1;
	var prow = pageData[newIndex];
	$('#psubject').html(prow.subject);
	var subject_attr=prow.subject_attr;
	if(subject_attr.length>12){
		var spanstr="<span title='"+subject_attr+"'>"+subject_attr.substring(0,12)+"...</span>";
		$('#pSubjectAttr').html(spanstr);
	}else{
		$('#pSubjectAttr').html(prow.subject_attr);
	}
	//$('#pSubjectAttr').html(prow.subject_attr);
	$('#pobject').html(prow.object);
	$('#pObjectAttr').html(prow.object_attr);
	$('#ptime').html(prow.time);
	$('#plevel').html(prow.level);
	$('#pproduct').html(prow.product);
	$('#ptime').html(prow.time);
	$('#ptype').html(prow.type);
	$('#pmtype').html(prow.mtype);
	$('#pstype').html(prow.subtype);
	$('#pdetail').html(prow.detail);
	$('#presult').html(prow.result);
	curIndex = newIndex;
	showPreNextBtn();
	return false;
});

$(document).ready(function() {

	var rname = 'endtime';
	var rule = {
		check : function(value) {
			var starttime = $('#startTime').val();
			var endtime = value;

			if (!starttime) {
				return true;
			}
			
			if(endtime !="" && starttime !=""){
				if (endtime < starttime) {
					return false;
				}
			} 

			return true;
		},
		msg : "结束时间必须大于开始时间"
	};
	$.Validation.addRule(rname, rule);

	var myForm = $("#queryForm");
	myForm.validation();
	$('#subBtnQuery').bind('click', function() {
		if (!myForm.validate()) {
			return false;
		}
		$('#queryModal').modal('hide');
		rstflag = true;
		$('#datatable-log').bootstrapTable('refresh');
	});

	$('#btnQuery').bind('click', function() {
		var startTime=$("#stime").val();
		var endTimne=$("#etime").val();
		clearQueryModal();
		$("#startTime").val(startTime);
		$("#endTime").val(endTimne);
		$('#queryModal').modal('show');
	});

});
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt/*,from*/) {
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++) {
			if ( from in this && this[from] == elt)
				return from;
		}
		return -1;
	};
}