(function() {
  window.Snakes = window.Snakes || {};

  var Snake = window.Snakes.Snake = function() {
    this.dir = "S";
    this.segments = [];
    this.putSnake();
  };

  Snake.DIRS = {
    "W": [ 0,-1], // new Snakes.Coord( 0,-1);
    "S": [ 1, 0], // new Snakes.Coord( 1, 0);
    "E": [ 0, 1], // new Snakes.Coord( 0, 1);
    "N": [-1, 0]  // new Snakes.Coord(-1, 0);
  };

  Snake.prototype.putSnake = function(){
    for(var i = 0; i < 4; i++){
      var coord = new Snakes.Coord(3, 2 + i);
      this.segments.push(coord);
    };
  };

  Snake.prototype.move = function(){
    var notHeadPart = this.segments.slice(0, this.segments.length - 1);
    var newHead = this.segments[0].plus(Snake.DIRS[this.dir]);
    this.segments = [newHead].concat(notHeadPart);
  };

  Snake.prototype.turn = function(dir){
    this.dir = dir;
  };

  Snake.prototype.eatSelf = function(){
    var head = this.segments[0];
    for (var i = 1; i < this.segments.length; i++){
      if(head.equals(this.segments[i])) {
        return true
      };
    };
    return false;
  };

  Snake.prototype.allPos = function(){
    var pos = [];
    this.segments.forEach(function(el){
      pos.push([el.row, el.col]);
    })

    return pos;
  };

})();
