enyo.kind({
	
	name :"tabModel",
	kind : "FittableRows",
	drawerOpen: false,
	nameSet : false,
	state: false,
	record: {},
	components: [{
			name :"tabHeader",
			kind: "FittableColumns",
			classes:"tab-header",
			ontap: "activateDrawer",
			components: [{
				
				name :"drawerImage",
				kind: "Image", src: "./assets./arrow-right.png"
			},  {
				name :"TabName", 
				content: "Tab Name",
				classes: "tab-title",
			},{
					
				name : "TabNameTextField",
				kind: "onyx.Input", 
				placeholder: "Tab Name",
				onblur: "saveTabNameFiled",
				ontap: "restrict",
				
			},{ 
            	
				name : "buttonHolder", classes: "tab-header-buttonholder", components:  [ {
					
					kind :"enyo.Control", classes: "tab-header-button", ontap : "addSubTab", content: "New"
				},{
					kind :"enyo.Control", classes: "tab-header-button", ontap : "editSubTab", content: "Edit"
				}, {
					kind :"enyo.Control", classes: "tab-header-button", ontap : "removeSubTab", content: "Delete"
				}]
			}]
	},{
		name : "subTabHolder",  
		classes: "tab-subtabholder", 
		kind: "onyx.Drawer", 
		open: false
	}],
	restrict: function () {
		return true;
	},
	create : function () {
		
		this.inherited(arguments);
		
		//Set a name of the tab
		this.$.TabName.setContent(this.tabName);
		
		//Show Tab Name
		this.$.TabName.show();
		//Hide tab text field
		this.$.TabNameTextField.hide();
		
		//Create Sub Tabs
		this.createSubTabs();
		this.checkDrawer(this.state);
	},
	saveTabData : function (tabData) {

		if (not(tabData)) {

			
			var dataToSave = {

				parentTab : this.parentTab,
				tabId : this.tabId,
				level : this.level,
				tabName: this.tabName,
				tabChain: this.tabChain,
				state: this.state,
			}
			
		} else {
			
			var dataToSave = {
				parentTab : tabData.parentTab,
				tabId : tabData.tabId,
				level : tabData.level,
				tabName: tabData.tabName,
				tabChain: tabData.tabChain,
				state: tabData.state
			}
			
		}
		
		
		saveToLocalStorage(this.tabId, dataToSave);
	},
	removeSubTab: function (inSender) {
	
		this.deleteFromLS();
		//this.destroy();
		this.render();
	},
	editSubTab: function () {
		
		
		this.$.TabName.hide();
		this.$.TabNameTextField.show();
		
		 
		this.$.TabNameTextField.setValue(this.tabName);
		
		return true;
	},
	getSubTabs: function () {
		
		var keys = Object.keys(localStorage);
		var resArr = [];
		
		for (var i = 0;i<keys.length;i++) {
			var item = loadFromLocalStorage(keys[i]);
			
			if (this.tabId == item.parentTab && item.tabChain == this.tabChain)
				resArr.push(item);
		}
		
		return resArr
	},
	getKeyByTabId: function (tabId) {
		
		var keys = Object.keys(localStorage);
		var res = null;
		
		for (var i = 0;i<keys.length;i++) {
			var item = loadFromLocalStorage(keys[i]);

			if (tabId == item.tabId) {
				res = keys[i];
			}
		}
		
		return res;
	},
	createSubTabs: function () {

		//Get subTab Data
		var dataArr = [];
		var items = this.getSubTabs();
	
		for (var i = 0;i<items.length;i++) {

				var item = items[i];
				
				this.$.subTabHolder.createComponent({ 
					name : item.tabName,
					kind : "tabModel",
					parentTab: item.tabId,
					tabChain: item.tabChain,
					level: item.level ,
					tabName: item.tabName,
					tabId: item.tabId,
					state: item.state
				});
			
	
		}
		
		this.render();
		
	},
	addSubTab: function () {
		
		var itemId = enyo.irand(9999);

		var itemName = "subChildren_"+itemId;
		
		this.$.subTabHolder.createComponent({ 
			name : itemName,
			kind : "tabModel",
			parentTab: this.tabId,
			tabChain: this.tabChain,
			level: this.level +1 ,
			tabName: "SubChildren_" + (this.level + 1) + "_" + itemId,
			tabId: itemId,
			state: 1
		});
		
		var lastItem = this.$.subTabHolder.$[itemName].saveTabData();

		this.render();
		return true;
		
	},
	saveTabNameFiled: function (inSender) {
		
		var txtVal = this.$.TabNameTextField.value;
		
		this.tabName = txtVal;
		
		this.$.TabName.setContent(this.tabName);
		this.$.TabName.show();
		this.$.TabNameTextField.hide();
		
		
		this.changeItemName(txtVal);
	},
	changeItemName : function (itemName) {
		
		var LSItemKey = this.getKeyByTabId(this.tabId);
		
		var item = loadFromLocalStorage(LSItemKey);
		
		var tempItem = item;
		tempItem.tabName = itemName;
		this.tabName = itemName;

		this.saveTabData(tempItem);
	},
	deleteFromLS: function () {
		
		var childArr = [];
		var keys = Object.keys(localStorage);
		
		for (var i = 0;i<keys.length;i++) {
			
			var item = loadFromLocalStorage(keys[i]);
			if (item.tabChain == this.tabChain && this.level < item.level ) {
				deleteFromLocalStroage(keys[i]);
			}
			
			if (item.tabId == this.tabId) {
				deleteFromLocalStroage(keys[i]);
			}
			
		}
		
		this.destroy();
		this.render();

	},
	checkDrawer: function (state) {
		
		
		this.$.subTabHolder.setOpen(state);
		
		if (state == false) {
			//DRAWER CLOSED
			this.$.drawerImage.setSrc("./assets/arrow-right.png");

		} else if (state == true) {
			//DRAWER OPENED
			this.$.drawerImage.setSrc("./assets/arrow-down.png");
		}
		
		
	},
	saveItemState: function (state) {
		
		var LSItemKey = this.getKeyByTabId(this.tabId);
		
		var item = loadFromLocalStorage(LSItemKey);
		
		console.log(state);
		var tempItem = item;
		tempItem.state = state;
		this.state = state;
		
		this.saveTabData(tempItem);
		
	},
	activateDrawer : function() {

		this.checkDrawer(!this.$.subTabHolder.open);
		
		this.saveItemState(this.$.subTabHolder.open);

		return true;
	}
});