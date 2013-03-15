<!DOCTYPE HTML><? $topoid=isset($_REQUEST['sid'])?$_REQUEST['sid']:0; ?>
<html>
<head>
<meta charset="utf-8">
<title>拓扑编辑</title>
<script type="text/javascript" src="themes/default/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="themes/default/jquery-ui-1.8.18.custom.min.js"></script>
<script type="text/javascript" src="themes/default/gex.js"></script>
<script type="text/javascript" src="themes/default/raphael-min.js"></script>
<script type="text/javascript" src="themes/default/json_stringify.js"></script>
<style type="text/css">@import url(themes/default/main.css);</style>
<style type="text/css">
html,body {width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#eee;}
#gContainer {height:100%;position:relative;}
#gCanvas { position:absolute;left:0;top:0;z-index:1;background: url(themes/default/images/grid2.gif);}
#zoom2original {top:50px;}
</style>
<script type="text/javascript">
var STIME=new Date();
var canvasSize={width:3000,height:3000};//canvas size define
var controlStep=100;//move step
var ajax_icon_list_url='topo_type_list.php';//icon list
var ajax_topo_url1='topo_json_edit.php';//topo info from backend
var ajax_topo_url2='topo_json_pos.php';//topo graphics info
var ajax_topo_sid="<? echo $topoid; ?>"; //topo id
var icon_default_zoom=0.6;//拖入图标默认比例
var topo_view_url='view.php?sid=<? echo $topoid; ?>';
</script>
<script type="text/javascript" src="topo.js"></script>
</head>
<body>

<!--本拓扑的 id 是 <? echo $topoid; ?>；如果是0 表示新建 -->
<div id="toolbars">
	<div class="title" id="toolbar_icon_selector"><span class="collapse" title="关闭工具栏"></span></div>
        <div id="toolbar_icon_uls">
        	<hr />
             <ul class="tools">
                <li id="tool_line" title="连线工具"></li>
                <li id="tool_pan" title="选择工具" ></li>
                <!--<li id="tool_shape" title="形状工具" ></li>-->
            </ul>
            <ul id="multiSelectTool" style="clear:both;display:none;">
                <li class="move-left" title="向左移动一个像素"></li><li class="move-right" title="向右移动一个像素"></li><li class="move-up" title="向上移动一个像素"></li><li class="move-down" title="向下移动一个像素"></li>
                <li class="align-left" title="向左对齐"></li><li class="align-center" title="中间对齐"></li><li class="align-right" title="向右对齐"></li><li class="align-top" title="向上对齐"></li><li class="align-middle" title="上下中间对齐"></li><li class="align-bottom" title="向下对齐"></li>
                <li class="distribute-v" title="上边界垂直分布"></li><li class="distribute-h" title="左边界水平分布"></li>  
                 <li class="resize-big" title="全部放大"></li>
                 <li class="resize-small" title="全部缩小"></li>
                 <li class="resize-same" title="同大"></li>
                  <li class="resize-sames" title="同小"></li>         
            </ul>
            <hr />
            <ul>
        	<li id="tool_save" title="保存"></li>
            <li id="tool_title" title="修改标题"></li>
            <li id="tool_preview" title="查看拓扑"></li>
            <!--<li id="tool_background" title="修改背景图片"></li>-->
        </ul>
    </div>
</div>

<div id="toolbarsToggle" title="显示工具栏" style="display:none;"></div>

<div id="gContainer">
	<div id="gCanvas"></div>
    <div id="contextMenu"></div>
    <div id="gToolbar_move"><a title="左" id="toLeft" href="javascript:void(0);"></a><a title="右" id="toRight" href="javascript:void(0);"></a><a title="上" id="toTop" href="javascript:void(0);"></a><a title="下" id="toBottom" href="javascript:void(0);"></a></div>
    <div id="gToolbar_zoom">
        <a title="放大" id="zoom2big" href="javascript:void(0);"></a>
        <a title="缩小" id="zoom2small" href="javascript:void(0);"></a>
        <a title="原始大小" id="zoom2original" href="javascript:void(0);"></a>
    </div>
</div>

<div id="zoomr"><div class="zoomr"></div><div class="zoomr"></div><div class="zoomr"></div><div class="zoomr"></div></div>

<div style="position:absolute;top:-200px;left:-200px;">
<input id="iconID" /><input id="guanlianInfo" style="width:20em;" /><button id="guanlianInfoBtn">修改icon关联</button><hr />
<input id="lineID" /><input id="guanlianInfoLine" style="width:20em;" /><button id="guanlianInfoBtnLine">修改line关联</button>

</div>

<div id="titleInfoContainer"><div id="titleInfoEditor">
    <p><span class="t">　　名称：</span><input class="name" style="width:18em;" /></p>
    <p><span class="t">字体大小：</span><input class="size" style="width:2em;" /><span class="t">字体：</span><input class="family" style="width:8em;" /></p>
    <p><span class="t">颜色渐变：</span><input class="gra1 colorPicker" style="width:5em;" /> - <input class="gra2 colorPicker" style="width:5em;" /></p>
    <p><span class="t">旋转：</span><input class="rotate"  style="width:3em;"/><span class="t">X：</span><input class="x"  style="width:2em;"/><span class="t">Y：</span><input class="y"  style="width:2em;"/></p>
    <p style="text-align:right;"><button id="modifyTitleBtn">确定</button></p> 
</div></div>

<div id="lineInfoContainer"><div id="lineInfoEditor">
	<input class="lineId" type="hidden" />
    <p><span class="t">颜色：</span><input class="color colorPicker" style="width:18em;" /></p>
    <p><span class="t">宽度：</span><input class="width" style="width:2em;" /> <span class="t">样式：</span><select class="dash"><option value="">实线</option><option value="-">短虚线</option><option value="--">长虚线</option><option value=".">圆点</option><option value="-.">虚圆点</option><option value="--.">长虚圆点</option></select></p>
    <p style="text-align:right;"><button class="btn">确定</button></p> 	
</div></div>

<div id="iconInfoDiv"><div id="iconInfoEditor">
	<input type="hidden" class="iconid" />
	<div id="iconsSelectDiv"></div>
    <p style="clear:left;padding-top:8px;"><button class="btn1">确定</button></p> 	
</div></div>

<form action="showjson.php" target="savetopojson" method="post" style="position123:absolute;top:100px;left:100px;">
<textarea id="json2send" name="json"></textarea>
<textarea id="json2send2" name="json2"></textarea>
</form>

<div id="isNewTopo" style="left:0;top:-100px;"><div class="t">没找到该拓扑，新建中...</div></div>

<input type="hidden" id="polygonId" />

<div id="isLoading"><div class="t">加载中，请稍候...</div></div>

</body>
</html>