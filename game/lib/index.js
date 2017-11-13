(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, FontFaceObserver, MenuView, SudokuView, version;

FontFaceObserver = require('FontFaceObserver');

MenuView = require('./MenuView');

SudokuView = require('./SudokuView');

version = require('./version');

App = (function() {
  function App(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.loadFont("saxMono");
    this.fonts = {};
    this.versionFontHeight = Math.floor(this.canvas.height * 0.02);
    this.versionFont = this.registerFont("version", this.versionFontHeight + "px saxMono, monospace");
    this.generatingFontHeight = Math.floor(this.canvas.height * 0.04);
    this.generatingFont = this.registerFont("generating", this.generatingFontHeight + "px saxMono, monospace");
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

  App.prototype.reset = function() {
    this.views.sudoku.reset();
    return this.switchView("sudoku");
  };

  App.prototype["import"] = function(importString) {
    return this.views.sudoku["import"](importString);
  };

  App.prototype["export"] = function() {
    return this.views.sudoku["export"]();
  };

  App.prototype.holeCount = function() {
    return this.views.sudoku.holeCount();
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

  App.prototype.drawLowerLeft = function(text, color) {
    if (color == null) {
      color = "white";
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "left";
    return this.ctx.fillText(text, 0, this.canvas.height - (this.versionFont.height / 2));
  };

  App.prototype.drawVersion = function(color) {
    if (color == null) {
      color = "white";
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "right";
    return this.ctx.fillText("v" + version, this.canvas.width - (this.versionFont.height / 2), this.canvas.height - (this.versionFont.height / 2));
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


},{"./MenuView":2,"./SudokuView":5,"./version":7,"FontFaceObserver":8}],2:[function(require,module,exports){
var BUTTON_HEIGHT, BUTTON_SEPARATOR, BUTTON_SPACING, FIRST_BUTTON_Y, MenuView, SudokuGenerator, buttonPos;

SudokuGenerator = require('./SudokuGenerator');

BUTTON_HEIGHT = 0.06;

FIRST_BUTTON_Y = 0.22;

BUTTON_SPACING = 0.08;

BUTTON_SEPARATOR = 0.03;

buttonPos = function(index) {
  var y;
  y = FIRST_BUTTON_Y + (BUTTON_SPACING * index);
  if (index > 3) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 4) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 6) {
    y += BUTTON_SEPARATOR;
  }
  return y;
};

MenuView = (function() {
  function MenuView(app, canvas) {
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, titleFontHeight;
    this.app = app;
    this.canvas = canvas;
    this.buttons = {
      newEasy: {
        y: buttonPos(0),
        text: "New Game: Easy",
        bgColor: "#337733",
        textColor: "#ffffff",
        click: this.newEasy.bind(this)
      },
      newMedium: {
        y: buttonPos(1),
        text: "New Game: Medium",
        bgColor: "#777733",
        textColor: "#ffffff",
        click: this.newMedium.bind(this)
      },
      newHard: {
        y: buttonPos(2),
        text: "New Game: Hard",
        bgColor: "#773333",
        textColor: "#ffffff",
        click: this.newHard.bind(this)
      },
      newExtreme: {
        y: buttonPos(3),
        text: "New Game: Extreme",
        bgColor: "#771111",
        textColor: "#ffffff",
        click: this.newExtreme.bind(this)
      },
      reset: {
        y: buttonPos(4),
        text: "Reset Puzzle",
        bgColor: "#773377",
        textColor: "#ffffff",
        click: this.reset.bind(this)
      },
      "import": {
        y: buttonPos(5),
        text: "Load Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this["import"].bind(this)
      },
      "export": {
        y: buttonPos(6),
        text: "Share Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this["export"].bind(this)
      },
      resume: {
        y: buttonPos(7),
        text: "Resume",
        bgColor: "#777777",
        textColor: "#ffffff",
        click: this.resume.bind(this)
      }
    };
    buttonWidth = this.canvas.width * 0.8;
    this.buttonHeight = this.canvas.height * BUTTON_HEIGHT;
    buttonX = (this.canvas.width - buttonWidth) / 2;
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
    var button, buttonName, ref, shadowOffset, x, y1, y2;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#333333");
    x = this.canvas.width / 2;
    shadowOffset = this.canvas.height * 0.01;
    y1 = this.canvas.height * 0.05;
    y2 = this.canvas.height * 0.15;
    this.app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Bad Guy", x, y1, this.titleFont, "#ffffff");
    this.app.drawTextCentered("Sudoku", x, y2, this.titleFont, "#ffffff");
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      this.app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black");
      this.app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999");
      this.app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), this.buttonFont, button.textColor);
    }
    this.app.drawLowerLeft((this.app.holeCount()) + "/81");
    return this.app.drawVersion();
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

  MenuView.prototype.newExtreme = function() {
    return this.app.newGame(SudokuGenerator.difficulty.extreme);
  };

  MenuView.prototype.reset = function() {
    return this.app.reset();
  };

  MenuView.prototype.resume = function() {
    return this.app.switchView("sudoku");
  };

  MenuView.prototype["export"] = function() {
    if (navigator.share !== void 0) {
      navigator.share({
        title: "Sudoku Shared Game",
        text: this.app["export"]()
      });
      return;
    }
    return window.prompt("Copy this and paste to a friend:", this.app["export"]());
  };

  MenuView.prototype["import"] = function() {
    var importString;
    importString = window.prompt("Paste an exported game here:", "");
    if (importString === null) {
      return;
    }
    if (this.app["import"](importString)) {
      return this.app.switchView("sudoku");
    }
  };

  return MenuView;

})();

module.exports = MenuView;


},{"./SudokuGenerator":4}],3:[function(require,module,exports){
var SudokuGame, SudokuGenerator;

SudokuGenerator = require('./SudokuGenerator');

SudokuGame = (function() {
  function SudokuGame() {
    this.clear();
    if (!this.load()) {
      this.newGame(SudokuGenerator.difficulty.easy);
    }
    return;
  }

  SudokuGame.prototype.clear = function() {
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
    return this.solved = false;
  };

  SudokuGame.prototype.holeCount = function() {
    var count, i, j, l, m;
    count = 0;
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (!this.grid[i][j].locked) {
          count += 1;
        }
      }
    }
    return count;
  };

  SudokuGame.prototype["export"] = function() {
    var exportString, i, j, l, m;
    exportString = "SD";
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (this.grid[i][j].locked) {
          exportString += "" + this.grid[i][j].value;
        } else {
          exportString += "0";
        }
      }
    }
    return exportString;
  };

  SudokuGame.prototype["import"] = function(importString) {
    var i, index, j, l, m, v, zeroCharCode;
    if (importString.indexOf("SD") !== 0) {
      return false;
    }
    importString = importString.substr(2);
    importString = importString.replace(/[^0-9]/g, "");
    if (importString.length !== 81) {
      return false;
    }
    this.clear();
    index = 0;
    zeroCharCode = "0".charCodeAt(0);
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        v = importString.charCodeAt(index) - zeroCharCode;
        index += 1;
        if (v > 0) {
          this.grid[i][j].locked = true;
          this.grid[i][j].value = v;
        }
      }
    }
    this.updateCells();
    this.save();
    return true;
  };

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

  SudokuGame.prototype.reset = function() {
    var cell, i, j, k, l, m, n;
    console.log("reset()");
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        cell = this.grid[i][j];
        if (!cell.locked) {
          cell.value = 0;
        }
        cell.error = false;
        for (k = n = 0; n < 9; k = ++n) {
          cell.pencil[k] = false;
        }
      }
    }
    this.highlightX = -1;
    this.highlightY = -1;
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

  SudokuView.prototype.reset = function() {
    return this.game.reset();
  };

  SudokuView.prototype["import"] = function(importString) {
    return this.game["import"](importString);
  };

  SudokuView.prototype["export"] = function() {
    return this.game["export"]();
  };

  SudokuView.prototype.holeCount = function() {
    return this.game.holeCount();
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
            if (this.isPencil && (this.penValue === action.x)) {
              this.penValue = 0;
            } else {
              this.isPencil = true;
              this.penValue = action.x;
            }
            break;
          case ActionType.VALUE:
            if (!this.isPencil && (this.penValue === action.x)) {
              this.penValue = 0;
            } else {
              this.isPencil = false;
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
module.exports = "0.0.8";


},{}],8:[function(require,module,exports){
/* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function r(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function t(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function y(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;y(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);y(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,E=null,F=null;function G(){if(null===C)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);C=!!a&&603>parseInt(a[1],10)}else C=!1;return C}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvRm9udEZhY2VPYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdB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UUFBdkI7RUFDVCxNQUFNLENBQUMsS0FBUCxHQUFlLFFBQVEsQ0FBQyxlQUFlLENBQUM7RUFDeEMsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsUUFBUSxDQUFDLGVBQWUsQ0FBQztFQUN6QyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQWQsQ0FBMkIsTUFBM0IsRUFBbUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFXLENBQUEsQ0FBQSxDQUE1RDtFQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMscUJBQVAsQ0FBQTtFQUViLE1BQU0sQ0FBQyxHQUFQLEdBQWEsSUFBSSxHQUFKLENBQVEsTUFBUjtTQVFiLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxTQUFDLENBQUQ7QUFDbkMsUUFBQTtJQUFBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7V0FDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQXBCO0VBSG1DLENBQXJDO0FBaEJLOztBQXFCUCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBQyxDQUFEO1NBQzVCLElBQUEsQ0FBQTtBQUQ0QixDQUFoQyxFQUVFLEtBRkY7Ozs7QUN2QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdGb250RmFjZU9ic2VydmVyJ1xyXG5cclxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xyXG5TdWRva3VWaWV3ID0gcmVxdWlyZSAnLi9TdWRva3VWaWV3J1xyXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xyXG5cclxuY2xhc3MgQXBwXHJcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXHJcbiAgICBAZm9udHMgPSB7fVxyXG5cclxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcclxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQHZpZXdzID1cclxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIG1lYXN1cmVGb250czogLT5cclxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcclxuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxyXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxyXG4gICAgZm9udCA9XHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgc3R5bGU6IHN0eWxlXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxyXG4gICAgQG1lYXN1cmVGb250cygpXHJcbiAgICByZXR1cm4gZm9udFxyXG5cclxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxyXG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxyXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxyXG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXHJcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxyXG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cclxuICAgIEBkcmF3KClcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG5cclxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcclxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cclxuICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuICAgICMgLCAwXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5yZXNldCgpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXHJcblxyXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cclxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXHJcbiAgICBpZiBmaWxsQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgICBAY3R4LmZpbGwoKVxyXG4gICAgaWYgc3Ryb2tlQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgICAgQGN0eC5zdHJva2UoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0xpbmU6ICh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBcImJsYWNrXCIsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIGN4LCBjeSArIChmb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcclxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cclxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxyXG4gIGlmIChoIDwgMiAqIHIpIHRoZW4gciA9IGggLyAyXHJcbiAgQGJlZ2luUGF0aCgpXHJcbiAgQG1vdmVUbyh4K3IsIHkpXHJcbiAgQGFyY1RvKHgrdywgeSwgICB4K3csIHkraCwgcilcclxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxyXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXHJcbiAgQGFyY1RvKHgsICAgeSwgICB4K3csIHksICAgcilcclxuICBAY2xvc2VQYXRoKClcclxuICByZXR1cm4gdGhpc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG5CVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIE1lbnVWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBuZXdFYXN5OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEVhc3lcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RWFzeS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld01lZGl1bTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBNZWRpdW1cIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3TWVkaXVtLmJpbmQodGhpcylcclxuICAgICAgbmV3SGFyZDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMilcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzMzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxyXG4gICAgICBuZXdFeHRyZW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEV4dHJlbWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MTExMVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RXh0cmVtZS5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc2V0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzNzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0LmJpbmQodGhpcylcclxuICAgICAgaW1wb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxyXG4gICAgICAgIHRleHQ6IFwiTG9hZCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAaW1wb3J0LmJpbmQodGhpcylcclxuICAgICAgZXhwb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxyXG4gICAgICAgIHRleHQ6IFwiU2hhcmUgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGV4cG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc3VtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNylcclxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAxXHJcblxyXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcclxuICAgIHkyID0gQGNhbnZhcy5oZWlnaHQgKiAwLjE1XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkxICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4LCB5MiwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCArIHNoYWRvd09mZnNldCwgYnV0dG9uLnkgKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIFwiYmxhY2tcIiwgXCJibGFja1wiKVxyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcclxuXHJcbiAgICBAYXBwLmRyYXdMb3dlckxlZnQoXCIje0BhcHAuaG9sZUNvdW50KCl9LzgxXCIpXHJcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcclxuXHJcbiAgY2xpY2s6ICh4LCB5KSAtPlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXHJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcclxuICAgIHJldHVyblxyXG5cclxuICBuZXdFYXN5OiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcblxyXG4gIG5ld01lZGl1bTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXHJcblxyXG4gIG5ld0hhcmQ6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcclxuXHJcbiAgbmV3RXh0cmVtZTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lKVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEBhcHAucmVzZXQoKVxyXG5cclxuICByZXN1bWU6IC0+XHJcbiAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgaWYgbmF2aWdhdG9yLnNoYXJlICE9IHVuZGVmaW5lZFxyXG4gICAgICBuYXZpZ2F0b3Iuc2hhcmUge1xyXG4gICAgICAgIHRpdGxlOiBcIlN1ZG9rdSBTaGFyZWQgR2FtZVwiXHJcbiAgICAgICAgdGV4dDogQGFwcC5leHBvcnQoKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVyblxyXG4gICAgd2luZG93LnByb21wdChcIkNvcHkgdGhpcyBhbmQgcGFzdGUgdG8gYSBmcmllbmQ6XCIsIEBhcHAuZXhwb3J0KCkpXHJcblxyXG4gIGltcG9ydDogLT5cclxuICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJQYXN0ZSBhbiBleHBvcnRlZCBnYW1lIGhlcmU6XCIsIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcgPT0gbnVsbFxyXG4gICAgICByZXR1cm5cclxuICAgIGlmIEBhcHAuaW1wb3J0KGltcG9ydFN0cmluZylcclxuICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3XHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuY2xhc3MgU3Vkb2t1R2FtZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGNsZWFyKClcclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBuZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgY2xlYXI6IC0+XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdID1cclxuICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICBlcnJvcjogZmFsc2VcclxuICAgICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcblxyXG4gICAgQHNvbHZlZCA9IGZhbHNlXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIGNvdW50ID0gMFxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgbm90IEBncmlkW2ldW2pdLmxvY2tlZFxyXG4gICAgICAgICAgY291bnQgKz0gMVxyXG4gICAgcmV0dXJuIGNvdW50XHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIGV4cG9ydFN0cmluZyA9IFwiU0RcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0ubG9ja2VkXHJcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIje0BncmlkW2ldW2pdLnZhbHVlfVwiXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiMFwiXHJcbiAgICByZXR1cm4gZXhwb3J0U3RyaW5nXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgQGNsZWFyKClcclxuXHJcbiAgICBpbmRleCA9IDBcclxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcclxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gdlxyXG5cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICB1cGRhdGVDZWxsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgeCAhPSBpXHJcbiAgICAgICAgdiA9IEBncmlkW2ldW3ldLnZhbHVlXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxyXG4gICAgICAgICAgICBAZ3JpZFtpXVt5XS5lcnJvciA9IHRydWVcclxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuXHJcbiAgICAgIGlmIHkgIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFt4XVtpXS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbeF1baV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICB2ID0gQGdyaWRbc3ggKyBpXVtzeSArIGpdLnZhbHVlXHJcbiAgICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgICBAZ3JpZFtzeCArIGldW3N5ICsgal0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuICAgIHJldHVyblxyXG5cclxuICB1cGRhdGVDZWxsczogLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdLmVycm9yID0gZmFsc2VcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxyXG5cclxuICAgIEBzb2x2ZWQgPSB0cnVlXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5lcnJvclxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgPT0gMFxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcblxyXG4gICAgIyBpZiBAc29sdmVkXHJcbiAgICAjICAgY29uc29sZS5sb2cgXCJzb2x2ZWQgI3tAc29sdmVkfVwiXHJcblxyXG4gICAgcmV0dXJuIEBzb2x2ZWRcclxuXHJcbiAgZG9uZTogLT5cclxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGNvdW50cyA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSAhPSAwXHJcbiAgICAgICAgICBjb3VudHNbQGdyaWRbaV1bal0udmFsdWUtMV0gKz0gMVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY291bnRzW2ldID09IDlcclxuICAgICAgICBkW2ldID0gdHJ1ZVxyXG4gICAgcmV0dXJuIGRcclxuXHJcbiAgcGVuY2lsU3RyaW5nOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgcyA9IFwiXCJcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY2VsbC5wZW5jaWxbaV1cclxuICAgICAgICBzICs9IFN0cmluZyhpKzEpXHJcbiAgICByZXR1cm4gc1xyXG5cclxuICBjbGVhclBlbmNpbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBjZWxsLnBlbmNpbFtpXSA9IGZhbHNlXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIHRvZ2dsZVBlbmNpbDogKHgsIHksIHYpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgY2VsbC5wZW5jaWxbdi0xXSA9ICFjZWxsLnBlbmNpbFt2LTFdXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIHNldFZhbHVlOiAoeCwgeSwgdikgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBjZWxsLnZhbHVlID0gdlxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcInJlc2V0KClcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgaWYgbm90IGNlbGwubG9ja2VkXHJcbiAgICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJuZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGNlbGwudmFsdWUgPSAwXHJcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXHJcbiAgICAgICAgY2VsbC5sb2NrZWQgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuXHJcbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yKClcclxuICAgIG5ld0dyaWQgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoZGlmZmljdWx0eSlcclxuICAgICMgY29uc29sZS5sb2cgXCJuZXdHcmlkXCIsIG5ld0dyaWRcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5ld0dyaWRbaV1bal0gIT0gMFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSBuZXdHcmlkW2ldW2pdXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBsb2FkOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVwiKVxyXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xyXG4gICAgZ2FtZURhdGEgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0ID0gQGdyaWRbaV1bal1cclxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxyXG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG4gICAgICAgIGRzdC5sb2NrZWQgPSBpZiBzcmMubCA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcblxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZ2FtZURhdGEgPVxyXG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBnYW1lRGF0YS5ncmlkW2ldW2pdID1cclxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcclxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgbDogaWYgY2VsbC5sb2NrZWQgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgcDogW11cclxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxyXG5cclxuICAgIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShnYW1lRGF0YSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxyXG4iLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG4gICAgaWYgb3RoZXJCb2FyZCAhPSBudWxsXHJcbiAgICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXSA9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGxvY2tlZFtpXVtqXSA9IG90aGVyQm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxyXG4gIEBkaWZmaWN1bHR5OlxyXG4gICAgZWFzeTogMVxyXG4gICAgbWVkaXVtOiAyXHJcbiAgICBoYXJkOiAzXHJcbiAgICBleHRyZW1lOiA0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxyXG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cclxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgcmV0dXJuIG5ld0JvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoeSAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbeF1baV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHBlbmNpbE1hcmtzOiAoYm9hcmQsIHgsIHkpIC0+XHJcbiAgICBtYXJrcyA9IFtdXHJcbiAgICBmb3IgdiBpbiBbMS4uOV1cclxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcclxuICAgICAgICBtYXJrcy5wdXNoIHZcclxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcclxuICAgICAgc2h1ZmZsZShtYXJrcylcclxuICAgIHJldHVybiBtYXJrc1xyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgcGVuY2lsID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgcGVuY2lsW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgICMgZGVidWdnZXI7XHJcblxyXG4gICAgd2Fsa0luZGV4ID0gMFxyXG4gICAgZGlyZWN0aW9uID0gMVxyXG4gICAgd2hpbGUgd2Fsa0luZGV4IDwgODFcclxuICAgICAgeCA9IHdhbGtJbmRleCAlIDlcclxuICAgICAgeSA9IE1hdGguZmxvb3Iod2Fsa0luZGV4IC8gOSlcclxuXHJcbiAgICAgIGlmIG5vdCBzb2x2ZWQubG9ja2VkW3hdW3ldXHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAxKSBhbmQgKChwZW5jaWxbeF1beV0gPT0gbnVsbCkgb3IgKHBlbmNpbFt4XVt5XS5sZW5ndGggPT0gMCkpXHJcbiAgICAgICAgICBwZW5jaWxbeF1beV0gPSBAcGVuY2lsTWFya3Moc29sdmVkLCB4LCB5KVxyXG5cclxuICAgICAgICBpZiBwZW5jaWxbeF1beV0ubGVuZ3RoID09IDBcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gMFxyXG4gICAgICAgICAgZGlyZWN0aW9uID0gLTFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IHBlbmNpbFt4XVt5XS5wb3AoKVxyXG4gICAgICAgICAgZGlyZWN0aW9uID0gMVxyXG5cclxuICAgICAgd2Fsa0luZGV4ICs9IGRpcmVjdGlvblxyXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICByZXR1cm4gc29sdmVkXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBmaXJzdFNvbHZlID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgZm9yIHVuaWNpdHlUZXN0cyBpbiBbMC4uLjZdXHJcbiAgICAgIG5leHRTb2x2ZSA9IEBzb2x2ZShib2FyZClcclxuICAgICAgaWYgbm90IGZpcnN0U29sdmUubWF0Y2hlcyhuZXh0U29sdmUpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBnZW5lcmF0ZUludGVybmFsOiAoYW1vdW50VG9SZW1vdmUpIC0+XHJcbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcclxuICAgICMgaGFja1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmQubG9ja2VkW2ldW2pdID0gdHJ1ZVxyXG5cclxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXHJcbiAgICByZW1vdmVkID0gMFxyXG4gICAgd2hpbGUgcmVtb3ZlZCA8IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxyXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxyXG4gICAgICByeSA9IE1hdGguZmxvb3IocmVtb3ZlSW5kZXggLyA5KVxyXG5cclxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgICBuZXh0Qm9hcmQuZ3JpZFtyeF1bcnldID0gMFxyXG4gICAgICBuZXh0Qm9hcmQubG9ja2VkW3J4XVtyeV0gPSBmYWxzZVxyXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxyXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXHJcbiAgICAgICAgcmVtb3ZlZCArPSAxXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJmYWlsZWQgdG8gcmVtb3ZlICN7cnh9LCN7cnl9LCBjcmVhdGVzIG5vbi11bmlxdWUgc29sdXRpb25cIlxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBib2FyZFxyXG4gICAgICByZW1vdmVkOiByZW1vdmVkXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxyXG5cclxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmQoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgYm9hcmQubG9ja2VkW2pdW2ldID0gdHJ1ZVxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFtqXVtpXSA9IHZcclxuXHJcbiAgICBzb2x2ZWQgPSBAc29sdmUoYm9hcmQpXHJcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZm9yIHggaW4gWzAuLi41MF0gIyA1MCBpcyBleGNlc3NpdmVcclxuICAgICAgYW5vdGhlclNvbHZlID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgICBpZiBub3QgYW5vdGhlclNvbHZlLm1hdGNoZXMoc29sdmVkKVxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IEJvYXJkIHNvbHZlIG5vdCB1bmlxdWUuXCJcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBhbnN3ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBhbnN3ZXJTdHJpbmcgKz0gXCIje3NvbHZlZC5ncmlkW2pdW2ldfSBcIlxyXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxyXG5cclxuICAgIHJldHVybiBhbnN3ZXJTdHJpbmdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xyXG5cclxuUEVOX1BPU19YID0gMVxyXG5QRU5fUE9TX1kgPSAxMFxyXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXHJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXHJcblxyXG5QRU5DSUxfUE9TX1ggPSA1XHJcblBFTkNJTF9QT1NfWSA9IDEwXHJcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcclxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcbk1FTlVfUE9TX1ggPSA0XHJcbk1FTlVfUE9TX1kgPSAxM1xyXG5cclxuTU9ERV9QT1NfWCA9IDRcclxuTU9ERV9QT1NfWSA9IDlcclxuXHJcbkNvbG9yID1cclxuICB2YWx1ZTogXCJibGFja1wiXHJcbiAgcGVuY2lsOiBcIiMwMDAwZmZcIlxyXG4gIGVycm9yOiBcIiNmZjAwMDBcIlxyXG4gIGRvbmU6IFwiI2NjY2NjY1wiXHJcbiAgbmV3R2FtZTogXCIjMDA4ODMzXCJcclxuICBiYWNrZ3JvdW5kU2VsZWN0ZWQ6IFwiI2VlZWVhYVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZDogXCIjZWVlZWVlXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZDogXCIjZmZmZmVlXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWQ6IFwiI2VlZWVkZFwiXHJcbiAgYmFja2dyb3VuZENvbmZsaWN0ZWQ6IFwiI2ZmZmZkZFwiXHJcbiAgYmFja2dyb3VuZEVycm9yOiBcIiNmZmRkZGRcIlxyXG4gIG1vZGVTZWxlY3Q6IFwiIzc3Nzc0NFwiXHJcbiAgbW9kZVBlbjogXCIjMDAwMDAwXCJcclxuICBtb2RlUGVuY2lsOiBcIiMwMDAwZmZcIlxyXG5cclxuQWN0aW9uVHlwZSA9XHJcbiAgU0VMRUNUOiAwXHJcbiAgUEVOQ0lMOiAxXHJcbiAgVkFMVUU6IDJcclxuICBORVdHQU1FOiAzXHJcblxyXG5jbGFzcyBTdWRva3VWaWV3XHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbml0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXHJcblxyXG4gICAgd2lkdGhCYXNlZENlbGxTaXplID0gQGNhbnZhcy53aWR0aCAvIDlcclxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XHJcbiAgICBjb25zb2xlLmxvZyBcIndpZHRoQmFzZWRDZWxsU2l6ZSAje3dpZHRoQmFzZWRDZWxsU2l6ZX0gaGVpZ2h0QmFzZWRDZWxsU2l6ZSAje2hlaWdodEJhc2VkQ2VsbFNpemV9XCJcclxuICAgIEBjZWxsU2l6ZSA9IE1hdGgubWluKHdpZHRoQmFzZWRDZWxsU2l6ZSwgaGVpZ2h0QmFzZWRDZWxsU2l6ZSlcclxuXHJcbiAgICAjIGNhbGMgcmVuZGVyIGNvbnN0YW50c1xyXG4gICAgQGxpbmVXaWR0aFRoaW4gPSAxXHJcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcclxuXHJcbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxyXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcclxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXHJcblxyXG4gICAgIyBpbml0IGZvbnRzXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBuZXdnYW1lOiBAYXBwLnJlZ2lzdGVyRm9udChcIm5ld2dhbWVcIiwgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBpbml0QWN0aW9ucygpXHJcblxyXG4gICAgIyBpbml0IHN0YXRlXHJcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcclxuICAgIEBwZW5WYWx1ZSA9IDBcclxuICAgIEBpc1BlbmNpbCA9IGZhbHNlXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcblxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBpbml0QWN0aW9uczogLT5cclxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuU0VMRUNULCB4OiBpLCB5OiBqIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5WQUxVRSwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XHJcblxyXG4gICAgIyBWYWx1ZSBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEwLCB5OiAwIH1cclxuXHJcbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB4OiAxMCwgeTogMCB9XHJcblxyXG4gICAgIyBOZXcgR2FtZSBidXR0b25cclxuICAgIGluZGV4ID0gKE1FTlVfUE9TX1kgKiA5KSArIE1FTlVfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5ORVdHQU1FLCB4OiAwLCB5OiAwIH1cclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBSZW5kZXJpbmdcclxuXHJcbiAgZHJhd0NlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIHMsIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXHJcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHMsIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgZm9udCwgY29sb3IpXHJcblxyXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XHJcbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cclxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcclxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cclxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcclxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcclxuXHJcbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xyXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXHJcblxyXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxyXG5cclxuICAgICMgTWFrZSB3aGl0ZSBwaG9uZS1zaGFwZWQgYmFja2dyb3VuZFxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXHJcblxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBmb250ID0gQGZvbnRzLnBlblxyXG4gICAgICAgIHRleHRDb2xvciA9IENvbG9yLnZhbHVlXHJcbiAgICAgICAgdGV4dCA9IFwiXCJcclxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcclxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuY2lsXHJcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5wZW5jaWxcclxuICAgICAgICAgIHRleHQgPSBAZ2FtZS5wZW5jaWxTdHJpbmcoaSwgailcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID4gMFxyXG4gICAgICAgICAgICB0ZXh0ID0gU3RyaW5nKGNlbGwudmFsdWUpXHJcblxyXG4gICAgICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXHJcblxyXG4gICAgICAgIGlmIChAaGlnaGxpZ2h0WCAhPSAtMSkgJiYgKEBoaWdobGlnaHRZICE9IC0xKVxyXG4gICAgICAgICAgaWYgKGkgPT0gQGhpZ2hsaWdodFgpICYmIChqID09IEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kQ29uZmxpY3RlZFxyXG5cclxuICAgICAgICBpZiBjZWxsLmVycm9yXHJcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5lcnJvclxyXG5cclxuICAgICAgICBAZHJhd0NlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCB0ZXh0LCBmb250LCB0ZXh0Q29sb3IpXHJcblxyXG4gICAgZG9uZSA9IEBnYW1lLmRvbmUoKVxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgY3VycmVudFZhbHVlID0gKGogKiAzKSArIGkgKyAxXHJcbiAgICAgICAgY3VycmVudFZhbHVlU3RyaW5nID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSlcclxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcclxuICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgIGlmIGRvbmVbKGogKiAzKSArIGldXHJcbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxyXG4gICAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5kb25lXHJcblxyXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gY3VycmVudFZhbHVlXHJcbiAgICAgICAgICBpZiBAaXNQZW5jaWxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5fUE9TX1ggKyBpLCBQRU5fUE9TX1kgKyBqLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCB2YWx1ZUNvbG9yKVxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXHJcblxyXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBpZiBAcGVuVmFsdWUgPT0gMTBcclxuICAgICAgICBpZiBAaXNQZW5jaWxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG5cclxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcblxyXG4gICAgaWYgQHBlblZhbHVlID09IDBcclxuICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVNlbGVjdFxyXG4gICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcclxuICAgIGVsc2VcclxuICAgICAgbW9kZUNvbG9yID0gaWYgQGlzUGVuY2lsIHRoZW4gQ29sb3IubW9kZVBlbmNpbCBlbHNlIENvbG9yLm1vZGVQZW5cclxuICAgICAgbW9kZVRleHQgPSBpZiBAaXNQZW5jaWwgdGhlbiBcIlBlbmNpbFwiIGVsc2UgXCJQZW5cIlxyXG4gICAgQGRyYXdDZWxsKE1PREVfUE9TX1gsIE1PREVfUE9TX1ksIG51bGwsIG1vZGVUZXh0LCBAZm9udHMubmV3Z2FtZSwgbW9kZUNvbG9yKVxyXG5cclxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm5ld2dhbWUsIENvbG9yLm5ld0dhbWUpXHJcblxyXG4gICAgIyBNYWtlIHRoZSBncmlkc1xyXG4gICAgQGRyYXdHcmlkKDAsIDAsIDksIEBnYW1lLnNvbHZlZClcclxuICAgIEBkcmF3R3JpZChQRU5fUE9TX1gsIFBFTl9QT1NfWSwgMylcclxuICAgIEBkcmF3R3JpZChQRU5DSUxfUE9TX1gsIFBFTkNJTF9QT1NfWSwgMylcclxuICAgIEBkcmF3R3JpZChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgMSlcclxuICAgIEBkcmF3R3JpZChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgMSlcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbnB1dFxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiU3Vkb2t1Vmlldy5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuICAgIEBnYW1lLm5ld0dhbWUoZGlmZmljdWx0eSlcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAZ2FtZS5yZXNldCgpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIHJldHVybiBAZ2FtZS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gQGdhbWUuZXhwb3J0KClcclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLmhvbGVDb3VudCgpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcclxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXHJcbiAgICB5ID0gTWF0aC5mbG9vcih5IC8gQGNlbGxTaXplKVxyXG5cclxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcclxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XHJcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXHJcbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXHJcbiAgICAgICAgICBzd2l0Y2ggYWN0aW9uLnR5cGVcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlNFTEVDVFxyXG4gICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAwXHJcbiAgICAgICAgICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcclxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gYWN0aW9uLnhcclxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFkgPSBhY3Rpb24ueVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGlmIEBpc1BlbmNpbFxyXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcclxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS50b2dnbGVQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxyXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgMClcclxuICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG5cclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTFxyXG4gICAgICAgICAgICAgIGlmIEBpc1BlbmNpbCBhbmQgIChAcGVuVmFsdWUgPT0gYWN0aW9uLngpXHJcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQGlzUGVuY2lsID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnhcclxuXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5WQUxVRVxyXG4gICAgICAgICAgICAgIGlmIG5vdCBAaXNQZW5jaWwgYW5kIChAcGVuVmFsdWUgPT0gYWN0aW9uLngpXHJcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XHJcblxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuTkVXR0FNRVxyXG4gICAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIG5vIGFjdGlvblxyXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgICAgICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgICAgICAgQHBlblZhbHVlID0gMFxyXG4gICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcclxuXHJcbiAgICAgICAgQGRyYXcoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEhlbHBlcnNcclxuXHJcbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cclxuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICMgc2FtZSBzZWN0aW9uP1xyXG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xyXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xyXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xyXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xyXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXHJcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gICAgaW5pdCgpXHJcbiwgZmFsc2UpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuOFwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
