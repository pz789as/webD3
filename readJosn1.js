var d3 = require('./d3.js');
var consts = require('./constant.js');
let radius = 10;

function JsonR() {
	var zixingJson = require('./hz/mZixing.json');
	var goujianGuanxiJson = require('./hz/mGoujianGuanxi.json');
	var goujianJson = require('./hz/mGoujian.json');
	var myNodes = [];
	var myEdges = [];
	var linearScale = null;
	var minWeight = 9999;
  var maxWeight = 1;

	function getGJByKey(gjKey){
    for(var i=0;i<goujianJson.length;i++){
      if (parseInt(goujianJson[i].key) == gjKey){
        return goujianJson[i];
      }
    }
    console.log('构件未找到，key=' + gjKey);
    return null;
  }

	function getNodeByKey(zxKey){
    for(var i=0;i<myNodes.length;i++){
      if (myNodes[i].zxKey == zxKey){
        return myNodes[i];
      }
    }
    console.log('节点未找到，key=' + zxKey);
    return null;
  }

	function getIndexForArray(arr, obj){
    for(var i=0;i<arr.length;i++){
      if (arr[i] == obj) return i;
    }
    return -1;
  }

	function doJosn() {
		// 显示为字形，字形添加id，添加radius
	  for(var i = 0; i < zixingJson.length; i++){
      var data = zixingJson[i];
      myNodes.push({
        zxKey: parseInt(data.key),
        zxContent: data.zxContent,
        showKey: data.showKey,
        myWeight: 1,
        // visible: false,
        backColor: 'white',
        index: i,
        order: i,
        radius: 10
      });
    }
	  // 添加字形与字形的关系
		var iOrder = 0;
	  for(var i=0;i<goujianGuanxiJson.length;i++){
      var gx = goujianGuanxiJson[i];
      var gj = getGJByKey(parseInt(gx.gjKey));//源头构件
      if (parseInt(gx.zxKey) == parseInt(gj.zxKey)) {
        // console.log('自身，所以线不加入');
        continue;
      }
      var source = getNodeByKey(parseInt(gj.zxKey));
      var target = getNodeByKey(parseInt(gx.zxKey));
      if (source == null || target == null){
        console.log('节点为空：', source, target);
        continue;
      }
      source.kindText = gj.kind;//类型：不成字，成字，汉字
      if (gj.kind == '不成字部件'){
        source.kind = 0;
        source.backColor = 'rgb(255, 0, 0)';
      }else if (gj.kind == '成字部件'){
        source.kind = 1;
        source.backColor = 'rgb(0, 255, 0)';
      }else{
        source.kind = 2;
        source.backColor = 'rgb(255, 255, 255)';
      }
      source.myWeight++;
      var edge = {
        source: source,
        target: target,
        order: iOrder,
        combineIndex: parseInt(gx.gjIndex),
        yyjKind: gx.yyjKind,//音义记类型
        color:'rgb(0,0,0)'
      };
      myEdges.push(edge);
      iOrder++;
    }
		// 得到最大权重和最小权重
    for (var i = 0; i < myNodes.length; i++) {
      if (myNodes[i].myWeight > maxWeight)
        maxWeight = myNodes[i].myWeight;
      if (myNodes[i].myWeight < minWeight)
        minWeight = myNodes[i].myWeight;
    }
		// 生成比例尺，按照最大最小权重获得对应的半径
    linearScale = d3.scaleLinear().domain([minWeight, maxWeight]).range([10, 100]);
		// 确定半径
		for (var i = 0; i < myNodes.length; i++) {
      myNodes[i].radius = myNodes[i].myWeight * 4 + 8;
		}
	  // 根据目标半径，确定跟谁连接
	  for(var i=0;i<myEdges.length;i++){
			var source = myEdges[i].source;
			var target = myEdges[i].target;
			if (target.parent == null || target.parent == undefined){
				target.parent = source;
			}else{
				if (target.parent.myWeight < source.myWeight){
					target.parent = source;
				}
			}
		}
	  // 确定线之间的力
	  for(var i=0;i<myEdges.length;i++){
			var source = myEdges[i].source;
			var target = myEdges[i].target;
			if (source == target.parent){
				myEdges[i].color = 'rgb(0, 255, 0)';
				myEdges[i].type = 0;
				myEdges[i].strength = 1;
			}else{
				myEdges[i].color = 'rgba(128, 128, 128, 128)';
				myEdges[i].type = 1;
				myEdges[i].strength = 0;
			}
		}
    // myNodes.sort(function(a, b) {
	  //   return b.radius - a.radius;
	  // });
	}

	doJosn();

	this.getNodes = function() {
		return myNodes;
	}
	this.getLinks = function() {
		return myEdges;
	}

	this.GetLevel = function(num, callback) {
		var nodesData = [];
	  var linksData = [];
		num = Math.min(num, consts.FORCE_DATA.length - 1);
	  for (var i = 0; i < myNodes.length; i++) {
			if (myNodes[i].myWeight >= consts.FORCE_DATA[num].number) {
				nodesData.push(myNodes[i]);
			}
    }
		// 最后一波出现之后，再添加线
		if (num == consts.FORCE_DATA.length - 1){
			index = 0;
			for(var i=0;i<myEdges.length;i++){
        if (myEdges[i].type == 0){
					linksData.push(myEdges[i]);
				}
      }
		}
    callback(nodesData, linksData);
	}
}

module.exports = JsonR;
