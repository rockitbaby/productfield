import Vector from 'victor';

export class ForceFieldCalculator {
  constructor(energies) {
    this.energies = energies;
  }

  absStrengthSum() {
    return this.energies.reduce((prev, current) => {
      return prev + Math.abs(current.strength);
    }, 0);
  }

  forceVectorAtPoint(x, y) {
    const vectorToPOI = new Vector(x, y);
    const absStrengthSum = this.absStrengthSum();

    return this.energies.reduce(
      (result, energy) => {
        const energyVector = new Vector(energy.x, energy.y);
        const distance = vectorToPOI.distance(energyVector)
        const weight = (1 / Math.pow(distance + 1, 1.25));
        const length = energy.strength / absStrengthSum;
        const energyDirectionVector = directionVector(energyVector, length);
        return result.add(energyDirectionVector.multiplyScalar(weight));
      },
      new Vector(0, 0),
    );
  }
}

function directionVector(energyVector, length) {
  const sign = (energyVector.x > 0) ? 1 : -1;
  return energyVector.clone().multiplyScalar(sign * length);
}
