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

  App.prototype.drawArc = function(x1, y1, x2, y2, radius, color, lineWidth) {
    var M, P1, P2, Q, dCM, dMP1, dMQ, uMP1, uMQ;
    P1 = {
      x: x1,
      y: y1
    };
    P2 = {
      x: x2,
      y: y2
    };
    M = {
      x: (P1.x + P2.x) / 2,
      y: (P1.y + P2.y) / 2
    };
    dMP1 = Math.sqrt((P1.x - M.x) * (P1.x - M.x) + (P1.y - M.y) * (P1.y - M.y));
    if ((radius == null) || radius < dMP1) {
      radius = dMP1;
    }
    uMP1 = {
      x: (P1.x - M.x) / dMP1,
      y: (P1.y - M.y) / dMP1
    };
    uMQ = {
      x: -uMP1.y,
      y: uMP1.x
    };
    dCM = Math.sqrt(radius * radius - dMP1 * dMP1);
    dMQ = dMP1 * dMP1 / dCM;
    Q = {
      x: M.x + uMQ.x * dMQ,
      y: M.y + uMQ.y * dMQ
    };
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x1, y1);
    this.ctx.arcTo(Q.x, Q.y, x2, y2, radius);
    this.ctx.stroke();
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
    while (true) {
      if (importString === null) {
        return;
      }
      if (this.app["import"](importString)) {
        this.app.switchView("sudoku");
        return;
      }
      importString = window.prompt("Invalid game, try again:", "");
    }
  };

  return MenuView;

})();

module.exports = MenuView;


},{"./SudokuGenerator":4}],3:[function(require,module,exports){
var SudokuGame, SudokuGenerator, ascendingLinkSort, cellIndex, generateLinkPermutations, uniqueLinkFilter;

SudokuGenerator = require('./SudokuGenerator');

cellIndex = function(x, y) {
  return y * 9 + x;
};

ascendingLinkSort = function(a, b) {
  var a0, a1, b0, b1;
  a0 = cellIndex(a.cells[0].x, a.cells[0].y);
  a1 = cellIndex(a.cells[1].x, a.cells[1].y);
  b0 = cellIndex(b.cells[0].x, b.cells[0].y);
  b1 = cellIndex(b.cells[1].x, b.cells[1].y);
  if (a0 > b0 || (a0 === b0 && (a1 > b1 || (a1 === b1 && ((a.strong == null) && (b.strong != null)))))) {
    return 1;
  } else {
    return -1;
  }
};

uniqueLinkFilter = function(e, i, a) {
  var e0, e1, p, p0, p1;
  if (i === 0) {
    return true;
  }
  p = a[i - 1];
  e0 = cellIndex(e.cells[0].x, e.cells[0].y);
  e1 = cellIndex(e.cells[1].x, e.cells[1].y);
  p0 = cellIndex(p.cells[0].x, p.cells[0].y);
  p1 = cellIndex(p.cells[1].x, p.cells[1].y);
  return e0 !== p0 || e1 !== p1;
};

generateLinkPermutations = function(cells) {
  var count, i, j, l, links, m, ref, ref1, ref2;
  links = [];
  count = cells.length;
  for (i = l = 0, ref = count - 1; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
    for (j = m = ref1 = i + 1, ref2 = count; ref1 <= ref2 ? m < ref2 : m > ref2; j = ref1 <= ref2 ? ++m : --m) {
      links.push({
        cells: [cells[i], cells[j]]
      });
    }
  }
  return links;
};

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
    this.solved = false;
    this.undoJournal = [];
    return this.redoJournal = [];
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

  SudokuGame.prototype.validate = function() {
    var board, generator, i, j, l, m;
    board = new Array(9).fill(null);
    for (i = l = 0; l < 9; i = ++l) {
      board[i] = new Array(9).fill(0);
      for (j = m = 0; m < 9; j = ++m) {
        board[i][j] = this.grid[i][j].value;
      }
    }
    generator = new SudokuGenerator;
    return generator.validateGrid(board);
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
    if (!this.validate()) {
      return false;
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
    var i, j, l, m, n, o, q, r;
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
    for (j = q = 0; q < 9; j = ++q) {
      for (i = r = 0; r < 9; i = ++r) {
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

  SudokuGame.prototype["do"] = function(action, x, y, values, journal) {
    var cell, l, len, v;
    if (values.length > 0) {
      cell = this.grid[x][y];
      switch (action) {
        case "togglePencil":
          journal.push({
            action: "togglePencil",
            x: x,
            y: y,
            values: values
          });
          for (l = 0, len = values.length; l < len; l++) {
            v = values[l];
            cell.pencil[v - 1] = !cell.pencil[v - 1];
          }
          break;
        case "setValue":
          journal.push({
            action: "setValue",
            x: x,
            y: y,
            values: [cell.value]
          });
          cell.value = values[0];
      }
      this.updateCells();
      return this.save();
    }
  };

  SudokuGame.prototype.undo = function() {
    var step;
    if (this.undoJournal.length > 0) {
      step = this.undoJournal.pop();
      return this["do"](step.action, step.x, step.y, step.values, this.redoJournal);
    }
  };

  SudokuGame.prototype.redo = function() {
    var step;
    if (this.redoJournal.length > 0) {
      step = this.redoJournal.pop();
      return this["do"](step.action, step.x, step.y, step.values, this.undoJournal);
    }
  };

  SudokuGame.prototype.clearPencil = function(x, y) {
    var cell, flag, i;
    cell = this.grid[x][y];
    if (cell.locked) {
      return;
    }
    this["do"]("togglePencil", x, y, (function() {
      var l, len, ref, results;
      ref = cell.pencil;
      results = [];
      for (i = l = 0, len = ref.length; l < len; i = ++l) {
        flag = ref[i];
        if (flag) {
          results.push(i + 1);
        }
      }
      return results;
    })(), this.undoJournal);
    return this.redoJournal = [];
  };

  SudokuGame.prototype.togglePencil = function(x, y, v) {
    if (this.grid[x][y].locked) {
      return;
    }
    this["do"]("togglePencil", x, y, [v], this.undoJournal);
    return this.redoJournal = [];
  };

  SudokuGame.prototype.setValue = function(x, y, v) {
    if (this.grid[x][y].locked) {
      return;
    }
    this["do"]("setValue", x, y, [v], this.undoJournal);
    return this.redoJournal = [];
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
    this.undoJournal = [];
    this.redoJournal = [];
    this.highlightX = -1;
    this.highlightY = -1;
    this.updateCells();
    return this.save();
  };

  SudokuGame.prototype.getLinks = function(value) {
    var boxX, boxY, l, len, len1, link, links, m, n, o, q, r, strong, weak, x, y;
    links = [];
    for (y = l = 0; l < 9; y = ++l) {
      links.push.apply(links, this.getRowLinks(y, value));
    }
    for (x = m = 0; m < 9; x = ++m) {
      links.push.apply(links, this.getColumnLinks(x, value));
    }
    for (boxX = n = 0; n < 3; boxX = ++n) {
      for (boxY = o = 0; o < 3; boxY = ++o) {
        links.push.apply(links, this.getBoxLinks(boxX, boxY, value));
      }
    }
    links = links.sort(ascendingLinkSort).filter(uniqueLinkFilter);
    strong = [];
    for (q = 0, len = links.length; q < len; q++) {
      link = links[q];
      if (link.strong != null) {
        strong.push(link.cells);
      }
    }
    weak = [];
    for (r = 0, len1 = links.length; r < len1; r++) {
      link = links[r];
      if (link.strong == null) {
        weak.push(link.cells);
      }
    }
    return {
      strong: strong,
      weak: weak
    };
  };

  SudokuGame.prototype.getRowLinks = function(y, value) {
    var cell, cells, l, links, x;
    cells = [];
    for (x = l = 0; l < 9; x = ++l) {
      cell = this.grid[x][y];
      if (cell.value === 0 && cell.pencil[value - 1]) {
        cells.push({
          x: x,
          y: y
        });
      }
    }
    if (cells.length > 1) {
      links = generateLinkPermutations(cells);
      if (links.length === 1) {
        links[0].strong = true;
      }
    } else {
      links = [];
    }
    return links;
  };

  SudokuGame.prototype.getColumnLinks = function(x, value) {
    var cell, cells, l, links, y;
    cells = [];
    for (y = l = 0; l < 9; y = ++l) {
      cell = this.grid[x][y];
      if (cell.value === 0 && cell.pencil[value - 1]) {
        cells.push({
          x: x,
          y: y
        });
      }
    }
    if (cells.length > 1) {
      links = generateLinkPermutations(cells);
      if (links.length === 1) {
        links[0].strong = true;
      }
    } else {
      links = [];
    }
    return links;
  };

  SudokuGame.prototype.getBoxLinks = function(boxX, boxY, value) {
    var cell, cells, l, links, m, ref, ref1, ref2, ref3, sx, sy, x, y;
    cells = [];
    sx = boxX * 3;
    sy = boxY * 3;
    for (y = l = ref = sy, ref1 = sy + 3; ref <= ref1 ? l < ref1 : l > ref1; y = ref <= ref1 ? ++l : --l) {
      for (x = m = ref2 = sx, ref3 = sx + 3; ref2 <= ref3 ? m < ref3 : m > ref3; x = ref2 <= ref3 ? ++m : --m) {
        cell = this.grid[x][y];
        if (cell.value === 0 && cell.pencil[value - 1]) {
          cells.push({
            x: x,
            y: y
          });
        }
      }
    }
    if (cells.length > 1) {
      links = generateLinkPermutations(cells);
      if (links.length === 1) {
        links[0].strong = true;
      }
    } else {
      links = [];
    }
    return links;
  };

  SudokuGame.prototype.newGame = function(difficulty) {
    var cell, generator, i, j, k, l, m, n, newGrid, o, q;
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
      for (i = q = 0; q < 9; i = ++q) {
        if (newGrid[i][j] !== 0) {
          this.grid[i][j].value = newGrid[i][j];
          this.grid[i][j].locked = true;
        }
      }
    }
    this.undoJournal = [];
    this.redoJournal = [];
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


},{}],5:[function(require,module,exports){
var ActionType, CLEAR, Color, MENU_POS_X, MENU_POS_Y, MODE_CENTER_POS_X, MODE_END_POS_X, MODE_POS_Y, MODE_START_POS_X, ModeType, NONE, PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, PENCIL_POS_X, PENCIL_POS_Y, PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, PEN_POS_X, PEN_POS_Y, REDO_POS_X, REDO_POS_Y, SudokuGame, SudokuGenerator, SudokuView, UNDO_POS_X, UNDO_POS_Y;

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

MODE_START_POS_X = 2;

MODE_CENTER_POS_X = 4;

MODE_END_POS_X = 6;

MODE_POS_Y = 9;

UNDO_POS_X = 0;

UNDO_POS_Y = 13;

REDO_POS_X = 8;

REDO_POS_Y = 13;

Color = {
  value: "black",
  pencil: "#0000ff",
  error: "#ff0000",
  done: "#cccccc",
  menu: "#008833",
  links: "#cc3333",
  backgroundSelected: "#eeeeaa",
  backgroundLocked: "#eeeeee",
  backgroundLockedConflicted: "#ffffee",
  backgroundLockedSelected: "#eeeedd",
  backgroundConflicted: "#ffffdd",
  backgroundError: "#ffdddd",
  modeSelect: "#777744",
  modePen: "#000000",
  modePencil: "#0000ff",
  modeLinks: "#cc3333"
};

ActionType = {
  SELECT: 0,
  PENCIL: 1,
  PEN: 2,
  MENU: 3,
  UNDO: 4,
  REDO: 5,
  MODE: 6
};

ModeType = {
  HIGHLIGHTING: 0,
  PENCIL: 1,
  PEN: 2,
  LINKS: 3
};

NONE = 0;

CLEAR = 10;

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
      menu: this.app.registerFont("menu", fontPixelsM + "px saxMono, monospace"),
      pen: this.app.registerFont("pen", fontPixelsL + "px saxMono, monospace")
    };
    this.initActions();
    this.game = new SudokuGame();
    this.resetState();
    this.draw();
  }

  SudokuView.prototype.initActions = function() {
    var i, index, j, k, l, m, n, o, p, q, ref, ref1;
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
          type: ActionType.PEN,
          value: 1 + (j * 3) + i
        };
      }
    }
    for (j = o = 0; o < 3; j = ++o) {
      for (i = p = 0; p < 3; i = ++p) {
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i);
        this.actions[index] = {
          type: ActionType.PENCIL,
          value: 1 + (j * 3) + i
        };
      }
    }
    index = (PEN_CLEAR_POS_Y * 9) + PEN_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PEN,
      value: CLEAR
    };
    index = (PENCIL_CLEAR_POS_Y * 9) + PENCIL_CLEAR_POS_X;
    this.actions[index] = {
      type: ActionType.PENCIL,
      value: CLEAR
    };
    index = (MENU_POS_Y * 9) + MENU_POS_X;
    this.actions[index] = {
      type: ActionType.MENU
    };
    index = (UNDO_POS_Y * 9) + UNDO_POS_X;
    this.actions[index] = {
      type: ActionType.UNDO
    };
    index = (REDO_POS_Y * 9) + REDO_POS_X;
    this.actions[index] = {
      type: ActionType.REDO
    };
    for (i = q = ref = (MODE_POS_Y * 9) + MODE_START_POS_X, ref1 = (MODE_POS_Y * 9) + MODE_END_POS_X; ref <= ref1 ? q <= ref1 : q >= ref1; i = ref <= ref1 ? ++q : --q) {
      this.actions[i] = {
        type: ActionType.MODE
      };
    }
  };

  SudokuView.prototype.resetState = function() {
    this.mode = ModeType.HIGHLIGHTING;
    this.penValue = NONE;
    this.highlightX = -1;
    this.highlightY = -1;
    this.strongLinks = [];
    return this.weakLinks = [];
  };

  SudokuView.prototype.resetState = function() {
    this.penValue = 0;
    this.isPencil = false;
    this.highlightX = -1;
    return this.highlightY = -1;
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

  SudokuView.prototype.drawLink = function(startX, startY, endX, endY, color, lineWidth) {
    var r, x1, x2, y1, y2;
    x1 = (startX + 0.5) * this.cellSize;
    y1 = (startY + 0.5) * this.cellSize;
    x2 = (endX + 0.5) * this.cellSize;
    y2 = (endY + 0.5) * this.cellSize;
    r = 2.2 * Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    return this.app.drawArc(x1, y1, x2, y2, r, color, lineWidth);
  };

  SudokuView.prototype.draw = function() {
    var backgroundColor, cell, currentValue, currentValueString, done, font, i, j, k, l, len, len1, link, m, modeColor, modeText, n, o, p, pencilBackgroundColor, pencilColor, ref, ref1, text, textColor, valueBackgroundColor, valueColor;
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
        if (cell.error) {
          textColor = Color.error;
        }
        if (cell.locked) {
          backgroundColor = Color.backgroundLocked;
        }
        if (this.mode === ModeType.HIGHLIGHTING) {
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
        }
        this.drawCell(i, j, backgroundColor, text, font, textColor);
      }
    }
    if (this.mode === ModeType.LINKS) {
      ref = this.strongLinks;
      for (m = 0, len = ref.length; m < len; m++) {
        link = ref[m];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThick);
      }
      ref1 = this.weakLinks;
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        link = ref1[n];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThin);
      }
    }
    done = this.game.done();
    for (j = o = 0; o < 3; j = ++o) {
      for (i = p = 0; p < 3; i = ++p) {
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
          if (this.mode === ModeType.PENCIL || this.mode === ModeType.LINKS) {
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
    if (this.penValue === CLEAR) {
      if (this.mode === ModeType.PENCIL) {
        pencilBackgroundColor = Color.backgroundSelected;
      } else {
        valueBackgroundColor = Color.backgroundSelected;
      }
    }
    this.drawCell(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, valueBackgroundColor, "C", this.fonts.pen, Color.error);
    this.drawCell(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, pencilBackgroundColor, "C", this.fonts.pen, Color.error);
    switch (this.mode) {
      case ModeType.HIGHLIGHTING:
        modeColor = Color.modeSelect;
        modeText = "Highlighting";
        break;
      case ModeType.PENCIL:
        modeColor = Color.modePencil;
        modeText = "Pencil";
        break;
      case ModeType.PEN:
        modeColor = Color.modePen;
        modeText = "Pen";
        break;
      case ModeType.LINKS:
        modeColor = Color.modeLinks;
        modeText = "Links";
    }
    this.drawCell(MODE_CENTER_POS_X, MODE_POS_Y, null, modeText, this.fonts.menu, modeColor);
    this.drawCell(MENU_POS_X, MENU_POS_Y, null, "Menu", this.fonts.menu, Color.menu);
    if (this.game.undoJournal.length > 0) {
      this.drawCell(UNDO_POS_X, UNDO_POS_Y, null, "\u25c4", this.fonts.menu, Color.menu);
    }
    if (this.game.redoJournal.length > 0) {
      this.drawCell(REDO_POS_X, REDO_POS_Y, null, "\u25ba", this.fonts.menu, Color.menu);
    }
    this.drawGrid(0, 0, 9, this.game.solved);
    this.drawGrid(PEN_POS_X, PEN_POS_Y, 3);
    this.drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3);
    this.drawGrid(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, 1);
    return this.drawGrid(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, 1);
  };

  SudokuView.prototype.newGame = function(difficulty) {
    console.log("SudokuView.newGame(" + difficulty + ")");
    this.resetState();
    return this.game.newGame(difficulty);
  };

  SudokuView.prototype.reset = function() {
    this.resetState();
    return this.game.reset();
  };

  SudokuView.prototype["import"] = function(importString) {
    this.resetState();
    return this.game["import"](importString);
  };

  SudokuView.prototype["export"] = function() {
    return this.game["export"]();
  };

  SudokuView.prototype.holeCount = function() {
    return this.game.holeCount();
  };

  SudokuView.prototype.handleSelectAction = function(action) {
    switch (this.mode) {
      case ModeType.HIGHLIGHTING:
        if ((this.highlightX === action.x) && (this.highlightY === action.y)) {
          this.highlightX = -1;
          return this.highlightY = -1;
        } else {
          this.highlightX = action.x;
          return this.highlightY = action.y;
        }
        break;
      case ModeType.PENCIL:
        if (this.penValue === CLEAR) {
          return this.game.clearPencil(action.x, action.y);
        } else if (this.penValue !== NONE) {
          return this.game.togglePencil(action.x, action.y, this.penValue);
        }
        break;
      case ModeType.PEN:
        if (this.penValue === CLEAR) {
          return this.game.setValue(action.x, action.y, 0);
        } else if (this.penValue !== NONE) {
          return this.game.setValue(action.x, action.y, this.penValue);
        }
    }
  };

  SudokuView.prototype.handlePencilAction = function(action) {
    var ref;
    if (this.mode === ModeType.LINKS) {
      if (action.value === CLEAR) {
        this.penValue = NONE;
        this.strongLinks = [];
        return this.weakLinks = [];
      } else {
        this.penValue = action.value;
        return ref = this.game.getLinks(action.value), this.strongLinks = ref.strong, this.weakLinks = ref.weak, ref;
      }
    } else if (this.mode === ModeType.PENCIL && (this.penValue === action.value)) {
      this.mode = ModeType.HIGHLIGHTING;
      return this.penValue = NONE;
    } else {
      this.mode = ModeType.PENCIL;
      this.penValue = action.value;
      this.highlightX = -1;
      this.highlightY = -1;
      this.strongLinks = [];
      return this.weakLinks = [];
    }
  };

  SudokuView.prototype.handlePenAction = function(action) {
    if (this.mode === ModeType.LINKS) {
      return;
    }
    if (this.mode === ModeType.PEN && (this.penValue === action.value)) {
      this.mode = ModeType.HIGHLIGHTING;
      this.penValue = NONE;
    } else {
      this.mode = ModeType.PEN;
      this.penValue = action.value;
    }
    this.highlightX = -1;
    this.highlightY = -1;
    this.strongLinks = [];
    return this.weakLinks = [];
  };

  SudokuView.prototype.handleUndoAction = function() {
    if (this.mode !== ModeType.LINKS) {
      return this.game.undo();
    }
  };

  SudokuView.prototype.handleRedoAction = function() {
    if (this.mode !== ModeType.LINKS) {
      return this.game.redo();
    }
  };

  SudokuView.prototype.handleModeAction = function() {
    switch (this.mode) {
      case ModeType.HIGHLIGHTING:
        this.mode = ModeType.LINKS;
        break;
      case ModeType.PENCIL:
        this.mode = ModeType.PEN;
        break;
      case ModeType.PEN:
        this.mode = ModeType.HIGHLIGHTING;
        break;
      case ModeType.LINKS:
        this.mode = ModeType.PENCIL;
    }
    this.highlightX = -1;
    this.highlightY = -1;
    this.penValue = NONE;
    this.strongLinks = [];
    return this.weakLinks = [];
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
        if (action.type === ActionType.MENU) {
          this.app.switchView("menu");
          return;
        }
        switch (action.type) {
          case ActionType.SELECT:
            this.handleSelectAction(action);
            break;
          case ActionType.PENCIL:
            this.handlePencilAction(action);
            break;
          case ActionType.PEN:
            this.handlePenAction(action);
            break;
          case ActionType.UNDO:
            this.handleUndoAction();
            break;
          case ActionType.REDO:
            this.handleRedoAction();
            break;
          case ActionType.MODE:
            this.handleModeAction();
        }
      } else {
        this.mode = ModeType.HIGHLIGHTING;
        this.highlightX = -1;
        this.highlightY = -1;
        this.penValue = NONE;
        this.strongLinks = [];
        this.weakLinks = [];
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
module.exports = "0.0.11";


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdB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SUFBSSxDQUFDLFVBQVcsQ0FBQSxDQUFBLENBQTVEO0VBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO0VBRWIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFJLEdBQUosQ0FBUSxNQUFSO1NBUWIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQUMsQ0FBRDtBQUNuQyxRQUFBO0lBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztXQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEI7RUFIbUMsQ0FBckM7QUFoQks7O0FBcUJQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQ3ZCQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXHJcblxyXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXHJcblN1ZG9rdVZpZXcgPSByZXF1aXJlICcuL1N1ZG9rdVZpZXcnXHJcbnZlcnNpb24gPSByZXF1aXJlICcuL3ZlcnNpb24nXHJcblxyXG5jbGFzcyBBcHBcclxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBsb2FkRm9udChcInNheE1vbm9cIilcclxuICAgIEBmb250cyA9IHt9XHJcblxyXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxyXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAdmlld3MgPVxyXG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgICAgc3Vkb2t1OiBuZXcgU3Vkb2t1Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgbWVhc3VyZUZvbnRzOiAtPlxyXG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xyXG4gICAgICBAY3R4LmZvbnQgPSBmLnN0eWxlXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiXHJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgICBmLmhlaWdodCA9IE1hdGguZmxvb3IoQGN0eC5tZWFzdXJlVGV4dChcIm1cIikud2lkdGggKiAxLjEpICMgYmVzdCBoYWNrIGV2ZXJcclxuICAgICAgY29uc29sZS5sb2cgXCJGb250ICN7Zm9udE5hbWV9IG1lYXN1cmVkIGF0ICN7Zi5oZWlnaHR9IHBpeGVsc1wiXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVnaXN0ZXJGb250OiAobmFtZSwgc3R5bGUpIC0+XHJcbiAgICBmb250ID1cclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgICBzdHlsZTogc3R5bGVcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICBAZm9udHNbbmFtZV0gPSBmb250XHJcbiAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgIHJldHVybiBmb250XHJcblxyXG4gIGxvYWRGb250OiAoZm9udE5hbWUpIC0+XHJcbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXHJcbiAgICBmb250LmxvYWQoKS50aGVuID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiI3tmb250TmFtZX0gbG9hZGVkLCByZWRyYXdpbmcuLi5cIilcclxuICAgICAgQG1lYXN1cmVGb250cygpXHJcbiAgICAgIEBkcmF3KClcclxuXHJcbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XHJcbiAgICBAdmlldyA9IEB2aWV3c1t2aWV3XVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJhcHAubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcblxyXG4gICAgIyBAZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzQ0NDQ0NFwiKVxyXG4gICAgIyBAZHJhd1RleHRDZW50ZXJlZChcIkdlbmVyYXRpbmcsIHBsZWFzZSB3YWl0Li4uXCIsIEBjYW52YXMud2lkdGggLyAyLCBAY2FudmFzLmhlaWdodCAvIDIsIEBnZW5lcmF0aW5nRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgIyB3aW5kb3cuc2V0VGltZW91dCA9PlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgIyAsIDBcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAdmlld3Muc3Vkb2t1LnJlc2V0KClcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmhvbGVDb3VudCgpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAdmlldy5kcmF3KClcclxuXHJcbiAgY2xpY2s6ICh4LCB5KSAtPlxyXG4gICAgQHZpZXcuY2xpY2soeCwgeSlcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcclxuICAgIEBjdHgubGluZVRvKHgyLCB5MilcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgY3gsIGN5ICsgKGZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdMb3dlckxlZnQ6ICh0ZXh0LCBjb2xvciA9IFwid2hpdGVcIikgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd1ZlcnNpb246IChjb2xvciA9IFwid2hpdGVcIikgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxyXG4gICAgQGN0eC5maWxsVGV4dChcInYje3ZlcnNpb259XCIsIEBjYW52YXMud2lkdGggLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxyXG4gIGlmICh3IDwgMiAqIHIpIHRoZW4gciA9IHcgLyAyXHJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcclxuICBAYmVnaW5QYXRoKClcclxuICBAbW92ZVRvKHgrciwgeSlcclxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxyXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXHJcbiAgQGFyY1RvKHgsICAgeStoLCB4LCAgIHksICAgcilcclxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxyXG4gIEBjbG9zZVBhdGgoKVxyXG4gIHJldHVybiB0aGlzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbkJVVFRPTl9IRUlHSFQgPSAwLjA2XHJcbkZJUlNUX0JVVFRPTl9ZID0gMC4yMlxyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcclxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcclxuXHJcbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cclxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcclxuICBpZiBpbmRleCA+IDNcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNFxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA2XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICByZXR1cm4geVxyXG5cclxuY2xhc3MgTWVudVZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBAYnV0dG9ucyA9XHJcbiAgICAgIG5ld0Vhc3k6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDApXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRWFzeVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM3NzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdFYXN5LmJpbmQodGhpcylcclxuICAgICAgbmV3TWVkaXVtOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygxKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3NzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxyXG4gICAgICBuZXdIYXJkOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEhhcmRcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzMzM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3SGFyZC5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0V4dHJlbWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDMpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRXh0cmVtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzcxMTExXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdFeHRyZW1lLmJpbmQodGhpcylcclxuICAgICAgcmVzZXQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDQpXHJcbiAgICAgICAgdGV4dDogXCJSZXNldCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MzM3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzZXQuYmluZCh0aGlzKVxyXG4gICAgICBpbXBvcnQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDUpXHJcbiAgICAgICAgdGV4dDogXCJMb2FkIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBpbXBvcnQuYmluZCh0aGlzKVxyXG4gICAgICBleHBvcnQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDYpXHJcbiAgICAgICAgdGV4dDogXCJTaGFyZSBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAZXhwb3J0LmJpbmQodGhpcylcclxuICAgICAgcmVzdW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XHJcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXHJcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxyXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcclxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxyXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcclxuXHJcbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxyXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA2KVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICBzdWJ0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEBzdWJ0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7c3VidGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzMzMzNcIilcclxuXHJcbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcclxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMDVcclxuXHJcbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxyXG4gICAgeTIgPSB5MSArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxyXG4gICAgeTMgPSB5MiArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCArIHNoYWRvd09mZnNldCwgeTIgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiSXQncyBsaWtlIFN1ZG9rdSwgYnV0IHlvdSBhcmUgdGhlIGJhZCBndXkuXCIsIHgsIHkzLCBAc3VidGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxyXG5cclxuICAgIEBhcHAuZHJhd0xvd2VyTGVmdChcIiN7QGFwcC5ob2xlQ291bnQoKX0vODFcIilcclxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG5ld0Vhc3k6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuXHJcbiAgbmV3TWVkaXVtOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSlcclxuXHJcbiAgbmV3SGFyZDogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkKVxyXG5cclxuICBuZXdFeHRyZW1lOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQGFwcC5yZXNldCgpXHJcblxyXG4gIHJlc3VtZTogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBpZiBuYXZpZ2F0b3Iuc2hhcmUgIT0gdW5kZWZpbmVkXHJcbiAgICAgIG5hdmlnYXRvci5zaGFyZSB7XHJcbiAgICAgICAgdGl0bGU6IFwiU3Vkb2t1IFNoYXJlZCBHYW1lXCJcclxuICAgICAgICB0ZXh0OiBAYXBwLmV4cG9ydCgpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuXHJcbiAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0aGlzIGFuZCBwYXN0ZSB0byBhIGZyaWVuZDpcIiwgQGFwcC5leHBvcnQoKSlcclxuXHJcbiAgaW1wb3J0OiAtPlxyXG4gICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIlBhc3RlIGFuIGV4cG9ydGVkIGdhbWUgaGVyZTpcIiwgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVyblxyXG4gICAgaWYgQGFwcC5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG4gICAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG5jbGFzcyBTdWRva3VHYW1lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAY2xlYXIoKVxyXG4gICAgaWYgbm90IEBsb2FkKClcclxuICAgICAgQG5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuICAgIHJldHVyblxyXG5cclxuICBjbGVhcjogLT5cclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgdmFsdWU6IDBcclxuICAgICAgICAgIGVycm9yOiBmYWxzZVxyXG4gICAgICAgICAgbG9ja2VkOiBmYWxzZVxyXG4gICAgICAgICAgcGVuY2lsOiBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuXHJcbiAgICBAc29sdmVkID0gZmFsc2VcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICBjb3VudCA9IDBcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5vdCBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGNvdW50ICs9IDFcclxuICAgIHJldHVybiBjb3VudFxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBleHBvcnRTdHJpbmcgPSBcIlNEXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmxvY2tlZFxyXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiI3tAZ3JpZFtpXVtqXS52YWx1ZX1cIlxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIjBcIlxyXG4gICAgcmV0dXJuIGV4cG9ydFN0cmluZ1xyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIEBjbGVhcigpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IHZcclxuXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgdXBkYXRlQ2VsbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIHggIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgICBpZiB5ICE9IGlcclxuICAgICAgICB2ID0gQGdyaWRbeF1baV0udmFsdWVcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgIEBncmlkW3hdW2ldLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxyXG4gICAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdXBkYXRlQ2VsbHM6IC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAZ3JpZFtpXVtqXS5lcnJvciA9IGZhbHNlXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgailcclxuXHJcbiAgICBAc29sdmVkID0gdHJ1ZVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0uZXJyb3JcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG5cclxuICAgICMgaWYgQHNvbHZlZFxyXG4gICAgIyAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxyXG5cclxuICAgIHJldHVybiBAc29sdmVkXHJcblxyXG4gIGRvbmU6IC0+XHJcbiAgICBkID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxyXG4gICAgICAgICAgY291bnRzW0BncmlkW2ldW2pdLnZhbHVlLTFdICs9IDFcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNvdW50c1tpXSA9PSA5XHJcbiAgICAgICAgZFtpXSA9IHRydWVcclxuICAgIHJldHVybiBkXHJcblxyXG4gIHBlbmNpbFN0cmluZzogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgIHMgPSBcIlwiXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXHJcbiAgICAgICAgcyArPSBTdHJpbmcoaSsxKVxyXG4gICAgcmV0dXJuIHNcclxuXHJcbiAgZG86IChhY3Rpb24sIHgsIHksIHZhbHVlcywgam91cm5hbCkgLT5cclxuICAgIGlmIHZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBzd2l0Y2ggYWN0aW9uXHJcbiAgICAgICAgd2hlbiBcInRvZ2dsZVBlbmNpbFwiXHJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwidG9nZ2xlUGVuY2lsXCIsIHg6IHgsIHk6IHksIHZhbHVlczogdmFsdWVzIH1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW3YtMV0gPSAhY2VsbC5wZW5jaWxbdi0xXSBmb3IgdiBpbiB2YWx1ZXNcclxuICAgICAgICB3aGVuIFwic2V0VmFsdWVcIlxyXG4gICAgICAgICAgam91cm5hbC5wdXNoIHsgYWN0aW9uOiBcInNldFZhbHVlXCIsIHg6IHgsIHk6IHksIHZhbHVlczogW2NlbGwudmFsdWVdIH1cclxuICAgICAgICAgIGNlbGwudmFsdWUgPSB2YWx1ZXNbMF1cclxuICAgICAgQHVwZGF0ZUNlbGxzKClcclxuICAgICAgQHNhdmUoKVxyXG5cclxuICB1bmRvOiAtPlxyXG4gICAgaWYgKEB1bmRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG4gICAgICBzdGVwID0gQHVuZG9Kb3VybmFsLnBvcCgpXHJcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAcmVkb0pvdXJuYWxcclxuXHJcbiAgcmVkbzogLT5cclxuICAgIGlmIChAcmVkb0pvdXJuYWwubGVuZ3RoID4gMClcclxuICAgICAgc3RlcCA9IEByZWRvSm91cm5hbC5wb3AoKVxyXG4gICAgICBAZG8gc3RlcC5hY3Rpb24sIHN0ZXAueCwgc3RlcC55LCBzdGVwLnZhbHVlcywgQHVuZG9Kb3VybmFsXHJcblxyXG4gIGNsZWFyUGVuY2lsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJ0b2dnbGVQZW5jaWxcIiwgeCwgeSwgKGkrMSBmb3IgZmxhZywgaSBpbiBjZWxsLnBlbmNpbCB3aGVuIGZsYWcpLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHRvZ2dsZVBlbmNpbDogKHgsIHksIHYpIC0+XHJcbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJ0b2dnbGVQZW5jaWxcIiwgeCwgeSwgW3ZdLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHNldFZhbHVlOiAoeCwgeSwgdikgLT5cclxuICAgIGlmIEBncmlkW3hdW3ldLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIEBkbyBcInNldFZhbHVlXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICByZXNldDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwicmVzZXQoKVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBpZiBub3QgY2VsbC5sb2NrZWRcclxuICAgICAgICAgIGNlbGwudmFsdWUgPSAwXHJcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBjZWxsLnZhbHVlID0gMFxyXG4gICAgICAgIGNlbGwuZXJyb3IgPSBmYWxzZVxyXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXHJcblxyXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvcigpXHJcbiAgICBuZXdHcmlkID0gZ2VuZXJhdG9yLmdlbmVyYXRlKGRpZmZpY3VsdHkpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcclxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gbmV3R3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBsb2FkOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVwiKVxyXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICMgY29uc29sZS5sb2cganNvblN0cmluZ1xyXG4gICAgZ2FtZURhdGEgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXHJcbiAgICAjIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBzcmMgPSBnYW1lRGF0YS5ncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0ID0gQGdyaWRbaV1bal1cclxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxyXG4gICAgICAgIGRzdC5lcnJvciA9IGlmIHNyYy5lID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG4gICAgICAgIGRzdC5sb2NrZWQgPSBpZiBzcmMubCA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucGVuY2lsW2tdID0gaWYgc3JjLnBba10gPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcblxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIGdhbWUuXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZ2FtZURhdGEgPVxyXG4gICAgICBncmlkOiBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBnYW1lRGF0YS5ncmlkW2ldW2pdID1cclxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcclxuICAgICAgICAgIGU6IGlmIGNlbGwuZXJyb3IgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgbDogaWYgY2VsbC5sb2NrZWQgdGhlbiAxIGVsc2UgMFxyXG4gICAgICAgICAgcDogW11cclxuICAgICAgICBkc3QgPSBnYW1lRGF0YS5ncmlkW2ldW2pdLnBcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxyXG5cclxuICAgIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShnYW1lRGF0YSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBnYW1lICgje2pzb25TdHJpbmcubGVuZ3RofSBjaGFycylcIlxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2FtZVxyXG4iLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGxvY2tlZENvdW50ID0gMDtcclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIEBsb2NrKGksIGosIG90aGVyQm9hcmQubG9ja2VkW2ldW2pdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cclxuICAgIGlmIHZcclxuICAgICAgQGxvY2tlZENvdW50ICs9IDEgaWYgbm90IEBsb2NrZWRbeF1beV1cclxuICAgIGVsc2VcclxuICAgICAgQGxvY2tlZENvdW50IC09IDEgaWYgQGxvY2tlZFt4XVt5XVxyXG4gICAgQGxvY2tlZFt4XVt5XSA9IHY7XHJcblxyXG5cclxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgQGRpZmZpY3VsdHk6XHJcbiAgICBlYXN5OiAxXHJcbiAgICBtZWRpdW06IDJcclxuICAgIGhhcmQ6IDNcclxuICAgIGV4dHJlbWU6IDRcclxuXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcblxyXG4gIGJvYXJkVG9HcmlkOiAoYm9hcmQpIC0+XHJcbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIG5ld0JvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIGJvYXJkLmxvY2tlZFtpXVtqXVxyXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXHJcbiAgICByZXR1cm4gbmV3Qm9hcmRcclxuXHJcbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XHJcbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgcmV0dXJuIGJvYXJkLmdyaWRbeF1beV0gPT0gdlxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgKHggIT0gaSkgYW5kIChib2FyZC5ncmlkW2ldW3ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcclxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxyXG4gICAgbWFya3MgPSBbXVxyXG4gICAgZm9yIHYgaW4gWzEuLjldXHJcbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXHJcbiAgICAgICAgbWFya3MucHVzaCB2XHJcbiAgICBpZiBtYXJrcy5sZW5ndGggPiAxXHJcbiAgICAgIHNodWZmbGUobWFya3MpXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XHJcbiAgICByZW1haW5pbmdJbmRleGVzID0gWzAuLi44MV1cclxuXHJcbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXHJcbiAgICBmb3IgaW5kZXggaW4gWzAuLi44MV1cclxuICAgICAgeCA9IGluZGV4ICUgOVxyXG4gICAgICB5ID0gaW5kZXggLy8gOVxyXG4gICAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGluZGV4KVxyXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgICMgc2tpcCBjZWxscyB0aGF0IGFyZSBhbHJlYWR5IGJlaW5nIHRyaWVkXHJcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xyXG4gICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGEuaW5kZXgpXHJcbiAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgIHJldHVybiBudWxsIGlmIHJlbWFpbmluZ0luZGV4ZXMubGVuZ3RoID09IDAgIyBhYm9ydCBpZiB0aGVyZSBhcmUgbm8gY2VsbHMgKHNob3VsZCBuZXZlciBoYXBwZW4pXHJcblxyXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxyXG4gICAgZmV3ZXN0TWFya3MgPSBbMC4uOV1cclxuICAgIGZvciBpbmRleCBpbiByZW1haW5pbmdJbmRleGVzXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgbWFya3MgPSBAcGVuY2lsTWFya3MoYm9hcmQsIHgsIHkpXHJcblxyXG4gICAgICAjIGFib3J0IGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG5vIHBvc3NpYmlsaXRpZXNcclxuICAgICAgcmV0dXJuIG51bGwgaWYgbWFya3MubGVuZ3RoID09IDBcclxuXHJcbiAgICAgICMgZG9uZSBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBvbmx5IG9uZSBwb3NzaWJpbGl0eSAoKVxyXG4gICAgICByZXR1cm4geyBpbmRleDogaW5kZXgsIHJlbWFpbmluZzogbWFya3MgfSBpZiBtYXJrcy5sZW5ndGggPT0gMVxyXG5cclxuICAgICAgIyByZW1lbWJlciB0aGlzIGNlbGwgaWYgaXQgaGFzIHRoZSBmZXdlc3QgbWFya3Mgc28gZmFyXHJcbiAgICAgIGlmIG1hcmtzLmxlbmd0aCA8IGZld2VzdE1hcmtzLmxlbmd0aFxyXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcclxuICAgICAgICBmZXdlc3RNYXJrcyA9IG1hcmtzXHJcbiAgICByZXR1cm4geyBpbmRleDogZmV3ZXN0SW5kZXgsIHJlbWFpbmluZzogZmV3ZXN0TWFya3MgfVxyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBhdHRlbXB0cyA9IFtdXHJcblxyXG4gICAgIyBpZiB0aGVyZSBpcyBubyBzb2x1dGlvbiwgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gZmFsc2UgaWYgQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cykgPT0gbnVsbFxyXG5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG5cclxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcclxuICAgIHJldHVybiB0cnVlIGlmIHVubG9ja2VkQ291bnQgPT0gMFxyXG5cclxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cywgdW5sb2NrZWRDb3VudC0xKSA9PSBudWxsXHJcblxyXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxyXG4gICAgdW5sb2NrZWRDb3VudCA9IDgxIC0gc29sdmVkLmxvY2tlZENvdW50XHJcbiAgICB3aGlsZSB3YWxrSW5kZXggPCB1bmxvY2tlZENvdW50XHJcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcclxuICAgICAgICBhdHRlbXB0ID0gQG5leHRBdHRlbXB0KHNvbHZlZCwgYXR0ZW1wdHMpXHJcbiAgICAgICAgYXR0ZW1wdHMucHVzaChhdHRlbXB0KSBpZiBhdHRlbXB0ICE9IG51bGxcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGF0dGVtcHQgPSBhdHRlbXB0c1t3YWxrSW5kZXhdXHJcblxyXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcclxuICAgICAgICB4ID0gYXR0ZW1wdC5pbmRleCAlIDlcclxuICAgICAgICB5ID0gYXR0ZW1wdC5pbmRleCAvLyA5XHJcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSBhdHRlbXB0LnJlbWFpbmluZy5wb3AoKVxyXG4gICAgICAgICAgd2Fsa0luZGV4ICs9IDFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBhdHRlbXB0cy5wb3AoKVxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXHJcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuXHJcbiAgICAgIGlmIHdhbGtJbmRleCA8IDBcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG5cclxuICAgIHJldHVybiBzb2x2ZWRcclxuXHJcbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxyXG4gICAgYm9hcmQgPSBAc29sdmUobmV3IEJvYXJkKCkpXHJcbiAgICAjIGhhY2tcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkLmxvY2soaSwgailcclxuXHJcbiAgICBpbmRleGVzVG9SZW1vdmUgPSBzaHVmZmxlKFswLi4uODFdKVxyXG4gICAgcmVtb3ZlZCA9IDBcclxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxyXG4gICAgICBpZiBpbmRleGVzVG9SZW1vdmUubGVuZ3RoID09IDBcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgcmVtb3ZlSW5kZXggPSBpbmRleGVzVG9SZW1vdmUucG9wKClcclxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcclxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcclxuXHJcbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcclxuICAgICAgbmV4dEJvYXJkLmxvY2socngsIHJ5LCBmYWxzZSlcclxuXHJcbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXHJcbiAgICAgICAgYm9hcmQgPSBuZXh0Qm9hcmRcclxuICAgICAgICByZW1vdmVkICs9IDFcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9hcmQ6IGJvYXJkXHJcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcclxuICAgIH1cclxuXHJcbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgYW1vdW50VG9SZW1vdmUgPSBzd2l0Y2ggZGlmZmljdWx0eVxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSAgdGhlbiA0NlxyXG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cclxuXHJcbiAgICBiZXN0ID0gbnVsbFxyXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4yXVxyXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcclxuICAgICAgaWYgZ2VuZXJhdGVkLnJlbW92ZWQgPT0gYW1vdW50VG9SZW1vdmVcclxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBpZiBiZXN0ID09IG51bGxcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiY3VycmVudCBiZXN0ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcbiAgICByZXR1cm4gQGJvYXJkVG9HcmlkKGJlc3QuYm9hcmQpXHJcblxyXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZCgpXHJcblxyXG4gICAgaW5kZXggPSAwXHJcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBib2FyZC5ncmlkW2pdW2ldID0gdlxyXG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxyXG5cclxuICAgIHNvbHZlZCA9IEBzb2x2ZShib2FyZClcclxuICAgIGlmIHNvbHZlZCA9PSBudWxsXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IENhbid0IGJlIHNvbHZlZC5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBpZiBub3QgQGhhc1VuaXF1ZVNvbHV0aW9uKGJvYXJkKVxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBCb2FyZCBzb2x2ZSBub3QgdW5pcXVlLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGFuc3dlclN0cmluZyA9IFwiXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGFuc3dlclN0cmluZyArPSBcIiN7c29sdmVkLmdyaWRbal1baV19IFwiXHJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXHJcblxyXG4gICAgcmV0dXJuIGFuc3dlclN0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblN1ZG9rdUdhbWUgPSByZXF1aXJlICcuL1N1ZG9rdUdhbWUnXHJcblxyXG5QRU5fUE9TX1ggPSAxXHJcblBFTl9QT1NfWSA9IDEwXHJcblBFTl9DTEVBUl9QT1NfWCA9IDJcclxuUEVOX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcblBFTkNJTF9QT1NfWCA9IDVcclxuUEVOQ0lMX1BPU19ZID0gMTBcclxuUEVOQ0lMX0NMRUFSX1BPU19YID0gNlxyXG5QRU5DSUxfQ0xFQVJfUE9TX1kgPSAxM1xyXG5cclxuTUVOVV9QT1NfWCA9IDRcclxuTUVOVV9QT1NfWSA9IDEzXHJcblxyXG5NT0RFX1BPU19YID0gNFxyXG5NT0RFX1BPU19ZID0gOVxyXG5cclxuVU5ET19QT1NfWCA9IDBcclxuVU5ET19QT1NfWSA9IDEzXHJcblJFRE9fUE9TX1ggPSA4XHJcblJFRE9fUE9TX1kgPSAxM1xyXG5cclxuQ29sb3IgPVxyXG4gIHZhbHVlOiBcImJsYWNrXCJcclxuICBwZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXHJcbiAgZG9uZTogXCIjY2NjY2NjXCJcclxuICBuZXdHYW1lOiBcIiMwMDg4MzNcIlxyXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkOiBcIiNlZWVlZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcclxuICBiYWNrZ3JvdW5kQ29uZmxpY3RlZDogXCIjZmZmZmRkXCJcclxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXHJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcclxuICBtb2RlUGVuOiBcIiMwMDAwMDBcIlxyXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXHJcblxyXG5BY3Rpb25UeXBlID1cclxuICBTRUxFQ1Q6IDBcclxuICBQRU5DSUw6IDFcclxuICBWQUxVRTogMlxyXG4gIE1FTlU6IDNcclxuICBVTkRPOiA0XHJcbiAgUkVETzogNVxyXG5cclxuY2xhc3MgU3Vkb2t1Vmlld1xyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5pdFxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxyXG5cclxuICAgIHdpZHRoQmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMud2lkdGggLyA5XHJcbiAgICBoZWlnaHRCYXNlZENlbGxTaXplID0gQGNhbnZhcy5oZWlnaHQgLyAxNFxyXG4gICAgY29uc29sZS5sb2cgXCJ3aWR0aEJhc2VkQ2VsbFNpemUgI3t3aWR0aEJhc2VkQ2VsbFNpemV9IGhlaWdodEJhc2VkQ2VsbFNpemUgI3toZWlnaHRCYXNlZENlbGxTaXplfVwiXHJcbiAgICBAY2VsbFNpemUgPSBNYXRoLm1pbih3aWR0aEJhc2VkQ2VsbFNpemUsIGhlaWdodEJhc2VkQ2VsbFNpemUpXHJcblxyXG4gICAgIyBjYWxjIHJlbmRlciBjb25zdGFudHNcclxuICAgIEBsaW5lV2lkdGhUaGluID0gMVxyXG4gICAgQGxpbmVXaWR0aFRoaWNrID0gTWF0aC5tYXgoQGNlbGxTaXplIC8gMjAsIDMpXHJcblxyXG4gICAgZm9udFBpeGVsc1MgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuMylcclxuICAgIGZvbnRQaXhlbHNNID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjUpXHJcbiAgICBmb250UGl4ZWxzTCA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC44KVxyXG5cclxuICAgICMgaW5pdCBmb250c1xyXG4gICAgQGZvbnRzID1cclxuICAgICAgcGVuY2lsOiAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5jaWxcIiwgIFwiI3tmb250UGl4ZWxzU31weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgICAgbmV3Z2FtZTogQGFwcC5yZWdpc3RlckZvbnQoXCJuZXdnYW1lXCIsIFwiI3tmb250UGl4ZWxzTX1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgICAgcGVuOiAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5cIiwgICAgIFwiI3tmb250UGl4ZWxzTH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAaW5pdEFjdGlvbnMoKVxyXG5cclxuICAgICMgaW5pdCBzdGF0ZVxyXG4gICAgQGdhbWUgPSBuZXcgU3Vkb2t1R2FtZSgpXHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcblxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBpbml0QWN0aW9uczogLT5cclxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuU0VMRUNULCB4OiBpLCB5OiBqIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5WQUxVRSwgeDogMSArIChqICogMykgKyBpLCB5OiAwIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOQ0lMX1BPU19ZICsgaikgKiA5KSArIChQRU5DSUxfUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHg6IDEgKyAoaiAqIDMpICsgaSwgeTogMCB9XHJcblxyXG4gICAgIyBWYWx1ZSBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVkFMVUUsIHg6IDEwLCB5OiAwIH1cclxuXHJcbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB4OiAxMCwgeTogMCB9XHJcblxyXG4gICAgIyBNZW51IGJ1dHRvblxyXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk1FTlUsIHg6IDAsIHk6IDAgfVxyXG5cclxuICAgICMgVW5kbyBidXR0b25cclxuICAgIGluZGV4ID0gKFVORE9fUE9TX1kgKiA5KSArIFVORE9fUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5VTkRPLCB4OiAwLCB5OiAwIH1cclxuXHJcbiAgICAjIFJlZG8gYnV0dG9uXHJcbiAgICBpbmRleCA9IChSRURPX1BPU19ZICogOSkgKyBSRURPX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUkVETywgeDogMCwgeTogMCB9XHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0U3RhdGU6IC0+XHJcbiAgICBAcGVuVmFsdWUgPSAwXHJcbiAgICBAaXNQZW5jaWwgPSBmYWxzZVxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIFJlbmRlcmluZ1xyXG5cclxuICBkcmF3Q2VsbDogKHgsIHksIGJhY2tncm91bmRDb2xvciwgcywgZm9udCwgY29sb3IpIC0+XHJcbiAgICBweCA9IHggKiBAY2VsbFNpemVcclxuICAgIHB5ID0geSAqIEBjZWxsU2l6ZVxyXG4gICAgaWYgYmFja2dyb3VuZENvbG9yICE9IG51bGxcclxuICAgICAgQGFwcC5kcmF3RmlsbChweCwgcHksIEBjZWxsU2l6ZSwgQGNlbGxTaXplLCBiYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQocywgcHggKyAoQGNlbGxTaXplIC8gMiksIHB5ICsgKEBjZWxsU2l6ZSAvIDIpLCBmb250LCBjb2xvcilcclxuXHJcbiAgZHJhd0dyaWQ6IChvcmlnaW5YLCBvcmlnaW5ZLCBzaXplLCBzb2x2ZWQgPSBmYWxzZSkgLT5cclxuICAgIGZvciBpIGluIFswLi5zaXplXVxyXG4gICAgICBjb2xvciA9IGlmIHNvbHZlZCB0aGVuIFwiZ3JlZW5cIiBlbHNlIFwiYmxhY2tcIlxyXG4gICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpblxyXG4gICAgICBpZiAoKHNpemUgPT0gMSkgfHwgKGkgJSAzKSA9PSAwKVxyXG4gICAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGlja1xyXG5cclxuICAgICAgIyBIb3Jpem9udGFsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBzaXplKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgY29sb3IsIGxpbmVXaWR0aClcclxuXHJcbiAgICAgICMgVmVydGljYWwgbGluZXNcclxuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIHNpemUpLCBjb2xvciwgbGluZVdpZHRoKVxyXG5cclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJkcmF3KClcIlxyXG5cclxuICAgICMgQ2xlYXIgc2NyZWVuIHRvIGJsYWNrXHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcImJsYWNrXCIpXHJcblxyXG4gICAgIyBNYWtlIHdoaXRlIHBob25lLXNoYXBlZCBiYWNrZ3JvdW5kXHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjZWxsU2l6ZSAqIDksIEBjYW52YXMuaGVpZ2h0LCBcIndoaXRlXCIpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBnYW1lLmdyaWRbaV1bal1cclxuXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIGZvbnQgPSBAZm9udHMucGVuXHJcbiAgICAgICAgdGV4dENvbG9yID0gQ29sb3IudmFsdWVcclxuICAgICAgICB0ZXh0ID0gXCJcIlxyXG4gICAgICAgIGlmIGNlbGwudmFsdWUgPT0gMFxyXG4gICAgICAgICAgZm9udCA9IEBmb250cy5wZW5jaWxcclxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnBlbmNpbFxyXG4gICAgICAgICAgdGV4dCA9IEBnYW1lLnBlbmNpbFN0cmluZyhpLCBqKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGlmIGNlbGwudmFsdWUgPiAwXHJcbiAgICAgICAgICAgIHRleHQgPSBTdHJpbmcoY2VsbC52YWx1ZSlcclxuXHJcbiAgICAgICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRcclxuXHJcbiAgICAgICAgaWYgKEBoaWdobGlnaHRYICE9IC0xKSAmJiAoQGhpZ2hsaWdodFkgIT0gLTEpXHJcbiAgICAgICAgICBpZiAoaSA9PSBAaGlnaGxpZ2h0WCkgJiYgKGogPT0gQGhpZ2hsaWdodFkpXHJcbiAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2UgaWYgQGNvbmZsaWN0cyhpLCBqLCBAaGlnaGxpZ2h0WCwgQGhpZ2hsaWdodFkpXHJcbiAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRDb25mbGljdGVkXHJcblxyXG4gICAgICAgIGlmIGNlbGwuZXJyb3JcclxuICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLmVycm9yXHJcblxyXG4gICAgICAgIEBkcmF3Q2VsbChpLCBqLCBiYWNrZ3JvdW5kQ29sb3IsIHRleHQsIGZvbnQsIHRleHRDb2xvcilcclxuXHJcbiAgICBkb25lID0gQGdhbWUuZG9uZSgpXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBjdXJyZW50VmFsdWUgPSAoaiAqIDMpICsgaSArIDFcclxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxyXG4gICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci52YWx1ZVxyXG4gICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IucGVuY2lsXHJcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cclxuICAgICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci5kb25lXHJcbiAgICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLmRvbmVcclxuXHJcbiAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcclxuICAgICAgICAgIGlmIEBpc1BlbmNpbFxyXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTkNJTF9QT1NfWCArIGksIFBFTkNJTF9QT1NfWSArIGosIHBlbmNpbEJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCBwZW5jaWxDb2xvcilcclxuXHJcbiAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcclxuICAgIGlmIEBwZW5WYWx1ZSA9PSAxMFxyXG4gICAgICAgIGlmIEBpc1BlbmNpbFxyXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcblxyXG4gICAgQGRyYXdDZWxsKFBFTl9DTEVBUl9QT1NfWCwgUEVOX0NMRUFSX1BPU19ZLCB2YWx1ZUJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxyXG4gICAgQGRyYXdDZWxsKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuXHJcbiAgICBpZiBAcGVuVmFsdWUgPT0gMFxyXG4gICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlU2VsZWN0XHJcbiAgICAgIG1vZGVUZXh0ID0gXCJIaWdobGlnaHRpbmdcIlxyXG4gICAgZWxzZVxyXG4gICAgICBtb2RlQ29sb3IgPSBpZiBAaXNQZW5jaWwgdGhlbiBDb2xvci5tb2RlUGVuY2lsIGVsc2UgQ29sb3IubW9kZVBlblxyXG4gICAgICBtb2RlVGV4dCA9IGlmIEBpc1BlbmNpbCB0aGVuIFwiUGVuY2lsXCIgZWxzZSBcIlBlblwiXHJcbiAgICBAZHJhd0NlbGwoTU9ERV9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5uZXdnYW1lLCBtb2RlQ29sb3IpXHJcblxyXG4gICAgQGRyYXdDZWxsKE1FTlVfUE9TX1gsIE1FTlVfUE9TX1ksIG51bGwsIFwiTWVudVwiLCBAZm9udHMubmV3Z2FtZSwgQ29sb3IubmV3R2FtZSlcclxuICAgIEBkcmF3Q2VsbChVTkRPX1BPU19YLCBVTkRPX1BPU19ZLCBudWxsLCBcIlxcdXsyNWM0fVwiLCBAZm9udHMubmV3Z2FtZSwgQ29sb3IubmV3R2FtZSkgaWYgKEBnYW1lLnVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm5ld2dhbWUsIENvbG9yLm5ld0dhbWUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG5cclxuICAgICMgTWFrZSB0aGUgZ3JpZHNcclxuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXHJcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX1BPU19YLCBQRU5DSUxfUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5wdXRcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIlN1ZG9rdVZpZXcubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcbiAgICBAZ2FtZS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUucmVzZXQoKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcbiAgICByZXR1cm4gQGdhbWUuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLmV4cG9ydCgpXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5ob2xlQ291bnQoKVxyXG5cclxuICBjbGljazogKHgsIHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiY2xpY2sgI3t4fSwgI3t5fVwiXHJcbiAgICB4ID0gTWF0aC5mbG9vcih4IC8gQGNlbGxTaXplKVxyXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcclxuXHJcbiAgICBpZiAoeCA8IDkpICYmICh5IDwgMTUpXHJcbiAgICAgICAgaW5kZXggPSAoeSAqIDkpICsgeFxyXG4gICAgICAgIGFjdGlvbiA9IEBhY3Rpb25zW2luZGV4XVxyXG4gICAgICAgIGlmIGFjdGlvbiAhPSBudWxsXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIkFjdGlvbjogXCIsIGFjdGlvblxyXG4gICAgICAgICAgc3dpdGNoIGFjdGlvbi50eXBlXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1RcclxuICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMFxyXG4gICAgICAgICAgICAgICAgaWYgKEBoaWdobGlnaHRYID09IGFjdGlvbi54KSAmJiAoQGhpZ2hsaWdodFkgPT0gYWN0aW9uLnkpXHJcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgICAgICAgICAgICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICBAaGlnaGxpZ2h0WCA9IGFjdGlvbi54XHJcbiAgICAgICAgICAgICAgICAgIEBoaWdobGlnaHRZID0gYWN0aW9uLnlcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBpZiBAaXNQZW5jaWxcclxuICAgICAgICAgICAgICAgICAgaWYgQHBlblZhbHVlID09IDEwXHJcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUuY2xlYXJQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55KVxyXG4gICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgQGdhbWUudG9nZ2xlUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICBpZiBAcGVuVmFsdWUgPT0gMTBcclxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIDApXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcclxuXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU5DSUxcclxuICAgICAgICAgICAgICBpZiBAaXNQZW5jaWwgYW5kICAoQHBlblZhbHVlID09IGFjdGlvbi54KVxyXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gMFxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIEBpc1BlbmNpbCA9IHRydWVcclxuICAgICAgICAgICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi54XHJcblxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuVkFMVUVcclxuICAgICAgICAgICAgICBpZiBub3QgQGlzUGVuY2lsIGFuZCAoQHBlblZhbHVlID09IGFjdGlvbi54KVxyXG4gICAgICAgICAgICAgICAgQHBlblZhbHVlID0gMFxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIEBpc1BlbmNpbCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24ueFxyXG5cclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLk1FTlVcclxuICAgICAgICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXHJcbiAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5VTkRPXHJcbiAgICAgICAgICAgICAgQGdhbWUudW5kbygpXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5SRURPXHJcbiAgICAgICAgICAgICAgQGdhbWUucmVkbygpXHJcblxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICMgbm8gYWN0aW9uXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgICBAcGVuVmFsdWUgPSAwXHJcbiAgICAgICAgICBAaXNQZW5jaWwgPSBmYWxzZVxyXG5cclxuICAgICAgICBAZHJhdygpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSGVscGVyc1xyXG5cclxuICBjb25mbGljdHM6ICh4MSwgeTEsIHgyLCB5MikgLT5cclxuICAgICMgc2FtZSByb3cgb3IgY29sdW1uP1xyXG4gICAgaWYgKHgxID09IHgyKSB8fCAoeTEgPT0geTIpXHJcbiAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgIyBzYW1lIHNlY3Rpb24/XHJcbiAgICBzeDEgPSBNYXRoLmZsb29yKHgxIC8gMykgKiAzXHJcbiAgICBzeTEgPSBNYXRoLmZsb29yKHkxIC8gMykgKiAzXHJcbiAgICBzeDIgPSBNYXRoLmZsb29yKHgyIC8gMykgKiAzXHJcbiAgICBzeTIgPSBNYXRoLmZsb29yKHkyIC8gMykgKiAzXHJcbiAgICBpZiAoc3gxID09IHN4MikgJiYgKHN5MSA9PSBzeTIpXHJcbiAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VWaWV3XHJcbiIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xyXG5cclxuaW5pdCA9IC0+XHJcbiAgY29uc29sZS5sb2cgXCJpbml0XCJcclxuICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXHJcbiAgY2FudmFzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShjYW52YXMsIGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXSlcclxuICBjYW52YXNSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gIHdpbmRvdy5hcHAgPSBuZXcgQXBwKGNhbnZhcylcclxuXHJcbiAgIyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoc3RhcnRcIiwgKGUpIC0+XHJcbiAgIyAgIGNvbnNvbGUubG9nIE9iamVjdC5rZXlzKGUudG91Y2hlc1swXSlcclxuICAjICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgIyAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgIyAgIHdpbmRvdy5hcHAuY2xpY2soeCwgeSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgKGUpIC0+XHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAuY2xpY2soeCwgeSlcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XHJcbiAgICBpbml0KClcclxuLCBmYWxzZSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xMVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
