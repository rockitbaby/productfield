import React, {Component, PropTypes} from 'react';
import styles from '../../../../styles/main.css';

export class Marker extends Component {

  render() {
    const {stageWidth, stageHeight, fieldSize, gridUnit, skin: {marker}} = this.props;
    const centerX = Math.floor(stageWidth / 2 - fieldSize / 2);
    const centerY = Math.floor(stageHeight / 2 - fieldSize / 2);
    const circleRadius = Math.sqrt(2 * gridUnit * gridUnit);

    var characterMarkerCoordinates = [
      2 * gridUnit - 1/2 * gridUnit,
      2 * gridUnit,
      2 * gridUnit,
      2 * gridUnit,
      2 * gridUnit,
      2 * gridUnit - 1/2 * gridUnit
    ].join()

    var quadrantMarkers = [];

    var gu5 = 5 * gridUnit;

    [0, 90, 180, 270].forEach(function(deg) {

      var transform = "rotate(" + deg + ", " + 10 * gridUnit + ", " + 10 * gridUnit + ")";

      quadrantMarkers.push(
        <g key={deg} transform={transform}>
        <polyline points={characterMarkerCoordinates} strokeWidth='2' fill='none' stroke={marker} />
        <circle r={4} cx={gu5} cy={gu5} fill={marker} />
        </g>
      );

    });

    return (
      <svg className='Renderer-marker' width={fieldSize} height={fieldSize} x={centerX} y={centerY}>
        <rect className={styles['u-visual-debug']} width={fieldSize} height={fieldSize} />
        <circle cx={fieldSize / 2} cy={fieldSize / 2} r={circleRadius} fill='none' strokeWidth='2' stroke={marker} />
        <g>{quadrantMarkers}</g>
      </svg>
    );
  }
}

Marker.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    marker: PropTypes.string.isRequired,
  }).isRequired,
};

/*
var properties = this.getProperties();

var fieldSize = properties.fieldSize;
var gridUnit = properties.gridUnit;
var gridUnit = properties.gridUnit;

var triangleSize = properties.triangleSize;
var minLengthForArrowsToDisplay = properties.minLengthForArrowsToDisplay;

var width = properties.width - 5;
var height = properties.height - 5;

//Creates overall svgContainer
d3.select(".force-field-canvas").select('svg').remove();
var svgContainer = d3.select(".force-field-canvas").append("svg").attr("width", width).attr("height", height)

this.renderPoints(svgContainer);

//Creates inner svgContainer for the inner Field
var coreContainer = svgContainer.append("svg")
                                .attr("width", fieldSize)
                                .attr("height", fieldSize)
                                .attr("x", Math.floor(width / 2 - fieldSize / 2))
                                .attr("y", Math.floor(height / 2 - fieldSize / 2));

coreContainer.append("rect")
                    .attr("class", "visual-debug")
                    .attr("width", fieldSize)
                    .attr("height", fieldSize)
                    .style("fill", "RGBA(255, 0, 0, 0.4)")

//creates inner blue Circle for the Field
coreContainer.append("circle")
             .attr("cx", fieldSize/2)
             .attr("cy", fieldSize/2)
             .attr("r", Math.sqrt(2 * gridUnit * gridUnit))
             .style("fill", "none")
             .style("stroke-opacity", 1)
             .style("stroke-width", 2)
             .style("stroke", properties.skin.marker);


//Coordinates for the the edges as marker
var characterMarkerCoordinates = [2 * gridUnit - 1/2 * gridUnit,2 * gridUnit,2 * gridUnit,2 * gridUnit,2 * gridUnit,2 * gridUnit - 1/2 * gridUnit].join()

var g = coreContainer.append("g")
             .attr("width", 10 * gridUnit)
             .attr("height", 10 * gridUnit)
             .attr("id", "chrome");

[0, 90, 180, 270].forEach(function(deg) {
  g.append("polyline")
                 .attr("points", characterMarkerCoordinates)
                 .style("fill", "none")
                 .style("stroke-opacity", .7)
                 .style("stroke-width", 2)
                 .style("stroke", properties.skin.marker)
                 .attr("transform", "rotate(" + deg + ", " + 10 * gridUnit + ", " + 10 * gridUnit + ")")

  g.append("circle")
                 .attr("r", 2.5)
                 .attr("cx", 5 * gridUnit)
                 .attr("cy", 5 * gridUnit)
                 .style("fill", properties.skin.marker)
                 .attr("transform", "rotate(" + deg + ", " + 10 * gridUnit + ", " + 10 * gridUnit + ")")

});

*/
