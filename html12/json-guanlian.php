<? 
$type=isset($_REQUEST['type'])?$_REQUEST['type']:'0'; 
if($type=='server'){
?>

<table class="gGrid" id="deviceTable"><thead>
	<tr>
		<th>
			服务器数据表格
		</th>
		<th>
			设备类型
		</th>
		<th>
			设备名称
		</th>
		<th>
			IP地址
		</th>
		<th>
			描述
		</th>
	</tr></thead>
	<tbody><c:forEach var="dl" items="${dList}">
		<tr data-id="${dl.id }" data-type="${dl.devType.name}" data-content="${dl.name }">
			<td>
				${dl.id }
			</td>
			<td>
				${dl.devType.name}
			</td>
			<td>
				${dl.name}
			</td>
			<td>
				${dl.ip}
			</td>
			<td>
				${dl.description}
			</td>
		</tr>
	</c:forEach>
</tbody></table>

<?
}else{
?>


<table class="gGrid" id="deviceTable"><thead>
	<tr>
		<th>
			设备编号
		</th>
		<th>
			设备类型
		</th>
		<th>
			设备名称
		</th>
		<th>
			IP地址
		</th>
		<th>
			描述
		</th>
	</tr></thead>
	<tbody><c:forEach var="dl" items="${dList}">
		<tr data-id="${dl.id }" data-type="${dl.devType.name}" data-content="${dl.name }">
			<td>
				${dl.id }
			</td>
			<td>
				${dl.devType.name}
			</td>
			<td>
				${dl.name}
			</td>
			<td>
				${dl.ip}
			</td>
			<td>
				${dl.description}
			</td>
		</tr>
	</c:forEach>
</tbody></table>



<?
}
?>