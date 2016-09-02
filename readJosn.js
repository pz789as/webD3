function JsonR() {
	var ZxData = require('./hz/mZixing.json');
	var GxData = require('./hz/mGoujianGuanxi.json');
	var GjData = require('./hz/mGoujian.json');

	var baseR = 3;
	function doJosn() {
		// 显示为字形，字形添加id，添加radius
	  for (var i=0;i<ZxData.length;i++) {
	    ZxData[i].radius = baseR*2;
	    ZxData[i].id = ZxData[i].zxContent;
	    ZxData[i].group = null;
	  }
	  // 添加字形与字形的关系
	  // 确定半径
	  for (var i=0;i<GxData.length;i++) {
	    var data = GxData[i];
	    var _zxKey = getZxKey(data.gjKey);
	    GxData[i].source = ZxData[data.zxKey-1];
	    GxData[i].target = ZxData[_zxKey-1];
	    GxData[i].target.type = getZxType(data.gjKey)
	    if (data.zxKey != _zxKey) {
	      // ZxData[data.zxKey-1].radius += baseR;
	      ZxData[_zxKey-1].radius += baseR;
	    }
	  }
	  ZxData.sort(function(a, b) {
	    return b.radius - a.radius;
	  });
	  // 根据目标半径，确定跟谁连接
	  for (var i=0;i<GxData.length;i++) {
	    var data = GxData[i];
	    var target = data.target;
	    var start = data.source;
	    if (start.group == null) {
	      start.group = target.key;
	    } else {
	      if (ZxData[start.group-1].radius < target.radius) {
	        start.group = target.key;
	      }
	    }
	  }
	  // 确定线之间的力
	  for (var i=0;i<GxData.length;i++) {
	    var data = GxData[i];
	    var target = data.target;
	    var start = data.source;
	    GxData[i].strength = 0;
	    if (start.group == target.key) {
	      GxData[i].strength = 1;
	    }
	  }
	}
	// 根据构件key得到字形key
	function getZxKey(gjKey) {
	  return GjData[gjKey-1].zxKey;
	}
	// 根据构件key得到字形类型
	function getZxType(gjKey) {
	  return GjData[gjKey-1].kind;
	}

	doJosn();
	
	this.getNodes = function(callback) {
		return ZxData;
	}
	this.getLinks = function() {
		return GxData;
	}

	this.AddNodes = function(num, callback) {
		var nodesData = [];
	  var linksData = [];
	  for (var i=0;i<num;i++) {
			if (i >= ZxData.length){
				break;
			}
      nodesData[i] = ZxData[i];
    }

    for (var i=0;i<GxData.length;i++) {
      var data = GxData[i];
      if (data.source.key<=num && data.target.key<=num) {
        linksData[linksData.length] = data;
      }
    }

    callback(nodesData, linksData);
	}
}

module.exports = JsonR;
