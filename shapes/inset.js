

const c=require('./consts.js');

const shape = {
inset_left_top:{
size : { x: c.inset+c.inset_pad*2, y:c.inset+c.inset_pad*2 },
verts : [ { x:0        , y:c.peice_depth, z:0 }
	, { x:c.inset+c.inset_pad, y:c.peice_depth    , z:0 }
	, { x:c.inset+c.inset_pad*2, y:c.peice_depth    , z:0 }
	, { x:c.inset+c.inset_pad , y:c.peice_depth, z:c.inset  }
	, { x:c.inset+c.inset_pad*2, y:c.peice_depth, z:c.inset  }
	// these might simplify later... do converge to a single point from 2-4, 7-9
	, { x:0, y:c.peice_depth, z:c.inset+c.inset_pad }
	, { x:c.inset, y:c.peice_depth, z:c.inset+c.inset_pad } 
	, { x:c.inset+c.inset_pad, y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad } 
	, { x:c.inset+c.inset_pad*2, y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad } 

	, { x:0, y:c.peice_depth, z:c.inset+c.inset_pad*2 }
	, { x:c.inset, y:c.peice_depth, z:c.inset+c.inset_pad*2 } 
	, { x:c.inset+c.inset_pad, y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad*2 } 
	//, { x:c.inset*2+c.inset_pad, y:c.peice_depth-c.inset_depth, z:c.inset*2+c.inset_pad } 

        ],
norms : [ { x:0.1, y : 1, z: -0.1 }, { x:0, y : 1, z: -0.1 }, { x:0.1, y : 1, z: 0 } // upper left corner
	, { x:0, y:1, z:0 } // top flat of inset
	, { x:0.2, y:1, z:0 }
	, { x:0.2, y:1, z:0 }
	, { x:0, y:1, z:0.2 } // top flat of inset
	, { x:0, y:1, z:0 }    // 7
	
	, { x:0.2, y:0.2, z:-0.4 }
	, { x:0, y:0.2, z:-0.4 }
	, { x:0.4, y:0.2, z:-0.4 }
	, { x:0, y:1, z:0 }
	, { x:0.2, y:0.2, z:0 }
	

        ],
pairs : [ [0,0], [1,1], [2, 1],[3,3],[4,3],[5,2],[6,3],[7,4],[8,5],[9,2],[10,3],[11,6]
	, [12,7]
	, [3,8],[4,9],[6,10],[7,11],[8,9],[10,12],[11,12]
        ],
faces : [ [0,5,6],[0,6,3],[0,3,1]
	,[1,3,2],[3,4,2],[5,9,6],[9,10,6]
	, [15,16,13],[13,16,14],[16,17,14],[15,18,19],[15,19,16] 
	],
scaledVert(n,scale) { return this.verts[n]; }
},
inset_left_fill:{
verts : [ { x:0        , y:c.peice_depth, z:c.inset_depth+c.inset_pad*2 }
	, { x:c.inset, y:c.peice_depth    , z:c.inset_depth+c.inset_pad*2 }
	, { x:c.inset+c.inset_pad, y:c.peice_depth-c.inset_depth    , z:c.inset_depth+c.inset_pad*2 }

	, { x:0        , y:c.peice_depth, z:c.top_hbar_height-(c.inset_depth+c.inset_pad*2) }
	, { x:c.inset, y:c.peice_depth    , z:c.top_hbar_height-(c.inset_depth+c.inset_pad*2) }
	, { x:c.inset+c.inset_pad, y:c.peice_depth-c.inset_depth    , z:c.top_hbar_height-(c.inset_depth+c.inset_pad*2) }

        ],
norms : [ { x:0.1, y : 1, z: 0 }, { x:0, y : 1, z: 0 }
	, { x:0.4, y : 0.3, z: 0 }, { x:0, y : 1, z: 0 }
	],
pairs : [ [0,0], [1,1], [3,0],[4,1]
	,[1,2],[2,3]
	,[4,2],[5,3]
        ],
faces : [ [ 0, 2, 1 ], [2, 3, 1],[4,6,5],[6,7,5]
	//,[1,5,2],[4,6,2]
	//, [ 2,6,3],[6,7,3]
	],
scaledVert(n,scale) { return this.verts[n]; }
},


inset_left:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.inset*2, y:c.peice_depth    , z:0 }, { x:c.inset*2, y:c.peice_depth    , z:c.inset }
	, { x:0        , y:c.peice_depth, z:c.inset*2  }, { x:c.inset*2, y:c.peice_depth, z:c.inset  }
        , { x:0        , y:c.peice_depth, z:c.top_hbar_height-0 }, { x:c.inset*2, y:c.peice_depth    , z:c.top_hbar_height-0 }, { x:c.inset*2, y:c.peice_depth    , z:c.top_hbar_height-c.inset }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_height-c.inset*2  }, { x:c.inset*2, y:c.peice_depth, z:c.top_hbar_height-c.inset  }
	// these might simplify later... do converge to a single point from 2-4, 7-9
	, { x:c.inset+c.inset_pad, y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad+c.inset_pad }, { x : c.inset+c.inset_pad*2, y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad } 
	, { x:c.inset+c.inset_pad, y:c.peice_depth-c.inset_depth, z:c.top_hbar_height-c.inset+c.inset_pad+c.inset_pad } , { x : c.inset+c.inset_pad*2, y:c.peice_depth-c.inset_depth, z:c.top_hbar_height-c.inset+c.inset_pad } 
	
	, { x:c.inset+c.inset_pad+c.inset_pad+c.inset_pad, y : c.peice_depth, z:0 }
	, { x:c.inset+c.inset_pad+c.inset_pad+c.inset_pad, y : c.peice_depth, z:c.inset }
	, { x:c.inset+c.inset_pad+c.inset_pad+c.inset_pad, y : c.peice_depth, z:c.inset+c.inset_pad }

	, { x:c.inset+c.inset_pad+c.inset_pad+c.inset_pad, y : c.peice_depth, z:c.top_hbar_height-0 }
	, { x:c.inset+c.inset_pad+c.inset_pad+c.inset_pad, y : c.peice_depth, z:c.top_hbar_height-c.inset }
	, { x:c.inset+c.inset_pad+c.inset_pad+c.inset_pad, y : c.peice_depth, z:c.top_hbar_height-(c.inset+c.inset_pad) }
        ],
norms : [ { x:0.1, y : 1, z: -0.1 }, { x:0, y : 1, z: -0.1 }, { x:0.1, y : -1, z: 0 } // upper left corner
	, { x:0, y:1, z:0 } // top flat of inset
	, { x:0.2, y:1, z:0 }
	, { x:0.2, y:1, z:0 }
	, { x:0, y:1, z:-0.2 } // top flat of inset
        ],
pairs : [ [0,0], [1,1], [3, 2]
	, [14, 1]
        ],
faces : [ [ 0, 1,2 ], [2, 1, 3] ],
scaledVert(n,scale) { return this.verts[n]; }
},


// built from inset_left
inset_right:{
verts : null,
norms : null,
pairs : null,
faces : null
},

inset_fill:{
verts : [ { x:0        , y:c.peice_depth, z:0 }, { x:c.unit_length, y:c.peice_depth    , z:0 }
	, { x:0        , y:c.peice_depth, z:c.inset }, { x:c.unit_length, y:c.peice_depth, z:c.inset  }
	, { x:0        , y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad }, { x:c.unit_length, y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad  }
        , { x:0        , y:c.peice_depth, z:c.top_hbar_height-0 }, { x:c.unit_length, y:c.peice_depth    , z:c.top_hbar_height-0 }
	, { x:0        , y:c.peice_depth, z:c.top_hbar_height-c.inset }, { x:c.unit_length, y:c.peice_depth, z:c.top_hbar_height-c.inset  }
	, { x:0        , y:c.peice_depth-c.inset_depth, z:c.top_hbar_height-(c.inset+c.inset_pad) }, { x:c.unit_length, y:c.peice_depth-c.inset_depth, z:c.top_hbar_height-(c.inset+c.inset_pad)  }
        ],
norms : [ { x:0, y : 1, z: -0.1 }
	, { x:0, y : 1, z: 0 }
        , { x:0, y : 1, z: 0.1 }
	, { x:0, y : 0.5, z: -0.5 }
	, { x:0, y : 0.5, z: 0.5 }
	, { x:0, y : 1, z: 0.2 }
	, { x:0, y : 1, z: -0.2 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 6], [3, 6]
	, [4, 1],[5,1]
	,[6,2],[7,2]
	,[8,5],[9,5]
	,[10,1],[11,1]
	,[2,3],[3,3]
	,[4,3],[5,3]
	,[8,4],[9,4]
	,[10,4],[11,4]
        ],
faces : [ [ 0, 2, 1 ], [2, 3, 1]
	//, [4,10,5],[10,11,5]
	,[8,6,9],[6,7,9]
	,[12,14,13],[14,15,13]
	,[18,16,19],[16,17,19]
	],
scaledVert(n,scale) { let v = this.verts[n]; return { x:v.x*scale, y:v.y, z:v.z}; }
},

inset_background:{
verts : [ { x:0        , y:c.peice_depth-c.inset_depth, z:c.inset+c.inset_pad }, { x:c.unit_length, y:c.peice_depth-c.inset_depth    , z:c.inset+c.inset_pad }
	, { x:0        , y:c.peice_depth-c.inset_depth, z:c.top_hbar_height- (c.inset+c.inset_pad) }, { x:c.unit_length, y:c.peice_depth-c.inset_depth, z:c.top_hbar_height +- (c.inset+c.inset_pad)  }
        ],
norms : [ { x:-0.2, y : 1, z: -0.2 }
	, { x:0.2, y : 1, z: -0.2 }
        , { x:-0.2, y : 1, z: 0.2 }
	, { x:0.2, y : 1, z: 0.2 }
        ],
pairs : [ [0,0], [1,1],[2,2],[3,3]
        ],
faces : [ [ 0, 2, 1 ], [2, 3, 1]
	],
scaledVert(n,scale) { let v = this.verts[n]; return { x:v.x*scale, y:v.y, z:v.z}; }
},


inset_label_offset : { x : c.inset+c.inset_pad/2, y:0, z:c.inset+c.inset_pad/2 },

inset_label:{
verts : [ { x:0        , y:c.peice_depth -c.inset_depth/2    , z:0 }, { x:c.unit_length, y:c.peice_depth-c.inset_depth/2    , z:0 }
	, { x:0        , y:c.peice_depth-c.inset_depth/2, z:c.top_hbar_height  - (c.inset+c.inset_pad)  }
	, { x:c.unit_length, y:c.peice_depth-c.inset_depth/2, z:c.top_hbar_height - (c.inset+c.inset_pad)  }
        ],
norms : [ { x:0, y : 1, z: -0.1 }
	, { x:0, y : 1, z: 0.1 }
        ],
pairs : [ [0,0], [1,0]
	, [2, 1], [3, 1]
        ],
faces : [ [ 0, 2,1 ], [2, 3, 1] ],
scaledVert(n,scale) { let v = this.verts[n]; return { x:v.x*scale, y:v.y, z:v.z}; }
}

}

function buildLeft() {
	shape.inset_left.verts = shape.inset_left_top.verts.slice(0);
	shape.inset_left.norms = shape.inset_left_top.norms.slice(0);
	shape.inset_left.pairs = shape.inset_left_top.pairs.slice(0);
	shape.inset_left.faces = shape.inset_left_top.faces.slice(0);
	shape.inset_left.scaledVert = shape.inset_left_top.scaledVert;

	var pair_vert_offset = shape.inset_left.verts.length;	
	var pair_norm_offset = shape.inset_left.norms.length;
	var face_pair_offset = shape.inset_left.pairs.length;

	for( var n = 0; n < shape.inset_left_fill.verts.length; n++ )
		shape.inset_left.verts.push( shape.inset_left_fill.verts[n] );
	for( var n = 0; n < shape.inset_left_fill.norms.length; n++ )
		shape.inset_left.norms.push( shape.inset_left_fill.norms[n] );

	for( var n = 0; n < shape.inset_left_fill.pairs.length; n++ ) {
		var pair = shape.inset_left_fill.pairs[n].slice(0);
		pair[0] += pair_vert_offset;
		pair[1] += pair_norm_offset;
		shape.inset_left.pairs.push( pair );
	}
	for( var n = 0; n < shape.inset_left_fill.faces.length; n++ ) {
		var face = shape.inset_left_fill.faces[n].slice(0);
		face[0] += face_pair_offset;
		face[1] += face_pair_offset;
		face[2] += face_pair_offset;
		shape.inset_left.faces.push( face );
	}
	var pair_vert_offset = shape.inset_left.verts.length;	
	var pair_norm_offset = shape.inset_left.norms.length;
	var face_pair_offset = shape.inset_left.pairs.length;

	for( var n = 0; n < shape.inset_left_top.verts.length; n++ ) {
		var vert = { x:shape.inset_left_top.verts[n].x, y:shape.inset_left_top.verts[n].y, z:shape.inset_left_top.verts[n].z }
		vert.z = c.top_hbar_height - vert.z;
		shape.inset_left.verts.push( vert );
	}
	for( var n = 0; n < shape.inset_left_top.norms.length; n++ ) {
		var norm = { x:shape.inset_left_top.norms[n].x, y:shape.inset_left_top.norms[n].y, z:shape.inset_left_top.norms[n].z }
		norm.z = -norm.z;
		shape.inset_left.norms.push( norm );
	}
	for( var n = 0; n < shape.inset_left_top.pairs.length; n++ ) {
		var pair = shape.inset_left_top.pairs[n].slice(0);
		pair[0] += pair_vert_offset;
		pair[1] += pair_norm_offset;
		shape.inset_left.pairs.push( pair );
	}
	for( var n = 0; n < shape.inset_left_top.faces.length; n++ ) {
		var face = shape.inset_left_top.faces[n].slice(0);
		
		let t = face[1];
		face[1] = face[2];
		face[2] = t;

		face[0] += face_pair_offset;
		face[1] += face_pair_offset;
		face[2] += face_pair_offset;
		shape.inset_left.faces.push( face );
	}
}

function initRight() {
	let v = (shape.inset_right.verts = shape.inset_left.verts.slice(0));
	let i = 0;
	let n = (shape.inset_right.norms = shape.inset_left.norms.slice(0));
	let f = (shape.inset_right.faces = shape.inset_left.faces.slice(0));
	let p = ( shape.inset_right.pairs = shape.inset_left.pairs.slice(0));

	shape.inset_right.scaledVert = shape.inset_left_top.scaledVert;
	for( i = 0; i < v.length; i++ ) {
		v[i] = { x:(c.inset+c.inset_pad*2) - v[i].x, y:v[i].y, z:v[i].z };
	}
	for( i = 0; i < n.length; i++ ) {
		n[i] = { x:-n[i].x, y:n[i].y, z:n[i].z };
	}
	for( i = 0; i < p.length; i++ ) {
		p[i] = p[i].slice(0);
	}
	// since coordinates are flipped, face winding has to flip, flip 2 verts of each face
	for( i = 0; i < f.length; i++ ) {
		f[i] = f[i].slice(0);
		let t = f[i][1];
		f[i][1] = f[i][2];
		f[i][2] = t;
	}
}

buildLeft();
initRight();

c.normalizeNorms( shape );
//console.log( "inset:", JSON.stringify(shape,null,3) );

c.deepFreeze( shape );

module.exports = exports = shape;
