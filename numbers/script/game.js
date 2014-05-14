// Generated by CoffeeScript 1.7.1
(function() {
  $(function() {
    var Game, animationTiles, board, boardContainer, curStep, elRecord, elTimer, game, gameContainer, isMobile, windowReszie, xSize, ySize;
    isMobile = true;
    board = $("#board");
    gameContainer = $('#game-container');
    boardContainer = $('#board-container');
    animationTiles = $('#animation-tiles');
    curStep = $('.cur-step .tb-val');
    elRecord = $('.record .tb-val');
    elTimer = $('.timer .tb-val');
    xSize = 6;
    ySize = 6;
    windowReszie = function() {
      var borderWidth, cells, cheight, mg, size, tWidth, tiles, wheight;
      borderWidth = 4;
      if ($('body').width() <= 520) {
        borderWidth = 3;
      }
      borderWidth = borderWidth;
      cells = board.find(".grid-cell");
      tWidth = board.find(".grid-row").width() + borderWidth;
      size = Math.floor(tWidth / xSize) - borderWidth;
      cells.height(size);
      cells.width(size);
      cells.css('line-height', size + 'px');
      tiles = board.find(".tile");
      tiles.height(size);
      tiles.width(size);
      tiles.css('line-height', size + 8 + 'px');
      $(".tile").each(function() {
        var n, t;
        n = $(this);
        t = $("#" + n.attr("sid"));
        if (t.length) {
          n.css("top", t.position("#board-container").top + "px");
          n.css("left", t.position("#board-container").left + "px");
          n.height(t.height() + 2);
          n.width(t.width() + 2);
          return n.css("line-height", t.height() + "px");
        }
      });
      wheight = $(window).height();
      cheight = $('#container').height();
      if (isMobile) {
        mg = (wheight - cheight) / 3;
        return $('#container').css('margin-top', mg + 'px');
      }
    };
    Game = (function() {
      function Game(xSize, ySize) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.numCount = this.xSize * this.ySize;
        this.sw = new Stopwatch($('.timer .tb-val')[0], {
          game: this
        });
      }

      Game.prototype.initPool = function() {
        var i, _results;
        this.pool = new Array(this.numCount);
        i = 0;
        _results = [];
        while (i < this.pool.length) {
          this.pool[i] = i + 1;
          _results.push(i++);
        }
        return _results;
      };

      Game.prototype.getNumber = function() {
        var index, pool;
        pool = this.pool;
        if (pool.length === 0) {
          throw "No numbers left";
        }
        index = Math.floor(pool.length * Math.random());
        return pool.splice(index, 1)[0];
      };

      Game.prototype.buildBoard = function() {
        var cell, row, x, y, _results;
        y = 0;
        _results = [];
        while (y < this.ySize) {
          row = $('<div class="grid-row"/>');
          x = 0;
          while (x < this.xSize) {
            cell = $('<div class="grid-cell"><div class="tile">' + this.getNumber() + '</div></div>');
            cell.attr("id", "title-" + x + "-" + y);
            row.append(cell);
            x++;
          }
          board.append(row);
          _results.push(y++);
        }
        return _results;
      };

      Game.prototype.initTile = function(newTile, tdTile) {
        var n, t;
        n = newTile;
        t = tdTile;
        n.height(t.height() + 2);
        n.width(t.width() + 2);
        n.css("line-height", t.height() + "px");
        n.css("top", t.position("#board-container").top + "px");
        n.css("left", t.position("#board-container").left + "px");
        return n.attr("sid", t.attr("id"));
      };

      Game.prototype.initEvent = function() {
        var self;
        self = this;
        return this.cells.mousedown(function() {
          var ok, t;
          t = $(this);
          if (t.hasClass("clicked")) {
            return;
          }
          ok = false;
          if (parseInt(t.text()) === self.step) {
            ok = true;
            t.addClass("clicked");
            if (self.step === self.numCount) {
              self.endGame(clear);
            }
            self.step += 1;
            curStep.text(self.step);
          }
          if (!ok) {
            t.addClass("invalid-clicked");
            return setTimeout((function() {
              t.removeClass("invalid-clicked");
            }), 100);
          }
        });
      };

      Game.prototype.endGame = function(tp) {
        this.sw.stop();
        return setTimeout((function() {
          if (tp === 'clear' && elRecord.text() > elTimer.text()) {
            tp = 'record';
          }
          if (tp === 'timeout') {
            $('.game-message p').text('Timeout!');
            $('.game-message').addClass('game-over');
          }
          if (tp === 'clear') {
            $('.game-message p').text('Clear!');
            $('.game-message').addClass('game-over');
          }
          if (tp === 'record') {
            $('.game-message p').html('Record ' + $('.timer .tb-val').html() + 's');
            elRecord.text(elTimer.text());
            return $('.game-message').addClass('game-won');
          }
        }), 50);
      };

      Game.prototype.newGame = function() {
        $('.game-message').attr('class', 'game-message');
        this.step = 1;
        this.sw.reset();
        this.sw.start();
        curStep.text(self.step);
        board.html('');
        animationTiles.html('');
        this.initPool();
        this.buildBoard();
        windowReszie();
        this.cells = board.find(".grid-cell");
        return this.initEvent();
      };

      return Game;

    })();
    game = new Game(xSize, ySize);
    $(window).resize(windowReszie);
    game.newGame();
    return $('.btn-new-game').click(function() {
      return game.newGame();
    });
  });

}).call(this);
