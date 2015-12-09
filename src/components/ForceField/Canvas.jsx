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
    var calculationPoints = coordinateSystemTransformation(nextProps.get('points').toJS())
    ForceFieldCalculationSingleton.getInstance().setEnergies(calculationPoints);
  },

  componentDidMount: function() {

    var width = $("#field").width();
    var height = $("#field").height();

    var coreSize = 480;
    var dotsOffset = 100;
    var edgeSize = 20;

    var svgContainer = d3.select(".force-field-canvas").append("svg").attr("width", width).attr("height", height);


    var coreContainer = svgContainer.append("svg")
                                    .attr("width", coreSize)
                                    .attr("height", coreSize)
                                    .attr("x", width/2 - coreSize/2)
                                    .attr("y", height/2 - coreSize/2);

    for(var x = edgeSize; x < width; x = x + edgeSize){
      for(var y = edgeSize; y < height; y = y + edgeSize){
        svgContainer.append("circle")
                     .attr("cx", x)
                     .attr("cy", y)
                     .attr("r", .8)
                     .style("fill", "blue")
      }
    }

    coreContainer.append("circle")
                 .attr("cx", coreSize/2)
                 .attr("cy", coreSize/2)
                 .attr("r", 30)
                 .style("fill", "none")
                 .style("stroke-opacity", .5)
                 .style("stroke", "blue");

    var dotsCoordinates = [
              {cx: dotsOffset , cy: dotsOffset, points: "0,15,15,15,15,0" },
              {cx:  dotsOffset , cy: coreSize - dotsOffset},
              {cx: coreSize  - dotsOffset , cy: + dotsOffset},
              {cx: coreSize  - dotsOffset , cy: coreSize - dotsOffset}
            ];

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
      var circle = coreContainer.append("circle")
                                     .attr("r", 2.5)
                                     .attr("cx", dot.cx)
                                     .attr("cy", dot.cy)
                                     .style("fill", "blue");
    });

    edgesCoordinates.map( edge => {
      var circle = coreContainer.append("polyline")
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
