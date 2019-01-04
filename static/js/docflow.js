function getTree() {
	var tree = [{
		text : "技术中心",
		nodes : [{
			text : "研发部",
			nodes : [{
				text : "服务器"
			}, {
				text : "客户端"
			}, {
				text : "WEB控制台"
			}]
		}, {
			text : "测试部"
		},{
			text : "技术支持"
		}]
	}, {
		text : "销售"
	}, {
		text : "办公室"
	}];
	return tree;
}

function showModal(obj) {
	$(obj).modal('show');
}

function getUserInfo() {
	var url = "/docflow/apprule/";
		var data = {};
		$.ajax({
			type : "GET",
			async : false,  //同步请求
			url : url,
			data : data,
			timeout:1000,
			success:function(dates){
				$("#docflowInfo").html(dates);//要刷新的div
			},
			error: function() {
				Modal.alert({
				    msg: '失败，请稍后再试！',
				    title: '失败',
				    btnok:'关闭'
				});
            }
		});
}

$(document).ready(function() {
	
	getUserInfo();
	$('#datatable-userinfo').dataTable({
		"oLanguage":{
			"sLengthMenu":"每页显示 _MENU_ 条记录",
			"sZeroRecords": "抱歉， 没有找到",
			"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
			"sInfoEmpty": "没有数据",
			"sInfoFiltered": "(从 _MAX_ 条数据中检索)",
			"sSearch":"搜索",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "前一页",
				"sNext": "后一页",
				"sLast": "尾页"
				},
		},
	}); 
	$('#arSubTree').treeview({
		data : getTree(),
		showBorder : false,
		color : "#2E4D68"
	});	
});

