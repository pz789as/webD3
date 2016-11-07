var WebSocketServer = require('ws').Server;
var mail = require('./mail.js');
var fs = require('fs');
var iconv = require('iconv-lite');  

var server = new WebSocketServer({host: '192.168.1.112', port: 8888});

function writeFile(file, str){
    // 把中文转换成字节数组  
    // var arr = iconv.encode(str, 'gbk');  
    // console.log(arr);  
      
    // appendFile，如果文件不存在，会自动创建新文件  
    // 如果用writeFile，那么会删除旧文件，直接写新文件  
    fs.appendFile(file, str, function(err){  
        if(err)  
            console.log("fail " + err);  
        else  
            console.log("写入文件ok");  
    });  
};

function readFile(file){  
    fs.readFile(file, function(err, data){  
        if(err)  
            console.log("读取文件fail " + err);  
        else{  
            // 读取成功时  
            // 输出字节数组  
            console.log(data);
            // 把数组转换为gbk中文  
            // var str = iconv.decode(data, 'gbk');  
            // console.log(str);  
        }  
    });  
} 

var sendNumber = '';
server.on('connection', function(connection) {
	console.log('新客户联入服务器');
	connection.on('message', function(data){
		console.log('message: ', data.toString());
		var jsonData = JSON.parse(data.toString());
		if (jsonData.code == 0){
			sendNumber = '';
			for (var i = 0; i < 6; i++) {
				sendNumber += parseInt(Math.max(0, Math.random() * 10 - 1)).toString();
			}
			// mail(data.toString(), 'text', '来自RN的验证', sendNumber, (error, response)=>{
			// 	if (error){
			// 		console.log(error);
			// 		connection.send('error_' + error + '|');
			// 	}else{
			// 		console.log('发送邮件成功:' + data.toString());
			// 		connection.send('1|');
			// 	}
			// });

			var sendData = `<img src='http://pic33.nipic.com/20130916/3420027_192919547000_2.jpg'/>`;
			sendData += `</br><h1>验证码：${sendNumber}</h1>`;
			sendData += `</br><a href="http://www.5ying.com">点击连接去验证</a>`;
			mail(jsonData.user, 'html', '来自Jicheng6的验证', sendData, (error, response)=>{
				if (error){
					console.log(error);
					connection.send(`{"code": 0, "desc": "${error}"}|`);
				}else{
					console.log('发送邮件成功:' + data.toString());
					connection.send(`{"code": 1, "desc": "${sendNumber}"}|`);
				}
			});
		}else if (jsonData.code == 1){
			writeFile('test.txt', data.toString()+`\r\n`);
			connection.send(`{"code": 2}|`);
		}
	});
	connection.on('close', function(){
		console.log('新客户断开连接');
	});
});

server.on('error', function(error) {
	console.log(error);
	server.close();
});

console.log("服务器开启！");

