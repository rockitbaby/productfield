import React from 'react';

export default React.createClass({

  render: function() {

    const offsetX = Math.floor(this.props.stageWidth - this.props.fieldSize) / 2 % this.props.gridUnit;
    const offsetY = Math.floor(this.props.stageHeight / 2 - this.props.fieldSize / 2) % this.props.gridUnit

    var circles = []
    for(var x = offsetX; x < this.props.stageWidth; x = x + this.props.gridUnit) {
      for(var y = offsetY; y < this.props.stageHeight; y = y + this.props.gridUnit) {
        circles.push(<circle key={`${x},${y}`} cx={x} cy={y} r='0.8'></circle>)
      }
    }

    return <g>{circles}</g>;
  }
});
