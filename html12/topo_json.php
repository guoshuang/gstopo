({
	icons:[
		{id:'001',sid:'SS01',stype:'server',name:'交换机1',url:'info.htm',type:'switcher',tips:'<p>设备名称：<b>服务器1</b></p><p>IP：<b>192.168.1.101</b> 型号：<b>abc-1031</b></p><p>CPU使用率：<b>56%</b> 内存使用率：<b>77%</b></p><p>管理员：<b>郭爽</b> 联系方式：<b>davdiguoshuang@gmail.com</b></p><p>安装位置：<b>三楼机房</b> 报警数量：<b>3</b></p><p>描述：该设备如何如何。。。</p>'}, 
		{id:'002',sid:'SS02',stype:'server',name:'交换机2',url:'info.htm',type:'switcher',tips:'该设备信息'},
		{id:'003',sid:'SS03',name:'Unix 服务器',url:'info.htm',type:'server',tips:'该设备信息',relations:['001']},
		{id:'004',sid:'SS04',name:'IMS服务器 \n10.208.16.8',url:'info.htm',type:'server',tips:'该设备信息',relations:['001']},
		{id:'005',sid:'SS05',name:'Unix 服务器',url:'info.htm',type:'server',tips:'该设备信息'},
		{id:'006',sid:'SS06',name:'应用系统1',url:'info2.htm',type:'access_server',tips:'该设备信息'},
		{id:'007',sid:'SS07',name:'应用系统2',url:'info2.htm',type:'access_server',tips:'该设备信息'},
		{id:'008',sid:'SS08',name:'应用系统3',url:'info2.htm',type:'access_server',tips:'该设备信息'},
		{id:'009',name:'应用系统4',url:'info2.htm',type:'access_server',tips:'该设备信息'},
		
		{id:'010',name:'用户1',type:'user',tips:'用户'},
		{id:'011',name:'用户2',type:'user',tips:'用户'}
	],
	lines:[
		{from:'001',to:'003',url:'lineinfo.php'},
		{from:'001',to:'004',url:'lineinfo.php'},
		{from:'001',to:'005',url:'lineinfo.php'},
		{from:'002',to:'003',url:'lineinfo.php'},
		{from:'002',to:'004'},
		{from:'002',to:'005'},
		{from:'003',to:'006'},
		{from:'004',to:'007'},
		{from:'004',to:'008'},
		{from:'005',to:'009'},
		{from:'008',to:'010'},
		{from:'008',to:'011'}
	],
    title:{
	topoid:"topo0001",name:'拓扑图的名称',size:'40',startcolor:'#06c',endcolor:'#003',fontFamily:'黑体',rotate:0,x:200,y:40}
})