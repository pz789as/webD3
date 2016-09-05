var d3 = require('./d3.js');

function Force() {
	var simulation = d3.forceSimulation();
	simulation.alphaMin(0.001)
	  .force("link", d3.forceLink())
	  .force("collide", d3.forceCollide()
	    .radius(function(d) { return d.radius + d.radius / 3; })
	    .strength(1))
	  .force("fx", d3.forceX()
	    .x(0)
	    .strength(0.05))
	  .force("fy", d3.forceY()
	    .y(0)
	    .strength(0.05))
	  .force("charge", d3.forceManyBody()
	    .strength(function(d) { return 0-d.radius*20; }))

	this.Start = function(nodes, links, callback) {
		simulation
	    .nodes(nodes)
	    .on("tick", ticked)
	    .on("end", ended);
	  // 添加线的拉力
	  simulation.force("link")
	    .strength(function(link) {
				if (link.strength == 1){
					if (link.target.myWeight > 1){
						return 1 / link.target.myWeight;
					}
				}
				return link.strength; 
			})
	    .links(links);

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