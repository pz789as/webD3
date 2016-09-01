var net = require('net');
var d3 = require('./d3.js');
var forceWork = require('./forceWork.js');
var readJosn = require('./readJosn.js');

var jsonR = new readJosn();

var index = 0;

var connected = function(connection) {
	index += 1;
	console.log('新客户联入服务器');
	jsonR.AddNodes(10+index*10, function(nodes, links) {
		var force = new forceWork();
		force.Start(nodes, links, function(type, nodes, links) {
			var data = {
				type: type,
				nodes: nodes,
				links: links
			};
			connection.write(JSON.stringify(data));
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
