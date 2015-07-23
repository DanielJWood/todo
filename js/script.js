function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

// console.log(context_data)
// console.log(context_data[0])
// console.log(context_data[0].summary)
// console.log(context_data[0].properties)

// Insert your scripts here

var width = parseInt(d3.select("#map").style("width")),
  height = width / 2,
  centered;

var boxWidth = 160,
    boxHeight = 120;

// var projection = d3.geo.albersUsaPr()
var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, ((height / 2))])  ;

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var svg2 = d3.select("#map").append("svg")
    .attr("width",boxWidth)
    .attr("height",boxHeight)
    .attr("id","svg2");

var rect = svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");
var g2 = svg2.append("g");

var threatBox = g2.append("rect")
    .attr("id","threats2")
    .attr("fill","#ff00ff")
    .attr("width",boxWidth)
    .attr("height",boxHeight)
    .attr("x","0")
    .attr("y","0")

d3.json("js/statesregion2.json", function(error, regions) {
	if (error) throw error;

	g.append("g")
		.attr("id","regions")
		.selectAll(".region")
      .data(topojson.feature(regions, regions.objects.regions_usa).features)
    .enter().append("path")
      .attr("class", function(d) { return "region " + d.id; })
      .attr("d", path)
      .on("click", clicked);

	g.append("path")
    .datum(topojson.mesh(regions, regions.objects.regions_usa, function(a, b) { return a !== b}))
    .attr("d", path)
    .attr("class", "main-boundary");

	g.append("path")
    .datum(topojson.mesh(regions, regions.objects.states2, function(a, b) { return a !== b}))
    .attr("d", path)
    .attr("cursor","pointer")
    .attr("class", "subunit-boundary");	    

  g2.append("svg:text")
    .attr("class","title")
    .text("Key Climate Impacts")
    // .attr("class","header")
    .attr("x", function(d) {return boxWidth/2})
    .attr("y", "15")
    .attr("text-anchor","middle")
    .attr('font-size','10pt')
    .attr('fill','#fff');


    // Add titles to regions
  g.selectAll("text")
    .data(topojson.feature(regions, regions.objects.regions_usa).features)
    .enter()
    .append("svg:text")
    .text(function(d){
        return d.properties.name;
    })
    .attr("x", function(d){
        return path.centroid(d)[0];
    })
    .attr("y", function(d){
        return  path.centroid(d)[1];
    })
    .attr("text-anchor","middle")
    .attr('font-size','10pt');

});

// Bind things that happen on first click 
(function ($) { 
  $(document).ready(function() { 
    $("#link-below").click(ReadMore)
    $("#clickstate").click(ReadMore)
  });  
}(jQuery));  

// On click Get the length of the longest threat + icons in pixels
// Create the length of box as a result
// Create a centroid to hang the text from, from that length
// Build the text
// sort the text based on icon length, then alphabeticala


function clicked(d) {
// console.log(d)
// console.log(context_data)

// D3 stuff on click
  var x, y, k, id, name, hash, green, summary, properties, boxWidth;
  var p = [[],[],[],[]]

  //click on a state    
  if (d && centered !== d) {      
    for (var i = context_data.length - 1; i >= 0; i--) {
      if (d.id == context_data[i].id) {
        summary = context_data[i].summary
        properties = context_data[i].properties
        for (var key in properties) {
          if (properties[key] != "") {
            p[0].push(key)
            p[1].push(properties[key])              
            p[2].push(key.length + properties[key].length)
          };          
        }        
      } 
    };  
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2 ;
    centered = d;
    id = d.id;
    name = d.properties.name;
    hash = "#" + name.replace(/\s+/g, '-').toLowerCase();    
    button = "The " + name;
    green = d.id; 
    boxWidth = getMaxOfArray(p[2]) * 10;
  } else {
      //outclick
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    id = "";
    name = "Click on a region to learn more"
    hash = "#"
    button = "Climate Change"
    green = "green-text"    
    summary = "";
    boxWidth = 0;
  }

// Sets the active topography so that it highlights the states
  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

//transitions the map.
  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");


// Transitions for the key  
// Resize the key
  svg2
    .attr("width",function(d) {
      return boxWidth
    });

  threatBox
    .attr("width","100%")

  g2.selectAll("text").attr("x",function(d) { return boxWidth / 2});

  var text = g2.selectAll("text:not(.title)")
    .data(p[0])

  text.attr("class","update")


  text.enter().append("text")
    .attr("class","enter")
    .attr("y", function(d,i) { return (i*15)+30 })
    .attr("x",function(d) { return boxWidth / 2});  

  text.text(function(d) {console.log(d); return d;})

  text.exit().remove();


  // var text = textg.enter().append("g")
  //   .attr("class","entertextgbox")
  //     .append("text")
  //     .attr("class","enter")    
  //     .attr("y", function(d,i) { return (i*15)+30});

// Think i need to add the text in each above, rather than below

  // var text = g2.selectAll("textg").selectAll("text:not(.title)")
  //   .data(p[0])



  // text.attr("class","update")

  // text.append("text")
  //   .attr("class","enter")    
  //   .attr("y", function(d,i) {console.log(d); return (i*15)+30});

  // text.text(function(d) { return d;})

  // text.exit().remove();
        // ************* //
        //***************** //


// Add the dom elements. HTML, basically no D3
  //Change the color of the header based on the region.
  var clickstate = document.getElementById("clickstate")
  clickstate.className = "large-12 columnsDOE subheadline " + id;
  clickstate.innerHTML = "<p>" + name + "</p>";

  //change bottom tab
  var below = document.getElementById("below")
  if (id=="") {  below.className = below.className.replace( /(?:^|\s)active(?!\S)/g , '' );
  } else {  below.className = "active " + id
  };

  window.location = hash;

  var linkBelow = document.getElementById("link-below")
  linkBelow.href =  hash + "/2"
  
  var greenTextchange = document.getElementsByClassName("change-text")
  for (var i = greenTextchange.length - 1; i >= 0; i--) {
    greenTextchange[i].className = "change-text " + green;    
  };
  greenTextchange[1].innerHTML = button;
  // greenTextchange[1].href = SOMETHING

  var region_text = document.getElementById("region-text")
  region_text.innerHTML = "<p style='padding-top: 50px;'>" + summary + "</p>";
}

function ReadMore() { 
  $('#summary').scrollView();
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

// function scrollTo(hash) {
//   location.hash = "#" + hash;
// }


  // $(function() {
  //   $('a[href*=#]:not([href=#])').click(function() {
  //     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

  //       var target = $(this.hash);
  //       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
  //       if (target.length) {
  //         $('html,body').animate({
  //           scrollTop: target.offset().top
  //         }, 1000);
  //         return false;
  //       }
  //     }
  //   });
  // });
// d3.select(window).on('resize', resize); 

function resize() {   

// console.log(d3.select("subunit-boundary"))
//   // Do some resize stuff here

//     var width = parseInt(d3.select("#map").style("width")),
//       height = width / 2;

//     var x, y, k;
//     var k = 0.5;
//     var x = width / 2;
//     var y = height / 2;        

  //     // resize projection
  //     // Smaller viewport
  //     if (width <= 800) {
  //       projection
  //         .scale(width * 1.05)
  //         .translate([width / 2, ((height / 2) + 45)])             
  //     } else if (width <= 900) {
  //       projection
  //         .scale(width * 1.2)
  //         .translate([width / 2, ((height / 2) + 30)])  
  //     } 

  //     // full viewport
  //     else {
  //       projection
  //         .scale(width)
  //         .translate([width / 2, ((height / 2) + 10)])   
  //     };      

  // console.log(width)

  // svg.transition().duration(750)
  //   .attr("width", width)
  //   .attr("height", height);

  // rect.transition().duration(750)  
  //     .attr("width", width)
  //     .attr("height", height);

  // g.transition()
  //   .duration(750)
  //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");



}



