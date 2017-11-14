


const c=require('./consts.js');
const shape = {
left : {
verts : [ { z:0        , y:c.peice_depth    , x:c.swell_pad }, { z:c.unit_length, y:c.peice_depth    , x:c.swell_pad }
	, { z:0        , y:c.peice_depth*3/4, x:0         }, { z:c.unit_length, y:c.peice_depth*3/4, x:0  }
	, { z:0        , y:c.peice_depth*1/4, x:0         }, { z:c.unit_length, y:c.peice_depth*1/4, x:0  }
	, { z:0        , y:0              , x:c.swell_pad }, { z:c.unit_length, y:0              , x:c.swell_pad }
        ],
norms : [ { z:0, y : 1, x: -0.2 }
	, { z:0, y : 0, x: -1 }
	, { z:0, y : -1, x: -0.2 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
	, [4,1], [5,1]
	, [6,2], [7,2]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1], [2,4,3],[4,5,3],[4,6,5],[6,7,5] ],
scaledVert(n,scale) { let v = this.verts[n] return {x:v.x,y:v.y,z:v.z*scale}; }
},
right:{
verts : [ { z:0        , y:c.peice_depth    , x:0 }, { z:c.unit_length, y:c.peice_depth    , x:0 }
	, { z:0        , y:c.peice_depth*3/4, x:c.swell_pad         }, { z:c.unit_length, y:c.peice_depth*3/4, x:c.swell_pad  }
	, { z:0        , y:c.peice_depth*1/4, x:c.swell_pad         }, { z:c.unit_length, y:c.peice_depth*1/4, x:c.swell_pad  }
	, { z:0        , y:0              , x:0 }, { z:c.unit_length, y:0              , x:0 }
        ],
norms : [ { z:0, y : 1, x: 0.2 }
	, { z:0, y : 0, x: 1 }
	, { z:0, y : -1, x: 0.2 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
	, [4,1], [5,1]
	, [6,2], [7,2]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3], [2,3,4],[4,3,5],[4,5,6],[6,5,7] ],
scaledVert(n,scale) { let v = this.verts[n] return {x:v.x,y:v.y,z:v.z*scale}; }
}
}
c.normalizeNorms( shape );

c.deepFreeze( shape );

module.exports = exports = shape;
