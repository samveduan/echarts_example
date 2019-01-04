/**
 * Created by Administrator on 16-11-30.
 */
(function ($) {
    $.extend($.fn.combotreegrid.methods, {
        //找到一个节点
        search: function (jq, searchText) {
            jq.each(function () {
                var combo_tree = $(this);
                var state = $(this).data('combotreegrid');
                var opts = state.options;
                var data = opts['data'];
                var nodeList = getChildNodeList(combo_tree, data);  //查询所有的节点
                if(searchText == ""){
                    for(var i = 0; i < nodeList.length; i++){
                        var id = nodeList[i]['id'];
                        //$("#datagrid-row-r12-2-" + id).show();
                       $('tr[node-id=\"'+id+'\"]').show();
                    }
                    return;
                }
                //搜索匹配的节点并高亮显示
                var matchedNodeList = [];
                if(nodeList && nodeList.length > 0){
                    var node = null;
                    for(var i = 0; i < nodeList.length; i++){
                        var node = nodeList[i];
    //                    alert(JSON.stringify(node))
                        var text = node.text;
                        var sn = '';
                        var task_text = '';
//                        alert('type='+node['type'])
                        if('type' in node && (node['type'] == 'device')){
                            text = node.device_name;
                            sn = node.device_sn;
                        }else if('type' in node && (node['type'] == 'group_task')){
                            task_text = node['task_id'];
//                            alert(task_text+":"+searchText)
                            if(task_text == searchText){
                                matchedNodeList.push(node);
                                continue;
                            }
                        }

                        if(isMatch(searchText, text)){ //搜索名字是否一样
                            matchedNodeList.push(node);
                        }else if(isMatch(searchText, sn)){
                            matchedNodeList.push(node);
                        }
                    }
    //
                    //隐藏所有节点
                    for(var i = 0; i < nodeList.length; i++){
                        var id = nodeList[i]['id'];
                        $('tr[node-id=\"'+id+'\"]').hide();
                    }

                    //展示所有匹配的节点及其父节点
                    for(var i = 0; i < matchedNodeList.length; i++){
                        var matchNode = matchedNodeList[i];
                        showMatchedNode(opts, combo_tree, matchedNodeList[i], this, nodeList);
                        showChildren(opts, combo_tree, matchNode, this);
                    }
                }
            });


        },
        test: function (jq) {
            jq.each(function () {
                alert($(this))
                var data = $(this).find('tr');
                alert($('tr').length)
            });

        }
    });

/**
 * 判断searchText是否与targetText匹配
 */
function isMatch(searchText, targetText){
   // alert(searchText+":"+targetText);
//    if(searchText == targetText){
    if(!searchText || !targetText)
        return false;
    if(targetText == '')
        return false;
    if(targetText.indexOf(searchText) > -1){
        return true
    }
    return false;
//    return $.tree(targetText) != "" && targetText.indexOf(targetText) != -1;
}

    /**
* 定义获取easyui tree的子节点的递归算法
*/
function getChildNodeList(treegrid, nodes){
    var childNodeList = [];
    if(nodes && nodes.length > 0){
        var node = null;
        for(var i = 0; i < nodes.length; i++){
            node = nodes[i];
            childNodeList.push(node);
            if('children' in node && node['children'].length > 0){
                var children = node['children'];
                childNodeList = childNodeList.concat((getChildNodeList(treegrid, children)));
            }
        }
    }
    return childNodeList;
}

function showMatchedNode(opts, treegrid, node, rg, nodeList){
    //显示匹配节点
    $('tr[node-id=\"'+node['id']+'\"]').show();

    var parent_id = node['_parentId'];
//    var pNode = treegrid.treegrid('getParent', node['id'])
    while(parent_id){
        $('tr[node-id=\"'+parent_id+'\"]').show();
        var has_parent = false;
        for(var i = 0; i < nodeList.length; i++){
            if(nodeList[i]['id'] == parent_id){
                parent_id = nodeList[i]['_parentId'];
                has_parent = true;
                break;
            }
        }
        if(has_parent == false){
            parent_id = null;
        }
    }

    //展开到该节点
//    treegrid.treegrid('expandTo', node['id']);
    //如果是非叶子节点，需折叠该节点的所有子节点
//    if('children' in node && node['children'].length > 0){
//        treegrid.treegrid('collapse', node['id']);
//    }

}

/*获得匹配节点的子孙节点*/
function showChildren(opts, t, matchNode, tg){
    if('children' in matchNode && matchNode['children'].length > 0){
                    var children = matchNode['children'];
                    if(children && children.length > 0){
                        for(var i = 0; i < children.length; i++){
//                            var tr = opts.finder.getTr(tg, children[i]['id']);
//                            tr.show();
                            $("#datagrid-row-r12-2-" + children[i]['id']).show();
                            showChildren(opts, t, children[i], tg);
                        }
                    }
                }
}
})(jQuery);
