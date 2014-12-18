/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "myapp.MainView",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Alltreands - Test Assingment"},
		{kind: "enyo.Scroller", fit: true, components: [
			{
				name: "tabArea",
				kind: "TabsController", 
				classes: "nice-padding"
			}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind :"onyx.Button", content : "Add folder", ontap: "addFolder"}
		]}
	],
	addFolder: function () {
		
		this.$.tabArea.addFolder();
	}
});
