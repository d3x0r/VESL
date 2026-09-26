
/*

<svg id="main" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1" 
    width="1020"
    height="620" 
    viewBox="0 0 1020 620"
    onload="startup(evt)">

<script>
    <![CDATA[
        var startup = function (evt) {
            var width;
            var svgNS = "http://www.w3.org/2000/svg";
            var txtNode = document.createTextNode("Hello");
            text = document.createElementNS(svgNS,"text");

            text.setAttributeNS(null,"x",100);
            text.setAttributeNS(null,"y",100);
            text.setAttributeNS(null,"fill","black");
            text.appendChild(txtNode);                                              
            width = text.getComputedTextLength();               
            alert(" Width before appendChild: "+  width);                       
            document.getElementById("main").appendChild(text);
            width = text.getComputedTextLength();
            alert(" Width after appendChild: "+  width)
            document.getElementById("main").removeChild(text);              
        }       
    //]]>
</script>
</svg>

*/





const topTab = {
	tabDepth : 1,
	tabTotalWidth : 5,
	tabSidePad : 1,
	tabSlope : 1,
	tabWidth : 0,
};
topTab.tabWidth = topTab.tabTotalWidth - 2*topTab.tabSlope - 2*topTab.tabSidePad;

const sideTab = {
	tabDepth : 1,
	tabTotalWidth : 6,
	tabSidePad : 2,
	tabSlope : 1,
	tabWidth : 0 
}
sideTab.tabWidth = sideTab.tabTotalWidth - 2*sideTab.tabSlope - 2*sideTab.tabSidePad;

const exprHeight = 6;

const indentDepth = 1;

const closeHeight = 1; // thickness of bottom containing bar (if there is one)

const segTypes = {
	topTab : 1,
        topBarTop : 2,
        rightTab : 3,
        topBarBottom : 4,
        topBarBottomTab : 5,
        indentRight : 6,
        closeTop : 7,
        closeRight : 8,
        closeBottom : 9,
        indentLeft : 10,
        leftTab : 11,

};


var containerOne = [ { type : segTypes.topTab }
                   , { type : segTypes.topBarTop, scale : 0 }
                   , { type : segTypes.rightTab }
                   , { type : segTypes.topBarBottom, scale : 0, shrink : 1 }
                   , { type : segTypes.topBarBottomTab }
                   , { type : segTypes.indentRight, scale : 1 } // vertical down.
                   , { type : segTypes.closeTop, scale : 0 }
                   , { type : segTypes.closeRight }
                   , { type : segTypes.closeBottom, scale : 0 }
                   , { type : segTypes.indentLeft, scale : 1 }
                   , { type : segTypes.leftTab }
                   ];

var simpleOperator = [ { type : segTypes.topBarTop }
                     , { type : segTypes.rightTab }
                     , { type : segTypes.topBarBottom }
                     , { type : segTypes.leftTab }
                     ]

var simpleOperator = [ { type : segTypes.topBarTop }
                     , { type : segTypes.rightTab }
                     , { type : segTypes.topBarBottom }
                     , { type : segTypes.leftTab }
                     ]

function traceShape( config, shape, scales ) {
    var path = { scalables:[],
                path:[ {x:0,y:0} ]
    };
    var x, y;

	shape.forEach( segment =>{
        	switch( segment.type ) {
                case segTypes.topTab :
                    x += topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                	x += topTab.tabSlope;
                    y -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                	x += topTab.tabSlope;
                    y -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    x += topTab.tabSlope;
                    y -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );
                	x += topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.topBarTop:
                    x += scales[segment.scale];
                    path.scalables.push( {start: path.length, end: 0 } );
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.rightTab:
                    y += topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                    y += topTab.tabSlope;
                    x -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    y += topTab.tabSlope;
                    x -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    y += topTab.tabSlope;
                    x -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );
                    y += topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.topBarBottom:
                    x -= scales[segment.scale];
	        	    path.push( {x:x,y:y} );
                    path.scalables[ path.scalables.length-1].end = ( path.length );
                    break;

                case segTypes.topBarBottomTab :
                	x -= topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                	x -= topTab.tabSlope;
                    y -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                	x -= topTab.tabSlope;
                    y -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    x -= topTab.tabSlope;
                    y -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    x -= topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.indenRight:
                    y += topTab.closeHeight;
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.closeTop:
                    x += scales[segment.scale];
                    path.scalables.push( {start: path.length, end: 0 } );
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.closeRight:
                    y += topTab.closeHeight;
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.closeBottom:
                    x -= scales[segment.scale];
	        	    path.push( {x:x,y:y} );
                    path.scalables[ path.scalables.length-1].end = ( path.length );
                    break;

                case segTypes.indenteft:
                    y -= topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                    break;

                case segTypes.leftTab:
                    y += topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );
                    y += topTab.tabSlope;
                    x -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    y += topTab.tabSlope;
                    x -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    y += topTab.tabSlope;
                    x -= topTab.tabDepth;
	        	    path.push( {x:x,y:y} );

                    y += topTab.tabSidePad;
	        	    path.push( {x:x,y:y} );

                    break;
            }
        } );
}


traceShape( containerOne, [ 6, 3] )