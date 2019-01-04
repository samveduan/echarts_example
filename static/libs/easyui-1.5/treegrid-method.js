/**
 * Created by Administrator on 16-12-1.
 */
(function($){
    $.extend($.fn.treegrid.methods,{
        //获得复选框中勾选的数据
        getChecked: function(jqTreeGrid){
            var checked_list = [];
            jqTreeGrid.each(function(){
                var t = $(this);
                var state = $(this).data('treegrid');
                var opts = state.options;
//                alert(JSON.stringify(opts))
                //获得所有节点
                var roots = t.treegrid('getRoots');
                var nodeList = getChildNodeList(t, roots);

                checked_list.length = 0;
                for(var i = 0; i < nodeList.length; i++){
//                    alert(nodeList[i]['checkState'])
                    if(nodeList[i]['checkState'] == 'checked'){
//
                        checked_list.push(nodeList[i]);
                    }
                }

            });
//                            alert(checked_list.length);
//                alert(JSON.stringify(checked_list));
            //未找到重复原因，先去重
            var checked_list_temp = [];
            for(var i = 0; i < checked_list.length; i++){
                var is_has = false;
                for(var j = 0; j < checked_list_temp.length; j++){
                    if(checked_list[i]['id'] == checked_list_temp[j]['id']){
                        is_has = true;
                        break;
                    }
                }
                if(is_has == false){
                    checked_list_temp.push(checked_list[i]);
                }
            }
            return checked_list_temp;
        }

//        find: function(jqTreeGrid, id){
//            var selectRow = null;
//            jqTreeGrid.each(function(){
//                var t = $(this);
//                var state = $(this).data('treegrid');
//                var opts = state.options;
////                alert(JSON.stringify(opts))
//                //获得所有节点
//                var roots = t.treegrid('getRoots');
//                var nodeList = getChildNodeList(t, roots);
//                for(var i = 0; i < nodeList.length; i++){
//                    if(nodeList[i]['id'] == id){
//                        selectRow = nodeList[i];
//                        alert(JSON.stringify(selectRow))
//                        break;
//                    }
//                }
//            });
//            alert(JSON.stringify(selectRow))
//            return selectRow;
//        }
    });

/**
* 定义获取easyui tree的子节点的递归算法
*/
function getChildNodeList(treegrid, nodes){
    var childNodeList = [];
    if(nodes && nodes.length > 0){
        var node = null;
        for(var i = 0; i < nodes.length; i++){
            node = nodes[i];
            var is_has = false;

            childNodeList.push(node);
            if('children' in node && node['children'].length > 0){
                var children = treegrid.treegrid('getChildren', node.id);
//                alert(node.id)
                childNodeList = childNodeList.concat((getChildNodeList(treegrid, children)));
            }
        }
    }
    return childNodeList;
}

})(jQuery);
