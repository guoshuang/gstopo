<!DOCTYPE HTML><? $topoid=isset($_REQUEST['sid'])?$_REQUEST['sid']:0; ?>
<html>
<head>
<meta charset="utf-8">
<title>拓扑显示</title>
<script type="text/javascript" src="themes/default/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="themes/default/jquery-ui-1.8.18.custom.min.js"></script>
<script type="text/javascript" src="themes/default/gex.js"></script>
<script type="text/javascript" src="themes/default/raphael-min.js"></script>
<style type="text/css">@import url(themes/default/main.css);</style>
<style type="text/css">
html,body {width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#eee;}
#gContainer {height:100%;position:relative;}
#gCanvas {position:absolute;left:0;top:0;background: url(themes/default/images/grid2.gif);}
</style>
<script type="text/javascript">
var alertInterval=60;// 警告ajax获取间隔时间 秒
var canvasSize={width:3000,height:3000};//canvas size define
var alertAnimation=true;//打开动画，浏览器比较卡
var alertAnimation2=true;//question animation
var controlStep=100;//move step
var anim_icon=400;//图标出现时间 毫秒
var anim_icon_delay=150;//图标依次出现的间隔 毫秒
var start_animation=true;//开始是否播放动画
var topo_edit_url='edit.php?sid=<? echo $topoid; ?>';
var ajax_topo_url1='json_view1.php';//topo info from backend
var ajax_topo_url2='json_view2.php';//topo graphics info
var ajax_topo_alert='topo-alert.php';//topo graphics info
var ajax_topo_sid="<? echo $topoid; ?>"; //topo id
</script>
<script type="text/javascript" src="topo_view.js"></script>
</head>
<body>
<!--
//本拓扑的 id 是 <? echo $topoid; ?>
-->
<div id="gContainer"><div id="gCanvas"></div></div>
<div id="tipsDiv"></div>
<div id="gToolbar_move">
	<a title="左" id="toLeft" href="javascript:void(0);"></a>
    <a title="右" id="toRight" href="javascript:void(0);"></a>
    <a title="上" id="toTop" href="javascript:void(0);"></a>
    <a title="下" id="toBottom" href="javascript:void(0);"></a>
</div>
<div id="gToolbar_zoom">
	<a title="放大" id="zoom2big" href="javascript:void(0);"></a>
    <a title="缩小" id="zoom2small" href="javascript:void(0);"></a>
    <a title="原始大小" id="zoom2original" href="javascript:void(0);"></a>
    <a title="动画开关" id="stopAni" href="javascript:void(0);"></a>
    <a title="全部显示" id="fit2win" href="javascript:void(0);"></a>
    <a title="编辑拓扑" id="editTopo" href="javascript:void(0);"></a>
</div>
<div id="contextMenu"></div>
<div id="zoomr">
    <div class="zoomr"></div><div class="zoomr"></div><div class="zoomr"></div><div class="zoomr"></div>
</div>
</body>
</html>