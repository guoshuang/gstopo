<?
//这个是实时数据！
?>
({
	server_info:{
   		status:{text:"连接成功",className:"success"},
        //status:{text:"失败",className:"error"},
        alerts:"1",
        alert_time:"2012-09-01 14:39"
     },
   run_info:{
   		response:"<? echo rand(1,15);?>",
        cpu:"<? echo rand(1,100);?>",
        ram:"<? echo rand(1,100);?>",
        lost:"<? echo rand(1,100);?>"
     },
     disk_info:[
     	{
        unit:'GB',
    	total:'7.4',<? $temp1=rand(0,7.4); ?>
        free:'<? echo $temp1; ?>',
        used:'<? echo 7.4-$temp1;?>' 
        },
        {
        unit:'GB',
    	total:'4',
        <? $temp1=rand(0,4); ?>
        free:'<? echo $temp1; ?>',
        used:'<? echo 4-$temp1;?>'  
        },
        {
        unit:'GB',
    	total:'20',<? $temp1=rand(0,20); ?>
        free:'<? echo $temp1; ?>',
        used:'<? echo 20-$temp1;?>' 
        }
    ],
    ram_info:{
    	ram_phy:'<? echo rand(1,100);?>',
        ram_vir:'<? echo rand(1,100);?>'
    }
})