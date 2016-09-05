/*
 拖拽产品1.0版
 使用说明
 Drag是类名，类上有三个方法，分别是down,move,up
 类上还有五个属性
 this.ele 表示被拖指的元素，即被拖拽的元素保存在此属性上

 当实现一个元素的拖拽时，把被拖拽的元素做为参数传给构造函数，用法如下
 var obj=new Drag(div1);
 new Drag(div2);

 拖拽产品1.1
 在此版本中，可以让用户自行实现给拖拽扩展其它功能的功能，接口如下：
 在拖拽开始的阶段扩展功能，请用"dragstart"事件
 用法如：var obj=new Drag(div1);
 obj.on("dragstart",fn1);
 在拖拽开始的阶段，扩展功能请用"dragging"事件
 用法如： obj.on("dragging",fn2);

 在拖拽结束的阶段，扩展功能请用"dragend"事件
 用法如：obj.on("dragend",fn3);

 特别强调：
 如果你想在扩展的方法中使用被拖拽的元素，请用实例上的ele属性。

 拖拽产品1.2

 限定拖拽：
 obj.range({left:0,right:500,top:0,bottom:400});
 //重写move方法


 */

function EventEmitter(){};
EventEmitter.prototype.on=function(type,fn){
    if(!this["aEmitter"+type]){
        this["aEmitter"+type]=[];
    }
    var a=this["aEmitter"+type];
    for(var i=0;i<a.length;i++){
        if(a[i]==fn)return this;
    }
    a.push(fn);
    return this;
};
EventEmitter.prototype.run=function(type,e){
    var a=this["aEmitter"+type];
    if(a){
        for(var i=0;i<a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.off=function(type,fn){
    var a=this["aEmitter"+type];
    if(a){
        for(var i=0;i<a.length;i++){
            if(a[i]==fn){
                a[i]=null;
                return this;
            }
        }
    }
    return this
};

function Drag(ele){//这个参数ele就是被拖拽的元素
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;
    this.ele=ele;
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,"mousedown",this.DOWN);

}
Drag.prototype=new EventEmitter;//实现继承
Drag.prototype.down=function(e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx=e.pageX;
    this.my=e.pageY;
    if(this.ele.setCapture){
        on(this.ele,"mousemove",this.MOVE);
        on(this.ele,"mouseup",this.UP);
    }else{
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    e.preventDefault();
    this.run("dragstart",e);
};

Drag.prototype.move=function(e){
    this.ele.style.left=this.x+e.pageX-this.mx+"px";
    this.ele.style.top=this.y+e.pageY-this.my+"px";
    this.run("dragging",e);

};
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapure();
        off(this.ele,"mousemove",this.MOVE);
        off(this.ele,"mouseup",this.UP);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    this.run("dragend",e);
};

Drag.prototype.range=function(oRange){
    this.oRange=oRange;
    this.on("dragging",this.addRange);
    return this;
};

//控制范围 由于
Drag.prototype.addRange=function(e){//重新计算拖拽的位置，其实这个方法的计算会覆盖move方法
    var lll=this.oRange.left;
    var rlll=this.oRange.right;
    var t=this.oRange.top;
    var b=this.oRange.bottom;
    var currentX=this.x+e.pageX-this.mx;
    var currentY=this.y+e.pageY-this.my;
    with(this.ele.style){
        if(currentX<=lll){
            left=lll+"px";
        }else if(currentX>=rlll){
            left=rlll+"px";
        }else{
            left=currentX+"px";
        }
        if(currentY<=t){
            top=t+"px";
        }else if(currentY>=b){
            top=b+"px";
        }else{
            top=currentY+"px";
        }

    }


};


Drag.prototype.addBorder=function(){
    this.ele.style.border="dashed 2px gray";
};
Drag.prototype.removeBorder=function(){
    this.ele.style.border="none";
};

Drag.prototype.border=function(){
    this.on("dragstart",this.addBorder);
    this.on("dragend",this.removeBorder);
    return this;
};

function processThis(fn,obj){
    return function(e){
        fn.call(obj,e);
    }
}