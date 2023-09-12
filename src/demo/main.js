var curveData = [{ x: 190, y: 100 }, { x: 360, y: 150 }];
var edge = d3.select('svg').append('g');
var diagonal = d3.svg.diagonal()
  .source(function (d) { return { x: d[0].y, y: d[0].x }; })            
  .target(function (d) { return { x: d[1].y, y: d[1].x }; })
  .projection(function (d) { return [d.y, d.x]; });
   
d3.select('g')
  .datum(curveData)
  .append('path')
  .attr('class', 'link')
  .attr('d', diagonal)
  .attr('stroke', '#444')
  .attr('stroke-width', 2)
  .attr('fill', 'none');