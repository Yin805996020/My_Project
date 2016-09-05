/**
 * Created by Mr_Damon on 2016/7/21.
 */

var helper = (function(){
    var isStandardBrowser = "getComputedStyle" in window;

    //类数组转换成数组
    function listToArray(listAry){
        if(isStandardBrowser)
        {
            return Array.prototype.slice.call(listAry);
        }
        else
        {
            var ary =[];
            for(var i = 0; i < listAry.length; i++)
            {
                ary[i] = listAry[i];
            }
            return ary;
        }
    }


    // 去除json数据最外层双引号
    function jsonParse(jsonStr){
        return "JSON" in window? JSON.parse(jsonStr) : eval("("+jsonStr+")");
    }

    /*  获取当前浏览器元素值 第二个参数给元素值赋值
     *
     *   @ atter:需要获取和赋值的属性
     *   @ val:属性值
     * */
    function win(atter,val){
        if(typeof val !== "undefined"){
            document.documentElement[atter] = val;
            document.body[atter] = val;
        }
        return document.documentElement[atter]||  document.body[atter];
    }

    /*   获取元素外边距
     *   @ ele 需要计算外边距的元素
     * */
    function offSet(ele){
        var left = null;
        var top = null;
        var pre = ele.offsetParent;

        left += ele.offsetLeft;
        top  += ele.offsetTop;

        while(pre)
        {
            //如果不是IE8 以下版本
            if(window.navigator.userAgent.indexOf("MSIE 8") === -1)
            {
                left += pre.clientLeft;
                top  += pre.clientTop;
            }

            left += pre.offsetLeft;
            top  += pre.offsetTop;

            pre = pre.offsetParent;

        }
        return {left:left,top:top};


    }

    /*   获取元素下的某个属性
     *   @ ele 元素
     *   @ atter 属性
     * */
    function getCss(ele,atter){
        var val = null;
        if(isStandardBrowser){
            val = window.getComputedStyle(ele,null)[atter];
        }
        else{
            if(atter == "opacity"){
                val = ele.currentStyle.filter;
                var filReg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;

                val = filReg.test(val)? filReg.exec(val)[1]/100:1;
            }else{
                val = ele.getComputedStyle[atter];
            }
        }
        var reg = /^-?\d+(\.\d+)?(pm|px|em|rem|deg)?$/;
        if(reg.test(val))
        {
            val = parseFloat(val);
        }
        return val;
    }

    /*   设置元素下的某个属性
     *   @ ele:元素
     *   @ atter:属性
     *   @ val: 属性值
     * */
    function setCss(ele,attr,val){
        if(attr == 'opacity'){
            ele.style.opacity = val;
            ele.style.filter = 'alpha(opacity='+val*100+")";
            return;
        }
        if(attr == 'float'){
            ele.style.cssFloat = val;
            ele.style.styleFloat = val;
            return;
        }
        var reg = /width|height|left|top|right|bottom|(margin|padding)(Left|Right|Top|Bottom)?/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val += "px";
            }
        }
        ele.style[attr] = val;

    }

    /*   获取元素上一级元素节点
     *   @ ele :元素
     * */
    function prevEleSibling(ele){
        if(isStandardBrowser){
            return ele.previousElementSibling;
        }else{
            var pre = ele.previousSibling;
            while(pre && pre.nodeType != 1){
                 pre = pre.previousSibling;
            }
            return pre;
        }
    }

    /*
     *   获取元素下一级元素节点
     *   @ ele: 元素
     * */
    function getNextEleSibing(ele){
        if(isStandardBrowser){
            return ele.nextElementSibling;
        }else{
            var next = ele.nextSibling;
            while(next && next.nodeType != 1){
                next = next.nextSibling;
            }
            return next;
        }
    }


    /*   获取元素所有上级元素节点
     *   @ ele : 元素
     * */
    function getPrevEleAll(ele){
        var ary =[];
        var pre = ele.previousSibling;
        while(pre){
            if(pre.nodeType == 1){
                ary.push(pre);
            }
            pre = pre.previousSibling;
        }
        return ary;

    }

    /*
     *   获取元素所有下级元素节点
     *   @ ele : 元素
     * */
    function getNextEleAll(ele){
        var ary =[];
        var next = ele.nextSibling;
        while(next){
            if(next.nodeType == 1){
                ary.push(next);
            }
            next = next.previousSibling;
        }
        return ary;

    }

    /*   获取元素上一级和下一级元素节点
     *   @ ele : 元素
     * */
    function getNearbyEleSibing(ele){
        var ary =[];
        var pre = prevEleSibling(ele);
        var next = nextEleSibling(ele);

        pre ? ary.push(pre):void(0);
        next ? ary.push(next):void(0);
        return ary;
    }

    /*   获取元素上级和下级所有元素节点
     *   @ ele : 元素
     * */
    function getNearbyEleAll(ele){
        return getPrevEleAll(ele).concat(getNextEleAll(ele));
    }




    /*   获取元素下 所有有子元素节点
     *   @ ele : 元素
     *   @ tagName : 子元素节点
     * */
    function getEleChildren(ele,tagName){
        var val = null;
        if(isStandardBrowser){
            val = listToArray(ele.children);
        }else{
            var ary = [];
            var child = ele.childNodes;
            for(var i = 0 ; i < child.length; i++){
                if(child[i].nodeType == 1)
                {
                    ary.push(child[i]);
                }
            }
            val =  ary;
        }

        if(tagName != "string"){
            for(var j= 0 ; j < val.length; j++){
                if(val[i].nodeName != tagName.toUpperCase())
                {
                    val.splice(j,'');
                    j--;
                }
            }
        }
        return ary;
    }

    /*   获取元素当前索引位置
     *   @ ele : 元素
     * */
    function getELeIndex(ele){
        return getPrevEleAll(ele).length;
    }

    /*   验证元素中是否存在该类名
     *   @ ele : 元素
     *   @ strClass: 类名
     * */
    function verifyEleClassName(ele,strClass){
        strClass = strClass.replace(/^ +| +$/g,'');
        var reg = new RegExp("(^| +)"+strClass+"( +|$)","g");
        return reg.test(ele.className);
    }


    /*  元素添加类名
     *  @ ele : 元素
     *  @ strClass: 类名
     * */
    function addClass(ele,strClass){
        var strClassAry = strClass.replace(/(^ +| +$)/g,"").split(/ +/g);
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i]
            if(!verifyEleClassName(ele,curClass)){ //当前的c2在ele中没有出现
                ele.className += " "+curClass;
            }
        }
    }

    /*  删除元素下类名
     *  @ ele : 元素
     *  @ strClass : 类名
     * */
    function removeClass(ele,strClass){
        var strClassAry = strClass.replace(/(^ +| +$)/g,"").split(/ +/); //["c2","c3"]
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i];
            if(verifyEleClassName(ele,curClass)){ //如果存在这个class才有必要移除
                var reg = new RegExp("(^| +)" + curClass + "( +|$)","g");
                ele.className = ele.className.replace(reg," ");
            }
        }
    }





    /*  获取随机数
    *   @ n ,m : 范围
    * */
    function getRandom(n,m)
    {
        n = Number(n);
        m = Number(m);
        if(isNaN(n) || isNaN(m))
        {
            return Math.random();
        }
        if(n>m)
        {
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }







    /********** Dom **************/
    /*  按类名获取元素
     *  @ strClass: 类名
     *  @ context : 范围
     * */
    function getElementsByClass(strClass,context){

        context = context || document;
        if(context.getElementsByClassName){
            return listToArray(context.getElementsByClassName(strClass));
        }

        var ary = [];
        var strClassAry = strClass.replace(/^ +| +$/g).split(/ +/);
        //获取所有范围内所有元素
        var childs = context.getElementsByTagName('*');


        for(var i= 0 ; i < childs.length;i++)
        {
            var flag = true;
            for(var j = 0 ; j < strClassAry.length; j++)
            {
                var reg = new RegExp("(^| +)"+strClassAry[j]+"( +|$)","g");
                if(!reg.test(childs[i].className))
                {
                    flag = false;
                    break;
                }

            }
            if(flag){
                ary.push(childs[i]);
            }
        }
        return ary;
    }


    return {
        listToArray:listToArray,
        jsonParse:jsonParse,
        win:win,
        offSet:offSet,
        getCss:getCss,
        setCss:setCss,
        prevEleSibling:prevEleSibling,
        getNextEleSibing:getNextEleSibing,
        getPrevEleAll:getPrevEleAll,
        getNextEleAll:getNextEleAll,
        getNearbyEleSibing:getNearbyEleSibing,
        getNearbyEleAll:getNearbyEleAll,
        getEleChildren:getEleChildren,
        getELeIndex:getELeIndex,
        verifyEleClassName:verifyEleClassName,
        addClass:addClass,
        removeClass:removeClass,
        getRandom:getRandom,
        getElementsByClass:getElementsByClass
    }
})();
