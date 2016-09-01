// Initiate pym
var pymChild = new pym.Child();

// var ind = [
//   ["ElectricGrid","Electric Grid"],
//   ["ElectricityDemand","Electricity Demand"],
//   ["FuelTransport","Fuel Transport"],
//   ["Hydropower","Hydropower"],
//   ["OilGas","Oil & Gas E&P"],
//   ["Thermoelectric","Thermoelectric"],
//   ["WindPower","Wind Power"],
//   ["Bioenergy","Bioenergy"]
// ]

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
// Insert your scripts here

var width = parseInt(d3.select("#map").style("width")),
  height = width / 2,
  centered;

var boxWidth = 0,
    boxHeight = 0;

var iconWidth = 20,
    iconHeight = 20;

// main projection
var projection = d3.geo.albers()
    .scale(width)
    .translate([width / 2, ((height / 2))])  ;

var path = d3.geo.path()
    .projection(projection);

// projection for the drop shadow, coastline
var offset = 1;

var projection2 = d3.geo.albers()
    .scale(width)
    .translate([((width / 2) + (offset)), ((height / 2) + (offset))])  ;

var path2 = d3.geo.path()
    .projection(projection2);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var rect = svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

// d3.json("js/statesregionspr.json", function(error, regions) {
d3.json("js/usa.json", function(error, regions) {
  if (error) throw error;
  d3.csv("data/cities.csv", function(error, cities){
  // d3.json("http://energyapps.github.io/climate-frame/js/statesregion2.json", function(error, regions) {  
	if (error) throw error;

  window.onload = function(){
    var dataLoad = topojson.feature(regions, regions.objects.regions1).features;
    var hash = (window.location.hash).replace('#', '');
    if (hash.length != 0) {
      for (var i = 0; i < dataLoad.length; i++) {
        dhash = dataLoad[i].properties.name.replace(/\s+/g, '-').toLowerCase();
        if (dhash == hash) {
          clicked(dataLoad[i])
          break
        };
      };      
    }

    // Make sure its big enough on the parent!
    pymChild.sendHeight();
  }

// The background coastal boundary goes first cuz its underneath
  g.append("path")
    .datum(topojson.mesh(regions, regions.objects.regions1, function(a, b) { 
      return a === b }))
    .attr("d", function(d){      
      return path(d)
    })
    .attr("d", path2)
    .attr("class", "coast-boundary");  

// next the regions color
	g.append("g")
		.attr("id","regions")
		.selectAll(".region")
      .data(topojson.feature(regions, regions.objects.regions1).features)
    .enter().append("path")
      .attr("class", function(d) { return "region " + d.id; })
      .attr("d", path)
      .on("click", clicked);

	g.append("path")
    .datum(topojson.mesh(regions, regions.objects.states1, function(a, b) { return a !== b}))
    .attr("d", path)
    .attr("cursor","pointer")
    .attr("class", "subunit-boundary");	    

g.append("path")
    .datum(topojson.mesh(regions, regions.objects.regions1, function(a, b) { 
      return a !== b }))
    .attr("d", path)
    .attr("class", "main-boundary");

  var BigBubbles = g.selectAll("circle")
    .data(topojson.feature(regions, regions.objects.regions1).features.filter(function(d){return d.id !== "Null"}))
      .enter().append("circle")
        .attr("class", "bubble")
        .attr("transform", function(d) { 
          if (d.id === "West") {
            var center = path.centroid(d)
            center[0] = center[0] - (width/ 20) ;
          } else {
            var center = path.centroid(d)
          };
          return "translate(" + center + ")"; })          
        .attr("r", function(d) { 
          return width / 20;            
        })
         // .attr("text", function(d){ return d.properties.name})
         //  .on('mouseover', hoverdata)
         //  .on('mouseout', mouseout);
  
// Add city points
  g.selectAll("city")
    .data(cities)
    .enter()
    .append("circle")
    .attr("r",3)
    .attr("transform", function(d) {
      var latlong = projection([d.longitude,d.latitude])
      return "translate(" + latlong + ")";
    })
    .attr("class", "city");

    // Add titles to regions
  g.selectAll("text")
    .data(topojson.feature(regions, regions.objects.regions1).features.filter(function(d){return d.id !== "Null"}))
    .enter()
    .append("svg:text")
    .attr("class","region-title")
    .attr("id", function(d){
      return d.id + "-title"
    })
    .text(function(d){
        return d.id
    })
    .attr("transform", function(d) { 
      if (d.id === "West") {
        var center = path.centroid(d)
        center[0] = center[0] - (width/ 20) ;
      } else {
        var center = path.centroid(d)
      };
      return "translate(" + center + ")"; 
    })          
    .attr("text-anchor","middle")
  });
});

// Bind things that happen on first click 
(function ($) { 
  $(document).ready(function() { 
    $("#link-below").click(ReadMore)
    $("#clickstate").click(ReadMore)
  });  
}(jQuery));  


// What happens when clicked
function clicked(d) {

// D3 stuff on click
  var x, y, k, id, name, hash, green, summary, properties, boxWidth, title1, numIcon, IW, TW, halfBox, url, order, propinter;
  var p = [[],[],[],[],[]];
  var boxHeight = 0;

  //click on a region and define dates and populate options
  if (d && centered !== d && d.id !== "Null") {     
    
    setTimeout(
    function() 
    {
      (function ($) {   
        $('#summary').scrollView();
      }(jQuery));  
    }, 1000);  
    
    for (var i = context_data.length - 1; i >= 0; i--) {
      if (d.id == context_data[i].Name) {
        summary = context_data[i].summary;
        // properties = context_data[i].properties;
        // url = "http://energy.gov/sites/prod/files/2015/10/f27/" + context_data[i].uri;
        // for (var key in properties) {
        //   order = properties[key].charAt(0);
        //   propinter = properties[key].substring(2);

        //   if (properties[key] != "") {
        //     boxHeight += 1
        //     p[0].push(order);
        //     p[1].push(key);
        //     p[2].push(propinter)
        //     p[3].push(key.length);            
        //     p[4].push(propinter.length);            
        //   };              
        // }   
      } 
    };  
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2 ;
    centered = d;
    id = d.id;
    name = d.id;
    hash = "#" + name.replace(/\s+/g, '-').toLowerCase();        
    green = d.id;         
  } else {
      //outclick
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    id = "";
    name = "Click on a region to learn more"
    hash = "#"
    green = "green-text"    
    summary = "";
  }

  (function ($) {   
    $('#linkbutton').attr("href",url)
  }(jQuery));  

// Sets the active topography so that it highlights the states
  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

//transitions the map.
  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

// Scroll into view  

  if (d && centered !== d && d.id !== "Null") { 
    // console.log('tata')
    // setTimeout(
    // function() 
    // {
    //   (function ($) {   
    //     $('#summary').scrollView();
    //   }(jQuery));  
    // }, 1000);  
    // 
  }

// Transitions for the key  
// Resize the key
  
  var raw = []

  // add the boxes of the icons
  for (var k = p[2].length - 1; k >= 0; k--) {
    var iconList = p[2][k].split(",") 
    var inner = [p[0][k],p[1][k]] 
    raw.push(inner)
    for (var j = iconList.length - 1; j >= 0; j--) {
      g2.append("rect")
        .attr("class",function(d) {
          return "threat " + iconList[j]
        })     
        .attr("type",function(d){
          return iconList[j]
        })   
        .attr("industry",function(d){
          return p[1][k]
        })
        .attr("width",iconWidth)
        .attr("height",iconHeight)
        .attr("fill-opacity","0")
        .attr("fill",function(d){
          return "url(#icon" + iconList[j] + ")"
        })
        .attr("y", function(d) { 
          return (k*15)+(2*iconHeight+5) 
        })
        .attr("x",function(d) {
          return (boxWidth/2)
        })
        .on("mouseover",threatHover(boxHeight, halfBox))
        .on("mouseout",threatOut(boxHeight)); 
    };
  };

  // Sort Everything based on the order of importance!!!
  raw = raw.sort(function(a,b){
    if (a[0] < b[0]) {
        return -1;
    } else if (a[0] > b[0]) { 
        return 1;
    }
  });

  for (var i = 0; i < raw.length; i++) {
    var industry = raw[i][1]
    var industry2 = d3.selectAll("[industry="+industry+"]")
    industry2.transition().duration(1000)
    .delay(function(d, i) {
        return i * 100;
      })
      .attr("y",function(d){
        if (d !== undefined) {
          //Y of the right side
          return (i*(iconHeight+3)+55) 
        } else{
          //Y of the icons (left side)
          return (i*(iconHeight+3)+40) 
        };      
      })
    var babyboxes = svg2.selectAll("[industry="+industry+"]:not(text)")


    babyboxes.transition().duration(1000)
      .ease("elastic")
      .delay(function(d, i) {
        return i*100+1000;
      })
      .attr("x",function(d,j){
        return IW-(j*(iconWidth+5))-iconWidth;
      })
      .attr("fill-opacity","1")
  };

    // Add the dom elements. HTML, basically no D3
      //Change the color of the header based on the region.
      var clickstate = document.getElementById("clickstate")
      clickstate.className = "large-12 columnsDOE subheadline " + id;
      clickstate.innerHTML = "<p>" + name + "</p>";

      //change bottom tab/button
      var below = document.getElementById("below")
      if (id=="") {  below.className = below.className.replace( /(?:^|\s)active(?!\S)/g , '' );
      } else {  below.className = "active " + id
      };

      window.location = hash;

      var linkBelow = document.getElementById("link-below")
      linkBelow.href =  hash;
      
      var greenTextchange = document.getElementsByClassName("change-text")
      for (var i = greenTextchange.length - 1; i >= 0; i--) {
        greenTextchange[i].className = "change-text " + green;    
      };

      var region_text = document.getElementById("region-text")
      region_text.innerHTML = "<p style='padding-top: 50px;'>" + summary + "</p>";

  pymChild.sendHeight();

}

function ReadMore() { 
  (function ($) {   
    $('#summary').scrollView();
  }(jQuery));  
}

(function ($) { 
  $(document).ready(function() { 
    $.fn.scrollView = function () {
      return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
      });
    }
  });  
}(jQuery));  

d3.select("#execid").on("mouseover",function(){pymChild.sendHeight();})    
d3.select("#execid").on("mouseleave",function(){
  pymChild.sendHeight();
})    
