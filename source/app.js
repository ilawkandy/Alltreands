/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

function saveToLocalStorage(itemName, data) {
	
	if(typeof(Storage) !== "undefined") {
		
		localStorage.setItem(itemName, JSON.stringify(data));
	} else {
		var cookie = [itemName, '=', JSON.stringify(data), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
		document.cookie = cookie;
	}
	return true;
}

function deleteFromLocalStroage(itemName) {
	
	if(typeof(Storage) !== "undefined") {
		localStorage.removeItem(itemName);
	} else {
		 document.cookie = [itemName, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
	}
	
	return true;
}


function loadFromLocalStorage(itemName) {
	
	if(typeof(Storage) !== "undefined") {
		
		var result = JSON.parse(localStorage.getItem(itemName));
		
		return result;
	} else {

		var result = document.cookie.match(new RegExp(itemName + '=([^;]+)'));
		result && (result = JSON.parse(result[1]));
		return result;
	}
}

function not(value) {
	
	return (typeof value === undefined || value == null || value == "");
}

enyo.kind({
	name: "myapp.Application",
	kind: "enyo.Application",
	view: "myapp.MainView"
});

enyo.ready(function () {
	new myapp.Application({name: "app"});
});
