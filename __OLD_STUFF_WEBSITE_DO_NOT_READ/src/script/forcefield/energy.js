
interact('.energy')
.draggable({
  onstart: function (event) {
    var $target = $(event.target);
    $target.addClass('dragging');
  },
  onend: function (event) {
    console.log("sd");
    var $target = $(event.target);
    var energy = $target.data('energy');
    energy.setPos($target.data('x'), $target.data('y'));
    $target.removeClass('dragging');
    $target.addClass('updating');
  },
  onmove: function(event) {
    var $target = $(event.target),
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat($target.data('x')) || 0) + event.dx,
      y = (parseFloat($target.data('y')) || 0) + event.dy;

    $target.data('x', x);
    $target.data('y', y);
    $target.css({
      top: y,
      left: x
    });
  }
});

function disableUpdateState() {
  $('.energy').removeClass('updating');
}

function EnergyEditor() {
  var $EE = $('.EnergyEditor');
  var $strength = $EE.find('.EnergyEditor-strength');
  var $remove = $EE.find('a.delete');
  var $close = $EE.find('a.close');
  console.log($close);
  var self = this;
  var $activeEnergy = null;

  $remove.click(function(e) {
    if(!$activeEnergy) {
      return;
    }
    var energy = $activeEnergy.data('energy');
    var index = energies.indexOf(energy);
    if (index > -1) {
      energies.splice(index, 1);
    }
    $activeEnergy.remove();
    self.unsetActiveEngery();
  });

  $close.click(function(e) {
    if(!$activeEnergy) {
      return;
    }
    self.unsetActiveEngery();
  });

  $strength.change(function() {
    if(!$activeEnergy) {
      return;
    }
    var energy = $activeEnergy.data('energy');
    energy.setForce($('.EnergyEditor-strength').val());
    $activeEnergy.addClass('updating');
  });

  self.setActiveEnergy = function($elm) {
    if($activeEnergy) {
      $activeEnergy.removeClass('active');
    }
    $activeEnergy = $elm;
    $activeEnergy.addClass('active');
    var energy = $activeEnergy.data('energy');
    $strength.val(energy.getForce());
    $EE.addClass('active');
  }

  self.unsetActiveEngery = function() {
    $activeEnergy.removeClass('active');
    $activeEnergy = null;
    $EE.removeClass('active');
  }
}

function addEnergy(x, y) {

  var $elm = $('<div class="energy"></div>');

  $elm.css({
    top: y,
    left: x
  });
  $header.append($elm);
  var e = new Energy(createVector(x, y));

  $elm.data('energy', e);
  $elm.data('x', x);
  $elm.data('y', y);
  $elm.addClass('updating');

  
  $elm.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    EE.setActiveEnergy($elm);
  });

  energies.push(e);

  EE.setActiveEnergy($elm);

}

function Energy(_pos) {

  var self = this;
  var pos = _pos;
  var force = 1;

  // determine pull or push characteristics

  var fieldWidth = GU * 8;
  var d = min(max(w / 2 - pos.x, -fieldWidth), fieldWidth) / fieldWidth;

  self.getQuality = function(q) {
   return force;
  }
  self.getForce = function() {
   return force;
  }
  self.setForce = function(f) {
   force = f;
  }
  self.setPos = function(x, y) {
    pos = createVector(x, y);
    d = min(max(w / 2 - pos.x, -fieldWidth), fieldWidth) / fieldWidth;
  }
  self.getPos = function() {
   return pos;
  }
  self.draw = function() {
    fill("#FFFFFF");
    noStroke();
    ellipse(pos.x, pos.y, 18, 18);
    var c = "#000000";
    if(force > 0) {
      c = cGreen;
    } else if (force < 0) {
      c = cRed;
    }
    fill(c);
    ellipse(pos.x, pos.y, 6, 6);
    noFill();
    stroke(c);
    ellipse(pos.x, pos.y, 20 + 2, 20 + 2);
    if(abs(force) > 1) {
      ellipse(pos.x, pos.y, 20 + 8, 20 + 8);
    }
    if(abs(force) > 2) {
      ellipse(pos.x, pos.y, 20 + 14, 20 + 14);
    }

    fill(c);
    textAlign(CENTER);
    //text(force, self.pos.x, self.pos.y + 9 / 2);
  }
  self.d = function() {
    return d;
  }
  self.isPull = function() {
    return (d < 0);
  }
  self.isPush = function() {
    return (d > 0);
  }


}