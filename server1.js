var net = require('net');
var d3 = require('./d3.js');
var forceWork = require('./forceWork1.js');
var readJosn = require('./readJosn1.js');
var consts = require('./constant.js');

var jsonR = new readJosn();

var lvIndex = consts.FORCE_DATA.length;

var connected = function(connection) {
	console.log('新客户联入服务器');
	jsonR.GetLevel(1000, function(nodes, links) {
		var force = new forceWork();
		force.Start(nodes, links, function(type, nodes, links) {
			if (type == 'ended'){
				var data = {
					type: type,
					nodes: nodes,
					links: links
				};
				connection.write(JSON.stringify(data));
				connection.write('|');
				console.log('send data!');
				// console.log(nodes, links);
			}
			// connection.write('hello 刘明!');
		});
	});
	connection.on('data', function(data){
		console.log('data: ', data.toString());
	});
	connection.on('end', function(){
		console.log('新客户断开连接');
	});
};

var server = net.createServer(connected);

server.listen({
	host: '192.168.1.111',
  	port: 8888,
  	exclusive: true
});

server.on('error', function(error) {
	console.log(error);
	server.close();
});

console.log("服务器开启");
