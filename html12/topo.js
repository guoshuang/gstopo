//Static topo icons checklist -- category of Network
var topoTypeList;
$.ajax({
	url:ajax_icon_list_url,
	async:false,
	success:function(d){
		eval('topoTypeList='+d);	
	}
});

//topo info from system
var topoJson;
$.ajax({
	url:ajax_topo_url1,
	data:{sid:ajax_topo_sid},//某某拓扑的数据
	async:false,
	success:function(d){
		if(d!=''){
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

var line_start,line_end,line_clicked=0;
var allIcons=[];
var allNewIcons=[];
var alNewLines=[]

//隐藏层
function hideDivs(){
	$('#tipsDiv').hide();
	$('#contextMenu').hide();
}

//放大的动画
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

//放大缩小 动画层隐藏
function hideZoomr(){$('#zoomr').hide();}

//缩小的动画
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

jQuery(function($){
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if($.browser.msie&&parseInt($.browser.version)<10){$('body').html('<div style="padding:20px;">编辑功能不再支持IE 10以下，请使用freifox或者chrome</div>')}

var paper = new Raphael(document.getElementById('gCanvas'), '100%', '100%');
var allLines=paper.set();
var allTexts=paper.set();

$('#gCanvas').css({width:canvasSize.width,height:canvasSize.height})

//draw title 标题
if(!isNewTopo){   //////#######如果不是新建 -start
	var topoTitle=paper.text(0,0,allJSON.title.sname);	
	topoTitle.attr({'text-anchor':'start',fill:'90-'+allJSON.title.endcolor+'-'+allJSON.title.startcolor,'font-size':allJSON.title.size,'font-family':allJSON.title.fontFamily,x:allJSON.title.x,y:allJSON.title.y,transform:'r'+allJSON.title.rotate}) ;	
}else{
	var topoTitle=paper.text(100,30,'');		
	topoTitle.attr({'text-anchor':'start',fill:'90-#000-#000','font-size':12,'font-family':'verdana',x:100,y:30,transform:'r0'}) ;
}//////#######如果不是新建 -start

topoTitle.id='topoTitle';

if(!isNewTopo){topoTitle.data('topoid',allJSON.title.sid);}

$(topoTitle.node).bind('contextmenu',function(e){
	var contextMenu=$('#contextMenu');
	contextMenu.empty().append('<ul><li class="editTitle">编辑标题</li><li class="del">删除</li></ul>')
	contextMenu.css({left:e.clientX,top:e.clientY}).show();
	contextMenu.find('li.editTitle').click(function(){
		$('#tool_title').trigger('click');
	})
	contextMenu.find('li.del').click(function(){
		topoTitle.attr('text','')
	})
	return false;
})

topoTitle.mouseup(function(){
	if(topoJson.title.isFront){
		topoTitle.toFront();
	}else{
		topoTitle.toBack();
	}
})

topoTitle.toBack();

topoTitle.drag(function (dx, dy){//move
	var bb = topoTitle.getBBox();
	dx=dx*zoomLevel
	dy=dy*zoomLevel
	topoTitle.attr({x:bb.x+(topoTitle.oBB.x-bb.x)+dx,y:bb.y+(topoTitle.oBB.y-bb.y)+dy+bb.height*0.5});
}, function (e) {//start
	//topoTitle.toFront();
	topoTitle.oBB=this.getBBox();
	topoTitle.attr({cursor:'pointer'})
	$('#gCanvas').draggable( "option", "disabled", true );
}, function(e){//up
	topoTitle.attr({cursor:'default'})
	$('#gCanvas').draggable( "option", "disabled", false );
});

$('#tool_title').click(function(){
	var otitle=topoTitle.attr('text')
	var osize=topoTitle.attr('font-size')
	var ofamily=topoTitle.attr('font-family')
	var ocolor=topoTitle.attr('fill').split('-')
	if(topoTitle.next==null){var isFront=true}else{var isFront=false}
	var orotate=topoTitle.attr('transform')[0][1]
	var ox=topoTitle.attr('x');
	var oy=topoTitle.attr('y');
	
	$('#titleInfoEditor input').each(function(j,k){
		if($(k).hasClass('name')){
			$(k).val(otitle);	
		}else if($(k).hasClass('size')){
			$(k).val(osize);	
		}else if($(k).hasClass('family')){
			$(k).val(ofamily);	
		}else if($(k).hasClass('gra1')){
			$(k).val(ocolor[1]);	
		}else if($(k).hasClass('gra2')){
			$(k).val(ocolor[2]);	
		}else if($(k).hasClass('isfront')){
			$(k).val(isFront);	
		}else if($(k).hasClass('rotate')){
			$(k).val(orotate);	
		}else if($(k).hasClass('x')){
			$(k).val(ox);	
		}else if($(k).hasClass('y')){
			$(k).val(oy);	
		}
	})		
	$('#titleInfoContainer').dialog('open')
})

$('#titleInfoContainer').dialog({
	title:'编辑标题',
	modal:true,
	width:360,
	autoOpen:false
})

//modify title finished
$('#modifyTitleBtn').click(function(){
	$('#titleInfoContainer').dialog('close');
	var obj=$('#titleInfoEditor');
	topoTitle.attr({fill:'90-'+obj.find('.gra1').val()+'-'+obj.find('.gra2').val(),"font-size":obj.find('.size').val(),'font-family':obj.find('.family').val(),x:obj.find('.x').val(),y:obj.find('.y').val(),transform:'r'+obj.find('.rotate').val(),text:obj.find('.name').val()}) 
})

function drawLine(thisID){
	var oldNNewIcons=[];
	$.each(allIcons,function(j,k){
		oldNNewIcons.push(k)
	})
	$.each(allNewIcons,function(j,k){
		oldNNewIcons.push(k)
	})
		
	if($('#tool_line').hasClass('now')){
		if(line_clicked==0){
			line_clicked=1;
			line_start=thisID;
		}else if(line_clicked==1){
			line_clicked=0;
			line_end=thisID;
			//$('#tool_line').removeClass('now');
			
			//绘画新线--start			
			if(line_start==line_end){return false}
			//console.log(line_start,line_end)
			
			var start=paper.getById(line_start);
			var end=paper.getById(line_end);
			var sbb=start.getBBox();			
			var ebb=end.getBBox();
			var x1=sbb.x+sbb.width*0.5;
			var y1=sbb.y+sbb.height*0.5;
			var x2=ebb.x+ebb.width*0.5;
			var y2=ebb.y+ebb.height*0.5;
			var line=paper.path('M'+x1+','+y1+'L'+x2+','+y2)
			line.toBack();
			line.id=line_start+'_'+line_end;
			line.data('gtype','line');
			//line.data('gtype','line');
			line.attr({'stroke-width':2})//太细了，不好选，默认2
			allLines.push(line)
			
			$('#tool_line').removeClass('now');//一次只能画一根线
			
			giveHandle2line(line)
			
			//绘画新线--end
		}		
	}	
	//return oldNNewIcons.length;
}

/////////////////////////////*****************/////////////////////////////

//draw icons
$.each(allJSON.icons,function(j,k){
	var icon=paper.image(k.src,k.x,k.y,k.w,k.h);
	icon.id=k.id;
	if(typeof k.sname!='undefined'&&k.sname!=''){
		icon.attr('title',k.sname);	
	}else{
		icon.attr('title','')	
	}

	icon.data('sid',k.sid);
	icon.data('stype',k.stype);		
	allIcons.push(icon);
	//draw texts	
	var text=paper.text(k.x,k.y,icon.attr('title'))
	text.attr({'font-size':12,'text-anchor':'center'});
	text.attr({'transform':'t'+k.w*0.5+','+(k.h+text.getBBox().height*0.5+4)})	
	text.id="text_"+k.id;
	allTexts.push(text);
	
})

//draw lines
$.each(allJSON.lines,function(j,k){
	var arr=k.id.split('_');
	var from=paper.getById(arr[0]);
	var to=paper.getById(arr[1]);
	var fx=from.attr('x')+from.attr('width')*0.5;
	var fy=from.attr('y')+from.attr('height')*0.5;
	var tx=to.attr('x')+to.attr('width')*0.5;
	var ty=to.attr('y')+to.attr('height')*0.5;	
	var line=paper.path('M'+fx+','+fy+'L'+tx+','+ty);
	line.id=k.id;
	line.data('gtype','line');
	line.toBack();
	allLines.push(line);	
	line.attr({stroke:k.color,'stroke-dasharray':k.style,'stroke-width':k['stroke-width']})
})

var isMultiSelect=false;
var multiSet=paper.set();

//*****************必须在图标和线段画完之后，才能赋予图标时间（因为拖动（大小）图标会导致text位置大小变化）
function giveHandle2icon(icon){
			
	//点击第一次开始，第二次 连线 | firefox 可以直接 icon.click(function(){drawLine(icon.id);}) | 但是 chrome 的 drag up 会阻断 click
	icon.click(function(){
		drawLine(icon.id);
		st.toFront();
	})
	
	//拖动事件定义
	var st=paper.set();
	st.push(icon);
	st.push(paper.getById('text_'+icon.id))
	
	st.drag(function (dx, dy){//move
	
		if(isMultiSelect==false){//如果单拖			
			var bb = st.getBBox();
			dx=dx*zoomLevel
			dy=dy*zoomLevel
			st.attr({x:st.oBB.x+dx,y:st.oBB.y+dy});					
			//拖动以后，重画相关连线		
			paper.forEach(function(m){
			
				if(m.type!='path'){return;}
				if(m.data('gtype')!='line'){return;}
				var icons2=m.id.split('_');
				if(icons2[0]==icon.id||icons2[1]==icon.id){
					var from=paper.getById(icons2[0]).getBBox();
					var to=paper.getById(icons2[1]).getBBox();
					var path='M'+(from.x+from.width*0.5)+','+(from.y+from.height*0.5)+'L'+(to.x+to.width*0.5)+','+(to.y+to.height*0.5);
					m.attr({path:path})
				}
			})
		}else{
		

///////////////多选拖动

dx=dx*zoomLevel
dy=dy*zoomLevel
//this.attr({x:st.oBB.x+dx,y:st.oBB.y+dy});

$.each(multiSet,function(j,k){
	//console.log(k)
	k.attr({x:k.oBB.x+dx,y:k.oBB.y+dy});
	var text=paper.getById('text_'+k.id);
	if(text){
		text.attr({x:k.oBB.x+dx,y:k.oBB.y+dy});
	}
	paper.forEach(function(m){
	
		if(m.type!='path'){return;}		
		if(m.data('gtype')!='line'){return;}
		
		var icons2=m.id.split('_');
		if(icons2[0]==k.id||icons2[1]==k.id){
			//console.log(k.id)
			var from=paper.getById(icons2[0]).getBBox();
			var to=paper.getById(icons2[1]).getBBox();
			var path='M'+(from.x+from.width*0.5)+','+(from.y+from.height*0.5)+'L'+(to.x+to.width*0.5)+','+(to.y+to.height*0.5);
			m.attr({path:path})
		}
	})
})

///////////////



		}
	}, function (e) {//start
		//st.toFront();
		st.oBB=this.getBBox();
		st.attr({cursor:'pointer'})
		if(this.data('selected')==true){
			isMultiSelect=true;
			multiSet=null;
			multiSet=paper.set();			
			paper.forEach(function(k){
				if(k.type=='image'&&k.data('selected')==true){
					multiSet.push(k);
					k.oBB=k.getBBox();
				}
			})
			multiSet.multiBB=multiSet.getBBox();
			//console.log(multiSet)
		}else{
			isMultiSelect=false;
		}
	}, function(e){//up
		st.attr({cursor:'default'})	
		if($.browser.msie&&$.browser.version<10){//ie  67  这个笨蛋 drag up 切断了 click；ie9 是 svg 但是 也切断了 click。
			this.node.click()
		}
		
	})
	
	
	//滚轮事件定义
	$(icon.node).mousewheel(function(e,delta){		
		if(e.shiftKey){var step=0.1}else{var step=0.01;}		
		var bb=icon.getBBox();		
		
		if(e.ctrlKey){
			if(delta>0){
				icon.attr({y:(bb.y-bb.height*step*0.5),height:bb.height*(1+step)});
			}else{
				icon.attr({y:(bb.y+bb.height*step*0.5),height:bb.height*(1-step)});
			}			
		}else{
			if(delta>0){
				icon.attr({y:(bb.y-bb.height*step*0.5),height:bb.height*(1+step),x:(bb.x-bb.width*step*0.5),width:bb.width*(1+step)});
			}else{
				icon.attr({y:(bb.y+bb.height*step*0.5),height:bb.height*(1-step),x:(bb.x+bb.width*step*0.5),width:bb.width*(1-step)});
			}	
		}
		
		//重新计算文字位置
		var bb=icon.getBBox();
		var text=paper.getById('text_'+icon.id)
		text.attr({x:bb.x,y:bb.y})
		text.attr({'transform':'t'+bb.width*0.5+','+(bb.height+text.getBBox().height*0.5+4)});	
		return false;
	})
	
	//右键时间定义
	$(icon.node).contextmenu(function(e){
		//图标的 contextmenu -start
		var contextMenu=$('#contextMenu');
		contextMenu.empty().append('<ul data-id="'+icon.id+'" data-title="'+icon.attr('title')+'"><li class="point2sys">图标关联</li><li class="iconInfo">图标类型</li><li class="fenge"></li><li class="del">删除</li></ul>')
		contextMenu.css({left:e.clientX,top:e.clientY}).show();
		$('#iconID').val(icon.id);
		
		//菜单事件 ---------start
		contextMenu.find('li.point2sys').click(function(){
			var guanlianwin=window.open('guanlian.php','editguanlian','width=700,height=500,left='+(window.screen.availWidth-700)/2+',top='+(window.screen.availHeight-500)/2+',location=0,toolbar=0,scrollbars=1,menubar=0,resizable=1')	
			guanlianwin.focus();
		})
		
		contextMenu.find('li.iconInfo').click(function(){
			$('#iconInfoEditor').find('.iconid').val(icon.id)
			$('#iconInfoDiv').dialog('open');
		})
		
		contextMenu.find('li.del').click(function(){
			var lineWantToDel=paper.set();			
			if(window.confirm('删除图标会同时删除相关线段，不可恢复，确认要删除吗')){
				var iconid=icon.id;
				icon.remove();
				paper.getById('text_'+iconid).remove()
				paper.forEach(function(k){
					if(k.type=='path'){
						var lineId=k.id.split('_');
						if(lineId[0]==iconid||lineId[1]==iconid){
							k.attr({'stroke':'#cc0000'});		
							lineWantToDel.push(k)
						}	
					}
				})
				lineWantToDel.remove();
			}			
		})
		return false;
		//图标的 contextmenu -end
	})
}

$.each(allIcons,function(j,k){
	giveHandle2icon(k);//点击画线  滚轮 右键 拖动
})

//line 事件
function giveHandle2line(k){
	
	//line hover	
	k.hover(function(){
		//console.log(k.attr('opacity'))
		k.data({'stroke-width':k.attr('stroke-width'),'color':k.attr('stroke'),'opacity':k.attr('opacity')});
		k.attr({'stroke-width':k.attr('stroke-width')*3,'stroke':'#c00',opacity:0.7})
	},function(){
		k.attr({'stroke-width':k.data('stroke-width'),'stroke':k.data('color'),'opacity':k.data('opacity')})
	})
			
	//line context,menu
	$(k.node).bind('contextmenu',function(e){
		////////////////////////////----////
		var contextMenu=$('#contextMenu');
		contextMenu.empty().append('<ul><li class="point2sys">连线关联</li><li class="line">连线属性</li><li class="fenge"></li><li class="del">删除</li></ul>')
		contextMenu.css({left:e.clientX,top:e.clientY}).show();	
		
		contextMenu.find('li.point2sys').click(function(){
			$('#lineID').val(k.id);
			var iconArr=k.id.split('_');
			if(paper.getById(iconArr[0]).data('sid')&&paper.getById(iconArr[1]).data('sid')){
				var guanlianwin=window.open('guanlian_line.php?startid='+paper.getById(iconArr[0]).data('sid')+'&end='+paper.getById(iconArr[1]).data('sid'),'editguanlian','width=700,height=500,left='+(window.screen.availWidth-700)/2+',top='+(window.screen.availHeight-500)/2+',location=0,toolbar=0,scrollbars=1,menubar=0,resizable=1')	;
				guanlianwin.focus();
			}else{
				alert('要关联的连线，两头的图标需要先关联，才能得到sid!')
			}

			
		})
		
		contextMenu.find('li.del').click(function(){
			if(window.confirm('确认要删除吗')){
				k.remove();	
			}			
		})
		contextMenu.find('li.line').click(function(){
			var oid=k.id;
			var ocolor=k.attr('stroke');
			var owidth=k.attr('stroke-width');
			var odash=k.attr('stroke-dasharray');
						
			var obj=$('#lineInfoEditor');
			obj.find('.lineId').val(oid);
			obj.find('.color').val(ocolor);
			obj.find('.width').val(owidth);
			obj.find('.dash').val(odash);
			
			$('#lineInfoContainer').dialog('open');
		})
		////////////////////////////----////
		return false;
	})
}

$.each(allLines,function(j,k){
	giveHandle2line(k);//滚轮 右键 拖动
})
/////////////////////////////*****************////////////////////////////

$('#gCanvas').draggable({
	cursor:'pointer',	
	cancel:'image',
	start:function(){
		isDragging=0;
	}
})

////////操作类工具

$('#tool_line').click(function(){
	$(this).toggleClass('now');	
	$(this).siblings().removeClass('now');
	$('#multiSelectTool').slideUp('fast');	
	paper.forEach(function(obj){obj.attr({opacity:1});obj.data('selected',false)})
	backRect.hide();
	$('#gCanvas').draggable( "option", "disabled", false );
})

$('#tool_pan').click(function(){
	$(this).toggleClass('now');	
	$(this).siblings().removeClass('now');
	
	if($(this).hasClass('now')){	
		$('#gCanvas').draggable( "option", "disabled", true );
		$('#multiSelectTool').slideDown('fast');
		backRect.show();
	}else{
		$('#gCanvas').draggable( "option", "disabled", false );
		$('#multiSelectTool').slideUp('fast');
		paper.forEach(function(obj){obj.attr({opacity:1});obj.data('selected',false)})
		backRect.hide();
	}		
})

var polygonArr=[];

$('#tool_shape').click(function(){
	$(this).toggleClass('now');	
	$(this).siblings().removeClass('now');
	
	if($(this).hasClass('now')){
		$('#gCanvas').draggable( "option", "disabled", true );
		polygonArr=[];
		backRect.show();
		var pid=new Date().getTime();
		$('#polygonId').val(pid);
		var polygon=paper.path('M0,0');
		polygon.id=pid;
		polygon.attr({'stroke-width':5,'stroke-linecap':'round'})
		polygon.hover(function(){
			this.attr({'stroke':'#c00','stroke-width':5})
		},function(){
			this.attr({'stroke':'#000','stroke-width':2})
		})
		$(polygon.node).contextmenu(function(e){
			var contextMenu=$('#contextMenu');
			contextMenu.empty().append('<ul data-pid="'+pid+'"><li class="edit">编辑形状</li><li class="style">颜色和样式</li><li class="del">删除</li></ul>')
			contextMenu.css({left:e.clientX,top:e.clientY}).show();			
			contextMenu.find('li.del').click(function(){
				polygon.remove();
				$('#tool_shape').removeClass('now');//正在画线的过程中 删除之
			})
			contextMenu.find('li.edit').click(function(){
				//编辑多边形
				
				var parr=polygon.attr('path');
				var st=paper.set();
				$.each(polygon.attr('path'),function(j,k){
					if(j==polygon.attr('path').length-1){return false}
					var handler=paper.circle(k[1],k[2],10);
					handler.attr({'fill':'#fff','fill-opacity':0.6})
					
					st.push(handler);
					
					handler.drag(function(dx,dy){
						var dx=dx*zoomLevel
						var dy=dy*zoomLevel
						this.attr({cx:this.CX+dx,cy:this.CY+dy,fill:'#c00'});
						parr[j][1]=this.CX+dx;
						parr[j][2]=this.CY+dy;					
						polygon.attr('path',parr)
					},function(){//start
						this.CX=this.attr('cx');
						this.CY=this.attr('cy');
						$('#gCanvas').draggable( "option", "disabled", true );
					},function(){
						$('#gCanvas').draggable( "option", "disabled", false );
						this.attr({fill:'#fff'});
					})
					
					handler.dblclick(function(){
						st.remove();	
					})
					
					
				})
				
			})
			
			return false;	
		})
	}else{
		var poly=paper.getById($('#polygonId').val());
		var bb=poly.getBBox();
		if(bb.width>10&&bb.height>10){
			poly.attr({path:poly.attr('path')+'Z','stroke-width':2})
		}
		$('#gCanvas').draggable( "option", "disabled", false );
		backRect.hide();
		$('#polygonId').val('');
		isDrawing=false;
	}
})

/////////////////

//修改关联信息
$('#guanlianInfoBtn').click(function(){
	var id=$('#iconID').val();
	var guanlianInfo=$('#guanlianInfo').val().split('||')
	var obj=paper.getById(id);
	obj.data('sid',guanlianInfo[0]);
	obj.data('stype',guanlianInfo[1]);
	obj.attr('title',guanlianInfo[2]);
	var text=paper.getById('text_'+id);
	text.attr('text',guanlianInfo[2]);
	var bb=obj.getBBox()
	text.attr({'transform':'t'+bb.width*0.5+','+(bb.height+text.getBBox().height*0.5+4)})	
})

$('#guanlianInfoBtnLine').click(function(){
	var id=$('#lineID').val();
	var guanlianInfo=$('#guanlianInfoLine').val()
	var obj=paper.getById(id);
	obj.data('sid',guanlianInfo);	
})

//修改图标图片
var iconListOptions='<select class="iconsSelect">';
var iconListUls='';
$.each(topoTypeList,function(j,k){
	iconListOptions+='<option value="'+k.name+'">'+k.title;
	iconListUls+='<ul class="iconUl '+k.name+'">';
	$.each(k.icons,function(n,m){		
		iconListUls+='<li><img  data-src="'+m.src+'" data-height="'+m.h+'" data-width="'+m.w+'" title="'+m.title+'" src="'+m.src+'" class="icon"></li>';		
	})
	iconListUls+='</ul>';
	iconListOptions+='</option>'
})
iconListOptions+='</select>'

//console.log(iconListUls)
$('#iconsSelectDiv').empty().append(iconListOptions+iconListUls)

var iconListULDom=$('#iconInfoEditor .iconUl');
iconListULDom.first().show();

iconListULDom.find('li').click(function(){
	iconListULDom.find('li').removeClass('selected')
	$(this).addClass('selected');	
})

$('#iconInfoEditor .iconsSelect').change(function(){
	$('#iconInfoEditor').find('.iconUl').hide();
	$('#iconInfoEditor').find('.'+$(this).val()).show();
})

$('#toolbar_icon_selector').append(iconListOptions)
$('#toolbar_icon_uls').prepend(iconListUls)

$('#toolbar_icon_uls .iconUl').first().show();
$('#toolbar_icon_selector select').change(function(){
	$('#toolbar_icon_uls .iconUl').hide();
	$('#toolbar_icon_uls').find('.'+$(this).val()).show();
})

$('#iconInfoDiv').dialog({
	title:'图标类型',
	modal:true,
	width:460,
	autoOpen:false,
	open:function(){
		$('#iconsSelectDiv li').removeClass('selected');//每次清空上次的选择
	}
})

$('#iconInfoEditor .btn1').click(function(){
	var selectedLi=$('#iconsSelectDiv li.selected');
	if(selectedLi.length!=0){
		var oid=$('#iconInfoEditor .iconid').val();
		var icon=paper.getById(oid);
		icon.attr({'src':selectedLi.find('img').attr('data-src')});
	}
	$('#iconInfoDiv').dialog('close');
})

///////////////
$('#lineInfoContainer').dialog({
	title:'编辑连线',
	modal:true,
	width:360,
	autoOpen:false
})

$('#lineInfoEditor .btn').click(function(){
	var line=paper.getById($('#lineInfoEditor .lineId').val());
	var ocolor=$('#lineInfoEditor .color').val();
	var owdith=$('#lineInfoEditor .width').val();
	var odash=$('#lineInfoEditor .dash').val();
	line.attr({'stroke':ocolor,'stroke-width':owdith,'stroke-dasharray':odash})
	$('#lineInfoContainer').dialog('close')
})

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

$('#toolbars').resizable({
	handles:'se',
	containment:'document',
	minWidth:150,
	minHeight:160,
	stop:function(e,ui){
		//重写 cookie
		var status=$('#toolbarsToggle').css('display')=='none'?'':'none'
		$.cookie('toolbar','{status:"'+status+'",left:"'+ui.position.left+'px",top:"'+ui.position.top+'px",width:"'+$(this).width()+'px",height:"'+$(this).height()+'px"}',{expires:30})
	}
})

$('#toolbars').draggable({
	handle:'.title'	,
	containment:'window',
	snap:'window',
	stop:function(e,ui){
		var status=$('#toolbarsToggle').css('display')=='none'?'':'none'
		$.cookie('toolbar','{status:"'+status+'",left:"'+ui.position.left+'px",top:"'+ui.position.top+'px",width:"'+$(this).width()+'px",height:"'+$(this).height()+'px"}',{expires:30})
		if(parseInt($(this).css('right'))<5&&parseInt($(this).css('top'))<5){
				$.cookie('toolbar','',{expires:-1})
		}
		
	}
})

//init toolbar position
if($.cookie('toolbar')!=null){
	eval('var toolbarJson='+$.cookie('toolbar'));
	if(toolbarJson.status=='none'){
		$('#toolbarsToggle').show();
		$('#toolbars').hide();
	}else{
		$('#toolbars').css({left:toolbarJson.left,top:toolbarJson.top,width:toolbarJson.width,height:toolbarJson.height,display:toolbarJson.status})
		$('#toolbars').show();
		$('#toolbarsToggle').hide();
	}
	//set toolbar pos and open-close
}

$('#toolbars ul.iconUl li .icon').draggable({
	helper:'clone',
	start:function(){
		$('#toolbars').css({overflow:'visible'})
	},
	stop:function(){
		$('#toolbars').css({overflow:'hidden'})
	}
})

$('#gCanvas').droppable({
	accept:'.icon',
	drop:function(e,ui){
		
		//修复 drop 对象，先减去 marginLeft  position().left 然后根据 zoomLevel 计算	
		var oleft=e.clientX-$('#gCanvas').position().left-parseInt($('#gCanvas').css('margin-left'))
		var otop=e.clientY-$('#gCanvas').position().top-parseInt($('#gCanvas').css('margin-top'))
		oleft=oleft*zoomLevel;
		otop=otop*zoomLevel;
		var oimg=ui.draggable;
		var osrc=oimg.attr('src');
		var owidth=oimg.attr('data-width')*icon_default_zoom;
		var oheight=oimg.attr('data-height')*icon_default_zoom;

		var icon=paper.image(osrc,oleft,otop,owidth,oheight);
		var idStr=new Date().getTime();
		icon.id=idStr;	
		//image.attr('title',oimg.attr('title'));
		icon.attr('title','');
		
		//随机id号，避免重复			
		allNewIcons.push(icon)
		
		var text=paper.text(oleft,otop,icon.attr('title'));
		text.attr({'font-size':'12',transform:'t'+owidth*0.5+','+(oheight*1+text.getBBox().height*0.5+4)})
		text.id='text_'+idStr;
		
		giveHandle2icon(icon);
	}

})

$('#toolbars .title .collapse').click(function(){
	$('#toolbars').hide();
	$('#toolbarsToggle').show();
	$.cookie('toolbar','{status:"none",left:"auto",top:0}',{expires:30})	
})

/*
$('#toolbars ul.iconUl li img').each(function(){
	var obj=$(this)
	if(obj.width()>obj.height()){
		obj.css({width:'22px'})
	}else{
		obj.css({height:'22px'})
	}
})
*/

$('#toolbars ul li').hover(function(){
	$(this).addClass('hover');
},function(){
	$(this).removeClass('hover');
})


$('#toolbarsToggle').click(function(){
	$('#toolbars').show();
	$(this).hide();
	$.cookie('toolbar','{status:"",left:"auto",top:0}',{expires:30})
});

//保存
function save(){

	if(topoTitle.attr('text')==''){alert('请给出拓扑名称');$('#tool_title').trigger('click');return false;}

	var sJSON={title:{},icons:[],lines:[]};
	var sJSON2={title:{},icons:[],lines:[]};
	
	//var topoTitle=paper.getById('topoTitle');
	var ocolor=topoTitle.attr('fill').split('-');
	var otransform=topoTitle.attr('transform');
	otransform=otransform.toString().substring(1);
	
	sJSON['title']={sid:topoTitle.data('topoid'),sname:topoTitle.attr('text')}
	sJSON2['title']={sid:topoTitle.data('topoid'),size:topoTitle.attr('font-size'),startcolor:ocolor[1],endcolor:ocolor[2],fontFamily:topoTitle.attr('font-family'),rotate:otransform,x:parseInt(topoTitle.attr('x')),y:parseInt(topoTitle.attr('y'))}
	
	paper.forEach(function(k){
		var bb=k.getBBox();
		if(k.type=='image'){
			if(k.attr('title')==''){
				sJSON['icons'].push({id:k.id,sid:k.data('sid'),stype:k.data('stype')});
			}else{
				sJSON['icons'].push({id:k.id,sid:k.data('sid'),stype:k.data('stype'),sname:k.attr('title')});
			}			
			sJSON2['icons'].push({id:k.id,x:parseInt(bb.x),y:parseInt(bb.y),w:parseInt(bb.width),h:parseInt(bb.height),src:k.attr('src')});
		}
		
		if(k.type=='path'&&k.data('gtype')=='line'){
			var arr=k.id.split('_');
			var ofrom=arr[0];
			var oto=arr[1];
			var oid=k.data('sid');
			sJSON['lines'].push({id:k.id,sid:oid});
			sJSON2['lines'].push({id:k.id,color:k.attr('stroke'),sid:oid,style:k.attr('stroke-dasharray'),width:k.attr('stoke-width'),'stroke-width':k.attr('stroke-width')})
		}	
	})	
	
	var jsonstr=JSON.stringify(sJSON, null,' ')
	var jsonstr2=JSON.stringify(sJSON2, null,' ')
		
	$('#json2send').val(jsonstr);
	$('#json2send2').val(jsonstr2);
	/*
	var guanlianwin=window.open('guanlian.php','editguanlian','width=700,height=500,left='+(window.screen.availWidth-700)/2+',top='+(window.screen.availHeight-500)/2+',location=0,toolbar=0,scrollbars=1,menubar=0,resizable=1')	
			guanlianwin.focus();
	*/
	window.open('guanlian.php','savetopojson','width=700,height=500,left='+(window.screen.availWidth-700)/2+',top='+(window.screen.availHeight-500)/2+',location=0,toolbar=0,scrollbars=1,menubar=0,resizable=1')	
	$('form').submit();
	
}

$('#tool_save').click(save)


//响应区--------------------------------------
var backRect=paper.rect(0,0,canvasSize.width,canvasSize.height);
backRect.toBack();
backRect.attr({'fill-opacity':0.5,fill:'#fff','stroke-width':0,'cursor':'default','stroke':'#fff'})
backRect.hide();

var selectRect=paper.rect(0,0,100,100)
selectRect.attr({'stroke-dasharray':'-','stroke':'#06c','stroke-width':1,'fill-opacity':0.1,'fill':'#06c'})
selectRect.hide();

var DRAG=[];
var isDragging=false;
var isDrawing=false;

var startLineCircle=paper.circle(0,0,10);
startLineCircle.hide();

backRect.mousedown(function(e,x,y){
	if(e.button==0){
		if($('#tool_pan').hasClass('now')){//如果现在是选择工具的话
			DRAG=[];
			DRAG.push(x,y)
			isDragging=true;
			backRect.toFront();//开始 挡在最前面 否则过不了图标
			selectRect.toFront();
		}else if($('#tool_shape').hasClass('now')){//图形工具			
			var marginL=parseInt($('#gCanvas').css('margin-left'));
			var marginT=parseInt($('#gCanvas').css('margin-top'));			
			polygonArr.push((x*zoomLevel-$('#gCanvas').position().left*zoomLevel-marginL*zoomLevel)+','+(y*zoomLevel-$('#gCanvas').position().top*zoomLevel-marginT*zoomLevel))			
			//console.log(polygonArr.join('L'))
			var polygon=paper.getById($('#polygonId').val());
			
			var arr=polygonArr[0].split(',');
			if(polygonArr.length==1){
				polygon.attr({path:'M'+polygonArr[0]+'l0,0'})
				
				startLineCircle.attr({cx:arr[0],cy:arr[1],'stroke':'#c00'})
			}else{
				isDrawing=true;		
				if(x-arr[0]<10&&y-arr[1]<01){
					polygonArr.pop(polygonArr.length-1)	
					var bb=polygon.getBBox();
					if(bb.width>10&&bb.height>10){
						polygon.attr({path:'M'+polygonArr.join('L')+'Z','stroke-width':2});
					}					
					isDrawing=false;
					$('#tool_shape').removeClass('now');
					startLineCircle.hide();						
				}else{					
					polygon.attr({path:'M'+polygonArr.join('L')});			
				}					
			}			
		}
	}else{ //中键、右键 完成
		//isDrawing=false;
		//$('#tool_shape').hasClass('now')
	}
})

backRect.mousemove(function(e,x,y){		
	if(isDragging==true){
		//console.log(isDragging)
		var owidth=x-DRAG[0];
		var oheight=y-DRAG[1];
		if(owidth<0){owidth*=-1}//从右向左选择的话
		if(oheight<0){oheight*=-1}
		var ox=DRAG[0]>x?x:DRAG[0]//画方块永远是 x 小于 x2
		var oy=DRAG[1]>y?y:DRAG[1]
		ox=ox-$('#gCanvas').position().left;//如果canvas left top 不是 0 的话
		oy=oy-$('#gCanvas').position().top;
		ox=ox-parseInt($('#gCanvas').css('margin-left'))//如果被滚轮的话，需要处理
		oy=oy-parseInt($('#gCanvas').css('margin-top'))
		selectRect.show(0).attr({x:ox*zoomLevel,y:oy*zoomLevel,width:owidth*zoomLevel,height:oheight*zoomLevel})
	}else if(isDrawing){
		var arr=polygonArr[0].split(',');	
		if(x-arr[0]<10&&y-arr[1]<01){
			startLineCircle.show();
		}else{
			startLineCircle.hide();
		}
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
	if(e.button!=2){
		hideDivs();
	}
})

function moveRelatedTextAndline(icon){
	var bb=icon.getBBox();
	var text=paper.getById('text_'+icon.id)
	text.attr({x:bb.x,y:bb.y,transform:'t'+bb.width*0.5+','+(bb.height+text.getBBox().height*0.5+4)})
	paper.forEach(function(m){
		if(m.type!='path'){return;}
		if(m.data('gtype')!='line'){return;}
		var icons2=m.id.split('_');
		if(icons2[0]==icon.id||icons2[1]==icon.id){
			var from=paper.getById(icons2[0]).getBBox();
			var to=paper.getById(icons2[1]).getBBox();
			var path='M'+(from.x+from.width*0.5)+','+(from.y+from.height*0.5)+'L'+(to.x+to.width*0.5)+','+(to.y+to.height*0.5);
			m.attr({path:path})
		}
	})
}

//选择操作，setInterval repeated -------------------------
var mouseTimer=null;
var tool_transform_step=1;
var mousedown_interval=30;

$('#multiSelectTool li').mousedown(function(e){
	//move-left
	if($(this).hasClass('move-left')){
		mouseTimer=setInterval(function(){
			paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){obj.attr({x:obj.attr('x')-tool_transform_step});moveRelatedTextAndline(obj);}})	
		},mousedown_interval)	
	}else if($(this).hasClass('move-right')){
		mouseTimer=setInterval(function(){
			paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){obj.attr({x:obj.attr('x')+tool_transform_step});moveRelatedTextAndline(obj);}})
		},mousedown_interval)				
	}else if($(this).hasClass('move-up')){
		mouseTimer=setInterval(function(){
			paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){obj.attr({y:obj.attr('y')-tool_transform_step});moveRelatedTextAndline(obj);}})	
		},mousedown_interval)			
	}else if($(this).hasClass('move-down')){
		mouseTimer=setInterval(function(){
			paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){obj.attr({y:obj.attr('y')+tool_transform_step});moveRelatedTextAndline(obj);}})	
		},mousedown_interval)		
	}else if($(this).hasClass('align-left')){
		var minPos=canvasSize.width;
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			var bb=obj.getBBox();
			minPos=minPos<bb.x?minPos:bb.x;
		}})	
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			obj.attr({x:minPos});
			moveRelatedTextAndline(obj);
		}})		
	}else if($(this).hasClass('align-right')){
		var minPos=0;
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			var bb=obj.getBBox();
			minPos=minPos>bb.x?minPos:bb.x;
		}})	
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			obj.attr({x:minPos});
			moveRelatedTextAndline(obj);
		}})		
	}else if($(this).hasClass('align-center')){
		var topObj=paper.top;//根据最后面（最上面一个元素对齐，被拖选的icon都是最后一个）
		while(topObj.type!='image'||topObj.data('selected')!=true){
			if(topObj.prev!=null){
				topObj=topObj.prev;
			}else{
				break;
			}
		}		
		if(topObj.type=='image'&&topObj.data('selected')==true){
			var topObjBB=topObj.getBBox();
			paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
				var bb=obj.getBBox();
				obj.attr({x:topObjBB.x+topObjBB.width*0.5-bb.width*0.5});
				moveRelatedTextAndline(obj);
			}})	
		}
	}else if($(this).hasClass('align-top')){
		var minPos=canvasSize.height;
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			var bb=obj.getBBox();
			minPos=minPos<bb.y?minPos:bb.y;
		}})	
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			obj.attr({y:minPos});
			moveRelatedTextAndline(obj);
		}})		
	}else if($(this).hasClass('align-bottom')){
		var minPos=0;
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			var bb=obj.getBBox();
			minPos=minPos>bb.y?minPos:bb.y;
		}})	
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			obj.attr({y:minPos});
			moveRelatedTextAndline(obj);
		}})		
	}else if($(this).hasClass('align-middle')){
		var topObj=paper.top;//根据最后面（最上面一个元素对齐，被拖选的icon都是最后一个）
		while(topObj.type!='image'||topObj.data('selected')!=true){
			if(topObj.prev!=null){
				topObj=topObj.prev;
			}else{
				break;
			}
		}		
		if(topObj.type=='image'&&topObj.data('selected')==true){
			var topObjBB=topObj.getBBox();
			paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
				var bb=obj.getBBox();
				obj.attr({y:topObjBB.y+topObjBB.height*0.5-bb.height*0.5});
				moveRelatedTextAndline(obj);
			}})
		}
	}else if($(this).hasClass('distribute-v')){
		var minPos=canvasSize.height;
		var maxPos=0;
		var counter=0;
		var icons=[];
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			counter+=1;
			icons.push(obj);
			var bb=obj.getBBox();
			minPos=minPos<bb.y?minPos:bb.y;
			maxPos=maxPos>bb.y?maxPos:bb.y
		}})	
		var step=(maxPos-minPos)/(counter-1);
		//排序 最上面的在 数组最前面		
		function BubbleSort(arr) { //交换排序->冒泡排序
		  var temp;
		  var exchange;
		  for(var i=0; i<arr.length; i++) {
		   exchange = false;
		   for(var j=arr.length-2; j>=i; j--) {
			if((arr[j+1]).attr('y') < (arr[j].attr('y'))) {
			 temp = arr[j+1];
			 arr[j+1] = arr[j];
			 arr[j] = temp;

			 exchange = true;
			}
		   }
		   if(!exchange) break;
		  }
		  return arr;
		 }		
		icons=BubbleSort(icons);		
		////////////////////////////////		
		$.each(icons,function(j,k){
			k.attr({y:minPos+step*j})
			moveRelatedTextAndline(k);
		})
	}else if($(this).hasClass('distribute-h')){
		var minPos=canvasSize.width;
		var maxPos=0;
		var counter=0;
		var icons=[];
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			counter+=1;
			icons.push(obj);
			var bb=obj.getBBox();
			minPos=minPos<bb.x?minPos:bb.x;
			maxPos=maxPos>bb.x?maxPos:bb.x
		}})	
		var step=(maxPos-minPos)/(counter-1);
		//排序 最上面的在 数组最前面		
		function BubbleSort(arr) { //交换排序->冒泡排序
		  var temp;
		  var exchange;
		  for(var i=0; i<arr.length; i++) {
		   exchange = false;
		   for(var j=arr.length-2; j>=i; j--) {
			if((arr[j+1]).attr('x') < (arr[j].attr('x'))) {
			 temp = arr[j+1];
			 arr[j+1] = arr[j];
			 arr[j] = temp;
			 exchange = true;
			}
		   }
		   if(!exchange) break;
		  }
		  return arr;
		 }		
		icons=BubbleSort(icons);		
		////////////////////////////////		
		$.each(icons,function(j,k){
			k.attr({x:minPos+step*j})
			moveRelatedTextAndline(k);
		})
	}else if($(this).hasClass('resize-same')){
		var icons=[];
		var maxWidth=0;
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			icons.push(obj);
			var bb=obj.getBBox();
			maxWidth=maxWidth>bb.width?maxWidth:bb.width
		}})	
		$.each(icons,function(j,k){
			var bili=k.attr('height')/k.attr('width');			
			k.attr({width:maxWidth,height:maxWidth*bili})
			moveRelatedTextAndline(k);
		})
	}else if($(this).hasClass('resize-sames')){
		var icons=[];
		var minWidth=canvasSize.width;;
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			icons.push(obj);
			var bb=obj.getBBox();
			minWidth=minWidth<bb.width?minWidth:bb.width
		}})	
		$.each(icons,function(j,k){
			var bili=k.attr('height')/k.attr('width');			
			k.attr({width:minWidth,height:minWidth*bili})
			moveRelatedTextAndline(k);
		})
	}else if($(this).hasClass('resize-big')){
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			if(e.shiftKey){
				obj.attr({width:obj.attr('width')+10,height:obj.attr('height')+10})	
			}else{
				obj.attr({width:obj.attr('width')+1,height:obj.attr('height')+1})					
			}
			moveRelatedTextAndline(obj);
		}})	
	}else if($(this).hasClass('resize-small')){
		paper.forEach(function(obj){if(obj.data('selected')!=true){return;}if(obj.type=='image'){
			if(e.shiftKey){
				obj.attr({width:obj.attr('width')-10,height:obj.attr('height')-10})	
			}else{
				obj.attr({width:obj.attr('width')-1,height:obj.attr('height')-1})					
			}
			moveRelatedTextAndline(obj);
		}})	
	}
	
	
}).bind('mouseup mouseleave', function() {
    clearTimeout(mouseTimer);
	tool_transform_step=1;
})

$('html').keydown(function(e){
	if(e.shiftKey){tool_transform_step=10;}
}).keyup(function(){
	tool_transform_step=1;
})

function calculateInSelection(){
	selectRect.hide();
	var sBB=selectRect.getBBox();
	var selectedIcons=[];
	
	//比较所有在此区域的图标 -start
	paper.forEach(function(obj){
		if(obj.type=='image'){
			var bb=obj.getBBox();
			if(Raphael.isBBoxIntersect(bb,sBB)){
				selectedIcons.push(paper.getById(obj.id));
				return true;
			}
		}
		//每次恢复默认样式（没有被选中的）
		obj.attr({opacity:1})
		obj.data('selected',false);
	})
	//比较所有在此区域的图标 -end
		
	//selectedIcons 所有被选中的图标 挨上就算	//有 bug 这只是4个角 被选中！
	$.each(selectedIcons,function(j,k){		
		k.attr({opacity:0.5});
		k.data('selected',true);
	})
	
}

selectRect.mouseup(function(e,x,y){
	//selectRect.attr({x:DRAG[0],y:DRAG[1],width:x-DRAG[0],height:y-DRAG[1]}).hide()
	if($('#tool_pan').hasClass('now')){
		isDragging=false;
		backRect.toBack();
		calculateInSelection();
	}
})

backRect.mouseup(function(e,x,y){
	if($('#tool_pan').hasClass('now')){
		isDragging=false;
		backRect.toBack();
		calculateInSelection();
	}
})


$('#toolbars').mousewheel(function(e){
	e.stopPropagation();	
})

/*
var backImg=paper.image('icons/china.png',0,0,1000,839)
backImg.id="backImg"
backImg.attr({opacity:0.5})
backImg.toBack();
*/

$('#toolbar_icon_uls').disableSelection()

var colorArray=['00','33','66','99','cc','ff'];
var colorHtml='<ul>'
$.each(colorArray,function(j,k){
	$.each(colorArray,function(n,m){
		$.each(colorArray,function(a,b){
			colorHtml+='<li title="#'+(k+m+b)+'" style="background:#'+(k+m+b)+'"></li>';
		})
	})
})
colorHtml+='</ul>';

$('.colorPicker').wrap('<span class="colorSpan"></span>').after('<div class="colorLayer"></div>');
$('.colorLayer').empty().append(colorHtml)

$('.colorLayer li').click(function(){
	$(this).parents('.colorSpan').find('.colorPicker').val($(this).attr('title'));
	$(this).parents('.colorLayer').hide();
})

$('.colorPicker').click(function(e){
	$(this).parent().find('.colorLayer').show();	
	e.stopPropagation();
})

$('html').click(function(){$('.colorLayer').hide();})

$('#tool_preview').click(function(){
	window.open(topo_view_url)	
})

/////////////////////////////
})

//loadinging
$(window).load(function(){
	var ETIME=new Date();
	$('#isLoading .t').text('加载耗时：'+(ETIME.getTime()-STIME.getTime())+'毫秒')
	setTimeout(function(){
		$('#isLoading').remove();		
		if(isNewTopo){
			$('#isNewTopo').css({position:'absolute','z-index':99999,background:'#fff',left:0,top:0,width:'100%',height:'100%'})
			$('#isNewTopo .t').css({position:'absolute','z-index':999999,left:$(window).width()*0.5-$('#isNewTopo .t').width()*0.5,top:$(window).height()*0.5-$('#isNewTopo .t').height()*0.5})
			$('#isNewTopo').delay(1000).animate({opacity:0,top:$(window).height()},1000,'swing',function(){
				$('#isNewTopo').remove();
			})
		}			
	},800)
})