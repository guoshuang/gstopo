<?
 $id=isset($_REQUEST['sid'])?$_REQUEST['sid']:'0';
if($id=='0'){
}else{
?>{
 "title": {
  "sid": "456",
  "size": "40",
  "startcolor": "#06c",
  "endcolor": "#003",
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
   "id": 1345079019275,
   "x": 1279,
   "y": 189,
   "w": 90,
   "h": 65,
   "src": "icons/network/ips-1.png"
  },
  {
   "id": 1345079026613,
   "x": 597,
   "y": 470,
   "w": 90,
   "h": 66,
   "src": "icons/network/s5600.png"
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
   "id": "1345079026613_icon002",
   "color": "#000",
   "style": "",
   "stroke-width": 2
  },
  {
   "id": "1345079019275_icon002",
   "color": "#000",
   "style": "",
   "stroke-width": 2
  },
  {
   "id": "icon001_icon002",
   "color": "#06c",
   "style": "--",
   "stroke-width": "3"
  }
 ]
}
<? } ?>