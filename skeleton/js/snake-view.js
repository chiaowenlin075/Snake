(function () {
  if (typeof Snakes === "undefined") {
    window.Snakes = {};
  }

  var View = Snakes.View = function (board, $el) {
    this.board = board;
    this.$el = $el;
    this.setupBoard();
    this.speedOptionButton();
    this.bindEvents();
  };

  View.prototype.bindEvents = function () {
    this.$el.on("click", "button", function(e){
      var option = $(e.currentTarget).data("speed");
      this.board.speed = option * 1000;
      this.makeMove();
    }.bind(this));
  };

  View.prototype.makeMove = function () {
    var intervalId = setInterval(function(){
      this.board.snake.move();
      this.board.eatApple();
      this.render();
      if (!this.board.onBoard() || this.board.snake.eatSelf()) {
        // this.$el.append("<h2>Oops, You died :(</h2>");
        alert("Oops, You died :(");
        // need to provide a way to let user play again!
        clearInterval(intervalId);
      } else {
        this.board.grid = this.board.makeGrid();
        this.board.placeSnake();
        this.board.placeApple();
      }
    }.bind(this), this.board.speed);
  };

  View.prototype.setupBoard = function () {
    var $ul = $("<ul></ul>").addClass("snake-grid group");
    for (var i = 0; i < this.board.grid.length; i++){
      for (var j = 0; j < this.board.grid.length; j++){
        var $li = $("<li></li>").addClass("grid-square");
        $li.attr("data-pos", [i, j]);
        $ul.append($li);
      };
    };

    this.$el.append($ul);
  };

  View.prototype.speedOptionButton = function(){
    var $fastOption = $("<button>Master</button>").addClass("speed-fast").data("speed", 0.07);
    var $normalOption = $("<button>Regular</button>").addClass("speed-normal").data("speed", 0.2);
    var $slowOption = $("<button>Beginner</button>").addClass("speed-slow").data("speed", 0.5);
    var buttonDiv = $("<div></div>").addClass("button-choices group");
    buttonDiv.append($fastOption, $normalOption, $slowOption);
    this.$el.append(buttonDiv);
  };

  View.prototype.render = function(){
    this.$el.empty();
    this.setupBoard();

    var snakePos = this.board.snake.allPos();
    var apple = [this.board.apple.row, this.board.apple.col];
    snakePos.forEach(function(el){
      $("[data-pos='" + el + "']").addClass("snake-body");
    })

    $("[data-pos='" + apple + "']").addClass("apple");
    this.$el.append("<h2>Score: " + this.board.score + "</h2>");
  };

})();
