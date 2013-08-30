define([
    "dojo/_base/declare", 
    "dojo/dom-construct", 
    "dojo/parser", 
    "dojo/ready",
    "dojo/dom",
    "dojo/_base/xhr",
    "dojo/date",
    "dgrid/Grid",
    "dgrid/extensions/Pagination",
    "dijit/_WidgetBase",
], function(declare, 
			domConstruct,
			parser, 
			ready,
			dom,
			xhr,
			date,
			Grid,
			Pagination,
			_WidgetBase){
    declare("TableWidget", [_WidgetBase], {
    	day: new Date(),
	    
        constructor: function(domNode){
        	// var data = this.getData();
        	// console.log("data", data);
        	this.data = [
				{ first: "Bob", last: "Barker", day: new Date()},
				{ first: "Vanna", last: "White", day: new Date()},
				{ first: "Pat", last: "Sajak", day: date.add(new Date(), "day", 1) }
			];
        	this.domNode = dom.byId(domNode);
        	this.makeGrid();
        },

        getData: function(){
        	// get some data, convert to JSON
		  var d = xhr.get({
		        url:"http://api.serviceu.com/rest/events/occurrences?orgKey=963d555c-3a00-4cbd-b08a-acc2c0fadc00&nextDays=2&format=json",
		        handleAs:"json"
		        });

		  return d;
        },

        makeGrid: function(){
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

        getdataForDate: function(dateGiven){
        	var returnThis = [];
        	for (var obj in this.data){
        		if (date.compare(this.data[obj].day, dateGiven, "date") == 0)
        			returnThis.push(this.data[obj])
        	}

		    console.log("data", returnThis);
        	return returnThis;
        },

        buildRendering: function(){
            // create the DOM for this widget
            this.title = domConstruct.create("h2", {innerHTML: new Date().toUTCString()}, this.domNode, "end")

            this.previous = domConstruct.create("button", {innerHTML: "previous"}, this.domNode, "end");
            this.today = domConstruct.create("button", {innerHTML: "today"}, this.domNode, "end");
            this.next = domConstruct.create("button", {innerHTML: "next"}, this.domNode, "end");
        },

        postCreate: function(){
            this.connect(this.next, "onclick", "addDay");
            this.connect(this.today, "onclick", "todayDay");
            this.connect(this.previous, "onclick", "subtractDay");
        },

        addDay: function(){
        	this.day = date.add(this.day, "day", 1);
        	this.reloadGrid();
        },

        subtractDay: function(){
        	this.day = date.add(this.day, "day", -1);
        	this.reloadGrid();
        },

        todayDay: function(){
        	this.day = new Date();
        	this.reloadGrid();
        },

        reloadGrid: function(){
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