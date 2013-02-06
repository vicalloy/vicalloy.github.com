(function() {
  var Block, DrawMap, HTML5DrawMap, Map, Solver, addPX, ctx, dmap, elCanvas, elMan, elMapsize, elTimer, end, fmtTime, getMapSize, getNextBlockPos, getRandomInt, go, isWin, manX, manY, mmap, move, newGame, new_recode, startTime, timer, uname, update_recode,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  fmtTime = function(t) {
    var d;
    d = new Date(null);
    d.setSeconds(t / 1000);
    return d.toTimeString().substr(3, 5);
  };

  addPX = function(px, step) {
    px = px.substring(0, px.length - 2);
    return parseInt(px) + step + 'px';
  };

  move = function(obj, direction, step) {
    var attr, d;
    if (!(step != null)) step = 10;
    attr = 'left';
    if (direction === 0 || direction === 2) attr = 'top';
    if (direction === 0 || direction === 3) step = -step;
    d = addPX(obj.css(attr), step);
    return obj.css(attr, d);
  };

  getNextBlockPos = function(x, y, direction) {
    switch (direction) {
      case 0:
        y -= 1;
        break;
      case 1:
        x += 1;
        break;
      case 2:
        y += 1;
        break;
      case 3:
        x -= 1;
    }
    return [x, y];
  };

  Block = (function() {

    function Block(mmap, x, y, direction) {
      this.mmap = mmap;
      this.x = x;
      this.y = y;
      this.walls = [true, true, true, true];
      if (mmap) mmap.mmap[x][y] = this;
      if (direction != null) {
        direction = (direction + 2) % 4;
        this.walls[direction] = false;
      }
    }

    Block.prototype.getNextBlockPos = function(direction) {
      return getNextBlockPos(this.x, this.y, direction);
    };

    Block.prototype.getNextBlock = function() {
      var direction, directions, pt, x, y, _i, _len;
      directions = _.shuffle([0, 1, 2, 3]);
      for (_i = 0, _len = directions.length; _i < _len; _i++) {
        direction = directions[_i];
        pt = this.getNextBlockPos(direction);
        x = pt[0];
        y = pt[1];
        if (x >= this.mmap.maxX || x < 0 || y >= this.mmap.maxY || y < 0) continue;
        if (this.mmap.mmap[x][y]) continue;
        this.walls[direction] = false;
        return new Block(this.mmap, x, y, direction);
      }
      return false;
    };

    return Block;

  })();

  Solver = (function() {

    function Solver() {}

    Solver.prototype.getNextStep = function(mmap, steps, block) {
      var direction, directions, pt, x, y, _i, _len;
      directions = [0, 1, 2, 3];
      for (_i = 0, _len = directions.length; _i < _len; _i++) {
        direction = directions[_i];
        if (block.walls[direction]) continue;
        pt = block.getNextBlockPos(direction);
        x = pt[0];
        y = pt[1];
        if (x >= mmap.maxX || x < 0 || y >= mmap.maxY || y < 0) continue;
        if (steps[x][y]) continue;
        steps[x][y] = true;
        return mmap.mmap[x][y];
      }
      return false;
    };

    Solver.prototype.solve = function(mmap) {
      var blockStack, dowhile, maxX, maxY, solution, steps, x, y;
      steps = (function() {
        var _ref, _results;
        _results = [];
        for (x = 0, _ref = mmap.maxX; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (y = 0, _ref2 = mmap.maxY; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
              _results2.push(false);
            }
            return _results2;
          })());
        }
        return _results;
      })();
      maxX = mmap.maxX;
      maxY = mmap.maxY;
      solution = [];
      steps[0][0] = true;
      blockStack = [mmap.mmap[0][0]];
      dowhile = function(so) {
        var block, nextBlock, o, _i, _len, _results;
        block = blockStack.pop();
        nextBlock = so.getNextStep(mmap, steps, block);
        if (nextBlock) {
          blockStack.push(block);
          blockStack.push(nextBlock);
          if (nextBlock.x === maxX - 1 && nextBlock.y === maxY - 1) {
            _results = [];
            for (_i = 0, _len = blockStack.length; _i < _len; _i++) {
              o = blockStack[_i];
              _results.push(solution.push([o.x, o.y]));
            }
            return _results;
          }
        }
      };
      while (blockStack.length) {
        dowhile(this);
      }
      return solution;
    };

    return Solver;

  })();

  Map = (function() {

    function Map() {}

    Map.prototype.resetMap = function() {
      return this.genMap(this.maxX, this.maxY);
    };

    Map.prototype.genMap = function(maxX, maxY) {
      var blockStack, dowhile, x, y, _results;
      this.maxX = maxX;
      this.maxY = maxY;
      this.mmap = (function() {
        var _ref, _results;
        _results = [];
        for (x = 0, _ref = this.maxX; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (y = 0, _ref2 = this.maxY; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
              _results2.push(false);
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }).call(this);
      blockStack = [new Block(this, getRandomInt(0, maxX - 1), getRandomInt(0, maxY - 1))];
      dowhile = function() {
        var block, nextBlock;
        if (getRandomInt(0, maxX + maxY) === 0) blockStack = _.shuffle(blockStack);
        block = blockStack.pop();
        nextBlock = block.getNextBlock();
        if (nextBlock) {
          blockStack.push(block);
          return blockStack.push(nextBlock);
        }
      };
      _results = [];
      while (blockStack.length) {
        _results.push(dowhile());
      }
      return _results;
    };

    Map.prototype.moveNext = function(x, y, direction) {
      if (this.mmap[x][y].walls[direction]) return false;
      return getNextBlockPos(x, y, direction);
    };

    return Map;

  })();

  DrawMap = (function() {

    function DrawMap(mmap, cellWidth) {
      this.mmap = mmap;
      this.cellWidth = cellWidth;
      if (this.cellWidth === void 0) this.cellWidth = 10;
    }

    DrawMap.prototype.getMapSize = function() {
      return [(this.mmap.maxX + 2) * this.cellWidth, (this.mmap.maxY + 2) * this.cellWidth];
    };

    DrawMap.prototype.createLine = function(x1, y1, x2, y2, color) {};

    DrawMap.prototype.createSolutionLine = function(x1, y1, x2, y2) {
      return this.createLine(x1, y1, x2, y2, "blue");
    };

    DrawMap.prototype.drawStart = function() {};

    DrawMap.prototype.drawEnd = function() {};

    DrawMap.prototype.getCellCenter = function(x, y) {
      var w;
      w = this.cellWidth;
      return [(x + 1) * w + w / 2, (y + 1) * w + w / 2];
    };

    DrawMap.prototype.drawSolution = function() {
      var o, p1, p2, pre, solution, _i, _len, _results;
      pre = [0, 0];
      solution = (new Solver()).solve(this.mmap);
      _results = [];
      for (_i = 0, _len = solution.length; _i < _len; _i++) {
        o = solution[_i];
        p1 = this.getCellCenter(pre[0], pre[1]);
        p2 = this.getCellCenter(o[0], o[1]);
        this.createSolutionLine(p1[0], p1[1], p2[0], p2[1]);
        _results.push(pre = o);
      }
      return _results;
    };

    DrawMap.prototype.drawCell = function(block) {
      var walls, width, x, y;
      width = this.cellWidth;
      x = block.x + 1;
      y = block.y + 1;
      walls = block.walls;
      if (walls[0]) {
        this.createLine(x * width, y * width, (x + 1) * width, y * width);
      }
      if (walls[1]) {
        this.createLine((x + 1) * width, y * width, (x + 1) * width, (y + 1) * width);
      }
      if (walls[2]) {
        this.createLine(x * width, (y + 1) * width, (x + 1) * width, (y + 1) * width);
      }
      if (walls[3]) {
        return this.createLine(x * width, y * width, x * width, (y + 1) * width);
      }
    };

    DrawMap.prototype.drawMap = function() {
      var x, y, _ref, _ref2;
      for (y = 0, _ref = this.mmap.maxY; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
        for (x = 0, _ref2 = this.mmap.maxX; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          this.drawCell(this.mmap.mmap[x][y]);
        }
      }
      this.drawStart();
      return this.drawEnd();
    };

    return DrawMap;

  })();

  HTML5DrawMap = (function(_super) {

    __extends(HTML5DrawMap, _super);

    function HTML5DrawMap(ctx, mmap, cellWidth) {
      this.ctx = ctx;
      this.mmap = mmap;
      this.cellWidth = cellWidth;
      HTML5DrawMap.__super__.constructor.call(this, this.mmap, this.cellWidth);
    }

    HTML5DrawMap.prototype.createLine = function(x1, y1, x2, y2, color) {
      if (color) this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.closePath();
      return this.ctx.strokeStyle = "black";
    };

    HTML5DrawMap.prototype.drawStart = function() {
      this.ctx.fillStyle = "red";
      return this.ctx.fillText("S", this.cellWidth + 1, this.cellWidth * 2 - 1);
    };

    HTML5DrawMap.prototype.drawEnd = function() {
      this.ctx.fillStyle = "red";
      return this.ctx.fillText("E", this.cellWidth * this.mmap.maxX + 1, this.cellWidth * (this.mmap.maxY + 1) - 1);
    };

    return HTML5DrawMap;

  })(DrawMap);

  elCanvas = $("#id-canvas");

  elMapsize = $('#id-mapsize');

  elMan = $('#id-man');

  elTimer = $('#id-timer');

  ctx = elCanvas[0].getContext("2d");

  startTime = new Date();

  mmap = new Map();

  dmap = new HTML5DrawMap(ctx, mmap, 10);

  manX = 0;

  manY = 0;

  end = false;

  timer = setInterval(function() {
    if (!end) return elTimer.text(fmtTime(new Date() - startTime));
  }, 1000);

  newGame = function() {
    var pt, size;
    manX = 0;
    manY = 0;
    end = false;
    size = parseInt(elMapsize.val());
    if (size > 100) {
      alert('map size mast <= 100');
      return;
    }
    mmap.genMap(size, size);
    elTimer.text('00:00');
    ctx.beginPath();
    ctx.clearRect(0, 0, 1500, 1500);
    startTime = new Date();
    pt = dmap.getMapSize();
    elCanvas.attr('width', pt[0]);
    elCanvas.attr('height', pt[1]);
    elMan.css('left', "12px");
    elMan.css('top', addPX("-" + elCanvas.css('height'), 12));
    dmap.drawMap();
    return update_recode();
  };

  isWin = function() {
    return manX === mmap.maxX - 1 && manY === mmap.maxY - 1;
  };

  go = function(direction) {
    var n;
    if (end) return;
    n = mmap.moveNext(manX, manY, direction);
    if (n) {
      manX = n[0];
      manY = n[1];
      move(elMan, direction);
      if (isWin()) {
        end = true;
        return new_recode();
      }
    }
  };

  $(document).keydown(function(e) {
    var k;
    k = e.keyCode || e.which;
    switch (k) {
      case 37:
        go(3);
        break;
      case 38:
        go(0);
        break;
      case 39:
        go(1);
        break;
      case 40:
        go(2);
        break;
      default:
        return true;
    }
    return false;
  });

  $('#id-btn-newgame').click(function() {
    return newGame();
  });

  $('#id-btn-solution').click(function() {
    end = true;
    dmap.drawSolution();
    return alert("Game Over");
  });

  uname = "passerby";

  getMapSize = function() {
    return elMapsize.val() + "x" + elMapsize.val();
  };

  update_recode = function() {};

  new_recode = function() {
    return alert("Congratulation, you escaped the maze.");
  };

  newGame();

}).call(this);
