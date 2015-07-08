// Insert your scripts here


var width = 960,
    height = 600,
    centered;

var projection = d3.geo.albersUsa();

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

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
	    .datum(topojson.mesh(regions, regions.objects.regions_usa, function(a, b) { return a !== b && a.id !== "IRL"; }))
	    .attr("d", path)
	    .attr("class", "main-boundary");

	g.append("path")
	    .datum(topojson.mesh(regions, regions.objects.states2, function(a, b) { return a !== b && a.id !== "IRL"; }))
	    .attr("d", path)
	    .attr("class", "subunit-boundary");	    


});
function clicked(d) { 
// D3 stuff on click
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2 ;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

// Add the dom elements.


}