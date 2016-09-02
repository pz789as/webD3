let consts = {
    FORCE_DATA: [//number是权重或者说是构字数量，linkDis是距离，gravity是向中间靠拢的引力，charge是每个节点之间的排斥力，出了第一行后面的几行linkDis都是有计算公式
        {number: 10, linkDis: 500, gravity: 0.5, charge: -200},
        //{number: 4, linkDis: 20, gravity: 0.05, charge: -20},
        //{number: 3, linkDis: 20, gravity: 0.05, charge: -20},
        {number: 2, linkDis: 100, gravity: 0.25, charge: -100},
        {number: 1, linkDis: 30, gravity: 0.05, charge: -50}
    ]
};//分阶段使用力聚拢所有节点s

module.exports = consts;