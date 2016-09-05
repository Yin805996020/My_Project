/**
 * Created by Mr_Damon on 2016/7/21.
 */

var helper = (function(){
    var isStandardBrowser = "getComputedStyle" in window;

    //������ת��������
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


    // ȥ��json���������˫����
    function jsonParse(jsonStr){
        return "JSON" in window? JSON.parse(jsonStr) : eval("("+jsonStr+")");
    }

    /*  ��ȡ��ǰ�����Ԫ��ֵ �ڶ���������Ԫ��ֵ��ֵ
     *
     *   @ atter:��Ҫ��ȡ�͸�ֵ������
     *   @ val:����ֵ
     * */
    function win(atter,val){
        if(typeof val !== "undefined"){
            document.documentElement[atter] = val;
            document.body[atter] = val;
        }
        return document.documentElement[atter]||  document.body[atter];
    }

    /*   ��ȡԪ����߾�
     *   @ ele ��Ҫ������߾��Ԫ��
     * */
    function offSet(ele){
        var left = null;
        var top = null;
        var pre = ele.offsetParent;

        left += ele.offsetLeft;
        top  += ele.offsetTop;

        while(pre)
        {
            //�������IE8 ���°汾
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

    /*   ��ȡԪ���µ�ĳ������
     *   @ ele Ԫ��
     *   @ atter ����
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

    /*   ����Ԫ���µ�ĳ������
     *   @ ele:Ԫ��
     *   @ atter:����
     *   @ val: ����ֵ
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

    /*   ��ȡԪ����һ��Ԫ�ؽڵ�
     *   @ ele :Ԫ��
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
     *   ��ȡԪ����һ��Ԫ�ؽڵ�
     *   @ ele: Ԫ��
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


    /*   ��ȡԪ�������ϼ�Ԫ�ؽڵ�
     *   @ ele : Ԫ��
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
     *   ��ȡԪ�������¼�Ԫ�ؽڵ�
     *   @ ele : Ԫ��
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

    /*   ��ȡԪ����һ������һ��Ԫ�ؽڵ�
     *   @ ele : Ԫ��
     * */
    function getNearbyEleSibing(ele){
        var ary =[];
        var pre = prevEleSibling(ele);
        var next = nextEleSibling(ele);

        pre ? ary.push(pre):void(0);
        next ? ary.push(next):void(0);
        return ary;
    }

    /*   ��ȡԪ���ϼ����¼�����Ԫ�ؽڵ�
     *   @ ele : Ԫ��
     * */
    function getNearbyEleAll(ele){
        return getPrevEleAll(ele).concat(getNextEleAll(ele));
    }




    /*   ��ȡԪ���� ��������Ԫ�ؽڵ�
     *   @ ele : Ԫ��
     *   @ tagName : ��Ԫ�ؽڵ�
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

    /*   ��ȡԪ�ص�ǰ����λ��
     *   @ ele : Ԫ��
     * */
    function getELeIndex(ele){
        return getPrevEleAll(ele).length;
    }

    /*   ��֤Ԫ�����Ƿ���ڸ�����
     *   @ ele : Ԫ��
     *   @ strClass: ����
     * */
    function verifyEleClassName(ele,strClass){
        strClass = strClass.replace(/^ +| +$/g,'');
        var reg = new RegExp("(^| +)"+strClass+"( +|$)","g");
        return reg.test(ele.className);
    }


    /*  Ԫ���������
     *  @ ele : Ԫ��
     *  @ strClass: ����
     * */
    function addClass(ele,strClass){
        var strClassAry = strClass.replace(/(^ +| +$)/g,"").split(/ +/g);
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i]
            if(!verifyEleClassName(ele,curClass)){ //��ǰ��c2��ele��û�г���
                ele.className += " "+curClass;
            }
        }
    }

    /*  ɾ��Ԫ��������
     *  @ ele : Ԫ��
     *  @ strClass : ����
     * */
    function removeClass(ele,strClass){
        var strClassAry = strClass.replace(/(^ +| +$)/g,"").split(/ +/); //["c2","c3"]
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i];
            if(verifyEleClassName(ele,curClass)){ //����������class���б�Ҫ�Ƴ�
                var reg = new RegExp("(^| +)" + curClass + "( +|$)","g");
                ele.className = ele.className.replace(reg," ");
            }
        }
    }





    /*  ��ȡ�����
    *   @ n ,m : ��Χ
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
    /*  ��������ȡԪ��
     *  @ strClass: ����
     *  @ context : ��Χ
     * */
    function getElementsByClass(strClass,context){

        context = context || document;
        if(context.getElementsByClassName){
            return listToArray(context.getElementsByClassName(strClass));
        }

        var ary = [];
        var strClassAry = strClass.replace(/^ +| +$/g).split(/ +/);
        //��ȡ���з�Χ������Ԫ��
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
