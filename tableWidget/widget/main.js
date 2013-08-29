define([
    "dojo/_base/declare", 
    "dojo/dom-construct", 
    "dojo/parser", 
    "dojo/ready",
    "dojo/dom",
    "dojo/_base/xhr",
    "dgrid/Grid",
    "dgrid/extensions/Pagination",
    "dijit/_WidgetBase",
], function(declare, 
			domConstruct,
			parser, 
			ready,
			dom,
			xhr,
			Grid,
			Pagination,
			_WidgetBase){
    declare("TableWidget", [_WidgetBase], {
    	day: 1,
	    
        constructor: function(domNode){
        	// var data = this.getData();
        	// console.log("data", data);
        	this.data = [
				{ first: "Bob", last: "Barker", day: 1 },
				{ first: "Vanna", last: "White", day: 1 },
				{ first: "Pat", last: "Sajak", day: 2 }
			];
        	this.makeTable();
        	this.domNode = domConstruct.create("p", {innerHTML: "This is Construced in the p tag."}, dom.byId(domNode))
        },

        getData: function(){
        	// get some data, convert to JSON
		  var d = xhr.get({
		        url:"http://api.serviceu.com/rest/events/occurrences?orgKey=963d555c-3a00-4cbd-b08a-acc2c0fadc00&nextDays=2&format=json",
		        handleAs:"json"
		        });

		  return d;
        },

        makeTable: function(){

        	var columns = {
		        first: {
		            label: "First Name"
		        },
		        last: {
		            label: "Last Name"
		        }
		    };

		    var data = this.getdataForDate(this.day);

		    this.grid = new Grid({ columns: columns }, "grid"); // attach to a DOM id
		    this.grid.renderArray(data);
        },

        getdataForDate: function(date){
        	var returnThis = [];
        	for (var obj in this.data){
        		if (this.data[obj].day == date)
        			returnThis.push(this.data[obj])
        	}

		    console.log("data", returnThis);
        	return returnThis;
        },

        buildRendering: function(){
            // create the DOM for this widget
            this.next = domConstruct.create("button", {innerHTML: "day " + this.day}, this.domNode, "end");
        },

        postCreate: function(){
            // every time the user clicks the button, increment the counter

            this.connect(this.next, "onclick", "changeDay");
        },

        changeDay: function(){
        	this.day++;
        	this.next.innerHTML = "day " + this.day;

        	this.grid.refresh();
        	var data = this.getdataForDate(this.day);
        	this.grid.renderArray(data);
        }

    });

    ready(function(){
        // Call the parser manually so it runs after our widget is defined, and page has finished loading
        parser.parse();
    });
});