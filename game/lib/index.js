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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvRm9udEZhY2VPYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdB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QXVCLFFBQXZCO0VBQ1QsTUFBTSxDQUFDLEtBQVAsR0FBZSxRQUFRLENBQUMsZUFBZSxDQUFDO0VBQ3hDLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFFBQVEsQ0FBQyxlQUFlLENBQUM7RUFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFkLENBQTJCLE1BQTNCLEVBQW1DLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFBLENBQUEsQ0FBNUQ7RUFDQSxVQUFBLEdBQWEsTUFBTSxDQUFDLHFCQUFQLENBQUE7RUFFYixNQUFNLENBQUMsR0FBUCxHQUFhLElBQUksR0FBSixDQUFRLE1BQVI7U0FRYixNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBQyxDQUFEO0FBQ25DLFFBQUE7SUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO1dBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWCxDQUFpQixDQUFqQixFQUFvQixDQUFwQjtFQUhtQyxDQUFyQztBQWhCSzs7QUFxQlAsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsQ0FBRDtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGOzs7O0FDdkJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDQWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnRm9udEZhY2VPYnNlcnZlcidcclxuXHJcbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcclxuU3Vkb2t1VmlldyA9IHJlcXVpcmUgJy4vU3Vkb2t1VmlldydcclxudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxyXG4gICAgQGZvbnRzID0ge31cclxuXHJcbiAgICBAdmVyc2lvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEB2ZXJzaW9uRm9udCA9IEByZWdpc3RlckZvbnQoXCJ2ZXJzaW9uXCIsIFwiI3tAdmVyc2lvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGdlbmVyYXRpbmdGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDQpXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnQgPSBAcmVnaXN0ZXJGb250KFwiZ2VuZXJhdGluZ1wiLCBcIiN7QGdlbmVyYXRpbmdGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEB2aWV3cyA9XHJcbiAgICAgIG1lbnU6IG5ldyBNZW51Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgICBzdWRva3U6IG5ldyBTdWRva3VWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBtZWFzdXJlRm9udHM6IC0+XHJcbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXHJcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcclxuICAgIHJldHVyblxyXG5cclxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cclxuICAgIGZvbnQgPVxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIHN0eWxlOiBzdHlsZVxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcclxuICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgcmV0dXJuIGZvbnRcclxuXHJcbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cclxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcclxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cclxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxyXG4gICAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cclxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuXHJcbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXHJcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XHJcbiAgICBAdmlld3Muc3Vkb2t1Lm5ld0dhbWUoZGlmZmljdWx0eSlcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcbiAgICAjICwgMFxyXG5cclxuICByZXNldDogLT5cclxuICAgIEB2aWV3cy5zdWRva3UucmVzZXQoKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuZXhwb3J0KClcclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgcmV0dXJuIEB2aWV3cy5zdWRva3UuaG9sZUNvdW50KClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEB2aWV3LmRyYXcoKVxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICBAdmlldy5jbGljayh4LCB5KVxyXG5cclxuICBkcmF3RmlsbDogKHgsIHksIHcsIGgsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmZpbGwoKVxyXG5cclxuICBkcmF3Um91bmRlZFJlY3Q6ICh4LCB5LCB3LCBoLCByLCBmaWxsQ29sb3IgPSBudWxsLCBzdHJva2VDb2xvciA9IG51bGwpIC0+XHJcbiAgICBAY3R4LnJvdW5kUmVjdCh4LCB5LCB3LCBoLCByKVxyXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3JcclxuICAgICAgQGN0eC5maWxsKClcclxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcclxuICAgICAgQGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yXHJcbiAgICAgIEBjdHguc3Ryb2tlKClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3UmVjdDogKHgsIHksIHcsIGgsIGNvbG9yLCBsaW5lV2lkdGggPSAxKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3VGV4dENlbnRlcmVkOiAodGV4dCwgY3gsIGN5LCBmb250LCBjb2xvcikgLT5cclxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XHJcbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcclxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxyXG4gIEBiZWdpblBhdGgoKVxyXG4gIEBtb3ZlVG8oeCtyLCB5KVxyXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXHJcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcclxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxyXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXHJcbiAgQGNsb3NlUGF0aCgpXHJcbiAgcmV0dXJuIHRoaXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuQlVUVE9OX0hFSUdIVCA9IDAuMDZcclxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXHJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxyXG5CVVRUT05fU0VQQVJBVE9SID0gMC4wM1xyXG5cclxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxyXG4gIHkgPSBGSVJTVF9CVVRUT05fWSArIChCVVRUT05fU1BBQ0lORyAqIGluZGV4KVxyXG4gIGlmIGluZGV4ID4gM1xyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA0XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDZcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIHJldHVybiB5XHJcblxyXG5jbGFzcyBNZW51Vmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIEBidXR0b25zID1cclxuICAgICAgbmV3RWFzeTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMClcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxyXG4gICAgICBuZXdNZWRpdW06XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0hhcmQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcclxuICAgICAgbmV3RXh0cmVtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMylcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzExMTFcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxyXG4gICAgICByZXNldDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNClcclxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXHJcbiAgICAgIGltcG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNSlcclxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIGV4cG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNilcclxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxyXG4gICAgICByZXN1bWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXHJcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcclxuXHJcbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcclxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcclxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgYnV0dG9uLnggPSBidXR0b25YXHJcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxyXG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXHJcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxyXG5cclxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXHJcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDYpXHJcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHN1YnRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHN1YnRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tzdWJ0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAwNVxyXG5cclxuICAgIHkxID0gQGNhbnZhcy5oZWlnaHQgKiAwLjA1XHJcbiAgICB5MiA9IHkxICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XHJcbiAgICB5MyA9IHkyICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkxICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4LCB5MiwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJJdCdzIGxpa2UgU3Vkb2t1LCBidXQgeW91IGFyZSB0aGUgYmFkIGd1eS5cIiwgeCwgeTMsIEBzdWJ0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgQGFwcC5kcmF3TG93ZXJMZWZ0KFwiI3tAYXBwLmhvbGVDb3VudCgpfS84MVwiKVxyXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxyXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbmV3RWFzeTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxyXG5cclxuICBuZXdNZWRpdW06IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtKVxyXG5cclxuICBuZXdIYXJkOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQpXHJcblxyXG4gIG5ld0V4dHJlbWU6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSlcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAYXBwLnJlc2V0KClcclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIGlmIG5hdmlnYXRvci5zaGFyZSAhPSB1bmRlZmluZWRcclxuICAgICAgbmF2aWdhdG9yLnNoYXJlIHtcclxuICAgICAgICB0aXRsZTogXCJTdWRva3UgU2hhcmVkIEdhbWVcIlxyXG4gICAgICAgIHRleHQ6IEBhcHAuZXhwb3J0KClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm5cclxuICAgIHdpbmRvdy5wcm9tcHQoXCJDb3B5IHRoaXMgYW5kIHBhc3RlIHRvIGEgZnJpZW5kOlwiLCBAYXBwLmV4cG9ydCgpKVxyXG5cclxuICBpbXBvcnQ6IC0+XHJcbiAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiUGFzdGUgYW4gZXhwb3J0ZWQgZ2FtZSBoZXJlOlwiLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nID09IG51bGxcclxuICAgICAgcmV0dXJuXHJcbiAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcbiAgICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbmNsYXNzIFN1ZG9rdUdhbWVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBjbGVhcigpXHJcbiAgICBpZiBub3QgQGxvYWQoKVxyXG4gICAgICBAbmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGNsZWFyOiAtPlxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAZ3JpZFtpXVtqXSA9XHJcbiAgICAgICAgICB2YWx1ZTogMFxyXG4gICAgICAgICAgZXJyb3I6IGZhbHNlXHJcbiAgICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgICAgICBwZW5jaWw6IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG5cclxuICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICBjb3VudCA9IDBcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5vdCBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGNvdW50ICs9IDFcclxuICAgIHJldHVybiBjb3VudFxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBleHBvcnRTdHJpbmcgPSBcIlNEXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmxvY2tlZFxyXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiI3tAZ3JpZFtpXVtqXS52YWx1ZX1cIlxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIjBcIlxyXG4gICAgcmV0dXJuIGV4cG9ydFN0cmluZ1xyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIEBjbGVhcigpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IHZcclxuXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgdXBkYXRlQ2VsbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIHggIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgICBpZiB5ICE9IGlcclxuICAgICAgICB2ID0gQGdyaWRbeF1baV0udmFsdWVcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgIEBncmlkW3hdW2ldLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxyXG4gICAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdXBkYXRlQ2VsbHM6IC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAZ3JpZFtpXVtqXS5lcnJvciA9IGZhbHNlXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgailcclxuXHJcbiAgICBAc29sdmVkID0gdHJ1ZVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0uZXJyb3JcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG5cclxuICAgICMgaWYgQHNvbHZlZFxyXG4gICAgIyAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxyXG5cclxuICAgIHJldHVybiBAc29sdmVkXHJcblxyXG4gIGRvbmU6IC0+XHJcbiAgICBkID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxyXG4gICAgICAgICAgY291bnRzW0BncmlkW2ldW2pdLnZhbHVlLTFdICs9IDFcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNvdW50c1tpXSA9PSA5XHJcbiAgICAgICAgZFtpXSA9IHRydWVcclxuICAgIHJldHVybiBkXHJcblxyXG4gIHBlbmNpbFN0cmluZzogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIHMgPSBcIlwiXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXHJcbiAgICAgICAgcyArPSBTdHJpbmcoaSsxKVxyXG4gICAgcmV0dXJuIHNcclxuXHJcbiAgY2xlYXJQZW5jaWw6ICh4LCB5KSAtPlxyXG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgY2VsbC5wZW5jaWxbaV0gPSBmYWxzZVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICB0b2dnbGVQZW5jaWw6ICh4LCB5LCB2KSAtPlxyXG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIGNlbGwucGVuY2lsW3YtMV0gPSAhY2VsbC5wZW5jaWxbdi0xXVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBzZXRWYWx1ZTogKHgsIHksIHYpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgY2VsbC52YWx1ZSA9IHZcclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJyZXNldCgpXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIG5vdCBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgY2VsbC52YWx1ZSA9IDBcclxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXHJcblxyXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXHJcbiAgICBuZXdHcmlkID0gZ2VuZXJhdG9yLmdlbmVyYXRlKGRpZmZpY3VsdHkpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcclxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgbG9hZDogLT5cclxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcclxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGpzb25TdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVcIilcclxuICAgIGlmIGpzb25TdHJpbmcgPT0gbnVsbFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAjIGNvbnNvbGUubG9nIGpzb25TdHJpbmdcclxuICAgIGdhbWVEYXRhID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxyXG4gICAgIyBjb25zb2xlLmxvZyBcImZvdW5kIGdhbWVEYXRhXCIsIGdhbWVEYXRhXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgc3JjID0gZ2FtZURhdGEuZ3JpZFtpXVtqXVxyXG4gICAgICAgIGRzdCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0LnZhbHVlID0gc3JjLnZcclxuICAgICAgICBkc3QuZXJyb3IgPSBpZiBzcmMuZSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBkc3QubG9ja2VkID0gaWYgc3JjLmwgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgZHN0LnBlbmNpbFtrXSA9IGlmIHNyYy5wW2tdID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG5cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBnYW1lLlwiXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGdhbWVEYXRhID1cclxuICAgICAgZ3JpZDogbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgZ2FtZURhdGEuZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgZ2FtZURhdGEuZ3JpZFtpXVtqXSA9XHJcbiAgICAgICAgICB2OiBjZWxsLnZhbHVlXHJcbiAgICAgICAgICBlOiBpZiBjZWxsLmVycm9yIHRoZW4gMSBlbHNlIDBcclxuICAgICAgICAgIGw6IGlmIGNlbGwubG9ja2VkIHRoZW4gMSBlbHNlIDBcclxuICAgICAgICAgIHA6IFtdXHJcbiAgICAgICAgZHN0ID0gZ2FtZURhdGEuZ3JpZFtpXVtqXS5wXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgZHN0LnB1c2goaWYgY2VsbC5wZW5jaWxba10gdGhlbiAxIGVsc2UgMClcclxuXHJcbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWVcIiwganNvblN0cmluZylcclxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcclxuIiwic2h1ZmZsZSA9IChhKSAtPlxyXG4gICAgaSA9IGEubGVuZ3RoXHJcbiAgICB3aGlsZSAtLWkgPiAwXHJcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxyXG4gICAgICAgIHQgPSBhW2pdXHJcbiAgICAgICAgYVtqXSA9IGFbaV1cclxuICAgICAgICBhW2ldID0gdFxyXG4gICAgcmV0dXJuIGFcclxuXHJcbmNsYXNzIEJvYXJkXHJcbiAgY29uc3RydWN0b3I6IChvdGhlckJvYXJkID0gbnVsbCkgLT5cclxuICAgIEBsb2NrZWRDb3VudCA9IDA7XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBAbG9ja2VkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgICBAbG9ja2VkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICBAbG9jayhpLCBqLCBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXSlcclxuICAgIHJldHVyblxyXG5cclxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBsb2NrOiAoeCwgeSwgdiA9IHRydWUpIC0+XHJcbiAgICBpZiB2XHJcbiAgICAgIEBsb2NrZWRDb3VudCArPSAxIGlmIG5vdCBAbG9ja2VkW3hdW3ldXHJcbiAgICBlbHNlXHJcbiAgICAgIEBsb2NrZWRDb3VudCAtPSAxIGlmIEBsb2NrZWRbeF1beV1cclxuICAgIEBsb2NrZWRbeF1beV0gPSB2O1xyXG5cclxuXHJcbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxyXG4gIEBkaWZmaWN1bHR5OlxyXG4gICAgZWFzeTogMVxyXG4gICAgbWVkaXVtOiAyXHJcbiAgICBoYXJkOiAzXHJcbiAgICBleHRyZW1lOiA0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxyXG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cclxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgcmV0dXJuIG5ld0JvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBib2FyZC5ncmlkW3hdW3ldID09IHZcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICBpZiBib2FyZC5ncmlkW3N4ICsgaV1bc3kgKyBqXSA9PSB2XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cclxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICByZXR1cm4gWyBib2FyZC5ncmlkW3hdW3ldIF1cclxuICAgIG1hcmtzID0gW11cclxuICAgIGZvciB2IGluIFsxLi45XVxyXG4gICAgICBpZiBAY2VsbFZhbGlkKGJvYXJkLCB4LCB5LCB2KVxyXG4gICAgICAgIG1hcmtzLnB1c2ggdlxyXG4gICAgaWYgbWFya3MubGVuZ3RoID4gMVxyXG4gICAgICBzaHVmZmxlKG1hcmtzKVxyXG4gICAgcmV0dXJuIG1hcmtzXHJcblxyXG4gIG5leHRBdHRlbXB0OiAoYm9hcmQsIGF0dGVtcHRzKSAtPlxyXG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXHJcblxyXG4gICAgIyBza2lwIGxvY2tlZCBjZWxsc1xyXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihpbmRleClcclxuICAgICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICAjIHNraXAgY2VsbHMgdGhhdCBhcmUgYWxyZWFkeSBiZWluZyB0cmllZFxyXG4gICAgZm9yIGEgaW4gYXR0ZW1wdHNcclxuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxyXG4gICAgICByZW1haW5pbmdJbmRleGVzLnNwbGljZShrLCAxKSBpZiBrID49IDBcclxuXHJcbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxyXG5cclxuICAgIGZld2VzdEluZGV4ID0gLTFcclxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXHJcbiAgICBmb3IgaW5kZXggaW4gcmVtYWluaW5nSW5kZXhlc1xyXG4gICAgICB4ID0gaW5kZXggJSA5XHJcbiAgICAgIHkgPSBpbmRleCAvLyA5XHJcbiAgICAgIG1hcmtzID0gQHBlbmNpbE1hcmtzKGJvYXJkLCB4LCB5KVxyXG5cclxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXHJcbiAgICAgIHJldHVybiBudWxsIGlmIG1hcmtzLmxlbmd0aCA9PSAwXHJcblxyXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcclxuICAgICAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCByZW1haW5pbmc6IG1hcmtzIH0gaWYgbWFya3MubGVuZ3RoID09IDFcclxuXHJcbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxyXG4gICAgICBpZiBtYXJrcy5sZW5ndGggPCBmZXdlc3RNYXJrcy5sZW5ndGhcclxuICAgICAgICBmZXdlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xyXG4gICAgcmV0dXJuIHsgaW5kZXg6IGZld2VzdEluZGV4LCByZW1haW5pbmc6IGZld2VzdE1hcmtzIH1cclxuXHJcbiAgc29sdmU6IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIGF0dGVtcHRzID0gW11cclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxyXG5cclxuICBoYXNVbmlxdWVTb2x1dGlvbjogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG5cclxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpID09IG51bGxcclxuXHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuXHJcbiAgICAjIGlmIHRoZXJlIGFyZSBubyB1bmxvY2tlZCBjZWxscywgdGhlbiB0aGlzIHNvbHV0aW9uIG11c3QgYmUgdW5pcXVlXHJcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcclxuXHJcbiAgICAjIGNoZWNrIGZvciBhIHNlY29uZCBzb2x1dGlvblxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxyXG5cclxuICBzb2x2ZUludGVybmFsOiAoc29sdmVkLCBhdHRlbXB0cywgd2Fsa0luZGV4ID0gMCkgLT5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG4gICAgd2hpbGUgd2Fsa0luZGV4IDwgdW5sb2NrZWRDb3VudFxyXG4gICAgICBpZiB3YWxrSW5kZXggPj0gYXR0ZW1wdHMubGVuZ3RoXHJcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxyXG4gICAgICAgIGF0dGVtcHRzLnB1c2goYXR0ZW1wdCkgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxyXG5cclxuICAgICAgaWYgYXR0ZW1wdCAhPSBudWxsXHJcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XHJcbiAgICAgICAgeSA9IGF0dGVtcHQuaW5kZXggLy8gOVxyXG4gICAgICAgIGlmIGF0dGVtcHQucmVtYWluaW5nLmxlbmd0aCA+IDBcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcclxuICAgICAgICAgIHdhbGtJbmRleCArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gMFxyXG4gICAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHdhbGtJbmRleCAtPSAxXHJcblxyXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICByZXR1cm4gc29sdmVkXHJcblxyXG4gIGdlbmVyYXRlSW50ZXJuYWw6IChhbW91bnRUb1JlbW92ZSkgLT5cclxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxyXG4gICAgIyBoYWNrXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBib2FyZC5sb2NrKGksIGopXHJcblxyXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcclxuICAgIHJlbW92ZWQgPSAwXHJcbiAgICB3aGlsZSByZW1vdmVkIDwgYW1vdW50VG9SZW1vdmVcclxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXHJcbiAgICAgIHJ4ID0gcmVtb3ZlSW5kZXggJSA5XHJcbiAgICAgIHJ5ID0gTWF0aC5mbG9vcihyZW1vdmVJbmRleCAvIDkpXHJcblxyXG4gICAgICBuZXh0Qm9hcmQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICAgIG5leHRCb2FyZC5ncmlkW3J4XVtyeV0gPSAwXHJcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXHJcblxyXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxyXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXHJcbiAgICAgICAgcmVtb3ZlZCArPSAxXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJmYWlsZWQgdG8gcmVtb3ZlICN7cnh9LCN7cnl9LCBjcmVhdGVzIG5vbi11bmlxdWUgc29sdXRpb25cIlxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBib2FyZFxyXG4gICAgICByZW1vdmVkOiByZW1vdmVkXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxyXG5cclxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmQoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFtqXVtpXSA9IHZcclxuICAgICAgICAgIGJvYXJkLmxvY2soaiwgaSlcclxuXHJcbiAgICBzb2x2ZWQgPSBAc29sdmUoYm9hcmQpXHJcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQm9hcmQgc29sdmUgbm90IHVuaXF1ZS5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBhbnN3ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBhbnN3ZXJTdHJpbmcgKz0gXCIje3NvbHZlZC5ncmlkW2pdW2ldfSBcIlxyXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxyXG5cclxuICAgIHJldHVybiBhbnN3ZXJTdHJpbmdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xyXG5cclxuUEVOX1BPU19YID0gMVxyXG5QRU5fUE9TX1kgPSAxMFxyXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXHJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXHJcblxyXG5QRU5DSUxfUE9TX1ggPSA1XHJcblBFTkNJTF9QT1NfWSA9IDEwXHJcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcclxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcbk1FTlVfUE9TX1ggPSA0XHJcbk1FTlVfUE9TX1kgPSAxM1xyXG5cclxuTU9ERV9QT1NfWCA9IDRcclxuTU9ERV9QT1NfWSA9IDlcclxuXHJcbkNvbG9yID1cclxuICB2YWx1ZTogXCJibGFja1wiXHJcbiAgcGVuY2lsOiBcIiMwMDAwZmZcIlxyXG4gIGVycm9yOiBcIiNmZjAwMDBcIlxyXG4gIGRvbmU6IFwiI2NjY2NjY1wiXHJcbiAgbmV3R2FtZTogXCIjMDA4ODMzXCJcclxuICBiYWNrZ3JvdW5kU2VsZWN0ZWQ6IFwiI2VlZWVhYVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZDogXCIjZWVlZWVlXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZDogXCIjZmZmZmVlXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWQ6IFwiI2VlZWVkZFwiXHJcbiAgYmFja2dyb3VuZENvbmZsaWN0ZWQ6IFwiI2ZmZmZkZFwiXHJcbiAgYmFja2dyb3VuZEVycm9yOiBcIiNmZmRkZGRcIlxyXG4gIG1vZGVTZWxlY3Q6IFwiIzc3Nzc0NFwiXHJcbiAgbW9kZVBlbjogXCIjMDAwMDAwXCJcclxuICBtb2RlUGVuY2lsOiBcIiMwMDAwZmZcIlxyXG5cclxuQWN0aW9uVHlwZSA9XHJcbiAgU0VMRUNUOiAwXHJcbiAgUEVOQ0lMOiAxXHJcbiAgVkFMVUU6IDJcclxuICBORVdHQU1FOiAzXHJcblxyXG5jbGFzcyBTdWRva3VWaWV3XHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbml0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXHJcblxyXG4gICAgd2lkdGhCYXNlZENlbGxTaXplID0gQGNhbnZhcy53aWR0aCAvIDlcclxuICAgIGhlaWdodEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLmhlaWdodCAvIDE0XHJcbiAgICBjb25zb2xlLmxvZyBcIndpZHRoQmFzZWRDZWxsU2l6ZSAje3dpZHRoQmFzZWRDZWxsU2l6ZX0gaGVpZ2h0QmFzZWRDZWxsU2l6ZSAje2hlaWdodEJhc2VkQ2VsbFNpemV9XCJcclxuICAgIEBjZWxsU2l6ZSA9IE1hdGgubWluKHdpZHRoQmFzZWRDZWxsU2l6ZSwgaGVpZ2h0QmFzZWRDZWxsU2l6ZSlcclxuXHJcbiAgICAjIGNhbGMgcmVuZGVyIGNvbnN0YW50c1xyXG4gICAgQGxpbmVXaWR0aFRoaW4gPSAxXHJcbiAgICBAbGluZVdpZHRoVGhpY2sgPSBNYXRoLm1heChAY2VsbFNpemUgLyAyMCwgMylcclxuXHJcbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxyXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcclxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXHJcblxyXG4gICAgIyBpbml0IGZvbnRzXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBuZXdnYW1lOiBAYXBwLnJlZ2lzdGVyRm9udChcIm5ld2dhbWVcIiwgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBpbml0QWN0aW9ucygpXHJcblxyXG4gICAgIyBpbml0IHN0YXRlXHJcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcclxuICAgIEBwZW5WYWx1ZSA9IDBcclxuICAgIEBpc1BlbmNpbCA9IGZhbHNlXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcblxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBpbml0QWN0aW9uczogLT5cclxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuU0VMRUNULCB4OiBpLCB5OiBqIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5WQUxVRSwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XHJcblxyXG4gICAgIyBWYWx1ZSBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEwLCB5OiAwIH1cclxuXHJcbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB4OiAxMCwgeTogMCB9XHJcblxyXG4gICAgIyBOZXcgR2FtZSBidXR0b25cclxuICAgIGluZGV4ID0gKE1FTlVfUE9TX1kgKiA5KSArIE1FTlVfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5ORVdHQU1FLCB4OiAwLCB5OiAwIH1cclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBSZW5kZXJpbmdcclxuXHJcbiAgZHJhd0NlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIHMsIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXHJcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHMsIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgZm9udCwgY29sb3IpXHJcblxyXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XHJcbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cclxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcclxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cclxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcclxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcclxuXHJcbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xyXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXHJcblxyXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxyXG5cclxuICAgICMgTWFrZSB3aGl0ZSBwaG9uZS1zaGFwZWQgYmFja2dyb3VuZFxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXHJcblxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBmb250ID0gQGZvbnRzLnBlblxyXG4gICAgICAgIHRleHRDb2xvciA9IENvbG9yLnZhbHVlXHJcbiAgICAgICAgdGV4dCA9IFwiXCJcclxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcclxuICAgICAgICAgIGZvbnQgPSBAZm9udHMucGVuY2lsXHJcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5wZW5jaWxcclxuICAgICAgICAgIHRleHQgPSBAZ2FtZS5wZW5jaWxTdHJpbmcoaSwgailcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID4gMFxyXG4gICAgICAgICAgICB0ZXh0ID0gU3RyaW5nKGNlbGwudmFsdWUpXHJcblxyXG4gICAgICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXHJcblxyXG4gICAgICAgIGlmIChAaGlnaGxpZ2h0WCAhPSAtMSkgJiYgKEBoaWdobGlnaHRZICE9IC0xKVxyXG4gICAgICAgICAgaWYgKGkgPT0gQGhpZ2hsaWdodFgpICYmIChqID09IEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRTZWxlY3RlZFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kQ29uZmxpY3RlZFxyXG5cclxuICAgICAgICBpZiBjZWxsLmVycm9yXHJcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5lcnJvclxyXG5cclxuICAgICAgICBAZHJhd0NlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCB0ZXh0LCBmb250LCB0ZXh0Q29sb3IpXHJcblxyXG4gICAgZG9uZSA9IEBnYW1lLmRvbmUoKVxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgY3VycmVudFZhbHVlID0gKGogKiAzKSArIGkgKyAxXHJcbiAgICAgICAgY3VycmVudFZhbHVlU3RyaW5nID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSlcclxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcclxuICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgIGlmIGRvbmVbKGogKiAzKSArIGldXHJcbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxyXG4gICAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5kb25lXHJcblxyXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gY3VycmVudFZhbHVlXHJcbiAgICAgICAgICBpZiBAaXNQZW5jaWxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5fUE9TX1ggKyBpLCBQRU5fUE9TX1kgKyBqLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCB2YWx1ZUNvbG9yKVxyXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXHJcblxyXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBpZiBAcGVuVmFsdWUgPT0gMTBcclxuICAgICAgICBpZiBAaXNQZW5jaWxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG5cclxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcblxyXG4gICAgaWYgQHBlblZhbHVlID09IDBcclxuICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVNlbGVjdFxyXG4gICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcclxuICAgIGVsc2VcclxuICAgICAgbW9kZUNvbG9yID0gaWYgQGlzUGVuY2lsIHRoZW4gQ29sb3IubW9kZVBlbmNpbCBlbHNlIENvbG9yLm1vZGVQZW5cclxuICAgICAgbW9kZVRleHQgPSBpZiBAaXNQZW5jaWwgdGhlbiBcIlBlbmNpbFwiIGVsc2UgXCJQZW5cIlxyXG4gICAgQGRyYXdDZWxsKE1PREVfUE9TX1gsIE1PREVfUE9TX1ksIG51bGwsIG1vZGVUZXh0LCBAZm9udHMubmV3Z2FtZSwgbW9kZUNvbG9yKVxyXG5cclxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm5ld2dhbWUsIENvbG9yLm5ld0dhbWUpXHJcblxyXG4gICAgIyBNYWtlIHRoZSBncmlkc1xyXG4gICAgQGRyYXdHcmlkKDAsIDAsIDksIEBnYW1lLnNvbHZlZClcclxuICAgIEBkcmF3R3JpZChQRU5fUE9TX1gsIFBFTl9QT1NfWSwgMylcclxuICAgIEBkcmF3R3JpZChQRU5DSUxfUE9TX1gsIFBFTkNJTF9QT1NfWSwgMylcclxuICAgIEBkcmF3R3JpZChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgMSlcclxuICAgIEBkcmF3R3JpZChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgMSlcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbnB1dFxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiU3Vkb2t1Vmlldy5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuICAgIEBnYW1lLm5ld0dhbWUoZGlmZmljdWx0eSlcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAZ2FtZS5yZXNldCgpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIHJldHVybiBAZ2FtZS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gQGdhbWUuZXhwb3J0KClcclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLmhvbGVDb3VudCgpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcclxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXHJcbiAgICB5ID0gTWF0aC5mbG9vcih5IC8gQGNlbGxTaXplKVxyXG5cclxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcclxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XHJcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXHJcbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXHJcbiAgICAgICAgICBzd2l0Y2ggYWN0aW9uLnR5cGVcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlNFTEVDVFxyXG4gICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAwXHJcbiAgICAgICAgICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcclxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gYWN0aW9uLnhcclxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFkgPSBhY3Rpb24ueVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGlmIEBpc1BlbmNpbFxyXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcclxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS50b2dnbGVQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxyXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgMClcclxuICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIEBnYW1lLnNldFZhbHVlKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG5cclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTFxyXG4gICAgICAgICAgICAgIGlmIEBpc1BlbmNpbCBhbmQgIChAcGVuVmFsdWUgPT0gYWN0aW9uLngpXHJcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQGlzUGVuY2lsID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnhcclxuXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5WQUxVRVxyXG4gICAgICAgICAgICAgIGlmIG5vdCBAaXNQZW5jaWwgYW5kIChAcGVuVmFsdWUgPT0gYWN0aW9uLngpXHJcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSAwXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XHJcblxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuTkVXR0FNRVxyXG4gICAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIG5vIGFjdGlvblxyXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgICAgICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgICAgICAgQHBlblZhbHVlID0gMFxyXG4gICAgICAgICAgQGlzUGVuY2lsID0gZmFsc2VcclxuXHJcbiAgICAgICAgQGRyYXcoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEhlbHBlcnNcclxuXHJcbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICAjIHNhbWUgcm93IG9yIGNvbHVtbj9cclxuICAgIGlmICh4MSA9PSB4MikgfHwgKHkxID09IHkyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICMgc2FtZSBzZWN0aW9uP1xyXG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xyXG4gICAgc3kxID0gTWF0aC5mbG9vcih5MSAvIDMpICogM1xyXG4gICAgc3gyID0gTWF0aC5mbG9vcih4MiAvIDMpICogM1xyXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xyXG4gICAgaWYgKHN4MSA9PSBzeDIpICYmIChzeTEgPT0gc3kyKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICMgICBjb25zb2xlLmxvZyBPYmplY3Qua2V5cyhlLnRvdWNoZXNbMF0pXHJcbiAgIyAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICMgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gICAgaW5pdCgpXHJcbiwgZmFsc2UpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuOVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
