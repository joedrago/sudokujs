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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL0ZvbnRGYWNlT2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVKO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBNEIsSUFBQyxDQUFBLGlCQUFGLEdBQW9CLHVCQUEvQztJQUVmLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUN4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QVEsQ0FBQyxlQUFlLENBQUM7RUFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFkLENBQTJCLE1BQTNCLEVBQW1DLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFBLENBQUEsQ0FBNUQ7RUFDQSxVQUFBLEdBQWEsTUFBTSxDQUFDLHFCQUFQLENBQUE7RUFFYixNQUFNLENBQUMsR0FBUCxHQUFhLElBQUksR0FBSixDQUFRLE1BQVI7U0FRYixNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBQyxDQUFEO0FBQ25DLFFBQUE7SUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO1dBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWCxDQUFpQixDQUFqQixFQUFvQixDQUFwQjtFQUhtQyxDQUFyQztBQWhCSzs7QUFxQlAsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsQ0FBRDtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGOzs7O0FDdkJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDQWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnRm9udEZhY2VPYnNlcnZlcidcblxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xuU3Vkb2t1VmlldyA9IHJlcXVpcmUgJy4vU3Vkb2t1VmlldydcbnZlcnNpb24gPSByZXF1aXJlICcuL3ZlcnNpb24nXG5cbmNsYXNzIEFwcFxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxuICAgIEBmb250cyA9IHt9XG5cbiAgICBAdmVyc2lvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQGdlbmVyYXRpbmdGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDQpXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEB2aWV3cyA9XG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIG1lYXN1cmVGb250czogLT5cbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXG4gICAgICBAY3R4LmZvbnQgPSBmLnN0eWxlXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgICBmLmhlaWdodCA9IE1hdGguZmxvb3IoQGN0eC5tZWFzdXJlVGV4dChcIm1cIikud2lkdGggKiAxLjEpICMgYmVzdCBoYWNrIGV2ZXJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxuICAgIHJldHVyblxuXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxuICAgIGZvbnQgPVxuICAgICAgbmFtZTogbmFtZVxuICAgICAgc3R5bGU6IHN0eWxlXG4gICAgICBoZWlnaHQ6IDBcbiAgICBAZm9udHNbbmFtZV0gPSBmb250XG4gICAgQG1lYXN1cmVGb250cygpXG4gICAgcmV0dXJuIGZvbnRcblxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcbiAgICBmb250LmxvYWQoKS50aGVuID0+XG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXG4gICAgICBAbWVhc3VyZUZvbnRzKClcbiAgICAgIEBkcmF3KClcblxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cbiAgICBAdmlldyA9IEB2aWV3c1t2aWV3XVxuICAgIEBkcmF3KClcblxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuXG4gICAgIyBAZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzQ0NDQ0NFwiKVxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgIyB3aW5kb3cuc2V0VGltZW91dCA9PlxuICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG4gICAgIyAsIDBcblxuICByZXNldDogLT5cbiAgICBAdmlld3Muc3Vkb2t1LnJlc2V0KClcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxuXG4gIGhvbGVDb3VudDogLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxuXG4gIGRyYXc6IC0+XG4gICAgQHZpZXcuZHJhdygpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXG5cbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHguZmlsbCgpXG5cbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXG4gICAgICBAY3R4LmZpbGwoKVxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxuICAgICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxuICBAYmVnaW5QYXRoKClcbiAgQG1vdmVUbyh4K3IsIHkpXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXG4gIEBjbG9zZVBhdGgoKVxuICByZXR1cm4gdGhpc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbkJVVFRPTl9IRUlHSFQgPSAwLjA2XG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcblxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcbiAgaWYgaW5kZXggPiAzXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIGlmIGluZGV4ID4gNFxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDZcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgcmV0dXJuIHlcblxuY2xhc3MgTWVudVZpZXdcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIEBidXR0b25zID1cbiAgICAgIG5ld0Vhc3k6XG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxuICAgICAgbmV3TWVkaXVtOlxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3NzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXG4gICAgICBuZXdIYXJkOlxuICAgICAgICB5OiBidXR0b25Qb3MoMilcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzMzM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcbiAgICAgIG5ld0V4dHJlbWU6XG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzcxMTExXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxuICAgICAgcmVzZXQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzM3N1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXG4gICAgICBpbXBvcnQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXG4gICAgICBleHBvcnQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxuICAgICAgcmVzdW1lOlxuICAgICAgICB5OiBidXR0b25Qb3MoNylcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcblxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgYnV0dG9uLnggPSBidXR0b25YXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxuXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA2KVxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHN1YnRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxuICAgIEBzdWJ0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7c3VidGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHJldHVyblxuXG4gIGRyYXc6IC0+XG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXG5cbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDA1XG5cbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxuICAgIHkyID0geTEgKyBAY2FudmFzLmhlaWdodCAqIDAuMDZcbiAgICB5MyA9IHkyICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkl0J3MgbGlrZSBTdWRva3UsIGJ1dCB5b3UgYXJlIHRoZSBiYWQgZ3V5LlwiLCB4LCB5MywgQHN1YnRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXG5cbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCArIHNoYWRvd09mZnNldCwgYnV0dG9uLnkgKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIFwiYmxhY2tcIiwgXCJibGFja1wiKVxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxuXG4gICAgQGFwcC5kcmF3TG93ZXJMZWZ0KFwiI3tAYXBwLmhvbGVDb3VudCgpfS84MVwiKVxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxuXG4gIGNsaWNrOiAoeCwgeSkgLT5cbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxuICAgICAgICBidXR0b24uY2xpY2soKVxuICAgIHJldHVyblxuXG4gIG5ld0Vhc3k6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXG5cbiAgbmV3TWVkaXVtOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXG5cbiAgbmV3SGFyZDogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcblxuICBuZXdFeHRyZW1lOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lKVxuXG4gIHJlc2V0OiAtPlxuICAgIEBhcHAucmVzZXQoKVxuXG4gIHJlc3VtZTogLT5cbiAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBleHBvcnQ6IC0+XG4gICAgaWYgbmF2aWdhdG9yLnNoYXJlICE9IHVuZGVmaW5lZFxuICAgICAgbmF2aWdhdG9yLnNoYXJlIHtcbiAgICAgICAgdGl0bGU6IFwiU3Vkb2t1IFNoYXJlZCBHYW1lXCJcbiAgICAgICAgdGV4dDogQGFwcC5leHBvcnQoKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgd2luZG93LnByb21wdChcIkNvcHkgdGhpcyBhbmQgcGFzdGUgdG8gYSBmcmllbmQ6XCIsIEBhcHAuZXhwb3J0KCkpXG5cbiAgaW1wb3J0OiAtPlxuICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJQYXN0ZSBhbiBleHBvcnRlZCBnYW1lIGhlcmU6XCIsIFwiXCIpXG4gICAgaWYgaW1wb3J0U3RyaW5nID09IG51bGxcbiAgICAgIHJldHVyblxuICAgIGlmIEBhcHAuaW1wb3J0KGltcG9ydFN0cmluZylcbiAgICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3XG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcblxuY2xhc3MgU3Vkb2t1R2FtZVxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAY2xlYXIoKVxuICAgIGlmIG5vdCBAbG9hZCgpXG4gICAgICBAbmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxuICAgIHJldHVyblxuXG4gIGNsZWFyOiAtPlxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAZ3JpZFtpXVtqXSA9XG4gICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICBlcnJvcjogZmFsc2VcbiAgICAgICAgICBsb2NrZWQ6IGZhbHNlXG4gICAgICAgICAgcGVuY2lsOiBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcblxuICAgIEBzb2x2ZWQgPSBmYWxzZVxuXG4gIGhvbGVDb3VudDogLT5cbiAgICBjb3VudCA9IDBcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIG5vdCBAZ3JpZFtpXVtqXS5sb2NrZWRcbiAgICAgICAgICBjb3VudCArPSAxXG4gICAgcmV0dXJuIGNvdW50XG5cbiAgZXhwb3J0OiAtPlxuICAgIGV4cG9ydFN0cmluZyA9IFwiU0RcIlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0ubG9ja2VkXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiI3tAZ3JpZFtpXVtqXS52YWx1ZX1cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiMFwiXG4gICAgcmV0dXJuIGV4cG9ydFN0cmluZ1xuXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBAY2xlYXIoKVxuXG4gICAgaW5kZXggPSAwXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxuICAgICAgICBpbmRleCArPSAxXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gdlxuXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG4gICAgcmV0dXJuIHRydWVcblxuICB1cGRhdGVDZWxsOiAoeCwgeSkgLT5cbiAgICBjZWxsID0gQGdyaWRbeF1beV1cblxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmIHggIT0gaVxuICAgICAgICB2ID0gQGdyaWRbaV1beV0udmFsdWVcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgIEBncmlkW2ldW3ldLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcblxuICAgICAgaWYgeSAhPSBpXG4gICAgICAgIHYgPSBAZ3JpZFt4XVtpXS52YWx1ZVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgQGdyaWRbeF1baV0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxuICAgICAgICAgIHYgPSBAZ3JpZFtzeCArIGldW3N5ICsgal0udmFsdWVcbiAgICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICAgIEBncmlkW3N4ICsgaV1bc3kgKyBqXS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcbiAgICByZXR1cm5cblxuICB1cGRhdGVDZWxsczogLT5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIEBncmlkW2ldW2pdLmVycm9yID0gZmFsc2VcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgailcblxuICAgIEBzb2x2ZWQgPSB0cnVlXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5lcnJvclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSA9PSAwXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXG5cbiAgICAjIGlmIEBzb2x2ZWRcbiAgICAjICAgY29uc29sZS5sb2cgXCJzb2x2ZWQgI3tAc29sdmVkfVwiXG5cbiAgICByZXR1cm4gQHNvbHZlZFxuXG4gIGRvbmU6IC0+XG4gICAgZCA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxuICAgIGNvdW50cyA9IG5ldyBBcnJheSg5KS5maWxsKDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSAhPSAwXG4gICAgICAgICAgY291bnRzW0BncmlkW2ldW2pdLnZhbHVlLTFdICs9IDFcblxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmIGNvdW50c1tpXSA9PSA5XG4gICAgICAgIGRbaV0gPSB0cnVlXG4gICAgcmV0dXJuIGRcblxuICBwZW5jaWxTdHJpbmc6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIHMgPSBcIlwiXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgY2VsbC5wZW5jaWxbaV1cbiAgICAgICAgcyArPSBTdHJpbmcoaSsxKVxuICAgIHJldHVybiBzXG5cbiAgY2xlYXJQZW5jaWw6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICByZXR1cm5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBjZWxsLnBlbmNpbFtpXSA9IGZhbHNlXG4gICAgQHNhdmUoKVxuXG4gIHRvZ2dsZVBlbmNpbDogKHgsIHksIHYpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIGNlbGwucGVuY2lsW3YtMV0gPSAhY2VsbC5wZW5jaWxbdi0xXVxuICAgIEBzYXZlKClcblxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIGNlbGwudmFsdWUgPSB2XG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgcmVzZXQ6IC0+XG4gICAgY29uc29sZS5sb2cgXCJyZXNldCgpXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBpZiBub3QgY2VsbC5sb2NrZWRcbiAgICAgICAgICBjZWxsLnZhbHVlID0gMFxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgY2VsbC52YWx1ZSA9IDBcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcblxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3IoKVxuICAgIG5ld0dyaWQgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoZGlmZmljdWx0eSlcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IG5ld0dyaWRbaV1bal1cbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgbG9hZDogLT5cbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBqc29uU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lXCIpXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xuICAgIGdhbWVEYXRhID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxuICAgICMgY29uc29sZS5sb2cgXCJmb3VuZCBnYW1lRGF0YVwiLCBnYW1lRGF0YVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXG4gICAgICAgIGRzdCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGRzdC52YWx1ZSA9IHNyYy52XG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICBkc3QubG9ja2VkID0gaWYgc3JjLmwgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHNhdmU6IC0+XG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBnYW1lRGF0YSA9XG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGdhbWVEYXRhLmdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgZ2FtZURhdGEuZ3JpZFtpXVtqXSA9XG4gICAgICAgICAgdjogY2VsbC52YWx1ZVxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxuICAgICAgICAgIGw6IGlmIGNlbGwubG9ja2VkIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICBwOiBbXVxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGRzdC5wdXNoKGlmIGNlbGwucGVuY2lsW2tdIHRoZW4gMSBlbHNlIDApXG5cbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lXCIsIGpzb25TdHJpbmcpXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxuICAgIHJldHVybiB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxuIiwic2h1ZmZsZSA9IChhKSAtPlxuICAgIGkgPSBhLmxlbmd0aFxuICAgIHdoaWxlIC0taSA+IDBcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxuICAgICAgICB0ID0gYVtqXVxuICAgICAgICBhW2pdID0gYVtpXVxuICAgICAgICBhW2ldID0gdFxuICAgIHJldHVybiBhXG5cbmNsYXNzIEJvYXJkXG4gIGNvbnN0cnVjdG9yOiAob3RoZXJCb2FyZCA9IG51bGwpIC0+XG4gICAgQGxvY2tlZENvdW50ID0gMDtcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxuICAgICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICBAbG9jayhpLCBqLCBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXSlcbiAgICByZXR1cm5cblxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgbG9jazogKHgsIHksIHYgPSB0cnVlKSAtPlxuICAgIGlmIHZcbiAgICAgIEBsb2NrZWRDb3VudCArPSAxIGlmIG5vdCBAbG9ja2VkW3hdW3ldXG4gICAgZWxzZVxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxuICAgIEBsb2NrZWRbeF1beV0gPSB2O1xuXG5cbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxuICBAZGlmZmljdWx0eTpcbiAgICBlYXN5OiAxXG4gICAgbWVkaXVtOiAyXG4gICAgaGFyZDogM1xuICAgIGV4dHJlbWU6IDRcblxuICBjb25zdHJ1Y3RvcjogLT5cblxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cbiAgICByZXR1cm4gbmV3Qm9hcmRcblxuICBjZWxsVmFsaWQ6IChib2FyZCwgeCwgeSwgdikgLT5cbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgIHJldHVybiBib2FyZC5ncmlkW3hdW3ldID09IHZcblxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxuICAgICAgcmV0dXJuIFsgYm9hcmQuZ3JpZFt4XVt5XSBdXG4gICAgbWFya3MgPSBbXVxuICAgIGZvciB2IGluIFsxLi45XVxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcbiAgICAgICAgbWFya3MucHVzaCB2XG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxuICAgICAgc2h1ZmZsZShtYXJrcylcbiAgICByZXR1cm4gbWFya3NcblxuICBuZXh0QXR0ZW1wdDogKGJvYXJkLCBhdHRlbXB0cykgLT5cbiAgICByZW1haW5pbmdJbmRleGVzID0gWzAuLi44MV1cblxuICAgICMgc2tpcCBsb2NrZWQgY2VsbHNcbiAgICBmb3IgaW5kZXggaW4gWzAuLi44MV1cbiAgICAgIHggPSBpbmRleCAlIDlcbiAgICAgIHkgPSBpbmRleCAvLyA5XG4gICAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihpbmRleClcbiAgICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXG5cbiAgICAjIHNraXAgY2VsbHMgdGhhdCBhcmUgYWxyZWFkeSBiZWluZyB0cmllZFxuICAgIGZvciBhIGluIGF0dGVtcHRzXG4gICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGEuaW5kZXgpXG4gICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcblxuICAgIHJldHVybiBudWxsIGlmIHJlbWFpbmluZ0luZGV4ZXMubGVuZ3RoID09IDAgIyBhYm9ydCBpZiB0aGVyZSBhcmUgbm8gY2VsbHMgKHNob3VsZCBuZXZlciBoYXBwZW4pXG5cbiAgICBmZXdlc3RJbmRleCA9IC0xXG4gICAgZmV3ZXN0TWFya3MgPSBbMC4uOV1cbiAgICBmb3IgaW5kZXggaW4gcmVtYWluaW5nSW5kZXhlc1xuICAgICAgeCA9IGluZGV4ICUgOVxuICAgICAgeSA9IGluZGV4IC8vIDlcbiAgICAgIG1hcmtzID0gQHBlbmNpbE1hcmtzKGJvYXJkLCB4LCB5KVxuXG4gICAgICAjIGFib3J0IGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG5vIHBvc3NpYmlsaXRpZXNcbiAgICAgIHJldHVybiBudWxsIGlmIG1hcmtzLmxlbmd0aCA9PSAwXG5cbiAgICAgICMgZG9uZSBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBvbmx5IG9uZSBwb3NzaWJpbGl0eSAoKVxuICAgICAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCByZW1haW5pbmc6IG1hcmtzIH0gaWYgbWFya3MubGVuZ3RoID09IDFcblxuICAgICAgIyByZW1lbWJlciB0aGlzIGNlbGwgaWYgaXQgaGFzIHRoZSBmZXdlc3QgbWFya3Mgc28gZmFyXG4gICAgICBpZiBtYXJrcy5sZW5ndGggPCBmZXdlc3RNYXJrcy5sZW5ndGhcbiAgICAgICAgZmV3ZXN0SW5kZXggPSBpbmRleFxuICAgICAgICBmZXdlc3RNYXJrcyA9IG1hcmtzXG4gICAgcmV0dXJuIHsgaW5kZXg6IGZld2VzdEluZGV4LCByZW1haW5pbmc6IGZld2VzdE1hcmtzIH1cblxuICBzb2x2ZTogKGJvYXJkKSAtPlxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcbiAgICBhdHRlbXB0cyA9IFtdXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpXG5cbiAgaGFzVW5pcXVlU29sdXRpb246IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgYXR0ZW1wdHMgPSBbXVxuXG4gICAgIyBpZiB0aGVyZSBpcyBubyBzb2x1dGlvbiwgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpID09IG51bGxcblxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIDgwIC0gYm9hcmQubG9ja2VkQ291bnQpID09IG51bGxcblxuICBzb2x2ZUludGVybmFsOiAoc29sdmVkLCBhdHRlbXB0cywgd2Fsa0luZGV4ID0gMCkgLT5cbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcbiAgICB3aGlsZSB3YWxrSW5kZXggPCB1bmxvY2tlZENvdW50XG4gICAgICBpZiB3YWxrSW5kZXggPj0gYXR0ZW1wdHMubGVuZ3RoXG4gICAgICAgIGF0dGVtcHQgPSBAbmV4dEF0dGVtcHQoc29sdmVkLCBhdHRlbXB0cylcbiAgICAgICAgYXR0ZW1wdHMucHVzaChhdHRlbXB0KSBpZiBhdHRlbXB0ICE9IG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgYXR0ZW1wdCA9IGF0dGVtcHRzW3dhbGtJbmRleF1cblxuICAgICAgaWYgYXR0ZW1wdCAhPSBudWxsXG4gICAgICAgIHggPSBhdHRlbXB0LmluZGV4ICUgOVxuICAgICAgICB5ID0gYXR0ZW1wdC5pbmRleCAvLyA5XG4gICAgICAgIGlmIGF0dGVtcHQucmVtYWluaW5nLmxlbmd0aCA+IDBcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IGF0dGVtcHQucmVtYWluaW5nLnBvcCgpXG4gICAgICAgICAgd2Fsa0luZGV4ICs9IDFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0dGVtcHRzLnBvcCgpXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXG4gICAgICAgICAgd2Fsa0luZGV4IC09IDFcbiAgICAgIGVsc2VcbiAgICAgICAgd2Fsa0luZGV4IC09IDFcblxuICAgICAgaWYgd2Fsa0luZGV4IDwgMFxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIHNvbHZlZFxuXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcbiAgICAjIGhhY2tcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGJvYXJkLmxvY2soaSwgailcblxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXG4gICAgcmVtb3ZlZCA9IDBcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxuICAgICAgICBicmVha1xuXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXG5cbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXG4gICAgICBuZXh0Qm9hcmQubG9jayhyeCwgcnksIGZhbHNlKVxuXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxuICAgICAgICByZW1vdmVkICs9IDFcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXG5cbiAgICByZXR1cm4ge1xuICAgICAgYm9hcmQ6IGJvYXJkXG4gICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgfVxuXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cblxuICAgIGJlc3QgPSBudWxsXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4yXVxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcbiAgICAgICAgYnJlYWtcblxuICAgICAgaWYgYmVzdCA9PSBudWxsXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxuXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcblxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXG5cbiAgICBpbmRleCA9IDBcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXG4gICAgICAgIGluZGV4ICs9IDFcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxuICAgICAgICAgIGJvYXJkLmxvY2soaiwgaSlcblxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQ2FuJ3QgYmUgc29sdmVkLlwiXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGlmIG5vdCBAaGFzVW5pcXVlU29sdXRpb24oYm9hcmQpXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxuXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xuXG5QRU5fUE9TX1ggPSAxXG5QRU5fUE9TX1kgPSAxMFxuUEVOX0NMRUFSX1BPU19YID0gMlxuUEVOX0NMRUFSX1BPU19ZID0gMTNcblxuUEVOQ0lMX1BPU19YID0gNVxuUEVOQ0lMX1BPU19ZID0gMTBcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcblBFTkNJTF9DTEVBUl9QT1NfWSA9IDEzXG5cbk1FTlVfUE9TX1ggPSA0XG5NRU5VX1BPU19ZID0gMTNcblxuTU9ERV9QT1NfWCA9IDRcbk1PREVfUE9TX1kgPSA5XG5cbkNvbG9yID1cbiAgdmFsdWU6IFwiYmxhY2tcIlxuICBwZW5jaWw6IFwiIzAwMDBmZlwiXG4gIGVycm9yOiBcIiNmZjAwMDBcIlxuICBkb25lOiBcIiNjY2NjY2NcIlxuICBuZXdHYW1lOiBcIiMwMDg4MzNcIlxuICBiYWNrZ3JvdW5kU2VsZWN0ZWQ6IFwiI2VlZWVhYVwiXG4gIGJhY2tncm91bmRMb2NrZWQ6IFwiI2VlZWVlZVwiXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxuICBiYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWQ6IFwiI2VlZWVkZFwiXG4gIGJhY2tncm91bmRDb25mbGljdGVkOiBcIiNmZmZmZGRcIlxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXG4gIG1vZGVTZWxlY3Q6IFwiIzc3Nzc0NFwiXG4gIG1vZGVQZW46IFwiIzAwMDAwMFwiXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXG5cbkFjdGlvblR5cGUgPVxuICBTRUxFQ1Q6IDBcbiAgUEVOQ0lMOiAxXG4gIFZBTFVFOiAyXG4gIE5FV0dBTUU6IDNcblxuY2xhc3MgU3Vkb2t1Vmlld1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBJbml0XG5cbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXG5cbiAgICB3aWR0aEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLndpZHRoIC8gOVxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XG4gICAgY29uc29sZS5sb2cgXCJ3aWR0aEJhc2VkQ2VsbFNpemUgI3t3aWR0aEJhc2VkQ2VsbFNpemV9IGhlaWdodEJhc2VkQ2VsbFNpemUgI3toZWlnaHRCYXNlZENlbGxTaXplfVwiXG4gICAgQGNlbGxTaXplID0gTWF0aC5taW4od2lkdGhCYXNlZENlbGxTaXplLCBoZWlnaHRCYXNlZENlbGxTaXplKVxuXG4gICAgIyBjYWxjIHJlbmRlciBjb25zdGFudHNcbiAgICBAbGluZVdpZHRoVGhpbiA9IDFcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcblxuICAgIGZvbnRQaXhlbHNTID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjMpXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcbiAgICBmb250UGl4ZWxzTCA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC44KVxuXG4gICAgIyBpbml0IGZvbnRzXG4gICAgQGZvbnRzID1cbiAgICAgIHBlbmNpbDogIEBhcHAucmVnaXN0ZXJGb250KFwicGVuY2lsXCIsICBcIiN7Zm9udFBpeGVsc1N9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgICBuZXdnYW1lOiBAYXBwLnJlZ2lzdGVyRm9udChcIm5ld2dhbWVcIiwgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgICAgcGVuOiAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5cIiwgICAgIFwiI3tmb250UGl4ZWxzTH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEBpbml0QWN0aW9ucygpXG5cbiAgICAjIGluaXQgc3RhdGVcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcbiAgICBAcGVuVmFsdWUgPSAwXG4gICAgQGlzUGVuY2lsID0gZmFsc2VcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxuXG4gICAgQGRyYXcoKVxuXG4gIGluaXRBY3Rpb25zOiAtPlxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpbmRleCA9IChqICogOSkgKyBpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5TRUxFQ1QsIHg6IGksIHk6IGogfVxuXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XG5cbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGluZGV4ID0gKChQRU5DSUxfUE9TX1kgKyBqKSAqIDkpICsgKFBFTkNJTF9QT1NfWCArIGkpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XG5cbiAgICAjIFZhbHVlIGNsZWFyIGJ1dHRvblxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlZBTFVFLCB4OiAxMCwgeTogMCB9XG5cbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cbiAgICBpbmRleCA9IChQRU5DSUxfQ0xFQVJfUE9TX1kgKiA5KSArIFBFTkNJTF9DTEVBUl9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEwLCB5OiAwIH1cblxuICAgICMgTmV3IEdhbWUgYnV0dG9uXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5ORVdHQU1FLCB4OiAwLCB5OiAwIH1cblxuICAgIHJldHVyblxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIFJlbmRlcmluZ1xuXG4gIGRyYXdDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBzLCBmb250LCBjb2xvcikgLT5cbiAgICBweCA9IHggKiBAY2VsbFNpemVcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxuICAgICAgQGFwcC5kcmF3RmlsbChweCwgcHksIEBjZWxsU2l6ZSwgQGNlbGxTaXplLCBiYWNrZ3JvdW5kQ29sb3IpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHMsIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgZm9udCwgY29sb3IpXG5cbiAgZHJhd0dyaWQ6IChvcmlnaW5YLCBvcmlnaW5ZLCBzaXplLCBzb2x2ZWQgPSBmYWxzZSkgLT5cbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cbiAgICAgIGNvbG9yID0gaWYgc29sdmVkIHRoZW4gXCJncmVlblwiIGVsc2UgXCJibGFja1wiXG4gICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpblxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcbiAgICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaWNrXG5cbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIHNpemUpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIGkpLCBjb2xvciwgbGluZVdpZHRoKVxuXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgc2l6ZSksIGNvbG9yLCBsaW5lV2lkdGgpXG5cbiAgICByZXR1cm5cblxuICBkcmF3OiAtPlxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcblxuICAgICMgQ2xlYXIgc2NyZWVuIHRvIGJsYWNrXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxuXG4gICAgIyBNYWtlIHdoaXRlIHBob25lLXNoYXBlZCBiYWNrZ3JvdW5kXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdhbWUuZ3JpZFtpXVtqXVxuXG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICAgICAgZm9udCA9IEBmb250cy5wZW5cbiAgICAgICAgdGV4dENvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgdGV4dCA9IFwiXCJcbiAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwXG4gICAgICAgICAgZm9udCA9IEBmb250cy5wZW5jaWxcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgICB0ZXh0ID0gQGdhbWUucGVuY2lsU3RyaW5nKGksIGopXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID4gMFxuICAgICAgICAgICAgdGV4dCA9IFN0cmluZyhjZWxsLnZhbHVlKVxuXG4gICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFxuXG4gICAgICAgIGlmIChAaGlnaGxpZ2h0WCAhPSAtMSkgJiYgKEBoaWdobGlnaHRZICE9IC0xKVxuICAgICAgICAgIGlmIChpID09IEBoaWdobGlnaHRYKSAmJiAoaiA9PSBAaGlnaGxpZ2h0WSlcbiAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxuICAgICAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZENvbmZsaWN0ZWRcblxuICAgICAgICBpZiBjZWxsLmVycm9yXG4gICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuZXJyb3JcblxuICAgICAgICBAZHJhd0NlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCB0ZXh0LCBmb250LCB0ZXh0Q29sb3IpXG5cbiAgICBkb25lID0gQGdhbWUuZG9uZSgpXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBjdXJyZW50VmFsdWUgPSAoaiAqIDMpICsgaSArIDFcbiAgICAgICAgY3VycmVudFZhbHVlU3RyaW5nID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSlcbiAgICAgICAgdmFsdWVDb2xvciA9IENvbG9yLnZhbHVlXG4gICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IucGVuY2lsXG4gICAgICAgIGlmIGRvbmVbKGogKiAzKSArIGldXG4gICAgICAgICAgdmFsdWVDb2xvciA9IENvbG9yLmRvbmVcbiAgICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLmRvbmVcblxuICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gY3VycmVudFZhbHVlXG4gICAgICAgICAgaWYgQGlzUGVuY2lsXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuXG4gICAgICAgIEBkcmF3Q2VsbChQRU5fUE9TX1ggKyBpLCBQRU5fUE9TX1kgKyBqLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCB2YWx1ZUNvbG9yKVxuICAgICAgICBAZHJhd0NlbGwoUEVOQ0lMX1BPU19YICsgaSwgUEVOQ0lMX1BPU19ZICsgaiwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHBlbmNpbENvbG9yKVxuXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxuICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuXG4gICAgQGRyYXdDZWxsKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXG5cbiAgICBpZiBAcGVuVmFsdWUgPT0gMFxuICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVNlbGVjdFxuICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXG4gICAgZWxzZVxuICAgICAgbW9kZUNvbG9yID0gaWYgQGlzUGVuY2lsIHRoZW4gQ29sb3IubW9kZVBlbmNpbCBlbHNlIENvbG9yLm1vZGVQZW5cbiAgICAgIG1vZGVUZXh0ID0gaWYgQGlzUGVuY2lsIHRoZW4gXCJQZW5jaWxcIiBlbHNlIFwiUGVuXCJcbiAgICBAZHJhd0NlbGwoTU9ERV9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5uZXdnYW1lLCBtb2RlQ29sb3IpXG5cbiAgICBAZHJhd0NlbGwoTUVOVV9QT1NfWCwgTUVOVV9QT1NfWSwgbnVsbCwgXCJNZW51XCIsIEBmb250cy5uZXdnYW1lLCBDb2xvci5uZXdHYW1lKVxuXG4gICAgIyBNYWtlIHRoZSBncmlkc1xuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXG4gICAgQGRyYXdHcmlkKFBFTl9QT1NfWCwgUEVOX1BPU19ZLCAzKVxuICAgIEBkcmF3R3JpZChQRU5DSUxfUE9TX1gsIFBFTkNJTF9QT1NfWSwgMylcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCAxKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIElucHV0XG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuICAgIEBnYW1lLm5ld0dhbWUoZGlmZmljdWx0eSlcblxuICByZXNldDogLT5cbiAgICBAZ2FtZS5yZXNldCgpXG5cbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIHJldHVybiBAZ2FtZS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQGdhbWUuZXhwb3J0KClcblxuICBob2xlQ291bnQ6IC0+XG4gICAgcmV0dXJuIEBnYW1lLmhvbGVDb3VudCgpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxuICAgIHkgPSBNYXRoLmZsb29yKHkgLyBAY2VsbFNpemUpXG5cbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXG4gICAgICAgIGluZGV4ID0gKHkgKiA5KSArIHhcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJBY3Rpb246IFwiLCBhY3Rpb25cbiAgICAgICAgICBzd2l0Y2ggYWN0aW9uLnR5cGVcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1RcbiAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IDBcbiAgICAgICAgICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WCA9IGFjdGlvbi54XG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBAaXNQZW5jaWxcbiAgICAgICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnRvZ2dsZVBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCAwKVxuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcblxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTFxuICAgICAgICAgICAgICBpZiBAaXNQZW5jaWwgYW5kICAoQHBlblZhbHVlID09IGFjdGlvbi54KVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IDBcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBpc1BlbmNpbCA9IHRydWVcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24ueFxuXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuVkFMVUVcbiAgICAgICAgICAgICAgaWYgbm90IEBpc1BlbmNpbCBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24ueClcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAaXNQZW5jaWwgPSBmYWxzZVxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XG5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5ORVdHQU1FXG4gICAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAjIG5vIGFjdGlvblxuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgICAgICAgQHBlblZhbHVlID0gMFxuICAgICAgICAgIEBpc1BlbmNpbCA9IGZhbHNlXG5cbiAgICAgICAgQGRyYXcoKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIEhlbHBlcnNcblxuICBjb25mbGljdHM6ICh4MSwgeTEsIHgyLCB5MikgLT5cbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cbiAgICBpZiAoeDEgPT0geDIpIHx8ICh5MSA9PSB5MilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICAjIHNhbWUgc2VjdGlvbj9cbiAgICBzeDEgPSBNYXRoLmZsb29yKHgxIC8gMykgKiAzXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xuICAgIHN4MiA9IE1hdGguZmxvb3IoeDIgLyAzKSAqIDNcbiAgICBzeTIgPSBNYXRoLmZsb29yKHkyIC8gMykgKiAzXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdVZpZXdcbiIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xuXG5pbml0ID0gLT5cbiAgY29uc29sZS5sb2cgXCJpbml0XCJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcbiAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXG5cbiAgIyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoc3RhcnRcIiwgKGUpIC0+XG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXG4gICMgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcbiAgIyAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgKGUpIC0+XG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAgIHdpbmRvdy5hcHAuY2xpY2soeCwgeSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cbiAgICBpbml0KClcbiwgZmFsc2UpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjhcIiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
