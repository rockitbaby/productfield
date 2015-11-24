import Victor from 'victor';

var EnergyVector = function(x, y, strength, absForceFieldStrength) {
  this.x = x;
  this.y = y;
  this.strength = strength;
  this.length = (this.strength / absForceFieldStrength);
  this.originVector = new Victor(x, y);

  if(x < 0) {
    this.directionVector = new Victor((-x * this.length), (-y * this.length));
  } else {
    this.directionVector = new Victor((x * this.length), (y * this.length));
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
      var vectorToPOI = new Victor(x, y);

      var weights = [];
      var energyDirectionVectors = [];

      this.energyVectors().forEach(function(energyVector, index) {
        var distance = vectorToPOI.distance(energyVector.originVector)
        weights[index] = 1 - (distance / Math.sqrt(8));
      })

      this.energyVectors().forEach(function(energyVector, index) {
        energyDirectionVectors[index] = new Victor(0, 0).copy(energyVector.directionVector);
      })

      var resultVector = energyDirectionVectors.reduce(function(prev, curr, index) {
        return prev.add(curr.multiplyScalar(weights[index]));
      }, new Victor(0, 0))

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
