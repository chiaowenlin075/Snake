(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function() {
  window.Snakes = window.Snakes || {};

  var Snake = window.Snakes.Snake = function() {
    this.dir = "S";
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

},{}]},{},[1,2,3]);
