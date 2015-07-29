function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
// Insert your scripts here

var width = parseInt(d3.select("#map").style("width")),
  height = width / 2,
  centered;

var boxWidth = 160,
    boxHeight = 120;

var iconWidth = 10,
    iconHeight = 10;

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
    .attr("fill","#777")
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

var title = g2.select(".title")
console.log(title)

//remove existing threat icons
g2.selectAll(".threat").remove();

// D3 stuff on click
  var x, y, k, id, name, hash, green, summary, properties, boxWidth, offset, title1;
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
        p[3].push(context_data[i].id)     
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
    offset = 30;
    halfBox = boxWidth / 2;
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
    halfBox = 100;
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
  svg2.transition()
    .duration(1000)
    .attr("width",function(d) {
      return boxWidth
    });

  title.transition().duration(1000).attr("x",function(d) { return halfBox});
  // title.transition().duration(100).attr("x",function(d){return 100})

  threatBox
    .attr("width","100%")

// Right now this throws an error, could be a problem...
  g2.selectAll("text:not(.title)").attr("x",function(d) { return (boxWidth / 2) - offset});
  // g2.selectAll("text").attr("x",function(d) { return 0});

  // g2.select(".title").attr("x",function(d) { return (boxWidth / 2)});

  var text = g2.selectAll("text:not(.title)")
    .data(p[0])

  text.attr("class","update")

  text.enter().append("text")
    .attr("class","enter")
    .attr("y", function(d,i) { return (i*15)+35 })
    .attr("x",function(d) { return (boxWidth / 2) - offset});  

  text
    .text(function(d) {return d;})
    .attr("industry",function(d){
      return d
    })

  text.exit().remove();

  // for (var i = 0; i < Things.length; i++) {
  //   Things[i]
  // };

  var raw = []

  // add the boxes of the icons
  for (var k = p[1].length - 1; k >= 0; k--) {
    var iconList = p[1][k].split(",") 
    var inner = [iconList.length,p[0][k]] 
    raw.push(inner)
    // Check to make sure that the reverse for loop isn't screwing up the ordering of the threats
    for (var j = iconList.length - 1; j >= 0; j--) {
      g2.append("rect")
        .attr("class",function(d) {
          return "threat " + iconList[j]
        })     
        .attr("type",function(d){
          return iconList[j]
        })   
        .attr("industry",function(d){
          return p[0][k]
        })
        .attr("width",iconWidth)
        .attr("height",iconHeight)
        .attr("fill-opacity","0")
        .attr("y", function(d) { 
          return (k*15)+(2*iconHeight+5) 
        })
        .attr("x",function(d) {
          return (boxWidth/2)
        })
        .on("mouseover",threatHover); 
    };
  };

  // Sort Everything!!!
  raw = raw.sort(function(a,b){
    if (a[0] < b[0]) {
        return 1;
    } else if (a[0] > b[0]) { 
        return -1;
    }

    // Else go to the 2nd item
    if (a[1] < b[1]) { 
        return -1;
    } else if (a[1] > b[1]) {
        return 1
    } else { // nothing to split them
        return 0;
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
        return (i*15)+(2*iconHeight+15)
      } else{
        return (i*15)+(2*iconHeight+5)
      };      
    })
  var test = svg2.selectAll("[industry="+industry+"]:not(text)")


  test.transition().duration(1000)
    .ease("elastic")
    .delay(function(d, i) {
      return i*100+1000;
    })
    .attr("x",function(d,j){
      // console.log(test[i][j])
      return (boxWidth/2)-(j*15)-(iconWidth*2)-offset;
    })
    .attr("fill-opacity","1")
};

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
  linkBelow.href =  hash;
  
  var greenTextchange = document.getElementsByClassName("change-text")
  for (var i = greenTextchange.length - 1; i >= 0; i--) {
    greenTextchange[i].className = "change-text " + green;    
  };
  greenTextchange[1].innerHTML = button;
  // greenTextchange[1].href = SOMETHING

  var region_text = document.getElementById("region-text")
  region_text.innerHTML = "<p style='padding-top: 50px;'>" + summary + "</p>";

}

function threatHover(){
  var text = svg2.selectAll("text")
  text.transition().duration(1000)
    .attr("fill","pink")
    .attr("x","30")
}

function update2(){
  var text = svg2.selectAll("text")
  text.transition().duration(1000)
    .attr("fill","pink")
    .attr("x","30")
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



