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
    var direction, i, k, pencil, solved, walkIndex, x, y;
    solved = new Board(board);
    pencil = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      pencil[i] = new Array(9).fill(null);
    }
    walkIndex = 0;
    direction = 1;
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

  SudokuGenerator.prototype.hasUniqueSolution = function(board) {
    var firstSolve, k, nextSolve, unicityTests;
    firstSolve = this.solve(board);
    for (unicityTests = k = 0; k < 6; unicityTests = ++k) {
      nextSolve = this.solve(board);
      if (!firstSolve.matches(nextSolve)) {
        return false;
      }
    }
    return true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXHNvbHZlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLE9BQUEsR0FBVSxTQUFDLENBQUQ7QUFDTixNQUFBO0VBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUNOLFNBQU0sRUFBRSxDQUFGLEdBQU0sQ0FBWjtJQUNJLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQjtJQUNOLENBQUEsR0FBSSxDQUFFLENBQUEsQ0FBQTtJQUNOLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsQ0FBQTtJQUNULENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztFQUpYO0FBS0EsU0FBTztBQVBEOztBQVNKO0VBQ1MsZUFBQyxVQUFEO0FBQ1gsUUFBQTs7TUFEWSxhQUFhOztJQUN6QixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7QUFDVixTQUFTLHlCQUFUO01BQ0UsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLENBQWxCO01BQ1gsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVIsR0FBYSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLEtBQWxCO0FBRmY7SUFHQSxJQUFHLFVBQUEsS0FBYyxJQUFqQjtBQUNFLFdBQVMseUJBQVQ7QUFDRSxh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QUFBLEtBQUQsQ0FBTyxLQUFQO0lBQ1QsSUFBRyxNQUFBLEtBQVUsSUFBYjtNQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVo7QUFDQSxhQUFPLE1BRlQ7O0FBSUEsU0FBUywwQkFBVDtNQUNFLFlBQUEsR0FBZSxJQUFDLENBQUEsS0FBRCxDQUFPLEtBQVA7TUFDZixJQUFHLENBQUksWUFBWSxDQUFDLE9BQWIsQ0FBcUIsTUFBckIsQ0FBUDtRQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0NBQVo7QUFDQSxlQUFPLE1BRlQ7O0FBRkY7SUFNQSxZQUFBLEdBQWU7QUFDZixTQUFTLHlCQUFUO0FBQ0UsV0FBUyx5QkFBVDtRQUNFLFlBQUEsSUFBbUIsTUFBTSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQWhCLEdBQW1CO0FBRHZDO01BRUEsWUFBQSxJQUFnQjtBQUhsQjtBQUtBLFdBQU87RUFyQ0k7Ozs7OztBQXVDZixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQy9NakIsSUFBQTs7QUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQkFBUjs7QUFFbEIsR0FBQSxHQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBYixDQUFtQixDQUFuQixDQUFxQixDQUFDLEtBQXRCLENBQUE7O0FBQ04sSUFBRyxDQUFJLEdBQVA7RUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLGlEQUFaO0VBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiLEVBRkY7OztBQUlBLEdBQUEsR0FBTSxJQUFJOztBQUVWLE1BQUEsR0FBUyxHQUFHLENBQUMsV0FBSixDQUFnQixHQUFoQjs7QUFDVCxPQUFPLENBQUMsR0FBUixDQUFZLFlBQUEsR0FBYSxHQUFiLEdBQWlCLEdBQTdCOztBQUNBLElBQUcsTUFBSDtFQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixFQURGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInNodWZmbGUgPSAoYSkgLT5cclxuICAgIGkgPSBhLmxlbmd0aFxyXG4gICAgd2hpbGUgLS1pID4gMFxyXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcclxuICAgICAgICB0ID0gYVtqXVxyXG4gICAgICAgIGFbal0gPSBhW2ldXHJcbiAgICAgICAgYVtpXSA9IHRcclxuICAgIHJldHVybiBhXHJcblxyXG5jbGFzcyBCb2FyZFxyXG4gIGNvbnN0cnVjdG9yOiAob3RoZXJCb2FyZCA9IG51bGwpIC0+XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBAbG9ja2VkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgICBAbG9ja2VkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICBAbG9ja2VkW2ldW2pdID0gb3RoZXJCb2FyZC5sb2NrZWRbaV1bal1cclxuICAgIHJldHVyblxyXG5cclxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgQGRpZmZpY3VsdHk6XHJcbiAgICBlYXN5OiAxXHJcbiAgICBtZWRpdW06IDJcclxuICAgIGhhcmQ6IDNcclxuICAgIGV4dHJlbWU6IDRcclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcblxyXG4gIGJvYXJkVG9HcmlkOiAoYm9hcmQpIC0+XHJcbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIG5ld0JvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGJvYXJkLmxvY2tlZFtpXVtqXVxyXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXHJcbiAgICByZXR1cm4gbmV3Qm9hcmRcclxuXHJcbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICBpZiBib2FyZC5ncmlkW3N4ICsgaV1bc3kgKyBqXSA9PSB2XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciB2IGluIFsxLi45XVxyXG4gICAgICBpZiBAY2VsbFZhbGlkKGJvYXJkLCB4LCB5LCB2KVxyXG4gICAgICAgIG1hcmtzLnB1c2ggdlxyXG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxyXG4gICAgICBzaHVmZmxlKG1hcmtzKVxyXG4gICAgcmV0dXJuIG1hcmtzXHJcblxyXG4gIHNvbHZlOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBwZW5jaWwgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBwZW5jaWxbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgIyBkZWJ1Z2dlcjtcclxuXHJcbiAgICB3YWxrSW5kZXggPSAwXHJcbiAgICBkaXJlY3Rpb24gPSAxXHJcbiAgICB3aGlsZSB3YWxrSW5kZXggPCA4MVxyXG4gICAgICB4ID0gd2Fsa0luZGV4ICUgOVxyXG4gICAgICB5ID0gTWF0aC5mbG9vcih3YWxrSW5kZXggLyA5KVxyXG5cclxuICAgICAgaWYgbm90IHNvbHZlZC5sb2NrZWRbeF1beV1cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09IDEpIGFuZCAoKHBlbmNpbFt4XVt5XSA9PSBudWxsKSBvciAocGVuY2lsW3hdW3ldLmxlbmd0aCA9PSAwKSlcclxuICAgICAgICAgIHBlbmNpbFt4XVt5XSA9IEBwZW5jaWxNYXJrcyhzb2x2ZWQsIHgsIHkpXHJcblxyXG4gICAgICAgIGlmIHBlbmNpbFt4XVt5XS5sZW5ndGggPT0gMFxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXHJcbiAgICAgICAgICBkaXJlY3Rpb24gPSAtMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gcGVuY2lsW3hdW3ldLnBvcCgpXHJcbiAgICAgICAgICBkaXJlY3Rpb24gPSAxXHJcblxyXG4gICAgICB3YWxrSW5kZXggKz0gZGlyZWN0aW9uXHJcbiAgICAgIGlmIHdhbGtJbmRleCA8IDBcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG5cclxuICAgIHJldHVybiBzb2x2ZWRcclxuXHJcbiAgaGFzVW5pcXVlU29sdXRpb246IChib2FyZCkgLT5cclxuICAgIGZpcnN0U29sdmUgPSBAc29sdmUoYm9hcmQpXHJcbiAgICBmb3IgdW5pY2l0eVRlc3RzIGluIFswLi4uNl1cclxuICAgICAgbmV4dFNvbHZlID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgICBpZiBub3QgZmlyc3RTb2x2ZS5tYXRjaGVzKG5leHRTb2x2ZSlcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cclxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxyXG4gICAgIyBoYWNrXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBib2FyZC5sb2NrZWRbaV1bal0gPSB0cnVlXHJcblxyXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcclxuICAgIHJlbW92ZWQgPSAwXHJcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcclxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXHJcbiAgICAgIHJ4ID0gcmVtb3ZlSW5kZXggJSA5XHJcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXHJcblxyXG4gICAgICBuZXh0Qm9hcmQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXHJcbiAgICAgIG5leHRCb2FyZC5sb2NrZWRbcnhdW3J5XSA9IGZhbHNlXHJcbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXHJcbiAgICAgICAgYm9hcmQgPSBuZXh0Qm9hcmRcclxuICAgICAgICByZW1vdmVkICs9IDFcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9hcmQ6IGJvYXJkXHJcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcclxuICAgIH1cclxuXHJcbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgYW1vdW50VG9SZW1vdmUgPSBzd2l0Y2ggZGlmZmljdWx0eVxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSAgdGhlbiA0NlxyXG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cclxuXHJcbiAgICBiZXN0ID0gbnVsbFxyXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4yXVxyXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcclxuICAgICAgaWYgZ2VuZXJhdGVkLnJlbW92ZWQgPT0gYW1vdW50VG9SZW1vdmVcclxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBpZiBiZXN0ID09IG51bGxcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiY3VycmVudCBiZXN0ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcbiAgICByZXR1cm4gQGJvYXJkVG9HcmlkKGJlc3QuYm9hcmQpXHJcblxyXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBib2FyZC5sb2NrZWRbal1baV0gPSB0cnVlXHJcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxyXG5cclxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcclxuICAgIGlmIHNvbHZlZCA9PSBudWxsXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IENhbid0IGJlIHNvbHZlZC5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBmb3IgeCBpbiBbMC4uLjUwXSAjIDUwIGlzIGV4Y2Vzc2l2ZVxyXG4gICAgICBhbm90aGVyU29sdmUgPSBAc29sdmUoYm9hcmQpXHJcbiAgICAgIGlmIG5vdCBhbm90aGVyU29sdmUubWF0Y2hlcyhzb2x2ZWQpXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQm9hcmQgc29sdmUgbm90IHVuaXF1ZS5cIlxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXHJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXHJcblxyXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG5hcmcgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMikuc2hpZnQoKVxyXG5pZiBub3QgYXJnXHJcbiAgY29uc29sZS5sb2cgXCJQbGVhc2UgZ2l2ZSBhIHN1ZG9rdSBzdHJpbmcgb24gdGhlIGNvbW1hbmRsaW5lLlwiXHJcbiAgcHJvY2Vzcy5leGl0KDApXHJcblxyXG5nZW4gPSBuZXcgU3Vkb2t1R2VuZXJhdG9yXHJcblxyXG5hbnN3ZXIgPSBnZW4uc29sdmVTdHJpbmcoYXJnKVxyXG5jb25zb2xlLmxvZyBcInNvbHZpbmc6ICcje2FyZ30nXCJcclxuaWYgYW5zd2VyXHJcbiAgY29uc29sZS5sb2cgYW5zd2VyXHJcbiJdfQ==
