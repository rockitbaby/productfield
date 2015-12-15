const abs = Math.abs;

export class ForceFieldDescriptor {
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
    console.log("FORECE FIELD DESC");
  }

  isField() {
    return abs(this.x) < 1 && abs(this.y) < 1;
  }

  isCore() {
    return abs(this.x) < 0.5 && abs(this.y) < 0.5;
  }

  isContext() {
    return this.isField() && !this.isCore();
  }

  isOff() {
    return !this.isField();
  }

  isInsideAspect() {
    return this.isField() && this.x < 0;
  }

  isOutsideAspect() {
    return this.isField() && this.x > 0;
  }

  isAbstractAspect() {
    return this.isField() && this.y > 0;
  }

  isConcreteAspect() {
    return this.isField() && this.y < 0;
  }

  getCharacterQuadrant() {
    if(this.isInsideAspect() && this.isAbstractAspect()) {
      return 'idea';
    }
    if(this.isOutsideAspect() && this.isAbstractAspect()) {
      return 'value';
    }
    if(this.isOutsideAspect() && this.isConcreteAspect()) {
      return 'market';
    }
    if(this.isInsideAspect() && this.isConcreteAspect()) {
      return 'resources';
    }
    return undefined;
  }

  getArea() {

    if(!this.isField()) {
      return undefined;
    }
    const map = {
      'idea': ['uniquness', 'drivers', 'goals'],
      'value': ['problem', 'users', 'motivations'],
      'market': ['competitors', 'customers', 'distribution'],
      'resources': ['solution', 'enablers', 'production'],
    };
    var areas = map[this.getCharacterQuadrant()];

    if(this.isCore()) {
      return areas[0];
    }
    if(abs(this.x) > abs(this.y)) {
      return areas[1];
    }
    if(abs(this.x) <= abs(this.y)) {
      return areas[2];
    }
  }

  getClassNames() {
    var d = [];
    if(this.isField()) {
      d.push('field');
    }
    if(this.isOff()) {
      d.push('off');
    }
    if(this.isCore()) {
      d.push('core');
    }
    if(this.isContext()) {
      d.push('context');
    }
    if(this.isInsideAspect()) {
      d.push('inside');
    }
    if(this.isOutsideAspect()) {
      d.push('outside');
    }
    if(this.isAbstractAspect()) {
      d.push('abstract');
    }
    if(this.isConcreteAspect()) {
      d.push('concrete');
    }
    var quadrant = this.getCharacterQuadrant();
    if(quadrant) {
      d.push(quadrant);
    }

    var area = this.getArea();
    if(area) {
      d.push(area);
    }
    return d.join(' ');
  }
  
}