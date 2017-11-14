
const consts = require( "./shapes/consts" );

module.exports = exports = {
	createNode( keyword ) {
        	return createNode( null, keyword );
        }
};

function createNode( parent, keyword ) {
	return { keyword:keyword 
        	, name : consts.keywords.nameOf( keyword )
                , input : null
                , output : null
                , child : null
                , next : null
        	, parent: parent
                , createNode : createNode
                , addNode : addNode
                , replace : replaceKeyword
                };
}

function addNode(keyword ) {
	
}

function replaceKeyword( keyword ) {
	var kw = consts.keywords.nameOf( keyword );
        if( this.name == 'if' )
        	return;
        
}
