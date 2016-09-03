/**
 * Created by yinsq on 16/8/2.
 */

//=========== 头部 ============
//头部更多
var header = document.getElementById('header');
var hdRMore = document.getElementById('hdRMore');
//更多的隐藏框
var hdRMore_popup = utils.getElementsByClass('hdRMore_popup',hdRMore)[0];
var hdRMoreUl = hdRMore.getElementsByTagName('ul')[0];

//=========== Logo ===========
var logo = document.getElementById('logo');
var searcher = document.getElementById('searcher');
var searcher_popup = document.getElementById('searcher_popup');

var logo_popup = document.getElementById('logo_popup');




//=========== 内容 ============
//内容主的框体
var contentBox = document.getElementById('content');
//内容中的导航
var  contNav = document.getElementById('contNav');
var contNavUl = contNav.getElementsByTagName('ul')[0];
var contLis =   contNavUl.getElementsByTagName('li');


//内容导航中的设置
var contSetting = utils.getElementsByClass('contNav_setting',contNav)[0];


//内容导航设置隐框
var contNav_setting_popup = utils.getElementsByClass('contNav_setting_popup',contentBox)[0];


var contNavSettingFocus = document.getElementById('contNavSettingFocus');
var contNavSettingFocus_ul = utils.getElementsByClass('contNavSettingFocus_ul',contNavSettingFocus)[0];

var contNavSettingFocus_lis = contNavSettingFocus_ul.getElementsByTagName('li');

var contNavSettingNoFocus = document.getElementById('contNavSettingNoFocus');
var contNavSettingNoFocus_ul = utils.getElementsByClass('contNavSettingNoFocus_ul',contNavSettingNoFocus)[0];
var contNavSettingNoFocus_lis = contNavSettingNoFocus_ul.getElementsByTagName('li');



//内容主体
var contDetails = document.getElementById('contDetails');
//var detailDivs =contDetails.getElementsByTagName('div');
//内容-推荐

//获取新闻内容容器
var news = document.getElementById('news');
var newsLeft = document.getElementById('newsLeft');
var newsTitle = document.getElementById('newsTitle');
var newsContUl = document.getElementById('newsContUl');
var newsContLis = newsContUl.getElementsByTagName('li');
var newsImgs = newsContUl.getElementsByTagName('img');


var newsRTitle = document.getElementById('newsRTitle');
var newsRCont = document.getElementById('newsRCont');

var newsMore_down = document.getElementById('newsMore_down');



//var contentDown = document.getElementById('contentDown');


/************* DATA ****************/
var hdRMoreLiData;
var contNavData;
var newsData;
var newsAddData;




;(function(){
    //头部 导航更多
    getHdRMoreLiData();
    bindHdRMoreLiData();

    //内容 导航
    getContNavData();
    bindContNavData();
    bindEventForContNavData();


    //内容 新闻
    getNewsData();
    bindNewsData();
    downEvenetForNews();

    window.setTimeout(imgAllDelayLoad,300);



})();

/*
document.body.onclick = function(e){
    e = e || window.event;
    e.target = e.target || e.srcElement;
}
*/

var newsMore = document.getElementById('newsMore');

window.onscroll = function(e){

    //先进行延迟加载  在添加新的新闻内容

    /*************  滚动浏览器 无限加载新闻内容 ***************/
    imgAllDelayLoad();
    //溢出的高度
    var curScrollTop = utils.win("scrollTop");
    // body 的高度 减去  屏幕分辨率的高度  这样 可以适用于各种分辨率浏览器
    var curHalfScreen = document.body.scrollHeight - window.screen.height;
    if(curScrollTop > curHalfScreen){
        getContentForNews();
        addContentForNews(5);
        imgAllDelayLoad();

        if(curHalfScreen > window.screen.height){
            contentBorder();
        }
    }

    // 要减去搜索框的高度 就是当 移动到搜索框上的时候 显示 固定定位的搜索框
    var logoScrollTop = logo.offsetHeight + logo.offsetTop - searcher.clientHeight;
    if(curScrollTop > logoScrollTop){
        //debugger;
        //logo_popup.style.display = 'block';
        utils.css(logo_popup,'display','block');
    }else{
        //logo_popup.style.display = 'none';
        utils.css(logo_popup,'display','none');
    }


    if(utils.css(newsMore,'display') == "none"){
        // 要减去 下拉显示的搜索框 就是 定位的高度
        var newsRTitleTop = utils.offSet(newsRTitle.parentNode).top + newsRTitle.offsetHeight - logo_popup.clientHeight;
        // 要减去  自己的宽度 就是 框体距离body 左边的距离
        var newsRContLeft = utils.offSet(newsRCont.parentNode).left + newsRCont.parentNode.offsetWidth - newsRCont.clientWidth;

        if(curScrollTop > newsRTitleTop){
            newsRContFixed();
        }else{


            clearNewsRContFixed(newsRContLeft);
        }
    }

    /**********************************/


};





/*************** HeadNav_More *******************/

header.onmouseover = function(e){
    e = e||window.event;
    e.target = e.target || e.srcElement;

    if(e.target.id == 'hdRMore' && e.target.nodeName.toLowerCase() =='div'){
        hdRMore_popup.style.height = utils.win('clientHeight') + utils.win('scrollTop') +'px';
    }

}

// 顶部导航栏  更多
function getHdRMoreLiData(){
    var xhr = new XMLHttpRequest();
    xhr.open("get","../data/hdRMore.txt?_="+Math.random(),false);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            hdRMoreLiData = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}

function bindHdRMoreLiData(){
    if(hdRMoreLiData)
    {
        var str ='';
        for(var i = 0 ; i < hdRMoreLiData.length; i++)
        {
            str+='<li>';
            str+='<a href="'+hdRMoreLiData[i].urlPath+'" target="_blank"><img src="'+hdRMoreLiData[i].imgSrc+'"/>'+hdRMoreLiData[i].title+'</a>';
            str+='</li>';
        }
        hdRMoreUl.innerHTML =str;
    }
}

/*************** END HeadNav_More *****************/

/*************** Logo Searcher *******************/

logo.onclick =  function(e){
    e = e || window.event;
    e.target = e.target || e.srcElement;

    if(e.target.nodeName.toLocaleLowerCase() == 'a' && e.target.parentNode.parentNode.parentNode.id == "searcher_popup"){
        searcher.value = e.target.innerHTML;
        searcher_popup.style.display = 'none';
    }

};

searcher.oninput = searcher.onkeyup = function(e){
    var reg = /^ *$/;
    if(reg.test(this.value)){
        searcher_popup.style.display = 'none';
        return;
    }
    searcher_popup.style.display = 'block';
}




/*************** END Logo Searcher *******************/


/****************** ContentNav ********************/

contNav.onclick = function (e){
    e = e  || window.event;
    e.target = e.target || e.srcElement;
    // debugger;

    //导航选中状态
    if(e.target.nodeName.toLowerCase() == 'li' ){

        for(var i = 0 ; i < contLis.length; i++) {
            if (contLis[i] != e.target) {
                utils.removeClass(contLis[i], 'contNavBg');
            } else {
                utils.addClass(e.target, 'contNavBg');
                changeDetailDivs(e.target);
            }
        }
    }

    //导航设置点击事件
    if(e.target.nodeName.toLowerCase() == 'a' && e.target.className == 'contNav_setting'){
        if(e.target.className == 'contNav_setting_popup'){
            return;
        }
        //debugger;
        if(window.getComputedStyle(contNav_setting_popup).display == 'block'){
            utils.css(contNav_setting_popup,'display','none');
            contSetting.index = 0;
        }else{
            utils.css(contNav_setting_popup,'display','block');
            animate(contNav_setting_popup,{height:200},300);
            contSetting.index = 1;
        }
    }

    //导航中的设置选项
    if(e.target.nodeName.toLowerCase() == 'a' && e.target.id == 'contNav_setting'){
        contNavSettingDragLis();
    }




};


//内容   导航
function getContNavData(){
    var xhr = new XMLHttpRequest();
    xhr.open("get","../data/contNav.txt?_="+Math.random(),false);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            contNavData = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}

function bindContNavData(){
    if(contNavData)
    {
        var str ='';
        for(var i = 0 ; i< contNavData.length;i++)
        {
            if(i == 0)
            {
                str +='<li class="cont_concern" dataID="'+contNavData[i].dataid+'">';
                str +='<span></span>';
            }else{
                str+='<li dataID="'+contNavData[i].dataid+'">';
            }
            str += contNavData[i].contNavName;
            str +='</li>';
        }
        contNavUl.innerHTML = str;
    }
}

//内容中导默认值
function bindEventForContNavData(){
    for(var i = 0 ; i< contLis.length; i++){

        if(contLis[i].getAttribute('dataid') == 3 ){
            utils.addClass(contLis[i],'contNavBg');
            changeDetailDivs(contLis[i]);
        }
    }
}
//导航 选中状态
function changeDetailDivs(ele){
    var detailDivs = utils.children(contDetails,"div");
    for(var i= 0 ; i< detailDivs.length; i++){
        if(detailDivs[i].getAttribute('dataid') == ele.getAttribute('dataid')){
            detailDivs[i].style.display = 'block';
        }else{
            detailDivs[i].style.display = 'none';
        }
    }
}


/****************** END ContentNav ********************/




/************ Content News  ****************/

news.onclick = function(e){
    e = e  || window.event;
    e.target  = e.target|| e.srcElement;
    //debugger;

    //新闻内容向下标记
    if(e.target.id == "newsMore" || e.target.id == "newsMore_circle" || e.target.id == "newsMore_down" ){
        clearDwonEvevtForNews();
    }
    //新闻内容中删除按钮
    if(e.target.className == "nolos" && e.target.nodeName.toLowerCase() == 'a'){

        newsContUl.removeChild(e.target.parentNode.parentNode);

        //删除一条信息  相应的添加一条信息;
        getContentForNews(1);
        addContentForNews(1);
        //删除后面的信息 添加图片延迟加载;
        imgAllDelayLoad();
    }


};


function getNewsData(){
    var xhr = new XMLHttpRequest();
    xhr.open("get","../data/newsData.txt?_="+Math.round(),false);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status== 200){
            newsData = utils.jsonParse(xhr.responseText);
        }
    };
    xhr.send(null);
}

//绑定新闻内容
function bindNewsData(){
    if(newsData){
        var str = '';
        for(var i = 0; i< newsData.length; i++){
            str += '<li id="newsContLi">';
            var img = newsData[i].imgSrc;

            str += img.length == 1?'<h2 class="contentTitle">':'<h2>';

            str += newsData[i].isHot ? '<i>热</i>':'';
            str += '<a href="'+newsData[i].src+'" title="'+newsData[i].newsTitle+'" target="_blank">'+newsData[i].newsTitle+'</a>';

            str += '<a class="nolos" href="javascript:void(0)"><div class="nolos_popup"><span class="arrowDown_up"></span><span class="arrowDown_down"></span>不感兴趣</div></a>';
            str +=' </h2>';


            if(img.length > 0){
                if(img.length == 3){
                    str += '<div class="picBox clearfix">';
                }else{
                    str += '<div class="picBox picBoxR clearfix">';
                }
                for(var j = 0 ; j < img.length ; j++){
                    str += '<a href="'+newsData[i].src+'" title="'+newsData[i].newsTitle+'" target="_blank">';


                    str +='<img src="" trueSrc="'+img[j]+'"/>';
                    str +='</a>';
                }
                str += '</div>';
            }

            str += '<p class="newsTime">'

            str +='<a href="'+newsData[i].provideSrc+'">'+newsData[i].provideName+'</a>';
            str +='<span>'+newsData[i].month+'</span>';
            str +='<span>'+newsData[i].hour+'</span>';
            str +='</p>';

            str += '</li>';
        }

        newsContUl.innerHTML = str;

    }
}

//图片延迟加载
function imgAllDelayLoad(){
    for(var i = 0 ; i < newsImgs.length; i++){
        //debugger;
        var broOffset = utils.win('clientHeight') + utils.win('scrollTop'); //获取浏览器底边距离body顶部的距离
        var imgOffset = newsImgs[i].parentNode.offsetHeight + utils.offSet(newsImgs[i].parentNode).top;

        if(broOffset >= imgOffset){
            imgDelayLoad(newsImgs[i]);
        }

    }
}

//单张图片延迟加载
function imgDelayLoad(img){

    if(img.isloaded) {return;};
    var tempImg = new Image();
    //让这个临时图片去加载真实图片资源
    tempImg.src = img.getAttribute('trueSrc');
    //debugger;
    tempImg.onload = function (){

        img.src = this.src;
        utils.css(img,"display","block");
        animate(img,{opacity:1},200);
    }
    tempImg = null;
    img.isloaded = true;
}

//获取添加新闻内容   (接口应每次获取5条新的数据 由后台提供 因没有做后台所以使用假数据 假数据只创建5条)
function getContentForNews(){
    var xhr = new XMLHttpRequest();
    xhr.open("get","../data/newsAddData.txt?_="+Math.round(),false);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status== 200){
            newsAddData = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}

//添加新闻内容
function addContentForNews(count){
    if(newsAddData){
        var str = '';
        //如果没有传参数 那么每次添加5个内容
        count = Number(count) == 0 ? newsAddData.length : Number(count);

        for(var i = 0 ; i < count ; i++){
            //for(var j = 0 ; j < )

            str += '<li id="newsContLi">';
            var img = newsAddData[i].imgSrc;

            str += img.length == 1?'<h2 class="contentTitle">':'<h2>';

            str += newsAddData[i].isHot ? '<i>热</i>':'';
            str += '<a href="'+newsAddData[i].src+'" title="'+newsAddData[i].newsTitle+'" target="_blank">'+newsAddData[i].newsTitle+'</a>';

            str += '<a class="nolos" href="javascript:void(0)"><div class="nolos_popup"><span class="arrowDown_up"></span><span class="arrowDown_down"></span>不感兴趣</div></a>';
            str +=' </h2>';


            if(img.length > 0){
                if(img.length == 3){
                    str += '<div class="picBox clearfix">';
                }else{
                    str += '<div class="picBox picBoxR clearfix">';
                }
                for(var j = 0 ; j < img.length ; j++){
                    str += '<a href="'+newsAddData[i].src+'" title="'+newsAddData[i].newsTitle+'" target="_blank">';


                    str +='<img src="" trueSrc="'+img[j]+'"/>';
                    str +='</a>';
                }
                str += '</div>';
            }

            str += '<p class="newsTime">'

            str +='<a href="'+newsAddData[i].provideSrc+'">'+newsAddData[i].provideName+'</a>';
            str +='<span>'+newsAddData[i].month+'</span>';
            str +='<span>'+newsAddData[i].hour+'</span>';
            str +='</p>';

            str += '</li>';
        }

        newsContUl.innerHTML += str;

    }

}

//向下箭头不断运动;
function downEvenetForNews(){
    //var interval = 10;
    newsMore_down.timerr = setInterval(function(){

        animate(newsMore_down,{top:17},700);
        var downTop = utils.css(newsMore_down,'top');
        if(downTop == 17){
            animate(newsMore_down,{top:8},700);
        }
    },750);

}

//清除向下箭头运动 并 添加新的数据
function clearDwonEvevtForNews(){
    window.clearInterval(newsMore_down.timerr);
    utils.css(newsMore_down.parentNode.parentNode,'display','none');

    getContentForNews();
    addContentForNews(5);
    imgAllDelayLoad();
    contentBorder();


}

//计算内容边框高度
function contentBorder(){

    //多添加30px 使其永远都不超出content div;
    var contNewsHeigeht = newsLeft.scrollHeight + newsTitle.scrollHeight+ contNav.clientHeight + 30 +'px';
    //给内容主盒子新的高度
    utils.css(contentBox,'height',contNewsHeigeht);
    //清除益出清空样式
    utils.css(news,'overflow','inherit');
}


/************ END  Content News  ****************/

function newsRContFixed(){
    utils.css(newsRCont,'position','fixed');
    utils.css(newsRCont,'top',90);
    utils.css(newsRCont,'right',175);

}

function clearNewsRContFixed(left){
    utils.css(newsRCont,'position','inherit');
    utils.css(newsRCont,'top',0);
    utils.css(newsRCont,'left',left);

}




/************ contNav_setting_popup  ****************/

// contNav_setting_popup

// contNavSettingFocus
// contNavSettingFocus_ul
// contNavSettingFocus_lis

// contNavSettingNoFocus
// contNavSettingNoFocus_ul
// contNavSettingNoFocus_lis







function contNavSettingDragLis(){

    //订阅的
    for(var i = contNavSettingFocus_lis.length - 1 ; i >= 0 ; i--){
        var lis = contNavSettingFocus_lis[i];
        //debugger;


        //console.log(lis.offsetLeft);
        lis.style.left = (lis.l =lis.offsetLeft) +"px";
        lis.style.top = (lis.t = lis.offsetTop )+ "px";
        lis.style.position = 'absolute';
        lis.style.margin = 0;
        new Drag(lis).on("dragstart",contNavSettingDragLisZindex).on("dragend",changePosition).on("dragging",hitedTest);
    }

    //未订阅的
    for(var j = contNavSettingNoFocus_lis.length - 1 ; j >= 0 ; j--){
        var lisNo = contNavSettingNoFocus_lis[j];
        //console.log(lisNo.offsetLeft);
        lisNo.style.left = (lisNo.l = lisNo.offsetLeft) + "px";
        lisNo.style.top = (lisNo.t = lisNo.offsetTop )+ "px";
        lisNo.style.position = 'absolute';
        lisNo.style.margin = 0;
        new Drag(lisNo).on("dragstart",contNavSettingDragLisZindex).on("dragend",changePosition).on("dragging",hitedTest);
    }

}
var zIndex = 0;
function contNavSettingDragLisZindex(){
    this.ele.style.zIndex = ++zIndex;
}

function goHome(){
    animate(this.ele,{left:this.ele,top:this.ele.t},800,4);
}


function isHited(DragEle,ele){
//碰撞检测算法 如果两个元素撞上返回true 否则返回false;
    //DragEle 是拖动元素  ele是比对元素
    if(DragEle.offsetLeft + DragEle.offsetWidth < ele.offsetLeft||DragEle.offsetTop + DragEle.offsetHeight < ele.offsetTop||ele.offsetLeft  + ele.offsetWidth< DragEle.offsetLeft||ele.offsetTop + ele.offsetHeight < DragEle.offsetTop){
        return true;
    }else{
        return false;
    }
}

function hitedTest(){//当拖拽进行的时候，把碰撞上的元素保存下来
    this.aHited=[];//用来保存撞上的元素

    for(var i=0;i<contNavSettingFocus_lis.length;i++){
        var oLi=contNavSettingFocus_lis[i];
        if(oLi==this.ele){
            continue;//自已不必和自己做碰撞检测
        }
        if(isHited(this.ele,oLi)){
            this.aHited.push(oLi);//把撞上的保存下来
            //oLi.style.backgroundColor="red";//并且把撞上的元素背景置为红色
        }else{
            //oLi.style.backgroundColor="";//把本次没有撞上的元素的背景再恢复
        }
    }

    for(var i=0;i<contNavSettingNoFocus_lis.length;i++){
        var oLiNo=contNavSettingNoFocus_lis[i];
        if(oLiNo==this.ele){
            continue ;//自已不必和自己做碰撞检测
        };
        if(isHited(this.ele,oLiNo)){
            this.aHited.push(oLiNo);//把撞上的保存下来
            //oLiNo.style.backgroundColor="red";//并且把撞上的元素背景置为红色
        }else{
            //oLiNo.style.backgroundColor="";//把本次没有撞上的元素的背景再恢复
        }
    }
}



function changePosition(){
    var a = this.aHited;
    if(a && a.length){

        for(var i=0;i<a.length;i++){
            var oLi=a[i];
            var ele=this.ele;
            oLi.distance=Math.sqrt(Math.pow(ele.offsetLeft-oLi.offsetLeft,2)+Math.pow(ele.offsetTop-oLi.offsetTop,2));
        }
        a.sort(function(a,b){return a.distance-b.distance});//按距离排序
        var shortest=a[0];//第0项就是距离最短的

        //交换位置

        animate(shortest,{left:ele.l,top:ele.t},800,4);
        animate(ele,{left:shortest.l,top:shortest.t},800,3);

        var templ=ele.l;
        var tempt=ele.t;
        ele.l=shortest.l;
        ele.t=shortest.t;
        shortest.l=templ;
        shortest.t=tempt;

    }else{//如果没有和任何元素撞上，则返回自己原来位置
        goHome.call(this);
    }
}







/************ END  contNav_setting_popup  ****************/







































