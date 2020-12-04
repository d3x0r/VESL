/*

stle classes
    frameContainer - the outer frame
    frameCaption - the top caption of the frame
    frameContent - the container of the frame's future content.
    frameClose - style of the upper close Item.
    captionButton - this is a button appearin in the caption (close)
    

var popup = popups.create( "caption" );
popup.show();
popup.hide();
popup.caption = "New Caption";
popup.divContent  // insert frame content here

*/


const popups = {
	defaultDrag : true,
	autoRaise : true,
	create : createPopup,
	simpleForm : createSimpleForm,
	simpleNotice : createSimpleNotice,
        list : createList,
        makeCheckbox : makeCheckbox,
        makeNameInput : makeNameInput,
        makeTextInput : makeTextInput,
        makeTextField : makeTextField,
        makeButton : makeButton,
	setClass: setClass,
	toggleClass: toggleClass,
	clearClass:clearClass,
}

var popupTracker;

function addCaptionHandler( c, popup_ ) {
	var popup = popup_;
	if( !popup )
	 	popup = createPopup( null, c );


	var mouseState = {
		frame:popup.divFrame,
		x:0,y:0,
		dragging:false
	};
	if( popups.autoRaise )
	popup_.divFrame.addEventListener( "mousedown", (evt)=>{
		popupTracker.raise( popup );
	} );

	function mouseHandler(c,state) {
		
		var added = false;
		function mm(evt){
			evt.preventDefault();
			if( state.dragging ) {
				var pRect = state.frame.getBoundingClientRect();
				//var x = evt.clientX - pRect.left;
				//var y = evt.clientY - pRect.top;
				var x = evt.x - pRect.left;
				var y = evt.y - pRect.top;
				state.frame.style.left =parseInt(state.frame.style.left) + (x-state.x);
				state.frame.style.top= parseInt(state.frame.style.top) +(y-state.y);
				if( state.frame.id ) {
					localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
					localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
				}
			}
		}
		function md(evt){
			evt.preventDefault();
			var pRect = state.frame.getBoundingClientRect();
			popupTracker.raise( popup );
			//state.x = evt.clientX-pRect.left;
			//state.y = evt.clientY-pRect.top;
			state.x = evt.x-pRect.left;
			state.y = evt.y-pRect.top;
			state.dragging = true;
			console.log( "Got down." );
			if( !added ) {	
				added = true;
				document.body.addEventListener( "mousemove", mm );
				document.body.addEventListener( "mouseup", mu );
			}
		}
		function mu(evt){
			evt.preventDefault();
			state.dragging = false;
			added = false;
			document.body.removeEventListener( "mousemove", mm );
			document.body.removeEventListener( "mouseup", mu );
		}

		c.addEventListener( "mousedown", md );
		c.addEventListener( "mouseup", mu );
		c.addEventListener( "mousemove", mm );

		c.addEventListener( "touchstart", (evt)=>{
			evt.preventDefault();
			var pRect = state.frame.getBoundingClientRect();
			popupTracker.raise( popup );
			//state.x = evt.clientX-pRect.left;
			//state.y = evt.clientY-pRect.top;
			state.x = evt.touches[0].clientX-pRect.left;
			state.y = evt.touches[0].clientY-pRect.top;
			state.dragging = true;
			
		})
		c.addEventListener( "touchmove", (evt)=>{
			evt.preventDefault();
			if( state.dragging ) {
				const points = evt.touches;
				var pRect = state.frame.getBoundingClientRect();
				var x = points[0].clientX - pRect.left;
				var y = points[0].clientY - pRect.top;
				state.frame.style.left =parseInt(state.frame.style.left) + (x-state.x);
				state.frame.style.top= parseInt(state.frame.style.top) +(y-state.y);
				if( state.frame.id ) {
					localStorage.setItem( state.frame.id + "/x", popup.divFrame.style.left );
					localStorage.setItem( state.frame.id + "/y", popup.divFrame.style.top );
				}
			}
			
		})
		c.addEventListener( "touchend", (evt)=>{
			evt.preventDefault();
			popupTracker.raise( popup );
			state.dragging = false;
			
		})

	}

	if( popups.defaultDrag ) {
		mouseHandler(c, mouseState );

		mouseHandler(popup_.divFrame, mouseState );
	}

}

function initPopupTracker() {

	var tracker = {
		popups : [],
		raise( popup ) {
			var top = tracker.popups.length;
			var n;
			var from = Number(popup.divFrame.style.zIndex);
			if( from === top ) return;

			for( n = 0; n < tracker.popups.length; n++ ) {
				if( n == popup.index )
					popup.divFrame.style.zIndex = top;
				else {
					var thisZ = Number(tracker.popups[n].divFrame.style.zIndex);
					if( thisZ > from )
						tracker.popups[n].divFrame.style.zIndex = Number(tracker.popups[n].divFrame.style.zIndex) - 1;
				}
			}
		},
		find( id ) {
			return this.popups.find( popup=>popup.divFrame.id === id );
		},
		addPopup(popup) {
			popup.index = tracker.popups.length;
			popup.divFrame.style.zIndex = popup.index+1;
			tracker.popups.push( popup );
			popup.raise = function() {
				tracker.raise( popup)
			}
		}
	}
	return tracker;
}
popupTracker = initPopupTracker();

class Popup {
	popupEvents = {
		close : [],
		show : [],
	};
	divFrame = document.createElement( "div" );
	divCaption = document.createElement( "div" );
        divContent = document.createElement( "div" );
        divClose = document.createElement( "div" );
	popup = this;

	constructor(caption_,parent) {
		this.divFrame.style.left= 0;
		this.divFrame.style.top= 0;
		this.divFrame.className = parent?"formContainer":"frameContainer";
		if( caption_ != "" )
			this.divFrame.appendChild( this.divCaption );
		this.divFrame.appendChild( this.divContent );
		this.divCaption.appendChild( this.divClose );

		this.divCaption.className = "frameCaption";
		this.divContent.className = "frameContent";
		this.divClose.className = "captionButton";
        	popupTracker.addPopup( this );
                this.caption = caption_;
                parent = (parent&&parent.divContent) || document.body;
		parent.appendChild( this.divFrame );

		addCaptionHandler( this.divCaption, this );
        }
		set caption(val) {
			this.divCaption.innerText = val;
		}
		center() {
			var myRect = this.divFrame.getBoundingClientRect();
			var pageRect = this.divFrame.parentElement.getBoundingClientRect();
			this.divFrame.style.left = (pageRect.width-myRect.width)/2;
			this.divFrame.style.top = (pageRect.height-myRect.height)/2;
		}
		over( e ){
			var target = e.getBoundingClientRect();
			this.divFrame.style.left = target.left;
			this.divFrame.style.top = target.top;
		}
		on(event,cb) {
			if( cb && "function" === typeof cb )
				if( this.popupEvents[event] )
					this.popupEvents[event].push(cb);
				else
					this.popupEvents[event] = [cb];
			else {
				var cbList;
				if( cbList = this.popupEvents[event]  ) {
					cbList.forEach( cbEvent=>cbEvent( cb ));
				}
			}
		}
		hide() {
			this.divFrame.style.display = "none";
		}
		show() {
			this.divFrame.style.display = "unset";
			popupTracker.raise( this );

			this.on( "show", true );
		}
		move(x,y) {
			this.divFrame.style.left = x+"%";
			this.divFrame.style.top = y+"%";
		}
	appendChild(e) {
		return this.divContent.appendChild(e)
	}
}

function createPopup( caption ) {
	return new Popup(caption);
}

function createSimpleForm( title, question, defaultValue, ok, cancelCb ) {
	const popup = popups.create( title );
	popup.on( "show", ()=>{
		if( "function" === typeof defaultValue ){
			input.value = defaultValue();
		}
		else
			input.value = defaultValue;
		input.focus();
		input.select();
	})
	popup.on( "close", ()=>{
		// aborted...
		cancel && cancel();
	});

	var form = document.createElement( "form" );
	form.className = "frameForm";
	form.setAttribute( "action", "none" );
	form.addEventListener( "submit", (evt)=>{
		evt.preventDefault();
		popup.hide();
		ok && ok(input.value);
	} );	
	form.addEventListener( "reset", (evt)=>{
		evt.preventDefault();
		popup.hide();
	} );	

	var text = document.createElement( "SPAN" );
	text.textContent = question;
	var input = document.createElement( "INPUT" );
	input.className = "popupInputField";
	input.setAttribute( "size", 45 );
	input.value = defaultValue;

	var okay = document.createElement( "BUTTON" );
	okay.className = "popupOkay";
	okay.textContent = "Okay";
	okay.setAttribute( "name", "submit" );
	okay.addEventListener( "click", (evt)=>{
		evt.preventDefault();
		popup.hide();
		ok && ok( input.value );
	})

	var cancel = document.createElement( "BUTTON" );
	cancel.className = "popupCancel";
	cancel.textContent = "Cancel";
	cancel.setAttribute( "type", "reset" );
	cancel.addEventListener( "click", (evt)=>{
		evt.preventDefault();
		popup.hide();
		cancelCb && cancelCb( );
	})

	popup.divFrame.addEventListener( "keydown", (e)=>{
		if(e.keyCode==27){
			e.preventDefault();
			popup.hide();
			cancelCb && cancelCb( );
		}
	})
	popup.divContent.appendChild( form );
	form.appendChild( text );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( input );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( cancel );
	form.appendChild( okay );
	
	popup.center();
	popup.hide();
	return popup;
}

function makeButton( form, caption, onClick ) {

	var userLogin = document.createElement( "div" );
	userLogin.className = "button";
	userLogin.style.width = "max-content";
	var userLoginInner = document.createElement( "div" );
	userLoginInner.className = "buttonInner";
	userLoginInner.style.width = "max-content";
	userLoginInner.innerText = caption;

        userLogin.appendChild(userLoginInner);


	//var okay = document.createElement( "BUTTON" );
	//okay.className = "popupOkay";
	//okay.textContent = caption;
	userLogin.addEventListener( "click", (evt)=>{
		evt.preventDefault();
                onClick();
	})
	userLogin.addEventListener( "touchstart", (evt)=>{
		evt.preventDefault();
		setClass( userLogin, "pressed" );
		
	})
	userLogin.addEventListener( "touchend", (evt)=>{
		evt.preventDefault();
		clearClass( userLogin, "pressed" );
                onClick();
		
	})
	userLogin.addEventListener( "mousedown", (evt)=>{
		evt.preventDefault();
		setClass( userLogin, "pressed" );
		
	})
	userLogin.addEventListener( "mouseup", (evt)=>{
		evt.preventDefault();
		clearClass( userLogin, "pressed" );
		
	})
	form.appendChild( userLogin );
        return userLogin;

}

function createSimpleNotice( title, question, ok, cancel ) {
	const popup = popups.create( title );
	const show_ = popup.show.bind(popup);
	popup.show = function( caption, content ) {
		if( caption && content ) {
			popup.divCaption.textContent = caption;
			text.textContent = content;
		}
		else if( caption )
			text.textContent = caption;
		show_();
	}
	popup.on( "show", ()=>{
		okay.focus();
	})
	popup.on( "close", ()=>{
		// aborted...
		cancel && cancel();
	});

	var form = document.createElement( "form" );
	form.className = "frameForm";
	form.setAttribute( "action", "none" );
	form.addEventListener( "submit", (evt)=>{
		evt.preventDefault();
		popup.hide();
		//console.log( "SUBMIT?", input.value );
	} );	
	form.addEventListener( "reset", (evt)=>{
		evt.preventDefault();
		popup.hide();
	} );	

	var text = document.createElement( "SPAN" );
	text.className = "noticeText";
	text.textContent = question;

	
	var okay = makeButton( form, "Okay", ()=>{
		popup.hide();
		ok && ok( );
	})
	okay.className += " notice";
	okay.children[0].className += " notice";



	popup.divFrame.addEventListener( "keydown", (e)=>{
		if(e.keyCode==27){
			e.preventDefault();
			popup.hide();
			ok && ok( );
		}
	})
	popup.divContent.appendChild( form );
	form.appendChild( text );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( document.createElement( "br" ) );
	form.appendChild( okay );

	if( cancel )  {
		let cbut = makeButton( form, "Cancel", ()=>{
			popup.hide();
			cancel && cancel( );
		})
		cbut.className += " notice";
		cbut.children[0].className += " notice";
	}
	popup.center();
	popup.hide();
	return popup;
}



function createList( parentList, toString ) {
	var selected = null;
	var groups = [];
	var itemOpens = false;
	var groupList = {
		divTable:parentList.parent,		

		push(group, toString_, opens) {
			var itemList = this.divTable.childNodes;
			var nextItem = null;
			for( nextItem of itemList) {
				if( nextItem.textContent > toString(group) ) 
					break;
				nextItem = null;
			}
			
			var newLi = document.createElement( "LI" );
			newLi.className = "listItem"
			
			this.divTable.insertBefore( newLi, nextItem );//) appendChild( newLi );
			newLi.addEventListener( "click", (e)=>{
				e.preventDefault();
				if( selected )
					selected.classList.remove("selected");
				newLi.classList.add( "selected" );
				selected = newLi;
			})

			var newSubList = document.createElement( "UL");
			newSubList.className = "listSubList";
			if( parentList.parentItem )
				parentList.parentItem.enableOpen( parentList.thisItem );
			if( opens ) {
			//	this.enableOpen(newLi);
			}

			var treeLabel = document.createElement( "span" );
			treeLabel.textContent = toString(group);
			treeLabel.className = "listItemLabel";
			newLi.appendChild( treeLabel );

			//var newSubDiv = document.createElement( "DIV");
			newLi.appendChild( newSubList );
			//newSubList.appendChild( newSubDiv);
			var newRow;
			var listParams;
			var subItems = createList( listParams = { thisItem: null, parentItem: this, parent: newSubList }, toString_, true );
			groups.push( newRow={ opens : false, group:group, item: newLi, subItems:subItems, parent:parentList } );
			listParams.thisItem = newRow;
			return newRow;
		},
		enableOpen(item) {
			if( item.opens) return;
			item.opens = true;
				var treeKnob = document.createElement( "span" );
				treeKnob.textContent = "-";
				treeKnob.className = "knobOpen";
				item.item.insertBefore( treeKnob, item.item.childNodes[0] );
				treeKnob.addEventListener( "click", (e)=>{
					e.preventDefault();
					if( treeKnob.className === "knobClosed"){
						treeKnob.className = "knobOpen";
						treeKnob.textContent = "-";
						item.subItems.items.forEach( sub=>{
							sub.item.style.display="";
						})
					}else{
						treeKnob.className = "knobClosed";
						treeKnob.textContent = "+";
						item.subItems.items.forEach( sub=>{
							sub.item.style.display="none";
						})

					}
				})
		},
		enableDrag(type,item,key1,item2,key2) {
			item.item.setAttribute( "draggable", true );
			item.item.addEventListener( "dragstart", (evt)=>{
				//if( evt.dataTransfer.getData("text/plain" ) )
				//	evt.preventDefault();
				if( item2 )
					evt.dataTransfer.setData( "text/" + type, item.group[key1]+","+item2.group[key2])
				else
					evt.dataTransfer.setData( "text/" + type, item.group[key1])
				evt.dataTransfer.setData("text/plain",  evt.dataTransfer.getData("text/plain" ) + JSON.stringify( {type:type,val1:item.group[key1],val2:item2 && item2.group[key2] } ) );
				console.log( "dragstart:", type );
				if( item )
					evt.dataTransfer.setData("text/item", item.group[key1] );
				if( item2 )
					evt.dataTransfer.setData("text/item2", item2.group[key2] );
			})
		},
		enableDrop( type, item, cbDrop ) {
			item.item.addEventListener( "dragover", (evt)=>{
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "move";
				//console.log( "Dragover:", evt.dataTransfer.getData( "text/plain" ), evt );
			})
			item.item.addEventListener( "drop", (evt)=>{
				evt.preventDefault();
				var objType = evt.dataTransfer.getData( "text/plain" );
				JSOX.begin( (event)=>{
					if( type === event.type ){
						//console.log( "drop of:", evt.dataTransfer.getData( "text/plain" ) );
						cbDrop( accruals.all.get( event.val1 ) );
					}
				} ).write( objType );
			})
		},
		update(group) {
			var item = groups.find( group_=>group_.group === group );
			item.textContent = toString( group );
		},
		get items() {
			return groups;
		},
		reset() {
			while( this.divTable.childNodes.length )
				this.divTable.childNodes[0].remove();
		}
	}
	return groupList;
}

function makeCheckbox( form, o, text, field ) 
{
	var textCountIncrement = document.createElement( "SPAN" );
	textCountIncrement.textContent = text;
	var inputCountIncrement = document.createElement( "INPUT" );
	inputCountIncrement.setAttribute( "type", "checkbox");
	inputCountIncrement.className = "checkOption rightJustify";
	inputCountIncrement.checked = o[field];
	//textDefault.

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit";
	binder.addEventListener( "click", (e)=>{ if( e.target===inputCountIncrement) return; e.preventDefault(); inputCountIncrement.checked = !inputCountIncrement.checked; })
	form.appendChild(binder );
	binder.appendChild( textCountIncrement );
	binder.appendChild( inputCountIncrement );
	//form.appendChild( document.createElement( "br" ) );
	return {
		get checked() {
			return inputCountIncrement.checked;
		},
		set checked(val) {
			inputCountIncrement.checked = val;
		},
		get value() { return this.checked; },
		set value(val) { this.checked = val; },
	}
}

function makeTextInput( form, input, text, value, money, percent ){

	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputMinimum = document.createElement( "INPUT" );
	inputMinimum.className = "textInputOption rightJustify";
	//textDefault.
	if( money ) {
		inputMinimum.value = utils.to$(input[value]);
		inputMinimum.addEventListener( "change", (e)=>{
			var val = utils.toD(inputMinimum.value);
			inputMinimum.value = utils.to$(val);
		})
	} else if( percent ) {
		inputMinimum.value = utils.toP(input[value]);
		inputMinimum.addEventListener( "change", (e)=>{
			var val = utils.fromP(inputMinimum.value);
			inputMinimum.value = utils.toP(val);
		})
	}else {
		inputMinimum.value = input[value];
	}

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit";
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputMinimum );
	return {
		get value () {
			if( money )
				return utils.toD(inputMinimum.value);
			if( percent ) 
				return utils.fromP(inputMinimum.value);
			return inputMinimum.value;
		},
		set value (val) {
			if( money )
				inputMinimum.value = utils.to$(val);
			else if( percent )
				inputMinimum.value = utils.toP(val);
			else
				inputMinimum.value = val;			
		}
	}
}

function makeTextField( form, input, text, value, money, percent ){

	var textMinmum = document.createElement( "SPAN" );
	textMinmum.textContent = text;
	var inputMinimum = document.createElement( "SPAN" );
	inputMinimum.className = "rightJustify";
	inputMinimum.style.float="right";
	//textDefault.
	if( money ) {
		inputMinimum.textContent = utils.to$(input[value]);
		inputMinimum.addEventListener( "change", (e)=>{
			var val = utils.toD(inputMinimum.textContent);
			inputMinimum.textContent = utils.to$(val);
		})
	} else if( percent ) {
		inputMinimum.textContent = utils.toP(input[value]);
		inputMinimum.addEventListener( "change", (e)=>{
			var val = utils.fromP(inputMinimum.textContent);
			inputMinimum.textContent = utils.toP(val);
		})
	}else {
		inputMinimum.textContent = input[value];
	}

	var binder = document.createElement( "div" );
	binder.className = "fieldUnit";
	form.appendChild(binder );
	binder.appendChild( textMinmum );
	binder.appendChild( inputMinimum );
	return {
		divFrame : binder,
		refresh() {
			inputMinimum.textContent = input[value];
		},
		get value () {
			if( money )
				return utils.toD(inputMinimum.textContent);
			if( percent ) 
				return utils.fromP(inputMinimum.textContent);
			return inputMinimum.value;
		},
		set value (val) {
			if( money )
				inputMinimum.textContent = utils.to$(val);
			else if( percent )
				inputMinimum.textContent = utils.toP(val);
			else
				inputMinimum.textContent = val;			
		}
	}
}

function makeNameInput( form, input, text ){
	var binder;
	var textLabel = document.createElement( "SPAN" );
	textLabel.textContent = text;

	var text = document.createElement( "SPAN" );
	text.textContent = input.name;

	var buttonRename = document.createElement( "Button" );
	buttonRename.textContent = "(rename)";
	buttonRename.className="buttonOption rightJustify";

	binder = document.createElement( "div" );
	binder.className = "fieldUnit";
	form.appendChild(binder );
	binder.appendChild( textLabel );
	binder.appendChild( text );
	binder.appendChild( buttonRename );
	//binder.appendChild( document.createElement( "br" ) );
	return {
		get value() {
			return text.textContent;
		}		,
		set value(val) {
			text.textContent = val;
		}
	}
}

	function toggleClass( el, cn )  {
		if( el.className.includes(cn) )  {
			el.className = el.className.split( " " ).reduce( (a,el)=> ( el !== cn )?(a.push(el),a):a, [] ).join(' ');
		}else {
			el.className += " " + cn;
		}
	}
	function clearClass( el, cn )  {
		if( el.className.includes(cn) )  {
			el.className = el.className.split( " " ).reduce( (a,el)=> ( el !== cn )?(a.push(el),a):a, [] ).join(' ');
		}else {
		}
	}
	function setClass( el, cn )  {
		if( el.className.includes(cn) )  {
		}else {
			el.className += " " + cn;
		}
	}


export {popups};
export {Popup};
