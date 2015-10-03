(function() {
  window.Snakes = window.Snakes || {};

  var Board = window.Snakes.Board = function(numRows, numCols, speed){
    this.numRows = numRows;
    this.numCols = numCols;
    this.speed = null;
    this.snake = new window.Snakes.Snake();
    this.apple = new Snakes.Coord(5, 6);
    this.grid = this.makeGrid();
    this.placePieces();
    this.score = 0;
  };

  Board.APPLESCORE = 30;

  Board.prototype.makeGrid = function(){
    var grid = [];
    for(var i = 0; i < this.numRows; i++){
      grid.push(new Array(this.numCols));
    };

    return grid;
  };

  Board.prototype.getPiece = function(pos){
    return this.grid[pos[0]][pos[1]]
  };

  Board.prototype.putPiece = function(pos, piece){
    this.grid[pos[0]][pos[1]] = piece;
  };

  Board.prototype.empty = function(coord){
    return this.inBoard(coord) &&
            !Snakes.Coord.include(this.snake.segments, coord) &&
            !this.apple.equals(coord)
  };

  Board.prototype.move = function(){
    var intervalId = setInterval(function(){
      this.snake.move();
      this.eatApple();
      if (!this.inBoard(this.snake.segments[0]) || this.snake.eatSelf()) {
        console.log("Oops, You died :(");
        clearInterval(intervalId);
      } else {
        this.grid = this.makeGrid();
        this.placePieces();
        this.render();
      }
    }.bind(this), this.speed * 1000);
  };
  
  Board.prototype.render = function(){
    for (var i = 0; i < this.size; i++){
      var row = "row: " + i;
      for (var j = 0; j < this.size; j++){
        if (typeof this.grid[i][j] === 'undefined'){
          row += ".";
        } else {
          row += this.grid[i][j];
        };
      };
      console.log(row);
    };
    console.log();
  };

  Board.prototype.inBoard = function(coord) {
    return coord.row >= 0 && coord.row < this.numRows &&
            coord.col >= 0 && coord.col < this.numCols;
  };

  Board.prototype.eatApple = function(){
    var head = _.first(this.snake.segments);
    if (head.equals(this.apple)) { return true };
    return false;
  };

  Board.prototype.placeSnake = function(){
    this.snake.segments.forEach(function(coord){
      this.putPiece(coord.pos, coord);
    }.bind(this));
  };

  Board.prototype.placeApple = function(){
    this.putPiece(this.apple.pos, this.apple);
  };

  Board.prototype.generateApple = function(){
    if (this.eatApple()){
      this.score += Board.APPLESCORE;
      this.snake.segments.push(Snakes.Coord.backwardCoord(this.snake.segments));
      this.apple = Snakes.Coord.randomCoord(this);
      return true;
    };
    return false;
  };

  Board.prototype.placePieces = function(){
    this.generateApple();
    this.placeSnake();
    this.placeApple();
  };

})();
