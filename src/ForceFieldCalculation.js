import Victor from 'victor';

var EnergyVector = function(x, y, strength, absForceFieldStrength) {
  var length = strength / absForceFieldStrength;

  function directionVector (x, length) {
    var sign = (x > 0) ? 1 : -1;
    return new Victor(sign * x * length, sign * y * length);
  }

  return {
    x: x,
    y: y,
    strength: strength,
    length: length,
    originVector: new Victor(x, y),
    directionVector: directionVector(x, length)
  }
}

export const coordinateSystemTransformation = function(points) {
  return points.map(function(point) {
    return {
      x: (point.x - 50) / 50,
      y: (point.y - 50) / 50,
      strength: point.strength
    }
  })
}


export const ForceFieldCalculationSingleton =  (function () {
  var instance;

  var ForceFieldCalculation = function() {
    this.energies = [];

    this.setEnergies = function (newEnergies) {
      this.energies = newEnergies;
    }

    this.absStrengthSum = function() {
      var sum = 0;
      this.energies.forEach(function(energy) {
        sum = sum + Math.abs(energy.strength);
      })
      return sum;
    }

    this.energyVectors = function() {
      var energyVectors = [];
      var absStrengthSum = this.absStrengthSum();

      this.energies.forEach(function(energy) {
        energyVectors.push(new EnergyVector(energy.x, energy.y, energy.strength, absStrengthSum));
      });
      return energyVectors;
    }

    this.forceVectorAtPoint = function(x, y) {
      const vectorToPOI = new Victor(x, y);

      const weights = this.energyVectors().map((energyVector) => {
        const distance = vectorToPOI.distance(energyVector.originVector)
        return 1 - (distance / Math.sqrt(8));
      });

      const energyDirectionVectors = this.energyVectors().map((energyVector) => {
        return new Victor(0, 0).copy(energyVector.directionVector);
      });

      const resultVector = energyDirectionVectors.reduce((prev, curr, index) => {
        return prev.add(curr.multiplyScalar(weights[index]));
      }, new Victor(0, 0));

      return resultVector;
    }
  }

  function getInstance () {
    if (!instance) {
      instance = new ForceFieldCalculation()
    }

    return instance;
  }

  return {
    getInstance: getInstance
  }
})();
