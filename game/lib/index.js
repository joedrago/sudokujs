(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, FontFaceObserver, MenuView, SudokuView;

FontFaceObserver = require('FontFaceObserver');

MenuView = require('./MenuView');

SudokuView = require('./SudokuView');

App = (function() {
  function App(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.loadFont("saxMono");
    this.fonts = {};
    this.views = {
      menu: new MenuView(this, this.canvas),
      sudoku: new SudokuView(this, this.canvas)
    };
    this.switchView("sudoku");
  }

  App.prototype.measureFonts = function() {
    var f, fontName, ref;
    ref = this.fonts;
    for (fontName in ref) {
      f = ref[fontName];
      this.ctx.font = f.style;
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      f.height = Math.floor(this.ctx.measureText("m").width * 1.1);
      console.log("Font " + fontName + " measured at " + f.height + " pixels");
    }
  };

  App.prototype.registerFont = function(name, style) {
    var font;
    font = {
      name: name,
      style: style,
      height: 0
    };
    this.fonts[name] = font;
    this.measureFonts();
    return font;
  };

  App.prototype.loadFont = function(fontName) {
    var font;
    font = new FontFaceObserver(fontName);
    return font.load().then((function(_this) {
      return function() {
        console.log(fontName + " loaded, redrawing...");
        _this.measureFonts();
        return _this.draw();
      };
    })(this));
  };

  App.prototype.switchView = function(view) {
    this.view = this.views[view];
    return this.draw();
  };

  App.prototype.newGame = function(difficulty) {
    this.views.sudoku.newGame(difficulty);
    return this.switchView("sudoku");
  };

  App.prototype.draw = function() {
    return this.view.draw();
  };

  App.prototype.click = function(x, y) {
    return this.view.click(x, y);
  };

  App.prototype.drawFill = function(x, y, w, h, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.fillStyle = color;
    return this.ctx.fill();
  };

  App.prototype.drawRoundedRect = function(x, y, w, h, r, fillColor, strokeColor) {
    if (fillColor == null) {
      fillColor = null;
    }
    if (strokeColor == null) {
      strokeColor = null;
    }
    this.ctx.roundRect(x, y, w, h, r);
    if (fillColor !== null) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor !== null) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
  };

  App.prototype.drawRect = function(x, y, w, h, color, lineWidth) {
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.rect(x, y, w, h);
    return this.ctx.stroke();
  };

  App.prototype.drawLine = function(x1, y1, x2, y2, color, lineWidth) {
    if (color == null) {
      color = "black";
    }
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this.ctx.stroke();
  };

  App.prototype.drawTextCentered = function(text, cx, cy, font, color) {
    this.ctx.font = font.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    return this.ctx.fillText(text, cx, cy + (font.height / 2));
  };

  return App;

})();

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

module.exports = App;


},{"./MenuView":2,"./SudokuView":5,"FontFaceObserver":7}],2:[function(require,module,exports){
var MenuView, SudokuGenerator;

SudokuGenerator = require('./SudokuGenerator');

MenuView = (function() {
  function MenuView(app, canvas) {
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, titleFontHeight;
    this.app = app;
    this.canvas = canvas;
    this.buttons = {
      newEasy: {
        y: 0.35,
        text: "New Game: Easy",
        bgColor: "#337733",
        textColor: "#ffffff",
        click: this.newEasy.bind(this)
      },
      newMedium: {
        y: 0.47,
        text: "New Game: Medium",
        bgColor: "#777733",
        textColor: "#ffffff",
        click: this.newMedium.bind(this)
      },
      newHard: {
        y: 0.59,
        text: "New Game: Hard",
        bgColor: "#773333",
        textColor: "#ffffff",
        click: this.newHard.bind(this)
      },
      resume: {
        y: 0.85,
        text: "Resume",
        bgColor: "#777777",
        textColor: "#ffffff",
        click: this.resume.bind(this)
      }
    };
    buttonWidth = this.canvas.width * 0.8;
    this.buttonHeight = this.canvas.height * 0.1;
    buttonX = this.canvas.width * 0.1;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      button.x = buttonX;
      button.y = this.canvas.height * button.y;
      button.w = buttonWidth;
      button.h = this.buttonHeight;
    }
    buttonFontHeight = Math.floor(this.buttonHeight * 0.4);
    this.buttonFont = this.app.registerFont("button", buttonFontHeight + "px saxMono, monospace");
    titleFontHeight = Math.floor(this.canvas.height * 0.1);
    this.titleFont = this.app.registerFont("button", titleFontHeight + "px saxMono, monospace");
    return;
  }

  MenuView.prototype.draw = function() {
    var button, buttonName, ref, results, shadowOffset, x, y1, y2;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#333333");
    x = this.canvas.width / 2;
    shadowOffset = this.canvas.height * 0.02;
    y1 = this.canvas.height * 0.1;
    y2 = this.canvas.height * 0.2;
    this.app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Bad Guy", x, y1, this.titleFont, "#ffffff");
    this.app.drawTextCentered("Sudoku", x, y2, this.titleFont, "#ffffff");
    ref = this.buttons;
    results = [];
    for (buttonName in ref) {
      button = ref[buttonName];
      this.app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.2, button.bgColor, "#444444");
      results.push(this.app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), this.buttonFont, button.textColor));
    }
    return results;
  };

  MenuView.prototype.click = function(x, y) {
    var button, buttonName, ref;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      if ((y > button.y) && (y < (button.y + this.buttonHeight))) {
        button.click();
      }
    }
  };

  MenuView.prototype.newEasy = function() {
    return this.app.newGame(SudokuGenerator.difficulty.easy);
  };

  MenuView.prototype.newMedium = function() {
    return this.app.newGame(SudokuGenerator.difficulty.medium);
  };

  MenuView.prototype.newHard = function() {
    return this.app.newGame(SudokuGenerator.difficulty.hard);
  };

  MenuView.prototype.resume = function() {
    return this.app.switchView("sudoku");
  };

  return MenuView;

})();

module.exports = MenuView;


},{"./SudokuGenerator":4}],3:[function(require,module,exports){
var SudokuGame, SudokuGenerator;

SudokuGenerator = require('./SudokuGenerator');

SudokuGame = (function() {
  function SudokuGame() {
    var i, j, l, m, n;
    this.grid = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      this.grid[i] = new Array(9).fill(null);
    }
    for (j = m = 0; m < 9; j = ++m) {
      for (i = n = 0; n < 9; i = ++n) {
        this.grid[i][j] = {
          value: 0,
          error: false,
          locked: false,
          pencil: new Array(9).fill(false)
        };
      }
    }
    this.solved = false;
    if (!this.load()) {
      this.newGame(SudokuGenerator.difficulty.easy);
    }
    return;
  }

  SudokuGame.prototype.updateCell = function(x, y) {
    var cell, i, j, l, m, n, sx, sy, v;
    cell = this.grid[x][y];
    for (i = l = 0; l < 9; i = ++l) {
      if (x !== i) {
        v = this.grid[i][y].value;
        if (v > 0) {
          if (v === cell.value) {
            this.grid[i][y].error = true;
            cell.error = true;
          }
        }
      }
      if (y !== i) {
        v = this.grid[x][i].value;
        if (v > 0) {
          if (v === cell.value) {
            this.grid[x][i].error = true;
            cell.error = true;
          }
        }
      }
    }
    sx = Math.floor(x / 3) * 3;
    sy = Math.floor(y / 3) * 3;
    for (j = m = 0; m < 3; j = ++m) {
      for (i = n = 0; n < 3; i = ++n) {
        if ((x !== (sx + i)) && (y !== (sy + j))) {
          v = this.grid[sx + i][sy + j].value;
          if (v > 0) {
            if (v === cell.value) {
              this.grid[sx + i][sy + j].error = true;
              cell.error = true;
            }
          }
        }
      }
    }
  };

  SudokuGame.prototype.updateCells = function() {
    var i, j, l, m, n, o, p, q;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        this.grid[i][j].error = false;
      }
    }
    for (j = n = 0; n < 9; j = ++n) {
      for (i = o = 0; o < 9; i = ++o) {
        this.updateCell(i, j);
      }
    }
    this.solved = true;
    for (j = p = 0; p < 9; j = ++p) {
      for (i = q = 0; q < 9; i = ++q) {
        if (this.grid[i][j].error) {
          this.solved = false;
        }
        if (this.grid[i][j].value === 0) {
          this.solved = false;
        }
      }
    }
    if (this.solved) {
      console.log("solved " + this.solved);
    }
    return this.solved;
  };

  SudokuGame.prototype.done = function() {
    var counts, d, i, j, l, m, n;
    d = new Array(9).fill(false);
    counts = new Array(9).fill(0);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j].value !== 0) {
          counts[this.grid[i][j].value - 1] += 1;
        }
      }
    }
    for (i = n = 0; n < 9; i = ++n) {
      if (counts[i] === 9) {
        d[i] = true;
      }
    }
    return d;
  };

  SudokuGame.prototype.pencilString = function(x, y) {
    var cell, i, l, s;
    cell = this.grid[x][y];
    s = "";
    for (i = l = 0; l < 9; i = ++l) {
      if (cell.pencil[i]) {
        s += String(i + 1);
      }
    }
    return s;
  };

  SudokuGame.prototype.clearPencil = function(x, y) {
    var cell, i, l;
    cell = this.grid[x][y];
    if (cell.locked) {
      return;
    }
    for (i = l = 0; l < 9; i = ++l) {
      cell.pencil[i] = false;
    }
    return this.save();
  };

  SudokuGame.prototype.togglePencil = function(x, y, v) {
    var cell;
    cell = this.grid[x][y];
    if (cell.locked) {
      return;
    }
    cell.pencil[v - 1] = !cell.pencil[v - 1];
    return this.save();
  };

  SudokuGame.prototype.setValue = function(x, y, v) {
    var cell;
    cell = this.grid[x][y];
    if (cell.locked) {
      return;
    }
    cell.value = v;
    this.updateCells();
    return this.save();
  };

  SudokuGame.prototype.newGame = function(difficulty) {
    var cell, generator, i, j, k, l, m, n, newGrid, o, p;
    console.log("newGame(" + difficulty + ")");
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        cell = this.grid[i][j];
        cell.value = 0;
        cell.error = false;
        cell.locked = false;
        for (k = n = 0; n < 9; k = ++n) {
          cell.pencil[k] = false;
        }
      }
    }
    generator = new SudokuGenerator();
    newGrid = generator.generate(difficulty);
    for (j = o = 0; o < 9; j = ++o) {
      for (i = p = 0; p < 9; i = ++p) {
        if (newGrid[i][j] !== 0) {
          this.grid[i][j].value = newGrid[i][j];
          this.grid[i][j].locked = true;
        }
      }
    }
    this.updateCells();
    return this.save();
  };

  SudokuGame.prototype.load = function() {
    var dst, gameData, i, j, jsonString, k, l, m, n, src;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    jsonString = localStorage.getItem("game");
    if (jsonString === null) {
      return false;
    }
    gameData = JSON.parse(jsonString);
    console.log("found gameData", gameData);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        src = gameData.grid[i][j];
        dst = this.grid[i][j];
        dst.value = src.v;
        dst.error = src.e > 0 ? true : false;
        dst.locked = src.l > 0 ? true : false;
        for (k = n = 0; n < 9; k = ++n) {
          dst.pencil[k] = src.p[k] > 0 ? true : false;
        }
      }
    }
    this.updateCells();
    console.log("Loaded game.");
    return true;
  };

  SudokuGame.prototype.save = function() {
    var cell, dst, gameData, i, j, jsonString, k, l, m, n, o;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    gameData = {
      grid: new Array(9).fill(null)
    };
    for (i = l = 0; l < 9; i = ++l) {
      gameData.grid[i] = new Array(9).fill(null);
    }
    for (j = m = 0; m < 9; j = ++m) {
      for (i = n = 0; n < 9; i = ++n) {
        cell = this.grid[i][j];
        gameData.grid[i][j] = {
          v: cell.value,
          e: cell.error ? 1 : 0,
          l: cell.locked ? 1 : 0,
          p: []
        };
        dst = gameData.grid[i][j].p;
        for (k = o = 0; o < 9; k = ++o) {
          dst.push(cell.pencil[k] ? 1 : 0);
        }
      }
    }
    jsonString = JSON.stringify(gameData);
    localStorage.setItem("game", jsonString);
    console.log("Saved game (" + jsonString.length + " chars)");
    return true;
  };

  return SudokuGame;

})();

module.exports = SudokuGame;


},{"./SudokuGenerator":4}],4:[function(require,module,exports){
var SudokuGenerator, sudoku;

sudoku = require('sudoku');

SudokuGenerator = (function() {
  SudokuGenerator.difficulty = {
    easy: 1,
    medium: 2,
    hard: 3
  };

  function SudokuGenerator() {}

  SudokuGenerator.prototype.generate = function(difficulty) {
    var grid, i, index, j, k, l, m, puzzle, rating, solution;
    grid = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      grid[i] = new Array(9).fill(0);
    }
    while (true) {
      puzzle = sudoku.makepuzzle();
      solution = sudoku.solvepuzzle(puzzle);
      rating = sudoku.ratepuzzle(puzzle, 4);
      if (difficulty === rating) {
        index = 0;
        for (j = l = 0; l < 9; j = ++l) {
          for (i = m = 0; m < 9; i = ++m) {
            if ((puzzle[index] !== null) && (puzzle[index] > 0)) {
              grid[i][j] = puzzle[index];
            }
            index += 1;
          }
        }
        break;
      }
    }
    return grid;
  };

  return SudokuGenerator;

})();

module.exports = SudokuGenerator;


},{"sudoku":8}],5:[function(require,module,exports){
var ActionType, Color, MENU_POS_X, MENU_POS_Y, MODE_POS_X, MODE_POS_Y, PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, PENCIL_POS_X, PENCIL_POS_Y, PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, PEN_POS_X, PEN_POS_Y, SudokuGame, SudokuGenerator, SudokuView;

SudokuGenerator = require('./SudokuGenerator');

SudokuGame = require('./SudokuGame');

PEN_POS_X = 1;

PEN_POS_Y = 10;

PEN_CLEAR_POS_X = 2;

PEN_CLEAR_POS_Y = 13;

PENCIL_POS_X = 5;

PENCIL_POS_Y = 10;

PENCIL_CLEAR_POS_X = 6;

PENCIL_CLEAR_POS_Y = 13;

MENU_POS_X = 4;

MENU_POS_Y = 13;

MODE_POS_X = 4;

MODE_POS_Y = 9;

Color = {
  value: "black",
  pencil: "#0000ff",
  error: "#ff0000",
  done: "#cccccc",
  newGame: "#008833",
  backgroundSelected: "#eeeeaa",
  backgroundLocked: "#eeeeee",
  backgroundLockedConflicted: "#ffffee",
  backgroundLockedSelected: "#eeeedd",
  backgroundConflicted: "#ffffdd",
  backgroundError: "#ffdddd",
  modeSelect: "#777744",
  modePen: "#000000",
  modePencil: "#0000ff"
};

ActionType = {
  SELECT: 0,
  PENCIL: 1,
  VALUE: 2,
  NEWGAME: 3
};

SudokuView = (function() {
  function SudokuView(app, canvas) {
    var fontPixelsL, fontPixelsM, fontPixelsS, heightBasedCellSize, widthBasedCellSize;
    this.app = app;
    this.canvas = canvas;
    console.log("canvas size " + this.canvas.width + "x" + this.canvas.height);
    widthBasedCellSize = this.canvas.width / 9;
    heightBasedCellSize = this.canvas.height / 14;
    console.log("widthBasedCellSize " + widthBasedCellSize + " heightBasedCellSize " + heightBasedCellSize);
    this.cellSize = Math.min(widthBasedCellSize, heightBasedCellSize);
    this.lineWidthThin = 1;
    this.lineWidthThick = Math.max(this.cellSize / 20, 3);
    fontPixelsS = Math.floor(this.cellSize * 0.3);
    fontPixelsM = Math.floor(this.cellSize * 0.5);
    fontPixelsL = Math.floor(this.cellSize * 0.8);
    this.fonts = {
      pencil: this.app.registerFont("pencil", fontPixelsS + "px saxMono, monospace"),
      newgame: this.app.registerFont("newgame", fontPixelsM + "px saxMono, monospace"),
      pen: this.app.registerFont("pen", fontPixelsL + "px saxMono, monospace")
    };
    this.initActions();
    this.game = new SudokuGame();
    this.penValue = 0;
    this.isPencil = false;
    this.highlightX = -1;
    this.highlightY = -1;
    this.draw();
  }

  SudokuView.prototype.initActions = function() {
    var i, index, j, k, l, m, n, o, p;
    this.actions = new Array(9 * 15).fill(null);
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        index = (j * 9) + i;
        this.actions[index] = {
          type: ActionType.SELECT,
          x: i,
          y: j
        };
      }
    }
    for (j = m = 0; m < 3; j = ++m) {
      for (i = n = 0; n < 3; i = ++n) {
        index = ((PEN_POS_Y + j) * 9) + (PEN_POS_X + i);
        this.actions[index] = {
          type: ActionType.VALUE,
          x: 1 + (j * 3) + i,
          y: 0
        };
      }
    }
    for (j = o = 0; o < 3; j = ++o) {
      for (i = p = 0; p < 3; i = ++p) {
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i);
        this.actions[index] = {
          type: ActionType.PENCIL,
          x: 1 + (j * 3) + i,
          y: 0
        };
      }
    }
    index = (PEN_CLEAR_POS_Y * 9) + PEN_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.VALUE,
      x: 10,
      y: 0
    };
    index = (PENCIL_CLEAR_POS_Y * 9) + PENCIL_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PENCIL,
      x: 10,
      y: 0
    };
    index = (MENU_POS_Y * 9) + MENU_POS_X;
    this.actions[index] = {
      type: ActionType.NEWGAME,
      x: 0,
      y: 0
    };
  };

  SudokuView.prototype.drawCell = function(x, y, backgroundColor, s, font, color) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    return this.app.drawTextCentered(s, px + (this.cellSize / 2), py + (this.cellSize / 2), font, color);
  };

  SudokuView.prototype.drawGrid = function(originX, originY, size, solved) {
    var color, i, k, lineWidth, ref;
    if (solved == null) {
      solved = false;
    }
    for (i = k = 0, ref = size; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      color = solved ? "green" : "black";
      lineWidth = this.lineWidthThin;
      if ((size === 1) || (i % 3) === 0) {
        lineWidth = this.lineWidthThick;
      }
      this.app.drawLine(this.cellSize * (originX + 0), this.cellSize * (originY + i), this.cellSize * (originX + size), this.cellSize * (originY + i), color, lineWidth);
      this.app.drawLine(this.cellSize * (originX + i), this.cellSize * (originY + 0), this.cellSize * (originX + i), this.cellSize * (originY + size), color, lineWidth);
    }
  };

  SudokuView.prototype.draw = function() {
    var backgroundColor, cell, currentValue, currentValueString, done, font, i, j, k, l, m, modeColor, modeText, n, pencilBackgroundColor, pencilColor, text, textColor, valueBackgroundColor, valueColor;
    console.log("draw()");
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "black");
    this.app.drawFill(0, 0, this.cellSize * 9, this.canvas.height, "white");
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        cell = this.game.grid[i][j];
        backgroundColor = null;
        font = this.fonts.pen;
        textColor = Color.value;
        text = "";
        if (cell.value === 0) {
          font = this.fonts.pencil;
          textColor = Color.pencil;
          text = this.game.pencilString(i, j);
        } else {
          if (cell.value > 0) {
            text = String(cell.value);
          }
        }
        if (cell.locked) {
          backgroundColor = Color.backgroundLocked;
        }
        if ((this.highlightX !== -1) && (this.highlightY !== -1)) {
          if ((i === this.highlightX) && (j === this.highlightY)) {
            if (cell.locked) {
              backgroundColor = Color.backgroundLockedSelected;
            } else {
              backgroundColor = Color.backgroundSelected;
            }
          } else if (this.conflicts(i, j, this.highlightX, this.highlightY)) {
            if (cell.locked) {
              backgroundColor = Color.backgroundLockedConflicted;
            } else {
              backgroundColor = Color.backgroundConflicted;
            }
          }
        }
        if (cell.error) {
          textColor = Color.error;
        }
        this.drawCell(i, j, backgroundColor, text, font, textColor);
      }
    }
    done = this.game.done();
    for (j = m = 0; m < 3; j = ++m) {
      for (i = n = 0; n < 3; i = ++n) {
        currentValue = (j * 3) + i + 1;
        currentValueString = String(currentValue);
        valueColor = Color.value;
        pencilColor = Color.pencil;
        if (done[(j * 3) + i]) {
          valueColor = Color.done;
          pencilColor = Color.done;
        }
        valueBackgroundColor = null;
        pencilBackgroundColor = null;
        if (this.penValue === currentValue) {
          if (this.isPencil) {
            pencilBackgroundColor = Color.backgroundSelected;
          } else {
            valueBackgroundColor = Color.backgroundSelected;
          }
        }
        this.drawCell(PEN_POS_X + i, PEN_POS_Y + j, valueBackgroundColor, currentValueString, this.fonts.pen, valueColor);
        this.drawCell(PENCIL_POS_X + i, PENCIL_POS_Y + j, pencilBackgroundColor, currentValueString, this.fonts.pen, pencilColor);
      }
    }
    valueBackgroundColor = null;
    pencilBackgroundColor = null;
    if (this.penValue === 10) {
      if (this.isPencil) {
        pencilBackgroundColor = Color.backgroundSelected;
      } else {
        valueBackgroundColor = Color.backgroundSelected;
      }
    }
    this.drawCell(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, valueBackgroundColor, "C", this.fonts.pen, Color.error);
    this.drawCell(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, pencilBackgroundColor, "C", this.fonts.pen, Color.error);
    if (this.penValue === 0) {
      modeColor = Color.modeSelect;
      modeText = "Highlighting";
    } else {
      modeColor = this.isPencil ? Color.modePencil : Color.modePen;
      modeText = this.isPencil ? "Pencil" : "Pen";
    }
    this.drawCell(MODE_POS_X, MODE_POS_Y, null, modeText, this.fonts.newgame, modeColor);
    this.drawCell(MENU_POS_X, MENU_POS_Y, null, "Menu", this.fonts.newgame, Color.newGame);
    this.drawGrid(0, 0, 9, this.game.solved);
    this.drawGrid(PEN_POS_X, PEN_POS_Y, 3);
    this.drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3);
    this.drawGrid(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, 1);
    return this.drawGrid(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, 1);
  };

  SudokuView.prototype.newGame = function(difficulty) {
    console.log("SudokuView.newGame(" + difficulty + ")");
    return this.game.newGame(difficulty);
  };

  SudokuView.prototype.click = function(x, y) {
    var action, index;
    x = Math.floor(x / this.cellSize);
    y = Math.floor(y / this.cellSize);
    if ((x < 9) && (y < 15)) {
      index = (y * 9) + x;
      action = this.actions[index];
      if (action !== null) {
        console.log("Action: ", action);
        switch (action.type) {
          case ActionType.SELECT:
            if (this.penValue === 0) {
              if ((this.highlightX === action.x) && (this.highlightY === action.y)) {
                this.highlightX = -1;
                this.highlightY = -1;
              } else {
                this.highlightX = action.x;
                this.highlightY = action.y;
              }
            } else {
              if (this.isPencil) {
                if (this.penValue === 10) {
                  this.game.clearPencil(action.x, action.y);
                } else {
                  this.game.togglePencil(action.x, action.y, this.penValue);
                }
              } else {
                if (this.penValue === 10) {
                  this.game.setValue(action.x, action.y, 0);
                } else {
                  this.game.setValue(action.x, action.y, this.penValue);
                }
              }
            }
            break;
          case ActionType.PENCIL:
            this.isPencil = true;
            if (this.penValue === action.x) {
              this.penValue = 0;
            } else {
              this.penValue = action.x;
            }
            break;
          case ActionType.VALUE:
            this.isPencil = false;
            if (this.penValue === action.x) {
              this.penValue = 0;
            } else {
              this.penValue = action.x;
            }
            break;
          case ActionType.NEWGAME:
            this.app.switchView("menu");
            return;
        }
      } else {
        this.highlightX = -1;
        this.highlightY = -1;
        this.penValue = 0;
        this.isPencil = false;
      }
      return this.draw();
    }
  };

  SudokuView.prototype.conflicts = function(x1, y1, x2, y2) {
    var sx1, sx2, sy1, sy2;
    if ((x1 === x2) || (y1 === y2)) {
      return true;
    }
    sx1 = Math.floor(x1 / 3) * 3;
    sy1 = Math.floor(y1 / 3) * 3;
    sx2 = Math.floor(x2 / 3) * 3;
    sy2 = Math.floor(y2 / 3) * 3;
    if ((sx1 === sx2) && (sy1 === sy2)) {
      return true;
    }
    return false;
  };

  return SudokuView;

})();

module.exports = SudokuView;


},{"./SudokuGame":3,"./SudokuGenerator":4}],6:[function(require,module,exports){
var App, init;

App = require('./App');

init = function() {
  var canvas, canvasRect;
  console.log("init");
  canvas = document.createElement("canvas");
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvasRect = canvas.getBoundingClientRect();
  window.app = new App(canvas);
  return canvas.addEventListener("mousedown", function(e) {
    var x, y;
    x = e.clientX - canvasRect.left;
    y = e.clientY - canvasRect.top;
    return window.app.click(x, y);
  });
};

window.addEventListener('load', function(e) {
  return init();
}, false);


},{"./App":1}],7:[function(require,module,exports){
/* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function r(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function t(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function y(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;y(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);y(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,E=null,F=null;function G(){if(null===C)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);C=!!a&&603>parseInt(a[1],10)}else C=!1;return C}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());

},{}],8:[function(require,module,exports){
// Sudoku Generator and Solver for node.js
// Copyright (c) 2011 Blagovest Dachev.  All rights reserved.
//
// This is a port of David Bau's python  implementation:
// http://davidbau.com/archives/2006/09/04/sudoku_generator.html

var undefined;
var _ = require('underscore');

function makepuzzle(board) {
	var puzzle  = [];
	var deduced = makeArray(81, null);
	var order   = _.range(81);

	shuffleArray(order);

	for (var i = 0; i < order.length; i++) {
		var pos = order[i];

		if (deduced[pos] == null) {
			puzzle.push({pos:pos, num:board[pos]});
			deduced[pos] = board[pos];
			deduce(deduced);
		}
	}

	shuffleArray(puzzle);

	for (var i = puzzle.length - 1; i >= 0; i--) {
		var e = puzzle[i];
		removeElement(puzzle, i);

		var rating = checkpuzzle(boardforentries(puzzle), board);
		if (rating == -1) {
			puzzle.push(e);
		}
	}

	return boardforentries(puzzle);
}

function ratepuzzle(puzzle, samples) {
	var total = 0;

	for (var i = 0; i < samples; i++) {
		var tuple = solveboard(puzzle);

		if (tuple.answer == null) {
			return -1;
		}

		total += tuple.state.length;
	}

	return total / samples;
}

function checkpuzzle(puzzle, board) {
	if (board == undefined) {
		board = null;
	}

	var tuple1 = solveboard(puzzle);
	if (tuple1.answer == null) {
		return -1;
	}

	if (board != null && boardmatches(board, tuple1.answer) == false) {
		return -1;
	}

	var difficulty = tuple1.state.length;
	var tuple2     = solvenext(tuple1.state);

	if (tuple2.answer != null) {
		return -1;
	}
	
	return difficulty;
}

function solvepuzzle(board) {
    return solveboard(board).answer;
}

function solveboard(original) {
	var board   = [].concat(original);
	var guesses = deduce(board);

	if (guesses == null) {
		return {state:[], answer:board};
	}

	var track = [{guesses:guesses, count:0, board:board}];
	return solvenext(track);
}

function solvenext(remembered) {
    while (remembered.length > 0) {
    	var tuple1 = remembered.pop();

    	if (tuple1.count >= tuple1.guesses.length) {
    		continue;
    	}
 
    	remembered.push({guesses:tuple1.guesses, count:tuple1.count+1, board:tuple1.board});
    	var workspace = [].concat(tuple1.board);
    	var tuple2    = tuple1.guesses[tuple1.count];

    	workspace[tuple2.pos] = tuple2.num;

    	var guesses = deduce(workspace);

    	if (guesses == null) {
	    	return {state:remembered, answer:workspace};
	    }

    	remembered.push({guesses:guesses, count:0, board:workspace});
	}

    return {state:[], answer:null};
}

function deduce(board) {
	while (true) {
		var stuck = true;
		var guess = null;
		var count = 0;

	    // fill in any spots determined by direct conflicts
	    var tuple1  = figurebits(board);
	    var allowed = tuple1.allowed;
	    var needed  = tuple1.needed;

	    for (var pos = 0; pos < 81; pos++) {
	    	if (board[pos] == null) {
	    		var numbers = listbits(allowed[pos]);
	    		if (numbers.length == 0) {
	    			return [];
	    		}
	    		else if (numbers.length == 1) {
	    			board[pos] = numbers[0];
	    			stuck = false;
	    		}
	    		else if (stuck == true) {
	    			var t = _.map(numbers, function(val, key) {
	    				return {pos:pos, num:val};
	    			});

	    			var tuple2 = pickbetter(guess, count, t);
	    			guess = tuple2.guess;
	    			count = tuple2.count;
	    		}
	    	}
	    }

	    if (stuck == false) {
		    var tuple3  = figurebits(board);
		    allowed = tuple3.allowed;
		    needed  = tuple3.needed;
	    }

    	// fill in any spots determined by elimination of other locations
    	for (var axis = 0; axis < 3; axis++) {
	    	for (var x = 0; x < 9; x++) {
        		var numbers = listbits(needed[axis * 9 + x]);

		    	for (var i = 0; i < numbers.length; i++) {
		    		var n     = numbers[i];
		            var bit   = 1 << n;
          			var spots = [];

			    	for (var y = 0; y < 9; y++) {
			    		var pos = posfor(x, y, axis);
			    		if (allowed[pos] & bit) {
				    		spots.push(pos);
				    	}
			    	}

			    	if (spots.length == 0) {
				    	return [];
				    }
				    else if (spots.length == 1) {
					    board[spots[0]] = n;
					    stuck = false;
					}
					else if (stuck) {
		    			var t = _.map(spots, function(val, key) {
		    				return {pos:val, num:n};
		    			});

		    			var tuple4 = pickbetter(guess, count, t);
		    			guess = tuple4.guess;
		    			count = tuple4.count;
					}
		    	}
	    	}
    	}

    	if (stuck == true) {
    		if (guess != null) {
    			shuffleArray(guess);
    		}

    		return guess;
    	}
	}
}

function figurebits(board) {
	var needed  = [];
	var allowed = _.map(board, function(val, key) {
		return val == null ? 511 : 0;
	}, []);

	for (var axis = 0; axis < 3; axis++) {
		for (var x = 0; x < 9; x++) {
			var bits = axismissing(board, x, axis);
			needed.push(bits);

		    for (var y = 0; y < 9; y++) {
		    	var pos = posfor(x, y, axis);
		        allowed[pos] = allowed[pos] & bits;
			}
		}
	}

	return {allowed:allowed, needed:needed};
}

function posfor(x, y, axis) {
	if (axis == undefined) { axis = 0; }

    if (axis == 0) {
	    return x * 9 + y;
	}
	else if (axis == 1) {
		return y * 9 + x;
	}

	return ([0,3,6,27,30,33,54,57,60][x] + [0,1,2,9,10,11,18,19,20][y])
}

function axisfor(pos, axis) {
	if (axis == 0) {
		return Math.floor(pos / 9);
	}
	else if (axis == 1) {
		return pos % 9;
	}

	return Math.floor(pos / 27) * 3 + Math.floor(pos / 3) % 3;
}

function axismissing(board, x, axis) {
	var bits = 0;

	for (var y = 0; y < 9; y++) {
		var e = board[posfor(x, y, axis)];

		if (e != null) {
			bits |= 1 << e;
		}
	}

	return 511 ^ bits;
}

function listbits(bits) {
    var list = [];
	for (var y = 0; y < 9; y++) {
		if ((bits & (1 << y)) != 0) {
			list.push(y);
		}
	}

  return list;
}

function allowed(board, pos) {
	var bits = 511;

	for (var axis = 0; axis < 3; axis++) {
		var x = axisfor(pos, axis);
		bits = bits & axismissing(board, x, axis);
	}

	return bits;
}

// TODO: make sure callers utilize the return value correctly
function pickbetter(b, c, t) {
	if (b == null || t.length < b.length) {
		return {guess:t, count:1};
	}
	else if (t.length > b.length) {
		return {guess:b, count:c};
	}
	else if (randomInt(c) == 0) {
		return {guess:t, count:c+1};
	}

	return {guess:b, count:c+1};
}

function boardforentries(entries) {
	var board = _.map(_.range(81), function(val, key) {
		return null;
	});

	for (var i = 0; i < entries.length; i++) {
		var item = entries[i];
		var pos  = item.pos;
		var num  = item.num;

		board[pos] = num;
	}

	return board;
}

function boardmatches(b1, b2) {
	for (var i = 0; i < 81; i++) {
		if (b1[i] != b2[i]) {
			return false;
		}
	}

	return true;
}

function randomInt(max) {
	return Math.floor(Math.random() * (max+1));
}

function shuffleArray(original) {
	// Swap each element with another randomly selected one.
    for (var i = 0; i < original.length; i++) {
        var j = i;
        while (j == i) {
            j = Math.floor(Math.random() * original.length);
        }
        var contents = original[i];
        original[i]  = original[j];
        original[j]  = contents;
    }
}

function removeElement(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

function makeArray(length, value) {
	return _.map(_.range(length), function(val, key) {
		return value;
	})
}

module.exports = {
	makepuzzle  : function () { return makepuzzle(solvepuzzle(makeArray(81, null))); },
	solvepuzzle : solvepuzzle,
	ratepuzzle  : ratepuzzle,
	posfor      : posfor
};


},{"underscore":9}],9:[function(require,module,exports){
//     Underscore.js 1.1.6
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.1.6';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects implementing `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (_.isNumber(obj.length)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial && index === 0) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) return breaker;
    });
    return result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var values = slice.call(arguments, 1);
    return _.filter(array, function(value){ return !_.include(values, value); });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted) {
    return _.reduce(array, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo[memo.length] = el;
      return memo;
    }, []);
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, obj) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };


  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9Gb250RmFjZU9ic2VydmVyL2ZvbnRmYWNlb2JzZXJ2ZXIuc3RhbmRhbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9zdWRva3UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBRVA7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxLQUFELEdBQ0U7TUFBQSxJQUFBLEVBQU0sSUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixJQUFDLENBQUEsTUFBcEIsQ0FBTjtNQUNBLE1BQUEsRUFBUSxJQUFJLFVBQUosQ0FBZSxJQUFmLEVBQXFCLElBQUMsQ0FBQSxNQUF0QixDQURSOztJQUVGLElBQUMsQ0FBQSxVQUFELENBQVksUUFBWjtFQVJXOztnQkFVYixZQUFBLEdBQWMsU0FBQTtBQUNaLFFBQUE7QUFBQTtBQUFBLFNBQUEsZUFBQTs7TUFDRSxJ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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ0ZvbnRGYWNlT2JzZXJ2ZXInXG5cbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcblN1ZG9rdVZpZXcgPSByZXF1aXJlICcuL1N1ZG9rdVZpZXcnXG5cbmNsYXNzIEFwcFxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxuICAgIEBmb250cyA9IHt9XG5cbiAgICBAdmlld3MgPVxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgICBzdWRva3U6IG5ldyBTdWRva3VWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBtZWFzdXJlRm9udHM6IC0+XG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcbiAgICByZXR1cm5cblxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cbiAgICBmb250ID1cbiAgICAgIG5hbWU6IG5hbWVcbiAgICAgIHN0eWxlOiBzdHlsZVxuICAgICAgaGVpZ2h0OiAwXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxuICAgIEBtZWFzdXJlRm9udHMoKVxuICAgIHJldHVybiBmb250XG5cbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxuICAgICAgQG1lYXN1cmVGb250cygpXG4gICAgICBAZHJhdygpXG5cbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cbiAgICBAZHJhdygpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcbiAgICBAdmlld3Muc3Vkb2t1Lm5ld0dhbWUoZGlmZmljdWx0eSlcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGRyYXc6IC0+XG4gICAgQHZpZXcuZHJhdygpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXG5cbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHguZmlsbCgpXG5cbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXG4gICAgICBAY3R4LmZpbGwoKVxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxuICAgICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcbiAgQGJlZ2luUGF0aCgpXG4gIEBtb3ZlVG8oeCtyLCB5KVxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxuICBAY2xvc2VQYXRoKClcbiAgcmV0dXJuIHRoaXNcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5jbGFzcyBNZW51Vmlld1xuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XG4gICAgQGJ1dHRvbnMgPVxuICAgICAgbmV3RWFzeTpcbiAgICAgICAgeTogMC4zNVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxuICAgICAgbmV3TWVkaXVtOlxuICAgICAgICB5OiAwLjQ3XG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxuICAgICAgbmV3SGFyZDpcbiAgICAgICAgeTogMC41OVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxuICAgICAgcmVzdW1lOlxuICAgICAgICB5OiAwLjg1XG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXG5cbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjFcbiAgICBidXR0b25YID0gQGNhbnZhcy53aWR0aCAqIDAuMVxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcblxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHJldHVyblxuXG4gIGRyYXc6IC0+XG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXG5cbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDJcblxuICAgIHkxID0gQGNhbnZhcy5oZWlnaHQgKiAwLjFcbiAgICB5MiA9IEBjYW52YXMuaGVpZ2h0ICogMC4yXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4yLCBidXR0b24uYmdDb2xvciwgXCIjNDQ0NDQ0XCIpXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxuXG4gIGNsaWNrOiAoeCwgeSkgLT5cbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxuICAgICAgICBidXR0b24uY2xpY2soKVxuICAgIHJldHVyblxuXG4gIG5ld0Vhc3k6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXG5cbiAgbmV3TWVkaXVtOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXG5cbiAgbmV3SGFyZDogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcblxuICByZXN1bWU6IC0+XG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5jbGFzcyBTdWRva3VHYW1lXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAZ3JpZFtpXVtqXSA9XG4gICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICBlcnJvcjogZmFsc2VcbiAgICAgICAgICBsb2NrZWQ6IGZhbHNlXG4gICAgICAgICAgcGVuY2lsOiBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcblxuICAgIEBzb2x2ZWQgPSBmYWxzZVxuICAgIGlmIG5vdCBAbG9hZCgpXG4gICAgICBAbmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxuICAgIHJldHVyblxuXG4gIHVwZGF0ZUNlbGw6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgeCAhPSBpXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuXG4gICAgICBpZiB5ICE9IGlcbiAgICAgICAgdiA9IEBncmlkW3hdW2ldLnZhbHVlXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICBAZ3JpZFt4XVtpXS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxuICAgICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuICAgIHJldHVyblxuXG4gIHVwZGF0ZUNlbGxzOiAtPlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0uZXJyb3IgPSBmYWxzZVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxuXG4gICAgQHNvbHZlZCA9IHRydWVcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmVycm9yXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcblxuICAgIGlmIEBzb2x2ZWRcbiAgICAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxuXG4gICAgcmV0dXJuIEBzb2x2ZWRcblxuICBkb25lOiAtPlxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxuICAgICAgICAgIGNvdW50c1tAZ3JpZFtpXVtqXS52YWx1ZS0xXSArPSAxXG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiBjb3VudHNbaV0gPT0gOVxuICAgICAgICBkW2ldID0gdHJ1ZVxuICAgIHJldHVybiBkXG5cbiAgcGVuY2lsU3RyaW5nOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBzID0gXCJcIlxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXG4gICAgICAgIHMgKz0gU3RyaW5nKGkrMSlcbiAgICByZXR1cm4gc1xuXG4gIGNsZWFyUGVuY2lsOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgY2VsbC5wZW5jaWxbaV0gPSBmYWxzZVxuICAgIEBzYXZlKClcblxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBjZWxsLnBlbmNpbFt2LTFdID0gIWNlbGwucGVuY2lsW3YtMV1cbiAgICBAc2F2ZSgpXG5cbiAgc2V0VmFsdWU6ICh4LCB5LCB2KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBjZWxsLnZhbHVlID0gdlxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgY2VsbC52YWx1ZSA9IDBcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcblxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3IoKVxuICAgIG5ld0dyaWQgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoZGlmZmljdWx0eSlcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IG5ld0dyaWRbaV1bal1cbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgbG9hZDogLT5cbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBqc29uU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lXCIpXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xuICAgIGdhbWVEYXRhID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxuICAgIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgc3JjID0gZ2FtZURhdGEuZ3JpZFtpXVtqXVxuICAgICAgICBkc3QgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxuICAgICAgICBkc3QuZXJyb3IgPSBpZiBzcmMuZSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgZHN0LmxvY2tlZCA9IGlmIHNyYy5sID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgZHN0LnBlbmNpbFtrXSA9IGlmIHNyYy5wW2tdID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBnYW1lLlwiXG4gICAgcmV0dXJuIHRydWVcblxuICBzYXZlOiAtPlxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgZ2FtZURhdGEgPVxuICAgICAgZ3JpZDogbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGdhbWVEYXRhLmdyaWRbaV1bal0gPVxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcbiAgICAgICAgICBlOiBpZiBjZWxsLmVycm9yIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICBsOiBpZiBjZWxsLmxvY2tlZCB0aGVuIDEgZWxzZSAwXG4gICAgICAgICAgcDogW11cbiAgICAgICAgZHN0ID0gZ2FtZURhdGEuZ3JpZFtpXVtqXS5wXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxuXG4gICAganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGdhbWVEYXRhKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcbiAgICByZXR1cm4gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcbiIsInN1ZG9rdSA9IHJlcXVpcmUgJ3N1ZG9rdSdcblxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXG4gIEBkaWZmaWN1bHR5OlxuICAgIGVhc3k6IDFcbiAgICBtZWRpdW06IDJcbiAgICBoYXJkOiAzXG5cbiAgY29uc3RydWN0b3I6IC0+XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuXG4gICAgbG9vcFxuICAgICAgcHV6emxlICAgPSBzdWRva3UubWFrZXB1enpsZSgpXG4gICAgICBzb2x1dGlvbiA9IHN1ZG9rdS5zb2x2ZXB1enpsZShwdXp6bGUpXG4gICAgICByYXRpbmcgICA9IHN1ZG9rdS5yYXRlcHV6emxlKHB1enpsZSwgNClcbiAgICAgIGlmIGRpZmZpY3VsdHkgPT0gcmF0aW5nXG4gICAgICAgIGluZGV4ID0gMFxuICAgICAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICAgICAgaWYgKHB1enpsZVtpbmRleF0gIT0gbnVsbCkgYW5kIChwdXp6bGVbaW5kZXhdID4gMClcbiAgICAgICAgICAgICAgZ3JpZFtpXVtqXSA9IHB1enpsZVtpbmRleF1cbiAgICAgICAgICAgIGluZGV4ICs9IDFcbiAgICAgICAgYnJlYWtcbiAgICByZXR1cm4gZ3JpZFxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxuXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcblN1ZG9rdUdhbWUgPSByZXF1aXJlICcuL1N1ZG9rdUdhbWUnXG5cblBFTl9QT1NfWCA9IDFcblBFTl9QT1NfWSA9IDEwXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXG5QRU5fQ0xFQVJfUE9TX1kgPSAxM1xuXG5QRU5DSUxfUE9TX1ggPSA1XG5QRU5DSUxfUE9TX1kgPSAxMFxuUEVOQ0lMX0NMRUFSX1BPU19YID0gNlxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcblxuTUVOVV9QT1NfWCA9IDRcbk1FTlVfUE9TX1kgPSAxM1xuXG5NT0RFX1BPU19YID0gNFxuTU9ERV9QT1NfWSA9IDlcblxuQ29sb3IgPVxuICB2YWx1ZTogXCJibGFja1wiXG4gIHBlbmNpbDogXCIjMDAwMGZmXCJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXG4gIGRvbmU6IFwiI2NjY2NjY1wiXG4gIG5ld0dhbWU6IFwiIzAwODgzM1wiXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcbiAgYmFja2dyb3VuZExvY2tlZDogXCIjZWVlZWVlXCJcbiAgYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWQ6IFwiI2ZmZmZlZVwiXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcbiAgYmFja2dyb3VuZENvbmZsaWN0ZWQ6IFwiI2ZmZmZkZFwiXG4gIGJhY2tncm91bmRFcnJvcjogXCIjZmZkZGRkXCJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcbiAgbW9kZVBlbjogXCIjMDAwMDAwXCJcbiAgbW9kZVBlbmNpbDogXCIjMDAwMGZmXCJcblxuQWN0aW9uVHlwZSA9XG4gIFNFTEVDVDogMFxuICBQRU5DSUw6IDFcbiAgVkFMVUU6IDJcbiAgTkVXR0FNRTogM1xuXG5jbGFzcyBTdWRva3VWaWV3XG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIEluaXRcblxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcblxuICAgIHdpZHRoQmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMud2lkdGggLyA5XG4gICAgaGVpZ2h0QmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMuaGVpZ2h0IC8gMTRcbiAgICBjb25zb2xlLmxvZyBcIndpZHRoQmFzZWRDZWxsU2l6ZSAje3dpZHRoQmFzZWRDZWxsU2l6ZX0gaGVpZ2h0QmFzZWRDZWxsU2l6ZSAje2hlaWdodEJhc2VkQ2VsbFNpemV9XCJcbiAgICBAY2VsbFNpemUgPSBNYXRoLm1pbih3aWR0aEJhc2VkQ2VsbFNpemUsIGhlaWdodEJhc2VkQ2VsbFNpemUpXG5cbiAgICAjIGNhbGMgcmVuZGVyIGNvbnN0YW50c1xuICAgIEBsaW5lV2lkdGhUaGluID0gMVxuICAgIEBsaW5lV2lkdGhUaGljayA9IE1hdGgubWF4KEBjZWxsU2l6ZSAvIDIwLCAzKVxuXG4gICAgZm9udFBpeGVsc1MgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuMylcbiAgICBmb250UGl4ZWxzTSA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC41KVxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXG5cbiAgICAjIGluaXQgZm9udHNcbiAgICBAZm9udHMgPVxuICAgICAgcGVuY2lsOiAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5jaWxcIiwgIFwiI3tmb250UGl4ZWxzU31weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICAgIG5ld2dhbWU6IEBhcHAucmVnaXN0ZXJGb250KFwibmV3Z2FtZVwiLCBcIiN7Zm9udFBpeGVsc019cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQGluaXRBY3Rpb25zKClcblxuICAgICMgaW5pdCBzdGF0ZVxuICAgIEBnYW1lID0gbmV3IFN1ZG9rdUdhbWUoKVxuICAgIEBwZW5WYWx1ZSA9IDBcbiAgICBAaXNQZW5jaWwgPSBmYWxzZVxuICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXG5cbiAgICBAZHJhdygpXG5cbiAgaW5pdEFjdGlvbnM6IC0+XG4gICAgQGFjdGlvbnMgPSBuZXcgQXJyYXkoOSAqIDE1KS5maWxsKG51bGwpXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlNFTEVDVCwgeDogaSwgeTogaiB9XG5cbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGluZGV4ID0gKChQRU5fUE9TX1kgKyBqKSAqIDkpICsgKFBFTl9QT1NfWCArIGkpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5WQUxVRSwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cblxuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaW5kZXggPSAoKFBFTkNJTF9QT1NfWSArIGopICogOSkgKyAoUEVOQ0lMX1BPU19YICsgaSlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cblxuICAgICMgVmFsdWUgY2xlYXIgYnV0dG9uXG4gICAgaW5kZXggPSAoUEVOX0NMRUFSX1BPU19ZICogOSkgKyBQRU5fQ0xFQVJfUE9TX1hcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEwLCB5OiAwIH1cblxuICAgICMgUGVuY2lsIGNsZWFyIGJ1dHRvblxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgeDogMTAsIHk6IDAgfVxuXG4gICAgIyBOZXcgR2FtZSBidXR0b25cbiAgICBpbmRleCA9IChNRU5VX1BPU19ZICogOSkgKyBNRU5VX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk5FV0dBTUUsIHg6IDAsIHk6IDAgfVxuXG4gICAgcmV0dXJuXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgUmVuZGVyaW5nXG5cbiAgZHJhd0NlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIHMsIGZvbnQsIGNvbG9yKSAtPlxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxuICAgIHB5ID0geSAqIEBjZWxsU2l6ZVxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQocywgcHggKyAoQGNlbGxTaXplIC8gMiksIHB5ICsgKEBjZWxsU2l6ZSAvIDIpLCBmb250LCBjb2xvcilcblxuICBkcmF3R3JpZDogKG9yaWdpblgsIG9yaWdpblksIHNpemUsIHNvbHZlZCA9IGZhbHNlKSAtPlxuICAgIGZvciBpIGluIFswLi5zaXplXVxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcbiAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGluXG4gICAgICBpZiAoKHNpemUgPT0gMSkgfHwgKGkgJSAzKSA9PSAwKVxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcblxuICAgICAgIyBIb3Jpem9udGFsIGxpbmVzXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXG5cbiAgICAgICMgVmVydGljYWwgbGluZXNcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcblxuICAgIHJldHVyblxuXG4gIGRyYXc6IC0+XG4gICAgY29uc29sZS5sb2cgXCJkcmF3KClcIlxuXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcImJsYWNrXCIpXG5cbiAgICAjIE1ha2Ugd2hpdGUgcGhvbmUtc2hhcGVkIGJhY2tncm91bmRcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjZWxsU2l6ZSAqIDksIEBjYW52YXMuaGVpZ2h0LCBcIndoaXRlXCIpXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXG5cbiAgICAgICAgYmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBmb250ID0gQGZvbnRzLnBlblxuICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci52YWx1ZVxuICAgICAgICB0ZXh0ID0gXCJcIlxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcbiAgICAgICAgICBmb250ID0gQGZvbnRzLnBlbmNpbFxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnBlbmNpbFxuICAgICAgICAgIHRleHQgPSBAZ2FtZS5wZW5jaWxTdHJpbmcoaSwgailcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGNlbGwudmFsdWUgPiAwXG4gICAgICAgICAgICB0ZXh0ID0gU3RyaW5nKGNlbGwudmFsdWUpXG5cbiAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXG5cbiAgICAgICAgaWYgKEBoaWdobGlnaHRYICE9IC0xKSAmJiAoQGhpZ2hsaWdodFkgIT0gLTEpXG4gICAgICAgICAgaWYgKGkgPT0gQGhpZ2hsaWdodFgpICYmIChqID09IEBoaWdobGlnaHRZKVxuICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICAgIGVsc2UgaWYgQGNvbmZsaWN0cyhpLCBqLCBAaGlnaGxpZ2h0WCwgQGhpZ2hsaWdodFkpXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kQ29uZmxpY3RlZFxuXG4gICAgICAgIGlmIGNlbGwuZXJyb3JcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5lcnJvclxuXG4gICAgICAgIEBkcmF3Q2VsbChpLCBqLCBiYWNrZ3JvdW5kQ29sb3IsIHRleHQsIGZvbnQsIHRleHRDb2xvcilcblxuICAgIGRvbmUgPSBAZ2FtZS5kb25lKClcbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGN1cnJlbnRWYWx1ZSA9IChqICogMykgKyBpICsgMVxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxuICAgICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IuZG9uZVxuXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcbiAgICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG5cbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXG5cbiAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgaWYgQHBlblZhbHVlID09IDEwXG4gICAgICAgIGlmIEBpc1BlbmNpbFxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG5cbiAgICBAZHJhd0NlbGwoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIHZhbHVlQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXG4gICAgQGRyYXdDZWxsKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcblxuICAgIGlmIEBwZW5WYWx1ZSA9PSAwXG4gICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlU2VsZWN0XG4gICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcbiAgICBlbHNlXG4gICAgICBtb2RlQ29sb3IgPSBpZiBAaXNQZW5jaWwgdGhlbiBDb2xvci5tb2RlUGVuY2lsIGVsc2UgQ29sb3IubW9kZVBlblxuICAgICAgbW9kZVRleHQgPSBpZiBAaXNQZW5jaWwgdGhlbiBcIlBlbmNpbFwiIGVsc2UgXCJQZW5cIlxuICAgIEBkcmF3Q2VsbChNT0RFX1BPU19YLCBNT0RFX1BPU19ZLCBudWxsLCBtb2RlVGV4dCwgQGZvbnRzLm5ld2dhbWUsIG1vZGVDb2xvcilcblxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm5ld2dhbWUsIENvbG9yLm5ld0dhbWUpXG5cbiAgICAjIE1ha2UgdGhlIGdyaWRzXG4gICAgQGRyYXdHcmlkKDAsIDAsIDksIEBnYW1lLnNvbHZlZClcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9QT1NfWCwgUEVOQ0lMX1BPU19ZLCAzKVxuICAgIEBkcmF3R3JpZChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgMSlcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSW5wdXRcblxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cbiAgICBjb25zb2xlLmxvZyBcIlN1ZG9rdVZpZXcubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG4gICAgQGdhbWUubmV3R2FtZShkaWZmaWN1bHR5KVxuXG4gIGNsaWNrOiAoeCwgeSkgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiY2xpY2sgI3t4fSwgI3t5fVwiXG4gICAgeCA9IE1hdGguZmxvb3IoeCAvIEBjZWxsU2l6ZSlcbiAgICB5ID0gTWF0aC5mbG9vcih5IC8gQGNlbGxTaXplKVxuXG4gICAgaWYgKHggPCA5KSAmJiAoeSA8IDE1KVxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XG4gICAgICAgIGFjdGlvbiA9IEBhY3Rpb25zW2luZGV4XVxuICAgICAgICBpZiBhY3Rpb24gIT0gbnVsbFxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXG4gICAgICAgICAgc3dpdGNoIGFjdGlvbi50eXBlXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuU0VMRUNUXG4gICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAwXG4gICAgICAgICAgICAgICAgaWYgKEBoaWdobGlnaHRYID09IGFjdGlvbi54KSAmJiAoQGhpZ2hsaWdodFkgPT0gYWN0aW9uLnkpXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFggPSBhY3Rpb24ueFxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFkgPSBhY3Rpb24ueVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgQGlzUGVuY2lsXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUuY2xlYXJQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55KVxuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS50b2dnbGVQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IDEwXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgMClcbiAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXG5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU5DSUxcbiAgICAgICAgICAgICAgQGlzUGVuY2lsID0gdHJ1ZVxuICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gYWN0aW9uLnhcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24ueFxuXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuVkFMVUVcbiAgICAgICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcbiAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IGFjdGlvbi54XG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gMFxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnhcblxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLk5FV0dBTUVcbiAgICAgICAgICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwibWVudVwiKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgbm8gYWN0aW9uXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgICBAcGVuVmFsdWUgPSAwXG4gICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcblxuICAgICAgICBAZHJhdygpXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSGVscGVyc1xuXG4gIGNvbmZsaWN0czogKHgxLCB5MSwgeDIsIHkyKSAtPlxuICAgICMgc2FtZSByb3cgb3IgY29sdW1uP1xuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgc2FtZSBzZWN0aW9uP1xuICAgIHN4MSA9IE1hdGguZmxvb3IoeDEgLyAzKSAqIDNcbiAgICBzeTEgPSBNYXRoLmZsb29yKHkxIC8gMykgKiAzXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xuICAgIHN5MiA9IE1hdGguZmxvb3IoeTIgLyAzKSAqIDNcbiAgICBpZiAoc3gxID09IHN4MikgJiYgKHN5MSA9PSBzeTIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXG5cbmluaXQgPSAtPlxuICBjb25zb2xlLmxvZyBcImluaXRcIlxuICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShjYW52YXMsIGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXSlcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gIHdpbmRvdy5hcHAgPSBuZXcgQXBwKGNhbnZhcylcblxuICAjIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cbiAgIyAgIGNvbnNvbGUubG9nIE9iamVjdC5rZXlzKGUudG91Y2hlc1swXSlcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAjICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgIyAgIHdpbmRvdy5hcHAuY2xpY2soeCwgeSlcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxuICAgIGluaXQoKVxuLCBmYWxzZSlcbiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIiwiLy8gU3Vkb2t1IEdlbmVyYXRvciBhbmQgU29sdmVyIGZvciBub2RlLmpzXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTEgQmxhZ292ZXN0IERhY2hldi4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gVGhpcyBpcyBhIHBvcnQgb2YgRGF2aWQgQmF1J3MgcHl0aG9uICBpbXBsZW1lbnRhdGlvbjpcbi8vIGh0dHA6Ly9kYXZpZGJhdS5jb20vYXJjaGl2ZXMvMjAwNi8wOS8wNC9zdWRva3VfZ2VuZXJhdG9yLmh0bWxcblxudmFyIHVuZGVmaW5lZDtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG5mdW5jdGlvbiBtYWtlcHV6emxlKGJvYXJkKSB7XG5cdHZhciBwdXp6bGUgID0gW107XG5cdHZhciBkZWR1Y2VkID0gbWFrZUFycmF5KDgxLCBudWxsKTtcblx0dmFyIG9yZGVyICAgPSBfLnJhbmdlKDgxKTtcblxuXHRzaHVmZmxlQXJyYXkob3JkZXIpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgb3JkZXIubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgcG9zID0gb3JkZXJbaV07XG5cblx0XHRpZiAoZGVkdWNlZFtwb3NdID09IG51bGwpIHtcblx0XHRcdHB1enpsZS5wdXNoKHtwb3M6cG9zLCBudW06Ym9hcmRbcG9zXX0pO1xuXHRcdFx0ZGVkdWNlZFtwb3NdID0gYm9hcmRbcG9zXTtcblx0XHRcdGRlZHVjZShkZWR1Y2VkKTtcblx0XHR9XG5cdH1cblxuXHRzaHVmZmxlQXJyYXkocHV6emxlKTtcblxuXHRmb3IgKHZhciBpID0gcHV6emxlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dmFyIGUgPSBwdXp6bGVbaV07XG5cdFx0cmVtb3ZlRWxlbWVudChwdXp6bGUsIGkpO1xuXG5cdFx0dmFyIHJhdGluZyA9IGNoZWNrcHV6emxlKGJvYXJkZm9yZW50cmllcyhwdXp6bGUpLCBib2FyZCk7XG5cdFx0aWYgKHJhdGluZyA9PSAtMSkge1xuXHRcdFx0cHV6emxlLnB1c2goZSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGJvYXJkZm9yZW50cmllcyhwdXp6bGUpO1xufVxuXG5mdW5jdGlvbiByYXRlcHV6emxlKHB1enpsZSwgc2FtcGxlcykge1xuXHR2YXIgdG90YWwgPSAwO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2FtcGxlczsgaSsrKSB7XG5cdFx0dmFyIHR1cGxlID0gc29sdmVib2FyZChwdXp6bGUpO1xuXG5cdFx0aWYgKHR1cGxlLmFuc3dlciA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0dG90YWwgKz0gdHVwbGUuc3RhdGUubGVuZ3RoO1xuXHR9XG5cblx0cmV0dXJuIHRvdGFsIC8gc2FtcGxlcztcbn1cblxuZnVuY3Rpb24gY2hlY2twdXp6bGUocHV6emxlLCBib2FyZCkge1xuXHRpZiAoYm9hcmQgPT0gdW5kZWZpbmVkKSB7XG5cdFx0Ym9hcmQgPSBudWxsO1xuXHR9XG5cblx0dmFyIHR1cGxlMSA9IHNvbHZlYm9hcmQocHV6emxlKTtcblx0aWYgKHR1cGxlMS5hbnN3ZXIgPT0gbnVsbCkge1xuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdGlmIChib2FyZCAhPSBudWxsICYmIGJvYXJkbWF0Y2hlcyhib2FyZCwgdHVwbGUxLmFuc3dlcikgPT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gLTE7XG5cdH1cblxuXHR2YXIgZGlmZmljdWx0eSA9IHR1cGxlMS5zdGF0ZS5sZW5ndGg7XG5cdHZhciB0dXBsZTIgICAgID0gc29sdmVuZXh0KHR1cGxlMS5zdGF0ZSk7XG5cblx0aWYgKHR1cGxlMi5hbnN3ZXIgIT0gbnVsbCkge1xuXHRcdHJldHVybiAtMTtcblx0fVxuXHRcblx0cmV0dXJuIGRpZmZpY3VsdHk7XG59XG5cbmZ1bmN0aW9uIHNvbHZlcHV6emxlKGJvYXJkKSB7XG4gICAgcmV0dXJuIHNvbHZlYm9hcmQoYm9hcmQpLmFuc3dlcjtcbn1cblxuZnVuY3Rpb24gc29sdmVib2FyZChvcmlnaW5hbCkge1xuXHR2YXIgYm9hcmQgICA9IFtdLmNvbmNhdChvcmlnaW5hbCk7XG5cdHZhciBndWVzc2VzID0gZGVkdWNlKGJvYXJkKTtcblxuXHRpZiAoZ3Vlc3NlcyA9PSBudWxsKSB7XG5cdFx0cmV0dXJuIHtzdGF0ZTpbXSwgYW5zd2VyOmJvYXJkfTtcblx0fVxuXG5cdHZhciB0cmFjayA9IFt7Z3Vlc3NlczpndWVzc2VzLCBjb3VudDowLCBib2FyZDpib2FyZH1dO1xuXHRyZXR1cm4gc29sdmVuZXh0KHRyYWNrKTtcbn1cblxuZnVuY3Rpb24gc29sdmVuZXh0KHJlbWVtYmVyZWQpIHtcbiAgICB3aGlsZSAocmVtZW1iZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgXHR2YXIgdHVwbGUxID0gcmVtZW1iZXJlZC5wb3AoKTtcblxuICAgIFx0aWYgKHR1cGxlMS5jb3VudCA+PSB0dXBsZTEuZ3Vlc3Nlcy5sZW5ndGgpIHtcbiAgICBcdFx0Y29udGludWU7XG4gICAgXHR9XG4gXG4gICAgXHRyZW1lbWJlcmVkLnB1c2goe2d1ZXNzZXM6dHVwbGUxLmd1ZXNzZXMsIGNvdW50OnR1cGxlMS5jb3VudCsxLCBib2FyZDp0dXBsZTEuYm9hcmR9KTtcbiAgICBcdHZhciB3b3Jrc3BhY2UgPSBbXS5jb25jYXQodHVwbGUxLmJvYXJkKTtcbiAgICBcdHZhciB0dXBsZTIgICAgPSB0dXBsZTEuZ3Vlc3Nlc1t0dXBsZTEuY291bnRdO1xuXG4gICAgXHR3b3Jrc3BhY2VbdHVwbGUyLnBvc10gPSB0dXBsZTIubnVtO1xuXG4gICAgXHR2YXIgZ3Vlc3NlcyA9IGRlZHVjZSh3b3Jrc3BhY2UpO1xuXG4gICAgXHRpZiAoZ3Vlc3NlcyA9PSBudWxsKSB7XG5cdCAgICBcdHJldHVybiB7c3RhdGU6cmVtZW1iZXJlZCwgYW5zd2VyOndvcmtzcGFjZX07XG5cdCAgICB9XG5cbiAgICBcdHJlbWVtYmVyZWQucHVzaCh7Z3Vlc3NlczpndWVzc2VzLCBjb3VudDowLCBib2FyZDp3b3Jrc3BhY2V9KTtcblx0fVxuXG4gICAgcmV0dXJuIHtzdGF0ZTpbXSwgYW5zd2VyOm51bGx9O1xufVxuXG5mdW5jdGlvbiBkZWR1Y2UoYm9hcmQpIHtcblx0d2hpbGUgKHRydWUpIHtcblx0XHR2YXIgc3R1Y2sgPSB0cnVlO1xuXHRcdHZhciBndWVzcyA9IG51bGw7XG5cdFx0dmFyIGNvdW50ID0gMDtcblxuXHQgICAgLy8gZmlsbCBpbiBhbnkgc3BvdHMgZGV0ZXJtaW5lZCBieSBkaXJlY3QgY29uZmxpY3RzXG5cdCAgICB2YXIgdHVwbGUxICA9IGZpZ3VyZWJpdHMoYm9hcmQpO1xuXHQgICAgdmFyIGFsbG93ZWQgPSB0dXBsZTEuYWxsb3dlZDtcblx0ICAgIHZhciBuZWVkZWQgID0gdHVwbGUxLm5lZWRlZDtcblxuXHQgICAgZm9yICh2YXIgcG9zID0gMDsgcG9zIDwgODE7IHBvcysrKSB7XG5cdCAgICBcdGlmIChib2FyZFtwb3NdID09IG51bGwpIHtcblx0ICAgIFx0XHR2YXIgbnVtYmVycyA9IGxpc3RiaXRzKGFsbG93ZWRbcG9zXSk7XG5cdCAgICBcdFx0aWYgKG51bWJlcnMubGVuZ3RoID09IDApIHtcblx0ICAgIFx0XHRcdHJldHVybiBbXTtcblx0ICAgIFx0XHR9XG5cdCAgICBcdFx0ZWxzZSBpZiAobnVtYmVycy5sZW5ndGggPT0gMSkge1xuXHQgICAgXHRcdFx0Ym9hcmRbcG9zXSA9IG51bWJlcnNbMF07XG5cdCAgICBcdFx0XHRzdHVjayA9IGZhbHNlO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0XHRlbHNlIGlmIChzdHVjayA9PSB0cnVlKSB7XG5cdCAgICBcdFx0XHR2YXIgdCA9IF8ubWFwKG51bWJlcnMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG5cdCAgICBcdFx0XHRcdHJldHVybiB7cG9zOnBvcywgbnVtOnZhbH07XG5cdCAgICBcdFx0XHR9KTtcblxuXHQgICAgXHRcdFx0dmFyIHR1cGxlMiA9IHBpY2tiZXR0ZXIoZ3Vlc3MsIGNvdW50LCB0KTtcblx0ICAgIFx0XHRcdGd1ZXNzID0gdHVwbGUyLmd1ZXNzO1xuXHQgICAgXHRcdFx0Y291bnQgPSB0dXBsZTIuY291bnQ7XG5cdCAgICBcdFx0fVxuXHQgICAgXHR9XG5cdCAgICB9XG5cblx0ICAgIGlmIChzdHVjayA9PSBmYWxzZSkge1xuXHRcdCAgICB2YXIgdHVwbGUzICA9IGZpZ3VyZWJpdHMoYm9hcmQpO1xuXHRcdCAgICBhbGxvd2VkID0gdHVwbGUzLmFsbG93ZWQ7XG5cdFx0ICAgIG5lZWRlZCAgPSB0dXBsZTMubmVlZGVkO1xuXHQgICAgfVxuXG4gICAgXHQvLyBmaWxsIGluIGFueSBzcG90cyBkZXRlcm1pbmVkIGJ5IGVsaW1pbmF0aW9uIG9mIG90aGVyIGxvY2F0aW9uc1xuICAgIFx0Zm9yICh2YXIgYXhpcyA9IDA7IGF4aXMgPCAzOyBheGlzKyspIHtcblx0ICAgIFx0Zm9yICh2YXIgeCA9IDA7IHggPCA5OyB4KyspIHtcbiAgICAgICAgXHRcdHZhciBudW1iZXJzID0gbGlzdGJpdHMobmVlZGVkW2F4aXMgKiA5ICsgeF0pO1xuXG5cdFx0ICAgIFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0ICAgIFx0XHR2YXIgbiAgICAgPSBudW1iZXJzW2ldO1xuXHRcdCAgICAgICAgICAgIHZhciBiaXQgICA9IDEgPDwgbjtcbiAgICAgICAgICBcdFx0XHR2YXIgc3BvdHMgPSBbXTtcblxuXHRcdFx0ICAgIFx0Zm9yICh2YXIgeSA9IDA7IHkgPCA5OyB5KyspIHtcblx0XHRcdCAgICBcdFx0dmFyIHBvcyA9IHBvc2Zvcih4LCB5LCBheGlzKTtcblx0XHRcdCAgICBcdFx0aWYgKGFsbG93ZWRbcG9zXSAmIGJpdCkge1xuXHRcdFx0XHQgICAgXHRcdHNwb3RzLnB1c2gocG9zKTtcblx0XHRcdFx0ICAgIFx0fVxuXHRcdFx0ICAgIFx0fVxuXG5cdFx0XHQgICAgXHRpZiAoc3BvdHMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0ICAgIFx0cmV0dXJuIFtdO1xuXHRcdFx0XHQgICAgfVxuXHRcdFx0XHQgICAgZWxzZSBpZiAoc3BvdHMubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHQgICAgYm9hcmRbc3BvdHNbMF1dID0gbjtcblx0XHRcdFx0XHQgICAgc3R1Y2sgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoc3R1Y2spIHtcblx0XHQgICAgXHRcdFx0dmFyIHQgPSBfLm1hcChzcG90cywgZnVuY3Rpb24odmFsLCBrZXkpIHtcblx0XHQgICAgXHRcdFx0XHRyZXR1cm4ge3Bvczp2YWwsIG51bTpufTtcblx0XHQgICAgXHRcdFx0fSk7XG5cblx0XHQgICAgXHRcdFx0dmFyIHR1cGxlNCA9IHBpY2tiZXR0ZXIoZ3Vlc3MsIGNvdW50LCB0KTtcblx0XHQgICAgXHRcdFx0Z3Vlc3MgPSB0dXBsZTQuZ3Vlc3M7XG5cdFx0ICAgIFx0XHRcdGNvdW50ID0gdHVwbGU0LmNvdW50O1xuXHRcdFx0XHRcdH1cblx0XHQgICAgXHR9XG5cdCAgICBcdH1cbiAgICBcdH1cblxuICAgIFx0aWYgKHN0dWNrID09IHRydWUpIHtcbiAgICBcdFx0aWYgKGd1ZXNzICE9IG51bGwpIHtcbiAgICBcdFx0XHRzaHVmZmxlQXJyYXkoZ3Vlc3MpO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0cmV0dXJuIGd1ZXNzO1xuICAgIFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGZpZ3VyZWJpdHMoYm9hcmQpIHtcblx0dmFyIG5lZWRlZCAgPSBbXTtcblx0dmFyIGFsbG93ZWQgPSBfLm1hcChib2FyZCwgZnVuY3Rpb24odmFsLCBrZXkpIHtcblx0XHRyZXR1cm4gdmFsID09IG51bGwgPyA1MTEgOiAwO1xuXHR9LCBbXSk7XG5cblx0Zm9yICh2YXIgYXhpcyA9IDA7IGF4aXMgPCAzOyBheGlzKyspIHtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IDk7IHgrKykge1xuXHRcdFx0dmFyIGJpdHMgPSBheGlzbWlzc2luZyhib2FyZCwgeCwgYXhpcyk7XG5cdFx0XHRuZWVkZWQucHVzaChiaXRzKTtcblxuXHRcdCAgICBmb3IgKHZhciB5ID0gMDsgeSA8IDk7IHkrKykge1xuXHRcdCAgICBcdHZhciBwb3MgPSBwb3Nmb3IoeCwgeSwgYXhpcyk7XG5cdFx0ICAgICAgICBhbGxvd2VkW3Bvc10gPSBhbGxvd2VkW3Bvc10gJiBiaXRzO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7YWxsb3dlZDphbGxvd2VkLCBuZWVkZWQ6bmVlZGVkfTtcbn1cblxuZnVuY3Rpb24gcG9zZm9yKHgsIHksIGF4aXMpIHtcblx0aWYgKGF4aXMgPT0gdW5kZWZpbmVkKSB7IGF4aXMgPSAwOyB9XG5cbiAgICBpZiAoYXhpcyA9PSAwKSB7XG5cdCAgICByZXR1cm4geCAqIDkgKyB5O1xuXHR9XG5cdGVsc2UgaWYgKGF4aXMgPT0gMSkge1xuXHRcdHJldHVybiB5ICogOSArIHg7XG5cdH1cblxuXHRyZXR1cm4gKFswLDMsNiwyNywzMCwzMyw1NCw1Nyw2MF1beF0gKyBbMCwxLDIsOSwxMCwxMSwxOCwxOSwyMF1beV0pXG59XG5cbmZ1bmN0aW9uIGF4aXNmb3IocG9zLCBheGlzKSB7XG5cdGlmIChheGlzID09IDApIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihwb3MgLyA5KTtcblx0fVxuXHRlbHNlIGlmIChheGlzID09IDEpIHtcblx0XHRyZXR1cm4gcG9zICUgOTtcblx0fVxuXG5cdHJldHVybiBNYXRoLmZsb29yKHBvcyAvIDI3KSAqIDMgKyBNYXRoLmZsb29yKHBvcyAvIDMpICUgMztcbn1cblxuZnVuY3Rpb24gYXhpc21pc3NpbmcoYm9hcmQsIHgsIGF4aXMpIHtcblx0dmFyIGJpdHMgPSAwO1xuXG5cdGZvciAodmFyIHkgPSAwOyB5IDwgOTsgeSsrKSB7XG5cdFx0dmFyIGUgPSBib2FyZFtwb3Nmb3IoeCwgeSwgYXhpcyldO1xuXG5cdFx0aWYgKGUgIT0gbnVsbCkge1xuXHRcdFx0Yml0cyB8PSAxIDw8IGU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIDUxMSBeIGJpdHM7XG59XG5cbmZ1bmN0aW9uIGxpc3RiaXRzKGJpdHMpIHtcbiAgICB2YXIgbGlzdCA9IFtdO1xuXHRmb3IgKHZhciB5ID0gMDsgeSA8IDk7IHkrKykge1xuXHRcdGlmICgoYml0cyAmICgxIDw8IHkpKSAhPSAwKSB7XG5cdFx0XHRsaXN0LnB1c2goeSk7XG5cdFx0fVxuXHR9XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmZ1bmN0aW9uIGFsbG93ZWQoYm9hcmQsIHBvcykge1xuXHR2YXIgYml0cyA9IDUxMTtcblxuXHRmb3IgKHZhciBheGlzID0gMDsgYXhpcyA8IDM7IGF4aXMrKykge1xuXHRcdHZhciB4ID0gYXhpc2Zvcihwb3MsIGF4aXMpO1xuXHRcdGJpdHMgPSBiaXRzICYgYXhpc21pc3NpbmcoYm9hcmQsIHgsIGF4aXMpO1xuXHR9XG5cblx0cmV0dXJuIGJpdHM7XG59XG5cbi8vIFRPRE86IG1ha2Ugc3VyZSBjYWxsZXJzIHV0aWxpemUgdGhlIHJldHVybiB2YWx1ZSBjb3JyZWN0bHlcbmZ1bmN0aW9uIHBpY2tiZXR0ZXIoYiwgYywgdCkge1xuXHRpZiAoYiA9PSBudWxsIHx8IHQubGVuZ3RoIDwgYi5sZW5ndGgpIHtcblx0XHRyZXR1cm4ge2d1ZXNzOnQsIGNvdW50OjF9O1xuXHR9XG5cdGVsc2UgaWYgKHQubGVuZ3RoID4gYi5sZW5ndGgpIHtcblx0XHRyZXR1cm4ge2d1ZXNzOmIsIGNvdW50OmN9O1xuXHR9XG5cdGVsc2UgaWYgKHJhbmRvbUludChjKSA9PSAwKSB7XG5cdFx0cmV0dXJuIHtndWVzczp0LCBjb3VudDpjKzF9O1xuXHR9XG5cblx0cmV0dXJuIHtndWVzczpiLCBjb3VudDpjKzF9O1xufVxuXG5mdW5jdGlvbiBib2FyZGZvcmVudHJpZXMoZW50cmllcykge1xuXHR2YXIgYm9hcmQgPSBfLm1hcChfLnJhbmdlKDgxKSwgZnVuY3Rpb24odmFsLCBrZXkpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fSk7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBlbnRyaWVzW2ldO1xuXHRcdHZhciBwb3MgID0gaXRlbS5wb3M7XG5cdFx0dmFyIG51bSAgPSBpdGVtLm51bTtcblxuXHRcdGJvYXJkW3Bvc10gPSBudW07XG5cdH1cblxuXHRyZXR1cm4gYm9hcmQ7XG59XG5cbmZ1bmN0aW9uIGJvYXJkbWF0Y2hlcyhiMSwgYjIpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCA4MTsgaSsrKSB7XG5cdFx0aWYgKGIxW2ldICE9IGIyW2ldKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJhbmRvbUludChtYXgpIHtcblx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXgrMSkpO1xufVxuXG5mdW5jdGlvbiBzaHVmZmxlQXJyYXkob3JpZ2luYWwpIHtcblx0Ly8gU3dhcCBlYWNoIGVsZW1lbnQgd2l0aCBhbm90aGVyIHJhbmRvbWx5IHNlbGVjdGVkIG9uZS5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yaWdpbmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBqID0gaTtcbiAgICAgICAgd2hpbGUgKGogPT0gaSkge1xuICAgICAgICAgICAgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9yaWdpbmFsLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnRlbnRzID0gb3JpZ2luYWxbaV07XG4gICAgICAgIG9yaWdpbmFsW2ldICA9IG9yaWdpbmFsW2pdO1xuICAgICAgICBvcmlnaW5hbFtqXSAgPSBjb250ZW50cztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoYXJyYXksIGZyb20sIHRvKSB7XG4gICAgdmFyIHJlc3QgPSBhcnJheS5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFycmF5Lmxlbmd0aCk7XG4gICAgYXJyYXkubGVuZ3RoID0gZnJvbSA8IDAgPyBhcnJheS5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gYXJyYXkucHVzaC5hcHBseShhcnJheSwgcmVzdCk7XG59O1xuXG5mdW5jdGlvbiBtYWtlQXJyYXkobGVuZ3RoLCB2YWx1ZSkge1xuXHRyZXR1cm4gXy5tYXAoXy5yYW5nZShsZW5ndGgpLCBmdW5jdGlvbih2YWwsIGtleSkge1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG1ha2VwdXp6bGUgIDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbWFrZXB1enpsZShzb2x2ZXB1enpsZShtYWtlQXJyYXkoODEsIG51bGwpKSk7IH0sXG5cdHNvbHZlcHV6emxlIDogc29sdmVwdXp6bGUsXG5cdHJhdGVwdXp6bGUgIDogcmF0ZXB1enpsZSxcblx0cG9zZm9yICAgICAgOiBwb3Nmb3Jcbn07XG5cbiIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuMS42XG4vLyAgICAgKGMpIDIwMTEgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIEluYy5cbi8vICAgICBVbmRlcnNjb3JlIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8vICAgICBQb3J0aW9ucyBvZiBVbmRlcnNjb3JlIGFyZSBpbnNwaXJlZCBvciBib3Jyb3dlZCBmcm9tIFByb3RvdHlwZSxcbi8vICAgICBPbGl2ZXIgU3RlZWxlJ3MgRnVuY3Rpb25hbCwgYW5kIEpvaG4gUmVzaWcncyBNaWNyby1UZW1wbGF0aW5nLlxuLy8gICAgIEZvciBhbGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbi8vICAgICBodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL3VuZGVyc2NvcmVcblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhciBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIHVuc2hpZnQgICAgICAgICAgPSBBcnJheVByb3RvLnVuc2hpZnQsXG4gICAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikgeyByZXR1cm4gbmV3IHdyYXBwZXIob2JqKTsgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKkNvbW1vbkpTKiosIHdpdGggYmFja3dhcmRzLWNvbXBhdGliaWxpdHlcbiAgLy8gZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBub3QgaW4gQ29tbW9uSlMsIGFkZCBgX2AgdG8gdGhlXG4gIC8vIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gXztcbiAgICBfLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjEuNic7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIGltcGxlbWVudGluZyBgZm9yRWFjaGAsIGFycmF5cywgYW5kIHJhdyBvYmplY3RzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZm9yRWFjaGAgaWYgYXZhaWxhYmxlLlxuICB2YXIgZWFjaCA9IF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAoXy5pc051bWJlcihvYmoubGVuZ3RoKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdG9yIHRvIGVhY2ggZWxlbWVudC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYG1hcGAgaWYgYXZhaWxhYmxlLlxuICBfLm1hcCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBtZW1vICE9PSB2b2lkIDA7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlICYmIG9iai5yZWR1Y2UgPT09IG5hdGl2ZVJlZHVjZSkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZShpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlKGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCFpbml0aWFsICYmIGluZGV4ID09PSAwKSB7XG4gICAgICAgIG1lbW8gPSB2YWx1ZTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VSaWdodGAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIG1lbW8gIT09IHZvaWQgMCA/IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IpO1xuICAgIH1cbiAgICB2YXIgcmV2ZXJzZWQgPSAoXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8udG9BcnJheShvYmopKS5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIF8ucmVkdWNlKHJldmVyc2VkLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZmlsdGVyYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVGaWx0ZXIgJiYgb2JqLmZpbHRlciA9PT0gbmF0aXZlRmlsdGVyKSByZXR1cm4gb2JqLmZpbHRlcihpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCFpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBldmVyeWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVFdmVyeSAmJiBvYmouZXZlcnkgPT09IG5hdGl2ZUV2ZXJ5KSByZXR1cm4gb2JqLmV2ZXJ5KGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIShyZXN1bHQgPSByZXN1bHQgJiYgaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHNvbWVgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgdmFyIGFueSA9IF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZVNvbWUgJiYgb2JqLnNvbWUgPT09IG5hdGl2ZVNvbWUpIHJldHVybiBvYmouc29tZShpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYSBnaXZlbiB2YWx1ZSBpcyBpbmNsdWRlZCBpbiB0aGUgYXJyYXkgb3Igb2JqZWN0IHVzaW5nIGA9PT1gLlxuICAvLyBBbGlhc2VkIGFzIGBjb250YWluc2AuXG4gIF8uaW5jbHVkZSA9IF8uY29udGFpbnMgPSBmdW5jdGlvbihvYmosIHRhcmdldCkge1xuICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZvdW5kO1xuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIG9iai5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gb2JqLmluZGV4T2YodGFyZ2V0KSAhPSAtMTtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKGZvdW5kID0gdmFsdWUgPT09IHRhcmdldCkgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAobWV0aG9kLmNhbGwgPyBtZXRob2QgfHwgdmFsdWUgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopKSByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogLUluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPj0gcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopKSByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogSW5maW5pdHl9O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBjb21wdXRlZCA8IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlIDogdmFsdWUsXG4gICAgICAgIGNyaXRlcmlhIDogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYSwgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgYXQgd2hhdCBpbmRleCBhbiBvYmplY3Qgc2hvdWxkXG4gIC8vIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRvcikge1xuICAgIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgICBpdGVyYXRvcihhcnJheVttaWRdKSA8IGl0ZXJhdG9yKG9iaikgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBTYWZlbHkgY29udmVydCBhbnl0aGluZyBpdGVyYWJsZSBpbnRvIGEgcmVhbCwgbGl2ZSBhcnJheS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24oaXRlcmFibGUpIHtcbiAgICBpZiAoIWl0ZXJhYmxlKSAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgaWYgKGl0ZXJhYmxlLnRvQXJyYXkpICAgICAgICAgcmV0dXJuIGl0ZXJhYmxlLnRvQXJyYXkoKTtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZXJhYmxlKSkgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgaWYgKF8uaXNBcmd1bWVudHMoaXRlcmFibGUpKSAgcmV0dXJuIHNsaWNlLmNhbGwoaXRlcmFibGUpO1xuICAgIHJldHVybiBfLnZhbHVlcyhpdGVyYWJsZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy50b0FycmF5KG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmtcbiAgLy8gd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIChuICE9IG51bGwpICYmICFndWFyZCA/IHNsaWNlLmNhbGwoYXJyYXksIDAsIG4pIDogYXJyYXlbMF07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKippbmRleCoqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXMgaW4gdGhlIGFycmF5IGZyb20gdGhhdCBpbmRleCBvbndhcmQuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBmdW5jdGlvbihhcnJheSwgaW5kZXgsIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIChpbmRleCA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBpbmRleCk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICEhdmFsdWU7IH0pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvbXBsZXRlbHkgZmxhdHRlbmVkIHZlcnNpb24gb2YgYW4gYXJyYXkuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlKGFycmF5LCBmdW5jdGlvbihtZW1vLCB2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHJldHVybiBtZW1vLmNvbmNhdChfLmZsYXR0ZW4odmFsdWUpKTtcbiAgICAgIG1lbW9bbWVtby5sZW5ndGhdID0gdmFsdWU7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHZhbHVlcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmluY2x1ZGUodmFsdWVzLCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQpIHtcbiAgICByZXR1cm4gXy5yZWR1Y2UoYXJyYXksIGZ1bmN0aW9uKG1lbW8sIGVsLCBpKSB7XG4gICAgICBpZiAoMCA9PSBpIHx8IChpc1NvcnRlZCA9PT0gdHJ1ZSA/IF8ubGFzdChtZW1vKSAhPSBlbCA6ICFfLmluY2x1ZGUobWVtbywgZWwpKSkgbWVtb1ttZW1vLmxlbmd0aF0gPSBlbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH0sIFtdKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy51bmlxKGFycmF5KSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZXZlcnkocmVzdCwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZihvdGhlciwgaXRlbSkgPj0gMDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJncywgJ2xlbmd0aCcpKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3MsIFwiXCIgKyBpKTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGksIGw7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICAgIGZvciAoaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikgcmV0dXJuIGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0pO1xuICAgIHZhciBpID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPD0gMSkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBhcmd1bWVudHNbMl0gfHwgMTtcblxuICAgIHZhciBsZW4gPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgdmFyIHJhbmdlID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICB3aGlsZShpZHggPCBsZW4pIHtcbiAgICAgIHJhbmdlW2lkeCsrXSA9IHN0YXJ0O1xuICAgICAgc3RhcnQgKz0gc3RlcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIEJpbmRpbmcgd2l0aCBhcmd1bWVudHMgaXMgYWxzbyBrbm93biBhcyBgY3VycnlgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWYgYXZhaWxhYmxlLlxuICAvLyBXZSBjaGVjayBmb3IgYGZ1bmMuYmluZGAgZmlyc3QsIHRvIGZhaWwgZmFzdCB3aGVuIGBmdW5jYCBpcyB1bmRlZmluZWQuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIG9iaikge1xuICAgIGlmIChmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQgJiYgbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShvYmosIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQmluZCBhbGwgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0XG4gIC8vIGFsbCBjYWxsYmFja3MgZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgZnVuY3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgaWYgKGZ1bmNzLmxlbmd0aCA9PSAwKSBmdW5jcyA9IF8uZnVuY3Rpb25zKG9iaik7XG4gICAgZWFjaChmdW5jcywgZnVuY3Rpb24oZikgeyBvYmpbZl0gPSBfLmJpbmQob2JqW2ZdLCBvYmopOyB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vID0ge307XG4gICAgaGFzaGVyIHx8IChoYXNoZXIgPSBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShmdW5jLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB1c2VkIHRvIGltcGxlbWVudCBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAgdmFyIGxpbWl0ID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgZGVib3VuY2UpIHtcbiAgICB2YXIgdGltZW91dDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgdGhyb3R0bGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIGlmIChkZWJvdW5jZSkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgaWYgKGRlYm91bmNlIHx8ICF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dCh0aHJvdHRsZXIsIHdhaXQpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHJldHVybiBsaW1pdChmdW5jLCB3YWl0LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHJldHVybiBsaW1pdChmdW5jLCB3YWl0LCB0cnVlKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciByYW4gPSBmYWxzZSwgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmFuKSByZXR1cm4gbWVtbztcbiAgICAgIHJhbiA9IHRydWU7XG4gICAgICByZXR1cm4gbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IFtmdW5jXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiB3cmFwcGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgZm9yICh2YXIgaT1mdW5jcy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJncyA9IFtmdW5jc1tpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBhZnRlciBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7IHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cbiAgICB9O1xuICB9O1xuXG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gbmF0aXZlS2V5cyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkga2V5c1trZXlzLmxlbmd0aF0gPSBrZXk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy5rZXlzKG9iaiksIGZ1bmN0aW9uKGtleSl7IHJldHVybiBfLmlzRnVuY3Rpb24ob2JqW2tleV0pOyB9KS5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZVtwcm9wXSAhPT0gdm9pZCAwKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBudWxsKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAvLyBDaGVjayBvYmplY3QgaWRlbnRpdHkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiB0cnVlO1xuICAgIC8vIERpZmZlcmVudCB0eXBlcz9cbiAgICB2YXIgYXR5cGUgPSB0eXBlb2YoYSksIGJ0eXBlID0gdHlwZW9mKGIpO1xuICAgIGlmIChhdHlwZSAhPSBidHlwZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEJhc2ljIGVxdWFsaXR5IHRlc3QgKHdhdGNoIG91dCBmb3IgY29lcmNpb25zKS5cbiAgICBpZiAoYSA9PSBiKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBPbmUgaXMgZmFsc3kgYW5kIHRoZSBvdGhlciB0cnV0aHkuXG4gICAgaWYgKCghYSAmJiBiKSB8fCAoYSAmJiAhYikpIHJldHVybiBmYWxzZTtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYS5fY2hhaW4pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiLl9jaGFpbikgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gT25lIG9mIHRoZW0gaW1wbGVtZW50cyBhbiBpc0VxdWFsKCk/XG4gICAgaWYgKGEuaXNFcXVhbCkgcmV0dXJuIGEuaXNFcXVhbChiKTtcbiAgICAvLyBDaGVjayBkYXRlcycgaW50ZWdlciB2YWx1ZXMuXG4gICAgaWYgKF8uaXNEYXRlKGEpICYmIF8uaXNEYXRlKGIpKSByZXR1cm4gYS5nZXRUaW1lKCkgPT09IGIuZ2V0VGltZSgpO1xuICAgIC8vIEJvdGggYXJlIE5hTj9cbiAgICBpZiAoXy5pc05hTihhKSAmJiBfLmlzTmFOKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQ29tcGFyZSByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgIGlmIChfLmlzUmVnRXhwKGEpICYmIF8uaXNSZWdFeHAoYikpXG4gICAgICByZXR1cm4gYS5zb3VyY2UgICAgID09PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgIGEuZ2xvYmFsICAgICA9PT0gYi5nbG9iYWwgJiZcbiAgICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT09IGIuaWdub3JlQ2FzZSAmJlxuICAgICAgICAgICAgIGEubXVsdGlsaW5lICA9PT0gYi5tdWx0aWxpbmU7XG4gICAgLy8gSWYgYSBpcyBub3QgYW4gb2JqZWN0IGJ5IHRoaXMgcG9pbnQsIHdlIGNhbid0IGhhbmRsZSBpdC5cbiAgICBpZiAoYXR5cGUgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQ2hlY2sgZm9yIGRpZmZlcmVudCBhcnJheSBsZW5ndGhzIGJlZm9yZSBjb21wYXJpbmcgY29udGVudHMuXG4gICAgaWYgKGEubGVuZ3RoICYmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gTm90aGluZyBlbHNlIHdvcmtlZCwgZGVlcCBjb21wYXJlIHRoZSBjb250ZW50cy5cbiAgICB2YXIgYUtleXMgPSBfLmtleXMoYSksIGJLZXlzID0gXy5rZXlzKGIpO1xuICAgIC8vIERpZmZlcmVudCBvYmplY3Qgc2l6ZXM/XG4gICAgaWYgKGFLZXlzLmxlbmd0aCAhPSBiS2V5cy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAvLyBSZWN1cnNpdmUgY29tcGFyaXNvbiBvZiBjb250ZW50cy5cbiAgICBmb3IgKHZhciBrZXkgaW4gYSkgaWYgKCEoa2V5IGluIGIpIHx8ICFfLmlzRXF1YWwoYVtrZXldLCBiW2tleV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSBvciBvYmplY3QgZW1wdHk/XG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBhcmd1bWVudHMgb2JqZWN0P1xuICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgJ2NhbGxlZScpKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgZnVuY3Rpb24/XG4gIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jYWxsICYmIG9iai5hcHBseSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIHN0cmluZz9cbiAgXy5pc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBudW1iZXI/XG4gIF8uaXNOdW1iZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqID09PSAwIHx8IChvYmogJiYgb2JqLnRvRXhwb25lbnRpYWwgJiYgb2JqLnRvRml4ZWQpKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IGBOYU5gIGhhcHBlbnMgdG8gYmUgdGhlIG9ubHkgdmFsdWUgaW4gSmF2YVNjcmlwdFxuICAvLyB0aGF0IGRvZXMgbm90IGVxdWFsIGl0c2VsZi5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IG9iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2U7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGRhdGU/XG4gIF8uaXNEYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmouZ2V0VGltZXpvbmVPZmZzZXQgJiYgb2JqLnNldFVUQ0Z1bGxZZWFyKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYSByZWd1bGFyIGV4cHJlc3Npb24/XG4gIF8uaXNSZWdFeHAgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai50ZXN0ICYmIG9iai5leGVjICYmIChvYmouaWdub3JlQ2FzZSB8fCBvYmouaWdub3JlQ2FzZSA9PT0gZmFsc2UpKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24gKG4sIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LCBlbnN1cmluZyB0aGF0XG4gIC8vIHRoZXkncmUgY29ycmVjdGx5IGFkZGVkIHRvIHRoZSBPT1Agd3JhcHBlciBhcyB3ZWxsLlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKXtcbiAgICAgIGFkZFRvV3JhcHBlcihuYW1lLCBfW25hbWVdID0gb2JqW25hbWVdKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9IGlkQ291bnRlcisrO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbihzdHIsIGRhdGEpIHtcbiAgICB2YXIgYyAgPSBfLnRlbXBsYXRlU2V0dGluZ3M7XG4gICAgdmFyIHRtcGwgPSAndmFyIF9fcD1bXSxwcmludD1mdW5jdGlvbigpe19fcC5wdXNoLmFwcGx5KF9fcCxhcmd1bWVudHMpO307JyArXG4gICAgICAnd2l0aChvYmp8fHt9KXtfX3AucHVzaChcXCcnICtcbiAgICAgIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAucmVwbGFjZShjLmludGVycG9sYXRlLCBmdW5jdGlvbihtYXRjaCwgY29kZSkge1xuICAgICAgICAgICByZXR1cm4gXCInLFwiICsgY29kZS5yZXBsYWNlKC9cXFxcJy9nLCBcIidcIikgKyBcIiwnXCI7XG4gICAgICAgICB9KVxuICAgICAgICAgLnJlcGxhY2UoYy5ldmFsdWF0ZSB8fCBudWxsLCBmdW5jdGlvbihtYXRjaCwgY29kZSkge1xuICAgICAgICAgICByZXR1cm4gXCInKTtcIiArIGNvZGUucmVwbGFjZSgvXFxcXCcvZywgXCInXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcclxcblxcdF0vZywgJyAnKSArIFwiX19wLnB1c2goJ1wiO1xuICAgICAgICAgfSlcbiAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JylcbiAgICAgICAgICsgXCInKTt9cmV0dXJuIF9fcC5qb2luKCcnKTtcIjtcbiAgICB2YXIgZnVuYyA9IG5ldyBGdW5jdGlvbignb2JqJywgdG1wbCk7XG4gICAgcmV0dXJuIGRhdGEgPyBmdW5jKGRhdGEpIDogZnVuYztcbiAgfTtcblxuICAvLyBUaGUgT09QIFdyYXBwZXJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cbiAgdmFyIHdyYXBwZXIgPSBmdW5jdGlvbihvYmopIHsgdGhpcy5fd3JhcHBlZCA9IG9iajsgfTtcblxuICAvLyBFeHBvc2UgYHdyYXBwZXIucHJvdG90eXBlYCBhcyBgXy5wcm90b3R5cGVgXG4gIF8ucHJvdG90eXBlID0gd3JhcHBlci5wcm90b3R5cGU7XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24ob2JqLCBjaGFpbikge1xuICAgIHJldHVybiBjaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEEgbWV0aG9kIHRvIGVhc2lseSBhZGQgZnVuY3Rpb25zIHRvIHRoZSBPT1Agd3JhcHBlci5cbiAgdmFyIGFkZFRvV3JhcHBlciA9IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcbiAgICB3cmFwcGVyLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB1bnNoaWZ0LmNhbGwoYXJncywgdGhpcy5fd3JhcHBlZCk7XG4gICAgICByZXR1cm4gcmVzdWx0KGZ1bmMuYXBwbHkoXywgYXJncyksIHRoaXMuX2NoYWluKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICB3cmFwcGVyLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMuX3dyYXBwZWQsIHRoaXMuX2NoYWluKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICB3cmFwcGVyLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdChtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSwgdGhpcy5fY2hhaW4pO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgd3JhcHBlci5wcm90b3R5cGUuY2hhaW4gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIHdyYXBwZXIucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbn0pKCk7XG4iXX0=
