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
    this.switchView("menu");
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
var SudokuGenerator;

SudokuGenerator = (function() {
  SudokuGenerator.difficulty = {
    easy: 0,
    medium: 1,
    hard: 2
  };

  function SudokuGenerator() {}

  SudokuGenerator.prototype.generate = function(difficulty) {
    var grid, i, j, k, l, m;
    grid = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      grid[i] = new Array(9).fill(null);
    }
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        grid[i][j] = 0;
      }
    }
    grid[4][2] = difficulty + 5;
    return grid;
  };

  return SudokuGenerator;

})();

module.exports = SudokuGenerator;


},{}],5:[function(require,module,exports){
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
    done = [false, false, false, false, false, false, false, false, false];
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9Gb250RmFjZU9ic2VydmVyL2ZvbnRmYWNlb2JzZXJ2ZXIuc3RhbmRhbG9uZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLGtCQUFSOztBQUVuQixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBQ1gsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUVQO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsS0FBRCxHQUNFO01BQUEsSUFBQSxFQUFNLElBQUksUUFBSixDQUFhLElBQWIsRUFBbUIsSUFBQyxDQUFBLE1BQXBCLENBQU47TUFDQSxNQUFBLEVBQVEsSUFBSSxVQUFKLENBQWUsSUFBZixFQUFxQixJQUFDLENBQUEsTUFBdEIsQ0FEUjs7SUFFRixJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVo7RUFSVzs7Z0JBVWIsWUFBQSxHQUFjLFNBQUE7QUFDWixRQUFBO0FBQUE7QUFBQSxTQUFBLGVBQUE7O01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLEdBQVksQ0FBQyxDQUFDO01BQ2QsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdB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Q0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO1dBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWCxDQUFpQixDQUFqQixFQUFvQixDQUFwQjtFQUhtQyxDQUFyQztBQWhCSzs7QUFxQlAsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsQ0FBRDtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnRm9udEZhY2VPYnNlcnZlcidcblxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xuU3Vkb2t1VmlldyA9IHJlcXVpcmUgJy4vU3Vkb2t1VmlldydcblxuY2xhc3MgQXBwXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXG4gICAgQGZvbnRzID0ge31cblxuICAgIEB2aWV3cyA9XG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcbiAgICBAc3dpdGNoVmlldyhcIm1lbnVcIilcblxuICBtZWFzdXJlRm9udHM6IC0+XG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcbiAgICByZXR1cm5cblxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cbiAgICBmb250ID1cbiAgICAgIG5hbWU6IG5hbWVcbiAgICAgIHN0eWxlOiBzdHlsZVxuICAgICAgaGVpZ2h0OiAwXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxuICAgIEBtZWFzdXJlRm9udHMoKVxuICAgIHJldHVybiBmb250XG5cbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxuICAgICAgQG1lYXN1cmVGb250cygpXG4gICAgICBAZHJhdygpXG5cbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cbiAgICBAZHJhdygpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcbiAgICBAdmlld3Muc3Vkb2t1Lm5ld0dhbWUoZGlmZmljdWx0eSlcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGRyYXc6IC0+XG4gICAgQHZpZXcuZHJhdygpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXG5cbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHguZmlsbCgpXG5cbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXG4gICAgICBAY3R4LmZpbGwoKVxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxuICAgICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcbiAgQGJlZ2luUGF0aCgpXG4gIEBtb3ZlVG8oeCtyLCB5KVxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxuICBAY2xvc2VQYXRoKClcbiAgcmV0dXJuIHRoaXNcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5jbGFzcyBNZW51Vmlld1xuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XG4gICAgQGJ1dHRvbnMgPVxuICAgICAgbmV3RWFzeTpcbiAgICAgICAgeTogMC4zNVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxuICAgICAgbmV3TWVkaXVtOlxuICAgICAgICB5OiAwLjQ3XG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxuICAgICAgbmV3SGFyZDpcbiAgICAgICAgeTogMC41OVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxuICAgICAgcmVzdW1lOlxuICAgICAgICB5OiAwLjg1XG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXG5cbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjFcbiAgICBidXR0b25YID0gQGNhbnZhcy53aWR0aCAqIDAuMVxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcblxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHJldHVyblxuXG4gIGRyYXc6IC0+XG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXG5cbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDJcblxuICAgIHkxID0gQGNhbnZhcy5oZWlnaHQgKiAwLjFcbiAgICB5MiA9IEBjYW52YXMuaGVpZ2h0ICogMC4yXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4yLCBidXR0b24uYmdDb2xvciwgXCIjNDQ0NDQ0XCIpXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxuXG4gIGNsaWNrOiAoeCwgeSkgLT5cbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxuICAgICAgICBidXR0b24uY2xpY2soKVxuICAgIHJldHVyblxuXG4gIG5ld0Vhc3k6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXG5cbiAgbmV3TWVkaXVtOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXG5cbiAgbmV3SGFyZDogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcblxuICByZXN1bWU6IC0+XG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5jbGFzcyBTdWRva3VHYW1lXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAZ3JpZFtpXVtqXSA9XG4gICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICBlcnJvcjogZmFsc2VcbiAgICAgICAgICBsb2NrZWQ6IGZhbHNlXG4gICAgICAgICAgcGVuY2lsOiBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcblxuICAgIEBzb2x2ZWQgPSBmYWxzZVxuICAgIGlmIG5vdCBAbG9hZCgpXG4gICAgICBAbmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxuICAgIHJldHVyblxuXG4gIHVwZGF0ZUNlbGw6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgeCAhPSBpXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuXG4gICAgICBpZiB5ICE9IGlcbiAgICAgICAgdiA9IEBncmlkW3hdW2ldLnZhbHVlXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICBAZ3JpZFt4XVtpXS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxuICAgICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuICAgIHJldHVyblxuXG4gIHVwZGF0ZUNlbGxzOiAtPlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0uZXJyb3IgPSBmYWxzZVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxuXG4gICAgQHNvbHZlZCA9IHRydWVcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmVycm9yXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcblxuICAgIGlmIEBzb2x2ZWRcbiAgICAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxuXG4gICAgcmV0dXJuIEBzb2x2ZWRcblxuICBwZW5jaWxTdHJpbmc6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIHMgPSBcIlwiXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgY2VsbC5wZW5jaWxbaV1cbiAgICAgICAgcyArPSBTdHJpbmcoaSsxKVxuICAgIHJldHVybiBzXG5cbiAgY2xlYXJQZW5jaWw6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBjZWxsLnBlbmNpbFtpXSA9IGZhbHNlXG4gICAgQHNhdmUoKVxuXG4gIHRvZ2dsZVBlbmNpbDogKHgsIHksIHYpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIGNlbGwucGVuY2lsW3YtMV0gPSAhY2VsbC5wZW5jaWxbdi0xXVxuICAgIEBzYXZlKClcblxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIGNlbGwudmFsdWUgPSB2XG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJuZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBjZWxsLnZhbHVlID0gMFxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcbiAgICAgICAgY2VsbC5sb2NrZWQgPSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxuXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXG4gICAgbmV3R3JpZCA9IGdlbmVyYXRvci5nZW5lcmF0ZShkaWZmaWN1bHR5KVxuICAgICMgY29uc29sZS5sb2cgXCJuZXdHcmlkXCIsIG5ld0dyaWRcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIG5ld0dyaWRbaV1bal0gIT0gMFxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcbiAgICByZXR1cm5cblxuICBsb2FkOiAtPlxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGpzb25TdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVcIilcbiAgICBpZiBqc29uU3RyaW5nID09IG51bGxcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgIyBjb25zb2xlLmxvZyBqc29uU3RyaW5nXG4gICAgZ2FtZURhdGEgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXG4gICAgY29uc29sZS5sb2cgXCJmb3VuZCBnYW1lRGF0YVwiLCBnYW1lRGF0YVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXG4gICAgICAgIGRzdCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGRzdC52YWx1ZSA9IHNyYy52XG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICBkc3QubG9ja2VkID0gaWYgc3JjLmwgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHNhdmU6IC0+XG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBnYW1lRGF0YSA9XG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGdhbWVEYXRhLmdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgZ2FtZURhdGEuZ3JpZFtpXVtqXSA9XG4gICAgICAgICAgdjogY2VsbC52YWx1ZVxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxuICAgICAgICAgIGw6IGlmIGNlbGwubG9ja2VkIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICBwOiBbXVxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGRzdC5wdXNoKGlmIGNlbGwucGVuY2lsW2tdIHRoZW4gMSBlbHNlIDApXG5cbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lXCIsIGpzb25TdHJpbmcpXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxuICAgIHJldHVybiB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxuIiwiY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXG4gIEBkaWZmaWN1bHR5OlxuICAgIGVhc3k6IDBcbiAgICBtZWRpdW06IDFcbiAgICBoYXJkOiAyXG5cbiAgY29uc3RydWN0b3I6IC0+XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgZ3JpZFtpXVtqXSA9IDBcblxuICAgIGdyaWRbNF1bMl0gPSBkaWZmaWN1bHR5ICsgNVxuICAgIHJldHVybiBncmlkXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXG5cbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuU3Vkb2t1R2FtZSA9IHJlcXVpcmUgJy4vU3Vkb2t1R2FtZSdcblxuUEVOX1BPU19YID0gMVxuUEVOX1BPU19ZID0gMTBcblBFTl9DTEVBUl9QT1NfWCA9IDJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXG5cblBFTkNJTF9QT1NfWCA9IDVcblBFTkNJTF9QT1NfWSA9IDEwXG5QRU5DSUxfQ0xFQVJfUE9TX1ggPSA2XG5QRU5DSUxfQ0xFQVJfUE9TX1kgPSAxM1xuXG5NRU5VX1BPU19YID0gNFxuTUVOVV9QT1NfWSA9IDEzXG5cbk1PREVfUE9TX1ggPSA0XG5NT0RFX1BPU19ZID0gOVxuXG5Db2xvciA9XG4gIHZhbHVlOiBcImJsYWNrXCJcbiAgcGVuY2lsOiBcIiMwMDAwZmZcIlxuICBlcnJvcjogXCIjZmYwMDAwXCJcbiAgZG9uZTogXCIjY2NjY2NjXCJcbiAgbmV3R2FtZTogXCIjMDA4ODMzXCJcbiAgYmFja2dyb3VuZFNlbGVjdGVkOiBcIiNlZWVlYWFcIlxuICBiYWNrZ3JvdW5kTG9ja2VkOiBcIiNlZWVlZWVcIlxuICBiYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZDogXCIjZmZmZmVlXCJcbiAgYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkOiBcIiNlZWVlZGRcIlxuICBiYWNrZ3JvdW5kQ29uZmxpY3RlZDogXCIjZmZmZmRkXCJcbiAgYmFja2dyb3VuZEVycm9yOiBcIiNmZmRkZGRcIlxuICBtb2RlU2VsZWN0OiBcIiM3Nzc3NDRcIlxuICBtb2RlUGVuOiBcIiMwMDAwMDBcIlxuICBtb2RlUGVuY2lsOiBcIiMwMDAwZmZcIlxuXG5BY3Rpb25UeXBlID1cbiAgU0VMRUNUOiAwXG4gIFBFTkNJTDogMVxuICBWQUxVRTogMlxuICBORVdHQU1FOiAzXG5cbmNsYXNzIFN1ZG9rdVZpZXdcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSW5pdFxuXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxuXG4gICAgd2lkdGhCYXNlZENlbGxTaXplID0gQGNhbnZhcy53aWR0aCAvIDlcbiAgICBoZWlnaHRCYXNlZENlbGxTaXplID0gQGNhbnZhcy5oZWlnaHQgLyAxNFxuICAgIGNvbnNvbGUubG9nIFwid2lkdGhCYXNlZENlbGxTaXplICN7d2lkdGhCYXNlZENlbGxTaXplfSBoZWlnaHRCYXNlZENlbGxTaXplICN7aGVpZ2h0QmFzZWRDZWxsU2l6ZX1cIlxuICAgIEBjZWxsU2l6ZSA9IE1hdGgubWluKHdpZHRoQmFzZWRDZWxsU2l6ZSwgaGVpZ2h0QmFzZWRDZWxsU2l6ZSlcblxuICAgICMgY2FsYyByZW5kZXIgY29uc3RhbnRzXG4gICAgQGxpbmVXaWR0aFRoaW4gPSAxXG4gICAgQGxpbmVXaWR0aFRoaWNrID0gTWF0aC5tYXgoQGNlbGxTaXplIC8gMjAsIDMpXG5cbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxuICAgIGZvbnRQaXhlbHNNID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjUpXG4gICAgZm9udFBpeGVsc0wgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuOClcblxuICAgICMgaW5pdCBmb250c1xuICAgIEBmb250cyA9XG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgICAgbmV3Z2FtZTogQGFwcC5yZWdpc3RlckZvbnQoXCJuZXdnYW1lXCIsIFwiI3tmb250UGl4ZWxzTX1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICAgIHBlbjogICAgIEBhcHAucmVnaXN0ZXJGb250KFwicGVuXCIsICAgICBcIiN7Zm9udFBpeGVsc0x9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAaW5pdEFjdGlvbnMoKVxuXG4gICAgIyBpbml0IHN0YXRlXG4gICAgQGdhbWUgPSBuZXcgU3Vkb2t1R2FtZSgpXG4gICAgQHBlblZhbHVlID0gMFxuICAgIEBpc1BlbmNpbCA9IGZhbHNlXG4gICAgQGhpZ2hsaWdodFggPSAtMVxuICAgIEBoaWdobGlnaHRZID0gLTFcblxuICAgIEBkcmF3KClcblxuICBpbml0QWN0aW9uczogLT5cbiAgICBAYWN0aW9ucyA9IG5ldyBBcnJheSg5ICogMTUpLmZpbGwobnVsbClcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaW5kZXggPSAoaiAqIDkpICsgaVxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuU0VMRUNULCB4OiBpLCB5OiBqIH1cblxuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaW5kZXggPSAoKFBFTl9QT1NfWSArIGopICogOSkgKyAoUEVOX1BPU19YICsgaSlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlZBTFVFLCB4OiAxICsgKGogKiAzKSArIGksIHk6IDAgfVxuXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB4OiAxICsgKGogKiAzKSArIGksIHk6IDAgfVxuXG4gICAgIyBWYWx1ZSBjbGVhciBidXR0b25cbiAgICBpbmRleCA9IChQRU5fQ0xFQVJfUE9TX1kgKiA5KSArIFBFTl9DTEVBUl9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5WQUxVRSwgeDogMTAsIHk6IDAgfVxuXG4gICAgIyBQZW5jaWwgY2xlYXIgYnV0dG9uXG4gICAgaW5kZXggPSAoUEVOQ0lMX0NMRUFSX1BPU19ZICogOSkgKyBQRU5DSUxfQ0xFQVJfUE9TX1hcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB4OiAxMCwgeTogMCB9XG5cbiAgICAjIE5ldyBHYW1lIGJ1dHRvblxuICAgIGluZGV4ID0gKE1FTlVfUE9TX1kgKiA5KSArIE1FTlVfUE9TX1hcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuTkVXR0FNRSwgeDogMCwgeTogMCB9XG5cbiAgICByZXR1cm5cblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBSZW5kZXJpbmdcblxuICBkcmF3Q2VsbDogKHgsIHksIGJhY2tncm91bmRDb2xvciwgcywgZm9udCwgY29sb3IpIC0+XG4gICAgcHggPSB4ICogQGNlbGxTaXplXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXG4gICAgaWYgYmFja2dyb3VuZENvbG9yICE9IG51bGxcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChzLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIGZvbnQsIGNvbG9yKVxuXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XG4gICAgZm9yIGkgaW4gWzAuLnNpemVdXG4gICAgICBjb2xvciA9IGlmIHNvbHZlZCB0aGVuIFwiZ3JlZW5cIiBlbHNlIFwiYmxhY2tcIlxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cbiAgICAgIGlmICgoc2l6ZSA9PSAxKSB8fCAoaSAlIDMpID09IDApXG4gICAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGlja1xuXG4gICAgICAjIEhvcml6b250YWwgbGluZXNcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBzaXplKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgY29sb3IsIGxpbmVXaWR0aClcblxuICAgICAgIyBWZXJ0aWNhbCBsaW5lc1xuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIHNpemUpLCBjb2xvciwgbGluZVdpZHRoKVxuXG4gICAgcmV0dXJuXG5cbiAgZHJhdzogLT5cbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXG5cbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiYmxhY2tcIilcblxuICAgICMgTWFrZSB3aGl0ZSBwaG9uZS1zaGFwZWQgYmFja2dyb3VuZFxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNlbGxTaXplICogOSwgQGNhbnZhcy5oZWlnaHQsIFwid2hpdGVcIilcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgY2VsbCA9IEBnYW1lLmdyaWRbaV1bal1cblxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgICAgIGZvbnQgPSBAZm9udHMucGVuXG4gICAgICAgIHRleHRDb2xvciA9IENvbG9yLnZhbHVlXG4gICAgICAgIHRleHQgPSBcIlwiXG4gICAgICAgIGlmIGNlbGwudmFsdWUgPT0gMFxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuY2lsXG4gICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IucGVuY2lsXG4gICAgICAgICAgdGV4dCA9IEBnYW1lLnBlbmNpbFN0cmluZyhpLCBqKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgY2VsbC52YWx1ZSA+IDBcbiAgICAgICAgICAgIHRleHQgPSBTdHJpbmcoY2VsbC52YWx1ZSlcblxuICAgICAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRcblxuICAgICAgICBpZiAoQGhpZ2hsaWdodFggIT0gLTEpICYmIChAaGlnaGxpZ2h0WSAhPSAtMSlcbiAgICAgICAgICBpZiAoaSA9PSBAaGlnaGxpZ2h0WCkgJiYgKGogPT0gQGhpZ2hsaWdodFkpXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG4gICAgICAgICAgZWxzZSBpZiBAY29uZmxpY3RzKGksIGosIEBoaWdobGlnaHRYLCBAaGlnaGxpZ2h0WSlcbiAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRDb25mbGljdGVkXG5cbiAgICAgICAgaWYgY2VsbC5lcnJvclxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLmVycm9yXG5cbiAgICAgICAgQGRyYXdDZWxsKGksIGosIGJhY2tncm91bmRDb2xvciwgdGV4dCwgZm9udCwgdGV4dENvbG9yKVxuXG4gICAgZG9uZSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXVxuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgY3VycmVudFZhbHVlID0gKGogKiAzKSArIGkgKyAxXG4gICAgICAgIGN1cnJlbnRWYWx1ZVN0cmluZyA9IFN0cmluZyhjdXJyZW50VmFsdWUpXG4gICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci52YWx1ZVxuICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLnBlbmNpbFxuICAgICAgICBpZiBkb25lWyhqICogMykgKyBpXVxuICAgICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci5kb25lXG4gICAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5kb25lXG5cbiAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICAgICAgaWYgQHBlblZhbHVlID09IGN1cnJlbnRWYWx1ZVxuICAgICAgICAgIGlmIEBpc1BlbmNpbFxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcblxuICAgICAgICBAZHJhd0NlbGwoUEVOX1BPU19YICsgaSwgUEVOX1BPU19ZICsgaiwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgdmFsdWVDb2xvcilcbiAgICAgICAgQGRyYXdDZWxsKFBFTkNJTF9QT1NfWCArIGksIFBFTkNJTF9QT1NfWSArIGosIHBlbmNpbEJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCBwZW5jaWxDb2xvcilcblxuICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICBpZiBAcGVuVmFsdWUgPT0gMTBcbiAgICAgICAgaWYgQGlzUGVuY2lsXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcblxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcbiAgICBAZHJhd0NlbGwoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIHBlbmNpbEJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxuXG4gICAgaWYgQHBlblZhbHVlID09IDBcbiAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVTZWxlY3RcbiAgICAgIG1vZGVUZXh0ID0gXCJIaWdobGlnaHRpbmdcIlxuICAgIGVsc2VcbiAgICAgIG1vZGVDb2xvciA9IGlmIEBpc1BlbmNpbCB0aGVuIENvbG9yLm1vZGVQZW5jaWwgZWxzZSBDb2xvci5tb2RlUGVuXG4gICAgICBtb2RlVGV4dCA9IGlmIEBpc1BlbmNpbCB0aGVuIFwiUGVuY2lsXCIgZWxzZSBcIlBlblwiXG4gICAgQGRyYXdDZWxsKE1PREVfUE9TX1gsIE1PREVfUE9TX1ksIG51bGwsIG1vZGVUZXh0LCBAZm9udHMubmV3Z2FtZSwgbW9kZUNvbG9yKVxuXG4gICAgQGRyYXdDZWxsKE1FTlVfUE9TX1gsIE1FTlVfUE9TX1ksIG51bGwsIFwiTWVudVwiLCBAZm9udHMubmV3Z2FtZSwgQ29sb3IubmV3R2FtZSlcblxuICAgICMgTWFrZSB0aGUgZ3JpZHNcbiAgICBAZHJhd0dyaWQoMCwgMCwgOSwgQGdhbWUuc29sdmVkKVxuICAgIEBkcmF3R3JpZChQRU5fUE9TX1gsIFBFTl9QT1NfWSwgMylcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX1BPU19YLCBQRU5DSUxfUE9TX1ksIDMpXG4gICAgQGRyYXdHcmlkKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCAxKVxuICAgIEBkcmF3R3JpZChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgMSlcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBJbnB1dFxuXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGNvbnNvbGUubG9nIFwiU3Vkb2t1Vmlldy5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcbiAgICBAZ2FtZS5uZXdHYW1lKGRpZmZpY3VsdHkpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxuICAgIHkgPSBNYXRoLmZsb29yKHkgLyBAY2VsbFNpemUpXG5cbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXG4gICAgICAgIGluZGV4ID0gKHkgKiA5KSArIHhcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJBY3Rpb246IFwiLCBhY3Rpb25cbiAgICAgICAgICBzd2l0Y2ggYWN0aW9uLnR5cGVcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1RcbiAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IDBcbiAgICAgICAgICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WCA9IGFjdGlvbi54XG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnRvZ2dsZVBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCAwKVxuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcblxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTFxuICAgICAgICAgICAgICBAaXNQZW5jaWwgPSB0cnVlXG4gICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBhY3Rpb24ueFxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IDBcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XG5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5WQUxVRVxuICAgICAgICAgICAgICBAaXNQZW5jaWwgPSBmYWxzZVxuICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gYWN0aW9uLnhcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24ueFxuXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuTkVXR0FNRVxuICAgICAgICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBlbHNlXG4gICAgICAgICAgIyBubyBhY3Rpb25cbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgICAgICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgICAgICAgIEBwZW5WYWx1ZSA9IDBcbiAgICAgICAgICBAaXNQZW5jaWwgPSBmYWxzZVxuXG4gICAgICAgIEBkcmF3KClcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBIZWxwZXJzXG5cbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XG4gICAgIyBzYW1lIHJvdyBvciBjb2x1bW4/XG4gICAgaWYgKHgxID09IHgyKSB8fCAoeTEgPT0geTIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyBzYW1lIHNlY3Rpb24/XG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xuICAgIHN5MSA9IE1hdGguZmxvb3IoeTEgLyAzKSAqIDNcbiAgICBzeDIgPSBNYXRoLmZsb29yKHgyIC8gMykgKiAzXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xuICAgIGlmIChzeDEgPT0gc3gyKSAmJiAoc3kxID09IHN5MilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VWaWV3XG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcblxuaW5pdCA9IC0+XG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcbiAgY2FudmFzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxuICBjYW52YXNSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxuXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxuICAjICAgY29uc29sZS5sb2cgT2JqZWN0LmtleXMoZS50b3VjaGVzWzBdKVxuICAjICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAjICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XG4gICAgaW5pdCgpXG4sIGZhbHNlKVxuIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
