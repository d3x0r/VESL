

	var app = ["node_modules/three/build/three.js",'vesl.js','controls/orbit_controls.js','controls/NaturalCamera.js',"controls/gameMouse.js"]
	var start = 'windowLoaded();'
	function R(n) {
		var script = document.createElement( "script" );
		script.src = n;
		script.onload = 
		document.body.appendChild( script );
                return script;
	}
	function RIL(n) {
		var script = document.createElement( "script" );
		script.innerText = n;
		document.body.appendChild( script );
	}
	function addN( n ) {
		if( n < app.length ) {
                	let s = R(app[n]);
                	if( n == ( app.length-1 ) )
                        	s.onload = windowLoaded;
                        else
                        	s.onload = ()=>{ addN( n+1 ) };
                }
        }
	if( typeof require == 'undefined' ) {
		var script = document.createElement( "script" );
		script.src = "require.js";
		script.onload = ()=>{
			addN(0);
		}
		document.body.appendChild( script );
	}
	else {
		addN(0);
	}
