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
    var attempts, solved;
    solved = new Board(board);
    attempts = [];
    if (this.solveInternal(solved, attempts) === null) {
      return false;
    }
    return this.solveInternal(solved, attempts, 80 - board.lockedCount) === null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvc29sdmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsT0FBQSxHQUFVLFNBQUMsQ0FBRDtBQUNOLE1BQUE7RUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ04sU0FBTSxFQUFFLENBQUYsR0FBTSxDQUFaO0lBQ0ksQ0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUFDLENBQUEsR0FBSSxDQUFMLENBQWpCO0lBQ04sQ0FBQSxHQUFJLENBQUUsQ0FBQSxDQUFBO0lBQ04sQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxDQUFBO0lBQ1QsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPO0VBSlg7QUFLQSxTQUFPO0FBUEQ7O0FBU0o7RUFDUyxlQUFDLFVBQUQ7QUFDWCxRQUFBOztNQURZLGFBQWE7O0lBQ3pCLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7QUFDVixTQUFTLHlCQUFUO01BQ0UsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLENBQWxCO01BQ1gsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVIsR0FBYSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLEtBQWxCO0FBRmY7SUFHQSxJQUFHLFVBQUEsS0FBYyxJQUFqQjtB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STs7Ozs7O0FBcUNmLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDclFqQixJQUFBOztBQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG1CQUFSOztBQUVsQixHQUFBLEdBQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFiLENBQW1CLENBQW5CLENBQXFCLENBQUMsS0FBdEIsQ0FBQTs7QUFDTixJQUFHLENBQUksR0FBUDtFQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksaURBQVo7RUFDQSxPQUFPLENBQUMsSUFBUixDQUFhLENBQWIsRUFGRjs7O0FBSUEsR0FBQSxHQUFNLElBQUk7O0FBRVYsTUFBQSxHQUFTLEdBQUcsQ0FBQyxXQUFKLENBQWdCLEdBQWhCOztBQUNULE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBQSxHQUFhLEdBQWIsR0FBaUIsR0FBN0I7O0FBQ0EsSUFBRyxNQUFIO0VBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLEVBREYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwic2h1ZmZsZSA9IChhKSAtPlxuICAgIGkgPSBhLmxlbmd0aFxuICAgIHdoaWxlIC0taSA+IDBcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxuICAgICAgICB0ID0gYVtqXVxuICAgICAgICBhW2pdID0gYVtpXVxuICAgICAgICBhW2ldID0gdFxuICAgIHJldHVybiBhXG5cbmNsYXNzIEJvYXJkXG4gIGNvbnN0cnVjdG9yOiAob3RoZXJCb2FyZCA9IG51bGwpIC0+XG4gICAgQGxvY2tlZENvdW50ID0gMDtcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxuICAgICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICBAbG9jayhpLCBqLCBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXSlcbiAgICByZXR1cm5cblxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgbG9jazogKHgsIHksIHYgPSB0cnVlKSAtPlxuICAgIGlmIHZcbiAgICAgIEBsb2NrZWRDb3VudCArPSAxIGlmIG5vdCBAbG9ja2VkW3hdW3ldXG4gICAgZWxzZVxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxuICAgIEBsb2NrZWRbeF1beV0gPSB2O1xuXG5cbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxuICBAZGlmZmljdWx0eTpcbiAgICBlYXN5OiAxXG4gICAgbWVkaXVtOiAyXG4gICAgaGFyZDogM1xuICAgIGV4dHJlbWU6IDRcblxuICBjb25zdHJ1Y3RvcjogLT5cblxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cbiAgICByZXR1cm4gbmV3Qm9hcmRcblxuICBjZWxsVmFsaWQ6IChib2FyZCwgeCwgeSwgdikgLT5cbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgIHJldHVybiBib2FyZC5ncmlkW3hdW3ldID09IHZcblxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxuICAgICAgcmV0dXJuIFsgYm9hcmQuZ3JpZFt4XVt5XSBdXG4gICAgbWFya3MgPSBbXVxuICAgIGZvciB2IGluIFsxLi45XVxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcbiAgICAgICAgbWFya3MucHVzaCB2XG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxuICAgICAgc2h1ZmZsZShtYXJrcylcbiAgICByZXR1cm4gbWFya3NcblxuICBuZXh0QXR0ZW1wdDogKGJvYXJkLCBhdHRlbXB0cykgLT5cbiAgICByZW1haW5pbmdJbmRleGVzID0gWzAuLi44MV1cblxuICAgICMgc2tpcCBsb2NrZWQgY2VsbHNcbiAgICBmb3IgaW5kZXggaW4gWzAuLi44MV1cbiAgICAgIHggPSBpbmRleCAlIDlcbiAgICAgIHkgPSBpbmRleCAvLyA5XG4gICAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihpbmRleClcbiAgICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXG5cbiAgICAjIHNraXAgY2VsbHMgdGhhdCBhcmUgYWxyZWFkeSBiZWluZyB0cmllZFxuICAgIGZvciBhIGluIGF0dGVtcHRzXG4gICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGEuaW5kZXgpXG4gICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcblxuICAgIHJldHVybiBudWxsIGlmIHJlbWFpbmluZ0luZGV4ZXMubGVuZ3RoID09IDAgIyBhYm9ydCBpZiB0aGVyZSBhcmUgbm8gY2VsbHMgKHNob3VsZCBuZXZlciBoYXBwZW4pXG5cbiAgICBmZXdlc3RJbmRleCA9IC0xXG4gICAgZmV3ZXN0TWFya3MgPSBbMC4uOV1cbiAgICBmb3IgaW5kZXggaW4gcmVtYWluaW5nSW5kZXhlc1xuICAgICAgeCA9IGluZGV4ICUgOVxuICAgICAgeSA9IGluZGV4IC8vIDlcbiAgICAgIG1hcmtzID0gQHBlbmNpbE1hcmtzKGJvYXJkLCB4LCB5KVxuXG4gICAgICAjIGFib3J0IGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG5vIHBvc3NpYmlsaXRpZXNcbiAgICAgIHJldHVybiBudWxsIGlmIG1hcmtzLmxlbmd0aCA9PSAwXG5cbiAgICAgICMgZG9uZSBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBvbmx5IG9uZSBwb3NzaWJpbGl0eSAoKVxuICAgICAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCByZW1haW5pbmc6IG1hcmtzIH0gaWYgbWFya3MubGVuZ3RoID09IDFcblxuICAgICAgIyByZW1lbWJlciB0aGlzIGNlbGwgaWYgaXQgaGFzIHRoZSBmZXdlc3QgbWFya3Mgc28gZmFyXG4gICAgICBpZiBtYXJrcy5sZW5ndGggPCBmZXdlc3RNYXJrcy5sZW5ndGhcbiAgICAgICAgZmV3ZXN0SW5kZXggPSBpbmRleFxuICAgICAgICBmZXdlc3RNYXJrcyA9IG1hcmtzXG4gICAgcmV0dXJuIHsgaW5kZXg6IGZld2VzdEluZGV4LCByZW1haW5pbmc6IGZld2VzdE1hcmtzIH1cblxuICBzb2x2ZTogKGJvYXJkKSAtPlxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcbiAgICBhdHRlbXB0cyA9IFtdXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpXG5cbiAgaGFzVW5pcXVlU29sdXRpb246IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgYXR0ZW1wdHMgPSBbXVxuXG4gICAgIyBpZiB0aGVyZSBpcyBubyBzb2x1dGlvbiwgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpID09IG51bGxcblxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIDgwIC0gYm9hcmQubG9ja2VkQ291bnQpID09IG51bGxcblxuICBzb2x2ZUludGVybmFsOiAoc29sdmVkLCBhdHRlbXB0cywgd2Fsa0luZGV4ID0gMCkgLT5cbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcbiAgICB3aGlsZSB3YWxrSW5kZXggPCB1bmxvY2tlZENvdW50XG4gICAgICBpZiB3YWxrSW5kZXggPj0gYXR0ZW1wdHMubGVuZ3RoXG4gICAgICAgIGF0dGVtcHQgPSBAbmV4dEF0dGVtcHQoc29sdmVkLCBhdHRlbXB0cylcbiAgICAgICAgYXR0ZW1wdHMucHVzaChhdHRlbXB0KSBpZiBhdHRlbXB0ICE9IG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgYXR0ZW1wdCA9IGF0dGVtcHRzW3dhbGtJbmRleF1cblxuICAgICAgaWYgYXR0ZW1wdCAhPSBudWxsXG4gICAgICAgIHggPSBhdHRlbXB0LmluZGV4ICUgOVxuICAgICAgICB5ID0gYXR0ZW1wdC5pbmRleCAvLyA5XG4gICAgICAgIGlmIGF0dGVtcHQucmVtYWluaW5nLmxlbmd0aCA+IDBcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IGF0dGVtcHQucmVtYWluaW5nLnBvcCgpXG4gICAgICAgICAgd2Fsa0luZGV4ICs9IDFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0dGVtcHRzLnBvcCgpXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXG4gICAgICAgICAgd2Fsa0luZGV4IC09IDFcbiAgICAgIGVsc2VcbiAgICAgICAgd2Fsa0luZGV4IC09IDFcblxuICAgICAgaWYgd2Fsa0luZGV4IDwgMFxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIHNvbHZlZFxuXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcbiAgICAjIGhhY2tcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGJvYXJkLmxvY2soaSwgailcblxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXG4gICAgcmVtb3ZlZCA9IDBcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxuICAgICAgICBicmVha1xuXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXG5cbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXG4gICAgICBuZXh0Qm9hcmQubG9jayhyeCwgcnksIGZhbHNlKVxuXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxuICAgICAgICByZW1vdmVkICs9IDFcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXG5cbiAgICByZXR1cm4ge1xuICAgICAgYm9hcmQ6IGJvYXJkXG4gICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgfVxuXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cblxuICAgIGJlc3QgPSBudWxsXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4yXVxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcbiAgICAgICAgYnJlYWtcblxuICAgICAgaWYgYmVzdCA9PSBudWxsXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxuXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcblxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXG5cbiAgICBpbmRleCA9IDBcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXG4gICAgICAgIGluZGV4ICs9IDFcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxuICAgICAgICAgIGJvYXJkLmxvY2soaiwgaSlcblxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQ2FuJ3QgYmUgc29sdmVkLlwiXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGlmIG5vdCBAaGFzVW5pcXVlU29sdXRpb24oYm9hcmQpXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxuXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbmFyZyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKS5zaGlmdCgpXG5pZiBub3QgYXJnXG4gIGNvbnNvbGUubG9nIFwiUGxlYXNlIGdpdmUgYSBzdWRva3Ugc3RyaW5nIG9uIHRoZSBjb21tYW5kbGluZS5cIlxuICBwcm9jZXNzLmV4aXQoMClcblxuZ2VuID0gbmV3IFN1ZG9rdUdlbmVyYXRvclxuXG5hbnN3ZXIgPSBnZW4uc29sdmVTdHJpbmcoYXJnKVxuY29uc29sZS5sb2cgXCJzb2x2aW5nOiAnI3thcmd9J1wiXG5pZiBhbnN3ZXJcbiAgY29uc29sZS5sb2cgYW5zd2VyXG4iXX0=
