//topo info from system
var topoJson;
$.ajax({
	url:ajax_topo_url1,
	data:{sid:ajax_topo_sid},//某某拓扑的数据
	async:false,
	success:function(d){
	//console.log($.trim(d)=='')
		if($.trim(d)!=''){
			eval('topoJson='+d);	
		}
	}
});

//topo info from frontend
var topoJsonPos;
$.ajax({
	url:ajax_topo_url2,
	data:{sid:ajax_topo_sid},//某某拓扑的位置信息（编辑过的）
	async:false,
	success:function(d){
		if(d!=''){
			eval('topoJsonPos='+d);	
		}		
	}
});

/////////////////////////////合并json不然每次都要修改dom 代码
var allJSON={title:{},icons:[],lines:[]};

if(typeof topoJsonPos=='undefined'||typeof topoJson=='undefined'){
	//alert('找不到该拓扑，新建之')
	var isNewTopo=true;
}else{
	var isNewTopo=false;
	allJSON.title=$.extend({},topoJsonPos.title,topoJson.title);
	$.each(topoJson.icons,function(j,k){
		allJSON.icons[j]=$.extend({},topoJsonPos.icons[j],k);
	})
	$.each(topoJson.lines,function(j,k){
		allJSON.lines[j]=$.extend({},topoJsonPos.lines[j],k);
	})
}

//console.log(JSON.stringify(allJSON, null,' '))
/////////////////////////////

function showTips(x,y,content){
	if(!$('#contextMenu').is(':visible')){
		$('#tipsDiv').css({left:x,top:y}).empty().append(content).show();
	}
}

function hideDivs(){
	$('#tipsDiv').hide();
	$('#contextMenu').hide();
}

function hideZoomr(){
	$('#zoomr').hide();
}

function zoomrAnimate2big(){
	$('#zoomr .zoomr').show();
	$('#zoomr .zoomr').each(function(j,k){
		if(j==0){
			$(this).css({left:20,top:20,backgroundPosition:'0 -433px',opacity:0})	
			$(this).stop().animate({left:0,top:0,opacity:1},500,'swing',hideZoomr)	
		}else if(j==1){
			$(this).css({right:20,top:20,backgroundPosition:'-7px -433px',opacity:0})	
			$(this).stop().animate({right:0,top:0,opacity:1},500,'swing',hideZoomr)	
		}else if(j==2){
			$(this).css({left:20,bottom:20,backgroundPosition:'0 -440px',opacity:0})	
			$(this).stop().animate({left:0,bottom:0,opacity:1},500,'swing',hideZoomr)	
		}else if(j==3){
			$(this).css({right:20,bottom:20,opacity:0})	
			$(this).stop().animate({right:0,bottom:0,opacity:1},500,'swing',hideZoomr)	
		}
	})
}

function zoomrAnimate2small(){
	$('#zoomr .zoomr').show();
	$('#zoomr .zoomr').each(function(j,k){
		if(j==0){
			$(this).css({left:0,top:0,backgroundPosition:'-7px -440px',opacity:0})	
			$(this).stop().animate({left:20,top:20,opacity:1},500,'swing',hideZoomr)	
		}else if(j==1){
			$(this).css({right:0,top:0,backgroundPosition:'0 -440px',opacity:0})	
			$(this).stop().animate({right:20,top:20,opacity:1},500,'swing',hideZoomr)	
		}else if(j==2){
			$(this).css({left:0,bottom:0,backgroundPosition:'-7px -433px',opacity:0})	
			$(this).stop().animate({left:20,bottom:20,opacity:1},500,'swing',hideZoomr)	
		}else if(j==3){
			$(this).css({right:0,bottom:0,backgroundPosition:'0 -433px',opacity:0})	
			$(this).stop().animate({right:20,bottom:20,opacity:1},500,'swing',hideZoomr)	
		}
	})
}

var allIcons=[];
var fitBB;

jQuery(function($){
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('#zoomr .zoomr').each(function(j,k){
	if(j==0){
		$(this).css({left:0,top:0,backgroundPosition:'0 -433px'})	
	}else if(j==1){
		$(this).css({right:0,top:0,backgroundPosition:'-7px -433px'})	
	}else if(j==2){
		$(this).css({left:0,bottom:0,backgroundPosition:'0 -440px'})	
	}else if(j==3){
		$(this).css({right:0,bottom:0,backgroundPosition:'-7px -440px'})	
	}
})

if($.cookie('gCookie')=='{alertAnimation:false,alertAnimation2:false,start_animation:false}'){
	$('#stopAni').addClass('stopAnimation');
}

$('#stopAni').click(function(){
	if($.cookie('gCookie')=='{alertAnimation:false,alertAnimation2:false,start_animation:false}'){
		$.cookie('gCookie','{alertAnimation:true,alertAnimation2:true,start_animation:true}',{expires:30})
		$(this).removeClass('stopAnimation');
	}else{
		$.cookie('gCookie','{alertAnimation:false,alertAnimation2:false,start_animation:false}',{expires:30})
		$(this).addClass('stopAnimation');
	}
})

eval('var gCookie='+$.cookie('gCookie'));

if(gCookie!=null){
	//if has cookie	
	alertAnimation=gCookie.alertAnimation;
	alertAnimation2=gCookie.alertAnimation2;
	start_animation=gCookie.start_animation
}

$('#gCanvas').css({width:canvasSize.width,height:canvasSize.height}).draggable({
	cursor:'pointer',
	//delay:200,
	//containment:[-1*canvasSize.width,-1*canvasSize.height,0,0],
	//cancel:'image',
	start:function(){
		$('#gCanvas').attr('data-isDragging',1)
		hideDivs();
	}
})

var paper = new Raphael(document.getElementById('gCanvas'), '100%', '100%');
var allLines=paper.set();
var allTexts=paper.set();

//标题
//draw title 标题


if(isNewTopo==false){   //////#######如果不是新建 -start
	var topoTitle=paper.text(0,0,allJSON.title.sname);	
	topoTitle.attr({'text-anchor':'start',fill:'90-'+allJSON.title.endcolor+'-'+allJSON.title.startcolor,'font-size':allJSON.title.size,'font-family':allJSON.title.fontFamily,x:allJSON.title.x,y:allJSON.title.y,transform:'r'+allJSON.title.rotate}) ;	
}else{
	var topoTitle=paper.text(100,30,'');	
	topoTitle.attr({'text-anchor':'start',fill:'90-#000-#000','font-size':12,'font-family':'verdana',x:100,y:30,transform:'r0'}) ;
}//////#######如果不是新建 -start

topoTitle.id='topoTitle';
if(!isNewTopo){topoTitle.data('topoid',allJSON.title.sid);}
topoTitle.toBack();

//draw icons initial
$.each(allJSON.icons,function(j,k){
	var icon=paper.image(k.src,k.x,k.y,k.w,k.h);//默认左上角，图标默认大小，这是那种没有被 编辑 过位置 的图标
	icon.id=k.id;
	if(k.sname){
		icon.data('title',k.sname);
	}else{
		icon.data('title','');
	}
	icon.data('url',k.url);
	icon.data('sid',k.sid);
	allIcons.push(icon);
	
	if(k.sid)icon.attr({cursor:'pointer'})
	
	icon.mouseover(function(e){
		if(typeof k.tips!='undefined'){
			showTips(e.clientX,e.clientY,k.tips)	;
			this.attr({transform:'s1.1'})
		}
	})
		
	icon.mouseout(function(e){
		this.attr({transform:'s1'})
	})
		
	if(typeof k.contextmenu!='undefined'){//如果有右键菜单的话
		var contextStr='<ul class="iconContext">'	;
		$.each(k.contextmenu,function(n,m){
			contextStr+='<li data-src="'+m.url+'">'+m.text+'</li>'
		})
		contextStr+='<ul>'	;
		$(icon.node).bind("contextmenu", function(e){
			$('#tipsDiv').hide();
			$('#contextMenu').empty().append(contextStr)
			$('#contextMenu').css({left:e.clientX,top:e.clientY}).show();
			return false;
		});
	}
	
	var text=paper.text(icon.attr('x'),icon.attr('y'),icon.data('title'))
	text.id="text_"+k.id
	text.attr({'font-size':12,'text-anchor':'center'});
	var bb=icon.getBBox();
	text.attr({'transform':'t'+(bb.width*0.5)+','+(bb.height+text.getBBox().height*0.5+4)})	
	allTexts.push(text);
})

$('.iconContext li').live('click',function(){
	window.open($(this).attr('data-src'));	
})

$.each(allJSON.lines,function(j,k){	
	var lineid=k.id.split('_');
	var from=paper.getById(lineid[0]);
	var fx=from.attr('x')+from.attr('width')*0.5;
	var fy=from.attr('y')+from.attr('height')*0.5;
	var to=paper.getById(lineid[1]);
	
	var tx=to.attr('x')+to.attr('width')*0.5;
	var ty=to.attr('y')+to.attr('height')*0.5;
	var line=paper.path('M'+fx+','+fy+'L'+tx+','+ty);
	line.id=lineid[0]+'_'+lineid[1];
	line.toBack();
	allLines.push(line);
	line.attr({'title':from.data('title')+' -> '+to.data('title'),stroke:k.color,'stroke-dasharray':k.style,'stroke-width':k['stroke-width']})
	
	if(k.sid){
		line.attr('cursor','pointer')	;
		line.mouseover(function(){
			this.data('stroke-width',this.attr('stroke-width'))
			this.data('stroke',this.attr('stroke'))
			this.attr({'stroke-width':this.attr('stroke-width')*3,stroke:'#cc0000'})	
		}).mouseout(function(){
			this.attr({'stroke-width':this.data('stroke-width'),stroke:this.data('stroke')})	
		}).click(function(){		
			window.open(k.url+'?from='+from.data('sid')+'&to='+to.data('sid'));		
		})
	}else{
		line.hover(function(){
			this.attr('opacity',0.6)
		},function(){
			this.attr('opacity',1)
		})	
	}	
})

$('#contextMenu').click(function(){
	$(this).hide();	
})

//var alertAnimate = 
var alertCircle=paper.circle(100,100,0);
alertCircle.attr({'stroke-width':2,stroke:'#cc0000'});

//alert messgae --------------duplicate enough circles for icon
var circleSet=paper.set();
var questionSet=paper.set();

$.each(allIcons,function(j,k){
	var oCircle=alertCircle.clone();
	oCircle.id='alert_'+k.id;
	var bb=k.getBBox();
	var maxRadius=bb.width>bb.height?bb.width:bb.height;
	oCircle.attr({cx:bb.x+bb.width*0.5,cy:bb.y+bb.height*0.5,r:maxRadius*0.5});
	if(alertAnimation){
	var alertAnimate = Raphael.animation({opacity:0,transform:'s2'},1000,'easeOut',function(){	});
	oCircle.toBack().animate(alertAnimate.delay(3000).repeat(Infinity))
	}
	
	//oCircle.pause();
	oCircle.toBack().hide();
	circleSet.push(oCircle);
	
	//var thisbb=paper.getById('001').getBBox();
	

	
	var questionIcon=paper.image('themes/default/images/question.png',bb.x+bb.width-8,bb.y-8,16,16)
	questionIcon.id='ques_'+k.id;
	questionSet.push(questionIcon)
	
	var bounceAni = Raphael.animation({transform:'t0,-5'},500,'bounce');
	if(alertAnimation2){
		questionIcon.animate(bounceAni.repeat(Infinity))
	}
	questionSet.hide()
	
})

/////////////////////////////
//},(anim_icon-anim_icon_delay)*(allIcons.length-1))//有动画，延迟画线  -end

//setInterval(function(){
////	

var alertTimer=null;
function ajax4alert(){
	var request=$.ajax({
		url:ajax_topo_alert,
		data:{sid:ajax_topo_sid},
		cache:false,
		success:function(d,e){
			circleSet.hide();
			questionSet.hide()		
			if(d!=''){			
			eval('var d='+d);
			$.each(d,function(j,k){
				var obj=paper.getById(k.id);
				var circle=paper.getById('alert_'+k.id);	
				var question=	paper.getById('ques_'+k.id);	
				circle.show();
				question.show();
			})
			}
			alertTimer=setTimeout(ajax4alert,alertInterval*1000);
		}
	})
	
	//prevent ram leak 
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
}

ajax4alert();


////
//},alertInterval*1000)

var backRect=paper.rect(0,0,canvasSize.width,canvasSize.height);
backRect.id="backRect"
backRect.toBack();
backRect.attr({'fill-opacity':0,fill:'#ffffff','stroke-width':0})

backRect.mouseover(hideDivs)

$('#toLeft').mouseenter(function(){
	$(this).parent().css({'background-position':'0 -176px'})	
})

$('#toRight').mouseenter(function(){
	$(this).parent().css({'background-position':'0 -88px'})	
})

$('#toTop').mouseenter(function(){
	$(this).parent().css({'background-position':'0 -44px'})	
})

$('#toBottom').mouseenter(function(){
	$(this).parent().css({'background-position':'0 -132px'})	
})

$('#gToolbar_move').mouseleave(function(){
	$(this).css({'background-position':'0 0'})	
})

$('#gToolbar_move a').click(function(){
	var c=$('#gCanvas');
	var pos=c.position();
	var obj=$(this);	
	if(obj.attr('id')=='toRight'){
		c.stop().animate({left:'+='+controlStep},200,'swing')
	}else if(obj.attr('id')=='toLeft'){
		c.stop().animate({left:'-='+controlStep},200,'swing')
	}else if(obj.attr('id')=='toTop'){
		c.stop().animate({top:'-='+controlStep},200,'swing')
	}else if(obj.attr('id')=='toBottom'){
		c.stop().animate({top:'+='+controlStep},200,'swing')
	}
	
})

//zoom levels

var zoomLevel=1;
var zoomStep=0.1;
var lastSize=canvasSize.width;
var lastZoomLevel;

$('#zoom2original').click(function(){
	zoomLevel=1;
	zoomStep=0.1;
	lastSize=canvasSize.width;
	paper.setViewBox(0,0,canvasSize.width*zoomLevel,canvasSize.height*zoomLevel, false)
	$('#gCanvas').css({left:0,top:0,marginLeft:0,marginTop:0})
})

function zoomAtCenter(xx,yy){
	$('#zoomr').css({left:xx-30,top:yy-30}).show();
	var newSize = canvasSize.width/zoomLevel;		
	var cx = xx-parseInt($('#gCanvas').css('margin-left'))-$('#gCanvas').position().left;
	var cy = yy-parseInt($('#gCanvas').css('margin-top'))-$('#gCanvas').position().top;	
	var npx = (cx/lastSize) * newSize;
	var npy =  (cy/lastSize) * newSize;
	$('#gCanvas').css({marginLeft:(xx-npx-$('#gCanvas').position().left)})
	$('#gCanvas').css({marginTop:(yy-npy-$('#gCanvas').position().top)})	
	lastSize=canvasSize.width/(zoomLevel);
	paper.setViewBox(0,0,canvasSize.width*zoomLevel,canvasSize.height*zoomLevel, false)	
}

$('#zoom2small').click(function(){
	if(zoomLevel>=4){
		//alert('已经最小了');
		return false;}
	zoomLevel+=zoomStep;
	zoomAtCenter($(window).width()*0.5,$(window).height()*0.5);	
	zoomrAnimate2small();
})

$('#zoom2big').click(function(){
	if(zoomLevel-zoomStep<=0.2){
		//alert('已经最大了！');
		return false;}
	zoomLevel-=zoomStep;
	zoomAtCenter($(window).width()*0.5,$(window).height()*0.5);
	zoomrAnimate2big();
})

$('html').mousewheel(function(e,delta){	
	if(delta>0){
		if(zoomLevel-zoomStep<=0.2){
			//alert('已经最大了！');
			return false;}
		zoomLevel-=zoomStep;
		zoomrAnimate2big();
	}else{
		if(zoomLevel>=4){//alert('已经最小了');
		return false;}
		zoomLevel+=zoomStep;
		zoomrAnimate2small();
	}	
	zoomAtCenter(e.clientX,e.clientY);
	if(e.shiftKey){e.preventDefault();}
})

$('html').mouseup(function(e){
	if(e.button==1){
		$('#zoom2original').trigger('click')
	}	
})

////fuck ie
if($.browser.msie&&$.browser.version<8){
	$('#zoom2big').hide()
	$('#zoom2small').hide()
	$('#fit2win').hide();
	$('#editTopo').hide();
	$('#zoom2original').css({marginTop:'-50px'})
	$('#stopAni').css({marginTop:'-50px'})
}

if(allJSON.icons.length==0){
	var winW=$(window).width();
	var winH=$(window).height();
	
	var noTopo=paper.text(0,0,'没有该编号的拓扑！')	
	noTopo.attr({'font-size':winH,opacity:0,x:winW*0.5,y:winH*0.5,'font-family':'黑体'})
	noTopo.animate({'font-size':24,opacity:1,fill:'#666'},1000,'bounce',function(){
		//console.log(noTopo)
	})
}

//fit window
/*
$('#fit2win').click(function(){	
	var allIconsSet=paper.set();
	$.each(allIcons,function(j,k){
		allIconsSet.push(k);
	})
	allIconsSet.push(paper.getById('topoTitle'));
	fitBB=allIconsSet.getBBox();	
	var winW=$(window).width();
	var winH=$(window).height();	
	if(fitBB.width/fitBB.height>winW/winH){
		zoomLevel=(fitBB.width+40)/winW
	}else{
		zoomLevel=(fitBB.height+40)/winH	
	}
	paper.setViewBox(fitBB.x-20,fitBB.y-20,zoomLevel*canvasSize.width,zoomLevel*canvasSize.height,false)
	$('#gCanvas').css({'left':0,'top':0,'margin-left':0,'margin-top':0})
})
*/

$('#editTopo').click(function(){
	window.open(topo_edit_url);
})

$('#fit2win').click(function(){
	var allIconsSet=paper.set();
	$.each(allIcons,function(j,k){
		allIconsSet.push(k);
	})
	allIconsSet.push(paper.getById('topoTitle'));
	fitBB=allIconsSet.getBBox();	
	var winW=$(window).width()-40;
	var winH=$(window).height()-40;	
	
	var w=fitBB.width/winW;
	var h=fitBB.height/winH;
	var multiLevel;
		
	if(w>h){
		multiLevel=w;
		var resizeByWidth=true;
	}else{
		multiLevel=h;	
		var resizeByWidth=false;
	}
	zoomLevel=multiLevel;
	zoomAtCenter(fitBB.x,fitBB.y);	
	hideZoomr();
	
	if(resizeByWidth){
		var otop=(winH-fitBB.height/zoomLevel)*0.5+20;
		//console.log(winH,fitBB.height/zoomLevel)
		if(otop<0){otop=-1*otop}
		$('#gCanvas').css({'margin-left':-1/zoomLevel*fitBB.x,'margin-top':-1/zoomLevel*fitBB.y,left:'20px',top:otop});
	}else{
		var oleft=(winW-fitBB.width/zoomLevel)*0.5+20;
		if(oleft<0){oleft=-1*oleft;}
		$('#gCanvas').css({'margin-left':-1/zoomLevel*fitBB.x,'margin-top':-1/zoomLevel*fitBB.y,left:oleft,top:'20px'});
	}
})


//拖动事件定义
var iconIsDragging=0;

$.each(allIcons,function(j,k){
	var st=paper.set();
	var icon=k;
	
	icon.mouseup(function(e){
		if(e.button==2){return false;}
		//frefixo e.button 左键是0； ie 左键是 1
		
		if(iconIsDragging==1){
			iconIsDragging=0;
		}else{
			if(icon.data('url')){
				window.open(icon.data('url'))	
			}
		}		
	})
	
	st.push(icon);
	st.push(paper.getById('text_'+icon.id))
	
	st.drag(function (dx, dy){//move
	
		var bb = st.getBBox();
		dx=dx*zoomLevel
		dy=dy*zoomLevel
		st.attr({x:bb.x+(st.oBB.x-bb.x)+dx,y:bb.y+(st.oBB.y-bb.y)+dy});
				
		//拖动以后，重画相关连线		
		paper.forEach(function(m){
			if(m.type=='path'&&m.data('gtype')!='line'){
				var iconsArr=m.id.split('_');
				if(iconsArr[0]==icon.id||iconsArr[1]==icon.id){
					var from=paper.getById(iconsArr[0]).getBBox();
					var to=paper.getById(iconsArr[1]).getBBox();
					//console.log(m)
					var path='M'+(from.x+from.width*0.5)+','+(from.y+from.height*0.5)+'L'+(to.x+to.width*0.5)+','+(to.y+to.height*0.5);
					m.attr({path:path})
				}
			}
		})	
		iconIsDragging=1;
	}, function (e) {//start
		st.oBB=this.getBBox();
		$('#gCanvas').draggable( "option", "disabled", true)
		hideDivs();
	}, function(e){//up
		$('#gCanvas').draggable( "option", "disabled", false )
		
		paper.getById('alert_'+icon.id).attr({cx:icon.attr('x')+icon.attr('width')*0.5,cy:icon.attr('y')+icon.attr('height')*0.5})
		paper.getById('ques_'+icon.id).attr({x:icon.attr('x')+icon.attr('width')-8,y:icon.attr('y')+icon.attr('height')-8});
		iconIsDragging=0;
				
	})
})

$('#gToolbar_move').css({marginLeft:'-60px'},400,'easeInOutBounce')
$('#gToolbar_zoom').css({marginLeft:'-60px'},400,'easeInOutBounce')
		
$(window).mousemove(function(e){
	if(e.clientX<100){
		$('#gToolbar_move').stop().animate({marginLeft:0},400,'easeInOutBounce')
		$('#gToolbar_zoom').stop().animate({marginLeft:0},400,'easeInOutBounce')
	}else{
		$('#gToolbar_move').stop().animate({marginLeft:'-60px'},400,'easeInOutBounce')
		$('#gToolbar_zoom').stop().animate({marginLeft:'-60px'},400,'easeInOutBounce')
	}
})

/////////////////////////////
})

$(window).load(function(){
	//默认 fit win 不需要的话，关掉这里
	if(allJSON.icons.length==0){
		//
	}else{
		$('#fit2win').trigger('click');
	}
})