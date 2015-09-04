(function() {
  window.Snakes = window.Snakes || {};

  var Board = window.Snakes.Board = function(size, speed){
    this.size = size;
    this.speed = speed;
    this.snake = new window.Snakes.Snake();
    this.apple = new Snakes.Coord(5, 6);
    this.grid = this.makeGrid();
    this.placeSnake();
    this.bindKeys();
    this.score = 0;
  };

  Board.APPLESCORE = 30;

  Board.prototype.makeGrid = function(){
    var grid = [];
    for(var i = 0; i < this.size; i++){
      grid.push(new Array(this.size));
    };

    return grid;
  };

  Board.prototype.placeSnake = function(){
    this.snake.segments.forEach(function(coord){
      this.grid[coord.row][coord.col] = "S";
    }.bind(this));
  };


  Board.prototype.move = function(){
    var intervalId = setInterval(function(){
      this.snake.move();
      this.eatApple();
      if (!this.onBoard() || this.snake.eatSelf()) {
        console.log("Oops, You died :(");
        clearInterval(intervalId);
      } else {
        this.grid = this.makeGrid();
        this.placeSnake();
        this.placeApple();
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

  Board.prototype.onBoard = function() {
    var head = this.snake.segments[0];
    return head.row >= 0 && head.row < this.size && head.col >= 0 && head.col < this.size;
  };

  Board.prototype.bindKeys = function() {
    key('up', function() { this.snake.turn("N") }.bind(this));
    key('down', function() { this.snake.turn("S") }.bind(this));
    key('left', function() { this.snake.turn("W") }.bind(this));
    key('right', function() { this.snake.turn("E") }.bind(this));
  };

  Board.prototype.eatApple = function(){
    var head = this.snake.segments[0];
    if (head.equals(this.apple)) {
      this.score += Board.APPLESCORE;
      var snakeLength = this.snake.segments.length;
      var lastSeg = this.snake.segments[snakeLength - 1];
      var secToLastSeg = this.snake.segments[snakeLength - 2];
      this.snake.segments.push(Snakes.Coord.backwardCoord(secToLastSeg, lastSeg));
      this.apple = Snakes.Coord.randomCoord(this.size, this.size);
    };
  };

  Board.prototype.placeApple = function(){
    this.grid[this.apple.row][this.apple.col] = "A";
  };

})();
