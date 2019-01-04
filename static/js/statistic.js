
$(function() {
	var myForm = $("#outStaForm");
	myForm.validation();
	$('#genStatistic').bind('click', function() {
		if (!myForm.validate()) {
			return false;
		}
		var url = '/audit/statistic/out/data/';
		var startt = $('#outStaForm [name="startTime"]').val();
		var endt = $('#outStaForm [name="endTime"]').val();
		if (endt < startt) {
//			toastr.error("结束时间必须大于开始时间！", "错误提示");
			myAlert('结束时间必须大于开始时间！',"error");
			return false;
		}
		data = {
			'startt' : startt,
			'endt' : endt
		}
		var rd = ajaxRequest(url, data);
		$('#morris-bar-chart').html('');
	
		 var data = rd['data'];
            var options = {
                valueType: 'n', animationSteps: 60,
                bar: { useSameColor: true },
                histogram: { useSameColor: true },
                title: { content: '外带数据统计' },
                valueAxis: { linewidth: 1 },
                caption: { content: '次数' },
                scale: { linewidth: 1, backcolors: ['rgba(175,199,238,0.2)', 'rgba(245,222,179,0.2)'] },
                cross: { linewidth: 3, linecolor: '#ffffff' },
                shadow: { show: true, color: 'rgba(10,10,10,1)', blur: 3, offsetX: -3, offsetY: 3 }
            };

            window.lchart = new LChart.Histogram('morris-bar-chart', 'CN');
            lchart.SetSkin('BlackAndWhite');
            lchart.SetOptions(options);
            lchart.Draw(data);
		
	});

	

}); 