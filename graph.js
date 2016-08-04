
var graph = (function() {

    var test_object = [];
    var newTestResults = [];
    
    return {

	init: function() {

	    var results = $.getJSON("results.json",function(data){
		test_object.push(data);
		graph.parse();
	    });

	}, //end of init

	test_result: function(platform, tests) {
	    this.platform = platform;
	    this.tests = tests;
	},

	test: function(name, avg, std){
	    this.name = name;
	    this.avg = avg;
	    this.std = std;
	},
	
	parse: function(){
	    //test_object should contain json object tree now

	    var jsonobj = JSON.parse(JSON.stringify(test_object[0]));

	    for (var key in jsonobj){

		var tests_array = [];
		var layer1 = jsonobj[key];

		if (key === "timeout") continue;
		
		for (var key2 in layer1){

		    var test_details = new graph.test(key2, layer1[key2].avg, layer1[key2].std);
		    tests_array.push(test_details);
		}
		
		var test_r = new graph.test_result(key, tests_array);
		newTestResults.push(test_r);
		//NewTestResults should be a nice, easily manipulated object now.
	    }
	    graph.print();
	    
	}, //end of parse

	print: function(){
	    
	    var html = "";
	    console.log(newTestResults);
	    
	    for (var i = 0; i<newTestResults.length; i++){

		html += "<div id=\"" + newTestResults[i].platform + "\" style=\"height:400px; width:100%;\"></div>";
	    }
	    
	    document.getElementById("body").innerHTML = html;

	    for (var j = 0; j < newTestResults.length; j++){
		
		var dps = [];

		var num = newTestResults[j].tests.length;

		for (var k = 0; k < num; k++){

		    var name = newTestResults[j].tests[k].name;
		    var avg = newTestResults[j].tests[k].avg;
		    
		    var gObject = {label: name, y: avg}

		    dps.push(gObject);
		}

		var graphical = new CanvasJS.Chart(newTestResults[j].platform,
						   {
						       title: {
							   text: newTestResults[j].platform,
							   horizontalAlign: "left"
						       },
						   data: [
						       {
							   type:"column",
							   name:newTestResults[j].platform,//test platform/browser
							   dataPoints: dps 
						       }
						   ]
					       });
		
		graphical.render();
	    }
	} //end of print
    }	     
})();
