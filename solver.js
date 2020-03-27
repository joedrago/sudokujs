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
    var i, j, l, m, n;
    if (otherBoard == null) {
      otherBoard = null;
    }
    this.lockedCount = 0;
    this.grid = new Array(9).fill(null);
    this.locked = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      this.grid[i] = new Array(9).fill(0);
      this.locked[i] = new Array(9).fill(false);
    }
    if (otherBoard !== null) {
      for (j = m = 0; m < 9; j = ++m) {
        for (i = n = 0; n < 9; i = ++n) {
          this.grid[i][j] = otherBoard.grid[i][j];
          this.lock(i, j, otherBoard.locked[i][j]);
        }
      }
    }
    return;
  }

  Board.prototype.matches = function(otherBoard) {
    var i, j, l, m;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j] !== otherBoard.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  Board.prototype.lock = function(x, y, v) {
    if (v == null) {
      v = true;
    }
    if (v) {
      if (!this.locked[x][y]) {
        this.lockedCount += 1;
      }
    } else {
      if (this.locked[x][y]) {
        this.lockedCount -= 1;
      }
    }
    return this.locked[x][y] = v;
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
    var i, j, l, m, n, newBoard;
    newBoard = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      newBoard[i] = new Array(9).fill(0);
    }
    for (j = m = 0; m < 9; j = ++m) {
      for (i = n = 0; n < 9; i = ++n) {
        if (board.locked[i][j]) {
          newBoard[i][j] = board.grid[i][j];
        }
      }
    }
    return newBoard;
  };

  SudokuGenerator.prototype.gridToBoard = function(grid) {
    var board, l, m, x, y;
    board = new Board;
    for (y = l = 0; l < 9; y = ++l) {
      for (x = m = 0; m < 9; x = ++m) {
        if (grid[x][y] > 0) {
          board.grid[x][y] = grid[x][y];
          board.lock(x, y);
        }
      }
    }
    return board;
  };

  SudokuGenerator.prototype.cellValid = function(board, x, y, v) {
    var i, j, l, m, n, sx, sy;
    if (board.locked[x][y]) {
      return board.grid[x][y] === v;
    }
    for (i = l = 0; l < 9; i = ++l) {
      if ((x !== i) && (board.grid[i][y] === v)) {
        return false;
      }
      if ((y !== i) && (board.grid[x][i] === v)) {
        return false;
      }
    }
    sx = Math.floor(x / 3) * 3;
    sy = Math.floor(y / 3) * 3;
    for (j = m = 0; m < 3; j = ++m) {
      for (i = n = 0; n < 3; i = ++n) {
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
    var l, marks, v;
    if (board.locked[x][y]) {
      return [board.grid[x][y]];
    }
    marks = [];
    for (v = l = 1; l <= 9; v = ++l) {
      if (this.cellValid(board, x, y, v)) {
        marks.push(v);
      }
    }
    if (marks.length > 1) {
      shuffle(marks);
    }
    return marks;
  };

  SudokuGenerator.prototype.nextAttempt = function(board, attempts) {
    var a, fewestIndex, fewestMarks, index, k, l, len, len1, m, marks, n, o, remainingIndexes, results, x, y;
    remainingIndexes = (function() {
      results = [];
      for (l = 0; l < 81; l++){ results.push(l); }
      return results;
    }).apply(this);
    for (index = m = 0; m < 81; index = ++m) {
      x = index % 9;
      y = Math.floor(index / 9);
      if (board.locked[x][y]) {
        k = remainingIndexes.indexOf(index);
        if (k >= 0) {
          remainingIndexes.splice(k, 1);
        }
      }
    }
    for (n = 0, len = attempts.length; n < len; n++) {
      a = attempts[n];
      k = remainingIndexes.indexOf(a.index);
      if (k >= 0) {
        remainingIndexes.splice(k, 1);
      }
    }
    if (remainingIndexes.length === 0) {
      return null;
    }
    fewestIndex = -1;
    fewestMarks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (o = 0, len1 = remainingIndexes.length; o < len1; o++) {
      index = remainingIndexes[o];
      x = index % 9;
      y = Math.floor(index / 9);
      marks = this.pencilMarks(board, x, y);
      if (marks.length === 0) {
        return null;
      }
      if (marks.length === 1) {
        return {
          index: index,
          remaining: marks
        };
      }
      if (marks.length < fewestMarks.length) {
        fewestIndex = index;
        fewestMarks = marks;
      }
    }
    return {
      index: fewestIndex,
      remaining: fewestMarks
    };
  };

  SudokuGenerator.prototype.solve = function(board) {
    var attempts, solved;
    solved = new Board(board);
    attempts = [];
    return this.solveInternal(solved, attempts);
  };

  SudokuGenerator.prototype.hasUniqueSolution = function(board) {
    var attempts, solved, unlockedCount;
    solved = new Board(board);
    attempts = [];
    if (this.solveInternal(solved, attempts) === null) {
      return false;
    }
    unlockedCount = 81 - solved.lockedCount;
    if (unlockedCount === 0) {
      return true;
    }
    return this.solveInternal(solved, attempts, unlockedCount - 1) === null;
  };

  SudokuGenerator.prototype.solveInternal = function(solved, attempts, walkIndex) {
    var attempt, unlockedCount, x, y;
    if (walkIndex == null) {
      walkIndex = 0;
    }
    unlockedCount = 81 - solved.lockedCount;
    while (walkIndex < unlockedCount) {
      if (walkIndex >= attempts.length) {
        attempt = this.nextAttempt(solved, attempts);
        if (attempt !== null) {
          attempts.push(attempt);
        }
      } else {
        attempt = attempts[walkIndex];
      }
      if (attempt !== null) {
        x = attempt.index % 9;
        y = Math.floor(attempt.index / 9);
        if (attempt.remaining.length > 0) {
          solved.grid[x][y] = attempt.remaining.pop();
          walkIndex += 1;
        } else {
          attempts.pop();
          solved.grid[x][y] = 0;
          walkIndex -= 1;
        }
      } else {
        walkIndex -= 1;
      }
      if (walkIndex < 0) {
        return null;
      }
    }
    return solved;
  };

  SudokuGenerator.prototype.generateInternal = function(amountToRemove) {
    var board, i, indexesToRemove, j, l, m, n, nextBoard, removeIndex, removed, results, rx, ry;
    board = this.solve(new Board());
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        board.lock(i, j);
      }
    }
    indexesToRemove = shuffle((function() {
      results = [];
      for (n = 0; n < 81; n++){ results.push(n); }
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
      nextBoard.lock(rx, ry, false);
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
    var amountToRemove, attempt, best, generated, l;
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
    for (attempt = l = 0; l < 2; attempt = ++l) {
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

  SudokuGenerator.prototype.validateGrid = function(grid) {
    return this.hasUniqueSolution(this.gridToBoard(grid));
  };

  SudokuGenerator.prototype.solveString = function(importString) {
    var answerString, board, i, index, j, l, m, n, o, solved, v, zeroCharCode;
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
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        v = importString.charCodeAt(index) - zeroCharCode;
        index += 1;
        if (v > 0) {
          board.grid[j][i] = v;
          board.lock(j, i);
        }
      }
    }
    solved = this.solve(board);
    if (solved === null) {
      console.log("ERROR: Can't be solved.");
      return false;
    }
    if (!this.hasUniqueSolution(board)) {
      console.log("ERROR: Board solve not unique.");
      return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXHNvbHZlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLE9BQUEsR0FBVSxTQUFDLENBQUQ7QUFDTixNQUFBO0VBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUNOLFNBQU0sRUFBRSxDQUFGLEdBQU0sQ0FBWjtJQUNJLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQjtJQUNOLENBQUEsR0FBSSxDQUFFLENBQUEsQ0FBQTtJQUNOLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsQ0FBQTtJQUNULENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztFQUpYO0FBS0EsU0FBTztBQVBEOztBQVNKO0VBQ1MsZUFBQyxVQUFEO0FBQ1gsUUFBQTs7TUFEWSxhQUFhOztJQUN6QixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCO0lBQ1IsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCO0FBQ1YsU0FBUyx5QkFBVDtNQUNFLElBQUMsQ0FBQSxJQUFLLENBQUEsQ0FBQSxDQUFOLEdBQVcsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUFZLENBQUMsSUFBYixDQUFrQixDQUFsQjtNQUNYLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFSLEdBQWEsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUFZLENBQUMsSUFBYixDQUFrQixLQUFsQjtBQUZmO0lBR0EsSUFBRyxVQUFBLEtBQWMsSUFB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YXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInNodWZmbGUgPSAoYSkgLT5cclxuICAgIGkgPSBhLmxlbmd0aFxyXG4gICAgd2hpbGUgLS1pID4gMFxyXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcclxuICAgICAgICB0ID0gYVtqXVxyXG4gICAgICAgIGFbal0gPSBhW2ldXHJcbiAgICAgICAgYVtpXSA9IHRcclxuICAgIHJldHVybiBhXHJcblxyXG5jbGFzcyBCb2FyZFxyXG4gIGNvbnN0cnVjdG9yOiAob3RoZXJCb2FyZCA9IG51bGwpIC0+XHJcbiAgICBAbG9ja2VkQ291bnQgPSAwO1xyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG4gICAgaWYgb3RoZXJCb2FyZCAhPSBudWxsXHJcbiAgICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXSA9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGxvY2soaSwgaiwgb3RoZXJCb2FyZC5sb2NrZWRbaV1bal0pXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgbG9jazogKHgsIHksIHYgPSB0cnVlKSAtPlxyXG4gICAgaWYgdlxyXG4gICAgICBAbG9ja2VkQ291bnQgKz0gMSBpZiBub3QgQGxvY2tlZFt4XVt5XVxyXG4gICAgZWxzZVxyXG4gICAgICBAbG9ja2VkQ291bnQgLT0gMSBpZiBAbG9ja2VkW3hdW3ldXHJcbiAgICBAbG9ja2VkW3hdW3ldID0gdjtcclxuXHJcblxyXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcclxuICBAZGlmZmljdWx0eTpcclxuICAgIGVhc3k6IDFcclxuICAgIG1lZGl1bTogMlxyXG4gICAgaGFyZDogM1xyXG4gICAgZXh0cmVtZTogNFxyXG5cclxuICBjb25zdHJ1Y3RvcjogLT5cclxuXHJcbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cclxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cclxuICAgIHJldHVybiBuZXdCb2FyZFxyXG5cclxuICBncmlkVG9Cb2FyZDogKGdyaWQpIC0+XHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZFxyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBmb3IgeCBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgZ3JpZFt4XVt5XSA+IDBcclxuICAgICAgICAgIGJvYXJkLmdyaWRbeF1beV0gPSBncmlkW3hdW3ldXHJcbiAgICAgICAgICBib2FyZC5sb2NrKHgsIHkpXHJcbiAgICByZXR1cm4gYm9hcmRcclxuXHJcbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XHJcbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgcmV0dXJuIGJvYXJkLmdyaWRbeF1beV0gPT0gdlxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgKHggIT0gaSkgYW5kIChib2FyZC5ncmlkW2ldW3ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcclxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxyXG4gICAgbWFya3MgPSBbXVxyXG4gICAgZm9yIHYgaW4gWzEuLjldXHJcbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXHJcbiAgICAgICAgbWFya3MucHVzaCB2XHJcbiAgICBpZiBtYXJrcy5sZW5ndGggPiAxXHJcbiAgICAgIHNodWZmbGUobWFya3MpXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XHJcbiAgICByZW1haW5pbmdJbmRleGVzID0gWzAuLi44MV1cclxuXHJcbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXHJcbiAgICBmb3IgaW5kZXggaW4gWzAuLi44MV1cclxuICAgICAgeCA9IGluZGV4ICUgOVxyXG4gICAgICB5ID0gaW5kZXggLy8gOVxyXG4gICAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGluZGV4KVxyXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgICMgc2tpcCBjZWxscyB0aGF0IGFyZSBhbHJlYWR5IGJlaW5nIHRyaWVkXHJcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xyXG4gICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGEuaW5kZXgpXHJcbiAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgIHJldHVybiBudWxsIGlmIHJlbWFpbmluZ0luZGV4ZXMubGVuZ3RoID09IDAgIyBhYm9ydCBpZiB0aGVyZSBhcmUgbm8gY2VsbHMgKHNob3VsZCBuZXZlciBoYXBwZW4pXHJcblxyXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxyXG4gICAgZmV3ZXN0TWFya3MgPSBbMC4uOV1cclxuICAgIGZvciBpbmRleCBpbiByZW1haW5pbmdJbmRleGVzXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgbWFya3MgPSBAcGVuY2lsTWFya3MoYm9hcmQsIHgsIHkpXHJcblxyXG4gICAgICAjIGFib3J0IGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG5vIHBvc3NpYmlsaXRpZXNcclxuICAgICAgcmV0dXJuIG51bGwgaWYgbWFya3MubGVuZ3RoID09IDBcclxuXHJcbiAgICAgICMgZG9uZSBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBvbmx5IG9uZSBwb3NzaWJpbGl0eSAoKVxyXG4gICAgICByZXR1cm4geyBpbmRleDogaW5kZXgsIHJlbWFpbmluZzogbWFya3MgfSBpZiBtYXJrcy5sZW5ndGggPT0gMVxyXG5cclxuICAgICAgIyByZW1lbWJlciB0aGlzIGNlbGwgaWYgaXQgaGFzIHRoZSBmZXdlc3QgbWFya3Mgc28gZmFyXHJcbiAgICAgIGlmIG1hcmtzLmxlbmd0aCA8IGZld2VzdE1hcmtzLmxlbmd0aFxyXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcclxuICAgICAgICBmZXdlc3RNYXJrcyA9IG1hcmtzXHJcbiAgICByZXR1cm4geyBpbmRleDogZmV3ZXN0SW5kZXgsIHJlbWFpbmluZzogZmV3ZXN0TWFya3MgfVxyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBhdHRlbXB0cyA9IFtdXHJcblxyXG4gICAgIyBpZiB0aGVyZSBpcyBubyBzb2x1dGlvbiwgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gZmFsc2UgaWYgQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cykgPT0gbnVsbFxyXG5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG5cclxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcclxuICAgIHJldHVybiB0cnVlIGlmIHVubG9ja2VkQ291bnQgPT0gMFxyXG5cclxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cywgdW5sb2NrZWRDb3VudC0xKSA9PSBudWxsXHJcblxyXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxyXG4gICAgdW5sb2NrZWRDb3VudCA9IDgxIC0gc29sdmVkLmxvY2tlZENvdW50XHJcbiAgICB3aGlsZSB3YWxrSW5kZXggPCB1bmxvY2tlZENvdW50XHJcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcclxuICAgICAgICBhdHRlbXB0ID0gQG5leHRBdHRlbXB0KHNvbHZlZCwgYXR0ZW1wdHMpXHJcbiAgICAgICAgYXR0ZW1wdHMucHVzaChhdHRlbXB0KSBpZiBhdHRlbXB0ICE9IG51bGxcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGF0dGVtcHQgPSBhdHRlbXB0c1t3YWxrSW5kZXhdXHJcblxyXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcclxuICAgICAgICB4ID0gYXR0ZW1wdC5pbmRleCAlIDlcclxuICAgICAgICB5ID0gYXR0ZW1wdC5pbmRleCAvLyA5XHJcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSBhdHRlbXB0LnJlbWFpbmluZy5wb3AoKVxyXG4gICAgICAgICAgd2Fsa0luZGV4ICs9IDFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBhdHRlbXB0cy5wb3AoKVxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXHJcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuXHJcbiAgICAgIGlmIHdhbGtJbmRleCA8IDBcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG5cclxuICAgIHJldHVybiBzb2x2ZWRcclxuXHJcbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxyXG4gICAgYm9hcmQgPSBAc29sdmUobmV3IEJvYXJkKCkpXHJcbiAgICAjIGhhY2tcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkLmxvY2soaSwgailcclxuXHJcbiAgICBpbmRleGVzVG9SZW1vdmUgPSBzaHVmZmxlKFswLi4uODFdKVxyXG4gICAgcmVtb3ZlZCA9IDBcclxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxyXG4gICAgICBpZiBpbmRleGVzVG9SZW1vdmUubGVuZ3RoID09IDBcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgcmVtb3ZlSW5kZXggPSBpbmRleGVzVG9SZW1vdmUucG9wKClcclxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcclxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcclxuXHJcbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcclxuICAgICAgbmV4dEJvYXJkLmxvY2socngsIHJ5LCBmYWxzZSlcclxuXHJcbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXHJcbiAgICAgICAgYm9hcmQgPSBuZXh0Qm9hcmRcclxuICAgICAgICByZW1vdmVkICs9IDFcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9hcmQ6IGJvYXJkXHJcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcclxuICAgIH1cclxuXHJcbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgYW1vdW50VG9SZW1vdmUgPSBzd2l0Y2ggZGlmZmljdWx0eVxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSAgdGhlbiA0NlxyXG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cclxuXHJcbiAgICBiZXN0ID0gbnVsbFxyXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4yXVxyXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcclxuICAgICAgaWYgZ2VuZXJhdGVkLnJlbW92ZWQgPT0gYW1vdW50VG9SZW1vdmVcclxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBpZiBiZXN0ID09IG51bGxcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiY3VycmVudCBiZXN0ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcbiAgICByZXR1cm4gQGJvYXJkVG9HcmlkKGJlc3QuYm9hcmQpXHJcblxyXG4gIHZhbGlkYXRlR3JpZDogKGdyaWQpIC0+XHJcbiAgICByZXR1cm4gQGhhc1VuaXF1ZVNvbHV0aW9uKEBncmlkVG9Cb2FyZChncmlkKSlcclxuXHJcbiAgc29sdmVTdHJpbmc6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGJvYXJkID0gbmV3IEJvYXJkKClcclxuXHJcbiAgICBpbmRleCA9IDBcclxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGJvYXJkLmdyaWRbal1baV0gPSB2XHJcbiAgICAgICAgICBib2FyZC5sb2NrKGosIGkpXHJcblxyXG4gICAgc29sdmVkID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgaWYgc29sdmVkID09IG51bGxcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQ2FuJ3QgYmUgc29sdmVkLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGlmIG5vdCBAaGFzVW5pcXVlU29sdXRpb24oYm9hcmQpXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IEJvYXJkIHNvbHZlIG5vdCB1bmlxdWUuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYW5zd2VyU3RyaW5nID0gXCJcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYW5zd2VyU3RyaW5nICs9IFwiI3tzb2x2ZWQuZ3JpZFtqXVtpXX0gXCJcclxuICAgICAgYW5zd2VyU3RyaW5nICs9IFwiXFxuXCJcclxuXHJcbiAgICByZXR1cm4gYW5zd2VyU3RyaW5nXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbmFyZyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKS5zaGlmdCgpXHJcbmlmIG5vdCBhcmdcclxuICBjb25zb2xlLmxvZyBcIlBsZWFzZSBnaXZlIGEgc3Vkb2t1IHN0cmluZyBvbiB0aGUgY29tbWFuZGxpbmUuXCJcclxuICBwcm9jZXNzLmV4aXQoMClcclxuXHJcbmdlbiA9IG5ldyBTdWRva3VHZW5lcmF0b3JcclxuXHJcbmFuc3dlciA9IGdlbi5zb2x2ZVN0cmluZyhhcmcpXHJcbmNvbnNvbGUubG9nIFwic29sdmluZzogJyN7YXJnfSdcIlxyXG5pZiBhbnN3ZXJcclxuICBjb25zb2xlLmxvZyBhbnN3ZXJcclxuIl19
