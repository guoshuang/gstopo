<?
 $id=isset($_REQUEST['sid'])?$_REQUEST['sid']:'0';
if($id=='0'){?>

<?
}else{
?>{
 "title": {
  "sid": "456",
  "sname": "拓扑图的名称"
 },
 "icons": [
  {
   "id": "icon001",
   "sid": "001",
   "stype": "server",
   "sname": "系统给的名字",
   "tips":"文字若干！！！",
	"url":"info.htm",
    contextmenu:[
    	{text:'查看报警信息',url:'info3.htm'}	
    ]
  },
  {
   "id": 1345079019275
  },
  {
   "id": 1345079026613
  },
  {
   "id": "icon002"
  }
 ],
 "lines": [
  {
   "id": "1345079026613_icon002"
  },
  {
   "id": "1345079019275_icon002"
  },
  {
   "id": "icon001_icon002"
  }
 ]
}
<? } ?>