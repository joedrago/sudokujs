(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Board, SudokuGenerator, shuffle;

shuffle = function(a) {
  var i, j, t;
  i = a.length;
  while (--i > 0) {
    j = ~~(Math.random() * (i + 1));
    t = a[j];
    a[j] = a[i];
    a[i] = t;
  }
  return a;
};

Board = (function() {
  function Board(otherBoard) {
    var i, j, k, l, m;
    if (otherBoard == null) {
      otherBoard = null;
    }
    this.grid = new Array(9).fill(null);
    this.locked = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      this.grid[i] = new Array(9).fill(0);
      this.locked[i] = new Array(9).fill(false);
    }
    if (otherBoard !== null) {
      for (j = l = 0; l < 9; j = ++l) {
        for (i = m = 0; m < 9; i = ++m) {
          this.grid[i][j] = otherBoard.grid[i][j];
          this.locked[i][j] = otherBoard.locked[i][j];
        }
      }
    }
    return;
  }

  Board.prototype.matches = function(otherBoard) {
    var i, j, k, l;
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        if (this.grid[i][j] !== otherBoard.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  return Board;

})();

SudokuGenerator = (function() {
  SudokuGenerator.difficulty = {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 4
  };

  function SudokuGenerator() {}

  SudokuGenerator.prototype.boardToGrid = function(board) {
    var i, j, k, l, m, newBoard;
    newBoard = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      newBoard[i] = new Array(9).fill(0);
    }
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (board.locked[i][j]) {
          newBoard[i][j] = board.grid[i][j];
        }
      }
    }
    return newBoard;
  };

  SudokuGenerator.prototype.cellValid = function(board, x, y, v) {
    var i, j, k, l, m, sx, sy;
    for (i = k = 0; k < 9; i = ++k) {
      if ((x !== i) && (board.grid[i][y] === v)) {
        return false;
      }
      if ((y !== i) && (board.grid[x][i] === v)) {
        return false;
      }
    }
    sx = Math.floor(x / 3) * 3;
    sy = Math.floor(y / 3) * 3;
    for (j = l = 0; l < 3; j = ++l) {
      for (i = m = 0; m < 3; i = ++m) {
        if ((x !== (sx + i)) && (y !== (sy + j))) {
          if (board.grid[sx + i][sy + j] === v) {
            return false;
          }
        }
      }
    }
    return true;
  };

  SudokuGenerator.prototype.pencilMarks = function(board, x, y) {
    var k, marks, v;
    marks = [];
    for (v = k = 1; k <= 9; v = ++k) {
      if (this.cellValid(board, x, y, v)) {
        marks.push(v);
      }
    }
    if (marks.length > 1) {
      shuffle(marks);
    }
    return marks;
  };

  SudokuGenerator.prototype.solve = function(board) {
    var i, k, pencil, solved;
    solved = new Board(board);
    pencil = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      pencil[i] = new Array(9).fill(null);
    }
    return this.solveInternal(board, solved, pencil);
  };

  SudokuGenerator.prototype.hasUniqueSolution = function(board) {
    var i, k, pencil, solved;
    solved = new Board(board);
    pencil = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      pencil[i] = new Array(9).fill(null);
    }
    if (this.solveInternal(board, solved, pencil) === null) {
      return false;
    }
    return this.solveInternal(board, solved, pencil, 80, -1) === null;
  };

  SudokuGenerator.prototype.solveInternal = function(board, solved, pencil, walkIndex, direction) {
    var x, y;
    if (walkIndex == null) {
      walkIndex = 0;
    }
    if (direction == null) {
      direction = 1;
    }
    while (walkIndex < 81) {
      x = walkIndex % 9;
      y = Math.floor(walkIndex / 9);
      if (!solved.locked[x][y]) {
        if ((direction === 1) && ((pencil[x][y] === null) || (pencil[x][y].length === 0))) {
          pencil[x][y] = this.pencilMarks(solved, x, y);
        }
        if (pencil[x][y].length === 0) {
          solved.grid[x][y] = 0;
          direction = -1;
        } else {
          solved.grid[x][y] = pencil[x][y].pop();
          direction = 1;
        }
      }
      walkIndex += direction;
      if (walkIndex < 0) {
        return null;
      }
    }
    return solved;
  };

  SudokuGenerator.prototype.generateInternal = function(amountToRemove) {
    var board, i, indexesToRemove, j, k, l, m, nextBoard, removeIndex, removed, results, rx, ry;
    board = this.solve(new Board());
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        board.locked[i][j] = true;
      }
    }
    indexesToRemove = shuffle((function() {
      results = [];
      for (m = 0; m < 81; m++){ results.push(m); }
      return results;
    }).apply(this));
    removed = 0;
    while (removed < amountToRemove) {
      if (indexesToRemove.length === 0) {
        break;
      }
      removeIndex = indexesToRemove.pop();
      rx = removeIndex % 9;
      ry = Math.floor(removeIndex / 9);
      nextBoard = new Board(board);
      nextBoard.grid[rx][ry] = 0;
      nextBoard.locked[rx][ry] = false;
      if (this.hasUniqueSolution(nextBoard)) {
        board = nextBoard;
        removed += 1;
      } else {

      }
    }
    return {
      board: board,
      removed: removed
    };
  };

  SudokuGenerator.prototype.generate = function(difficulty) {
    var amountToRemove, attempt, best, generated, k;
    amountToRemove = (function() {
      switch (difficulty) {
        case SudokuGenerator.difficulty.extreme:
          return 60;
        case SudokuGenerator.difficulty.hard:
          return 52;
        case SudokuGenerator.difficulty.medium:
          return 46;
        default:
          return 40;
      }
    })();
    best = null;
    for (attempt = k = 0; k < 2; attempt = ++k) {
      generated = this.generateInternal(amountToRemove);
      if (generated.removed === amountToRemove) {
        console.log("Removed exact amount " + amountToRemove + ", stopping");
        best = generated;
        break;
      }
      if (best === null) {
        best = generated;
      } else if (best.removed < generated.removed) {
        best = generated;
      }
      console.log("current best " + best.removed + " / " + amountToRemove);
    }
    console.log("giving user board: " + best.removed + " / " + amountToRemove);
    return this.boardToGrid(best.board);
  };

  SudokuGenerator.prototype.solveString = function(importString) {
    var anotherSolve, answerString, board, i, index, j, k, l, m, n, o, solved, v, x, zeroCharCode;
    if (importString.indexOf("SD") !== 0) {
      return false;
    }
    importString = importString.substr(2);
    importString = importString.replace(/[^0-9]/g, "");
    if (importString.length !== 81) {
      return false;
    }
    board = new Board();
    index = 0;
    zeroCharCode = "0".charCodeAt(0);
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        v = importString.charCodeAt(index) - zeroCharCode;
        index += 1;
        if (v > 0) {
          board.locked[j][i] = true;
          board.grid[j][i] = v;
        }
      }
    }
    solved = this.solve(board);
    if (solved === null) {
      console.log("ERROR: Can't be solved.");
      return false;
    }
    for (x = m = 0; m < 50; x = ++m) {
      anotherSolve = this.solve(board);
      if (!anotherSolve.matches(solved)) {
        console.log("ERROR: Board solve not unique.");
        return false;
      }
    }
    answerString = "";
    for (j = n = 0; n < 9; j = ++n) {
      for (i = o = 0; o < 9; i = ++o) {
        answerString += solved.grid[j][i] + " ";
      }
      answerString += "\n";
    }
    return answerString;
  };

  return SudokuGenerator;

})();

module.exports = SudokuGenerator;


},{}],2:[function(require,module,exports){
var SudokuGenerator, answer, arg, gen;

SudokuGenerator = require('./SudokuGenerator');

arg = process.argv.slice(2).shift();

if (!arg) {
  console.log("Please give a sudoku string on the commandline.");
  process.exit(0);
}

gen = new SudokuGenerator;

answer = gen.solveString(arg);

console.log("solving: '" + arg + "'");

if (answer) {
  console.log(answer);
}


},{"./SudokuGenerator":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXHNvbHZlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLE9BQUEsR0FBVSxTQUFDLENBQUQ7QUFDTixNQUFBO0VBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUNOLFNBQU0sRUFBRSxDQUFGLEdBQU0sQ0FBWjtJQUNJLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQjtJQUNOLENBQUEsR0FBSSxDQUFFLENBQUEsQ0FBQTtJQUNOLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsQ0FBQTtJQUNULENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztFQUpYO0FBS0EsU0FBTztBQVBEOztBQVNKO0VBQ1MsZUFBQyxVQUFEO0FBQ1gsUUFBQTs7TUFEWSxhQUFhOztJQUN6QixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7QUFDVixTQUFTLHlCQUFUO01BQ0UsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLENBQWxCO01BQ1gsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVIsR0FBYSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLEtBQWxCO0FBRmY7SUFHQSxJQUFHLFVBQUEsS0FBYyxJQUFqQjtBQUNFLFdBQVMseUJBQVQ7QUFDRSxh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SSxHQUFQO0VBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpREFBWjtFQUNBLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYixFQUZGOzs7QUFJQSxHQUFBLEdBQU0sSUFBSTs7QUFFVixNQUFBLEdBQVMsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsR0FBaEI7O0FBQ1QsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFBLEdBQWEsR0FBYixHQUFpQixHQUE3Qjs7QUFDQSxJQUFHLE1BQUg7RUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosRUFERiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG4gICAgaWYgb3RoZXJCb2FyZCAhPSBudWxsXHJcbiAgICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXSA9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGxvY2tlZFtpXVtqXSA9IG90aGVyQm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxyXG4gIEBkaWZmaWN1bHR5OlxyXG4gICAgZWFzeTogMVxyXG4gICAgbWVkaXVtOiAyXHJcbiAgICBoYXJkOiAzXHJcbiAgICBleHRyZW1lOiA0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxyXG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cclxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgcmV0dXJuIG5ld0JvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoeSAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbeF1baV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHBlbmNpbE1hcmtzOiAoYm9hcmQsIHgsIHkpIC0+XHJcbiAgICBtYXJrcyA9IFtdXHJcbiAgICBmb3IgdiBpbiBbMS4uOV1cclxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcclxuICAgICAgICBtYXJrcy5wdXNoIHZcclxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcclxuICAgICAgc2h1ZmZsZShtYXJrcylcclxuICAgIHJldHVybiBtYXJrc1xyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgcGVuY2lsID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgcGVuY2lsW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChib2FyZCwgc29sdmVkLCBwZW5jaWwpXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBwZW5jaWwgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBwZW5jaWxbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG5cclxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKGJvYXJkLCBzb2x2ZWQsIHBlbmNpbCkgPT0gbnVsbFxyXG5cclxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoYm9hcmQsIHNvbHZlZCwgcGVuY2lsLCA4MCwgLTEpID09IG51bGxcclxuXHJcbiAgc29sdmVJbnRlcm5hbDogKGJvYXJkLCBzb2x2ZWQsIHBlbmNpbCwgd2Fsa0luZGV4ID0gMCwgZGlyZWN0aW9uID0gMSkgLT5cclxuICAgIHdoaWxlIHdhbGtJbmRleCA8IDgxXHJcbiAgICAgIHggPSB3YWxrSW5kZXggJSA5XHJcbiAgICAgIHkgPSB3YWxrSW5kZXggLy8gOVxyXG5cclxuICAgICAgaWYgbm90IHNvbHZlZC5sb2NrZWRbeF1beV1cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09IDEpIGFuZCAoKHBlbmNpbFt4XVt5XSA9PSBudWxsKSBvciAocGVuY2lsW3hdW3ldLmxlbmd0aCA9PSAwKSlcclxuICAgICAgICAgIHBlbmNpbFt4XVt5XSA9IEBwZW5jaWxNYXJrcyhzb2x2ZWQsIHgsIHkpXHJcblxyXG4gICAgICAgIGlmIHBlbmNpbFt4XVt5XS5sZW5ndGggPT0gMFxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXHJcbiAgICAgICAgICBkaXJlY3Rpb24gPSAtMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gcGVuY2lsW3hdW3ldLnBvcCgpXHJcbiAgICAgICAgICBkaXJlY3Rpb24gPSAxXHJcblxyXG4gICAgICB3YWxrSW5kZXggKz0gZGlyZWN0aW9uXHJcbiAgICAgIGlmIHdhbGtJbmRleCA8IDBcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG5cclxuICAgIHJldHVybiBzb2x2ZWRcclxuXHJcbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxyXG4gICAgYm9hcmQgPSBAc29sdmUobmV3IEJvYXJkKCkpXHJcbiAgICAjIGhhY2tcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkLmxvY2tlZFtpXVtqXSA9IHRydWVcclxuXHJcbiAgICBpbmRleGVzVG9SZW1vdmUgPSBzaHVmZmxlKFswLi4uODFdKVxyXG4gICAgcmVtb3ZlZCA9IDBcclxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxyXG4gICAgICBpZiBpbmRleGVzVG9SZW1vdmUubGVuZ3RoID09IDBcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgcmVtb3ZlSW5kZXggPSBpbmRleGVzVG9SZW1vdmUucG9wKClcclxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcclxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcclxuXHJcbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcclxuICAgICAgbmV4dEJvYXJkLmxvY2tlZFtyeF1bcnldID0gZmFsc2VcclxuICAgICAgaWYgQGhhc1VuaXF1ZVNvbHV0aW9uKG5leHRCb2FyZClcclxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxyXG4gICAgICAgIHJlbW92ZWQgKz0gMVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJzdWNjZXNzZnVsbHkgcmVtb3ZlZCAje3J4fSwje3J5fVwiXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib2FyZDogYm9hcmRcclxuICAgICAgcmVtb3ZlZDogcmVtb3ZlZFxyXG4gICAgfVxyXG5cclxuICBnZW5lcmF0ZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZCAgICB0aGVuIDUyXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XHJcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxyXG5cclxuICAgIGJlc3QgPSBudWxsXHJcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXHJcbiAgICAgIGdlbmVyYXRlZCA9IEBnZW5lcmF0ZUludGVybmFsKGFtb3VudFRvUmVtb3ZlKVxyXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGlmIGJlc3QgPT0gbnVsbFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiZ2l2aW5nIHVzZXIgYm9hcmQ6ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcclxuXHJcbiAgc29sdmVTdHJpbmc6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGJvYXJkID0gbmV3IEJvYXJkKClcclxuXHJcbiAgICBpbmRleCA9IDBcclxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGJvYXJkLmxvY2tlZFtqXVtpXSA9IHRydWVcclxuICAgICAgICAgIGJvYXJkLmdyaWRbal1baV0gPSB2XHJcblxyXG4gICAgc29sdmVkID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgaWYgc29sdmVkID09IG51bGxcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQ2FuJ3QgYmUgc29sdmVkLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGZvciB4IGluIFswLi4uNTBdICMgNTAgaXMgZXhjZXNzaXZlXHJcbiAgICAgIGFub3RoZXJTb2x2ZSA9IEBzb2x2ZShib2FyZClcclxuICAgICAgaWYgbm90IGFub3RoZXJTb2x2ZS5tYXRjaGVzKHNvbHZlZClcclxuICAgICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYW5zd2VyU3RyaW5nID0gXCJcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYW5zd2VyU3RyaW5nICs9IFwiI3tzb2x2ZWQuZ3JpZFtqXVtpXX0gXCJcclxuICAgICAgYW5zd2VyU3RyaW5nICs9IFwiXFxuXCJcclxuXHJcbiAgICByZXR1cm4gYW5zd2VyU3RyaW5nXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbmFyZyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKS5zaGlmdCgpXHJcbmlmIG5vdCBhcmdcclxuICBjb25zb2xlLmxvZyBcIlBsZWFzZSBnaXZlIGEgc3Vkb2t1IHN0cmluZyBvbiB0aGUgY29tbWFuZGxpbmUuXCJcclxuICBwcm9jZXNzLmV4aXQoMClcclxuXHJcbmdlbiA9IG5ldyBTdWRva3VHZW5lcmF0b3JcclxuXHJcbmFuc3dlciA9IGdlbi5zb2x2ZVN0cmluZyhhcmcpXHJcbmNvbnNvbGUubG9nIFwic29sdmluZzogJyN7YXJnfSdcIlxyXG5pZiBhbnN3ZXJcclxuICBjb25zb2xlLmxvZyBhbnN3ZXJcclxuIl19
