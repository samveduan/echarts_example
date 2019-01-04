/**
 * Created by Administrator on 16-11-22.
 */
(function($){
    $.extend($.fn.tree.methods, {
        search: function(jqTree, searchText){
//            alert(searchText)
            var tree = this;
            //获取所有的树节点
            var nodeList = getAllNodes(jqTree, tree);
//            alert(JSON.stringify(nodeList))
            //如果没有搜索条件，则展开所有树节点
            searchText = $.trim(searchText);
            if(searchText == ""){
                for(var i = 0; i < nodeList.length; i++){
//                    $(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
                    $(nodeList[i].target).show();
                }
                //展开已选择的节点
                var selectNode = tree.getSelected(jqTree);
                if(selectNode){
                    tree.expandTo(jqTree, selectNode.target);
                }
                return;
            }

            //搜索匹配的节点并高亮显示
            var matchedNodeList = [];
            if(nodeList && nodeList.length > 0){
                var node = null;
                for(var i = 0; i < nodeList.length; i++){
                    node = nodeList[i];
                    var text = node.text;
                    if('type' in node && (node['type'] == '设备' || node['type'] == '人员')){
                        text = node.name;
                    }
//                    else{
//                        text = node.name;
//                    }
                    if(isMatch(searchText, text)){
                        matchedNodeList.push(node);
                    }
                }

                //隐藏所有节点
//                alert('nodeList.length='+nodeList.length)
                for(var i = 0; i < nodeList.length; i++){
//                    $(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
                    $(nodeList[i].target).hide();
                }

//                //折叠所有节点
//                tree.collapseAll(jqTree);

                //展示所有匹配的节点及其父节点
//                alert(matchedNodeList.length)
                for(var i = 0; i < matchedNodeList.length; i++){
//                    alert(i+":"+matchedNodeList[i].text)
                    showMatchedNode(jqTree, tree, matchedNodeList[i]);
                    tree.showChildren(jqTree, matchedNodeList[i]);
                }
            }
        },

        //展示节点的子节点（子节点可能在搜索中被隐藏了）
        showChildren: function(jqTree, node){
            var tree = this;
            //展示子节点
            if(!tree.isLeaf(jqTree, node.target)){
                var children = tree.getChildren(jqTree, node.target);
                if(children && children.length > 0){
                    for(var i = 0; i < children.length; i++){
                        if($(children[i].target).is(":hidden")){
                            $(children[i].target).show();
                        }
                    }
                }
            }
        },

        test:function(jqTree){
//            alert('this is a text')
            $('#receve_area_id').tree('expandAll')
        }

        //将滚动条滚动到指定的位置，使该节点可见
    });

    /********easyui tree扩展函数********/
    /**
     * 展示搜索匹配的节点
     */
    function showMatchedNode(jqTree, tree, node){
        //展示所有父节点
        $(node.target).show();
    //    $(".tree-title", node.target).addClass("tree-node-targeted");
    //    var pNode = node;
        var pNode = tree.getParent(jqTree, node.target);
        while(pNode){
            $(pNode.target).show();
            pNode = tree.getParent(jqTree, pNode.target);
        }
    //    while((pNode == tree.getParent(jqTree, pNode.target))){
    //        alert('wwww')
    //        $(pNode.target).show();
    //    }
        //展开到该节点
        tree.expandTo(jqTree, node.target);
        //如果是非叶子节点，需折叠该节点的所有子节点
        if(!tree.isLeaf(jqTree, node.target)){
            tree.collapse(jqTree, node.target);
        }
    }

    /**
     * 判断searchText是否与targetText匹配
     */
    function isMatch(searchText, targetText){
        //alert(searchText+":"+targetText);
        if(targetText.indexOf(searchText) > -1){
            return true
        }
        return false;
    //    return $.tree(targetText) != "" && targetText.indexOf(targetText) != -1;
    }

    /**
     * 获取easyui tree的所有node节点
     */
    function getAllNodes(jqTree, tree){
        var allNodeList = jqTree.data('allNodeList');
        if(!allNodeList){
            var roots = tree.getRoots(jqTree);
            allNodeList = getChildNodeList(jqTree, tree, roots);
            jqTree.data('allNodeList', allNodeList);
        }
        return allNodeList;
    }

    /**
     * 定义获取easyui tree的子节点的递归算法
     */
    function getChildNodeList(jqTree, tree, nodes){
        var childNodeList = [];
        if(nodes && nodes.length > 0){
            var node = null;
            for(var i = 0; i < nodes.length; i++){
                node = nodes[i];
                childNodeList.push(node);
                if(!tree.isLeaf(jqTree, node.target)){
                    var children = tree.getChildren(jqTree, node.target);
                    childNodeList = childNodeList.concat((getChildNodeList(jqTree, tree, children)));
                }
            }
        }
        return childNodeList;
    }
})(jQuery);
