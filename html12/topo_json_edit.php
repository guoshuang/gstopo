<?
 $id=isset($_REQUEST['sid'])?$_REQUEST['sid']:'0';
if($id=='0'){
}else{
?>({
 "title": {
  "sid": "456",
  "sname": "拓扑图的名称"
 },
 "icons": [
  {
   "id": "icon001",
   "sid": "001",
   "stype": "server",
   "sname": "系统给的名字"
  },
  {
   "id": "icon002"
  }
 ],
 "lines": [
  {}
 ]
})
<? } ?>