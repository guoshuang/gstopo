topo 文件4个：

<a href="view.php?sid=123">查看</a> <a href="view.php">查看（没有sid）</a><br>
<a href="edit.php?sid=123">编辑</a> <a href="edit.php">新建（没有sid）</a>

设备属性页面：

info.htm
info2.htm
info3.htm
info5.htm

.xml 文件是 flash chart 的基本属性配置（样式、颜色、文字等非数据部分的设置）

ajax*.php 为 ajax 数据请求

themes\default 目录为默认的主题，包含 css,js,images

查看的主 js 为 topo_view.js
编辑的主 js 为 topo.js

if($.browser.msie&&parseInt($.browser.version)<10){$('body').html('<div style="padding:20px;">编辑功能不再支持IE 10以下，请使用freifox或者chrome</div>')}