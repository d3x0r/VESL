
import {popups} from "./popups.mjs";
import {JSOX} from "./jsox.mjs";

var tools = popups.create( "Tools" );
var code = popups.create( "Code" );
code.divFrame.style.minWidth = 640;
code.divFrame.style.minHeight = 480;

			code.divContent.addEventListener( "dragover", (evt)=>{
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "move";
				//console.log( "Dragover:", evt.dataTransfer.getData( "text/plain" ), evt );
			})
			code.divContent.addEventListener( "drop", (evt)=>{
				evt.preventDefault();
				var objType = evt.dataTransfer.getData( "text/plain" );
				JSOX.begin( (event)=>{
                                	console.log("Got event:", event );
					if( "Instruction" === event.type ){
						//console.log( "drop of:", evt.dataTransfer.getData( "text/plain" ) );
						//cbDrop( accruals.all.get( event.val1 ) );
					}
				} ).write( objType );
			})




var codeList = popups.list( { parentItem:null, parent:code.divContent }, (m)=>JSON.stringify(m) );
//codeList.enableDrop( "Instruction", {}, (item)=>{
//	console.log( "Dropped?", item );
//} );
var toolList = popups.list( { parentItem:null, parent:tools.divContent }, (m)=>JSON.stringify(m) );

var op;
var addItem = toolList.push( op = {name:"Add", op:"+" }, (m)=>JSON.stringify(m) );
toolList.enableDrag( "Instruction", addItem, "name" );
toolList.enableOpen(addItem);




function makePeice( parent, opts ) {
	opts = opts || {
		left:-1,
		right:1,
		top:-1,
		bottom:1
		};


	var p = {
		container : document.createElement( "div" ),
		container2 : document.createElement( "div" ),
		leftTab : document.createElement( "div" ),
		middleStack : document.createElement( "div" ),
		middleStackTable : document.createElement( "div" ),
		topTab : document.createElement( "div" ),
		innerTab : document.createElement( "div" ),
		bottomTab : document.createElement( "div" ),
		rightTab : document.createElement( "div" )
	}	

	p.container.style.left = 0;
	p.container.style.top  = 0;

	p.container.className  = "veslTokenBlock";
	p.container2.className = "veslTokenRow";
	p.leftTab.className    = opts.left<0   ?"veslTokenLeftOut":opts.left>0    ?"veslTokenLeftIn":"veslTokenLeftStop";
	p.middleStack.className = "veslTokenMiddleStack";
	p.middleStackTable.className = "veslTokenMiddleStackTable";
	p.topTab.className     = opts.top<0    ?"veslTokenTopOut":opts.top>0      ?"veslTokenTopIn":"veslTokenTopStop";
	p.innerTab.className   = "veslTokenMiddle";
	p.bottomTab.className  = opts.bottom<0 ?"veslTokenBottomOut":opts.bottom>0?"veslTokenBottomIn":"veslTokenBottomStop";
	p.rightTab.className   = opts.right<0  ?"veslTokenRightOut":opts.right>0  ?"veslTokenRightIn":"veslTokenRightStop";

	p.innerTab.textContent = "Token";

	p.container.appendChild( p.container2 );
	p.container2.appendChild( p.leftTab );
	p.middleStack.appendChild( p.middleStackTable );
	p.middleStackTable.appendChild( p.topTab );
	p.middleStackTable.appendChild( p.innerTab );
	p.middleStackTable.appendChild( p.bottomTab );
	p.container2.appendChild( p.middleStack );
	p.container2.appendChild( p.rightTab );

	var drag = 0; 
	var dragPos = null;
	function md(evt){
		evt.preventDefault();
		drag = true;
		var pRect = p.container.getBoundingClientRect();
		dragPos = {x:evt.x-pRect.left, y:evt.y-pRect.top};
		p.container.setPointerCapture( evt.pointerId );
		p.container.style.pointerEvents = "auto";
		
		function mu(evt){
			evt.preventDefault();
			drag = false;
			p.container.setPointerCapture( evt.pointerId );
			p.container.removeEventListener( "pointerup", mu );
			p.container.removeEventListener( "pointermove", mm );
			p.container.addEventListener( "pointerdown", md );
			console.log( "Got a mouse up - clear drag" );
		}
		function mm(evt){
			if( drag ) {
				evt.preventDefault();
	        
					var pRect = p.container.getBoundingClientRect();
					var x = evt.x - pRect.left;
					var y = evt.y - pRect.top;
				console.log( "Drag event:", x, y );
					p.container.style.left =parseInt(p.container.style.left) + (x-dragPos.x);
					p.container.style.top= parseInt(p.container.style.top) +(y-dragPos.y);
	        
	        
			} else {
				quickDelegate( evt, p.container );
				console.log( "No Drag?" );
			}
		}

		p.container.addEventListener( "pointerup", mu );
		p.container.addEventListener( "pointermove", mm );
		p.container.removeEventListener( "pointerdown", md );
	}
	p.container.addEventListener( "pointerdown", md );


	parent.appendChild( p.container );
	return p;
}


function makePeice2( parent ) {

	var p = makePeice( parent, {left:1,right:-1,top:0,bottom:0} );
	p.container.style.top = "40";
	return p;
}


function makePeice3( parent ) {

	var p = makePeice( parent, {left:1,right:-1,top:0,bottom:0} );

	p.container.style.top = "40";
	p.container.style.left = "142";

	return p;
}

makePeice( code.divContent );
makePeice2( code.divContent );
makePeice3( code.divContent );
