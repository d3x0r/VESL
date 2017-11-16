
// 0 top left
// 1 top right
// 2 bottom left
// 3 bottom right

// 0 upper-left
// 1 lower-left
// 
const c=require('./consts.js');
const shape = {
outer0: {
verts : [ { x:c.swell_pad, y:c.peice_depth    , z:c.swell_pad }
	, { x:0        , y:c.peice_depth*3/4, z:0         }, { x:c.swell_pad, y:c.peice_depth*3/4, z:0  }, { x:0        , y:c.peice_depth*3/4, z:c.swell_pad  }
	, { x:0        , y:c.peice_depth*1/4, z:0         }, { x:c.swell_pad, y:c.peice_depth*1/4, z:0  }, { x:0        , y:c.peice_depth*1/4, z:c.swell_pad  }
	, { x:c.swell_pad, y:0              , z:c.swell_pad }
        ],
norms : [ { x:0, y : 1, z: 0 }
	, { x:-1, y : 0, z: -1 }, { x:0, y : 0, z: -1 }, { x:-1, y : 0, z: 0 }
	, { x:0, y : -1, z: 0 }
,       ],
pairs : [ [0,0]
	, [1, 1], [2, 2], [3,3]
	, [4,1], [5,2], [6,3]
	, [7,4]
        ],
faces : [ [ 0, 2, 1 ], [0, 1, 3], [1,2,5],[1,5,4],[3,1,4],[3,4,6],[4,5,7],[4,7,6] ],
scaledVert(n,scale) { return this.verts[n]; }
},
outer1:{
verts : [ { x:0        , y:c.peice_depth    , z:c.swell_pad }
	, { x:c.swell_pad, y:c.peice_depth*3/4, z:0         }, { x:c.swell_pad, y:c.peice_depth*3/4, z:c.swell_pad  }, { x:0        , y:c.peice_depth*3/4, z:0  }
	, { x:c.swell_pad, y:c.peice_depth*1/4, z:0         }, { x:c.swell_pad, y:c.peice_depth*1/4, z:c.swell_pad  }, { x:0        , y:c.peice_depth*1/4, z:0  }
	, { x:0        , y:0              , z:c.swell_pad }
        ],
norms : [ { x:0, y : 1, z: 0 }
	, { x:1, y : 0, z: -1 }, { x:1, y : 0, z: 0 }, { x:0, y : 0, z: -1 }
	, { x:0, y : -1, z: 0 }
        ],
pairs : [ [0,0]
	, [1, 1], [2, 2], [3,3]
	, [4,1], [5,2], [6,3]
	, [7,4]
        ],
faces : [ [ 0, 2, 1 ], [0, 1, 3], [1,2,5],[1,5,4],[3,1,4],[3,4,6],[4,5,7],[4,7,6] ],
scaledVert(n,scale) { return this.verts[n]; }
},
outer2:{
verts : [ { x:c.swell_pad, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth*3/4, z:c.swell_pad }, { x:0        , y:c.peice_depth*3/4, z:0  }, { x:c.swell_pad, y:c.peice_depth*3/4, z:c.swell_pad  }
	, { x:0        , y:c.peice_depth*1/4, z:c.swell_pad }, { x:0        , y:c.peice_depth*1/4, z:0  }, { x:c.swell_pad, y:c.peice_depth*1/4, z:c.swell_pad  }
	, { x:c.swell_pad, y:0              , z:0 }
        ],
norms : [ { x:0, y : 1, z: 0 }
	, { x:-1, y : 0, z: 1 }, { x:-1, y : 0, z: 0 }, { x:0, y : 0, z: 1 }
	, { x:0, y : -1, z: 0 }
        ],
pairs : [ [0,0]
	, [1, 1], [2, 2], [3,3]
	, [4,1], [5,2], [6,3]
	, [7,4]
        ],
faces : [ [ 0, 2, 1 ], [0, 1, 3], [1,2,5],[1,5,4],[3,1,4],[3,4,6],[4,5,7],[4,7,6] ],
scaledVert(n,scale) { return this.verts[n]; }
},
outer3:{
verts : [ { x:0, y:c.peice_depth    , z:0 }
	, { x:c.swell_pad, y:c.peice_depth*3/4, z:c.swell_pad }, { x:0, y:c.peice_depth*3/4, z:c.swell_pad  }, { x:c.swell_pad, y:c.peice_depth*3/4, z:0  }
	, { x:c.swell_pad , y:c.peice_depth*1/4, z:c.swell_pad }, { x:0, y:c.peice_depth*1/4, z:c.swell_pad }, { x:c.swell_pad  , y:c.peice_depth*1/4, z:0  }
	, { x:0, y:0              , z:0 }
        ],
norms : [ { x:0, y : 1, z: 0 }
	, { x:1, y : 0, z: 1 }, { x:0, y : 0, z: 1 }, { x:1, y : 0, z: 0 }
	, { x:0, y : -1, z: 0 }
        ],
pairs : [ [0,0]
	, [1, 1], [2, 2], [3,3]
	, [4,1], [5,2], [6,3]
	, [7,4]
        ],
faces : [ [ 0, 2, 1 ], [0, 1, 3], [1,2,5],[1,5,4],[3,1,4],[3,4,6],[4,5,7],[4,7,6] ],
scaledVert(n,scale) { return this.verts[n]; }
},
inner0:{
verts : [ { x:0, y:c.peice_depth    , z:0 }, { x:c.swell_pad, y:c.peice_depth    , z:0 }, { x:0, y:c.peice_depth    , z:c.swell_pad }
	, { x:c.swell_pad, y:c.peice_depth*3/4, z:c.swell_pad }
	, { x:c.swell_pad , y:c.peice_depth*1/4, z:c.swell_pad }
	, { x:0, y:0              , z:0 } , { x:c.swell_pad, y:0              , z:0 }, { x:0, y:0              , z:c.swell_pad }
        ],
norms : [ { x:0.2, y : 1, z: 0.2 }, { x:0, y : 1, z: 0.2 }, { x:0.2, y : 1, z: 0 }
	, { x:1, y : 0, z: 1 }
	, { x:0.2, y : -1, z: 0.2 }, { x:0.2, y : -1, z: 0.2 }, { x:0.2, y : -1, z: 0.2 }
        ],
pairs : [ [0,0] , [1, 1], [2, 2]
	, [3,3]
	, [4,3]
	, [5,4], [6,5], [7,6]
        ],
faces : [ [ 0, 2, 3 ], [0, 3, 1], [7,8,4],[7,4,9] ],
scaledVert(n,scale) { return this.verts[n]; }
},
inner1:{
verts : [ { x:0, y:c.peice_depth    , z:c.swell_pad }, { x:0, y:c.peice_depth    , z:0 }, { x:c.swell_pad, y:c.peice_depth, z:c.swell_pad }
	, { x:c.swell_pad, y:c.peice_depth*3/4, z:0 }
	, { x:c.swell_pad , y:c.peice_depth*1/4, z:0 }
	, { x:0, y:0              , z:c.swell_pad } , { x:0, y:0              , z:0 }, { x:c.swell_pad, y:0         , z:c.swell_pad }
        ],
norms : [ { x:0.2, y : 1, z: 0.2 }
	, { x:1, y : 0, z: 1 }, { x:1, y : 0, z: 0 }, { x:0, y : 0, z: 1 }
	, { x:0.2, y : -1, z: 0.2 }
        ],
pairs : [ [0,0] , [1, 1], [2, 2]
	, [3,3]
	, [4,3]
	, [5,4], [6,5], [7,6]
        ],
faces : [ [ 0, 2, 3 ], [0, 3, 1], [6,9,8],[6,7,9] ],
scaledVert(n,scale) { return this.verts[n]; }
},
inner2:{
},
inner3:{
}
}

c.normalizeNorms( shape );
c.deepFreeze( shape );

module.exports = exports = shape;
