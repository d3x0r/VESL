

const shape = {
	wand: {
		verts : [ { x:0        , y:0.375  , z:-1  }
			, { x:0.375    , y:0      , z:-1  }
			, { x:0        , y:-0.375 , z:-1  }
			, { x:-0.375   , y:0      , z:-1   }
		        , { x:0        , y:0.175  , z:6  }
			, { x:0.175    , y:0      , z:6  }
			, { x:0        , y:-0.175 , z:6  }
			, { x:-0.175   , y:0      , z:6   }
		        ],
		norms : [ { x:0, y : 0, z: 1}
			, { x:1, y : 0, z: 0 }
			, { x:0, y : 0, z: -1 }
			, { x:-1, y : 0, z: 0 }
		        ],
		pairs : [ [0,0], [1,1]
			, [2, 2], [3, 3]
			, [4,0], [5,1]
			, [6,2], [7,3]
                	],
		faces : [ [ 3, 1,0 ], [3, 2, 1], [7,4,5],[5,6,7], 
                	, [ 0,1,4],[1,5,4]
                        , [1,2,5],[2,6,5]
                        , [2,3,6],[3,7,6]
                        , [3,0,7],[1,4,7]
                        ],
		scaledVert(n,scale) { let v = this.verts[n];
			return { x: v.x * scale, y:v.y, z:v.z };
		}

	}
}

function initWands() {
	var n;
        var inch2meter = 2.54/100;
        for( n = 0; v < shape.wand.verts; v++ ) {
        	shape.wand.verts[n].x *= inch2meter;
        	shape.wand.verts[n].y *= inch2meter;
        	shape.wand.verts[n].z *= inch2meter;
        }
}


c.normalizeNorms( shape );
c.deepFreeze( shape );

module.exports = exports = shape;
