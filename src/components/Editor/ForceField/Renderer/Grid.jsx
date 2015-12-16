import React from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';

export default React.createClass({

  render: function() {

    const offsetX = Math.floor(this.props.stageWidth / 2 - this.props.fieldSize / 2) % this.props.gridUnit;
    const offsetY = Math.floor(this.props.stageHeight / 2 - this.props.fieldSize / 2) % this.props.gridUnit

    var circles = []
    for(var x = offsetX; x < this.props.stageWidth; x = x + this.props.gridUnit) {
      for(var y = offsetY; y < this.props.stageHeight; y = y + this.props.gridUnit) {
        const [normalizedX, normalizedY] = this.props.normalizeCoordinates(x, y);
        var forceFieldDescriptor = new ForceFieldDescriptor(normalizedX, normalizedY);
        var radius = 1;
        if(forceFieldDescriptor.isCenter()) {
          continue;
        }
        if(forceFieldDescriptor.isContext()) {
          radius = 1.5;
        }
        const classNames = forceFieldDescriptor.getClassNames();
        circles.push(<circle key={`${x},${y}`} className={classNames} cx={x} cy={y} r={radius}></circle>)
      }
    }

    return <g>{circles}</g>;
  }
});
