<?
header("Content-type: text/html; charset=utf-8"); 

$json=$_REQUEST['json'];
$json2=$_REQUEST['json2'];
?>
<style>
* {font:12px/150% tahoma;}
h1 {font-size:14px;border-bottom:solid 1px #ccc;padding-bottom:6px;}
textarea {margin:6px 0;font-size:12px;font-weight:700;width:100%;height:16em;}
</style>
<h1>请检查拓扑数据，然后提交</h1>
<form action="save.htm" method="post">
<table width="100%"><tr>
<td width="40%">
拓扑逻辑 json：
<textarea name="json1"><? echo $json; ?></textarea>
</td>
<td>
拓扑绘图 json：<br />
<textarea name="json2"><? echo $json2; ?></textarea>
</td>
</table>
<input type="submit" value="保存到服务器" />
</form>