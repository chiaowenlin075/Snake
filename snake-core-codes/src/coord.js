(function() {
  window.Snakes = window.Snakes || {};

  var Coord = window.Snakes.Coord = function(row, col){
      this.row = row;
      this.col = col;
      this.pos = [row, col];
    };

    Coord.prototype.plus = function(dir){
      return new Coord(this.row + dir[0], this.col + dir[1]);
    };

    Coord.prototype.equals = function(otherCoord){
      return this.row === otherCoord.row && this.col === otherCoord.col;
    };

    Coord.randomCoord = function(board){
      var newCoord;
      do {
        newCoord = new Coord(Coord.randomPos(board.numRows), Coord.randomPos(board.numCols));
      } while (Coord.include(board.snake.segments, newCoord));

      return newCoord;
    };

    Coord.randomPos = function(max){
      return Math.floor(Math.random() * max );
    };

    Coord.backwardCoord = function(coordAry) {
      var coord1 = coordAry[coordAry.length - 2];
      var coord2 = coordAry[coordAry.length - 1];
      if (coord1.row === coord2.row) {
        var colIncrement = coord2.col - coord1.col;
        return new Coord(coord2.row, coord2.col + colIncrement);
      } else {
        var rowIncrement = coord2.row - coord1.row;
        return new Coord(coord2.row + rowIncrement, coord2.col);
      };
    };

    Coord.include = function(coordAry, otherCoord) {
      for(var i = 0; i < coordAry.length; i++){
        if (coordAry[i].equals(otherCoord)) { return true; };
      };
      return false;
    };

    Coord.prototype.neighbors = function(board){
      var that = this, neighborsAry = [], checkCoord;
      [-1, 0, 1].forEach(function(deltaRow){
        [-1, 0, 1].forEach(function(deltaCol){
          checkCoord = that.plus([deltaRow, deltaCol]);
          if (!checkCoord.equals(that) &&
                board.empty(checkCoord) &&
                !Coord.include(neighborsAry, checkCoord)){
            neighborsAry.push(checkCoord);
          };
        })
      });
      return Coord.toPos(neighborsAry);
    };

    Coord.toPos = function(coordAry){
      return coordAry.map(function(coord){
        return coord.pos;
      });
    };

    Coord.getDir = function(coord1, coord2){
      if (coord1.row === coord2.row) {
        var colIncrement = coord2.col - coord1.col;
        return colIncrement > 0 ? "W" : "E";
      } else {
        var rowIncrement = coord2.row - coord1.row;
        return rowIncrement > 0 ? "N" : "S";
      };
    };

})();
