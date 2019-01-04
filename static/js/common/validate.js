(function($) {
	/*
	 Validation Singleton
	 */
	var Validation = function() {

		var rules = {
			date : {
				check : function(value) {
					if(value){
						var re = /^(\d{4})-(\d{2})-(\d{2})$/g;
						if(re.test(value)){
							if((RegExp.$1 > 1900) && (RegExp.$1 < 9999) && (RegExp.$2 > 0) && (RegExp.$2 < 13) && (RegExp.$3 > 0) && (RegExp.$3 < 32)){
								return true;
							}
						}
						return false;
					}
					return true;
				},
				msg : "日期格式不对"
			}, 
			newPasswdCommit : {
				check : function(value) {
					//alert(value);
					if(document.getElementById("newPasswdCommit").value == document.getElementById("newPasswd").value){
						return true;
					}
					return false;
				},
				msg : "两次口令不一致"
			}, 
			newPasswdCommit2 : {
				check : function(value) {
					//alert(value);
					if(document.getElementById("newPasswdCommit2").value == document.getElementById("newPasswd2").value){
						return true;
					}
					return false;
				},
				msg : "两次口令不一致"
			}, 
			complexity : {
				check : function(value) {
					if(value){
						//var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
						var regex = /^(?![^a-zA-Z]+$)(?!\D+$).{8,20}$/;
						if(regex.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "口令必须字母和数字组合"
			},
			mac : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^([0-9A-F]{2})(([-][0-9A-F]{2}){5})$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "MAC地址格式错误"
			},
			start : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^()([0-9]+(\.[0-9]+)?)((([k|K|m|M|g|G|t|T])[b|B]?)|%)$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "示例:20GB/20％"
			}, 
			end : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^([+]?)([0-9]+(\.[0-9]+)?)((([k|K|m|M|g|G|t|T])[b|B]?)|%)$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "示例:20GB/+20％"
			},
			yesno : {
				check : function(value) {
					if(value){
						var re = /^([y|Y][e|E][s|S])$|([n|N][o|O])$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "请输入yes或no"
			},
			normal : {
				check : function(value) {
					if(value){
						var re = /^[0-9a-zA-Z\-_\u4e00-\u9fa5]+$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "包含非法字符"
			},
			descreg : {
				check : function(value) {
					if(value){
						var re = /^[0-9a-zA-Z\-_.。*()#\u4e00-\u9fa5]*$/;
						if(re.test(value)){
							return true;
						}
						
						return false;
					}
					return true;
				},
				msg : "包含非法字符(只能包含-_.。*()#)"
			},
			normalempty : {
				check : function(value) {
					if(value){
						//[0-9a-zA-Z\_\u4e00-\u9fa5\s+]
						//var re = /^[0-9a-zA-Z\_\u4e00-\u9fa5\s+]+$/;
						var re=/^[\s　][0-9a-zA-Z\_\u4e00-\u9fa5\s+]|[0-9a-zA-Z\_\u4e00-\u9fa5\s+][ ]$/gi;
						//var re=/^[\s　]|[ ]$/gi;
						if(!re.test(value)){
							return true;
						}
						
						return false;
					}
					return true;
				},
				msg : "包含非法字符(不能以空格开头或结尾)"
			},
			mpath : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^\/dev\/mapper\/mpath[a-z]$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "不满足需求的多路径名"
			},
			name : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^[a-zA-Z]+[0-9a-zA-Z]*$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "字母开头，只包含字母数字"
			},
			path : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^[\/0-9a-zA-Z_\u4e00-\u9fa5\-\.]+$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "非法路径"
			},
			pathName : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^[0-9a-zA-Z_\u4e00-\u9fa5\-\.]+$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "非法文件名"
			},
			fileMod : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^[0-7]{3,4}$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "非法文件权限"
			},
			num : {
				check : function(value) {
					//if(value){
					//	var re = /^[-+]?[0-9]+$/;
					//	if(re.test(value)){
					//		return true;
					//	}
					//	return false;
					//}
					//return true;
					return /^[-+]?[0-9]+$/i.test(value);
				},
				msg : "请输入整数"
			},
			pnum : {
				check : function(value) {
					if(value){
						var re = /^\+?[1-9][0-9]*$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "请输入正整数"
			},
			smbhfile : {
				check : function(value) {
					if(value){
						var re = /^\/.*\/$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "请输入正确的文件格式"
			},
			percentNum : {
				check : function(value) {
					if(value){
						var re = /^(\d+)$/;
						if(re.test(value)){
							if(RegExp.$1<=100 && RegExp.$1>=0){
									return true;
							}
						}
						return false;
						
					}
					return true;
				},
				msg : "请输入0~100有效数字"
			},
			inter : {
				check : function(value) {
					//alert(value);
					if(value){
						var re = /^[0-9a-zA-Z_]+$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "非法接口名称"
			},
			gateway : {
				check : function(value) {
					if(value){
						var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						if(re.test(value)){
							if(RegExp.$1<256 && RegExp.$2<256
								&& RegExp.$3<256 && RegExp.$4<256){
									return true;
							}
						}
						return false;
						
					}
						
					return true;
				},
				msg : "非法网关"
			},
			mask : {
				check : function(value) {
					if(value){
						var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						if(re.test(value)){
							if(RegExp.$1<256 && RegExp.$2<256
								&& RegExp.$3<256 && RegExp.$4<256){
									return true;
							}
						}
						return false;
						
					}
						
					return true;
				},
				msg : "非法掩码"
			},
			ip : {
				check : function(value) {
					if(value){
						var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						if(re.test(value)){
							if(RegExp.$1.toString().length>3 || RegExp.$2.toString().length>3
								|| RegExp.$3.toString().length>3 || RegExp.$4.toString().length>3){
									return false;
							}
                            if(RegExp.$1<224 && RegExp.$1>0 && RegExp.$2<256
                                && RegExp.$3<256 && RegExp.$4<255 && RegExp.$4>0){
                                    return true;
                            }
						}
						return false;
						
					}
						
					return true;
				},
				msg : "首位范围1-223,其余位0-255，末位1-254"
			},
			iply : {
                check : function(value) {
                    if(value){
                          var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                        if(re.test(value)){
                            if(RegExp.$1<256 && RegExp.$2<256
                                        && RegExp.$3<256 && RegExp.$4<256){
                                    return true;
                            }
                        }
                        return false;   
                    }
                        
                    return true;
                },
                msg : "非法地址"
            },
			iplist : {
				check : function(value) {
					if(value){
						var iplist = value.split(',');
						var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						for(var i=0; i <= iplist.length; i++){
							var ip = iplist[i];
							if(ip){
								if(re.test(ip)){
									if(RegExp.$1<256 && RegExp.$2<256
										&& RegExp.$3<256 && RegExp.$4<256){
											continue;
									}else{
										return false;
									}
								}else{
									return false;
								}
							}
							
						}
						return true;
						
					}
						
					return true;
				},
				msg : "非法地址列表"
			},
			ipAndMask : {
				check : function(value) {
					if(value){
						var re1 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						var re2 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)\/\d+$/;
						if(re1.test(value)){
							if(RegExp.$1<256 && RegExp.$2<256
								&& RegExp.$3<256 && RegExp.$4<256){
									return true;
							}
						}
						if(re2.test(value)){
							if(RegExp.$1<256 && RegExp.$2<256
								&& RegExp.$3<256 && RegExp.$4<256 && RegExp.$5<65535){
									return true;
							}
						}
						return false;
						
					}
						
					return true;
				},
				msg : "非法地址"
			},
			cast : {
				check : function(value) {
					if(value){
						var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						if(re.test(value)){
							if(RegExp.$1>=224 && RegExp.$1<=239
								&& RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){
									return true;
							}
						}
						return false;
						
					}
						
					return true;
				},
				msg : "非法组播地址"
			},
			iparea : {
				check : function(value) {
					if(value){
						var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
						if(re.test(value)){
							if(RegExp.$4 == 0){
									return true;
							}
						}
						return false;
						
					}
						
					return true;
				},
				msg : "非法网段地址"
			},
			port : {
				check : function(value) {

					if(value){
						var re = /^(\d)+$/;
						if(re.test(value)){
							var tmp = parseInt(value);
							if(tmp > 0 && tmp <=65535){
								return true;
							}
						}
						return false;
					}
					return true;
				},
				msg : "非法网络端口"
			},
			email : {
				check : function(value) {

					if(value)
						return testPattern(value, "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])");
					return true;
				},
				msg : "非法邮件地址"
			},
			url : {

				check : function(value) {

					if(value)
						return testPattern(value, "^https?://(.+\.)+.{2,4}(/.*)?$");
					return true;
				},
				msg : "非法URL地址"
			},
			max_length : {
				check : function(value) {

					if(value)
						if (value.length > 32){
							return false;
						}
						// var re = /\S{1,10}/;
						// return re.test(value);
					return true;
				},
				msg : "输入不能超过32个字符"
			},
			min_length : {
				check : function(value) {

					if(value)
						if (value.length < 8){
							return false;
						}
						// var re = /\S{1,10}/;
						// return re.test(value);
					return true;
				},
				msg : "口令长度不小于8位"
			},
			notadm : {
				check : function(value) {
					if(value === 'admin')
						return false;
					else
						return true;
				},
				msg : "与内置管理员名重名"
			},
			required : {
				check : function(value) {
					if(value)
						return true;
					else
						return false;
				},
				msg : "不能为空"
			},image : {
				check : function(value) {
					if(value){
						var stxx_1=value.substring(value.length-4,value.length);
						var stxx_2=value.substring(value.length-5,value.length);
						if(stxx_1==".gif" || stxx_1==".GIF" || stxx_1==".png" || stxx_1==".PNG" || stxx_1==".bmp" || stxx_1==".BMP" || stxx_1==".jpg" || stxx_1==".JPG" || stxx_2==".jpeg" || stxx_2==".JPEG") {
							return true;
						}
						return false;
					}else{
						return true;
					}
					return true;
				},
				msg : "请选择图片文件"
			},bmpimage : {
				check : function(value) {
					if(value){
						var stxx_1=value.substring(value.length-4,value.length);
						var stxx_2=value.substring(value.length-5,value.length);
						if(stxx_1==".bmp" || stxx_1==".BMP") {
							return true;
						}
						return false;
					}else{
						return true;
					}
					return true;
				},
				msg : "请选择bmp格式图片文件"
			},wav_audio : {
				check : function(value) {
					if(value){
						var stxx_1=value.substring(value.length-4,value.length);
						var stxx_2=value.substring(value.length-5,value.length);
						if(stxx_1==".wav" || stxx_1==".WAV") {
							return true;
						}
						return false;
					}else{
						return true;
					}
					return true;
				},
				msg : "请选择wav格式音频文件"
			},
			mobilephone : {
				check : function(value) {
					if(value){
						var re =  /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
						if(re.test(value)){
							return true;
						}
						return false;
						
					}
						
					return true;
				},
				msg : "手机号格式不正确"
			},
			degistnum : {
				check : function(value) {
					//alert(value);
					if(value){
						var re=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
						//var re = /^[0-9a-zA-Z\_\u4e00-\u9fa5]+$/;
						if(re.test(value)){
							return true;
						}
						return false;
					}
					return true;
				},
				msg : "只能为18位或者15位身份证格式"
			}
		};
		var testPattern = function(value, pattern) {

			var regExp = new RegExp(pattern, "");
			return regExp.test(value);
		};
		return {

			addRule : function(name, rule) {

				rules[name] = rule;
			},
			getRule : function(name) {

				return rules[name];
			}
		};
	};
	/*
	 Form factory
	 */
	var Form = function(form) {

		var fields = [];

		form.find("[validation]").each(function() {
			var field = $(this);
			// alert(field.attr('disabled'))
			if(field.attr('validation') != undefined) { //add disabled
				fields.push(new Field(field));
			}
		});
		this.fields = fields;
	};
	Form.prototype = {
		validate : function() {

            for(var i=0; i<this.fields.length; i++){
            	
            	
            		this.fields[i].validate();
            	
            }
		},
		isValid : function() {

            for(var i=0; i<this.fields.length; i++){
                if(!this.fields[i].valid) {
					if(this.fields[i].field.attr("class").indexOf("Wdate") >0){
						
					}else{
						this.fields[i].field.focus();
					}
                    
                    return false;
                }
            }
			return true;
		}
	};


	function utf8CharLen(str){
		var totalLength = 0; 
		var i; 
		var charCode; 
		for (i = 0; i < str.length; i++) { 
			charCode = str.charCodeAt(i); 
			if (charCode < 0x007f) { 
				totalLength = totalLength + 1; 
			} else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) { 
				totalLength += 2; 
			} else if ((0x0800 <= charCode) && (charCode <= 0xffff)) { 
				totalLength += 3; 
			} 
		} 
		return totalLength; 
	} 
	
	/*
	 Field factory
	 */
	var Field = function(field) {

		this.field = field;
		this.valid = false;
		this.attach("change");
	}
	Field.prototype = {

		attach : function(event) {

			var obj = this;
			if(event == "change") {
				obj.field.bind("change", function() {
					return obj.validate();
				});
			}
			if(event == "keyup") {
				obj.field.bind("keyup", function(e) {
					return obj.validate();
				});
			}
		},
		
		charLenMatch : function(){
			var obj = this;
			var field = obj.field;
			var minLen = -1;
			var maxLen = -1;
			var val = field.val();
			var curLen = utf8CharLen(val); 
			if(typeof(field.attr('minCharLen')) != 'undefined'){
				minLen = parseInt(field.attr('minCharLen'));
				if(minLen > 0 && curLen < minLen){
					return "总字节至少" + minLen + "个";
				}
			}
			if(typeof(field.attr('maxCharLen')) != 'undefined'){
				maxLen = parseInt(field.attr('maxCharLen'));
				if(maxLen > 0 && curLen > maxLen){
					return "总字节超过" + maxLen + "个";
				}
			}
			return "";
		},
		
		lenMatch : function(){
			var obj = this;
			var field = obj.field;
			var minLen = -1;
			var maxLen = -1;
			var val = field.val();
			var curLen = val.length;
			if(typeof(field.attr('minLen')) != 'undefined'){
				minLen = parseInt(field.attr('minLen'));
				if(minLen > 0 && curLen < minLen){
					return "长度至少为" + minLen;
				}
			}
			if(typeof(field.attr('maxLen')) != 'undefined'){
				maxLen = parseInt(field.attr('maxLen'));
				if(maxLen > 0 && curLen > maxLen){
					return "长度最长为" + maxLen;
				}
			}
			return "";
		},
		
		valMatch : function(){
			var obj = this;
			var field = obj.field;
			var minVal = -999999;
			var maxVal = 999999;
			var curVal = parseInt(field.val());
			if(typeof(field.attr('minVal')) != 'undefined'){
				minVal = parseInt(field.attr('minVal'));
				if(curVal < minVal){
					return "值至少为" + minVal;
				}
			}
			if(typeof(field.attr('maxVal')) != 'undefined'){
				maxVal = parseInt(field.attr('maxVal'));
				if(curVal > maxVal){
					return "值最大为" + maxVal;
				}
			}
			return "";
		},
		
		validate : function() {

			var obj = this, 
				field = obj.field, 
				parentGroup = field.parents(".form-group"),
				errArea = $(document.createElement("span")).addClass("text-error"),
				types = field.attr("validation").split(" "), 
				container = field.parent(), 
				errorMsg = "";
			var alsoValid=true;
			if(field.attr("alsoValid") != undefined){
				alsoValid=false;
			}
			if(field.is(":hidden") && alsoValid){
				obj.valid = true;
				return ;
			}
			
			 
			
			if(field.attr('disabled') === 'disabled'){
				obj.valid = true;
				return ;
			}

			for(var i=0; i<types.length; i++) {
				if(jQuery.trim(types[i]) == ""){
					continue;
				}
				var rule = $.Validation.getRule(types[i]);
				if(!rule.check(field.val())) {
					errorMsg = rule.msg;
					break;
					//errors.push(rule.msg);
				}
			}
			if(!errorMsg){
				errorMsg = obj.charLenMatch();
			}
			if(!errorMsg){
				errorMsg = obj.lenMatch();
			}
			if(!errorMsg){ 
				errorMsg = obj.valMatch();
			}
			container.find(".text-error").each(function() {
				$(this).remove();
			});
			if(errorMsg) {
				obj.field.unbind("keyup")
				obj.attach("keyup");
				parentGroup.addClass("error");
				container.append(errArea.empty());
				errArea.append(errorMsg);
				obj.valid = false;
			} else {
				errArea.remove();
				parentGroup.removeClass("error");
				obj.valid = true;
			}
		}
		
	}

	/*
	 Validation extends jQuery prototype
	 */
	$.extend($.fn, {

		validation : function() {

			var validator = new Form($(this));
			$.data($(this)[0], 'validator', validator);


		},
		validate : function() {

			var validator = $.data($(this)[0], 'validator');
			validator.validate();
			return validator.isValid();

		}
	});
	$.Validation = new Validation();
})(jQuery);

function clearValidateMsg(obj){
	$(obj).find("span.text-error").each(function() {
				$(this).remove();
	});
	$(obj).find("div.form-group").each(function() {
				$(this).removeClass("error");
	});
}
