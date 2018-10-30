(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, FontFaceObserver, MenuView, SudokuView, version;

FontFaceObserver = require('fontfaceobserver');

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


},{"./MenuView":2,"./SudokuView":5,"./version":7,"fontfaceobserver":8}],2:[function(require,module,exports){
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
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, subtitleFontHeight, titleFontHeight;
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
    titleFontHeight = Math.floor(this.canvas.height * 0.06);
    this.titleFont = this.app.registerFont("button", titleFontHeight + "px saxMono, monospace");
    subtitleFontHeight = Math.floor(this.canvas.height * 0.02);
    this.subtitleFont = this.app.registerFont("button", subtitleFontHeight + "px saxMono, monospace");
    return;
  }

  MenuView.prototype.draw = function() {
    var button, buttonName, ref, shadowOffset, x, y1, y2, y3;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#333333");
    x = this.canvas.width / 2;
    shadowOffset = this.canvas.height * 0.005;
    y1 = this.canvas.height * 0.05;
    y2 = y1 + this.canvas.height * 0.06;
    y3 = y2 + this.canvas.height * 0.06;
    this.app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Bad Guy", x, y1, this.titleFont, "#ffffff");
    this.app.drawTextCentered("Sudoku", x, y2, this.titleFont, "#ffffff");
    this.app.drawTextCentered("It's like Sudoku, but you are the bad guy.", x, y3, this.subtitleFont, "#ffffff");
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
module.exports = "0.0.9";


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVKO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBNEIsSUFBQyxDQUFBLGlCQUFGLEdBQW9CLHVCQUEvQztJQUVmLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUN4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LE1BQU0sQ0FBQyxLQUFQLEdBQWUsUUFBUSxDQUFDLGVBQWUsQ0FBQztFQUN4QyxNQUFNLENBQUMsTUFBUCxHQUFnQixRQUFRLENBQUMsZUFBZSxDQUFDO0VBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBZCxDQUEyQixNQUEzQixFQUFtQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVcsQ0FBQSxDQUFBLENBQTVEO0VBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO0VBRWIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFJLEdBQUosQ0FBUSxNQUFSO1NBUWIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQUMsQ0FBRDtBQUNuQyxRQUFBO0lBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztXQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEI7RUFIbUMsQ0FBckM7QUFoQks7O0FBcUJQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQ3ZCQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXG5cbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcblN1ZG9rdVZpZXcgPSByZXF1aXJlICcuL1N1ZG9rdVZpZXcnXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xuXG5jbGFzcyBBcHBcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBsb2FkRm9udChcInNheE1vbm9cIilcbiAgICBAZm9udHMgPSB7fVxuXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAdmlld3MgPVxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgICBzdWRva3U6IG5ldyBTdWRva3VWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBtZWFzdXJlRm9udHM6IC0+XG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcbiAgICByZXR1cm5cblxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cbiAgICBmb250ID1cbiAgICAgIG5hbWU6IG5hbWVcbiAgICAgIHN0eWxlOiBzdHlsZVxuICAgICAgaGVpZ2h0OiAwXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxuICAgIEBtZWFzdXJlRm9udHMoKVxuICAgIHJldHVybiBmb250XG5cbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxuICAgICAgQG1lYXN1cmVGb250cygpXG4gICAgICBAZHJhdygpXG5cbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cbiAgICBAZHJhdygpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcblxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcblxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cbiAgICBAdmlld3Muc3Vkb2t1Lm5ld0dhbWUoZGlmZmljdWx0eSlcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuICAgICMgLCAwXG5cbiAgcmVzZXQ6IC0+XG4gICAgQHZpZXdzLnN1ZG9rdS5yZXNldCgpXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuaW1wb3J0KGltcG9ydFN0cmluZylcblxuICBleHBvcnQ6IC0+XG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuZXhwb3J0KClcblxuICBob2xlQ291bnQ6IC0+XG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuaG9sZUNvdW50KClcblxuICBkcmF3OiAtPlxuICAgIEB2aWV3LmRyYXcoKVxuXG4gIGNsaWNrOiAoeCwgeSkgLT5cbiAgICBAdmlldy5jbGljayh4LCB5KVxuXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LmZpbGwoKVxuXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cbiAgICBAY3R4LnJvdW5kUmVjdCh4LCB5LCB3LCBoLCByKVxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxuICAgICAgQGN0eC5maWxsKClcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcbiAgICAgIEBjdHguc3Ryb2tlKClcbiAgICByZXR1cm5cblxuICBkcmF3UmVjdDogKHgsIHksIHcsIGgsIGNvbG9yLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxuICAgIEBjdHguc3Ryb2tlKClcblxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxuICAgIEBjdHguc3Ryb2tlKClcblxuICBkcmF3VGV4dENlbnRlcmVkOiAodGV4dCwgY3gsIGN5LCBmb250LCBjb2xvcikgLT5cbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgY3gsIGN5ICsgKGZvbnQuaGVpZ2h0IC8gMikpXG5cbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXG5cbiAgZHJhd1ZlcnNpb246IChjb2xvciA9IFwid2hpdGVcIikgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcbiAgQGJlZ2luUGF0aCgpXG4gIEBtb3ZlVG8oeCtyLCB5KVxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxuICBAY2xvc2VQYXRoKClcbiAgcmV0dXJuIHRoaXNcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5CVVRUT05fSEVJR0hUID0gMC4wNlxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXG5cbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXG4gIGlmIGluZGV4ID4gM1xuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDRcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgaWYgaW5kZXggPiA2XG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIHJldHVybiB5XG5cbmNsYXNzIE1lbnVWaWV3XG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cbiAgICBAYnV0dG9ucyA9XG4gICAgICBuZXdFYXN5OlxuICAgICAgICB5OiBidXR0b25Qb3MoMClcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRWFzeVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNzczM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdFYXN5LmJpbmQodGhpcylcbiAgICAgIG5ld01lZGl1bTpcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxuICAgICAgbmV3SGFyZDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEhhcmRcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzMzNcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAbmV3SGFyZC5iaW5kKHRoaXMpXG4gICAgICBuZXdFeHRyZW1lOlxuICAgICAgICB5OiBidXR0b25Qb3MoMylcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRXh0cmVtZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MTExMVwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdFeHRyZW1lLmJpbmQodGhpcylcbiAgICAgIHJlc2V0OlxuICAgICAgICB5OiBidXR0b25Qb3MoNClcbiAgICAgICAgdGV4dDogXCJSZXNldCBQdXp6bGVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzNzdcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzZXQuYmluZCh0aGlzKVxuICAgICAgaW1wb3J0OlxuICAgICAgICB5OiBidXR0b25Qb3MoNSlcbiAgICAgICAgdGV4dDogXCJMb2FkIFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBpbXBvcnQuYmluZCh0aGlzKVxuICAgICAgZXhwb3J0OlxuICAgICAgICB5OiBidXR0b25Qb3MoNilcbiAgICAgICAgdGV4dDogXCJTaGFyZSBQdXp6bGVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAZXhwb3J0LmJpbmQodGhpcylcbiAgICAgIHJlc3VtZTpcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXG5cbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcblxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNilcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICBzdWJ0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcbiAgICBAc3VidGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3N1YnRpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICByZXR1cm5cblxuICBkcmF3OiAtPlxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxuXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAwNVxuXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcbiAgICB5MiA9IHkxICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XG4gICAgeTMgPSB5MiArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCArIHNoYWRvd09mZnNldCwgeTEgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJJdCdzIGxpa2UgU3Vkb2t1LCBidXQgeW91IGFyZSB0aGUgYmFkIGd1eS5cIiwgeCwgeTMsIEBzdWJ0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcblxuICAgIEBhcHAuZHJhd0xvd2VyTGVmdChcIiN7QGFwcC5ob2xlQ291bnQoKX0vODFcIilcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcblxuICBjbGljazogKHgsIHkpIC0+XG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcbiAgICByZXR1cm5cblxuICBuZXdFYXN5OiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxuXG4gIG5ld01lZGl1bTogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtKVxuXG4gIG5ld0hhcmQ6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQpXG5cbiAgbmV3RXh0cmVtZTogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSlcblxuICByZXNldDogLT5cbiAgICBAYXBwLnJlc2V0KClcblxuICByZXN1bWU6IC0+XG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbiAgZXhwb3J0OiAtPlxuICAgIGlmIG5hdmlnYXRvci5zaGFyZSAhPSB1bmRlZmluZWRcbiAgICAgIG5hdmlnYXRvci5zaGFyZSB7XG4gICAgICAgIHRpdGxlOiBcIlN1ZG9rdSBTaGFyZWQgR2FtZVwiXG4gICAgICAgIHRleHQ6IEBhcHAuZXhwb3J0KClcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIHdpbmRvdy5wcm9tcHQoXCJDb3B5IHRoaXMgYW5kIHBhc3RlIHRvIGEgZnJpZW5kOlwiLCBAYXBwLmV4cG9ydCgpKVxuXG4gIGltcG9ydDogLT5cbiAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiUGFzdGUgYW4gZXhwb3J0ZWQgZ2FtZSBoZXJlOlwiLCBcIlwiKVxuICAgIGlmIGltcG9ydFN0cmluZyA9PSBudWxsXG4gICAgICByZXR1cm5cbiAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXG4gICAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbmNsYXNzIFN1ZG9rdUdhbWVcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGNsZWFyKClcbiAgICBpZiBub3QgQGxvYWQoKVxuICAgICAgQG5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcbiAgICByZXR1cm5cblxuICBjbGVhcjogLT5cbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0gPVxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgZXJyb3I6IGZhbHNlXG4gICAgICAgICAgbG9ja2VkOiBmYWxzZVxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXG5cbiAgICBAc29sdmVkID0gZmFsc2VcblxuICBob2xlQ291bnQ6IC0+XG4gICAgY291bnQgPSAwXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBub3QgQGdyaWRbaV1bal0ubG9ja2VkXG4gICAgICAgICAgY291bnQgKz0gMVxuICAgIHJldHVybiBjb3VudFxuXG4gIGV4cG9ydDogLT5cbiAgICBleHBvcnRTdHJpbmcgPSBcIlNEXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmxvY2tlZFxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIiN7QGdyaWRbaV1bal0udmFsdWV9XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIjBcIlxuICAgIHJldHVybiBleHBvcnRTdHJpbmdcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgQGNsZWFyKClcblxuICAgIGluZGV4ID0gMFxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcbiAgICAgICAgaW5kZXggKz0gMVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IHZcblxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuICAgIHJldHVybiB0cnVlXG5cbiAgdXBkYXRlQ2VsbDogKHgsIHkpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiB4ICE9IGlcbiAgICAgICAgdiA9IEBncmlkW2ldW3ldLnZhbHVlXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICBAZ3JpZFtpXVt5XS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG5cbiAgICAgIGlmIHkgIT0gaVxuICAgICAgICB2ID0gQGdyaWRbeF1baV0udmFsdWVcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgIEBncmlkW3hdW2ldLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcblxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcbiAgICAgICAgICB2ID0gQGdyaWRbc3ggKyBpXVtzeSArIGpdLnZhbHVlXG4gICAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgICBAZ3JpZFtzeCArIGldW3N5ICsgal0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG4gICAgcmV0dXJuXG5cbiAgdXBkYXRlQ2VsbHM6IC0+XG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAZ3JpZFtpXVtqXS5lcnJvciA9IGZhbHNlXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIEB1cGRhdGVDZWxsKGksIGopXG5cbiAgICBAc29sdmVkID0gdHJ1ZVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0uZXJyb3JcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgPT0gMFxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxuXG4gICAgIyBpZiBAc29sdmVkXG4gICAgIyAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxuXG4gICAgcmV0dXJuIEBzb2x2ZWRcblxuICBkb25lOiAtPlxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxuICAgICAgICAgIGNvdW50c1tAZ3JpZFtpXVtqXS52YWx1ZS0xXSArPSAxXG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiBjb3VudHNbaV0gPT0gOVxuICAgICAgICBkW2ldID0gdHJ1ZVxuICAgIHJldHVybiBkXG5cbiAgcGVuY2lsU3RyaW5nOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBzID0gXCJcIlxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXG4gICAgICAgIHMgKz0gU3RyaW5nKGkrMSlcbiAgICByZXR1cm4gc1xuXG4gIGNsZWFyUGVuY2lsOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgY2VsbC5wZW5jaWxbaV0gPSBmYWxzZVxuICAgIEBzYXZlKClcblxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBjZWxsLnBlbmNpbFt2LTFdID0gIWNlbGwucGVuY2lsW3YtMV1cbiAgICBAc2F2ZSgpXG5cbiAgc2V0VmFsdWU6ICh4LCB5LCB2KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBjZWxsLnZhbHVlID0gdlxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuXG4gIHJlc2V0OiAtPlxuICAgIGNvbnNvbGUubG9nIFwicmVzZXQoKVwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgaWYgbm90IGNlbGwubG9ja2VkXG4gICAgICAgICAgY2VsbC52YWx1ZSA9IDBcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXG4gICAgQGhpZ2hsaWdodFggPSAtMVxuICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIEBzYXZlKClcblxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cbiAgICBjb25zb2xlLmxvZyBcIm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGNlbGwudmFsdWUgPSAwXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxuICAgICAgICBjZWxsLmxvY2tlZCA9IGZhbHNlXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXG5cbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yKClcbiAgICBuZXdHcmlkID0gZ2VuZXJhdG9yLmdlbmVyYXRlKGRpZmZpY3VsdHkpXG4gICAgIyBjb25zb2xlLmxvZyBcIm5ld0dyaWRcIiwgbmV3R3JpZFxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgbmV3R3JpZFtpXVtqXSAhPSAwXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSBuZXdHcmlkW2ldW2pdXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuXG4gIGxvYWQ6IC0+XG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVwiKVxuICAgIGlmIGpzb25TdHJpbmcgPT0gbnVsbFxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAjIGNvbnNvbGUubG9nIGpzb25TdHJpbmdcbiAgICBnYW1lRGF0YSA9IEpTT04ucGFyc2UoanNvblN0cmluZylcbiAgICAjIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgc3JjID0gZ2FtZURhdGEuZ3JpZFtpXVtqXVxuICAgICAgICBkc3QgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxuICAgICAgICBkc3QuZXJyb3IgPSBpZiBzcmMuZSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgZHN0LmxvY2tlZCA9IGlmIHNyYy5sID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgZHN0LnBlbmNpbFtrXSA9IGlmIHNyYy5wW2tdID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBnYW1lLlwiXG4gICAgcmV0dXJuIHRydWVcblxuICBzYXZlOiAtPlxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgZ2FtZURhdGEgPVxuICAgICAgZ3JpZDogbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGdhbWVEYXRhLmdyaWRbaV1bal0gPVxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcbiAgICAgICAgICBlOiBpZiBjZWxsLmVycm9yIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICBsOiBpZiBjZWxsLmxvY2tlZCB0aGVuIDEgZWxzZSAwXG4gICAgICAgICAgcDogW11cbiAgICAgICAgZHN0ID0gZ2FtZURhdGEuZ3JpZFtpXVtqXS5wXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxuXG4gICAganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGdhbWVEYXRhKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcbiAgICByZXR1cm4gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcbiIsInNodWZmbGUgPSAoYSkgLT5cbiAgICBpID0gYS5sZW5ndGhcbiAgICB3aGlsZSAtLWkgPiAwXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcbiAgICAgICAgdCA9IGFbal1cbiAgICAgICAgYVtqXSA9IGFbaV1cbiAgICAgICAgYVtpXSA9IHRcbiAgICByZXR1cm4gYVxuXG5jbGFzcyBCb2FyZFxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxuICAgIEBsb2NrZWRDb3VudCA9IDA7XG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcbiAgICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXG4gICAgICAgICAgQGxvY2soaSwgaiwgb3RoZXJCb2FyZC5sb2NrZWRbaV1bal0pXG4gICAgcmV0dXJuXG5cbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cbiAgICBpZiB2XG4gICAgICBAbG9ja2VkQ291bnQgKz0gMSBpZiBub3QgQGxvY2tlZFt4XVt5XVxuICAgIGVsc2VcbiAgICAgIEBsb2NrZWRDb3VudCAtPSAxIGlmIEBsb2NrZWRbeF1beV1cbiAgICBAbG9ja2VkW3hdW3ldID0gdjtcblxuXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcbiAgQGRpZmZpY3VsdHk6XG4gICAgZWFzeTogMVxuICAgIG1lZGl1bTogMlxuICAgIGhhcmQ6IDNcbiAgICBleHRyZW1lOiA0XG5cbiAgY29uc3RydWN0b3I6IC0+XG5cbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXG4gICAgcmV0dXJuIG5ld0JvYXJkXG5cbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICByZXR1cm4gYm9hcmQuZ3JpZFt4XVt5XSA9PSB2XG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxuICAgIG1hcmtzID0gW11cbiAgICBmb3IgdiBpbiBbMS4uOV1cbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXG4gICAgICAgIG1hcmtzLnB1c2ggdlxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcbiAgICAgIHNodWZmbGUobWFya3MpXG4gICAgcmV0dXJuIG1hcmtzXG5cbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXG5cbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXG4gICAgICB4ID0gaW5kZXggJSA5XG4gICAgICB5ID0gaW5kZXggLy8gOVxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoaW5kZXgpXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxuXG4gICAgIyBza2lwIGNlbGxzIHRoYXQgYXJlIGFscmVhZHkgYmVpbmcgdHJpZWRcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxuICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXG5cbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxuXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXG4gICAgZm9yIGluZGV4IGluIHJlbWFpbmluZ0luZGV4ZXNcbiAgICAgIHggPSBpbmRleCAlIDlcbiAgICAgIHkgPSBpbmRleCAvLyA5XG4gICAgICBtYXJrcyA9IEBwZW5jaWxNYXJrcyhib2FyZCwgeCwgeSlcblxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXG4gICAgICByZXR1cm4gbnVsbCBpZiBtYXJrcy5sZW5ndGggPT0gMFxuXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcbiAgICAgIHJldHVybiB7IGluZGV4OiBpbmRleCwgcmVtYWluaW5nOiBtYXJrcyB9IGlmIG1hcmtzLmxlbmd0aCA9PSAxXG5cbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxuICAgICAgaWYgbWFya3MubGVuZ3RoIDwgZmV3ZXN0TWFya3MubGVuZ3RoXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xuICAgIHJldHVybiB7IGluZGV4OiBmZXdlc3RJbmRleCwgcmVtYWluaW5nOiBmZXdlc3RNYXJrcyB9XG5cbiAgc29sdmU6IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgYXR0ZW1wdHMgPSBbXVxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxuXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgIGF0dGVtcHRzID0gW11cblxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBmYWxzZSBpZiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKSA9PSBudWxsXG5cbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcblxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcblxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxuXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxuXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxuICAgICAgZWxzZVxuICAgICAgICB3YWxrSW5kZXggLT0gMVxuXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gc29sdmVkXG5cbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxuICAgICMgaGFja1xuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxuXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcbiAgICByZW1vdmVkID0gMFxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcblxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXG5cbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXG4gICAgICAgIHJlbW92ZWQgKz0gMVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxuICAgICAgZWxzZVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcblxuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogYm9hcmRcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICB9XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxuXG4gICAgYmVzdCA9IG51bGxcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBpZiBiZXN0ID09IG51bGxcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG5cbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxuXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGJvYXJkID0gbmV3IEJvYXJkKClcblxuICAgIGluZGV4ID0gMFxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcbiAgICAgICAgaW5kZXggKz0gMVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGJvYXJkLmdyaWRbal1baV0gPSB2XG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxuXG4gICAgc29sdmVkID0gQHNvbHZlKGJvYXJkKVxuICAgIGlmIHNvbHZlZCA9PSBudWxsXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IEJvYXJkIHNvbHZlIG5vdCB1bmlxdWUuXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgYW5zd2VyU3RyaW5nID0gXCJcIlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYW5zd2VyU3RyaW5nICs9IFwiI3tzb2x2ZWQuZ3JpZFtqXVtpXX0gXCJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXG5cbiAgICByZXR1cm4gYW5zd2VyU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcblN1ZG9rdUdhbWUgPSByZXF1aXJlICcuL1N1ZG9rdUdhbWUnXG5cblBFTl9QT1NfWCA9IDFcblBFTl9QT1NfWSA9IDEwXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXG5QRU5fQ0xFQVJfUE9TX1kgPSAxM1xuXG5QRU5DSUxfUE9TX1ggPSA1XG5QRU5DSUxfUE9TX1kgPSAxMFxuUEVOQ0lMX0NMRUFSX1BPU19YID0gNlxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcblxuTUVOVV9QT1NfWCA9IDRcbk1FTlVfUE9TX1kgPSAxM1xuXG5NT0RFX1BPU19YID0gNFxuTU9ERV9QT1NfWSA9IDlcblxuQ29sb3IgPVxuICB2YWx1ZTogXCJibGFja1wiXG4gIHBlbmNpbDogXCIjMDAwMGZmXCJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXG4gIGRvbmU6IFwiI2NjY2NjY1wiXG4gIG5ld0dhbWU6IFwiIzAwODgzM1wiXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcbiAgYmFja2dyb3VuZExvY2tlZDogXCIjZWVlZWVlXCJcbiAgYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWQ6IFwiI2ZmZmZlZVwiXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcbiAgYmFja2dyb3VuZENvbmZsaWN0ZWQ6IFwiI2ZmZmZkZFwiXG4gIGJhY2tncm91bmRFcnJvcjogXCIjZmZkZGRkXCJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcbiAgbW9kZVBlbjogXCIjMDAwMDAwXCJcbiAgbW9kZVBlbmNpbDogXCIjMDAwMGZmXCJcblxuQWN0aW9uVHlwZSA9XG4gIFNFTEVDVDogMFxuICBQRU5DSUw6IDFcbiAgVkFMVUU6IDJcbiAgTkVXR0FNRTogM1xuXG5jbGFzcyBTdWRva3VWaWV3XG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIEluaXRcblxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcblxuICAgIHdpZHRoQmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMud2lkdGggLyA5XG4gICAgaGVpZ2h0QmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMuaGVpZ2h0IC8gMTRcbiAgICBjb25zb2xlLmxvZyBcIndpZHRoQmFzZWRDZWxsU2l6ZSAje3dpZHRoQmFzZWRDZWxsU2l6ZX0gaGVpZ2h0QmFzZWRDZWxsU2l6ZSAje2hlaWdodEJhc2VkQ2VsbFNpemV9XCJcbiAgICBAY2VsbFNpemUgPSBNYXRoLm1pbih3aWR0aEJhc2VkQ2VsbFNpemUsIGhlaWdodEJhc2VkQ2VsbFNpemUpXG5cbiAgICAjIGNhbGMgcmVuZGVyIGNvbnN0YW50c1xuICAgIEBsaW5lV2lkdGhUaGluID0gMVxuICAgIEBsaW5lV2lkdGhUaGljayA9IE1hdGgubWF4KEBjZWxsU2l6ZSAvIDIwLCAzKVxuXG4gICAgZm9udFBpeGVsc1MgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuMylcbiAgICBmb250UGl4ZWxzTSA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC41KVxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXG5cbiAgICAjIGluaXQgZm9udHNcbiAgICBAZm9udHMgPVxuICAgICAgcGVuY2lsOiAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5jaWxcIiwgIFwiI3tmb250UGl4ZWxzU31weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICAgIG5ld2dhbWU6IEBhcHAucmVnaXN0ZXJGb250KFwibmV3Z2FtZVwiLCBcIiN7Zm9udFBpeGVsc019cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQGluaXRBY3Rpb25zKClcblxuICAgICMgaW5pdCBzdGF0ZVxuICAgIEBnYW1lID0gbmV3IFN1ZG9rdUdhbWUoKVxuICAgIEBwZW5WYWx1ZSA9IDBcbiAgICBAaXNQZW5jaWwgPSBmYWxzZVxuICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXG5cbiAgICBAZHJhdygpXG5cbiAgaW5pdEFjdGlvbnM6IC0+XG4gICAgQGFjdGlvbnMgPSBuZXcgQXJyYXkoOSAqIDE1KS5maWxsKG51bGwpXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlNFTEVDVCwgeDogaSwgeTogaiB9XG5cbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGluZGV4ID0gKChQRU5fUE9TX1kgKyBqKSAqIDkpICsgKFBFTl9QT1NfWCArIGkpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5WQUxVRSwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cblxuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaW5kZXggPSAoKFBFTkNJTF9QT1NfWSArIGopICogOSkgKyAoUEVOQ0lMX1BPU19YICsgaSlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cblxuICAgICMgVmFsdWUgY2xlYXIgYnV0dG9uXG4gICAgaW5kZXggPSAoUEVOX0NMRUFSX1BPU19ZICogOSkgKyBQRU5fQ0xFQVJfUE9TX1hcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEwLCB5OiAwIH1cblxuICAgICMgUGVuY2lsIGNsZWFyIGJ1dHRvblxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgeDogMTAsIHk6IDAgfVxuXG4gICAgIyBOZXcgR2FtZSBidXR0b25cbiAgICBpbmRleCA9IChNRU5VX1BPU19ZICogOSkgKyBNRU5VX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk5FV0dBTUUsIHg6IDAsIHk6IDAgfVxuXG4gICAgcmV0dXJuXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgUmVuZGVyaW5nXG5cbiAgZHJhd0NlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIHMsIGZvbnQsIGNvbG9yKSAtPlxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxuICAgIHB5ID0geSAqIEBjZWxsU2l6ZVxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQocywgcHggKyAoQGNlbGxTaXplIC8gMiksIHB5ICsgKEBjZWxsU2l6ZSAvIDIpLCBmb250LCBjb2xvcilcblxuICBkcmF3R3JpZDogKG9yaWdpblgsIG9yaWdpblksIHNpemUsIHNvbHZlZCA9IGZhbHNlKSAtPlxuICAgIGZvciBpIGluIFswLi5zaXplXVxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcbiAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGluXG4gICAgICBpZiAoKHNpemUgPT0gMSkgfHwgKGkgJSAzKSA9PSAwKVxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcblxuICAgICAgIyBIb3Jpem9udGFsIGxpbmVzXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXG5cbiAgICAgICMgVmVydGljYWwgbGluZXNcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcblxuICAgIHJldHVyblxuXG4gIGRyYXc6IC0+XG4gICAgY29uc29sZS5sb2cgXCJkcmF3KClcIlxuXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcImJsYWNrXCIpXG5cbiAgICAjIE1ha2Ugd2hpdGUgcGhvbmUtc2hhcGVkIGJhY2tncm91bmRcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjZWxsU2l6ZSAqIDksIEBjYW52YXMuaGVpZ2h0LCBcIndoaXRlXCIpXG5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXG5cbiAgICAgICAgYmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBmb250ID0gQGZvbnRzLnBlblxuICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci52YWx1ZVxuICAgICAgICB0ZXh0ID0gXCJcIlxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcbiAgICAgICAgICBmb250ID0gQGZvbnRzLnBlbmNpbFxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnBlbmNpbFxuICAgICAgICAgIHRleHQgPSBAZ2FtZS5wZW5jaWxTdHJpbmcoaSwgailcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGNlbGwudmFsdWUgPiAwXG4gICAgICAgICAgICB0ZXh0ID0gU3RyaW5nKGNlbGwudmFsdWUpXG5cbiAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXG5cbiAgICAgICAgaWYgKEBoaWdobGlnaHRYICE9IC0xKSAmJiAoQGhpZ2hsaWdodFkgIT0gLTEpXG4gICAgICAgICAgaWYgKGkgPT0gQGhpZ2hsaWdodFgpICYmIChqID09IEBoaWdobGlnaHRZKVxuICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICAgIGVsc2UgaWYgQGNvbmZsaWN0cyhpLCBqLCBAaGlnaGxpZ2h0WCwgQGhpZ2hsaWdodFkpXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kQ29uZmxpY3RlZFxuXG4gICAgICAgIGlmIGNlbGwuZXJyb3JcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5lcnJvclxuXG4gICAgICAgIEBkcmF3Q2VsbChpLCBqLCBiYWNrZ3JvdW5kQ29sb3IsIHRleHQsIGZvbnQsIHRleHRDb2xvcilcblxuICAgIGRvbmUgPSBAZ2FtZS5kb25lKClcbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGN1cnJlbnRWYWx1ZSA9IChqICogMykgKyBpICsgMVxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxuICAgICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IuZG9uZVxuXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcbiAgICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG5cbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXG5cbiAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgaWYgQHBlblZhbHVlID09IDEwXG4gICAgICAgIGlmIEBpc1BlbmNpbFxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG5cbiAgICBAZHJhd0NlbGwoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIHZhbHVlQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXG4gICAgQGRyYXdDZWxsKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcblxuICAgIGlmIEBwZW5WYWx1ZSA9PSAwXG4gICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlU2VsZWN0XG4gICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcbiAgICBlbHNlXG4gICAgICBtb2RlQ29sb3IgPSBpZiBAaXNQZW5jaWwgdGhlbiBDb2xvci5tb2RlUGVuY2lsIGVsc2UgQ29sb3IubW9kZVBlblxuICAgICAgbW9kZVRleHQgPSBpZiBAaXNQZW5jaWwgdGhlbiBcIlBlbmNpbFwiIGVsc2UgXCJQZW5cIlxuICAgIEBkcmF3Q2VsbChNT0RFX1BPU19YLCBNT0RFX1BPU19ZLCBudWxsLCBtb2RlVGV4dCwgQGZvbnRzLm5ld2dhbWUsIG1vZGVDb2xvcilcblxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm5ld2dhbWUsIENvbG9yLm5ld0dhbWUpXG5cbiAgICAjIE1ha2UgdGhlIGdyaWRzXG4gICAgQGRyYXdHcmlkKDAsIDAsIDksIEBnYW1lLnNvbHZlZClcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9QT1NfWCwgUEVOQ0lMX1BPU19ZLCAzKVxuICAgIEBkcmF3R3JpZChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgMSlcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSW5wdXRcblxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cbiAgICBjb25zb2xlLmxvZyBcIlN1ZG9rdVZpZXcubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG4gICAgQGdhbWUubmV3R2FtZShkaWZmaWN1bHR5KVxuXG4gIHJlc2V0OiAtPlxuICAgIEBnYW1lLnJlc2V0KClcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgcmV0dXJuIEBnYW1lLmltcG9ydChpbXBvcnRTdHJpbmcpXG5cbiAgZXhwb3J0OiAtPlxuICAgIHJldHVybiBAZ2FtZS5leHBvcnQoKVxuXG4gIGhvbGVDb3VudDogLT5cbiAgICByZXR1cm4gQGdhbWUuaG9sZUNvdW50KClcblxuICBjbGljazogKHgsIHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImNsaWNrICN7eH0sICN7eX1cIlxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcblxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcbiAgICAgICAgaW5kZXggPSAoeSAqIDkpICsgeFxuICAgICAgICBhY3Rpb24gPSBAYWN0aW9uc1tpbmRleF1cbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIkFjdGlvbjogXCIsIGFjdGlvblxuICAgICAgICAgIHN3aXRjaCBhY3Rpb24udHlwZVxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlNFTEVDVFxuICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMFxuICAgICAgICAgICAgICAgIGlmIChAaGlnaGxpZ2h0WCA9PSBhY3Rpb24ueCkgJiYgKEBoaWdobGlnaHRZID09IGFjdGlvbi55KVxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gYWN0aW9uLnhcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRZID0gYWN0aW9uLnlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlmIEBpc1BlbmNpbFxuICAgICAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IDEwXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLmNsZWFyUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSlcbiAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUudG9nZ2xlUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIDApXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxuXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUEVOQ0lMXG4gICAgICAgICAgICAgIGlmIEBpc1BlbmNpbCBhbmQgIChAcGVuVmFsdWUgPT0gYWN0aW9uLngpXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gMFxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGlzUGVuY2lsID0gdHJ1ZVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XG5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5WQUxVRVxuICAgICAgICAgICAgICBpZiBub3QgQGlzUGVuY2lsIGFuZCAoQHBlblZhbHVlID09IGFjdGlvbi54KVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IDBcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBpc1BlbmNpbCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnhcblxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLk5FV0dBTUVcbiAgICAgICAgICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwibWVudVwiKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgbm8gYWN0aW9uXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgICBAcGVuVmFsdWUgPSAwXG4gICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcblxuICAgICAgICBAZHJhdygpXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSGVscGVyc1xuXG4gIGNvbmZsaWN0czogKHgxLCB5MSwgeDIsIHkyKSAtPlxuICAgICMgc2FtZSByb3cgb3IgY29sdW1uP1xuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgICMgc2FtZSBzZWN0aW9uP1xuICAgIHN4MSA9IE1hdGguZmxvb3IoeDEgLyAzKSAqIDNcbiAgICBzeTEgPSBNYXRoLmZsb29yKHkxIC8gMykgKiAzXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xuICAgIHN5MiA9IE1hdGguZmxvb3IoeTIgLyAzKSAqIDNcbiAgICBpZiAoc3gxID09IHN4MikgJiYgKHN5MSA9PSBzeTIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXG5cbmluaXQgPSAtPlxuICBjb25zb2xlLmxvZyBcImluaXRcIlxuICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShjYW52YXMsIGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXSlcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gIHdpbmRvdy5hcHAgPSBuZXcgQXBwKGNhbnZhcylcblxuICAjIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cbiAgIyAgIGNvbnNvbGUubG9nIE9iamVjdC5rZXlzKGUudG91Y2hlc1swXSlcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAjICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgIyAgIHdpbmRvdy5hcHAuY2xpY2soeCwgeSlcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxuICAgIGluaXQoKVxuLCBmYWxzZSlcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuOVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
