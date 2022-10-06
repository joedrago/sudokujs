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

  SudokuGame.prototype.pencilMarks = function(x, y) {
    var cell, i, l, marks;
    cell = this.grid[x][y];
    marks = [];
    for (i = l = 0; l < 9; i = ++l) {
      if (cell.pencil[i]) {
        marks.push(i + 1);
      }
    }
    return marks;
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
      this["do"](step.action, step.x, step.y, step.values, this.redoJournal);
      return [step.x, step.y];
    }
  };

  SudokuGame.prototype.redo = function() {
    var step;
    if (this.redoJournal.length > 0) {
      step = this.redoJournal.pop();
      this["do"](step.action, step.x, step.y, step.values, this.undoJournal);
      return [step.x, step.y];
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
    var i, index, j, k, l, n, o, p, q, ref, ref1, t;
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
    for (j = n = 0; n < 3; j = ++n) {
      for (i = o = 0; o < 3; i = ++o) {
        index = ((PEN_POS_Y + j) * 9) + (PEN_POS_X + i);
        this.actions[index] = {
          type: ActionType.PEN,
          value: 1 + (j * 3) + i
        };
      }
    }
    for (j = p = 0; p < 3; j = ++p) {
      for (i = q = 0; q < 3; i = ++q) {
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
    for (i = t = ref = (MODE_POS_Y * 9) + MODE_START_POS_X, ref1 = (MODE_POS_Y * 9) + MODE_END_POS_X; ref <= ref1 ? t <= ref1 : t >= ref1; i = ref <= ref1 ? ++t : --t) {
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

  SudokuView.prototype.chooseBackgroundColor = function(i, j, locked) {
    var color;
    color = null;
    if (locked) {
      color = Color.backgroundLocked;
    }
    if (this.mode === ModeType.HIGHLIGHTING) {
      if ((this.highlightX !== -1) && (this.highlightY !== -1)) {
        if ((i === this.highlightX) && (j === this.highlightY)) {
          if (locked) {
            color = Color.backgroundLockedSelected;
          } else {
            color = Color.backgroundSelected;
          }
        } else if (this.conflicts(i, j, this.highlightX, this.highlightY)) {
          if (locked) {
            color = Color.backgroundLockedConflicted;
          } else {
            color = Color.backgroundConflicted;
          }
        }
      }
    }
    return color;
  };

  SudokuView.prototype.drawCell = function(x, y, backgroundColor, s, font, color) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    this.app.drawTextCentered(s, px + (this.cellSize / 2), py + (this.cellSize / 2), font, color);
  };

  SudokuView.prototype.drawFlashCell = function(x, y) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    this.app.drawFill(px, py, this.cellSize, this.cellSize, "black");
  };

  SudokuView.prototype.drawUnsolvedCell = function(x, y, backgroundColor, marks) {
    var k, len, m, mx, my, px, py, text;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    for (k = 0, len = marks.length; k < len; k++) {
      m = marks[k];
      mx = px + ((m - 1) % 3) * this.cellSize / 3 + this.cellSize / 6;
      my = py + Math.floor((m - 1) / 3) * this.cellSize / 3 + this.cellSize / 6;
      text = String(m);
      this.app.drawTextCentered(text, mx, my, this.fonts.pencil, Color.pencil);
    }
  };

  SudokuView.prototype.drawSolvedCell = function(x, y, backgroundColor, color, value) {
    var px, py;
    px = x * this.cellSize;
    py = y * this.cellSize;
    if (backgroundColor !== null) {
      this.app.drawFill(px, py, this.cellSize, this.cellSize, backgroundColor);
    }
    this.app.drawTextCentered(String(value), px + (this.cellSize / 2), py + (this.cellSize / 2), this.fonts.pen, color);
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

  SudokuView.prototype.draw = function(flashX, flashY) {
    var backgroundColor, cell, currentValue, currentValueString, done, i, j, k, l, len, len1, link, marks, modeColor, modeText, n, o, p, pencilBackgroundColor, pencilColor, q, ref, ref1, textColor, valueBackgroundColor, valueColor;
    console.log("draw()");
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "black");
    this.app.drawFill(0, 0, this.cellSize * 9, this.canvas.height, "white");
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        if ((i === flashX) && (j === flashY)) {
          this.drawFlashCell(i, j);
        } else {
          cell = this.game.grid[i][j];
          backgroundColor = this.chooseBackgroundColor(i, j, cell.locked);
          if (cell.value === 0) {
            marks = this.game.pencilMarks(i, j);
            this.drawUnsolvedCell(i, j, backgroundColor, marks);
          } else {
            textColor = cell.error ? Color.error : Color.value;
            this.drawSolvedCell(i, j, backgroundColor, textColor, cell.value);
          }
        }
      }
    }
    if (this.mode === ModeType.LINKS) {
      ref = this.strongLinks;
      for (n = 0, len = ref.length; n < len; n++) {
        link = ref[n];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThick);
      }
      ref1 = this.weakLinks;
      for (o = 0, len1 = ref1.length; o < len1; o++) {
        link = ref1[o];
        this.drawLink(link[0].x, link[0].y, link[1].x, link[1].y, Color.links, this.lineWidthThin);
      }
    }
    done = this.game.done();
    for (j = p = 0; p < 3; j = ++p) {
      for (i = q = 0; q < 3; i = ++q) {
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
          this.highlightY = -1;
        } else {
          this.highlightX = action.x;
          this.highlightY = action.y;
        }
        return [];
      case ModeType.PENCIL:
        if (this.penValue === CLEAR) {
          this.game.clearPencil(action.x, action.y);
        } else if (this.penValue !== NONE) {
          this.game.togglePencil(action.x, action.y, this.penValue);
        }
        return [action.x, action.y];
      case ModeType.PEN:
        if (this.penValue === CLEAR) {
          this.game.setValue(action.x, action.y, 0);
        } else if (this.penValue !== NONE) {
          this.game.setValue(action.x, action.y, this.penValue);
        }
        return [action.x, action.y];
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
    var action, flashX, flashY, index, ref, ref1, ref2;
    x = Math.floor(x / this.cellSize);
    y = Math.floor(y / this.cellSize);
    flashX = null;
    flashY = null;
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
            ref = this.handleSelectAction(action), flashX = ref[0], flashY = ref[1];
            break;
          case ActionType.PENCIL:
            this.handlePencilAction(action);
            break;
          case ActionType.PEN:
            this.handlePenAction(action);
            break;
          case ActionType.UNDO:
            ref1 = this.handleUndoAction(), flashX = ref1[0], flashY = ref1[1];
            break;
          case ActionType.REDO:
            ref2 = this.handleRedoAction(), flashX = ref2[0], flashY = ref2[1];
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
      this.draw(flashX, flashY);
      if ((flashX != null) && (flashY != null)) {
        return setTimeout((function(_this) {
          return function() {
            return _this.draw();
          };
        })(this), 33);
      }
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
module.exports = "0.0.12";


},{}],8:[function(require,module,exports){
/* Font Face Observer v2.3.0 - © Bram Stein. License: BSD-3-Clause */(function(){function p(a,c){document.addEventListener?a.addEventListener("scroll",c,!1):a.attachEvent("scroll",c)}function u(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function b(){document.removeEventListener("DOMContentLoaded",b);a()}):document.attachEvent("onreadystatechange",function g(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",g),a()})};function w(a){this.g=document.createElement("div");this.g.setAttribute("aria-hidden","true");this.g.appendChild(document.createTextNode(a));this.h=document.createElement("span");this.i=document.createElement("span");this.m=document.createElement("span");this.j=document.createElement("span");this.l=-1;this.h.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.i.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.j.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.m.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.h.appendChild(this.m);this.i.appendChild(this.j);this.g.appendChild(this.h);this.g.appendChild(this.i)}
function x(a,c){a.g.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+c+";"}function B(a){var c=a.g.offsetWidth,b=c+100;a.j.style.width=b+"px";a.i.scrollLeft=b;a.h.scrollLeft=a.h.scrollWidth+100;return a.l!==c?(a.l=c,!0):!1}function C(a,c){function b(){var e=g;B(e)&&null!==e.g.parentNode&&c(e.l)}var g=a;p(a.h,b);p(a.i,b);B(a)};function D(a,c,b){c=c||{};b=b||window;this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal";this.context=b}var E=null,F=null,G=null,H=null;function I(a){null===F&&(M(a)&&/Apple/.test(window.navigator.vendor)?(a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent),F=!!a&&603>parseInt(a[1],10)):F=!1);return F}function M(a){null===H&&(H=!!a.document.fonts);return H}
function N(a,c){var b=a.style,g=a.weight;if(null===G){var e=document.createElement("div");try{e.style.font="condensed 100px sans-serif"}catch(q){}G=""!==e.style.font}return[b,g,G?a.stretch:"","100px",c].join(" ")}
D.prototype.load=function(a,c){var b=this,g=a||"BESbswy",e=0,q=c||3E3,J=(new Date).getTime();return new Promise(function(K,L){if(M(b.context)&&!I(b.context)){var O=new Promise(function(r,t){function h(){(new Date).getTime()-J>=q?t(Error(""+q+"ms timeout exceeded")):b.context.document.fonts.load(N(b,'"'+b.family+'"'),g).then(function(n){1<=n.length?r():setTimeout(h,25)},t)}h()}),P=new Promise(function(r,t){e=setTimeout(function(){t(Error(""+q+"ms timeout exceeded"))},q)});Promise.race([P,O]).then(function(){clearTimeout(e);
K(b)},L)}else u(function(){function r(){var d;if(d=-1!=k&&-1!=l||-1!=k&&-1!=m||-1!=l&&-1!=m)(d=k!=l&&k!=m&&l!=m)||(null===E&&(d=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),E=!!d&&(536>parseInt(d[1],10)||536===parseInt(d[1],10)&&11>=parseInt(d[2],10))),d=E&&(k==y&&l==y&&m==y||k==z&&l==z&&m==z||k==A&&l==A&&m==A)),d=!d;d&&(null!==f.parentNode&&f.parentNode.removeChild(f),clearTimeout(e),K(b))}function t(){if((new Date).getTime()-J>=q)null!==f.parentNode&&f.parentNode.removeChild(f),
L(Error(""+q+"ms timeout exceeded"));else{var d=b.context.document.hidden;if(!0===d||void 0===d)k=h.g.offsetWidth,l=n.g.offsetWidth,m=v.g.offsetWidth,r();e=setTimeout(t,50)}}var h=new w(g),n=new w(g),v=new w(g),k=-1,l=-1,m=-1,y=-1,z=-1,A=-1,f=document.createElement("div");f.dir="ltr";x(h,N(b,"sans-serif"));x(n,N(b,"serif"));x(v,N(b,"monospace"));f.appendChild(h.g);f.appendChild(n.g);f.appendChild(v.g);b.context.document.body.appendChild(f);y=h.g.offsetWidth;z=n.g.offsetWidth;A=v.g.offsetWidth;t();
C(h,function(d){k=d;r()});x(h,N(b,'"'+b.family+'",sans-serif'));C(n,function(d){l=d;r()});x(n,N(b,'"'+b.family+'",serif'));C(v,function(d){m=d;r()});x(v,N(b,'"'+b.family+'",monospace'))})})};"object"===typeof module?module.exports=D:(window.FontFaceObserver=D,window.FontFaceObserver.prototype.load=D.prototype.load);}());

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdUdlbmVyYXRvci5jb2ZmZWUiLCJnYW1lXFxzcmNcXFN1ZG9rdVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdB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QUFtQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVcsQ0FBQSxDQUFBLENBQTVEO0VBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO0VBRWIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFJLEdBQUosQ0FBUSxNQUFSO1NBUWIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQUMsQ0FBRDtBQUNuQyxRQUFBO0lBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztXQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEI7RUFIbUMsQ0FBckM7QUFoQks7O0FBcUJQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQ3ZCQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXHJcblxyXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXHJcblN1ZG9rdVZpZXcgPSByZXF1aXJlICcuL1N1ZG9rdVZpZXcnXHJcbnZlcnNpb24gPSByZXF1aXJlICcuL3ZlcnNpb24nXHJcblxyXG5jbGFzcyBBcHBcclxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBsb2FkRm9udChcInNheE1vbm9cIilcclxuICAgIEBmb250cyA9IHt9XHJcblxyXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxyXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAdmlld3MgPVxyXG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgICAgc3Vkb2t1OiBuZXcgU3Vkb2t1Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgbWVhc3VyZUZvbnRzOiAtPlxyXG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xyXG4gICAgICBAY3R4LmZvbnQgPSBmLnN0eWxlXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiXHJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgICBmLmhlaWdodCA9IE1hdGguZmxvb3IoQGN0eC5tZWFzdXJlVGV4dChcIm1cIikud2lkdGggKiAxLjEpICMgYmVzdCBoYWNrIGV2ZXJcclxuICAgICAgY29uc29sZS5sb2cgXCJGb250ICN7Zm9udE5hbWV9IG1lYXN1cmVkIGF0ICN7Zi5oZWlnaHR9IHBpeGVsc1wiXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVnaXN0ZXJGb250OiAobmFtZSwgc3R5bGUpIC0+XHJcbiAgICBmb250ID1cclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgICBzdHlsZTogc3R5bGVcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICBAZm9udHNbbmFtZV0gPSBmb250XHJcbiAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgIHJldHVybiBmb250XHJcblxyXG4gIGxvYWRGb250OiAoZm9udE5hbWUpIC0+XHJcbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXHJcbiAgICBmb250LmxvYWQoKS50aGVuID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiI3tmb250TmFtZX0gbG9hZGVkLCByZWRyYXdpbmcuLi5cIilcclxuICAgICAgQG1lYXN1cmVGb250cygpXHJcbiAgICAgIEBkcmF3KClcclxuXHJcbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XHJcbiAgICBAdmlldyA9IEB2aWV3c1t2aWV3XVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJhcHAubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcblxyXG4gICAgIyBAZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzQ0NDQ0NFwiKVxyXG4gICAgIyBAZHJhd1RleHRDZW50ZXJlZChcIkdlbmVyYXRpbmcsIHBsZWFzZSB3YWl0Li4uXCIsIEBjYW52YXMud2lkdGggLyAyLCBAY2FudmFzLmhlaWdodCAvIDIsIEBnZW5lcmF0aW5nRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgIyB3aW5kb3cuc2V0VGltZW91dCA9PlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgIyAsIDBcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAdmlld3Muc3Vkb2t1LnJlc2V0KClcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmhvbGVDb3VudCgpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAdmlldy5kcmF3KClcclxuXHJcbiAgY2xpY2s6ICh4LCB5KSAtPlxyXG4gICAgQHZpZXcuY2xpY2soeCwgeSlcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcclxuICAgIEBjdHgubGluZVRvKHgyLCB5MilcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgY3gsIGN5ICsgKGZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdMb3dlckxlZnQ6ICh0ZXh0LCBjb2xvciA9IFwid2hpdGVcIikgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd1ZlcnNpb246IChjb2xvciA9IFwid2hpdGVcIikgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxyXG4gICAgQGN0eC5maWxsVGV4dChcInYje3ZlcnNpb259XCIsIEBjYW52YXMud2lkdGggLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdBcmM6ICh4MSwgeTEsIHgyLCB5MiwgcmFkaXVzLCBjb2xvciwgbGluZVdpZHRoKSAtPlxyXG4gICAgIyBEZXJpdmVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2phbWJvbG8vZHJhd0FyYyBhdCA2YzNlMGQzXHJcblxyXG4gICAgUDEgPSB7IHg6IHgxLCB5OiB5MSB9XHJcbiAgICBQMiA9IHsgeDogeDIsIHk6IHkyIH1cclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgbWlkcG9pbnQgKE0pIGZyb20gUDEgdG8gUDJcclxuICAgIE0gPVxyXG4gICAgICB4OiAoUDEueCArIFAyLngpIC8gMlxyXG4gICAgICB5OiAoUDEueSArIFAyLnkpIC8gMlxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBkaXN0YW5jZSBmcm9tIE0gdG8gUDFcclxuICAgIGRNUDEgPSBNYXRoLnNxcnQoKFAxLnggLSBNLngpKihQMS54IC0gTS54KSArIChQMS55IC0gTS55KSooUDEueSAtIE0ueSkpXHJcblxyXG4gICAgIyBWYWxpZGF0ZSB0aGUgcmFkaXVzXHJcbiAgICBpZiBub3QgcmFkaXVzPyBvciByYWRpdXMgPCBkTVAxXHJcbiAgICAgIHJhZGl1cyA9IGRNUDFcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgdW5pdCB2ZWN0b3IgZnJvbSBNIHRvIFAxXHJcbiAgICB1TVAxID1cclxuICAgICAgeDogKFAxLnggLSBNLngpIC8gZE1QMVxyXG4gICAgICB5OiAoUDEueSAtIE0ueSkgLyBkTVAxXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIHVuaXQgdmVjdG9yIGZyb20gTSB0byBRIChqdXN0IHVNUDEgcm90YXRlZCBwaS8yKVxyXG4gICAgdU1RID0geyB4OiAtdU1QMS55LCB5OiB1TVAxLnggfVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZSAoQykgdG8gTVxyXG4gICAgZENNID0gTWF0aC5zcXJ0KHJhZGl1cypyYWRpdXMgLSBkTVAxKmRNUDEpXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gTSB0byBRXHJcbiAgICBkTVEgPSBkTVAxICogZE1QMSAvIGRDTVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiBRXHJcbiAgICBRID1cclxuICAgICAgeDogTS54ICsgdU1RLnggKiBkTVFcclxuICAgICAgeTogTS55ICsgdU1RLnkgKiBkTVFcclxuXHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmFyY1RvKFEueCwgUS55LCB4MiwgeTIsIHJhZGl1cylcclxuICAgIEBjdHguc3Ryb2tlKClcclxuICAgIHJldHVyblxyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cclxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxyXG4gIGlmIChoIDwgMiAqIHIpIHRoZW4gciA9IGggLyAyXHJcbiAgQGJlZ2luUGF0aCgpXHJcbiAgQG1vdmVUbyh4K3IsIHkpXHJcbiAgQGFyY1RvKHgrdywgeSwgICB4K3csIHkraCwgcilcclxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxyXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXHJcbiAgQGFyY1RvKHgsICAgeSwgICB4K3csIHksICAgcilcclxuICBAY2xvc2VQYXRoKClcclxuICByZXR1cm4gdGhpc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG5CVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIE1lbnVWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBuZXdFYXN5OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEVhc3lcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RWFzeS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld01lZGl1bTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBNZWRpdW1cIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3TWVkaXVtLmJpbmQodGhpcylcclxuICAgICAgbmV3SGFyZDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMilcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzMzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxyXG4gICAgICBuZXdFeHRyZW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEV4dHJlbWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MTExMVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RXh0cmVtZS5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc2V0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzNzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0LmJpbmQodGhpcylcclxuICAgICAgaW1wb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxyXG4gICAgICAgIHRleHQ6IFwiTG9hZCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAaW1wb3J0LmJpbmQodGhpcylcclxuICAgICAgZXhwb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxyXG4gICAgICAgIHRleHQ6IFwiU2hhcmUgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGV4cG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc3VtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNylcclxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNilcclxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgc3VidGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAc3VidGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3N1YnRpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXHJcblxyXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDA1XHJcblxyXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcclxuICAgIHkyID0geTEgKyBAY2FudmFzLmhlaWdodCAqIDAuMDZcclxuICAgIHkzID0geTIgKyBAY2FudmFzLmhlaWdodCAqIDAuMDZcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCArIHNoYWRvd09mZnNldCwgeTEgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCwgeTEsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkl0J3MgbGlrZSBTdWRva3UsIGJ1dCB5b3UgYXJlIHRoZSBiYWQgZ3V5LlwiLCB4LCB5MywgQHN1YnRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCArIHNoYWRvd09mZnNldCwgYnV0dG9uLnkgKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIFwiYmxhY2tcIiwgXCJibGFja1wiKVxyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcclxuXHJcbiAgICBAYXBwLmRyYXdMb3dlckxlZnQoXCIje0BhcHAuaG9sZUNvdW50KCl9LzgxXCIpXHJcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcclxuXHJcbiAgY2xpY2s6ICh4LCB5KSAtPlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXHJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcclxuICAgIHJldHVyblxyXG5cclxuICBuZXdFYXN5OiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcblxyXG4gIG5ld01lZGl1bTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0pXHJcblxyXG4gIG5ld0hhcmQ6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZClcclxuXHJcbiAgbmV3RXh0cmVtZTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lKVxyXG5cclxuICByZXNldDogLT5cclxuICAgIEBhcHAucmVzZXQoKVxyXG5cclxuICByZXN1bWU6IC0+XHJcbiAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgaWYgbmF2aWdhdG9yLnNoYXJlICE9IHVuZGVmaW5lZFxyXG4gICAgICBuYXZpZ2F0b3Iuc2hhcmUge1xyXG4gICAgICAgIHRpdGxlOiBcIlN1ZG9rdSBTaGFyZWQgR2FtZVwiXHJcbiAgICAgICAgdGV4dDogQGFwcC5leHBvcnQoKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVyblxyXG4gICAgd2luZG93LnByb21wdChcIkNvcHkgdGhpcyBhbmQgcGFzdGUgdG8gYSBmcmllbmQ6XCIsIEBhcHAuZXhwb3J0KCkpXHJcblxyXG4gIGltcG9ydDogLT5cclxuICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJQYXN0ZSBhbiBleHBvcnRlZCBnYW1lIGhlcmU6XCIsIFwiXCIpXHJcbiAgICBsb29wXHJcbiAgICAgIGlmIGltcG9ydFN0cmluZyA9PSBudWxsXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGlmIEBhcHAuaW1wb3J0KGltcG9ydFN0cmluZylcclxuICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIkludmFsaWQgZ2FtZSwgdHJ5IGFnYWluOlwiLCBcIlwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuXHJcbiMgUmV0dXJucyB0aGUgaW5kZXggb2YgYSBjZWxsIGluIHJvdyBtYWpvciBvcmRlciAodGhvdWdoIHRoZXkgYXJlIHN0b3JlZCBpbiBjb2x1bW4gbWFqb3Igb3JkZXIpXHJcbmNlbGxJbmRleCA9ICh4LCB5KSAtPiB5ICogOSArIHhcclxuXHJcbiMgU29ydCBieSBhc2NlbmRpbmcgbG9jYXRpb24gYW5kIHRoZW4gYnkgc3RyZW5ndGggKHN0cm9uZyB0aGVuIHdlYWspXHJcbmFzY2VuZGluZ0xpbmtTb3J0ID0gKGEsIGIpIC0+XHJcbiAgYTAgPSBjZWxsSW5kZXgoYS5jZWxsc1swXS54LCBhLmNlbGxzWzBdLnkpXHJcbiAgYTEgPSBjZWxsSW5kZXgoYS5jZWxsc1sxXS54LCBhLmNlbGxzWzFdLnkpXHJcbiAgYjAgPSBjZWxsSW5kZXgoYi5jZWxsc1swXS54LCBiLmNlbGxzWzBdLnkpXHJcbiAgYjEgPSBjZWxsSW5kZXgoYi5jZWxsc1sxXS54LCBiLmNlbGxzWzFdLnkpXHJcbiAgcmV0dXJuIGlmIGEwID4gYjAgb3IgKGEwID09IGIwIGFuZCAoYTEgPiBiMSBvciAoYTEgPT0gYjEgYW5kIChub3QgYS5zdHJvbmc/IGFuZCBiLnN0cm9uZz8pKSkpIHRoZW4gMSBlbHNlIC0xXHJcblxyXG4jIE5vdGUgc3RyZW5ndGggaXMgbm90IGNvbXBhcmVkXHJcbnVuaXF1ZUxpbmtGaWx0ZXIgPSAoZSwgaSwgYSkgLT5cclxuICBpZiBpID09IDBcclxuICAgIHJldHVybiB0cnVlXHJcbiAgcCA9IGFbaS0xXVxyXG4gIGUwID0gY2VsbEluZGV4KGUuY2VsbHNbMF0ueCwgZS5jZWxsc1swXS55KVxyXG4gIGUxID0gY2VsbEluZGV4KGUuY2VsbHNbMV0ueCwgZS5jZWxsc1sxXS55KVxyXG4gIHAwID0gY2VsbEluZGV4KHAuY2VsbHNbMF0ueCwgcC5jZWxsc1swXS55KVxyXG4gIHAxID0gY2VsbEluZGV4KHAuY2VsbHNbMV0ueCwgcC5jZWxsc1sxXS55KVxyXG4gIHJldHVybiBlMCAhPSBwMCBvciBlMSAhPSBwMVxyXG5cclxuZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zID0gKGNlbGxzKSAtPlxyXG4gIGxpbmtzID0gW11cclxuICBjb3VudCA9IGNlbGxzLmxlbmd0aFxyXG4gIGZvciBpIGluIFswLi4uY291bnQtMV1cclxuICAgIGZvciBqIGluIFtpKzEuLi5jb3VudF1cclxuICAgICAgbGlua3MucHVzaCh7IGNlbGxzOiBbY2VsbHNbaV0sIGNlbGxzW2pdXSB9KVxyXG4gIHJldHVybiBsaW5rc1xyXG5cclxuY2xhc3MgU3Vkb2t1R2FtZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGNsZWFyKClcclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBuZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmVhc3kpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgY2xlYXI6IC0+XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdID1cclxuICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICBlcnJvcjogZmFsc2VcclxuICAgICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcblxyXG4gICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgY291bnQgPSAwXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBub3QgQGdyaWRbaV1bal0ubG9ja2VkXHJcbiAgICAgICAgICBjb3VudCArPSAxXHJcbiAgICByZXR1cm4gY291bnRcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgZXhwb3J0U3RyaW5nID0gXCJTRFwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5sb2NrZWRcclxuICAgICAgICAgIGV4cG9ydFN0cmluZyArPSBcIiN7QGdyaWRbaV1bal0udmFsdWV9XCJcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIwXCJcclxuICAgIHJldHVybiBleHBvcnRTdHJpbmdcclxuXHJcbiAgdmFsaWRhdGU6IC0+XHJcbiAgICBib2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGJvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkW2ldW2pdID0gQGdyaWRbaV1bal0udmFsdWVcclxuXHJcbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yXHJcbiAgICByZXR1cm4gZ2VuZXJhdG9yLnZhbGlkYXRlR3JpZChib2FyZClcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmluZGV4T2YoXCJTRFwiKSAhPSAwXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxyXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnJlcGxhY2UoL1teMC05XS9nLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nLmxlbmd0aCAhPSA4MVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBAY2xlYXIoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0ubG9ja2VkID0gdHJ1ZVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSB2XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlIGlmIG5vdCBAdmFsaWRhdGUoKVxyXG5cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICB1cGRhdGVDZWxsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgeCAhPSBpXHJcbiAgICAgICAgdiA9IEBncmlkW2ldW3ldLnZhbHVlXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxyXG4gICAgICAgICAgICBAZ3JpZFtpXVt5XS5lcnJvciA9IHRydWVcclxuICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuXHJcbiAgICAgIGlmIHkgIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFt4XVtpXS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbeF1baV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcclxuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXHJcbiAgICAgICAgICB2ID0gQGdyaWRbc3ggKyBpXVtzeSArIGpdLnZhbHVlXHJcbiAgICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgICBAZ3JpZFtzeCArIGldW3N5ICsgal0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgICAgY2VsbC5lcnJvciA9IHRydWVcclxuICAgIHJldHVyblxyXG5cclxuICB1cGRhdGVDZWxsczogLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIEBncmlkW2ldW2pdLmVycm9yID0gZmFsc2VcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxyXG5cclxuICAgIEBzb2x2ZWQgPSB0cnVlXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5lcnJvclxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgPT0gMFxyXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXHJcblxyXG4gICAgIyBpZiBAc29sdmVkXHJcbiAgICAjICAgY29uc29sZS5sb2cgXCJzb2x2ZWQgI3tAc29sdmVkfVwiXHJcblxyXG4gICAgcmV0dXJuIEBzb2x2ZWRcclxuXHJcbiAgZG9uZTogLT5cclxuICAgIGQgPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGNvdW50cyA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS52YWx1ZSAhPSAwXHJcbiAgICAgICAgICBjb3VudHNbQGdyaWRbaV1bal0udmFsdWUtMV0gKz0gMVxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgY291bnRzW2ldID09IDlcclxuICAgICAgICBkW2ldID0gdHJ1ZVxyXG4gICAgcmV0dXJuIGRcclxuXHJcbiAgcGVuY2lsTWFya3M6ICh4LCB5KSAtPlxyXG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICBtYXJrcyA9IFtdXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNlbGwucGVuY2lsW2ldXHJcbiAgICAgICAgbWFya3MucHVzaCBpICsgMVxyXG4gICAgcmV0dXJuIG1hcmtzXHJcblxyXG4gIGRvOiAoYWN0aW9uLCB4LCB5LCB2YWx1ZXMsIGpvdXJuYWwpIC0+XHJcbiAgICBpZiB2YWx1ZXMubGVuZ3RoID4gMFxyXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgc3dpdGNoIGFjdGlvblxyXG4gICAgICAgIHdoZW4gXCJ0b2dnbGVQZW5jaWxcIlxyXG4gICAgICAgICAgam91cm5hbC5wdXNoIHsgYWN0aW9uOiBcInRvZ2dsZVBlbmNpbFwiLCB4OiB4LCB5OiB5LCB2YWx1ZXM6IHZhbHVlcyB9XHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFt2LTFdID0gIWNlbGwucGVuY2lsW3YtMV0gZm9yIHYgaW4gdmFsdWVzXHJcbiAgICAgICAgd2hlbiBcInNldFZhbHVlXCJcclxuICAgICAgICAgIGpvdXJuYWwucHVzaCB7IGFjdGlvbjogXCJzZXRWYWx1ZVwiLCB4OiB4LCB5OiB5LCB2YWx1ZXM6IFtjZWxsLnZhbHVlXSB9XHJcbiAgICAgICAgICBjZWxsLnZhbHVlID0gdmFsdWVzWzBdXHJcbiAgICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICAgIEBzYXZlKClcclxuXHJcbiAgdW5kbzogLT5cclxuICAgIGlmIChAdW5kb0pvdXJuYWwubGVuZ3RoID4gMClcclxuICAgICAgc3RlcCA9IEB1bmRvSm91cm5hbC5wb3AoKVxyXG4gICAgICBAZG8gc3RlcC5hY3Rpb24sIHN0ZXAueCwgc3RlcC55LCBzdGVwLnZhbHVlcywgQHJlZG9Kb3VybmFsXHJcbiAgICAgIHJldHVybiBbIHN0ZXAueCwgc3RlcC55IF1cclxuXHJcbiAgcmVkbzogLT5cclxuICAgIGlmIChAcmVkb0pvdXJuYWwubGVuZ3RoID4gMClcclxuICAgICAgc3RlcCA9IEByZWRvSm91cm5hbC5wb3AoKVxyXG4gICAgICBAZG8gc3RlcC5hY3Rpb24sIHN0ZXAueCwgc3RlcC55LCBzdGVwLnZhbHVlcywgQHVuZG9Kb3VybmFsXHJcbiAgICAgIHJldHVybiBbIHN0ZXAueCwgc3RlcC55IF1cclxuXHJcbiAgY2xlYXJQZW5jaWw6ICh4LCB5KSAtPlxyXG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICBpZiBjZWxsLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIEBkbyBcInRvZ2dsZVBlbmNpbFwiLCB4LCB5LCAoaSsxIGZvciBmbGFnLCBpIGluIGNlbGwucGVuY2lsIHdoZW4gZmxhZyksIEB1bmRvSm91cm5hbFxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgdG9nZ2xlUGVuY2lsOiAoeCwgeSwgdikgLT5cclxuICAgIGlmIEBncmlkW3hdW3ldLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIEBkbyBcInRvZ2dsZVBlbmNpbFwiLCB4LCB5LCBbdl0sIEB1bmRvSm91cm5hbFxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuXHJcbiAgc2V0VmFsdWU6ICh4LCB5LCB2KSAtPlxyXG4gICAgaWYgQGdyaWRbeF1beV0ubG9ja2VkXHJcbiAgICAgIHJldHVyblxyXG4gICAgQGRvIFwic2V0VmFsdWVcIiwgeCwgeSwgW3ZdLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJyZXNldCgpXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGlmIG5vdCBjZWxsLmxvY2tlZFxyXG4gICAgICAgICAgY2VsbC52YWx1ZSA9IDBcclxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcclxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXHJcbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXHJcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIGdldExpbmtzOiAodmFsdWUpIC0+XHJcbiAgICAjIE5vdGU6IHRoZSBzZWFyY2ggc29ydHMgdGhlIGxpbmtzIGluIHJvdyBtYWpvciBvcmRlciwgZmlyc3QgYnkgc3RhcnQgY2VsbCwgdGhlbiBieSBlbmQgY2VsbFxyXG4gICAgbGlua3MgPSBbXVxyXG5cclxuICAgICMgR2V0IHJvdyBsaW5rc1xyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBsaW5rcy5wdXNoIEBnZXRSb3dMaW5rcyh5LCB2YWx1ZSkuLi5cclxuXHJcbiAgICAjIEdldCBjb2x1bW4gbGlua3NcclxuICAgIGZvciB4IGluIFswLi4uOV1cclxuICAgICAgbGlua3MucHVzaCBAZ2V0Q29sdW1uTGlua3MoeCwgdmFsdWUpLi4uXHJcblxyXG4gICAgIyBHZXQgYm94IGxpbmtzXHJcbiAgICBmb3IgYm94WCBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBib3hZIGluIFswLi4uM11cclxuICAgICAgICBsaW5rcy5wdXNoIEBnZXRCb3hMaW5rcyhib3hYLCBib3hZLCB2YWx1ZSkuLi5cclxuXHJcbiAgICAjIFRoZSBib3ggbGlua3MgbWlnaHQgaGF2ZSBkdXBsaWNhdGVkIHNvbWUgcm93IGFuZCBjb2x1bW4gbGlua3MsIHNvIGR1cGxpY2F0ZXMgbXVzdCBiZSBmaWx0ZXJlZCBvdXQuIE5vdGUgdGhhdCBvbmx5XHJcbiAgICAjIGxvY2F0aW9ucyBhcmUgY29uc2lkZXJlZCB3aGVuIGZpbmRpbmcgZHVwbGljYXRlcywgYnV0IHN0cm9uZyBsaW5rcyB0YWtlIHByZWNlZGVuY2Ugd2hlbiBkdXBsaWNhdGVzIGFyZSByZW1vdmVkXHJcbiAgICAjIChiZWNhdXNlIHRoZXkgYXJlIG9yZGVyZWQgYmVmb3JlIHdlYWsgbGlua3MpLlxyXG4gICAgbGlua3MgPSBsaW5rcy5zb3J0KGFzY2VuZGluZ0xpbmtTb3J0KS5maWx0ZXIodW5pcXVlTGlua0ZpbHRlcilcclxuXHJcbiAgICBzdHJvbmcgPSBbXVxyXG4gICAgZm9yIGxpbmsgaW4gbGlua3NcclxuICAgICAgc3Ryb25nLnB1c2ggbGluay5jZWxscyBpZiBsaW5rLnN0cm9uZz9cclxuICAgIHdlYWsgPSBbXVxyXG4gICAgZm9yIGxpbmsgaW4gbGlua3NcclxuICAgICAgd2Vhay5wdXNoIGxpbmsuY2VsbHMgaWYgbm90IGxpbmsuc3Ryb25nP1xyXG5cclxuICAgIHJldHVybiB7IHN0cm9uZywgd2VhayB9XHJcblxyXG4gIGdldFJvd0xpbmtzOiAoeSwgdmFsdWUpLT5cclxuICAgIGNlbGxzID0gW11cclxuICAgIGZvciB4IGluIFswLi4uOV1cclxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cclxuICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxyXG5cclxuICAgIGlmIGNlbGxzLmxlbmd0aCA+IDFcclxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXHJcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgbGlua3NbMF0uc3Ryb25nID0gdHJ1ZVxyXG4gICAgZWxzZVxyXG4gICAgICBsaW5rcyA9IFtdXHJcbiAgICByZXR1cm4gbGlua3NcclxuXHJcbiAgZ2V0Q29sdW1uTGlua3M6ICh4LCB2YWx1ZSktPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxyXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXHJcblxyXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxyXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcclxuICAgICAgaWYgbGlua3MubGVuZ3RoID09IDFcclxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGxpbmtzID0gW11cclxuICAgIHJldHVybiBsaW5rc1xyXG5cclxuICBnZXRCb3hMaW5rczogKGJveFgsIGJveFksIHZhbHVlKSAtPlxyXG4gICAgY2VsbHMgPSBbXVxyXG4gICAgc3ggPSBib3hYICogM1xyXG4gICAgc3kgPSBib3hZICogM1xyXG4gICAgZm9yIHkgaW4gW3N5Li4uc3krM11cclxuICAgICAgZm9yIHggaW4gW3N4Li4uc3grM11cclxuICAgICAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuICAgICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXHJcbiAgICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxyXG5cclxuICAgIGlmIGNlbGxzLmxlbmd0aCA+IDFcclxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXHJcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgbGlua3NbMF0uc3Ryb25nID0gdHJ1ZVxyXG4gICAgZWxzZVxyXG4gICAgICBsaW5rcyA9IFtdXHJcbiAgICByZXR1cm4gbGlua3NcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgY2VsbC52YWx1ZSA9IDBcclxuICAgICAgICBjZWxsLmVycm9yID0gZmFsc2VcclxuICAgICAgICBjZWxsLmxvY2tlZCA9IGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxyXG5cclxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3IoKVxyXG4gICAgbmV3R3JpZCA9IGdlbmVyYXRvci5nZW5lcmF0ZShkaWZmaWN1bHR5KVxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm5ld0dyaWRcIiwgbmV3R3JpZFxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgbmV3R3JpZFtpXVtqXSAhPSAwXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IG5ld0dyaWRbaV1bal1cclxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcclxuICAgIEB1bmRvSm91cm5hbCA9IFtdXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG4gICAgQHVwZGF0ZUNlbGxzKClcclxuICAgIEBzYXZlKClcclxuXHJcbiAgbG9hZDogLT5cclxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcclxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGpzb25TdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVcIilcclxuICAgIGlmIGpzb25TdHJpbmcgPT0gbnVsbFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAjIGNvbnNvbGUubG9nIGpzb25TdHJpbmdcclxuICAgIGdhbWVEYXRhID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxyXG4gICAgIyBjb25zb2xlLmxvZyBcImZvdW5kIGdhbWVEYXRhXCIsIGdhbWVEYXRhXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgc3JjID0gZ2FtZURhdGEuZ3JpZFtpXVtqXVxyXG4gICAgICAgIGRzdCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgZHN0LnZhbHVlID0gc3JjLnZcclxuICAgICAgICBkc3QuZXJyb3IgPSBpZiBzcmMuZSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuICAgICAgICBkc3QubG9ja2VkID0gaWYgc3JjLmwgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgZHN0LnBlbmNpbFtrXSA9IGlmIHNyYy5wW2tdID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG5cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBnYW1lLlwiXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGdhbWVEYXRhID1cclxuICAgICAgZ3JpZDogbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgZ2FtZURhdGEuZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXHJcbiAgICAgICAgZ2FtZURhdGEuZ3JpZFtpXVtqXSA9XHJcbiAgICAgICAgICB2OiBjZWxsLnZhbHVlXHJcbiAgICAgICAgICBlOiBpZiBjZWxsLmVycm9yIHRoZW4gMSBlbHNlIDBcclxuICAgICAgICAgIGw6IGlmIGNlbGwubG9ja2VkIHRoZW4gMSBlbHNlIDBcclxuICAgICAgICAgIHA6IFtdXHJcbiAgICAgICAgZHN0ID0gZ2FtZURhdGEuZ3JpZFtpXVtqXS5wXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgZHN0LnB1c2goaWYgY2VsbC5wZW5jaWxba10gdGhlbiAxIGVsc2UgMClcclxuXHJcbiAgICBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWVcIiwganNvblN0cmluZylcclxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcclxuIiwic2h1ZmZsZSA9IChhKSAtPlxyXG4gICAgaSA9IGEubGVuZ3RoXHJcbiAgICB3aGlsZSAtLWkgPiAwXHJcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxyXG4gICAgICAgIHQgPSBhW2pdXHJcbiAgICAgICAgYVtqXSA9IGFbaV1cclxuICAgICAgICBhW2ldID0gdFxyXG4gICAgcmV0dXJuIGFcclxuXHJcbmNsYXNzIEJvYXJkXHJcbiAgY29uc3RydWN0b3I6IChvdGhlckJvYXJkID0gbnVsbCkgLT5cclxuICAgIEBsb2NrZWRDb3VudCA9IDA7XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBAbG9ja2VkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgICBAbG9ja2VkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcclxuICAgICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICBAbG9jayhpLCBqLCBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXSlcclxuICAgIHJldHVyblxyXG5cclxuICBtYXRjaGVzOiAob3RoZXJCb2FyZCkgLT5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdICE9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBsb2NrOiAoeCwgeSwgdiA9IHRydWUpIC0+XHJcbiAgICBpZiB2XHJcbiAgICAgIEBsb2NrZWRDb3VudCArPSAxIGlmIG5vdCBAbG9ja2VkW3hdW3ldXHJcbiAgICBlbHNlXHJcbiAgICAgIEBsb2NrZWRDb3VudCAtPSAxIGlmIEBsb2NrZWRbeF1beV1cclxuICAgIEBsb2NrZWRbeF1beV0gPSB2O1xyXG5cclxuXHJcbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxyXG4gIEBkaWZmaWN1bHR5OlxyXG4gICAgZWFzeTogMVxyXG4gICAgbWVkaXVtOiAyXHJcbiAgICBoYXJkOiAzXHJcbiAgICBleHRyZW1lOiA0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxyXG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cclxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgcmV0dXJuIG5ld0JvYXJkXHJcblxyXG4gIGdyaWRUb0JvYXJkOiAoZ3JpZCkgLT5cclxuICAgIGJvYXJkID0gbmV3IEJvYXJkXHJcbiAgICBmb3IgeSBpbiBbMC4uLjldXHJcbiAgICAgIGZvciB4IGluIFswLi4uOV1cclxuICAgICAgICBpZiBncmlkW3hdW3ldID4gMFxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFt4XVt5XSA9IGdyaWRbeF1beV1cclxuICAgICAgICAgIGJvYXJkLmxvY2soeCwgeSlcclxuICAgIHJldHVybiBib2FyZFxyXG5cclxuICBjZWxsVmFsaWQ6IChib2FyZCwgeCwgeSwgdikgLT5cclxuICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICByZXR1cm4gYm9hcmQuZ3JpZFt4XVt5XSA9PSB2XHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoeSAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbeF1baV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHBlbmNpbE1hcmtzOiAoYm9hcmQsIHgsIHkpIC0+XHJcbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgcmV0dXJuIFsgYm9hcmQuZ3JpZFt4XVt5XSBdXHJcbiAgICBtYXJrcyA9IFtdXHJcbiAgICBmb3IgdiBpbiBbMS4uOV1cclxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcclxuICAgICAgICBtYXJrcy5wdXNoIHZcclxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcclxuICAgICAgc2h1ZmZsZShtYXJrcylcclxuICAgIHJldHVybiBtYXJrc1xyXG5cclxuICBuZXh0QXR0ZW1wdDogKGJvYXJkLCBhdHRlbXB0cykgLT5cclxuICAgIHJlbWFpbmluZ0luZGV4ZXMgPSBbMC4uLjgxXVxyXG5cclxuICAgICMgc2tpcCBsb2NrZWQgY2VsbHNcclxuICAgIGZvciBpbmRleCBpbiBbMC4uLjgxXVxyXG4gICAgICB4ID0gaW5kZXggJSA5XHJcbiAgICAgIHkgPSBpbmRleCAvLyA5XHJcbiAgICAgIGlmIGJvYXJkLmxvY2tlZFt4XVt5XVxyXG4gICAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoaW5kZXgpXHJcbiAgICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXHJcblxyXG4gICAgIyBza2lwIGNlbGxzIHRoYXQgYXJlIGFscmVhZHkgYmVpbmcgdHJpZWRcclxuICAgIGZvciBhIGluIGF0dGVtcHRzXHJcbiAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoYS5pbmRleClcclxuICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXHJcblxyXG4gICAgcmV0dXJuIG51bGwgaWYgcmVtYWluaW5nSW5kZXhlcy5sZW5ndGggPT0gMCAjIGFib3J0IGlmIHRoZXJlIGFyZSBubyBjZWxscyAoc2hvdWxkIG5ldmVyIGhhcHBlbilcclxuXHJcbiAgICBmZXdlc3RJbmRleCA9IC0xXHJcbiAgICBmZXdlc3RNYXJrcyA9IFswLi45XVxyXG4gICAgZm9yIGluZGV4IGluIHJlbWFpbmluZ0luZGV4ZXNcclxuICAgICAgeCA9IGluZGV4ICUgOVxyXG4gICAgICB5ID0gaW5kZXggLy8gOVxyXG4gICAgICBtYXJrcyA9IEBwZW5jaWxNYXJrcyhib2FyZCwgeCwgeSlcclxuXHJcbiAgICAgICMgYWJvcnQgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggbm8gcG9zc2liaWxpdGllc1xyXG4gICAgICByZXR1cm4gbnVsbCBpZiBtYXJrcy5sZW5ndGggPT0gMFxyXG5cclxuICAgICAgIyBkb25lIGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG9ubHkgb25lIHBvc3NpYmlsaXR5ICgpXHJcbiAgICAgIHJldHVybiB7IGluZGV4OiBpbmRleCwgcmVtYWluaW5nOiBtYXJrcyB9IGlmIG1hcmtzLmxlbmd0aCA9PSAxXHJcblxyXG4gICAgICAjIHJlbWVtYmVyIHRoaXMgY2VsbCBpZiBpdCBoYXMgdGhlIGZld2VzdCBtYXJrcyBzbyBmYXJcclxuICAgICAgaWYgbWFya3MubGVuZ3RoIDwgZmV3ZXN0TWFya3MubGVuZ3RoXHJcbiAgICAgICAgZmV3ZXN0SW5kZXggPSBpbmRleFxyXG4gICAgICAgIGZld2VzdE1hcmtzID0gbWFya3NcclxuICAgIHJldHVybiB7IGluZGV4OiBmZXdlc3RJbmRleCwgcmVtYWluaW5nOiBmZXdlc3RNYXJrcyB9XHJcblxyXG4gIHNvbHZlOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBhdHRlbXB0cyA9IFtdXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cylcclxuXHJcbiAgaGFzVW5pcXVlU29sdXRpb246IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIGF0dGVtcHRzID0gW11cclxuXHJcbiAgICAjIGlmIHRoZXJlIGlzIG5vIHNvbHV0aW9uLCByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiBmYWxzZSBpZiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKSA9PSBudWxsXHJcblxyXG4gICAgdW5sb2NrZWRDb3VudCA9IDgxIC0gc29sdmVkLmxvY2tlZENvdW50XHJcblxyXG4gICAgIyBpZiB0aGVyZSBhcmUgbm8gdW5sb2NrZWQgY2VsbHMsIHRoZW4gdGhpcyBzb2x1dGlvbiBtdXN0IGJlIHVuaXF1ZVxyXG4gICAgcmV0dXJuIHRydWUgaWYgdW5sb2NrZWRDb3VudCA9PSAwXHJcblxyXG4gICAgIyBjaGVjayBmb3IgYSBzZWNvbmQgc29sdXRpb25cclxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzLCB1bmxvY2tlZENvdW50LTEpID09IG51bGxcclxuXHJcbiAgc29sdmVJbnRlcm5hbDogKHNvbHZlZCwgYXR0ZW1wdHMsIHdhbGtJbmRleCA9IDApIC0+XHJcbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcclxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcclxuICAgICAgaWYgd2Fsa0luZGV4ID49IGF0dGVtcHRzLmxlbmd0aFxyXG4gICAgICAgIGF0dGVtcHQgPSBAbmV4dEF0dGVtcHQoc29sdmVkLCBhdHRlbXB0cylcclxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYXR0ZW1wdCA9IGF0dGVtcHRzW3dhbGtJbmRleF1cclxuXHJcbiAgICAgIGlmIGF0dGVtcHQgIT0gbnVsbFxyXG4gICAgICAgIHggPSBhdHRlbXB0LmluZGV4ICUgOVxyXG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcclxuICAgICAgICBpZiBhdHRlbXB0LnJlbWFpbmluZy5sZW5ndGggPiAwXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IGF0dGVtcHQucmVtYWluaW5nLnBvcCgpXHJcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGF0dGVtcHRzLnBvcCgpXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcclxuICAgICAgICAgIHdhbGtJbmRleCAtPSAxXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB3YWxrSW5kZXggLT0gMVxyXG5cclxuICAgICAgaWYgd2Fsa0luZGV4IDwgMFxyXG4gICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgcmV0dXJuIHNvbHZlZFxyXG5cclxuICBnZW5lcmF0ZUludGVybmFsOiAoYW1vdW50VG9SZW1vdmUpIC0+XHJcbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcclxuICAgICMgaGFja1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxyXG5cclxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXHJcbiAgICByZW1vdmVkID0gMFxyXG4gICAgd2hpbGUgcmVtb3ZlZCA8IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxyXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxyXG4gICAgICByeSA9IE1hdGguZmxvb3IocmVtb3ZlSW5kZXggLyA5KVxyXG5cclxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgICBuZXh0Qm9hcmQuZ3JpZFtyeF1bcnldID0gMFxyXG4gICAgICBuZXh0Qm9hcmQubG9jayhyeCwgcnksIGZhbHNlKVxyXG5cclxuICAgICAgaWYgQGhhc1VuaXF1ZVNvbHV0aW9uKG5leHRCb2FyZClcclxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxyXG4gICAgICAgIHJlbW92ZWQgKz0gMVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJzdWNjZXNzZnVsbHkgcmVtb3ZlZCAje3J4fSwje3J5fVwiXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib2FyZDogYm9hcmRcclxuICAgICAgcmVtb3ZlZDogcmVtb3ZlZFxyXG4gICAgfVxyXG5cclxuICBnZW5lcmF0ZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZCAgICB0aGVuIDUyXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XHJcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxyXG5cclxuICAgIGJlc3QgPSBudWxsXHJcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXHJcbiAgICAgIGdlbmVyYXRlZCA9IEBnZW5lcmF0ZUludGVybmFsKGFtb3VudFRvUmVtb3ZlKVxyXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGlmIGJlc3QgPT0gbnVsbFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiZ2l2aW5nIHVzZXIgYm9hcmQ6ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcclxuXHJcbiAgdmFsaWRhdGVHcmlkOiAoZ3JpZCkgLT5cclxuICAgIHJldHVybiBAaGFzVW5pcXVlU29sdXRpb24oQGdyaWRUb0JvYXJkKGdyaWQpKVxyXG5cclxuICBzb2x2ZVN0cmluZzogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYm9hcmQgPSBuZXcgQm9hcmQoKVxyXG5cclxuICAgIGluZGV4ID0gMFxyXG4gICAgemVyb0NoYXJDb2RlID0gXCIwXCIuY2hhckNvZGVBdCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgdiA9IGltcG9ydFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSAtIHplcm9DaGFyQ29kZVxyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgYm9hcmQuZ3JpZFtqXVtpXSA9IHZcclxuICAgICAgICAgIGJvYXJkLmxvY2soaiwgaSlcclxuXHJcbiAgICBzb2x2ZWQgPSBAc29sdmUoYm9hcmQpXHJcbiAgICBpZiBzb2x2ZWQgPT0gbnVsbFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQm9hcmQgc29sdmUgbm90IHVuaXF1ZS5cIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBhbnN3ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBhbnN3ZXJTdHJpbmcgKz0gXCIje3NvbHZlZC5ncmlkW2pdW2ldfSBcIlxyXG4gICAgICBhbnN3ZXJTdHJpbmcgKz0gXCJcXG5cIlxyXG5cclxuICAgIHJldHVybiBhbnN3ZXJTdHJpbmdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5TdWRva3VHYW1lID0gcmVxdWlyZSAnLi9TdWRva3VHYW1lJ1xyXG5cclxuUEVOX1BPU19YID0gMVxyXG5QRU5fUE9TX1kgPSAxMFxyXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXHJcblBFTl9DTEVBUl9QT1NfWSA9IDEzXHJcblxyXG5QRU5DSUxfUE9TX1ggPSA1XHJcblBFTkNJTF9QT1NfWSA9IDEwXHJcblBFTkNJTF9DTEVBUl9QT1NfWCA9IDZcclxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcclxuXHJcbk1FTlVfUE9TX1ggPSA0XHJcbk1FTlVfUE9TX1kgPSAxM1xyXG5cclxuTU9ERV9TVEFSVF9QT1NfWCA9IDJcclxuTU9ERV9DRU5URVJfUE9TX1ggPSA0XHJcbk1PREVfRU5EX1BPU19YID0gNlxyXG5NT0RFX1BPU19ZID0gOVxyXG5cclxuVU5ET19QT1NfWCA9IDBcclxuVU5ET19QT1NfWSA9IDEzXHJcblJFRE9fUE9TX1ggPSA4XHJcblJFRE9fUE9TX1kgPSAxM1xyXG5cclxuQ29sb3IgPVxyXG4gIHZhbHVlOiBcImJsYWNrXCJcclxuICBwZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXHJcbiAgZG9uZTogXCIjY2NjY2NjXCJcclxuICBtZW51OiBcIiMwMDg4MzNcIlxyXG4gIGxpbmtzOiBcIiNjYzMzMzNcIlxyXG4gIGJhY2tncm91bmRTZWxlY3RlZDogXCIjZWVlZWFhXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkOiBcIiNlZWVlZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxyXG4gIGJhY2tncm91bmRMb2NrZWRTZWxlY3RlZDogXCIjZWVlZWRkXCJcclxuICBiYWNrZ3JvdW5kQ29uZmxpY3RlZDogXCIjZmZmZmRkXCJcclxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXHJcbiAgbW9kZVNlbGVjdDogXCIjNzc3NzQ0XCJcclxuICBtb2RlUGVuOiBcIiMwMDAwMDBcIlxyXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXHJcbiAgbW9kZUxpbmtzOiBcIiNjYzMzMzNcIlxyXG5cclxuQWN0aW9uVHlwZSA9XHJcbiAgU0VMRUNUOiAwXHJcbiAgUEVOQ0lMOiAxXHJcbiAgUEVOOiAyXHJcbiAgTUVOVTogM1xyXG4gIFVORE86IDRcclxuICBSRURPOiA1XHJcbiAgTU9ERTogNlxyXG5cclxuTW9kZVR5cGUgPVxyXG4gIEhJR0hMSUdIVElORzogMFxyXG4gIFBFTkNJTDogMVxyXG4gIFBFTjogMlxyXG4gIExJTktTOiAzXHJcblxyXG4jIFNwZWNpYWwgcGVuL3BlbmNpbCB2YWx1ZXNcclxuTk9ORSA9IDBcclxuQ0xFQVIgPSAxMFxyXG5cclxuY2xhc3MgU3Vkb2t1Vmlld1xyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5pdFxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxyXG5cclxuICAgIHdpZHRoQmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMud2lkdGggLyA5XHJcbiAgICBoZWlnaHRCYXNlZENlbGxTaXplID0gQGNhbnZhcy5oZWlnaHQgLyAxNFxyXG4gICAgY29uc29sZS5sb2cgXCJ3aWR0aEJhc2VkQ2VsbFNpemUgI3t3aWR0aEJhc2VkQ2VsbFNpemV9IGhlaWdodEJhc2VkQ2VsbFNpemUgI3toZWlnaHRCYXNlZENlbGxTaXplfVwiXHJcbiAgICBAY2VsbFNpemUgPSBNYXRoLm1pbih3aWR0aEJhc2VkQ2VsbFNpemUsIGhlaWdodEJhc2VkQ2VsbFNpemUpXHJcblxyXG4gICAgIyBjYWxjIHJlbmRlciBjb25zdGFudHNcclxuICAgIEBsaW5lV2lkdGhUaGluID0gMVxyXG4gICAgQGxpbmVXaWR0aFRoaWNrID0gTWF0aC5tYXgoQGNlbGxTaXplIC8gMjAsIDMpXHJcblxyXG4gICAgZm9udFBpeGVsc1MgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuMylcclxuICAgIGZvbnRQaXhlbHNNID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjUpXHJcbiAgICBmb250UGl4ZWxzTCA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC44KVxyXG5cclxuICAgICMgaW5pdCBmb250c1xyXG4gICAgQGZvbnRzID1cclxuICAgICAgcGVuY2lsOiAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5jaWxcIiwgIFwiI3tmb250UGl4ZWxzU31weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgICAgbWVudTogICAgQGFwcC5yZWdpc3RlckZvbnQoXCJtZW51XCIsICAgIFwiI3tmb250UGl4ZWxzTX1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgICAgcGVuOiAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJwZW5cIiwgICAgIFwiI3tmb250UGl4ZWxzTH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAaW5pdEFjdGlvbnMoKVxyXG5cclxuICAgICMgaW5pdCBzdGF0ZVxyXG4gICAgQGdhbWUgPSBuZXcgU3Vkb2t1R2FtZSgpXHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcblxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBpbml0QWN0aW9uczogLT5cclxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGluZGV4ID0gKGogKiA5KSArIGlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuU0VMRUNULCB4OiBpLCB5OiBqIH1cclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU4sIHZhbHVlOiAxICsgKGogKiAzKSArIGkgfVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGluZGV4ID0gKChQRU5DSUxfUE9TX1kgKyBqKSAqIDkpICsgKFBFTkNJTF9QT1NfWCArIGkpXHJcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgdmFsdWU6IDEgKyAoaiAqIDMpICsgaSB9XHJcblxyXG4gICAgIyBQZW4gY2xlYXIgYnV0dG9uXHJcbiAgICBpbmRleCA9IChQRU5fQ0xFQVJfUE9TX1kgKiA5KSArIFBFTl9DTEVBUl9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTiwgdmFsdWU6IENMRUFSIH1cclxuXHJcbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTkNJTF9DTEVBUl9QT1NfWSAqIDkpICsgUEVOQ0lMX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB2YWx1ZTogQ0xFQVIgfVxyXG5cclxuICAgICMgTWVudSBidXR0b25cclxuICAgIGluZGV4ID0gKE1FTlVfUE9TX1kgKiA5KSArIE1FTlVfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5NRU5VIH1cclxuXHJcbiAgICAjIFVuZG8gYnV0dG9uXHJcbiAgICBpbmRleCA9IChVTkRPX1BPU19ZICogOSkgKyBVTkRPX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuVU5ETyB9XHJcblxyXG4gICAgIyBSZWRvIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoUkVET19QT1NfWSAqIDkpICsgUkVET19QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlJFRE8gfVxyXG5cclxuICAgICMgTW9kZSBzd2l0Y2hcclxuICAgIGZvciBpIGluIFsoTU9ERV9QT1NfWSo5KStNT0RFX1NUQVJUX1BPU19YLi4oTU9ERV9QT1NfWSo5KStNT0RFX0VORF9QT1NfWF1cclxuICAgICAgQGFjdGlvbnNbaV0gPSB7IHR5cGU6IEFjdGlvblR5cGUuTU9ERSB9XHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0U3RhdGU6IC0+XHJcbiAgICBAbW9kZSA9IE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgQHBlblZhbHVlID0gTk9ORVxyXG4gICAgQGhpZ2hsaWdodFggPSAtMVxyXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgIEB3ZWFrTGlua3MgPSBbXVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIFJlbmRlcmluZ1xyXG5cclxuICBjaG9vc2VCYWNrZ3JvdW5kQ29sb3I6IChpLCBqLCBsb2NrZWQpIC0+XHJcbiAgICBjb2xvciA9IG51bGxcclxuICAgIGlmIGxvY2tlZFxyXG4gICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRcclxuXHJcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgaWYgKEBoaWdobGlnaHRYICE9IC0xKSAmJiAoQGhpZ2hsaWdodFkgIT0gLTEpXHJcbiAgICAgICAgaWYgKGkgPT0gQGhpZ2hsaWdodFgpICYmIChqID09IEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgaWYgbG9ja2VkXHJcbiAgICAgICAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgZWxzZSBpZiBAY29uZmxpY3RzKGksIGosIEBoaWdobGlnaHRYLCBAaGlnaGxpZ2h0WSlcclxuICAgICAgICAgIGlmIGxvY2tlZFxyXG4gICAgICAgICAgICBjb2xvciA9IENvbG9yLmJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZENvbmZsaWN0ZWRcclxuICAgIHJldHVybiBjb2xvclxyXG5cclxuICBkcmF3Q2VsbDogKHgsIHksIGJhY2tncm91bmRDb2xvciwgcywgZm9udCwgY29sb3IpIC0+XHJcbiAgICBweCA9IHggKiBAY2VsbFNpemVcclxuICAgIHB5ID0geSAqIEBjZWxsU2l6ZVxyXG4gICAgaWYgYmFja2dyb3VuZENvbG9yICE9IG51bGxcclxuICAgICAgQGFwcC5kcmF3RmlsbChweCwgcHksIEBjZWxsU2l6ZSwgQGNlbGxTaXplLCBiYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQocywgcHggKyAoQGNlbGxTaXplIC8gMiksIHB5ICsgKEBjZWxsU2l6ZSAvIDIpLCBmb250LCBjb2xvcilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3Rmxhc2hDZWxsOiAoeCwgeSkgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIFwiYmxhY2tcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3VW5zb2x2ZWRDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBtYXJrcykgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIGZvciBtIGluIG1hcmtzXHJcbiAgICAgIG14ID0gcHggKyAoKG0gLSAxKSAlIDMpICogQGNlbGxTaXplIC8gMyArIEBjZWxsU2l6ZSAvIDZcclxuICAgICAgbXkgPSBweSArIE1hdGguZmxvb3IoKG0gLSAxKSAvIDMpICogQGNlbGxTaXplIC8gMyArIEBjZWxsU2l6ZSAvIDZcclxuICAgICAgdGV4dCA9IFN0cmluZyhtKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dCwgbXgsIG15LCBAZm9udHMucGVuY2lsLCBDb2xvci5wZW5jaWwpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1NvbHZlZENlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIGNvbG9yLCB2YWx1ZSkgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChTdHJpbmcodmFsdWUpLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIEBmb250cy5wZW4sIGNvbG9yKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XHJcbiAgICBmb3IgaSBpbiBbMC4uc2l6ZV1cclxuICAgICAgY29sb3IgPSBpZiBzb2x2ZWQgdGhlbiBcImdyZWVuXCIgZWxzZSBcImJsYWNrXCJcclxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cclxuICAgICAgaWYgKChzaXplID09IDEpIHx8IChpICUgMykgPT0gMClcclxuICAgICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpY2tcclxuXHJcbiAgICAgICMgSG9yaXpvbnRhbCBsaW5lc1xyXG4gICAgICBAYXBwLmRyYXdMaW5lKEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgMCksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIEBjZWxsU2l6ZSAqIChvcmlnaW5YICsgc2l6ZSksIEBjZWxsU2l6ZSAqIChvcmlnaW5ZICsgaSksIGNvbG9yLCBsaW5lV2lkdGgpXHJcblxyXG4gICAgICAjIFZlcnRpY2FsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBzaXplKSwgY29sb3IsIGxpbmVXaWR0aClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3TGluazogKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZLCBjb2xvciwgbGluZVdpZHRoKSAtPlxyXG4gICAgeDEgPSAoc3RhcnRYICsgMC41KSAqIEBjZWxsU2l6ZVxyXG4gICAgeTEgPSAoc3RhcnRZICsgMC41KSAqIEBjZWxsU2l6ZVxyXG4gICAgeDIgPSAoZW5kWCArIDAuNSkgKiBAY2VsbFNpemVcclxuICAgIHkyID0gKGVuZFkgKyAwLjUpICogQGNlbGxTaXplXHJcbiAgICByID0gMi4yICogTWF0aC5zcXJ0KCh4MiAtIHgxKSAqICh4MiAtIHgxKSArICh5MiAtIHkxKSAqICh5MiAtIHkxKSkgIyAyLjIgZ2l2ZXMgdGhlIG1vc3QgY3VydmUgd2l0aG91dCBnb2luZyBvZmYgdGhlIGJvYXJkXHJcbiAgICBAYXBwLmRyYXdBcmMoeDEsIHkxLCB4MiwgeTIsIHIsIGNvbG9yLCBsaW5lV2lkdGgpXHJcblxyXG4gIGRyYXc6IChmbGFzaFgsIGZsYXNoWSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxyXG5cclxuICAgICMgTWFrZSB3aGl0ZSBwaG9uZS1zaGFwZWQgYmFja2dyb3VuZFxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxyXG5cclxuICAgICMgRHJhdyBib2FyZCBudW1iZXJzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiAoaSA9PSBmbGFzaFgpICYmIChqID09IGZsYXNoWSlcclxuICAgICAgICAgICMgRHJhdyBmbGFzaFxyXG4gICAgICAgICAgQGRyYXdGbGFzaENlbGwoaSwgailcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIERyYXcgc29sdmVkIG9yIHVuc29sdmVkIGNlbGxcclxuICAgICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXHJcblxyXG4gICAgICAgICAgIyBEZXRlcm1pbmUgYmFja2dyb3VuZCBjb2xvclxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQGNob29zZUJhY2tncm91bmRDb2xvcihpLCBqLCBjZWxsLmxvY2tlZClcclxuXHJcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcclxuICAgICAgICAgICAgbWFya3MgPSBAZ2FtZS5wZW5jaWxNYXJrcyhpLCBqKVxyXG4gICAgICAgICAgICBAZHJhd1Vuc29sdmVkQ2VsbChpLCBqLCBiYWNrZ3JvdW5kQ29sb3IsIG1hcmtzKVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBpZiBjZWxsLmVycm9yIHRoZW4gQ29sb3IuZXJyb3IgZWxzZSBDb2xvci52YWx1ZVxyXG4gICAgICAgICAgICBAZHJhd1NvbHZlZENlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCB0ZXh0Q29sb3IsIGNlbGwudmFsdWUpXHJcblxyXG4gICAgIyBEcmF3IGxpbmtzIGluIExJTktTIG1vZGVcclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIGZvciBsaW5rIGluIEBzdHJvbmdMaW5rc1xyXG4gICAgICAgIEBkcmF3TGluayhsaW5rWzBdLngsIGxpbmtbMF0ueSwgbGlua1sxXS54LCBsaW5rWzFdLnksIENvbG9yLmxpbmtzLCBAbGluZVdpZHRoVGhpY2spXHJcbiAgICAgIGZvciBsaW5rIGluIEB3ZWFrTGlua3NcclxuICAgICAgICBAZHJhd0xpbmsobGlua1swXS54LCBsaW5rWzBdLnksIGxpbmtbMV0ueCwgbGlua1sxXS55LCBDb2xvci5saW5rcywgQGxpbmVXaWR0aFRoaW4pXHJcblxyXG4gICAgIyBEcmF3IHBlbiBhbmQgcGVuY2lsIG51bWJlciBidXR0b25zXHJcbiAgICBkb25lID0gQGdhbWUuZG9uZSgpXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBjdXJyZW50VmFsdWUgPSAoaiAqIDMpICsgaSArIDFcclxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxyXG4gICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci52YWx1ZVxyXG4gICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IucGVuY2lsXHJcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cclxuICAgICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci5kb25lXHJcbiAgICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLmRvbmVcclxuXHJcbiAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcclxuICAgICAgICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTCBvciBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTkNJTF9QT1NfWCArIGksIFBFTkNJTF9QT1NfWSArIGosIHBlbmNpbEJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCBwZW5jaWxDb2xvcilcclxuXHJcbiAgICAjIERyYXcgcGVuIGFuZCBwZW5jaWwgQ0xFQVIgYnV0dG9uc1xyXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG5cclxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcblxyXG4gICAgIyBEcmF3IG1vZGVcclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVTZWxlY3RcclxuICAgICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlUGVuY2lsXHJcbiAgICAgICAgbW9kZVRleHQgPSBcIlBlbmNpbFwiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlblxyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5cIlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZUxpbmtzXHJcbiAgICAgICAgbW9kZVRleHQgPSBcIkxpbmtzXCJcclxuICAgIEBkcmF3Q2VsbChNT0RFX0NFTlRFUl9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5tZW51LCBtb2RlQ29sb3IpXHJcblxyXG4gICAgQGRyYXdDZWxsKE1FTlVfUE9TX1gsIE1FTlVfUE9TX1ksIG51bGwsIFwiTWVudVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSlcclxuICAgIEBkcmF3Q2VsbChVTkRPX1BPU19YLCBVTkRPX1BPU19ZLCBudWxsLCBcIlxcdXsyNWM0fVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSkgaWYgKEBnYW1lLnVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG5cclxuICAgICMgTWFrZSB0aGUgZ3JpZHNcclxuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXHJcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX1BPU19YLCBQRU5DSUxfUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5wdXRcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIlN1ZG9rdVZpZXcubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcbiAgICBAZ2FtZS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUucmVzZXQoKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcbiAgICByZXR1cm4gQGdhbWUuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLmV4cG9ydCgpXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5ob2xlQ291bnQoKVxyXG5cclxuICBoYW5kbGVTZWxlY3RBY3Rpb246IChhY3Rpb24pIC0+XHJcbiAgICBzd2l0Y2ggQG1vZGVcclxuICAgICAgd2hlbiBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcclxuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IGFjdGlvbi54XHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XHJcbiAgICAgICAgcmV0dXJuIFtdXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IENMRUFSXHJcbiAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXHJcbiAgICAgICAgZWxzZSBpZiBAcGVuVmFsdWUgIT0gTk9ORVxyXG4gICAgICAgICAgQGdhbWUudG9nZ2xlUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG4gICAgICAgIHJldHVybiBbIGFjdGlvbi54LCBhY3Rpb24ueSBdXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IENMRUFSXHJcbiAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIDApXHJcbiAgICAgICAgZWxzZSBpZiBAcGVuVmFsdWUgIT0gTk9ORVxyXG4gICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuIFsgYWN0aW9uLngsIGFjdGlvbi55IF1cclxuXHJcbiAgaGFuZGxlUGVuY2lsQWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgIyBJbiBMSU5LUyBtb2RlLCBhbGwgbGlua3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBudW1iZXIgYXJlIHNob3duLiBDTEVBUiBzaG93cyBub3RoaW5nLlxyXG4gICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcclxuICAgICAgaWYgKGFjdGlvbi52YWx1ZSA9PSBDTEVBUilcclxuICAgICAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICAgICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG4gICAgICAgIHsgc3Ryb25nOiBAc3Ryb25nTGlua3MsIHdlYWs6IEB3ZWFrTGlua3MgfSA9IEBnYW1lLmdldExpbmtzKGFjdGlvbi52YWx1ZSlcclxuXHJcbiAgICAjIEluIFBFTkNJTCBtb2RlLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIEhJR0hMSUdIVElORyBpZiB0aGUgc2VsZWN0ZWQgdmFsdWUgaXMgYWxyZWFkeSBjdXJyZW50XHJcbiAgICBlbHNlIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTCBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuXHJcbiAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTkNJTCB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcblxyXG4gICAgICAjIE1ha2Ugc3VyZSBhbnkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXHJcbiAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgICBAd2Vha0xpbmtzID0gW11cclxuXHJcbiAgaGFuZGxlUGVuQWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgIyBJZ25vcmVkIGluIExJTktTIG1vZGVcclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICMgSW4gUEVOIG1vZGUsIHRoZSBtb2RlIGlzIGNoYW5nZWQgdG8gSElHSExJR0hUSU5HIGlmIHRoZSBzZWxlY3RlZCB2YWx1ZSBpcyBhbHJlYWR5IGN1cnJlbnRcclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTiBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuXHJcbiAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTiB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5cclxuICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcblxyXG4gICAgICAjIE1ha2Ugc3VyZSBhbnkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gIGhhbmRsZVVuZG9BY3Rpb246IC0+XHJcbiAgICByZXR1cm4gQGdhbWUudW5kbygpIGlmIEBtb2RlIGlzbnQgTW9kZVR5cGUuTElOS1NcclxuXHJcbiAgaGFuZGxlUmVkb0FjdGlvbjogLT5cclxuICAgIHJldHVybiBAZ2FtZS5yZWRvKCkgaWYgQG1vZGUgaXNudCBNb2RlVHlwZS5MSU5LU1xyXG5cclxuICBoYW5kbGVNb2RlQWN0aW9uOiAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcclxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXHJcbiAgICB5ID0gTWF0aC5mbG9vcih5IC8gQGNlbGxTaXplKVxyXG5cclxuICAgIGZsYXNoWCA9IG51bGxcclxuICAgIGZsYXNoWSA9IG51bGxcclxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcclxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XHJcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXHJcbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXHJcblxyXG4gICAgICAgICAgaWYgYWN0aW9uLnR5cGUgaXMgQWN0aW9uVHlwZS5NRU5VXHJcbiAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgc3dpdGNoIGFjdGlvbi50eXBlXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1QgdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlU2VsZWN0QWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTCB0aGVuIEBoYW5kbGVQZW5jaWxBY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUEVOIHRoZW4gQGhhbmRsZVBlbkFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5VTkRPIHRoZW4gWyBmbGFzaFgsIGZsYXNoWSBdID0gQGhhbmRsZVVuZG9BY3Rpb24oKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUkVETyB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVSZWRvQWN0aW9uKClcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLk1PREUgdGhlbiBAaGFuZGxlTW9kZUFjdGlvbigpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIyBubyBhY3Rpb24sIGRlZmF1bHQgdG8gaGlnaGxpZ2h0aW5nIG1vZGVcclxuICAgICAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICAgICAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgICAgICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gICAgICAgIEBkcmF3KGZsYXNoWCwgZmxhc2hZKVxyXG4gICAgICAgIGlmIChmbGFzaFg/ICYmIGZsYXNoWT8pXHJcbiAgICAgICAgICBzZXRUaW1lb3V0ID0+XHJcbiAgICAgICAgICAgIEBkcmF3KClcclxuICAgICAgICAgICwgMzNcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBIZWxwZXJzXHJcblxyXG4gIGNvbmZsaWN0czogKHgxLCB5MSwgeDIsIHkyKSAtPlxyXG4gICAgIyBzYW1lIHJvdyBvciBjb2x1bW4/XHJcbiAgICBpZiAoeDEgPT0geDIpIHx8ICh5MSA9PSB5MilcclxuICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICAjIHNhbWUgc2VjdGlvbj9cclxuICAgIHN4MSA9IE1hdGguZmxvb3IoeDEgLyAzKSAqIDNcclxuICAgIHN5MSA9IE1hdGguZmxvb3IoeTEgLyAzKSAqIDNcclxuICAgIHN4MiA9IE1hdGguZmxvb3IoeDIgLyAzKSAqIDNcclxuICAgIHN5MiA9IE1hdGguZmxvb3IoeTIgLyAzKSAqIDNcclxuICAgIGlmIChzeDEgPT0gc3gyKSAmJiAoc3kxID09IHN5MilcclxuICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdVZpZXdcclxuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcclxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxyXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxyXG5cclxuICAjIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cclxuICAjICAgY29uc29sZS5sb2cgT2JqZWN0LmtleXMoZS50b3VjaGVzWzBdKVxyXG4gICMgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAjICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAjICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjEyXCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMy4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcChhLGMpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYywhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGMpfWZ1bmN0aW9uIHUoYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGIoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGIpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gZygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZyksYSgpfSl9O2Z1bmN0aW9uIHcoYSl7dGhpcy5nPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5nLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLm09ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5qPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMubD0tMTt0aGlzLmguc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmouc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMubS5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmguYXBwZW5kQ2hpbGQodGhpcy5tKTt0aGlzLmkuYXBwZW5kQ2hpbGQodGhpcy5qKTt0aGlzLmcuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmcuYXBwZW5kQ2hpbGQodGhpcy5pKX1cbmZ1bmN0aW9uIHgoYSxjKXthLmcuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2MrXCI7XCJ9ZnVuY3Rpb24gQihhKXt2YXIgYz1hLmcub2Zmc2V0V2lkdGgsYj1jKzEwMDthLmouc3R5bGUud2lkdGg9YitcInB4XCI7YS5pLnNjcm9sbExlZnQ9YjthLmguc2Nyb2xsTGVmdD1hLmguc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmwhPT1jPyhhLmw9YywhMCk6ITF9ZnVuY3Rpb24gQyhhLGMpe2Z1bmN0aW9uIGIoKXt2YXIgZT1nO0IoZSkmJm51bGwhPT1lLmcucGFyZW50Tm9kZSYmYyhlLmwpfXZhciBnPWE7cChhLmgsYik7cChhLmksYik7QihhKX07ZnVuY3Rpb24gRChhLGMsYil7Yz1jfHx7fTtiPWJ8fHdpbmRvdzt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwiO3RoaXMuY29udGV4dD1ifXZhciBFPW51bGwsRj1udWxsLEc9bnVsbCxIPW51bGw7ZnVuY3Rpb24gSShhKXtudWxsPT09RiYmKE0oYSkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcik/KGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEY9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCkpOkY9ITEpO3JldHVybiBGfWZ1bmN0aW9uIE0oYSl7bnVsbD09PUgmJihIPSEhYS5kb2N1bWVudC5mb250cyk7cmV0dXJuIEh9XG5mdW5jdGlvbiBOKGEsYyl7dmFyIGI9YS5zdHlsZSxnPWEud2VpZ2h0O2lmKG51bGw9PT1HKXt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXtlLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKHEpe31HPVwiXCIhPT1lLnN0eWxlLmZvbnR9cmV0dXJuW2IsZyxHP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixjXS5qb2luKFwiIFwiKX1cbkQucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxjKXt2YXIgYj10aGlzLGc9YXx8XCJCRVNic3d5XCIsZT0wLHE9Y3x8M0UzLEo9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKEssTCl7aWYoTShiLmNvbnRleHQpJiYhSShiLmNvbnRleHQpKXt2YXIgTz1uZXcgUHJvbWlzZShmdW5jdGlvbihyLHQpe2Z1bmN0aW9uIGgoKXsobmV3IERhdGUpLmdldFRpbWUoKS1KPj1xP3QoRXJyb3IoXCJcIitxK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk6Yi5jb250ZXh0LmRvY3VtZW50LmZvbnRzLmxvYWQoTihiLCdcIicrYi5mYW1pbHkrJ1wiJyksZykudGhlbihmdW5jdGlvbihuKXsxPD1uLmxlbmd0aD9yKCk6c2V0VGltZW91dChoLDI1KX0sdCl9aCgpfSksUD1uZXcgUHJvbWlzZShmdW5jdGlvbihyLHQpe2U9c2V0VGltZW91dChmdW5jdGlvbigpe3QoRXJyb3IoXCJcIitxK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LHEpfSk7UHJvbWlzZS5yYWNlKFtQLE9dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGUpO1xuSyhiKX0sTCl9ZWxzZSB1KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcigpe3ZhciBkO2lmKGQ9LTEhPWsmJi0xIT1sfHwtMSE9ayYmLTEhPW18fC0xIT1sJiYtMSE9bSkoZD1rIT1sJiZrIT1tJiZsIT1tKXx8KG51bGw9PT1FJiYoZD0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksRT0hIWQmJig1MzY+cGFyc2VJbnQoZFsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGRbMV0sMTApJiYxMT49cGFyc2VJbnQoZFsyXSwxMCkpKSxkPUUmJihrPT15JiZsPT15JiZtPT15fHxrPT16JiZsPT16JiZtPT16fHxrPT1BJiZsPT1BJiZtPT1BKSksZD0hZDtkJiYobnVsbCE9PWYucGFyZW50Tm9kZSYmZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGYpLGNsZWFyVGltZW91dChlKSxLKGIpKX1mdW5jdGlvbiB0KCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSj49cSludWxsIT09Zi5wYXJlbnROb2RlJiZmLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZiksXG5MKEVycm9yKFwiXCIrcStcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpO2Vsc2V7dmFyIGQ9Yi5jb250ZXh0LmRvY3VtZW50LmhpZGRlbjtpZighMD09PWR8fHZvaWQgMD09PWQpaz1oLmcub2Zmc2V0V2lkdGgsbD1uLmcub2Zmc2V0V2lkdGgsbT12Lmcub2Zmc2V0V2lkdGgscigpO2U9c2V0VGltZW91dCh0LDUwKX19dmFyIGg9bmV3IHcoZyksbj1uZXcgdyhnKSx2PW5ldyB3KGcpLGs9LTEsbD0tMSxtPS0xLHk9LTEsej0tMSxBPS0xLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmRpcj1cImx0clwiO3goaCxOKGIsXCJzYW5zLXNlcmlmXCIpKTt4KG4sTihiLFwic2VyaWZcIikpO3godixOKGIsXCJtb25vc3BhY2VcIikpO2YuYXBwZW5kQ2hpbGQoaC5nKTtmLmFwcGVuZENoaWxkKG4uZyk7Zi5hcHBlbmRDaGlsZCh2LmcpO2IuY29udGV4dC5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGYpO3k9aC5nLm9mZnNldFdpZHRoO3o9bi5nLm9mZnNldFdpZHRoO0E9di5nLm9mZnNldFdpZHRoO3QoKTtcbkMoaCxmdW5jdGlvbihkKXtrPWQ7cigpfSk7eChoLE4oYiwnXCInK2IuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0MobixmdW5jdGlvbihkKXtsPWQ7cigpfSk7eChuLE4oYiwnXCInK2IuZmFtaWx5KydcIixzZXJpZicpKTtDKHYsZnVuY3Rpb24oZCl7bT1kO3IoKX0pO3godixOKGIsJ1wiJytiLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9RDood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9RCx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1ELnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
