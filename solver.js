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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvc29sdmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsT0FBQSxHQUFVLFNBQUMsQ0FBRDtBQUNOLE1BQUE7RUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ04sU0FBTSxFQUFFLENBQUYsR0FBTSxDQUFaO0lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUFDLENBQUEsR0FBSSxDQUFMLENBQWpCO0lBQ04sQ0FBQSxHQUFJLENBQUUsQ0FBQSxDQUFBO0lBQ04sQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxDQUFBO0lBQ1QsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPO0VBSlg7QUFLQSxTQUFPO0FBUEQ7O0FBU0o7RUFDUyxlQUFDLFVBQUQ7QUFDWCxRQUFBOztNQURZLGFBQWE7O0lBQ3pCLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7QUFDVixTQUFTLHlCQUFUO01BQ0UsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLENBQWxCO01BQ1gsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVIsR0FBYSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLEtBQWxCO0FBRmY7SUFHQSxJQUFHLFVBQUEsS0FBYyxJQUFqQjtB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LENBQUcsQ0FBQSxDQUFBLENBQWhCLEdBQW1CO0FBRHZDO01BRUEsWUFBQSxJQUFnQjtBQUhsQjtBQUtBLFdBQU87RUFuQ0k7Ozs7OztBQXFDZixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQzFRakIsSUFBQTs7QUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQkFBUjs7QUFFbEIsR0FBQSxHQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBYixDQUFtQixDQUFuQixDQUFxQixDQUFDLEtBQXRCLENBQUE7O0FBQ04sSUFBRyxDQUFJLEdBQVA7RUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLGlEQUFaO0VBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiLEVBRkY7OztBQUlBLEdBQUEsR0FBTSxJQUFJOztBQUVWLE1BQUEsR0FBUyxHQUFHLENBQUMsV0FBSixDQUFnQixHQUFoQjs7QUFDVCxPQUFPLENBQUMsR0FBUixDQUFZLFlBQUEsR0FBYSxHQUFiLEdBQWlCLEdBQTdCOztBQUNBLElBQUcsTUFBSDtFQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixFQURGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInNodWZmbGUgPSAoYSkgLT5cbiAgICBpID0gYS5sZW5ndGhcbiAgICB3aGlsZSAtLWkgPiAwXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcbiAgICAgICAgdCA9IGFbal1cbiAgICAgICAgYVtqXSA9IGFbaV1cbiAgICAgICAgYVtpXSA9IHRcbiAgICByZXR1cm4gYVxuXG5jbGFzcyBCb2FyZFxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxuICAgIEBsb2NrZWRDb3VudCA9IDA7XG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcbiAgICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXG4gICAgICAgICAgQGxvY2soaSwgaiwgb3RoZXJCb2FyZC5sb2NrZWRbaV1bal0pXG4gICAgcmV0dXJuXG5cbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cbiAgICBpZiB2XG4gICAgICBAbG9ja2VkQ291bnQgKz0gMSBpZiBub3QgQGxvY2tlZFt4XVt5XVxuICAgIGVsc2VcbiAgICAgIEBsb2NrZWRDb3VudCAtPSAxIGlmIEBsb2NrZWRbeF1beV1cbiAgICBAbG9ja2VkW3hdW3ldID0gdjtcblxuXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcbiAgQGRpZmZpY3VsdHk6XG4gICAgZWFzeTogMVxuICAgIG1lZGl1bTogMlxuICAgIGhhcmQ6IDNcbiAgICBleHRyZW1lOiA0XG5cbiAgY29uc3RydWN0b3I6IC0+XG5cbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXG4gICAgcmV0dXJuIG5ld0JvYXJkXG5cbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICByZXR1cm4gYm9hcmQuZ3JpZFt4XVt5XSA9PSB2XG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxuICAgIG1hcmtzID0gW11cbiAgICBmb3IgdiBpbiBbMS4uOV1cbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXG4gICAgICAgIG1hcmtzLnB1c2ggdlxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcbiAgICAgIHNodWZmbGUobWFya3MpXG4gICAgcmV0dXJuIG1hcmtzXG5cbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXG5cbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXG4gICAgICB4ID0gaW5kZXggJSA5XG4gICAgICB5ID0gaW5kZXggLy8gOVxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoaW5kZXgpXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxuXG4gICAgIyBza2lwIGNlbGxzIHRoYXQgYXJlIGFscmVhZHkgYmVpbmcgdHJpZWRcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxuICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXG5cbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxuXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXG4gICAgZm9yIGluZGV4IGluIHJlbWFpbmluZ0luZGV4ZXNcbiAgICAgIHggPSBpbmRleCAlIDlcbiAgICAgIHkgPSBpbmRleCAvLyA5XG4gICAgICBtYXJrcyA9IEBwZW5jaWxNYXJrcyhib2FyZCwgeCwgeSlcblxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXG4gICAgICByZXR1cm4gbnVsbCBpZiBtYXJrcy5sZW5ndGggPT0gMFxuXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcbiAgICAgIHJldHVybiB7IGluZGV4OiBpbmRleCwgcmVtYWluaW5nOiBtYXJrcyB9IGlmIG1hcmtzLmxlbmd0aCA9PSAxXG5cbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxuICAgICAgaWYgbWFya3MubGVuZ3RoIDwgZmV3ZXN0TWFya3MubGVuZ3RoXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xuICAgIHJldHVybiB7IGluZGV4OiBmZXdlc3RJbmRleCwgcmVtYWluaW5nOiBmZXdlc3RNYXJrcyB9XG5cbiAgc29sdmU6IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgYXR0ZW1wdHMgPSBbXVxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxuXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgIGF0dGVtcHRzID0gW11cblxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBmYWxzZSBpZiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKSA9PSBudWxsXG5cbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcblxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcblxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxuXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxuXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxuICAgICAgZWxzZVxuICAgICAgICB3YWxrSW5kZXggLT0gMVxuXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gc29sdmVkXG5cbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxuICAgICMgaGFja1xuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxuXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcbiAgICByZW1vdmVkID0gMFxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcblxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXG5cbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXG4gICAgICAgIHJlbW92ZWQgKz0gMVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxuICAgICAgZWxzZVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcblxuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogYm9hcmRcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICB9XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxuXG4gICAgYmVzdCA9IG51bGxcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBpZiBiZXN0ID09IG51bGxcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG5cbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxuXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGJvYXJkID0gbmV3IEJvYXJkKClcblxuICAgIGluZGV4ID0gMFxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcbiAgICAgICAgaW5kZXggKz0gMVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGJvYXJkLmdyaWRbal1baV0gPSB2XG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxuXG4gICAgc29sdmVkID0gQHNvbHZlKGJvYXJkKVxuICAgIGlmIHNvbHZlZCA9PSBudWxsXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IEJvYXJkIHNvbHZlIG5vdCB1bmlxdWUuXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgYW5zd2VyU3RyaW5nID0gXCJcIlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYW5zd2VyU3RyaW5nICs9IFwiI3tzb2x2ZWQuZ3JpZFtqXVtpXX0gXCJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXG5cbiAgICByZXR1cm4gYW5zd2VyU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcblxuYXJnID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpLnNoaWZ0KClcbmlmIG5vdCBhcmdcbiAgY29uc29sZS5sb2cgXCJQbGVhc2UgZ2l2ZSBhIHN1ZG9rdSBzdHJpbmcgb24gdGhlIGNvbW1hbmRsaW5lLlwiXG4gIHByb2Nlc3MuZXhpdCgwKVxuXG5nZW4gPSBuZXcgU3Vkb2t1R2VuZXJhdG9yXG5cbmFuc3dlciA9IGdlbi5zb2x2ZVN0cmluZyhhcmcpXG5jb25zb2xlLmxvZyBcInNvbHZpbmc6ICcje2FyZ30nXCJcbmlmIGFuc3dlclxuICBjb25zb2xlLmxvZyBhbnN3ZXJcbiJdfQ==
