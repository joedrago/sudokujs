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
    this.drawFill(0, 0, this.canvas.width, this.canvas.height, "#444444");
    this.drawTextCentered("Generating, please wait...", this.canvas.width / 2, this.canvas.height / 2, this.generatingFont, "#ffffff");
    return window.setTimeout((function(_this) {
      return function() {
        _this.views.sudoku.newGame(difficulty);
        return _this.switchView("sudoku");
      };
    })(this), 0);
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
    for (attempt = k = 0; k < 3; attempt = ++k) {
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
module.exports = "0.0.7";


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL0ZvbnRGYWNlT2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVKO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBNEIsSUFBQyxDQUFBLGlCQUFGLEdBQW9CLHVCQUEvQztJQUVmLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUN4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Z2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ0ZvbnRGYWNlT2JzZXJ2ZXInXG5cbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcblN1ZG9rdVZpZXcgPSByZXF1aXJlICcuL1N1ZG9rdVZpZXcnXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xuXG5jbGFzcyBBcHBcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBsb2FkRm9udChcInNheE1vbm9cIilcbiAgICBAZm9udHMgPSB7fVxuXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAdmlld3MgPVxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgICBzdWRva3U6IG5ldyBTdWRva3VWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBtZWFzdXJlRm9udHM6IC0+XG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcbiAgICByZXR1cm5cblxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cbiAgICBmb250ID1cbiAgICAgIG5hbWU6IG5hbWVcbiAgICAgIHN0eWxlOiBzdHlsZVxuICAgICAgaGVpZ2h0OiAwXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxuICAgIEBtZWFzdXJlRm9udHMoKVxuICAgIHJldHVybiBmb250XG5cbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxuICAgICAgQG1lYXN1cmVGb250cygpXG4gICAgICBAZHJhdygpXG5cbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cbiAgICBAZHJhdygpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcblxuICAgIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXG4gICAgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgd2luZG93LnNldFRpbWVvdXQgPT5cbiAgICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxuICAgICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcbiAgICAsIDBcblxuICByZXNldDogLT5cbiAgICBAdmlld3Muc3Vkb2t1LnJlc2V0KClcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxuXG4gIGhvbGVDb3VudDogLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxuXG4gIGRyYXc6IC0+XG4gICAgQHZpZXcuZHJhdygpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXG5cbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHguZmlsbCgpXG5cbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXG4gICAgICBAY3R4LmZpbGwoKVxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxuICAgICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxuICBAYmVnaW5QYXRoKClcbiAgQG1vdmVUbyh4K3IsIHkpXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXG4gIEBjbG9zZVBhdGgoKVxuICByZXR1cm4gdGhpc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbkJVVFRPTl9IRUlHSFQgPSAwLjA2XG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcblxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcbiAgaWYgaW5kZXggPiAzXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIGlmIGluZGV4ID4gNFxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDZcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgcmV0dXJuIHlcblxuY2xhc3MgTWVudVZpZXdcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIEBidXR0b25zID1cbiAgICAgIG5ld0Vhc3k6XG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxuICAgICAgbmV3TWVkaXVtOlxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXG4gICAgICBuZXdIYXJkOlxuICAgICAgICB5OiBidXR0b25Qb3MoMilcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzMzM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcbiAgICAgIG5ld0V4dHJlbWU6XG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzcxMTExXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxuICAgICAgcmVzZXQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzM3N1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXG4gICAgICBpbXBvcnQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXG4gICAgICBleHBvcnQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxuICAgICAgcmVzdW1lOlxuICAgICAgICB5OiBidXR0b25Qb3MoNylcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcblxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgYnV0dG9uLnggPSBidXR0b25YXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxuXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjEpXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgcmV0dXJuXG5cbiAgZHJhdzogLT5cbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzMzMzNcIilcblxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMVxuXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcbiAgICB5MiA9IEBjYW52YXMuaGVpZ2h0ICogMC4xNVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCArIHNoYWRvd09mZnNldCwgeTEgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcblxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXG5cbiAgICBAYXBwLmRyYXdMb3dlckxlZnQoXCIje0BhcHAuaG9sZUNvdW50KCl9LzgxXCIpXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXG4gICAgcmV0dXJuXG5cbiAgbmV3RWFzeTogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcblxuICBuZXdNZWRpdW06IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSlcblxuICBuZXdIYXJkOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkKVxuXG4gIG5ld0V4dHJlbWU6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQGFwcC5yZXNldCgpXG5cbiAgcmVzdW1lOiAtPlxuICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGV4cG9ydDogLT5cbiAgICBpZiBuYXZpZ2F0b3Iuc2hhcmUgIT0gdW5kZWZpbmVkXG4gICAgICBuYXZpZ2F0b3Iuc2hhcmUge1xuICAgICAgICB0aXRsZTogXCJTdWRva3UgU2hhcmVkIEdhbWVcIlxuICAgICAgICB0ZXh0OiBAYXBwLmV4cG9ydCgpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0aGlzIGFuZCBwYXN0ZSB0byBhIGZyaWVuZDpcIiwgQGFwcC5leHBvcnQoKSlcblxuICBpbXBvcnQ6IC0+XG4gICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIlBhc3RlIGFuIGV4cG9ydGVkIGdhbWUgaGVyZTpcIiwgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcgPT0gbnVsbFxuICAgICAgcmV0dXJuXG4gICAgaWYgQGFwcC5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5jbGFzcyBTdWRva3VHYW1lXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBjbGVhcigpXG4gICAgaWYgbm90IEBsb2FkKClcbiAgICAgIEBuZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXG4gICAgcmV0dXJuXG5cbiAgY2xlYXI6IC0+XG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIEBncmlkW2ldW2pdID1cbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICAgIGVycm9yOiBmYWxzZVxuICAgICAgICAgIGxvY2tlZDogZmFsc2VcbiAgICAgICAgICBwZW5jaWw6IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxuXG4gICAgQHNvbHZlZCA9IGZhbHNlXG5cbiAgaG9sZUNvdW50OiAtPlxuICAgIGNvdW50ID0gMFxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgbm90IEBncmlkW2ldW2pdLmxvY2tlZFxuICAgICAgICAgIGNvdW50ICs9IDFcbiAgICByZXR1cm4gY291bnRcblxuICBleHBvcnQ6IC0+XG4gICAgZXhwb3J0U3RyaW5nID0gXCJTRFwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5sb2NrZWRcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIje0BncmlkW2ldW2pdLnZhbHVlfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIwXCJcbiAgICByZXR1cm4gZXhwb3J0U3RyaW5nXG5cbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIEBjbGVhcigpXG5cbiAgICBpbmRleCA9IDBcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXG4gICAgICAgIGluZGV4ICs9IDFcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSB2XG5cbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIEBzYXZlKClcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHVwZGF0ZUNlbGw6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgeCAhPSBpXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuXG4gICAgICBpZiB5ICE9IGlcbiAgICAgICAgdiA9IEBncmlkW3hdW2ldLnZhbHVlXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICBAZ3JpZFt4XVtpXS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxuICAgICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuICAgIHJldHVyblxuXG4gIHVwZGF0ZUNlbGxzOiAtPlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0uZXJyb3IgPSBmYWxzZVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxuXG4gICAgQHNvbHZlZCA9IHRydWVcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmVycm9yXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcblxuICAgICMgaWYgQHNvbHZlZFxuICAgICMgICBjb25zb2xlLmxvZyBcInNvbHZlZCAje0Bzb2x2ZWR9XCJcblxuICAgIHJldHVybiBAc29sdmVkXG5cbiAgZG9uZTogLT5cbiAgICBkID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXG4gICAgY291bnRzID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlICE9IDBcbiAgICAgICAgICBjb3VudHNbQGdyaWRbaV1bal0udmFsdWUtMV0gKz0gMVxuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgY291bnRzW2ldID09IDlcbiAgICAgICAgZFtpXSA9IHRydWVcbiAgICByZXR1cm4gZFxuXG4gIHBlbmNpbFN0cmluZzogKHgsIHkpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgcyA9IFwiXCJcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiBjZWxsLnBlbmNpbFtpXVxuICAgICAgICBzICs9IFN0cmluZyhpKzEpXG4gICAgcmV0dXJuIHNcblxuICBjbGVhclBlbmNpbDogKHgsIHkpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGNlbGwucGVuY2lsW2ldID0gZmFsc2VcbiAgICBAc2F2ZSgpXG5cbiAgdG9nZ2xlUGVuY2lsOiAoeCwgeSwgdikgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgY2VsbC5wZW5jaWxbdi0xXSA9ICFjZWxsLnBlbmNpbFt2LTFdXG4gICAgQHNhdmUoKVxuXG4gIHNldFZhbHVlOiAoeCwgeSwgdikgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgY2VsbC52YWx1ZSA9IHZcbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIEBzYXZlKClcblxuICByZXNldDogLT5cbiAgICBjb25zb2xlLmxvZyBcInJlc2V0KClcIlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGlmIG5vdCBjZWxsLmxvY2tlZFxuICAgICAgICAgIGNlbGwudmFsdWUgPSAwXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxuICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJuZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBjZWxsLnZhbHVlID0gMFxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcbiAgICAgICAgY2VsbC5sb2NrZWQgPSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxuXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXG4gICAgbmV3R3JpZCA9IGdlbmVyYXRvci5nZW5lcmF0ZShkaWZmaWN1bHR5KVxuICAgICMgY29uc29sZS5sb2cgXCJuZXdHcmlkXCIsIG5ld0dyaWRcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIG5ld0dyaWRbaV1bal0gIT0gMFxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIEBzYXZlKClcblxuICBsb2FkOiAtPlxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGpzb25TdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVcIilcbiAgICBpZiBqc29uU3RyaW5nID09IG51bGxcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgIyBjb25zb2xlLmxvZyBqc29uU3RyaW5nXG4gICAgZ2FtZURhdGEgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXG4gICAgIyBjb25zb2xlLmxvZyBcImZvdW5kIGdhbWVEYXRhXCIsIGdhbWVEYXRhXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIHNyYyA9IGdhbWVEYXRhLmdyaWRbaV1bal1cbiAgICAgICAgZHN0ID0gQGdyaWRbaV1bal1cbiAgICAgICAgZHN0LnZhbHVlID0gc3JjLnZcbiAgICAgICAgZHN0LmVycm9yID0gaWYgc3JjLmUgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgIGRzdC5sb2NrZWQgPSBpZiBzcmMubCA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGRzdC5wZW5jaWxba10gPSBpZiBzcmMucFtrXSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcblxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgY29uc29sZS5sb2cgXCJMb2FkZWQgZ2FtZS5cIlxuICAgIHJldHVybiB0cnVlXG5cbiAgc2F2ZTogLT5cbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGdhbWVEYXRhID1cbiAgICAgIGdyaWQ6IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgZ2FtZURhdGEuZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBnYW1lRGF0YS5ncmlkW2ldW2pdID1cbiAgICAgICAgICB2OiBjZWxsLnZhbHVlXG4gICAgICAgICAgZTogaWYgY2VsbC5lcnJvciB0aGVuIDEgZWxzZSAwXG4gICAgICAgICAgbDogaWYgY2VsbC5sb2NrZWQgdGhlbiAxIGVsc2UgMFxuICAgICAgICAgIHA6IFtdXG4gICAgICAgIGRzdCA9IGdhbWVEYXRhLmdyaWRbaV1bal0ucFxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgZHN0LnB1c2goaWYgY2VsbC5wZW5jaWxba10gdGhlbiAxIGVsc2UgMClcblxuICAgIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShnYW1lRGF0YSlcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWVcIiwganNvblN0cmluZylcbiAgICBjb25zb2xlLmxvZyBcIlNhdmVkIGdhbWUgKCN7anNvblN0cmluZy5sZW5ndGh9IGNoYXJzKVwiXG4gICAgcmV0dXJuIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHYW1lXG4iLCJzaHVmZmxlID0gKGEpIC0+XG4gICAgaSA9IGEubGVuZ3RoXG4gICAgd2hpbGUgLS1pID4gMFxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXG4gICAgICAgIHQgPSBhW2pdXG4gICAgICAgIGFbal0gPSBhW2ldXG4gICAgICAgIGFbaV0gPSB0XG4gICAgcmV0dXJuIGFcblxuY2xhc3MgQm9hcmRcbiAgY29uc3RydWN0b3I6IChvdGhlckJvYXJkID0gbnVsbCkgLT5cbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxuICAgICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICBAbG9ja2VkW2ldW2pdID0gb3RoZXJCb2FyZC5sb2NrZWRbaV1bal1cbiAgICByZXR1cm5cblxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxuICBAZGlmZmljdWx0eTpcbiAgICBlYXN5OiAxXG4gICAgbWVkaXVtOiAyXG4gICAgaGFyZDogM1xuICAgIGV4dHJlbWU6IDRcblxuICBjb25zdHJ1Y3RvcjogLT5cblxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cbiAgICByZXR1cm4gbmV3Qm9hcmRcblxuICBjZWxsVmFsaWQ6IChib2FyZCwgeCwgeSwgdikgLT5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cbiAgICBtYXJrcyA9IFtdXG4gICAgZm9yIHYgaW4gWzEuLjldXG4gICAgICBpZiBAY2VsbFZhbGlkKGJvYXJkLCB4LCB5LCB2KVxuICAgICAgICBtYXJrcy5wdXNoIHZcbiAgICBpZiBtYXJrcy5sZW5ndGggPiAxXG4gICAgICBzaHVmZmxlKG1hcmtzKVxuICAgIHJldHVybiBtYXJrc1xuXG4gIHNvbHZlOiAoYm9hcmQpIC0+XG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgIHBlbmNpbCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgcGVuY2lsW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICAjIGRlYnVnZ2VyO1xuXG4gICAgd2Fsa0luZGV4ID0gMFxuICAgIGRpcmVjdGlvbiA9IDFcbiAgICB3aGlsZSB3YWxrSW5kZXggPCA4MVxuICAgICAgeCA9IHdhbGtJbmRleCAlIDlcbiAgICAgIHkgPSBNYXRoLmZsb29yKHdhbGtJbmRleCAvIDkpXG5cbiAgICAgIGlmIG5vdCBzb2x2ZWQubG9ja2VkW3hdW3ldXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gMSkgYW5kICgocGVuY2lsW3hdW3ldID09IG51bGwpIG9yIChwZW5jaWxbeF1beV0ubGVuZ3RoID09IDApKVxuICAgICAgICAgIHBlbmNpbFt4XVt5XSA9IEBwZW5jaWxNYXJrcyhzb2x2ZWQsIHgsIHkpXG5cbiAgICAgICAgaWYgcGVuY2lsW3hdW3ldLmxlbmd0aCA9PSAwXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXG4gICAgICAgICAgZGlyZWN0aW9uID0gLTFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gcGVuY2lsW3hdW3ldLnBvcCgpXG4gICAgICAgICAgZGlyZWN0aW9uID0gMVxuXG4gICAgICB3YWxrSW5kZXggKz0gZGlyZWN0aW9uXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gc29sdmVkXG5cbiAgaGFzVW5pcXVlU29sdXRpb246IChib2FyZCkgLT5cbiAgICBmaXJzdFNvbHZlID0gQHNvbHZlKGJvYXJkKVxuICAgIGZvciB1bmljaXR5VGVzdHMgaW4gWzAuLi42XVxuICAgICAgbmV4dFNvbHZlID0gQHNvbHZlKGJvYXJkKVxuICAgICAgaWYgbm90IGZpcnN0U29sdmUubWF0Y2hlcyhuZXh0U29sdmUpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxuICAgICMgaGFja1xuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYm9hcmQubG9ja2VkW2ldW2pdID0gdHJ1ZVxuXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcbiAgICByZW1vdmVkID0gMFxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcblxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcbiAgICAgIG5leHRCb2FyZC5sb2NrZWRbcnhdW3J5XSA9IGZhbHNlXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxuICAgICAgICByZW1vdmVkICs9IDFcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXG5cbiAgICByZXR1cm4ge1xuICAgICAgYm9hcmQ6IGJvYXJkXG4gICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgfVxuXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cblxuICAgIGJlc3QgPSBudWxsXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4zXVxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcbiAgICAgICAgYnJlYWtcblxuICAgICAgaWYgYmVzdCA9PSBudWxsXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxuXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcblxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcblxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xuXG5QRU5fUE9TX1ggPSAxXG5QRU5fUE9TX1kgPSAxMFxuUEVOX0NMRUFSX1BPU19YID0gMlxuUEVOX0NMRUFSX1BPU19ZID0gMTNcblxuUEVOQ0lMX1BPU19YID0gNVxuUEVOQ0lMX1BPU19ZID0gMTBcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcblBFTkNJTF9DTEVBUl9QT1NfWSA9IDEzXG5cbk1FTlVfUE9TX1ggPSA0XG5NRU5VX1BPU19ZID0gMTNcblxuTU9ERV9QT1NfWCA9IDRcbk1PREVfUE9TX1kgPSA5XG5cbkNvbG9yID1cbiAgdmFsdWU6IFwiYmxhY2tcIlxuICBwZW5jaWw6IFwiIzAwMDBmZlwiXG4gIGVycm9yOiBcIiNmZjAwMDBcIlxuICBkb25lOiBcIiNjY2NjY2NcIlxuICBuZXdHYW1lOiBcIiMwMDg4MzNcIlxuICBiYWNrZ3JvdW5kU2VsZWN0ZWQ6IFwiI2VlZWVhYVwiXG4gIGJhY2tncm91bmRMb2NrZWQ6IFwiI2VlZWVlZVwiXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxuICBiYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWQ6IFwiI2VlZWVkZFwiXG4gIGJhY2tncm91bmRDb25mbGljdGVkOiBcIiNmZmZmZGRcIlxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXG4gIG1vZGVTZWxlY3Q6IFwiIzc3Nzc0NFwiXG4gIG1vZGVQZW46IFwiIzAwMDAwMFwiXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXG5cbkFjdGlvblR5cGUgPVxuICBTRUxFQ1Q6IDBcbiAgUEVOQ0lMOiAxXG4gIFZBTFVFOiAyXG4gIE5FV0dBTUU6IDNcblxuY2xhc3MgU3Vkb2t1Vmlld1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBJbml0XG5cbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXG5cbiAgICB3aWR0aEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLndpZHRoIC8gOVxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XG4gICAgY29uc29sZS5sb2cgXCJ3aWR0aEJhc2VkQ2VsbFNpemUgI3t3aWR0aEJhc2VkQ2VsbFNpemV9IGhlaWdodEJhc2VkQ2VsbFNpemUgI3toZWlnaHRCYXNlZENlbGxTaXplfVwiXG4gICAgQGNlbGxTaXplID0gTWF0aC5taW4od2lkdGhCYXNlZENlbGxTaXplLCBoZWlnaHRCYXNlZENlbGxTaXplKVxuXG4gICAgIyBjYWxjIHJlbmRlciBjb25zdGFudHNcbiAgICBAbGluZVdpZHRoVGhpbiA9IDFcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcblxuICAgIGZvbnRQaXhlbHNTID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjMpXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcbiAgICBmb250UGl4ZWxzTCA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC44KVxuXG4gICAgIyBpbml0IGZvbnRzXG4gICAgQGZvbnRzID1cbiAgICAgIHBlbmNpbDogIEBhcHAucmVnaXN0ZXJGb250KFwicGVuY2lsXCIsICBcIiN7Zm9udFBpeGVsc1N9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgICBuZXdnYW1lOiBAYXBwLnJlZ2lzdGVyRm9udChcIm5ld2dhbWVcIiwgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgICAgcGVuOiAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5cIiwgICAgIFwiI3tmb250UGl4ZWxzTH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEBpbml0QWN0aW9ucygpXG5cbiAgICAjIGluaXQgc3RhdGVcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcbiAgICBAcGVuVmFsdWUgPSAwXG4gICAgQGlzUGVuY2lsID0gZmFsc2VcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxuXG4gICAgQGRyYXcoKVxuXG4gIGluaXRBY3Rpb25zOiAtPlxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpbmRleCA9IChqICogOSkgKyBpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5TRUxFQ1QsIHg6IGksIHk6IGogfVxuXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XG5cbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGluZGV4ID0gKChQRU5DSUxfUE9TX1kgKyBqKSAqIDkpICsgKFBFTkNJTF9QT1NfWCArIGkpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XG5cbiAgICAjIFZhbHVlIGNsZWFyIGJ1dHRvblxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlZBTFVFLCB4OiAxMCwgeTogMCB9XG5cbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cbiAgICBpbmRleCA9IChQRU5DSUxfQ0xFQVJfUE9TX1kgKiA5KSArIFBFTkNJTF9DTEVBUl9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEwLCB5OiAwIH1cblxuICAgICMgTmV3IEdhbWUgYnV0dG9uXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5ORVdHQU1FLCB4OiAwLCB5OiAwIH1cblxuICAgIHJldHVyblxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIFJlbmRlcmluZ1xuXG4gIGRyYXdDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBzLCBmb250LCBjb2xvcikgLT5cbiAgICBweCA9IHggKiBAY2VsbFNpemVcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxuICAgICAgQGFwcC5kcmF3RmlsbChweCwgcHksIEBjZWxsU2l6ZSwgQGNlbGxTaXplLCBiYWNrZ3JvdW5kQ29sb3IpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHMsIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgZm9udCwgY29sb3IpXG5cbiAgZHJhd0dyaWQ6IChvcmlnaW5YLCBvcmlnaW5ZLCBzaXplLCBzb2x2ZWQgPSBmYWxzZSkgLT5cbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cbiAgICAgIGNvbG9yID0gaWYgc29sdmVkIHRoZW4gXCJncmVlblwiIGVsc2UgXCJibGFja1wiXG4gICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpblxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcbiAgICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaWNrXG5cbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIHNpemUpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBjb2xvciwgbGluZVdpZHRoKVxuXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgc2l6ZSksIGNvbG9yLCBsaW5lV2lkdGgpXG5cbiAgICByZXR1cm5cblxuICBkcmF3OiAtPlxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcblxuICAgICMgQ2xlYXIgc2NyZWVuIHRvIGJsYWNrXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxuXG4gICAgIyBNYWtlIHdoaXRlIHBob25lLXNoYXBlZCBiYWNrZ3JvdW5kXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdhbWUuZ3JpZFtpXVtqXVxuXG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICAgICAgZm9udCA9IEBmb250cy5wZW5cbiAgICAgICAgdGV4dENvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgdGV4dCA9IFwiXCJcbiAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwXG4gICAgICAgICAgZm9udCA9IEBmb250cy5wZW5jaWxcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgICB0ZXh0ID0gQGdhbWUucGVuY2lsU3RyaW5nKGksIGopXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID4gMFxuICAgICAgICAgICAgdGV4dCA9IFN0cmluZyhjZWxsLnZhbHVlKVxuXG4gICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFxuXG4gICAgICAgIGlmIChAaGlnaGxpZ2h0WCAhPSAtMSkgJiYgKEBoaWdobGlnaHRZICE9IC0xKVxuICAgICAgICAgIGlmIChpID09IEBoaWdobGlnaHRYKSAmJiAoaiA9PSBAaGlnaGxpZ2h0WSlcbiAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxuICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZENvbmZsaWN0ZWRcblxuICAgICAgICBpZiBjZWxsLmVycm9yXG4gICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuZXJyb3JcblxuICAgICAgICBAZHJhd0NlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCB0ZXh0LCBmb250LCB0ZXh0Q29sb3IpXG5cbiAgICBkb25lID0gQGdhbWUuZG9uZSgpXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBjdXJyZW50VmFsdWUgPSAoaiAqIDMpICsgaSArIDFcbiAgICAgICAgY3VycmVudFZhbHVlU3RyaW5nID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSlcbiAgICAgICAgdmFsdWVDb2xvciA9IENvbG9yLnZhbHVlXG4gICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IucGVuY2lsXG4gICAgICAgIGlmIGRvbmVbKGogKiAzKSArIGldXG4gICAgICAgICAgdmFsdWVDb2xvciA9IENvbG9yLmRvbmVcbiAgICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLmRvbmVcblxuICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gY3VycmVudFZhbHVlXG4gICAgICAgICAgaWYgQGlzUGVuY2lsXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuXG4gICAgICAgIEBkcmF3Q2VsbChQRU5fUE9TX1ggKyBpLCBQRU5fUE9TX1kgKyBqLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCB2YWx1ZUNvbG9yKVxuICAgICAgICBAZHJhd0NlbGwoUEVOQ0lMX1BPU19YICsgaSwgUEVOQ0lMX1BPU19ZICsgaiwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHBlbmNpbENvbG9yKVxuXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxuICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuXG4gICAgQGRyYXdDZWxsKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXG5cbiAgICBpZiBAcGVuVmFsdWUgPT0gMFxuICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVNlbGVjdFxuICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXG4gICAgZWxzZVxuICAgICAgbW9kZUNvbG9yID0gaWYgQGlzUGVuY2lsIHRoZW4gQ29sb3IubW9kZVBlbmNpbCBlbHNlIENvbG9yLm1vZGVQZW5cbiAgICAgIG1vZGVUZXh0ID0gaWYgQGlzUGVuY2lsIHRoZW4gXCJQZW5jaWxcIiBlbHNlIFwiUGVuXCJcbiAgICBAZHJhd0NlbGwoTU9ERV9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5uZXdnYW1lLCBtb2RlQ29sb3IpXG5cbiAgICBAZHJhd0NlbGwoTUVOVV9QT1NfWCwgTUVOVV9QT1NfWSwgbnVsbCwgXCJNZW51XCIsIEBmb250cy5uZXdnYW1lLCBDb2xvci5uZXdHYW1lKVxuXG4gICAgIyBNYWtlIHRoZSBncmlkc1xuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXG4gICAgQGRyYXdHcmlkKFBFTl9QT1NfWCwgUEVOX1BPU19ZLCAzKVxuICAgIEBkcmF3R3JpZChQRU5DSUxfUE9TX1gsIFBFTkNJTF9QT1NfWSwgMylcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCAxKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIElucHV0XG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuICAgIEBnYW1lLm5ld0dhbWUoZGlmZmljdWx0eSlcblxuICByZXNldDogLT5cbiAgICBAZ2FtZS5yZXNldCgpXG5cbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIHJldHVybiBAZ2FtZS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQGdhbWUuZXhwb3J0KClcblxuICBob2xlQ291bnQ6IC0+XG4gICAgcmV0dXJuIEBnYW1lLmhvbGVDb3VudCgpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxuICAgIHkgPSBNYXRoLmZsb29yKHkgLyBAY2VsbFNpemUpXG5cbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXG4gICAgICAgIGluZGV4ID0gKHkgKiA5KSArIHhcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJBY3Rpb246IFwiLCBhY3Rpb25cbiAgICAgICAgICBzd2l0Y2ggYWN0aW9uLnR5cGVcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1RcbiAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IDBcbiAgICAgICAgICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WCA9IGFjdGlvbi54XG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnRvZ2dsZVBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCAwKVxuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcblxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTFxuICAgICAgICAgICAgICBpZiBAaXNQZW5jaWwgYW5kICAoQHBlblZhbHVlID09IGFjdGlvbi54KVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IDBcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBpc1BlbmNpbCA9IHRydWVcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24ueFxuXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuVkFMVUVcbiAgICAgICAgICAgICAgaWYgbm90IEBpc1BlbmNpbCBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24ueClcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAaXNQZW5jaWwgPSBmYWxzZVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XG5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5ORVdHQU1FXG4gICAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAjIG5vIGFjdGlvblxuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgICAgICAgQHBlblZhbHVlID0gMFxuICAgICAgICAgIEBpc1BlbmNpbCA9IGZhbHNlXG5cbiAgICAgICAgQGRyYXcoKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIEhlbHBlcnNcblxuICBjb25mbGljdHM6ICh4MSwgeTEsIHgyLCB5MikgLT5cbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cbiAgICBpZiAoeDEgPT0geDIpIHx8ICh5MSA9PSB5MilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICAjIHNhbWUgc2VjdGlvbj9cbiAgICBzeDEgPSBNYXRoLmZsb29yKHgxIC8gMykgKiAzXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xuICAgIHN4MiA9IE1hdGguZmxvb3IoeDIgLyAzKSAqIDNcbiAgICBzeTIgPSBNYXRoLmZsb29yKHkyIC8gMykgKiAzXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdVZpZXdcbiIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xuXG5pbml0ID0gLT5cbiAgY29uc29sZS5sb2cgXCJpbml0XCJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcbiAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXG5cbiAgIyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoc3RhcnRcIiwgKGUpIC0+XG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXG4gICMgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcbiAgIyAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgKGUpIC0+XG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAgIHdpbmRvdy5hcHAuY2xpY2soeCwgeSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cbiAgICBpbml0KClcbiwgZmFsc2UpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjdcIiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
