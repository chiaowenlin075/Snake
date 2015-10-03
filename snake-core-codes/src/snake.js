(function() {
  window.Snakes = window.Snakes || {};

  var Snake = window.Snakes.Snake = function() {
    this.dir = "S";
    this.canTurn = true;
    this.segments = [];
    this.putSnake();
  };

  Snake.DIRS = {
    "W": [ 0,-1],
    "S": [ 1, 0],
    "E": [ 0, 1],
    "N": [-1, 0]
  };

  Snake.prototype.putSnake = function(){
    for(var i = 0; i < 4; i++){
      var coord = new Snakes.Coord(3, 2 + i);
      this.segments.push(coord);
    };
  };

  Snake.prototype.head = function(){
    return _.first(this.segments);
  };

  Snake.prototype.tail = function(){
    return _.last(this.segments);
  };

  Snake.prototype.nextPos = function(){
    return this.head().plus(Snake.DIRS[this.dir]);
  };

  Snake.prototype.move = function(){
    var notHeadPart = this.segments.slice(0, this.segments.length - 1);
    var newHead = this.nextPos();
    this.segments = [newHead].concat(notHeadPart);
    this.canTurn = true;
  };

  Snake.prototype.validTurn = function(dir){
    NorS = ["N", "S"];
    EorW = ["E", "W"];
    return !(NorS.indexOf(dir) !== -1 && NorS.indexOf(this.dir) !== -1) &&
            !(EorW.indexOf(dir) !== -1 && EorW.indexOf(this.dir) !== -1)
  };

  Snake.prototype.turn = function(dir){
    if (this.validTurn(dir)) {
      this.dir = dir;
    };
  };

  Snake.prototype.eatSelf = function(){
    return Snakes.Coord.include(_.rest(this.segments), this.head());
  };

  Snake.prototype.allPos = function(){
    return Snakes.Coord.toPos(this.segments);
  };

  Snake.prototype.tailDir = function(){
    var lastTwoSeg = _.rest(this.segments, this.segments.length - 2);
    return Snakes.Coord.getDir(lastTwoSeg[0], lastTwoSeg[1]);
  };

})();
