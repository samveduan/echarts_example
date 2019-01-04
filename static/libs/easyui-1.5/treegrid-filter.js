/**
 * Created by Administrator on 16-11-23.
 */
(function($){
    $.extend($.fn.treegrid.methods, {
        search: function(jqTreeGrid, searchText){
            jqTreeGrid.each(function(){
                //如果没有搜索条件，则展开所有树节点
                var t = $(this);
                searchText = $.trim(searchText);
                var state = $(this).data('treegrid');
                var opts = state.options;
//                alert(JSON.stringify(opts))
                //获得所有节点
                var roots = t.treegrid('getRoots');
                var nodeList = getChildNodeList_treeGrid(t, roots);
                if(searchText == ""){
                    for(var i = 0; i < nodeList.length; i++){
                        var tr = opts.finder.getTr(this, nodeList[i]['id']);
                        tr.show();
                    }
                    //展开已选择的节点
                    var selectNode = t.treegrid('getSelected');
                    if(selectNode){
                        t.treegrid('expandTo', selectNode['id']);
//                        treegrid.expandTo(jqTreeGrid, selectNode.target);
                    }
                    return;
                }
//
            //搜索匹配的节点并高亮显示
            var matchedNodeList = [];
            if(nodeList && nodeList.length > 0){
                var node = null;
                for(var i = 0; i < nodeList.length; i++){
                    var node = nodeList[i];

                    var name_text = '';
                    var sn_text = '';
                    if('name' in node){
                        name_text = node['name'];
                    }else if('text' in node){
                        name_text = node['text'];
                    }
//                    var task_task = '';
//                    alert(JSON.stringify(node))
                    if('type' in node && (node['type'] == 'device' || node['type'] == '设备')){
//                        alert(JSON.stringify(node))
                        name_text = node.device_name;
                        sn_text = node.sn;
                    }else if('type' in node && (node['type'] == 'user' || node['type'] == '人员')){
                        name_text = node.user_name;
                        sn_text = node.sn;
                    }else if('type' in node && (node['type'] == 'group_task')){
                        name_text = node.device_name;
                        sn_text = node.sn;
                        if(searchText == node['task_id']){
                            matchedNodeList.push(node);
                            continue;
                        }
                    }
//                    alert(node['id'])
                    if(isMatch(searchText, name_text)){
                        matchedNodeList.push(node);

                    }else if(isMatch(searchText, sn_text)){
                        matchedNodeList.push(node);
                    }
                }
//
                //隐藏所有节点
                for(var i = 0; i < nodeList.length; i++){
                    var tr = opts.finder.getTr(this, nodeList[i]['id']);
                    tr.hide();
                }
                //展示所有匹配的节点及其父节点
//                alert('match:'+matchedNodeList.length)
                for(var i = 0; i < matchedNodeList.length; i++){
                    var matchNode = matchedNodeList[i];
                    showMatchedNode(opts, t, matchedNodeList[i], this);
                    showChildren(opts, t, matchNode, this);
                }
            }
            })
        }
    });

function showChildren(opts, t, matchNode, tg){
    if('children' in matchNode && matchNode['children'].length > 0){
                    var children = matchNode['children'];
                    if(children && children.length > 0){
                        for(var i = 0; i < children.length; i++){
                            var tr = opts.finder.getTr(tg, children[i]['id']);
                            tr.show();
                            showChildren(opts, t, children[i], tg);
                        }
                    }
                }
}

    /**
 * 判断searchText是否与targetText匹配
 */
function isMatch(searchText, targetText){
//   alert(searchText+":"+targetText);
//    if(searchText == targetText){
    if(!searchText || !targetText){
        return false;
    }
    if(targetText.indexOf(searchText) > -1){
        return true;
    }
    return false;
//    return $.tree(targetText) != "" && targetText.indexOf(targetText) != -1;
}

/**
* 定义获取easyui tree的子节点的递归算法
*/
function getChildNodeList_treeGrid(treegrid, nodes){
    var childNodeList = [];
    if(nodes && nodes.length > 0){
        var node = null;
        for(var i = 0; i < nodes.length; i++){
            node = nodes[i];
            childNodeList.push(node);
            if('children' in node && node['children'].length > 0){
                var children = treegrid.treegrid('getChildren', node.id);
//                alert(node.id)
                childNodeList = childNodeList.concat((getChildNodeList_treeGrid(treegrid, children)));
            }
        }
    }
    return childNodeList;
}

function showMatchedNode(opts, treegrid, node, rg){
    //展示所有父节点
//    alert(node['id'])
    var tr = opts.finder.getTr(rg, node['id']);
    tr.show();
//    $(node.target).show();
//    $(".tree-title", node.target).addClass("tree-node-targeted");
//    var pNode = node;
    var pNode = treegrid.treegrid('getParent', node['id'])
    while(pNode){
        var tr = opts.finder.getTr(rg, pNode['id']);
        tr.show();
        pNode = treegrid.treegrid('getParent', pNode['id']);
//        pNode = treegrid.getParent(jqTreeGrid, pNode.target);
    }

    //展开到该节点
    treegrid.treegrid('expandTo', node['id']);
//    treegrid.expandTo(jqTreeGrid, node.target);
    //如果是非叶子节点，需折叠该节点的所有子节点
    if('children' in node && node['children'].length > 0){
        treegrid.treegrid('collapse', node['id']);
    }

}
})(jQuery);
