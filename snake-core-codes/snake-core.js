(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  window.Snakes = window.Snakes || {};

  var Board = window.Snakes.Board = function(size, speed){
    this.size = size;
    this.speed = speed;
    this.snake = new window.Snakes.Snake();
    this.apple = new Snakes.Coord(5, 6);
    this.grid = this.makeGrid();
    this.placePieces();
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

  Board.prototype.getPiece = function(pos){
    return this.grid[pos[0]][pos[1]]
  };

  Board.prototype.putPiece = function(pos, piece){
    this.grid[pos[0]][pos[1]] = piece;
  };

  Board.prototype.empty = function(pos){
    return typeof this.getPiece(pos) === 'undefined';
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
    return coord.row >= 0 && coord.row < this.size &&
            coord.col >= 0 && coord.col < this.size;
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
    };
  };

  Board.prototype.placePieces = function(){
    this.generateApple();
    this.placeSnake();
    this.placeApple();
  };

})();

},{}],2:[function(require,module,exports){
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
        newCoord = new Coord(Coord.randomPos(board.size), Coord.randomPos(board.size));
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

})();

},{}],3:[function(require,module,exports){
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

  Snake.prototype.nextPos = function(){
    return this.segments[0].plus(Snake.DIRS[this.dir]);
  };

  Snake.prototype.move = function(){
    var notHeadPart = this.segments.slice(0, this.segments.length - 1);
    var newHead = this.nextPos();
    this.segments = [newHead].concat(notHeadPart);
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
    this.canTurn = true;
  };

  Snake.prototype.eatSelf = function(){
    return Snakes.Coord.include(_.rest(this.segments), _.first(this.segments));
  };

  Snake.prototype.allPos = function(){
    return this.segments.map(function(coord){
      return coord.pos;
    });
  };

})();

},{}]},{},[1,3,2]);
