$(".comment .commentTip i").bind('click', function(){
		var _this = $(this);

		var curClass = _this.attr('class');
		var targetObj = _this.parent().next();
		if(curClass == 'fa fa-angle-up'){ //已展开，点击收起
			_this.attr('class', 'fa fa-angle-down');
			_this.attr('title', '展开');
			targetObj.hide();
		}else{
			_this.attr('class', 'fa fa-angle-up');
			_this.attr('title', '收起');
			targetObj.show();
		}
});	