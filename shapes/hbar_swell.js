


const c=require('./consts.js');
const shape = {
upper: {
verts : [ { x:0        , y:c.peice_depth    , z:c.swell_pad }, { x:c.unit_length, y:c.peice_depth    , z:c.swell_pad }
	, { x:0        , y:c.peice_depth*3/4, z:0         }, { x:c.unit_length, y:c.peice_depth*3/4, z:0  }
	, { x:0        , y:c.peice_depth*1/4, z:0         }, { x:c.unit_length, y:c.peice_depth*1/4, z:0  }
	, { x:0        , y:0              , z:c.swell_pad }, { x:c.unit_length, y:0              , z:c.swell_pad }
        ],
norms : [ { x:0, y : 1, z: -0 }
	, { x:0, y : 0, z: -1 }
	, { x:0, y : -1, z: -0 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
	, [4,1], [5,1]
	, [6,2], [7,2]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3], [2,3,4],[4,3,5],[4,5,6],[6,5,7] ],
scaledVert(n,scale) { let v = this.verts[n]; 
	return { x: v.x * scale, y:v.y, z:v.z };
}

},

lower:{
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.unit_length, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth*3/4, z:c.swell_pad         }, { x:c.unit_length, y:c.peice_depth*3/4, z:c.swell_pad  }
	, { x:0        , y:c.peice_depth*1/4, z:c.swell_pad         }, { x:c.unit_length, y:c.peice_depth*1/4, z:c.swell_pad  }
	, { x:0        , y:0              , z:0 }, { x:c.unit_length, y:0              , z:0 }
        ],
norms : [ { x:0, y : 1, z: 0 }
	, { x:0, y : 0, z: 1 }
	, { x:0, y : -1, z: 0 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
	, [4,1], [5,1]
	, [6,2], [7,2]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1], [2,4,3],[4,5,3],[4,6,5],[6,7,5] ],
scaledVert(n,scale) { let v = this.verts[n]; 
	return { x: v.x * scale, y:v.y, z:v.z };
}
},

// this is used on the left side of inner tab on an L bracket thing....
lower_inner_tab:{
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.swell_pad, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth*3/4, z:c.swell_pad         }, { x:c.swell_pad, y:c.peice_depth*3/4, z:c.swell_pad  }
	, { x:0        , y:c.peice_depth*1/4, z:c.swell_pad         }, { x:c.swell_pad, y:c.peice_depth*1/4, z:c.swell_pad  }
	, { x:0        , y:0              , z:0 }, { x:c.swell_pad, y:0              , z:0 }
        ],
norms : [ { x:0, y : 1, z: 0.2 }
	, { x:0, y : 0, z: 1 }
	, { x:0, y : -1, z: 0.2 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
	, [4,1], [5,1]
	, [6,2], [7,2]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1], [2,4,3],[4,5,3],[4,6,5],[6,7,5] ]
},
scaledVert(n,scale) { return this.verts[n]; }

}

c.normalizeNorms( shape );
c.deepFreeze( shape );

module.exports = exports = shape;
