(function () {
  if (typeof Snakes === "undefined") {
    window.Snakes = {};
  }

  var View = Snakes.View = function (board, $el) {
    this.$el = $el;
    this.$snakeContent = this.$el.find(".snake-content");
    this.board = board;
    this.boardRows = board.numRows;
    this.boardCols = board.numCols;
    this.eatAppleEffect = [];
    this.highestScore = 0;
    this.initialize();
    this.bindHandlers();
  };

  View.SNAKEDIR = {
    "N": "head-north",
    "S": "head-south",
    "E": "head-east",
    "W": "head-west"
  };

  View.prototype.initialize = function(){
    this.setupBoard();
    this.speedOptionButton();
    this.$el.find(".highest-score").remove();
    var $highScore = $("<h3 class='highest-score'>");
    $highScore.text("Your highest score: " + this.highestScore);
    $highScore.insertBefore(this.$snakeContent);
    var $introMsg = $("<h3 class='intro-msg'>").text("Use Arrow Key to Move!");
    this.$el.append($introMsg);
    setTimeout(function(){
      this.$el.find(".intro-msg").remove();
    }.bind(this), 3000);
  };

  View.prototype.bindHandlers = function(){
    this.handleChooseSpeed();
    this.handlekeypress();
    this.playAgain();
  };

  View.prototype.handleChooseSpeed = function () {
    this.$snakeContent.on("click", "button.speed-option", function(event){
      event.preventDefault();
      var option = $(event.currentTarget).data("speed");
      this.board.speed = option * 1000;
      this.$snakeContent.find(".speed-choices").remove();
      this.$snakeContent.append("<h2 class='score'>Score: " + this.board.score + "<h2>");
      this.makeMove();
    }.bind(this));
  };

  View.prototype.playAgain = function(){
    this.$snakeContent.on("click", "button.play-again", function(event){
      event.preventDefault();
      this.$snakeContent.empty();
      this.board = new Snakes.Board(this.boardRows, this.boardCols);
      this.initialize();
    }.bind(this));
  };

  View.prototype.makeMove = function () {
    var intervalId = setInterval(function(){
      this.board.snake.move();
      if(this.board.generateApple()){
        this.eatAppleEffect = this.board.snake.head().neighbors(this.board);
      };
      if (!this.board.inBoard(this.board.snake.segments[0]) ||
            this.board.snake.eatSelf()) {
        this.$snakeContent.append("<h2 class='lose-msg'>Oops, You died :(</h2>");
        this.$snakeContent.append("<button class='play-again'>Play Again!</button>");
        clearInterval(intervalId);
      } else {
        this.render();
        this.renderEffect();
      }
    }.bind(this), this.board.speed);
  };

  View.prototype.setupBoard = function () {
    var $ul = $("<ul class='snake-grid group'>");
    for (var i = 0; i < this.boardRows; i++){
      for (var j = 0; j < this.boardCols; j++){
        var $li = $("<li class='grid-square'>");
        $li.attr("data-pos", [i, j]);
        $ul.append($li);
      };
    };
    $ul.css({
      "width": 30 * this.boardCols,
      "height": 30 * this.boardRows
    })
    this.$snakeContent.append($ul);
  };

  View.prototype.speedOptionButton = function(){
    var $fastOption = $("<button>").text("Master")
                                   .addClass("speed-fast speed-option")
                                   .data("speed", 0.07);
    var $normalOption = $("<button>").text("Regular")
                                     .addClass("speed-normal speed-option")
<<<<<<< HEAD
                                     .data("speed", 0.12);
    var $slowOption = $("<button>").text("Beginner")
                                   .addClass("speed-slow speed-option")
                                   .data("speed", 0.18);
=======
                                     .data("speed", 0.13);
    var $slowOption = $("<button>").text("Beginner")
                                   .addClass("speed-slow speed-option")
                                   .data("speed", 0.4);
>>>>>>> master
    var $buttonDiv = $("<div class='speed-choices group'>");
    $buttonDiv.append($fastOption, $normalOption, $slowOption);
    this.$snakeContent.prepend($buttonDiv);
  };

  View.prototype.render = function(){
    this.cleanUpBoard();
    this.renderSnake();
    this.renderApple();

    this.$snakeContent.find(".score").text("Score: " + this.board.score);
    if (this.highestScore < this.board.score){
      this.highestScore = this.board.score;
      this.$el.find(".highest-score")
              .text("Your highest score: " + this.highestScore);
    };
  };

  View.prototype.renderApple = function(){
    var apple = [this.board.apple.row, this.board.apple.col];
    var $apple = $("<div class='apple group'>");
    $apple.html("<p class='apple-left'></p><p class='apple-right'></p>");
    $("[data-pos='" + apple + "']").html($apple);
  };

  View.prototype.renderSnake = function(){
    var snakePos = this.board.snake.allPos();
    var snakeHead = this.board.snake.head().pos;
    var snakeTail = this.board.snake.tail().pos;
    snakePos.forEach(function(el){
      $("[data-pos='" + el + "']").addClass("snake-body");
    });
    var $snakeHead = $("<p class='left-eye'>&#186;</p><p class='right-eye'>&#186;</p>")
    $("[data-pos='" + snakeHead + "']").addClass(View.SNAKEDIR[this.board.snake.dir])
                                       .addClass("snake-head group")
                                       .html($snakeHead);
    $("[data-pos='" + snakeTail + "']").addClass(View.SNAKEDIR[this.board.snake.tailDir()])
                                       .addClass("snake-tail");
  };

  View.prototype.renderEffect = function(){
    if (this.eatAppleEffect.length === 0){ return };
    this.eatAppleEffect.forEach(function(el){
      $("[data-pos='" + el + "']").addClass("apple-effect");
    });
    this.eatAppleEffect = [];
    setTimeout(function(){
      this.$snakeContent.find(".apple-effect").removeClass("apple-effect");
    }.bind(this), 2000);
  };

  View.prototype.cleanUpBoard = function(){
    this.$snakeContent.find(".apple").remove().removeClass("apple");
    this.$snakeContent.find(".snake-body").empty().removeClass();
  };

  View.prototype.handlekeypress = function(){
    $(document).on("keydown", function(event){
      event.preventDefault();
      if (!this.board.snake.canTurn) { return; };
      if ([37, 38, 39, 40].indexOf(event.keyCode) !== -1) {
        this.board.snake.canTurn = false;
      };
      switch (event.keyCode) {
        case 37:
          this.board.snake.turn("W");
          break;
        case 38:
          this.board.snake.turn("N");
          break;
        case 39:
          this.board.snake.turn("E");
          break;
        case 40:
          this.board.snake.turn("S");
          break;
      };
    }.bind(this));
  };

})();
