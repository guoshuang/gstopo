<!DOCTYPE HTML><? 
$startid=isset($_REQUEST['startid'])?$_REQUEST['startid']:'0'; 
$endid=isset($_REQUEST['endid'])?$_REQUEST['endid']:'0'; 
?>
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

var guanlianInput=window.opener.$('#guanlianInfoLine');

$('#guanlianUL li').click(function(){
	var oval=$(this).attr('data-id')
	$('#input1').val(oval)
	guanlianInput.val(oval)
})

$('#btn1').click(function(){
	var oval=$('#input1').val();
	if(oval==''){alert('请选择有效的设备');return false;}
	guanlianInput.val(oval);
	var guanlianInfoBtn=window.opener	.$('#guanlianInfoBtnLine');
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

<del>看地址栏参数，去拿相关图标信息<br /></del>

连线关联：

<ul id="guanlianUL">
    <li data-id="9991">服务器00001 到 服务器2</li>
</ul>

<input id="input1"  style="width:20em;" /><button id="btn1">确定</button>

</body>
</html>