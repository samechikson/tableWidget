define([
    "dojo/_base/declare", 
    "dojo/dom-construct", 
    "dojo/parser", 
    "dojo/ready",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/_base/xhr",
    "dojo/date",
    "dojo/date/locale",
    "dgrid/Grid",
    "dgrid/extensions/Pagination",
    "dijit/_WidgetBase",
], function(declare, 
			domConstruct,
			parser, 
			ready,
			dom,
            domClass,
			xhr,
			date,
			locale,
			Grid,
			Pagination,
			_WidgetBase){
    declare("TableWidget", [_WidgetBase], {
    	day: new Date(),
        dateFormat: "EEEE, MMMM d, yyyy",
	    
        constructor: function(domNode){
        	var _this = this;
        	var data = this.getData();
        	console.log("data", data);
	        this.domNode = dom.byId(domNode);
	        this.setupGrid();

        	data.then(function(data){
        		_this.data = data;
        		for (var obj in _this.data){
        			var aDay = _this.data[obj].OccurrenceEndTime;
        			// console.log("day", aDay);
        			// console.log("day parsed", new Date(Date.parse(aDay)));
        			
        			_this.data[obj].day = new Date(Date.parse(aDay));
        		}

        		console.log(_this.data);
	        	_this.reloadGrid();
        	})
   			// this.data = [
			// 	{ first: "Bob", last: "Barker", day: new Date()},
			// 	{ first: "Vanna", last: "White", day: new Date()},
			// 	{ first: "Pat", last: "Sajak", day: date.add(new Date(), "day", 1) }
			// ];
        },

        getData: function(){
        	// get some data, convert to JSON
		  var d = xhr.get({
		        //url:"http://api.serviceu.com/rest/events/occurrences?orgKey=963d555c-3a00-4cbd-b08a-acc2c0fadc00&nextDays=5&format=json",
		        url: "widget/samplejson.json",
		        handleAs:"json"
		        });

		  return d;
        },

        setupGrid: function(){
        	var columns = {
		        Name: {
		            label: "Title"
		        },
		        Description: {
		            label: "Description"
		        }
		    };

		    this.grid = new Grid({ columns: columns }, "grid"); // attach to a DOM id
            domClass.add(this.grid, "table");
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
            domClass.add(this.domNode, "row");
            var titleAttr = {innerHTML: locale.format(new Date(), {selector:"date", datePattern:this.dateFormat}),
                             class: "col-md-9"}
            this.title = domConstruct.create("h2", titleAttr, this.domNode, "end")

            this.buttonContainer = domConstruct.create("div", {class:"buttonContainer col-md-3"}, this.domNode, "end");
            this.previous = domConstruct.create("button", {innerHTML: "previous", class:"btn btn-default"}, this.buttonContainer, "end");
            this.today = domConstruct.create("button", {innerHTML: "today", class:"btn btn-default"}, this.buttonContainer, "end");
            this.next = domConstruct.create("button", {innerHTML: "next", class:"btn btn-default"}, this.buttonContainer, "end");
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
        	this.title.innerHTML = locale.format( this.day, {selector:"date", datePattern:this.dateFormat } )
        	this.grid.renderArray(data);
        }

    });

    ready(function(){
        // Call the parser manually so it runs after our widget is defined, and page has finished loading
        parser.parse();
    });
});