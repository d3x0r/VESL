

const c=require('./consts.js');
const shape = {
lower_corner_fill: {
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.vbar_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.bot_hbar_height         }, { x:c.vbar_width, y:c.peice_depth, z:c.bot_hbar_height  }
        ],
norms : [ { x:0.1, y : 1, z: 0 }
	, { x:-0.1, y : 1, z: 0.1 }
	, { x:0.1, y : 1, z: -0.1 }
	, { x:0, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ]
},

upper_corner_fill: {
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.vbar_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_tab_fill_height         }, { x:c.vbar_width, y:c.peice_depth, z:c.top_hbar_tab_fill_height  }
        ],
norms : [ { x:0.1, y : 1, z: 0 }
	, { x:-0.1, y : 1, z: 0.1 }
	, { x:0.1, y : 1, z: -0.1 }
	, { x:0, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ]
},

upper_corner_fill_notab: {
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.vbar_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_height         }, { x:c.vbar_width, y:c.peice_depth, z:c.top_hbar_height  }
        ],
norms : [ { x:0.1, y : 1, z: 0 }
	, { x:-0.1, y : 1, z: 0.1 }
	, { x:0.1, y : 1, z: -0.1 }
	, { x:0, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { return this.verts[n]; }
},

key_fill:{
verts : [ { x:0, y:c.peice_depth, z:0 }            , { x:c.unit_length, y:c.peice_depth    , z:0 }
	, { x:0, y:c.peice_depth, z:c.unit_length }, { x:c.unit_length, y:c.peice_depth, z:c.unit_length  }
        ],
norms : [ { x:0.1, y : 1, z: 0.1 }
	, { x:0.1, y : 1, z: -0.1 }
        , { x:-0.1, y : 1, z: 0.1 }
	, { x:-0.1, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,2]
	, [2, 1], [3, 3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale,s2) { let v = this.verts[n]; return {x:v.x*scale,y:v.y,z:v.z*s2}; }
},

key_bottom:{
verts : [ { x:0        , y:0  , z:0 }, { x:c.unit_length, y:0    , z:0 }
	, { x:0        , y:0, z:c.unit_length        }, { x:c.unit_length, y:0, z:c.unit_length  }
        ],
norms : [ { x:0.3, y : -0.5, z: -0.05 }
	, { x:0.3, y : -.5, z: 0.05 }
        , { x:-0.3, y : -.5, z: -0.05 }
	, { x:-0.3, y : -.5, z: 0.05 }
        
        ],
pairs : [ [0,0], [1,2]
	, [2, 1], [3, 3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale,s2) { let v = this.verts[n]; return {x:v.x*scale,y:v.y,z:v.z*s2}; }
},

top_hbar:{
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.unit_length, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_height        }, { x:c.unit_length, y:c.peice_depth, z:c.top_hbar_height  }
        ],
norms : [ { x:0.1*0, y : 1, z: 0.1 }
	, { x:0.1*0, y : 1, z: -0.1 }
        , { x:-0.1*0, y : 1, z: 0.1 }
	, { x:-0.1*0, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,2]
	, [2, 1], [3, 3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { let v = this.verts[n]; return {x:v.x*scale,y:v.y,z:v.z}; }
},

bot_hbar:{
verts : [ { x:0        , y:0  , z:0 }, { x:c.unit_length, y:0    , z:0 }
	, { x:0        , y:0, z:c.top_hbar_height        }, { x:c.unit_length, y:0, z:c.top_hbar_height  }
        ],
norms : [ { x:0.3, y : -1, z: -0.3 }
	, { x:0.3, y : -1, z: 0.3 }
        , { x:-0.3, y : -1, z: -0.3 }
	, { x:-0.3, y : -1, z: 0.3 }
        
        ],
pairs : [ [0,0], [1,2]
	, [2, 1], [3, 3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { let v = this.verts[n]; return {x:v.x*scale,y:v.y,z:v.z}; }
},

hbar_top_left:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.top_hbar_blend_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_height  }, { x:c.top_hbar_blend_width, y:c.peice_depth, z:c.top_hbar_height  }
        ],
norms : [ { x:0, y : 1, z: 0.1 }
	, { x:-0.1, y : 1, z: -0.1 }
	, { x:0, y : 1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 2]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { return this.verts[n]; }
},

hbar_top_right:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.top_hbar_blend_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_height  }, { x:c.top_hbar_blend_width, y:c.peice_depth, z:c.top_hbar_height  }
        ],
norms : [ { x:0, y : 1, z: 0.1 }
	, { x:-0.1, y : 1, z: 0.1 }
	, { x:0, y : 1, z: -0.1 }
	, { x:-0.1, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3, 3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { return this.verts[n]; }
},

hbar_bot_left:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.bot_hbar_blend_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.bot_hbar_height  }, { x:c.bot_hbar_blend_width, y:c.peice_depth, z:c.bot_hbar_height  }
        ],
norms : [ { x:0, y : 1, z: 0.1 }
	, { x:-0.1, y : 1, z: -0.1 }
	, { x:0, y : 1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 2]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { return this.verts[n]; }
},

hbar_bot_right:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.top_hbar_blend_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.bot_hbar_height  }, { x:c.bot_hbar_blend_width, y:c.peice_depth, z:c.bot_hbar_height  }
        ],
norms : [ { x:0, y : 1, z: 0.1 }
	, { x:-0.1, y : 1, z: 0.1 }
	, { x:0, y : 1, z: -0.1 }
	, { x:-0.1, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3, 3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { return this.verts[n]; }
},


hbar_tab:{
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.htab_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.htab_height         }, { x:c.htab_width, y:c.peice_depth, z:c.htab_height  }
        ],
norms : [ { x:0.1, y : 1, z: -0.1 }
	, { x:0, y : 1, z: -0.1 }
	, { x:0.1, y : 1, z: 0 }
	, { x:-0.1, y : 1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { return this.verts[n]; }
},

vbar:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.vbar_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.unit_length         }, { x:c.vbar_width, y:c.peice_depth, z:c.unit_length  }
        ],
norms : [ { x:0.1, y : 1, z: 0 }
	, { x:-0.1, y : 1, z: 0 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 0], [3, 1]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { let v = this.verts[n]; return {x:v.x,y:v.y,z:v.z*scale}; }
},

lower_corner_fill_back: {
verts : [ { x:0        , y:0    , z:0 }, { x:c.vbar_width, y:0   , z:0 }
	, { x:0        , y:0, z:c.bot_hbar_height         }, { x:c.vbar_width, y:0, z:c.bot_hbar_height  }
        ],
norms : [ { x:0.1, y : -1, z: 0 }
	, { x:-0.1, y : -1, z: 0.1 }
	, { x:0.1, y : -1, z: -0.1 }
	, { x:0, y : -1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

upper_corner_fill_back: {
verts : [ { x:0        , y:0    , z:0 }, { x:c.vbar_width, y:0   , z:0 }
	, { x:0        , y:0, z:c.top_hbar_tab_fill_height         }, { x:c.vbar_width, y:0, z:c.top_hbar_tab_fill_height  }
        ],
norms : [ { x:0.1, y : -1, z: 0 }
	, { x:-0.1, y : -1, z: 0.1 }
	, { x:0.1, y : -1, z: -0.1 }
	, { x:0, y : -1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

upper_corner_fill_notab_back: {
verts : [ { x:0        , y:0    , z:0 }, { x:c.vbar_width, y:0   , z:0 }
	, { x:0        , y:0, z:c.top_hbar_height         }, { x:c.vbar_width, y:0, z:c.top_hbar_height  }
        ],
norms : [ { x:0.1, y : -1, z: 0 }
	, { x:-0.1, y : -1, z: 0.1 }
	, { x:0.1, y : -1, z: -0.1 }
	, { x:0, y : -1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

top_hbar_back:{
verts : [ { x:0        , y:0    , z:0 }, { x:c.unit_length, y:0    , z:0 }
	, { x:0        , y:0, z:c.top_hbar_height        }, { x:c.unit_length, y:0, z:c.top_hbar_height  }
        ],
norms : [ { x:0, y : -1, z: -0.1 }
	, { x:0, y : -1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { let v = this.verts[n]; return {x:v.x*scale,y:v.y,z:v.z}; }
},

bot_hbar_back:{
verts : [ { x:0        , y:0    , z:0 }, { x:c.unit_length, y:0    , z:0 }
	, { x:0        , y:0, z:c.bot_hbar_height        }, { x:c.unit_length, y:0, z:c.bot_hbar_height  }
        ],
norms : [ { x:0, y : -1, z: -0.1 }
	, { x:0, y : -1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { let v = this.verts[n]; return {x:v.x*scale,y:v.y,z:v.z}; }
},

hbar_top_left_back:{
verts : [ { x:0        , y:0, z:0 }, { x:c.top_hbar_blend_width, y:0    , z:0 }
	, { x:0        , y:0, z:c.top_hbar_height  }, { x:c.top_hbar_blend_width, y:0, z:c.top_hbar_height  }
        ],
norms : [ { x:0, y : -1, z: 0.1 }
	, { x:-0.1, y : -1, z: -0.1 }
	, { x:0, y : -1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 2]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

hbar_top_right_back:{
verts : [ { x:0        , y:0, z:0 }, { x:c.top_hbar_blend_width, y:0    , z:0 }
	, { x:0        , y:0, z:c.top_hbar_height  }, { x:c.top_hbar_blend_width, y:0, z:c.top_hbar_height  }
        ],
norms : [ { x:0, y : -1, z: 0.1 }
	, { x:-0.1, y : -1, z: 0.1 }
	, { x:0, y : -1, z: -0.1 }
	, { x:-0.1, y : -1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3, 3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

hbar_bot_left_back:{
verts : [ { x:0        , y:0, z:0 }, { x:c.bot_hbar_blend_width, y:0    , z:0 }
	, { x:0        , y:0, z:c.bot_hbar_height  }, { x:c.bot_hbar_blend_width, y:0, z:c.bot_hbar_height  }
        ],
norms : [ { x:0, y : -1, z: 0.1 }
	, { x:-0.1, y : -1, z: -0.1 }
	, { x:0, y : -1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 2]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

hbar_bot_right_back:{
verts : [ { x:0        , y:0, z:0 }, { x:c.top_hbar_blend_width, y:0    , z:0 }
	, { x:0        , y:0, z:c.bot_hbar_height  }, { x:c.bot_hbar_blend_width, y:0, z:c.bot_hbar_height  }
        ],
norms : [ { x:0, y : -1, z: 0.1 }
	, { x:-0.1, y : -1, z: 0.1 }
	, { x:0, y : -1, z: -0.1 }
	, { x:-0.1, y : -1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3, 3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},



hbar_tab_back:{
verts : [ { x:0        , y:c.peice_depth    , z:0 }, { x:c.htab_width, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.htab_height         }, { x:c.htab_width, y:c.peice_depth, z:c.htab_height  }
        ],
norms : [ { x:0.1, y : -1, z: -0.1 }
	, { x:0, y : -1, z: -0.1 }
	, { x:0.1, y : -1, z: 0 }
	, { x:-0.1, y : -1, z: -0.1 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 2], [3,3]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},

vbar_back:{
verts : [ { x:0        , y:0, z:0 }, { x:c.vbar_width, y:0    , z:0 }
	, { x:0        , y:0, z:c.unit_length         }, { x:c.vbar_width, y:0, z:c.unit_length  }
        ],
norms : [ { x:0.1, y : -1, z: 0 }
	, { x:-0.1, y : -1, z: 0 }
        ],
pairs : [ [0,0], [1,1]
	, [2, 0], [3, 1]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { let v = this.verts[n]; return {x:v.x,y:v.y,z:v.z*scale}; }
}


}


c.normalizeNorms( shape );
c.deepFreeze( shape );

module.exports = exports = shape;
