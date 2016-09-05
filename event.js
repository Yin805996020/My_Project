function on(ele,type,fn){

    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    if(!ele["aEvent"+type]){
        ele["aEvent"+type]=[];
        ele.attachEvent("on"+type,function(){run.call(ele)});
    }

    var a=ele["aEvent"+type]
    for(var i=0;i<a.length;i++){
        if(a[i]==fn)return;//避免重复绑定
    }
    a.push(fn);//这是核心代码

}

function run(e){//小run是负责通知的秘书：遍历执行已经保存在程序池（事件池）里的那些方法
     e=window.event;
    var type=e.type;//e
    var a=this["aEvent"+type];
    if(a){
        e.target=e.srcElement;
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
        e.preventDefault=function(){
            e.returnValue=false;
        }
        e.stopPropagation=function(){
            e.cancelBubble=true;
        }

        for(var i=0;i<a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }

    }

}


function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a=ele["aEvent"+type];
    if(a){
        for(var i=0;i<a.length;i++){
            if(a[i]==fn){
                a[i]=null;//如果程序池中的第i项就是我们要移除的那个方法，则将其置为null，而不到用splice删除（会导致数组塌陷）
                return;
            }
        }
    }

}

function processThis(fn,context){
    return function(e){fn.call(context,e);}
}