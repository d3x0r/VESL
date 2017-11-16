
const c = require( "./consts.js" );

const swell_x_offset = (  ((c.htab_base_width-c.htab_tip_width)/2) /c.htab_height) * c.swell_pad;
const swell_y_offset = ( ((c.vtab_base_width-c.vtab_tip_width)/2)/ (c.vtab_width) ) * c.swell_pad;

const shape = {
horiz_tab : {
verts : [ { x:0, y:c.peice_depth, z:0 }, { x:(c.htab_width/2)-c.htab_base_width/2, y : c.peice_depth, z:0 } // 0-1
	, { x:c.htab_width/2, y:c.peice_depth, z:0}  // 2; unused; but kept because numbers were calculated from this
        , { x:(c.htab_width/2)+c.htab_base_width/2, y:c.peice_depth,z:0} //3
	, {x:c.htab_width,y:c.peice_depth,z:0} //4

	, { x:c.htab_width/2 - c.htab_tip_width/2,y:c.peice_depth,z:c.htab_height } //5
	, { x:c.htab_width/2 + c.htab_tip_width/2,y:c.peice_depth,z:c.htab_height } //6


	, { x:0,y:(c.peice_depth*3/4),z:c.swell_pad} // 7
	, { x: c.htab_width/2 - (c.htab_base_width/2 + swell_x_offset), y:c.peice_depth*3/4, z:c.swell_pad }

	, { x: c.htab_width/2 - (c.htab_tip_width/2 + swell_x_offset), y:c.peice_depth*3/4, z:c.swell_pad+c.htab_height }
	, { x: c.htab_width/2 + c.htab_tip_width/2 + swell_x_offset, y:c.peice_depth*3/4, z:c.swell_pad+c.htab_height }

	, { x: c.htab_width/2 + c.htab_base_width/2 + swell_x_offset, y:c.peice_depth*3/4, z:c.swell_pad }
	, { x:c.htab_width,y:(c.peice_depth*3/4),z:c.swell_pad} //12


	, { x:0,y:(c.peice_depth*1/4),z:c.swell_pad}
	, { x: c.htab_width/2 - (c.htab_base_width/2 + swell_x_offset), y:c.peice_depth*1/4, z:c.swell_pad }

	, { x: c.htab_width/2 - (c.htab_tip_width/2 + swell_x_offset), y:c.peice_depth*1/4, z:c.swell_pad +c.htab_height }
	, { x: c.htab_width/2 + c.htab_tip_width/2 + swell_x_offset, y:c.peice_depth*1/4, z:c.swell_pad +c.htab_height }

	, { x: c.htab_width/2 + c.htab_base_width/2 + swell_x_offset, y:c.peice_depth*1/4, z:c.swell_pad }
	, { x:c.htab_width,y:(c.peice_depth*1/4),z:c.swell_pad} //18

	
	, { x:c.htab_width/2 - c.htab_tip_width/2,y:0,z:c.htab_height } //19
	, { x:c.htab_width/2 + c.htab_tip_width/2,y:0,z:c.htab_height } //20

        , { x:0, y:0, z:0 }
	, { x:(c.htab_width/2)-c.htab_base_width/2, y : 0, z:0 }
	, { x:c.htab_width/2, y:0, z:0}
	, { x:(c.htab_width/2)+c.htab_base_width/2, y:0,z:0}
	, {x:c.htab_width,y:0,z:0} //25


        ],
norms : [ { x:0, y : 1, z: 0.2 }, { x:-0.1, y : 1, z: 0.2 }, { x:-0.2, y : 1, z: 0.2 }, { x:0.2, y : 1, z:0.2 }, { x:0.1, y : 1, z: 0.2 }
	, { x:0, y : 1, z: -0.2 }
	, { x:0.1, y : 1, z: -0.2 }
	, { x:-0.1, y : 1, z: -0.2 }
	, { x:0.1, y: 1, z:-0.2 } // 8
	, { x:-0.1, y:1, z:-0.2 } // 9

	, { x:0, y:0, z:1 } // 10
	, { x:-0.1, y:0, z:1 } // 11
	, { x:-0.4, y:0, z:1 } //12
	, { x:0.4, y:0, z:1 }  //13
	, { x:0.1, y:0, z:1 }  //14
	
	, { x: 0,y:-1,z:0.2}, {x:-0.1, y:-1, z:0.2}, {x:-0.2,y:-1,z:0.2}, {x:0.2, y:-1, z:0.2}, {x:0.1, y:-1, z:0.2} // 15-19
	, { x: 0,y:-1,z:0} //20


        ],
pairs : [ [2,5],[5,6],[6,7],[1,8],[3,9] // 0-4
	, [0,0],[1,1],[5,2],[6,3],[3,4],[4,0] //5-10
	, [7,10],[8,11],[9,12],[10,13],[11,14],[12,10] // 11-16
	, [13,10],[14,11],[15,12],[16,13],[17,14],[18,10] // 17-22
	, [21,15],[22,16],[19,17],[20,18],[24,19],[25,15] // 23-28
	, [19,20],[20,20],[22,20],[23,20],[24,20] // 29-33

        ],
faces : [ [0,1,2], [3,1,0],[0,2,4]
	, [5,11,6],[11,12,6],[6,12,13],[6,13,7],[7,13,14],[7,14,8],[8,14,15],[8,15,9],[9,15,16],[9,16,10]
	, [11,17,12],[17,18,12],[12,18,19],[12,19,13],[13,19,20],[13,20,14],[14,20,21],[14,21,15],[15,21,22],[15,22,16]
	, [17,23,24],[17,24,18],[18,24,25],[18,25,19],[19,25,26],[19,26,20],[20,26,27],[20,27,21],[21,27,28],[21,28,22]
	, [29,31,32],[29,32,30],[30,32,33]
	],
scaledVert(n,scale) { return this.verts[n]; }
},

horiz_slot : {
verts : [ { x: 0, y:c.peice_depth, z: c.htab_height+c.swell_pad }
	, { x: ( c.htab_width/2-c.htab_tip_width/2 ) - (2*swell_x_offset),  y:c.peice_depth, z: c.htab_height+c.swell_pad }
        , { x: c.htab_width/2, y:c.peice_depth, z:c.htab_height+c.swell_pad}
	, { x: ( c.htab_width/2+c.htab_tip_width/2 ) + (2*swell_x_offset),  y:c.peice_depth, z: c.htab_height+c.swell_pad }
        , { x: c.htab_width, y:c.peice_depth, z: c.htab_height+c.swell_pad }

	// 5-8
	, { x:0, y:c.peice_depth, z:c.swell_pad }
	, { x:c.htab_width/2-c.htab_base_width/2 - 2*swell_x_offset, y:c.peice_depth, z:c.swell_pad }
	, { x:c.htab_width/2+c.htab_base_width/2 + 2*swell_x_offset, y:c.peice_depth, z:c.swell_pad }
	, { x:c.htab_width, y:c.peice_depth, z:c.swell_pad }

	// 9-14
	, { x:0, y:c.peice_depth*3/4, z:0 }
	, { x:c.htab_width/2-c.htab_base_width/2 - swell_x_offset, y:c.peice_depth*3/4, z:0 }
	, { x:c.htab_width/2-c.htab_tip_width/2  - swell_x_offset, y:c.peice_depth*3/4, z:c.htab_height }
	, { x:c.htab_width/2+c.htab_tip_width/2  + swell_x_offset, y:c.peice_depth*3/4, z:c.htab_height }
	, { x:c.htab_width/2+c.htab_base_width/2 + swell_x_offset, y:c.peice_depth*3/4, z:0 }
	, { x:c.htab_width, y:c.peice_depth*3/4, z:0 }

	// 15-20
	, { x:0, y:c.peice_depth*1/4, z:0 }
	, { x:c.htab_width/2-c.htab_base_width/2 - swell_x_offset, y:c.peice_depth*1/4, z:0 }
	, { x:c.htab_width/2-c.htab_tip_width/2  - swell_x_offset, y:c.peice_depth*1/4, z:c.htab_height }
	, { x:c.htab_width/2+c.htab_tip_width/2  + swell_x_offset, y:c.peice_depth*1/4, z:c.htab_height } 
	, { x:c.htab_width/2+c.htab_base_width/2 + swell_x_offset, y:c.peice_depth*1/4, z:0 }
	, { x:c.htab_width, y:c.peice_depth*1/4, z:0 }

	// 21-24
	, { x:0, y:0, z:c.swell_pad }
	, { x:c.htab_width/2-c.htab_base_width/2 - 2*swell_x_offset, y:0, z:c.swell_pad }
	, { x:c.htab_width/2+c.htab_base_width/2 + 2*swell_x_offset, y:0, z:c.swell_pad }
	, { x:c.htab_width, y:0, z:c.swell_pad }
	
	// 25-28
	, { x: 0, y:0, z: c.htab_height+c.swell_pad }
	, { x: ( c.htab_width/2-c.htab_tip_width/2 ) - (2*swell_x_offset),  y:0, z: c.htab_height+c.swell_pad }
	, { x: ( c.htab_width/2+c.htab_tip_width/2 ) + (2*swell_x_offset),  y:0, z: c.htab_height+c.swell_pad }
        , { x: c.htab_width, y:0, z: c.htab_height+c.swell_pad }
	],
norms : [ { x : 0, y:1,z:0.1}
	, { x:0,y:1,z:-0.2 }, { x : 0.1, y:1, z:-0.2 }, { x:0.3,y:1, z:-0.2}, { x:-0.3,y:1,z:-0.2}, {x:-0.1,y:1,z:-0.2}
	// 5-9
	, { x:0, y:0, z:-1 }, { x: 0.1, y:0, z:-1}, { x:0.4, y:0, z:-0.5 }, { x:-0.4, y:0, z:-0.5 }, { x:-0.1, y:0, z:-1 }
	// 10-14
	, { x:0,y:-1,z:-0.2 }, { x : 0.1, y:-1, z:-0.2 }, { x:0.3,y:-1, z:-0.2}, { x:-0.3,y:-1,z:-0.2}, {x:-0.1,y:-1,z:-0.2}
	// 15
        , { x:0, y:-1,z:0 }
	
	
	],
pairs : [ [0,0],[1,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0] // 0-7
	, [9,5],[10,6],[11,7],[12,8],[13,9],[14,5]   // 8-13
	, [15,5],[16,6],[17,7],[18,8],[19,9],[20,5] //14-19
	, [21,10],[22,11],[26,12],[27,13],[23,14],[24,10] // 20-25
	, [21,15],[22,15],[23,15],[24,15],[25,15],[26,15],[27,15],[28,15] // 26-33
	],
faces : [ 
	  [4,0,5],[5,0,1],[6,2,3],[6,3,7]
	, [8,4,9],[4,5,9],[9,5,1],[1,10,9],[10,1,2],[10,2,11],[11,2,6],[11,6,12],[12,6,7],[12,7,13]
	, [ 14,8,9],[14,9,15],[15,9,10],[15,10,16],[16,10,11],[16,11,17],[17,11,12],[17,12,18],[18,12,13],[18,13,19]
	, [20,14,15],[20,15,21],[21,15,16],[21,16,22],[22,16,17],[22,17,23],[23,17,18],[23,18,24],[24,18,19],[24,19,25]
	, [30,26,27],[30,27,31],[32,28,33],[33,28,29]
	],
scaledVert(n,scale) { return this.verts[n]; }
},

vert_tab : {
verts : [ { z:0, y:c.peice_depth, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:(c.vtab_height/2)-c.vtab_base_width/2, y : c.peice_depth, x:(c.vtab_width+c.swell_pad)-0 } // 0-1
	, { z:c.vtab_height/2, y:c.peice_depth, x:(c.vtab_width+c.swell_pad)-0} // unused; but kept because numbers were calculated from this
        , { z:(c.vtab_height/2)+c.vtab_base_width/2, y:c.peice_depth,x:(c.vtab_width+c.swell_pad)-0} //3
	, { z:c.vtab_height,y:c.peice_depth,x:(c.vtab_width+c.swell_pad)-0} //4

	, { z:c.vtab_height/2 - c.vtab_tip_width/2,y:c.peice_depth,x:(c.vtab_width+c.swell_pad)-c.vtab_width } //5
	, { z:c.vtab_height/2 + c.vtab_tip_width/2,y:c.peice_depth,x:(c.vtab_width+c.swell_pad)-c.vtab_width } //6

	, { z:0,y:(c.peice_depth*3/4),x:(c.vtab_width+c.swell_pad)-c.swell_pad} // 7
	, { z: c.vtab_height/2 - c.vtab_base_width/2 - swell_y_offset, y:c.peice_depth*3/4, x:(c.vtab_width+c.swell_pad)-c.swell_pad } //8

	, { z: c.vtab_height/2 - c.vtab_tip_width/2 - swell_y_offset, y:c.peice_depth*3/4, x:0 }
	, { z: c.vtab_height/2 + c.vtab_tip_width/2 + swell_y_offset, y:c.peice_depth*3/4, x:0 }

	, { z: c.vtab_height/2 + c.vtab_base_width/2 + swell_y_offset, y:c.peice_depth*3/4, x:(c.vtab_width+c.swell_pad)-c.swell_pad }
	, { z:c.vtab_height,y:(c.peice_depth*3/4),x:(c.vtab_width+c.swell_pad)-c.swell_pad} //12


	, { z:0,y:(c.peice_depth*1/4),x:(c.vtab_width+c.swell_pad)-c.swell_pad}
	, { z: c.vtab_height/2 - c.vtab_base_width/2 - swell_y_offset, y:c.peice_depth*1/4, x:(c.vtab_width+c.swell_pad)-c.swell_pad }

	, { z: c.vtab_height/2 - c.vtab_tip_width/2 - swell_y_offset, y:c.peice_depth*1/4, x:0 }
	, { z: c.vtab_height/2 + c.vtab_tip_width/2 + swell_y_offset, y:c.peice_depth*1/4, x:0 }

	, { z: c.vtab_height/2 + c.vtab_base_width/2 + swell_y_offset, y:c.peice_depth*1/4, x:(c.vtab_width+c.swell_pad)-c.swell_pad }
	, { z:c.vtab_height,y:(c.peice_depth*1/4),x:(c.vtab_width+c.swell_pad)-c.swell_pad} //18

	
	, { z:c.vtab_height/2 - c.vtab_tip_width/2,y:0,x:(c.vtab_width+c.swell_pad)-c.vtab_width } //19
	, { z:c.vtab_height/2 + c.vtab_tip_width/2,y:0,x:(c.vtab_width+c.swell_pad)-c.vtab_width } //20

        , { z:0, y:0, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:(c.vtab_height/2)-c.vtab_base_width/2, y : 0, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height/2, y:0, x:(c.vtab_width+c.swell_pad)-0}
	, { z:(c.vtab_height/2)+c.vtab_base_width/2, y:0,x:(c.vtab_width+c.swell_pad)-0}
	, { z:c.vtab_height,y:0,x:(c.vtab_width+c.swell_pad)-0} //25


        ],
norms : [ { z:0, y : 1, x: 0 }, { z:-0.1, y : 1, x: -0.2 }, { z:-0.2, y : 1, x: -0.2 }, { z:0.2, y : 1, x:-0.2 }, { z:0.1, y : 1, x: -0.2 }
	, { z:0, y : 1, x: -0.2 }
	, { z:0.1, y : 1, x: -0.2 }
	, { z:-0.1, y : 1, x: -0.2 }
	, { z:0.1, y: 1, x:-0.2 } // 8
	, { z:-0.1, y:1, x:-0.2 } // 9

	, { z:0, y:0, x:-1 } // 10
	, { z:-0.1, y:0, x:-1 } // 11
	, { z:-0.4, y:0, x:-1 } //12
	, { z:0.4, y:0, x:-1 }  //13
	, { z:0.1, y:0, x:-1 }  //14
	
	, { z: 0,y:-1,x:-0.2}, {z:-0.1, y:-1, x:-0.2}, {z:-0.2,y:-1,x:-0.2}, {z:0.2, y:-1, x:-0.2}, {z:0.1, y:-1, x:-0.2} // 15-19
	, { z: 0,y:-1,x:0} //20


        ],
pairs : [ 
	  [2,5],[5,6],[6,7],[1,8],[3,9] // 0-4
	, [0,0],[1,1],[5,2],[6,3],[3,4],[4,0] //5-10
	, [7,10],[8,11],[9,12],[10,13],[11,14],[12,10] // 11-16
	, [13,10],[14,11],[15,12],[16,13],[17,14],[18,10] // 17-22
	, [21,15],[22,16],[19,17],[20,18],[24,19],[25,15] // 23-28
	, [19,20],[20,20],[22,20],[23,20],[24,20] // 29-33

        ],
faces : [ [0,1,2], [3,1,0],[0,2,4]
	, [5,11,6],[11,12,6],[6,12,13],[6,13,7],[7,13,14],[7,14,8],[8,14,15],[8,15,9],[9,15,16],[9,16,10]
	, [11,17,12],[17,18,12],[12,18,19],[12,19,13],[13,19,20],[13,20,14],[14,20,21],[14,21,15],[15,21,22],[15,22,16]
	, [17,23,24],[17,24,18],[18,24,25],[18,25,19],[19,25,26],[19,26,20],[20,26,27],[20,27,21],[21,27,28],[21,28,22]
	, [29,31,32],[29,32,30],[30,32,33]
	],
scaledVert(n,scale) { return this.verts[n]; }
},

vert_slot : {
verts : [ { z: 0, y:c.peice_depth, x:0 }
	, { z: ( c.vtab_height/2-c.vtab_tip_width/2 ) - (2*swell_y_offset),  y:c.peice_depth, x:0 }
        , { z: c.vtab_height/2, y:c.peice_depth, x:0}
	, { z: ( c.vtab_height/2+c.vtab_tip_width/2 ) + (2*swell_y_offset),  y:c.peice_depth, x:0 }
        , { z: c.vtab_height, y:c.peice_depth, x:0 }

	// 5-8
	, { z:0, y:c.peice_depth, x:c.vtab_width }
	, { z:c.vtab_height/2-(c.vtab_base_width/2 + 2*swell_y_offset), y:c.peice_depth, x:c.vtab_width }
	, { z:c.vtab_height/2+c.vtab_base_width/2 + 2*swell_y_offset, y:c.peice_depth, x:c.vtab_width }
	, { z:c.vtab_height, y:c.peice_depth, x:c.vtab_width }

	// 9-14
	, { z:0, y:c.peice_depth*3/4, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height/2-(c.vtab_base_width/2 + swell_y_offset), y:c.peice_depth*3/4, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height/2-(c.vtab_tip_width/2  + swell_y_offset), y:c.peice_depth*3/4, x:c.swell_pad }
	, { z:c.vtab_height/2+c.vtab_tip_width/2  + swell_y_offset, y:c.peice_depth*3/4, x:c.swell_pad } 
	, { z:c.vtab_height/2+c.vtab_base_width/2 + swell_y_offset, y:c.peice_depth*3/4, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height, y:c.peice_depth*3/4, x:(c.vtab_width+c.swell_pad)-0 }

	// 15-20
	, { z:0, y:c.peice_depth*1/4, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height/2-(c.vtab_base_width/2 + swell_y_offset), y:c.peice_depth*1/4, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height/2-(c.vtab_tip_width/2  + swell_y_offset), y:c.peice_depth*1/4, x:c.swell_pad }
	, { z:c.vtab_height/2+c.vtab_tip_width/2  + swell_y_offset, y:c.peice_depth*1/4, x:c.swell_pad }
	, { z:c.vtab_height/2+c.vtab_base_width/2 + swell_y_offset, y:c.peice_depth*1/4, x:(c.vtab_width+c.swell_pad)-0 }
	, { z:c.vtab_height, y:c.peice_depth*1/4, x:(c.vtab_width+c.swell_pad)-0 }

	// 21-24
	, { z:0, y:0, x:c.vtab_width }
	, { z:c.vtab_height/2-(c.vtab_base_width/2 + 2*swell_y_offset), y:0, x:c.vtab_width }
	, { z:c.vtab_height/2+c.vtab_base_width/2 + 2*swell_y_offset, y:0, x:c.vtab_width }
	, { z:c.vtab_height, y:0, x:c.vtab_width }
	
	// 25-28
	, { z: 0, y:0, x:0 }
	, { z: ( c.vtab_height/2-c.vtab_tip_width/2 ) - (2*swell_y_offset),  y:0, x:0 }
	, { z: ( c.vtab_height/2+c.vtab_tip_width/2 ) + (2*swell_y_offset),  y:0, x:0 }
        , { z: c.vtab_height, y:0, x:0 }
	],
norms : [ { z: 0, y:1,x:0}
	, { z:0,y:1,x:0.2 }, { z: -0.1, y:1, x:0.2 }, { z:-0.3,y:1, x:0.2}, { z:0.3,y:1,x:0.2}, {z:0.1,y:1,x:0.2}
	// 5-9
	, { z:0, y:0, x:1 }, { z: -0.1, y:0, x:1}, { z:-0.4, y:0, x:0.5 }, { z:0.4, y:0, x:0.5 }, { z:0.1, y:0, x:1 }
	// 10-14
	, { z:0,y:-1,x:0.2 }, { z: -0.1, y:-1, x:0.2 }, { z:-0.3,y:-1, x:0.2}, { z:0.3,y:-1,x:0.2}, {z:0.1,y:-1,x:0.2}
	// 15
        , { z:0, y:-1,x:0 }
	
	
	],
pairs : [ [0,0],[1,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0] // 0-7
	, [9,5],[10,6],[11,7],[12,8],[13,9],[14,5]   // 8-13
	, [15,5],[16,6],[17,7],[18,8],[19,9],[20,5] //14-19
	, [21,10],[22,11],[26,12],[27,13],[23,14],[24,10] // 20-25
	, [21,15],[22,15],[23,15],[24,15],[25,15],[26,15],[27,15],[28,15] // 26-33
	],
faces : [ 
	  [4,0,5],[5,0,1],[6,2,3],[6,3,7]
	,[8,4,9],[4,5,9]
,[9,5,1],[1,10,9],[10,1,2],[10,2,11],[11,2,6],[11,6,12],[12,6,7],[12,7,13]
	, [ 14,8,9],[14,9,15],[15,9,10],[15,10,16],[16,10,11],[16,11,17],[17,11,12],[17,12,18],[18,12,13],[18,13,19]
	, [20,14,15],[20,15,21]
,[21,15,16],[21,16,22],[22,16,17],[22,17,23],[23,17,18],[23,18,24],[24,18,19],[24,19,25]
, [30,26,27],[30,27,31],[32,28,33],[33,28,29]
	],
scaledVert(n,scale) { return this.verts[n]; }
},

}

function swapVertFaces() {
	// because the vertical versions were auto-replaced from horizontals, and then mirrored left-to-right need to reverse faces
        var faces = shape.vert_tab.faces;
        var n;
        //for( n = 0; n < faces.length; n++ ) {
      //  	let t = faces[n][1];
       //         faces[n][1] = faces[n][2];
       //         faces[n][2] = t;
       // }
        var faces = shape.vert_slot.faces;
      //  for( n = 0; n < faces.length; n++ ) {
      //  	let t = faces[n][1];
      //          faces[n][1] = faces[n][2];
      //          faces[n][2] = t;
      //  }
}

swapVertFaces();

/* run init code to setup shape */
c.normalizeNorms( shape );
c.deepFreeze( shape );
module.exports = exports = shape;
