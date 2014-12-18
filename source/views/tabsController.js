enyo.kind({
	
	name :"TabsController",
	kind : "FittableRows",
	fit: true,
	classes: "tabs-holder",
	create :function () {
		
		this.inherited(arguments);
		
		if (this.checkLoadData() == true) {
			//Load Data
			
			this.loadItems();
			
		} else {
			this.addFolder();
		}
		this.render();
	},
	loadItems: function () {
		
		var keys = Object.keys(localStorage);
		
		for (var i = 0;i<keys.length;i++) {
			
			var item = loadFromLocalStorage(keys[i]);
			
			if (item.level == 1) {
				
				this.createComponent({ 
					kind : "tabModel",
					parentTab: 0,
					tabChain : item.tabChain,
					level: 1,
					tabName: item.tabName,
					tabId: item.tabId,
					state: item.state
				});
				
			}
		}
		this.render();
	},
	addFolder: function() {

		var itemId = enyo.irand(9999);
		
		this.createComponent({ 
			kind : "tabModel",
			parentTab: 0,
			level: 1,
			tabChain: itemId,
			tabName: "Parent_" + itemId,
			tabId: itemId,
			state: 1
		});
		
		this.children[this.children.length-1].saveTabData();
		this.render();
	},
	checkLoadData: function () {
		return (localStorage.length > 0);
	},
});


