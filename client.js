var net = require('net');
var client = net.connect({host: '192.168.1.111', port: 8888}, function() {
	console.log("连接成功")
});

client.on('data', function(data) {
	// var data = JSON.parse(data);
	// console.log(data.toString());
	console.log("wwwwww");
});

client.on('end', function() {
	console.log('断开连接');
});
