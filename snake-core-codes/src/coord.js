(function() {
  window.Snakes = window.Snakes || {};

  var Coord = window.Snakes.Coord = function(row, col){
    this.row = row;
    this.col = col;
  };

  Coord.prototype.plus = function(dir){
    return new Coord(this.row + dir[0], this.col + dir[1]);
  };

  Coord.prototype.equals = function(otherCoord){
    return this.row === otherCoord.row && this.col === otherCoord.col;
  };

  Coord.randomCoord = function(maxX, maxY){
    return new Coord(Coord.randomPos(maxX), Coord.randomPos(maxY));
  };

  Coord.randomPos = function(max){
    return Math.floor(Math.random() * max );
  };

  Coord.backwardCoord = function(coord1, coord2) {
    if (coord1.row === coord2.row) {
      var colIncrement = coord2.col - coord1.col;
      return new Coord(coord2.row, coord2.col + colIncrement);
    } else {
      var rowIncrement = coord2.row - coord1.row;
      return new Coord(coord2.row + rowIncrement, coord2.col);
    };
  };

})();
