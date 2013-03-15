<?
 $id=isset($_REQUEST['sid'])?$_REQUEST['sid']:'0';
if($id=='0'){
}else{
?>({
 "title": {
  "sid": "456",
  "size": "40",
  "startcolor": "#003",
  "endcolor": "#06c",
  "fontFamily": "黑体",
  "rotate": "0",
  "x": 200,
  "y": 40
 },
 "icons": [
  {
   "id": "icon001",
   "x": 123,
   "y": 58,
   "w": 80,
   "h": 80,
   "src": "icons/mid/weblogic1.png"
  },
  {
   "id": "icon002",
   "x": 322,
   "y": 176,
   "w": 80,
   "h": 80,
   "src": "icons/mid/weblogic.png"
  }
 ],
 "lines": [
  {
   "id": "icon001_icon002",
   "color": "#06c",
   "style": "--",
   "stroke-width": "3"
  }
 ]
})
<? } ?>