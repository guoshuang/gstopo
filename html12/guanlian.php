<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>选择关联设备</title>
<script type="text/javascript" src="themes/default/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="themes/default/jquery-ui-1.8.18.custom.min.js"></script>
<script type="text/javascript" src="themes/default/gex.js"></script>
<script type="text/javascript" src="themes/default/raphael-min.js"></script>
<style type="text/css">@import url(themes/default/main.css);</style>
<style type="text/css">
body {margin:15px;}
#guanlianUL {margin:10px;}
#guanlianUL li {cursor:pointer;padding:2px 8px;}
#guanlianUL li:hover {background:#eef;}
#btn1 {padding:0 8px;}
</style>
<script type="text/javascript">
jQuery(function($){
////////////////////////////////////////

$('#guanlianUL li').click(function(){
	var guanlianInput=window.opener.$('#guanlianInfo');
	var oval=$(this).attr('data-id')+'||'+$(this).attr('data-type')+'||'+$(this).text()
	$('#input1').val(oval)
	guanlianInput.val(oval)
})

$('#btn1').click(function(){
	var oval=$('#input1').val();
	if(oval==''){alert('请选择有效的设备');return false;}
	var guanlianInput=window.opener.$('#guanlianInfo');
	guanlianInput.val(oval);
	var guanlianInfoBtn=window.opener	.$('#guanlianInfoBtn');
	guanlianInfoBtn.trigger('click');
	setTimeout(function(){
		window.close();
	},300)
})

////////////////////////////////////////
})
</script>
</head>	
<body>

请选择关联设备：

<ul id="guanlianUL">
    <li data-id="9991" data-type="server">服务器00001</li>
    <li data-id="9992" data-type="server">服务器6662</li>
    <li data-id="9993" data-type="server">服务器38888</li>
    <li data-id="9994" data-type="router">路由器184646ing名字很长</li>
</ul>

<input id="input1"  style="width:20em;" /><button id="btn1">确定</button>

</body>
</html>