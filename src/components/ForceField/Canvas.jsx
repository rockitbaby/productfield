import d3 from 'd3';
import jquery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyles from '../../styles/GlobalStyles'
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import {Map} from 'immutable';
import {ForceFieldCalculationSingleton, coordinateSystemTransformation} from '../../ForceFieldCalculation';

export default Radium(React.createClass({
  mixins: [PureRenderMixin],

  componentWillReceiveProps: function(nextProps) {
    var calculationPoints = coordinateSystemTransformation(nextProps.points)
    ForceFieldCalculationSingleton.getInstance().setEnergies(calculationPoints);
  },

  componentDidMount: function() {

    var width = $("#field").width();
    var height = $("#field").height();

    var coreSize = 480;
    var dotsOffset = 100;
    var edgeSize = 20;
    var triangleSize = 2.5;
    var minLengthForArrowsToDisplay = 2;

    //Creates overall svgContainer
    var svgContainer = d3.select(".force-field-canvas").append("svg").attr("width", width).attr("height", height);

    //Creates inner svgContainer for the inner Field
    var coreContainer = svgContainer.append("svg")
                                    .attr("width", coreSize)
                                    .attr("height", coreSize)
                                    .attr("x", width/2 - coreSize/2)
                                    .attr("y", height/2 - coreSize/2);

    //Creates all Points for the Forcefield
    for(var x = edgeSize; x < width; x = x + edgeSize){
      for(var y = edgeSize; y < height; y = y + edgeSize){
        //Get Forefieldvectors and already calculated values for directions of points and arrows
        var forceField = ForceFieldCalculationSingleton.getInstance();
        var result = forceField.forceVectorAtPoint(x,y);

        var length = Math.sqrt(Math.pow(result.x/edgeSize, 2) + Math.pow(result.y/edgeSize, 2));

        svgContainer.append("circle")
                       .attr("cx", x)
                       .attr("cy", y)
                       .attr("r", .8)
                       .style("fill", "blue");
        //Show Arrows and lines only if they're long enough
        if(length > minLengthForArrowsToDisplay) {
          var xDelta = result.x / edgeSize;
          var yDelta = result.y / edgeSize;

          var x2 = x;
          var y2 = y - length;

          console.log(xDelta + "  "+yDelta);


          //creates the lines
          var line = svgContainer.append("line")
                       .attr("x1", x)
                       .attr("y1", y)
                       .attr("x2", x2)
                       .attr("y2", y2)
                       .attr("stroke-width", 1)
                       .attr("stroke", "black");

          //creates arrow-triangles on spares of lines
          var triangleCoordinates = [x2, y2, x2 + triangleSize, y2, x2, y2 - triangleSize, x2 - triangleSize, y2, x2,y2].join();
          var triangleSvg = svgContainer.append("polyline")
                       .attr("points", triangleCoordinates)
                       .style("fill", "black");

          //Calculation of degree for direction
          var a = Math.atan(result.y / result.x);
          var deg = (180 / Math.PI) * a;

          if(yDelta > 0) {
            var deg = 180 / a;
          } else {
            var deg = 180 / a + 180;
          }

          //Rotation of triangle and line in dependence of direction degree
          triangleSvg.attr("transform", "rotate("+deg+","+ x +","+ y +")" );
          line.attr("transform", "rotate("+deg+","+ x +","+ y +")" );
        }
      }

    }

    //creates inner blue Circle for the Field
    coreContainer.append("circle")
                 .attr("cx", coreSize/2)
                 .attr("cy", coreSize/2)
                 .attr("r", 40)
                 .style("fill", "none")
                 .style("stroke-opacity", .5)
                 .style("stroke", "blue");

    //Coordinates for the 4 dots as marker
    var dotsCoordinates = [
              {cx: dotsOffset , cy: dotsOffset},
              {cx:  dotsOffset , cy: coreSize - dotsOffset},
              {cx: coreSize  - dotsOffset , cy: + dotsOffset},
              {cx: coreSize  - dotsOffset , cy: coreSize - dotsOffset}
            ];

    //Coordinates for the the edges as marker
    var edgesCoordinates =  [
        //Top-Left
        [0,edgeSize,edgeSize,edgeSize,edgeSize,0].join(),
        //Bottom-Left
        [0,coreSize - edgeSize,edgeSize,coreSize - edgeSize,edgeSize,coreSize].join(),
        //Bottom-Right
        [coreSize - edgeSize, coreSize, coreSize - edgeSize, coreSize - edgeSize, coreSize, coreSize - edgeSize].join(),
        //Top-Right
        [coreSize - edgeSize, 0, coreSize - edgeSize, edgeSize, coreSize, edgeSize].join()
    ];

    dotsCoordinates.map( dot => {
      coreContainer.append("circle")
                   .attr("r", 2.5)
                   .attr("cx", dot.cx)
                   .attr("cy", dot.cy)
                   .style("fill", "blue");
    });

    edgesCoordinates.map( edge => {
      coreContainer.append("polyline")
                   .attr("points", edge)
                   .style("fill", "none")
                   .style("stroke-opacity", .7)
                   .style("stroke", "blue");
    });

  },

  render: function() {
    const canvasStyle = this.getCanvasStyle();
    return <div className='force-field-canvas' style={canvasStyle}></div>
  },

  getCanvasStyle: function() {
    return {
      height: '100%',
      width: '100%',
    }
  }
}));
