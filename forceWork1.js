var d3 = require('./d3.js');
var consts = require('./constant.js');

let FORCE_DATA = consts.FORCE_DATA;

function Force() {
	var lvi = 0;
	var simulation = d3.forceSimulation()
	.force('link', d3.forceLink().id(function(d){return d.index}))
	.force('charge', d3.forceManyBody().strength(function (d, i) {
		if (d.myWeight <= 2){
			return 2 * FORCE_DATA[lvi].charge;
		}else{
			return d.myWeight * FORCE_DATA[lvi].charge;
		}
	}))
	.force('center', d3.forceCenter(0, 0))
	.force('fx', d3.forceX().strength(FORCE_DATA[lvi].gravity).x(0))
	.force('fy', d3.forceY().strength(FORCE_DATA[lvi].gravity).y(0))
	.alphaMin(0.005);

	this.Start = function(nodes, links, lvIndex, callback) {
		lvi = Math.min(lvIndex, FORCE_DATA.length-1);
		simulation
		.nodes(nodes)
		.on("tick", ticked)
		.on("end", ended);
	  
	  simulation.force("link")
	  .links(links)
    .distance(function (d) {
      var dis;
      if (lvi == 0)
        dis = FORCE_DATA[lvi].linkDis;
      else {
        if (d.source.kindText != "不成字部件") {
          dis = 1.414 * d.source.radius + d.target.myWeight * FORCE_DATA[lvi].linkDis;
        } else {
          dis = d.source.radius + d.target.myWeight * FORCE_DATA[lvi].linkDis;
        }
      }
      return dis;
    });

	  // 更新位置信息
	  function ticked() {
	  	callback('ticked', nodes, links);
	  }
	  function ended() {
	  	callback('ended', nodes, links);
	  }
	}
}

module.exports = Force;