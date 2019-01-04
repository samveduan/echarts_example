/**
 * @author TangYL
 */

/** 计算字符串字节长度（汉字代表两字节） **/
var lenfunc = function(str){
	　　var byteLen=0,len=str.length;
	　　if(str){
	　　　　for(var i=0; i<len; i++){
	　　　　　　if(str.charCodeAt(i)>255){
	　　　　　　　　byteLen += 2;
	　　　　　　}
	　　　　　　else{
	　　　　　　　　byteLen++;
	　　　　　　}
	　　　　}
	　　　　return byteLen;
	　　}
	　　else{
	　　　　return 0;
	　　}
}

/** 按字节数截取 **/
String.cutByte = function(str,len,endstr){
		var len = +len,endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString();
		function n2(a){
			var n = a / 2 | 0; 
			return (n > 0 ? n : 1);
		}
		/** 用于二分法查找 **/
		if(!(str+"").length || !len || len<=0){
			return "";
		}
		if(lenfunc(str) <= len){
			return str;
		} 
		/** 整个函数中最耗时的一个判断,欢迎优化 **/
		var lenS = len -lenfunc(endstr);
		var _lenS = 0;
		var _strl = 0;
		while (_strl <= lenS){
			var _lenS1 = n2(lenS -_strl);
			_strl += lenfunc(str.substr(_lenS,_lenS1));
			_lenS += _lenS1;
		}
		return str.substr(0,_lenS-1) + endstr;
}
