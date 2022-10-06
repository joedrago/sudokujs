(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    this.ctx.lineCap = "butt";
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
    this.ctx.lineCap = "round";
    this.ctx.moveTo(x1, y1);
    this.ctx.arcTo(Q.x, Q.y, x2, y2, radius);
    this.ctx.stroke();
  };

  App.prototype.drawPoint = function(x, y, r, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
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
    this.linkDotRadius = this.lineWidthThick;
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
    this.app.drawArc(x1, y1, x2, y2, r, color, lineWidth);
    this.app.drawPoint(x1, y1, this.linkDotRadius, color);
    return this.app.drawPoint(x2, y2, this.linkDotRadius, color);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVKO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBNEIsSUFBQyxDQUFBLGlCQUFGLEdBQW9CLHVCQUEvQztJQUVmLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUN4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LENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBQyxDQUFEO1NBQzVCLElBQUEsQ0FBQTtBQUQ0QixDQUFoQyxFQUVFLEtBRkY7Ozs7QUN2QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXHJcblxyXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXHJcblN1ZG9rdVZpZXcgPSByZXF1aXJlICcuL1N1ZG9rdVZpZXcnXHJcbnZlcnNpb24gPSByZXF1aXJlICcuL3ZlcnNpb24nXHJcblxyXG5jbGFzcyBBcHBcclxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBsb2FkRm9udChcInNheE1vbm9cIilcclxuICAgIEBmb250cyA9IHt9XHJcblxyXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxyXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAdmlld3MgPVxyXG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgICAgc3Vkb2t1OiBuZXcgU3Vkb2t1Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbiAgbWVhc3VyZUZvbnRzOiAtPlxyXG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xyXG4gICAgICBAY3R4LmZvbnQgPSBmLnN0eWxlXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiXHJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgICBmLmhlaWdodCA9IE1hdGguZmxvb3IoQGN0eC5tZWFzdXJlVGV4dChcIm1cIikud2lkdGggKiAxLjEpICMgYmVzdCBoYWNrIGV2ZXJcclxuICAgICAgY29uc29sZS5sb2cgXCJGb250ICN7Zm9udE5hbWV9IG1lYXN1cmVkIGF0ICN7Zi5oZWlnaHR9IHBpeGVsc1wiXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVnaXN0ZXJGb250OiAobmFtZSwgc3R5bGUpIC0+XHJcbiAgICBmb250ID1cclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgICBzdHlsZTogc3R5bGVcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICBAZm9udHNbbmFtZV0gPSBmb250XHJcbiAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgIHJldHVybiBmb250XHJcblxyXG4gIGxvYWRGb250OiAoZm9udE5hbWUpIC0+XHJcbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXHJcbiAgICBmb250LmxvYWQoKS50aGVuID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiI3tmb250TmFtZX0gbG9hZGVkLCByZWRyYXdpbmcuLi5cIilcclxuICAgICAgQG1lYXN1cmVGb250cygpXHJcbiAgICAgIEBkcmF3KClcclxuXHJcbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XHJcbiAgICBAdmlldyA9IEB2aWV3c1t2aWV3XVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJhcHAubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcblxyXG4gICAgIyBAZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzQ0NDQ0NFwiKVxyXG4gICAgIyBAZHJhd1RleHRDZW50ZXJlZChcIkdlbmVyYXRpbmcsIHBsZWFzZSB3YWl0Li4uXCIsIEBjYW52YXMud2lkdGggLyAyLCBAY2FudmFzLmhlaWdodCAvIDIsIEBnZW5lcmF0aW5nRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgIyB3aW5kb3cuc2V0VGltZW91dCA9PlxyXG4gICAgQHZpZXdzLnN1ZG9rdS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgIyAsIDBcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAdmlld3Muc3Vkb2t1LnJlc2V0KClcclxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIHJldHVybiBAdmlld3Muc3Vkb2t1LmhvbGVDb3VudCgpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAdmlldy5kcmF3KClcclxuXHJcbiAgY2xpY2s6ICh4LCB5KSAtPlxyXG4gICAgQHZpZXcuY2xpY2soeCwgeSlcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubGluZUNhcCA9IFwiYnV0dFwiXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIGN4LCBjeSArIChmb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcclxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3QXJjOiAoeDEsIHkxLCB4MiwgeTIsIHJhZGl1cywgY29sb3IsIGxpbmVXaWR0aCkgLT5cclxuICAgICMgRGVyaXZlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW1ib2xvL2RyYXdBcmMgYXQgNmMzZTBkM1xyXG5cclxuICAgIFAxID0geyB4OiB4MSwgeTogeTEgfVxyXG4gICAgUDIgPSB7IHg6IHgyLCB5OiB5MiB9XHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIG1pZHBvaW50IChNKSBmcm9tIFAxIHRvIFAyXHJcbiAgICBNID1cclxuICAgICAgeDogKFAxLnggKyBQMi54KSAvIDJcclxuICAgICAgeTogKFAxLnkgKyBQMi55KSAvIDJcclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFAxXHJcbiAgICBkTVAxID0gTWF0aC5zcXJ0KChQMS54IC0gTS54KSooUDEueCAtIE0ueCkgKyAoUDEueSAtIE0ueSkqKFAxLnkgLSBNLnkpKVxyXG5cclxuICAgICMgVmFsaWRhdGUgdGhlIHJhZGl1c1xyXG4gICAgaWYgbm90IHJhZGl1cz8gb3IgcmFkaXVzIDwgZE1QMVxyXG4gICAgICByYWRpdXMgPSBkTVAxXHJcblxyXG4gICAgIyBEZXRlcm1pbmUgdGhlIHVuaXQgdmVjdG9yIGZyb20gTSB0byBQMVxyXG4gICAgdU1QMSA9XHJcbiAgICAgIHg6IChQMS54IC0gTS54KSAvIGRNUDFcclxuICAgICAgeTogKFAxLnkgLSBNLnkpIC8gZE1QMVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSB1bml0IHZlY3RvciBmcm9tIE0gdG8gUSAoanVzdCB1TVAxIHJvdGF0ZWQgcGkvMilcclxuICAgIHVNUSA9IHsgeDogLXVNUDEueSwgeTogdU1QMS54IH1cclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUgKEMpIHRvIE1cclxuICAgIGRDTSA9IE1hdGguc3FydChyYWRpdXMqcmFkaXVzIC0gZE1QMSpkTVAxKVxyXG5cclxuICAgICMgRGV0ZXJtaW5lIHRoZSBkaXN0YW5jZSBmcm9tIE0gdG8gUVxyXG4gICAgZE1RID0gZE1QMSAqIGRNUDEgLyBkQ01cclxuXHJcbiAgICAjIERldGVybWluZSB0aGUgbG9jYXRpb24gb2YgUVxyXG4gICAgUSA9XHJcbiAgICAgIHg6IE0ueCArIHVNUS54ICogZE1RXHJcbiAgICAgIHk6IE0ueSArIHVNUS55ICogZE1RXHJcblxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5saW5lQ2FwID0gXCJyb3VuZFwiXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmFyY1RvKFEueCwgUS55LCB4MiwgeTIsIHJhZGl1cylcclxuICAgIEBjdHguc3Ryb2tlKClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3UG9pbnQ6ICh4LCB5LCByLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHguYXJjKHgsIHksIHIsIDAsIDIqTWF0aC5QSSlcclxuICAgIEBjdHguZmlsbCgpXHJcbiAgICByZXR1cm5cclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XHJcbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcclxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxyXG4gIEBiZWdpblBhdGgoKVxyXG4gIEBtb3ZlVG8oeCtyLCB5KVxyXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXHJcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcclxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxyXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXHJcbiAgQGNsb3NlUGF0aCgpXHJcbiAgcmV0dXJuIHRoaXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwXHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuQlVUVE9OX0hFSUdIVCA9IDAuMDZcclxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXHJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxyXG5CVVRUT05fU0VQQVJBVE9SID0gMC4wM1xyXG5cclxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxyXG4gIHkgPSBGSVJTVF9CVVRUT05fWSArIChCVVRUT05fU1BBQ0lORyAqIGluZGV4KVxyXG4gIGlmIGluZGV4ID4gM1xyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA0XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDZcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIHJldHVybiB5XHJcblxyXG5jbGFzcyBNZW51Vmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIEBidXR0b25zID1cclxuICAgICAgbmV3RWFzeTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMClcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxyXG4gICAgICBuZXdNZWRpdW06XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0hhcmQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcclxuICAgICAgbmV3RXh0cmVtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMylcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzExMTFcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxyXG4gICAgICByZXNldDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNClcclxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXHJcbiAgICAgIGltcG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNSlcclxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIGV4cG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNilcclxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxyXG4gICAgICByZXN1bWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXHJcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcclxuXHJcbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcclxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcclxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgYnV0dG9uLnggPSBidXR0b25YXHJcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxyXG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXHJcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxyXG5cclxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXHJcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDYpXHJcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHN1YnRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHN1YnRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tzdWJ0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAwNVxyXG5cclxuICAgIHkxID0gQGNhbnZhcy5oZWlnaHQgKiAwLjA1XHJcbiAgICB5MiA9IHkxICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XHJcbiAgICB5MyA9IHkyICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkxICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4LCB5MiwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJJdCdzIGxpa2UgU3Vkb2t1LCBidXQgeW91IGFyZSB0aGUgYmFkIGd1eS5cIiwgeCwgeTMsIEBzdWJ0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgQGFwcC5kcmF3TG93ZXJMZWZ0KFwiI3tAYXBwLmhvbGVDb3VudCgpfS84MVwiKVxyXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxyXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbmV3RWFzeTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxyXG5cclxuICBuZXdNZWRpdW06IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtKVxyXG5cclxuICBuZXdIYXJkOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQpXHJcblxyXG4gIG5ld0V4dHJlbWU6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSlcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAYXBwLnJlc2V0KClcclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIGlmIG5hdmlnYXRvci5zaGFyZSAhPSB1bmRlZmluZWRcclxuICAgICAgbmF2aWdhdG9yLnNoYXJlIHtcclxuICAgICAgICB0aXRsZTogXCJTdWRva3UgU2hhcmVkIEdhbWVcIlxyXG4gICAgICAgIHRleHQ6IEBhcHAuZXhwb3J0KClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm5cclxuICAgIHdpbmRvdy5wcm9tcHQoXCJDb3B5IHRoaXMgYW5kIHBhc3RlIHRvIGEgZnJpZW5kOlwiLCBAYXBwLmV4cG9ydCgpKVxyXG5cclxuICBpbXBvcnQ6IC0+XHJcbiAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiUGFzdGUgYW4gZXhwb3J0ZWQgZ2FtZSBoZXJlOlwiLCBcIlwiKVxyXG4gICAgbG9vcFxyXG4gICAgICBpZiBpbXBvcnRTdHJpbmcgPT0gbnVsbFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcbiAgICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGltcG9ydFN0cmluZyA9IHdpbmRvdy5wcm9tcHQoXCJJbnZhbGlkIGdhbWUsIHRyeSBhZ2FpbjpcIiwgXCJcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG4jIFJldHVybnMgdGhlIGluZGV4IG9mIGEgY2VsbCBpbiByb3cgbWFqb3Igb3JkZXIgKHRob3VnaCB0aGV5IGFyZSBzdG9yZWQgaW4gY29sdW1uIG1ham9yIG9yZGVyKVxyXG5jZWxsSW5kZXggPSAoeCwgeSkgLT4geSAqIDkgKyB4XHJcblxyXG4jIFNvcnQgYnkgYXNjZW5kaW5nIGxvY2F0aW9uIGFuZCB0aGVuIGJ5IHN0cmVuZ3RoIChzdHJvbmcgdGhlbiB3ZWFrKVxyXG5hc2NlbmRpbmdMaW5rU29ydCA9IChhLCBiKSAtPlxyXG4gIGEwID0gY2VsbEluZGV4KGEuY2VsbHNbMF0ueCwgYS5jZWxsc1swXS55KVxyXG4gIGExID0gY2VsbEluZGV4KGEuY2VsbHNbMV0ueCwgYS5jZWxsc1sxXS55KVxyXG4gIGIwID0gY2VsbEluZGV4KGIuY2VsbHNbMF0ueCwgYi5jZWxsc1swXS55KVxyXG4gIGIxID0gY2VsbEluZGV4KGIuY2VsbHNbMV0ueCwgYi5jZWxsc1sxXS55KVxyXG4gIHJldHVybiBpZiBhMCA+IGIwIG9yIChhMCA9PSBiMCBhbmQgKGExID4gYjEgb3IgKGExID09IGIxIGFuZCAobm90IGEuc3Ryb25nPyBhbmQgYi5zdHJvbmc/KSkpKSB0aGVuIDEgZWxzZSAtMVxyXG5cclxuIyBOb3RlIHN0cmVuZ3RoIGlzIG5vdCBjb21wYXJlZFxyXG51bmlxdWVMaW5rRmlsdGVyID0gKGUsIGksIGEpIC0+XHJcbiAgaWYgaSA9PSAwXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIHAgPSBhW2ktMV1cclxuICBlMCA9IGNlbGxJbmRleChlLmNlbGxzWzBdLngsIGUuY2VsbHNbMF0ueSlcclxuICBlMSA9IGNlbGxJbmRleChlLmNlbGxzWzFdLngsIGUuY2VsbHNbMV0ueSlcclxuICBwMCA9IGNlbGxJbmRleChwLmNlbGxzWzBdLngsIHAuY2VsbHNbMF0ueSlcclxuICBwMSA9IGNlbGxJbmRleChwLmNlbGxzWzFdLngsIHAuY2VsbHNbMV0ueSlcclxuICByZXR1cm4gZTAgIT0gcDAgb3IgZTEgIT0gcDFcclxuXHJcbmdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyA9IChjZWxscykgLT5cclxuICBsaW5rcyA9IFtdXHJcbiAgY291bnQgPSBjZWxscy5sZW5ndGhcclxuICBmb3IgaSBpbiBbMC4uLmNvdW50LTFdXHJcbiAgICBmb3IgaiBpbiBbaSsxLi4uY291bnRdXHJcbiAgICAgIGxpbmtzLnB1c2goeyBjZWxsczogW2NlbGxzW2ldLCBjZWxsc1tqXV0gfSlcclxuICByZXR1cm4gbGlua3NcclxuXHJcbmNsYXNzIFN1ZG9rdUdhbWVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBjbGVhcigpXHJcbiAgICBpZiBub3QgQGxvYWQoKVxyXG4gICAgICBAbmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGNsZWFyOiAtPlxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAZ3JpZFtpXVtqXSA9XHJcbiAgICAgICAgICB2YWx1ZTogMFxyXG4gICAgICAgICAgZXJyb3I6IGZhbHNlXHJcbiAgICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgICAgICBwZW5jaWw6IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG5cclxuICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIGNvdW50ID0gMFxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgbm90IEBncmlkW2ldW2pdLmxvY2tlZFxyXG4gICAgICAgICAgY291bnQgKz0gMVxyXG4gICAgcmV0dXJuIGNvdW50XHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIGV4cG9ydFN0cmluZyA9IFwiU0RcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0ubG9ja2VkXHJcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIje0BncmlkW2ldW2pdLnZhbHVlfVwiXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZXhwb3J0U3RyaW5nICs9IFwiMFwiXHJcbiAgICByZXR1cm4gZXhwb3J0U3RyaW5nXHJcblxyXG4gIHZhbGlkYXRlOiAtPlxyXG4gICAgYm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBib2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgICBib2FyZFtpXVtqXSA9IEBncmlkW2ldW2pdLnZhbHVlXHJcblxyXG4gICAgZ2VuZXJhdG9yID0gbmV3IFN1ZG9rdUdlbmVyYXRvclxyXG4gICAgcmV0dXJuIGdlbmVyYXRvci52YWxpZGF0ZUdyaWQoYm9hcmQpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5zdWJzdHIoMilcclxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZy5sZW5ndGggIT0gODFcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgQGNsZWFyKClcclxuXHJcbiAgICBpbmRleCA9IDBcclxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIEBncmlkW2ldW2pdLmxvY2tlZCA9IHRydWVcclxuICAgICAgICAgIEBncmlkW2ldW2pdLnZhbHVlID0gdlxyXG5cclxuICAgIHJldHVybiBmYWxzZSBpZiBub3QgQHZhbGlkYXRlKClcclxuXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgdXBkYXRlQ2VsbDogKHgsIHkpIC0+XHJcbiAgICBjZWxsID0gQGdyaWRbeF1beV1cclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIHggIT0gaVxyXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxyXG4gICAgICAgIGlmIHYgPiAwXHJcbiAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcclxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXHJcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcblxyXG4gICAgICBpZiB5ICE9IGlcclxuICAgICAgICB2ID0gQGdyaWRbeF1baV0udmFsdWVcclxuICAgICAgICBpZiB2ID4gMFxyXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgIEBncmlkW3hdW2ldLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxyXG4gICAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXHJcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdXBkYXRlQ2VsbHM6IC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBAZ3JpZFtpXVtqXS5lcnJvciA9IGZhbHNlXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgailcclxuXHJcbiAgICBAc29sdmVkID0gdHJ1ZVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0uZXJyb3JcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcclxuICAgICAgICAgIEBzb2x2ZWQgPSBmYWxzZVxyXG5cclxuICAgICMgaWYgQHNvbHZlZFxyXG4gICAgIyAgIGNvbnNvbGUubG9nIFwic29sdmVkICN7QHNvbHZlZH1cIlxyXG5cclxuICAgIHJldHVybiBAc29sdmVkXHJcblxyXG4gIGRvbmU6IC0+XHJcbiAgICBkID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXHJcbiAgICBjb3VudHMgPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0udmFsdWUgIT0gMFxyXG4gICAgICAgICAgY291bnRzW0BncmlkW2ldW2pdLnZhbHVlLTFdICs9IDFcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGlmIGNvdW50c1tpXSA9PSA5XHJcbiAgICAgICAgZFtpXSA9IHRydWVcclxuICAgIHJldHVybiBkXHJcblxyXG4gIHBlbmNpbE1hcmtzOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgbWFya3MgPSBbXVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiBjZWxsLnBlbmNpbFtpXVxyXG4gICAgICAgIG1hcmtzLnB1c2ggaSArIDFcclxuICAgIHJldHVybiBtYXJrc1xyXG5cclxuICBkbzogKGFjdGlvbiwgeCwgeSwgdmFsdWVzLCBqb3VybmFsKSAtPlxyXG4gICAgaWYgdmFsdWVzLmxlbmd0aCA+IDBcclxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIHN3aXRjaCBhY3Rpb25cclxuICAgICAgICB3aGVuIFwidG9nZ2xlUGVuY2lsXCJcclxuICAgICAgICAgIGpvdXJuYWwucHVzaCB7IGFjdGlvbjogXCJ0b2dnbGVQZW5jaWxcIiwgeDogeCwgeTogeSwgdmFsdWVzOiB2YWx1ZXMgfVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxbdi0xXSA9ICFjZWxsLnBlbmNpbFt2LTFdIGZvciB2IGluIHZhbHVlc1xyXG4gICAgICAgIHdoZW4gXCJzZXRWYWx1ZVwiXHJcbiAgICAgICAgICBqb3VybmFsLnB1c2ggeyBhY3Rpb246IFwic2V0VmFsdWVcIiwgeDogeCwgeTogeSwgdmFsdWVzOiBbY2VsbC52YWx1ZV0gfVxyXG4gICAgICAgICAgY2VsbC52YWx1ZSA9IHZhbHVlc1swXVxyXG4gICAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgICBAc2F2ZSgpXHJcblxyXG4gIHVuZG86IC0+XHJcbiAgICBpZiAoQHVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICAgIHN0ZXAgPSBAdW5kb0pvdXJuYWwucG9wKClcclxuICAgICAgQGRvIHN0ZXAuYWN0aW9uLCBzdGVwLngsIHN0ZXAueSwgc3RlcC52YWx1ZXMsIEByZWRvSm91cm5hbFxyXG4gICAgICByZXR1cm4gWyBzdGVwLngsIHN0ZXAueSBdXHJcblxyXG4gIHJlZG86IC0+XHJcbiAgICBpZiAoQHJlZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICAgIHN0ZXAgPSBAcmVkb0pvdXJuYWwucG9wKClcclxuICAgICAgQGRvIHN0ZXAuYWN0aW9uLCBzdGVwLngsIHN0ZXAueSwgc3RlcC52YWx1ZXMsIEB1bmRvSm91cm5hbFxyXG4gICAgICByZXR1cm4gWyBzdGVwLngsIHN0ZXAueSBdXHJcblxyXG4gIGNsZWFyUGVuY2lsOiAoeCwgeSkgLT5cclxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgaWYgY2VsbC5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJ0b2dnbGVQZW5jaWxcIiwgeCwgeSwgKGkrMSBmb3IgZmxhZywgaSBpbiBjZWxsLnBlbmNpbCB3aGVuIGZsYWcpLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHRvZ2dsZVBlbmNpbDogKHgsIHksIHYpIC0+XHJcbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAZG8gXCJ0b2dnbGVQZW5jaWxcIiwgeCwgeSwgW3ZdLCBAdW5kb0pvdXJuYWxcclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcblxyXG4gIHNldFZhbHVlOiAoeCwgeSwgdikgLT5cclxuICAgIGlmIEBncmlkW3hdW3ldLmxvY2tlZFxyXG4gICAgICByZXR1cm5cclxuICAgIEBkbyBcInNldFZhbHVlXCIsIHgsIHksIFt2XSwgQHVuZG9Kb3VybmFsXHJcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxyXG5cclxuICByZXNldDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwicmVzZXQoKVwiXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cclxuICAgICAgICBpZiBub3QgY2VsbC5sb2NrZWRcclxuICAgICAgICAgIGNlbGwudmFsdWUgPSAwXHJcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXHJcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxyXG4gICAgICAgICAgY2VsbC5wZW5jaWxba10gPSBmYWxzZVxyXG4gICAgQHVuZG9Kb3VybmFsID0gW11cclxuICAgIEByZWRvSm91cm5hbCA9IFtdXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgQHNhdmUoKVxyXG5cclxuICBnZXRMaW5rczogKHZhbHVlKSAtPlxyXG4gICAgIyBOb3RlOiB0aGUgc2VhcmNoIHNvcnRzIHRoZSBsaW5rcyBpbiByb3cgbWFqb3Igb3JkZXIsIGZpcnN0IGJ5IHN0YXJ0IGNlbGwsIHRoZW4gYnkgZW5kIGNlbGxcclxuICAgIGxpbmtzID0gW11cclxuXHJcbiAgICAjIEdldCByb3cgbGlua3NcclxuICAgIGZvciB5IGluIFswLi4uOV1cclxuICAgICAgbGlua3MucHVzaCBAZ2V0Um93TGlua3MoeSwgdmFsdWUpLi4uXHJcblxyXG4gICAgIyBHZXQgY29sdW1uIGxpbmtzXHJcbiAgICBmb3IgeCBpbiBbMC4uLjldXHJcbiAgICAgIGxpbmtzLnB1c2ggQGdldENvbHVtbkxpbmtzKHgsIHZhbHVlKS4uLlxyXG5cclxuICAgICMgR2V0IGJveCBsaW5rc1xyXG4gICAgZm9yIGJveFggaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgYm94WSBpbiBbMC4uLjNdXHJcbiAgICAgICAgbGlua3MucHVzaCBAZ2V0Qm94TGlua3MoYm94WCwgYm94WSwgdmFsdWUpLi4uXHJcblxyXG4gICAgIyBUaGUgYm94IGxpbmtzIG1pZ2h0IGhhdmUgZHVwbGljYXRlZCBzb21lIHJvdyBhbmQgY29sdW1uIGxpbmtzLCBzbyBkdXBsaWNhdGVzIG11c3QgYmUgZmlsdGVyZWQgb3V0LiBOb3RlIHRoYXQgb25seVxyXG4gICAgIyBsb2NhdGlvbnMgYXJlIGNvbnNpZGVyZWQgd2hlbiBmaW5kaW5nIGR1cGxpY2F0ZXMsIGJ1dCBzdHJvbmcgbGlua3MgdGFrZSBwcmVjZWRlbmNlIHdoZW4gZHVwbGljYXRlcyBhcmUgcmVtb3ZlZFxyXG4gICAgIyAoYmVjYXVzZSB0aGV5IGFyZSBvcmRlcmVkIGJlZm9yZSB3ZWFrIGxpbmtzKS5cclxuICAgIGxpbmtzID0gbGlua3Muc29ydChhc2NlbmRpbmdMaW5rU29ydCkuZmlsdGVyKHVuaXF1ZUxpbmtGaWx0ZXIpXHJcblxyXG4gICAgc3Ryb25nID0gW11cclxuICAgIGZvciBsaW5rIGluIGxpbmtzXHJcbiAgICAgIHN0cm9uZy5wdXNoIGxpbmsuY2VsbHMgaWYgbGluay5zdHJvbmc/XHJcbiAgICB3ZWFrID0gW11cclxuICAgIGZvciBsaW5rIGluIGxpbmtzXHJcbiAgICAgIHdlYWsucHVzaCBsaW5rLmNlbGxzIGlmIG5vdCBsaW5rLnN0cm9uZz9cclxuXHJcbiAgICByZXR1cm4geyBzdHJvbmcsIHdlYWsgfVxyXG5cclxuICBnZXRSb3dMaW5rczogKHksIHZhbHVlKS0+XHJcbiAgICBjZWxscyA9IFtdXHJcbiAgICBmb3IgeCBpbiBbMC4uLjldXHJcbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxyXG4gICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXHJcbiAgICAgICAgY2VsbHMucHVzaCh7IHgsIHkgfSlcclxuXHJcbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXHJcbiAgICAgIGxpbmtzID0gZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zKGNlbGxzKVxyXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxyXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcclxuICAgIGVsc2VcclxuICAgICAgbGlua3MgPSBbXVxyXG4gICAgcmV0dXJuIGxpbmtzXHJcblxyXG4gIGdldENvbHVtbkxpbmtzOiAoeCwgdmFsdWUpLT5cclxuICAgIGNlbGxzID0gW11cclxuICAgIGZvciB5IGluIFswLi4uOV1cclxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cclxuICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxyXG5cclxuICAgIGlmIGNlbGxzLmxlbmd0aCA+IDFcclxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXHJcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgbGlua3NbMF0uc3Ryb25nID0gdHJ1ZVxyXG4gICAgZWxzZVxyXG4gICAgICBsaW5rcyA9IFtdXHJcbiAgICByZXR1cm4gbGlua3NcclxuXHJcbiAgZ2V0Qm94TGlua3M6IChib3hYLCBib3hZLCB2YWx1ZSkgLT5cclxuICAgIGNlbGxzID0gW11cclxuICAgIHN4ID0gYm94WCAqIDNcclxuICAgIHN5ID0gYm94WSAqIDNcclxuICAgIGZvciB5IGluIFtzeS4uLnN5KzNdXHJcbiAgICAgIGZvciB4IGluIFtzeC4uLnN4KzNdXHJcbiAgICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXHJcbiAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxyXG4gICAgICAgICAgY2VsbHMucHVzaCh7IHgsIHkgfSlcclxuXHJcbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXHJcbiAgICAgIGxpbmtzID0gZ2VuZXJhdGVMaW5rUGVybXV0YXRpb25zKGNlbGxzKVxyXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxyXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcclxuICAgIGVsc2VcclxuICAgICAgbGlua3MgPSBbXVxyXG4gICAgcmV0dXJuIGxpbmtzXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJuZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGNlbGwudmFsdWUgPSAwXHJcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXHJcbiAgICAgICAgY2VsbC5sb2NrZWQgPSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcclxuXHJcbiAgICBnZW5lcmF0b3IgPSBuZXcgU3Vkb2t1R2VuZXJhdG9yKClcclxuICAgIG5ld0dyaWQgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoZGlmZmljdWx0eSlcclxuICAgICMgY29uc29sZS5sb2cgXCJuZXdHcmlkXCIsIG5ld0dyaWRcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGlmIG5ld0dyaWRbaV1bal0gIT0gMFxyXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSBuZXdHcmlkW2ldW2pdXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXHJcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxyXG4gICAgQHJlZG9Kb3VybmFsID0gW11cclxuICAgIEB1cGRhdGVDZWxscygpXHJcbiAgICBAc2F2ZSgpXHJcblxyXG4gIGxvYWQ6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBqc29uU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lXCIpXHJcbiAgICBpZiBqc29uU3RyaW5nID09IG51bGxcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgIyBjb25zb2xlLmxvZyBqc29uU3RyaW5nXHJcbiAgICBnYW1lRGF0YSA9IEpTT04ucGFyc2UoanNvblN0cmluZylcclxuICAgICMgY29uc29sZS5sb2cgXCJmb3VuZCBnYW1lRGF0YVwiLCBnYW1lRGF0YVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHNyYyA9IGdhbWVEYXRhLmdyaWRbaV1bal1cclxuICAgICAgICBkc3QgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGRzdC52YWx1ZSA9IHNyYy52XHJcbiAgICAgICAgZHN0LmVycm9yID0gaWYgc3JjLmUgPiAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXHJcbiAgICAgICAgZHN0LmxvY2tlZCA9IGlmIHNyYy5sID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGRzdC5wZW5jaWxba10gPSBpZiBzcmMucFtrXSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcclxuXHJcbiAgICBAdXBkYXRlQ2VsbHMoKVxyXG4gICAgY29uc29sZS5sb2cgXCJMb2FkZWQgZ2FtZS5cIlxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgc2F2ZTogLT5cclxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcclxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBnYW1lRGF0YSA9XHJcbiAgICAgIGdyaWQ6IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIGdhbWVEYXRhLmdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGNlbGwgPSBAZ3JpZFtpXVtqXVxyXG4gICAgICAgIGdhbWVEYXRhLmdyaWRbaV1bal0gPVxyXG4gICAgICAgICAgdjogY2VsbC52YWx1ZVxyXG4gICAgICAgICAgZTogaWYgY2VsbC5lcnJvciB0aGVuIDEgZWxzZSAwXHJcbiAgICAgICAgICBsOiBpZiBjZWxsLmxvY2tlZCB0aGVuIDEgZWxzZSAwXHJcbiAgICAgICAgICBwOiBbXVxyXG4gICAgICAgIGRzdCA9IGdhbWVEYXRhLmdyaWRbaV1bal0ucFxyXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cclxuICAgICAgICAgIGRzdC5wdXNoKGlmIGNlbGwucGVuY2lsW2tdIHRoZW4gMSBlbHNlIDApXHJcblxyXG4gICAganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGdhbWVEYXRhKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lXCIsIGpzb25TdHJpbmcpXHJcbiAgICBjb25zb2xlLmxvZyBcIlNhdmVkIGdhbWUgKCN7anNvblN0cmluZy5sZW5ndGh9IGNoYXJzKVwiXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHYW1lXHJcbiIsInNodWZmbGUgPSAoYSkgLT5cclxuICAgIGkgPSBhLmxlbmd0aFxyXG4gICAgd2hpbGUgLS1pID4gMFxyXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcclxuICAgICAgICB0ID0gYVtqXVxyXG4gICAgICAgIGFbal0gPSBhW2ldXHJcbiAgICAgICAgYVtpXSA9IHRcclxuICAgIHJldHVybiBhXHJcblxyXG5jbGFzcyBCb2FyZFxyXG4gIGNvbnN0cnVjdG9yOiAob3RoZXJCb2FyZCA9IG51bGwpIC0+XHJcbiAgICBAbG9ja2VkQ291bnQgPSAwO1xyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG4gICAgaWYgb3RoZXJCb2FyZCAhPSBudWxsXHJcbiAgICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXSA9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGxvY2soaSwgaiwgb3RoZXJCb2FyZC5sb2NrZWRbaV1bal0pXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgbG9jazogKHgsIHksIHYgPSB0cnVlKSAtPlxyXG4gICAgaWYgdlxyXG4gICAgICBAbG9ja2VkQ291bnQgKz0gMSBpZiBub3QgQGxvY2tlZFt4XVt5XVxyXG4gICAgZWxzZVxyXG4gICAgICBAbG9ja2VkQ291bnQgLT0gMSBpZiBAbG9ja2VkW3hdW3ldXHJcbiAgICBAbG9ja2VkW3hdW3ldID0gdjtcclxuXHJcblxyXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcclxuICBAZGlmZmljdWx0eTpcclxuICAgIGVhc3k6IDFcclxuICAgIG1lZGl1bTogMlxyXG4gICAgaGFyZDogM1xyXG4gICAgZXh0cmVtZTogNFxyXG5cclxuICBjb25zdHJ1Y3RvcjogLT5cclxuXHJcbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cclxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cclxuICAgIHJldHVybiBuZXdCb2FyZFxyXG5cclxuICBncmlkVG9Cb2FyZDogKGdyaWQpIC0+XHJcbiAgICBib2FyZCA9IG5ldyBCb2FyZFxyXG4gICAgZm9yIHkgaW4gWzAuLi45XVxyXG4gICAgICBmb3IgeCBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgZ3JpZFt4XVt5XSA+IDBcclxuICAgICAgICAgIGJvYXJkLmdyaWRbeF1beV0gPSBncmlkW3hdW3ldXHJcbiAgICAgICAgICBib2FyZC5sb2NrKHgsIHkpXHJcbiAgICByZXR1cm4gYm9hcmRcclxuXHJcbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XHJcbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgcmV0dXJuIGJvYXJkLmdyaWRbeF1beV0gPT0gdlxyXG5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgKHggIT0gaSkgYW5kIChib2FyZC5ncmlkW2ldW3ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcclxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxyXG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXHJcbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxyXG4gICAgbWFya3MgPSBbXVxyXG4gICAgZm9yIHYgaW4gWzEuLjldXHJcbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXHJcbiAgICAgICAgbWFya3MucHVzaCB2XHJcbiAgICBpZiBtYXJrcy5sZW5ndGggPiAxXHJcbiAgICAgIHNodWZmbGUobWFya3MpXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XHJcbiAgICByZW1haW5pbmdJbmRleGVzID0gWzAuLi44MV1cclxuXHJcbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXHJcbiAgICBmb3IgaW5kZXggaW4gWzAuLi44MV1cclxuICAgICAgeCA9IGluZGV4ICUgOVxyXG4gICAgICB5ID0gaW5kZXggLy8gOVxyXG4gICAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cclxuICAgICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGluZGV4KVxyXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgICMgc2tpcCBjZWxscyB0aGF0IGFyZSBhbHJlYWR5IGJlaW5nIHRyaWVkXHJcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xyXG4gICAgICBrID0gcmVtYWluaW5nSW5kZXhlcy5pbmRleE9mKGEuaW5kZXgpXHJcbiAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxyXG5cclxuICAgIHJldHVybiBudWxsIGlmIHJlbWFpbmluZ0luZGV4ZXMubGVuZ3RoID09IDAgIyBhYm9ydCBpZiB0aGVyZSBhcmUgbm8gY2VsbHMgKHNob3VsZCBuZXZlciBoYXBwZW4pXHJcblxyXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxyXG4gICAgZmV3ZXN0TWFya3MgPSBbMC4uOV1cclxuICAgIGZvciBpbmRleCBpbiByZW1haW5pbmdJbmRleGVzXHJcbiAgICAgIHggPSBpbmRleCAlIDlcclxuICAgICAgeSA9IGluZGV4IC8vIDlcclxuICAgICAgbWFya3MgPSBAcGVuY2lsTWFya3MoYm9hcmQsIHgsIHkpXHJcblxyXG4gICAgICAjIGFib3J0IGlmIHRoZXJlIGlzIGEgY2VsbCB3aXRoIG5vIHBvc3NpYmlsaXRpZXNcclxuICAgICAgcmV0dXJuIG51bGwgaWYgbWFya3MubGVuZ3RoID09IDBcclxuXHJcbiAgICAgICMgZG9uZSBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBvbmx5IG9uZSBwb3NzaWJpbGl0eSAoKVxyXG4gICAgICByZXR1cm4geyBpbmRleDogaW5kZXgsIHJlbWFpbmluZzogbWFya3MgfSBpZiBtYXJrcy5sZW5ndGggPT0gMVxyXG5cclxuICAgICAgIyByZW1lbWJlciB0aGlzIGNlbGwgaWYgaXQgaGFzIHRoZSBmZXdlc3QgbWFya3Mgc28gZmFyXHJcbiAgICAgIGlmIG1hcmtzLmxlbmd0aCA8IGZld2VzdE1hcmtzLmxlbmd0aFxyXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcclxuICAgICAgICBmZXdlc3RNYXJrcyA9IG1hcmtzXHJcbiAgICByZXR1cm4geyBpbmRleDogZmV3ZXN0SW5kZXgsIHJlbWFpbmluZzogZmV3ZXN0TWFya3MgfVxyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgYXR0ZW1wdHMgPSBbXVxyXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMpXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXHJcbiAgICBhdHRlbXB0cyA9IFtdXHJcblxyXG4gICAgIyBpZiB0aGVyZSBpcyBubyBzb2x1dGlvbiwgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gZmFsc2UgaWYgQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cykgPT0gbnVsbFxyXG5cclxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxyXG5cclxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcclxuICAgIHJldHVybiB0cnVlIGlmIHVubG9ja2VkQ291bnQgPT0gMFxyXG5cclxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXHJcbiAgICByZXR1cm4gQHNvbHZlSW50ZXJuYWwoc29sdmVkLCBhdHRlbXB0cywgdW5sb2NrZWRDb3VudC0xKSA9PSBudWxsXHJcblxyXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxyXG4gICAgdW5sb2NrZWRDb3VudCA9IDgxIC0gc29sdmVkLmxvY2tlZENvdW50XHJcbiAgICB3aGlsZSB3YWxrSW5kZXggPCB1bmxvY2tlZENvdW50XHJcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcclxuICAgICAgICBhdHRlbXB0ID0gQG5leHRBdHRlbXB0KHNvbHZlZCwgYXR0ZW1wdHMpXHJcbiAgICAgICAgYXR0ZW1wdHMucHVzaChhdHRlbXB0KSBpZiBhdHRlbXB0ICE9IG51bGxcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGF0dGVtcHQgPSBhdHRlbXB0c1t3YWxrSW5kZXhdXHJcblxyXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcclxuICAgICAgICB4ID0gYXR0ZW1wdC5pbmRleCAlIDlcclxuICAgICAgICB5ID0gYXR0ZW1wdC5pbmRleCAvLyA5XHJcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSBhdHRlbXB0LnJlbWFpbmluZy5wb3AoKVxyXG4gICAgICAgICAgd2Fsa0luZGV4ICs9IDFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBhdHRlbXB0cy5wb3AoKVxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSAwXHJcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgd2Fsa0luZGV4IC09IDFcclxuXHJcbiAgICAgIGlmIHdhbGtJbmRleCA8IDBcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG5cclxuICAgIHJldHVybiBzb2x2ZWRcclxuXHJcbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxyXG4gICAgYm9hcmQgPSBAc29sdmUobmV3IEJvYXJkKCkpXHJcbiAgICAjIGhhY2tcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkLmxvY2soaSwgailcclxuXHJcbiAgICBpbmRleGVzVG9SZW1vdmUgPSBzaHVmZmxlKFswLi4uODFdKVxyXG4gICAgcmVtb3ZlZCA9IDBcclxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxyXG4gICAgICBpZiBpbmRleGVzVG9SZW1vdmUubGVuZ3RoID09IDBcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgcmVtb3ZlSW5kZXggPSBpbmRleGVzVG9SZW1vdmUucG9wKClcclxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcclxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcclxuXHJcbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcclxuICAgICAgbmV4dEJvYXJkLmxvY2socngsIHJ5LCBmYWxzZSlcclxuXHJcbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXHJcbiAgICAgICAgYm9hcmQgPSBuZXh0Qm9hcmRcclxuICAgICAgICByZW1vdmVkICs9IDFcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImZhaWxlZCB0byByZW1vdmUgI3tyeH0sI3tyeX0sIGNyZWF0ZXMgbm9uLXVuaXF1ZSBzb2x1dGlvblwiXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYm9hcmQ6IGJvYXJkXHJcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcclxuICAgIH1cclxuXHJcbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgYW1vdW50VG9SZW1vdmUgPSBzd2l0Y2ggZGlmZmljdWx0eVxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUgdGhlbiA2MFxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxyXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSAgdGhlbiA0NlxyXG4gICAgICBlbHNlIDQwICMgZWFzeSAvIHVua25vd25cclxuXHJcbiAgICBiZXN0ID0gbnVsbFxyXG4gICAgZm9yIGF0dGVtcHQgaW4gWzAuLi4yXVxyXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcclxuICAgICAgaWYgZ2VuZXJhdGVkLnJlbW92ZWQgPT0gYW1vdW50VG9SZW1vdmVcclxuICAgICAgICBjb25zb2xlLmxvZyBcIlJlbW92ZWQgZXhhY3QgYW1vdW50ICN7YW1vdW50VG9SZW1vdmV9LCBzdG9wcGluZ1wiXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBpZiBiZXN0ID09IG51bGxcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGVsc2UgaWYgYmVzdC5yZW1vdmVkIDwgZ2VuZXJhdGVkLnJlbW92ZWRcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiY3VycmVudCBiZXN0ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuXHJcbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcbiAgICByZXR1cm4gQGJvYXJkVG9HcmlkKGJlc3QuYm9hcmQpXHJcblxyXG4gIHZhbGlkYXRlR3JpZDogKGdyaWQpIC0+XHJcbiAgICByZXR1cm4gQGhhc1VuaXF1ZVNvbHV0aW9uKEBncmlkVG9Cb2FyZChncmlkKSlcclxuXHJcbiAgc29sdmVTdHJpbmc6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBpZiBpbXBvcnRTdHJpbmcuaW5kZXhPZihcIlNEXCIpICE9IDBcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcuc3Vic3RyKDIpXHJcbiAgICBpbXBvcnRTdHJpbmcgPSBpbXBvcnRTdHJpbmcucmVwbGFjZSgvW14wLTldL2csIFwiXCIpXHJcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGJvYXJkID0gbmV3IEJvYXJkKClcclxuXHJcbiAgICBpbmRleCA9IDBcclxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgaWYgdiA+IDBcclxuICAgICAgICAgIGJvYXJkLmdyaWRbal1baV0gPSB2XHJcbiAgICAgICAgICBib2FyZC5sb2NrKGosIGkpXHJcblxyXG4gICAgc29sdmVkID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgaWYgc29sdmVkID09IG51bGxcclxuICAgICAgY29uc29sZS5sb2cgXCJFUlJPUjogQ2FuJ3QgYmUgc29sdmVkLlwiXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGlmIG5vdCBAaGFzVW5pcXVlU29sdXRpb24oYm9hcmQpXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IEJvYXJkIHNvbHZlIG5vdCB1bmlxdWUuXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgYW5zd2VyU3RyaW5nID0gXCJcIlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYW5zd2VyU3RyaW5nICs9IFwiI3tzb2x2ZWQuZ3JpZFtqXVtpXX0gXCJcclxuICAgICAgYW5zd2VyU3RyaW5nICs9IFwiXFxuXCJcclxuXHJcbiAgICByZXR1cm4gYW5zd2VyU3RyaW5nXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxyXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcclxuU3Vkb2t1R2FtZSA9IHJlcXVpcmUgJy4vU3Vkb2t1R2FtZSdcclxuXHJcblBFTl9QT1NfWCA9IDFcclxuUEVOX1BPU19ZID0gMTBcclxuUEVOX0NMRUFSX1BPU19YID0gMlxyXG5QRU5fQ0xFQVJfUE9TX1kgPSAxM1xyXG5cclxuUEVOQ0lMX1BPU19YID0gNVxyXG5QRU5DSUxfUE9TX1kgPSAxMFxyXG5QRU5DSUxfQ0xFQVJfUE9TX1ggPSA2XHJcblBFTkNJTF9DTEVBUl9QT1NfWSA9IDEzXHJcblxyXG5NRU5VX1BPU19YID0gNFxyXG5NRU5VX1BPU19ZID0gMTNcclxuXHJcbk1PREVfU1RBUlRfUE9TX1ggPSAyXHJcbk1PREVfQ0VOVEVSX1BPU19YID0gNFxyXG5NT0RFX0VORF9QT1NfWCA9IDZcclxuTU9ERV9QT1NfWSA9IDlcclxuXHJcblVORE9fUE9TX1ggPSAwXHJcblVORE9fUE9TX1kgPSAxM1xyXG5SRURPX1BPU19YID0gOFxyXG5SRURPX1BPU19ZID0gMTNcclxuXHJcbkNvbG9yID1cclxuICB2YWx1ZTogXCJibGFja1wiXHJcbiAgcGVuY2lsOiBcIiMwMDAwZmZcIlxyXG4gIGVycm9yOiBcIiNmZjAwMDBcIlxyXG4gIGRvbmU6IFwiI2NjY2NjY1wiXHJcbiAgbWVudTogXCIjMDA4ODMzXCJcclxuICBsaW5rczogXCIjY2MzMzMzXCJcclxuICBiYWNrZ3JvdW5kU2VsZWN0ZWQ6IFwiI2VlZWVhYVwiXHJcbiAgYmFja2dyb3VuZExvY2tlZDogXCIjZWVlZWVlXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkQ29uZmxpY3RlZDogXCIjZmZmZmVlXCJcclxuICBiYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWQ6IFwiI2VlZWVkZFwiXHJcbiAgYmFja2dyb3VuZENvbmZsaWN0ZWQ6IFwiI2ZmZmZkZFwiXHJcbiAgYmFja2dyb3VuZEVycm9yOiBcIiNmZmRkZGRcIlxyXG4gIG1vZGVTZWxlY3Q6IFwiIzc3Nzc0NFwiXHJcbiAgbW9kZVBlbjogXCIjMDAwMDAwXCJcclxuICBtb2RlUGVuY2lsOiBcIiMwMDAwZmZcIlxyXG4gIG1vZGVMaW5rczogXCIjY2MzMzMzXCJcclxuXHJcbkFjdGlvblR5cGUgPVxyXG4gIFNFTEVDVDogMFxyXG4gIFBFTkNJTDogMVxyXG4gIFBFTjogMlxyXG4gIE1FTlU6IDNcclxuICBVTkRPOiA0XHJcbiAgUkVETzogNVxyXG4gIE1PREU6IDZcclxuXHJcbk1vZGVUeXBlID1cclxuICBISUdITElHSFRJTkc6IDBcclxuICBQRU5DSUw6IDFcclxuICBQRU46IDJcclxuICBMSU5LUzogM1xyXG5cclxuIyBTcGVjaWFsIHBlbi9wZW5jaWwgdmFsdWVzXHJcbk5PTkUgPSAwXHJcbkNMRUFSID0gMTBcclxuXHJcbmNsYXNzIFN1ZG9rdVZpZXdcclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEluaXRcclxuXHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcclxuXHJcbiAgICB3aWR0aEJhc2VkQ2VsbFNpemUgPSBAY2FudmFzLndpZHRoIC8gOVxyXG4gICAgaGVpZ2h0QmFzZWRDZWxsU2l6ZSA9IEBjYW52YXMuaGVpZ2h0IC8gMTRcclxuICAgIGNvbnNvbGUubG9nIFwid2lkdGhCYXNlZENlbGxTaXplICN7d2lkdGhCYXNlZENlbGxTaXplfSBoZWlnaHRCYXNlZENlbGxTaXplICN7aGVpZ2h0QmFzZWRDZWxsU2l6ZX1cIlxyXG4gICAgQGNlbGxTaXplID0gTWF0aC5taW4od2lkdGhCYXNlZENlbGxTaXplLCBoZWlnaHRCYXNlZENlbGxTaXplKVxyXG5cclxuICAgICMgY2FsYyByZW5kZXIgY29uc3RhbnRzXHJcbiAgICBAbGluZVdpZHRoVGhpbiA9IDFcclxuICAgIEBsaW5lV2lkdGhUaGljayA9IE1hdGgubWF4KEBjZWxsU2l6ZSAvIDIwLCAzKVxyXG4gICAgQGxpbmtEb3RSYWRpdXMgPSBAbGluZVdpZHRoVGhpY2tcclxuXHJcbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxyXG4gICAgZm9udFBpeGVsc00gPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuNSlcclxuICAgIGZvbnRQaXhlbHNMID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjgpXHJcblxyXG4gICAgIyBpbml0IGZvbnRzXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBtZW51OiAgICBAYXBwLnJlZ2lzdGVyRm9udChcIm1lbnVcIiwgICAgXCIje2ZvbnRQaXhlbHNNfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBwZW46ICAgICBAYXBwLnJlZ2lzdGVyRm9udChcInBlblwiLCAgICAgXCIje2ZvbnRQaXhlbHNMfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBpbml0QWN0aW9ucygpXHJcblxyXG4gICAgIyBpbml0IHN0YXRlXHJcbiAgICBAZ2FtZSA9IG5ldyBTdWRva3VHYW1lKClcclxuICAgIEByZXNldFN0YXRlKClcclxuXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIGluaXRBY3Rpb25zOiAtPlxyXG4gICAgQGFjdGlvbnMgPSBuZXcgQXJyYXkoOSAqIDE1KS5maWxsKG51bGwpXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaW5kZXggPSAoaiAqIDkpICsgaVxyXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5TRUxFQ1QsIHg6IGksIHk6IGogfVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGluZGV4ID0gKChQRU5fUE9TX1kgKyBqKSAqIDkpICsgKFBFTl9QT1NfWCArIGkpXHJcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTiwgdmFsdWU6IDEgKyAoaiAqIDMpICsgaSB9XHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaW5kZXggPSAoKFBFTkNJTF9QT1NfWSArIGopICogOSkgKyAoUEVOQ0lMX1BPU19YICsgaSlcclxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOQ0lMLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cclxuXHJcbiAgICAjIFBlbiBjbGVhciBidXR0b25cclxuICAgIGluZGV4ID0gKFBFTl9DTEVBUl9QT1NfWSAqIDkpICsgUEVOX0NMRUFSX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOLCB2YWx1ZTogQ0xFQVIgfVxyXG5cclxuICAgICMgUGVuY2lsIGNsZWFyIGJ1dHRvblxyXG4gICAgaW5kZXggPSAoUEVOQ0lMX0NMRUFSX1BPU19ZICogOSkgKyBQRU5DSUxfQ0xFQVJfUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHZhbHVlOiBDTEVBUiB9XHJcblxyXG4gICAgIyBNZW51IGJ1dHRvblxyXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxyXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLk1FTlUgfVxyXG5cclxuICAgICMgVW5kbyBidXR0b25cclxuICAgIGluZGV4ID0gKFVORE9fUE9TX1kgKiA5KSArIFVORE9fUE9TX1hcclxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5VTkRPIH1cclxuXHJcbiAgICAjIFJlZG8gYnV0dG9uXHJcbiAgICBpbmRleCA9IChSRURPX1BPU19ZICogOSkgKyBSRURPX1BPU19YXHJcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUkVETyB9XHJcblxyXG4gICAgIyBNb2RlIHN3aXRjaFxyXG4gICAgZm9yIGkgaW4gWyhNT0RFX1BPU19ZKjkpK01PREVfU1RBUlRfUE9TX1guLihNT0RFX1BPU19ZKjkpK01PREVfRU5EX1BPU19YXVxyXG4gICAgICBAYWN0aW9uc1tpXSA9IHsgdHlwZTogQWN0aW9uVHlwZS5NT0RFIH1cclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVzZXRTdGF0ZTogLT5cclxuICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgUmVuZGVyaW5nXHJcblxyXG4gIGNob29zZUJhY2tncm91bmRDb2xvcjogKGksIGosIGxvY2tlZCkgLT5cclxuICAgIGNvbG9yID0gbnVsbFxyXG4gICAgaWYgbG9ja2VkXHJcbiAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFxyXG5cclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICBpZiAoQGhpZ2hsaWdodFggIT0gLTEpICYmIChAaGlnaGxpZ2h0WSAhPSAtMSlcclxuICAgICAgICBpZiAoaSA9PSBAaGlnaGxpZ2h0WCkgJiYgKGogPT0gQGhpZ2hsaWdodFkpXHJcbiAgICAgICAgICBpZiBsb2NrZWRcclxuICAgICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICBlbHNlIGlmIEBjb25mbGljdHMoaSwgaiwgQGhpZ2hsaWdodFgsIEBoaWdobGlnaHRZKVxyXG4gICAgICAgICAgaWYgbG9ja2VkXHJcbiAgICAgICAgICAgIGNvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kQ29uZmxpY3RlZFxyXG4gICAgcmV0dXJuIGNvbG9yXHJcblxyXG4gIGRyYXdDZWxsOiAoeCwgeSwgYmFja2dyb3VuZENvbG9yLCBzLCBmb250LCBjb2xvcikgLT5cclxuICAgIHB4ID0geCAqIEBjZWxsU2l6ZVxyXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXHJcbiAgICBpZiBiYWNrZ3JvdW5kQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAYXBwLmRyYXdGaWxsKHB4LCBweSwgQGNlbGxTaXplLCBAY2VsbFNpemUsIGJhY2tncm91bmRDb2xvcilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChzLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIGZvbnQsIGNvbG9yKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdGbGFzaENlbGw6ICh4LCB5KSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgXCJibGFja1wiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdVbnNvbHZlZENlbGw6ICh4LCB5LCBiYWNrZ3JvdW5kQ29sb3IsIG1hcmtzKSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXHJcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxyXG4gICAgZm9yIG0gaW4gbWFya3NcclxuICAgICAgbXggPSBweCArICgobSAtIDEpICUgMykgKiBAY2VsbFNpemUgLyAzICsgQGNlbGxTaXplIC8gNlxyXG4gICAgICBteSA9IHB5ICsgTWF0aC5mbG9vcigobSAtIDEpIC8gMykgKiBAY2VsbFNpemUgLyAzICsgQGNlbGxTaXplIC8gNlxyXG4gICAgICB0ZXh0ID0gU3RyaW5nKG0pXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZCh0ZXh0LCBteCwgbXksIEBmb250cy5wZW5jaWwsIENvbG9yLnBlbmNpbClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3U29sdmVkQ2VsbDogKHgsIHksIGJhY2tncm91bmRDb2xvciwgY29sb3IsIHZhbHVlKSAtPlxyXG4gICAgcHggPSB4ICogQGNlbGxTaXplXHJcbiAgICBweSA9IHkgKiBAY2VsbFNpemVcclxuICAgIGlmIGJhY2tncm91bmRDb2xvciAhPSBudWxsXHJcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFN0cmluZyh2YWx1ZSksIHB4ICsgKEBjZWxsU2l6ZSAvIDIpLCBweSArIChAY2VsbFNpemUgLyAyKSwgQGZvbnRzLnBlbiwgY29sb3IpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd0dyaWQ6IChvcmlnaW5YLCBvcmlnaW5ZLCBzaXplLCBzb2x2ZWQgPSBmYWxzZSkgLT5cclxuICAgIGZvciBpIGluIFswLi5zaXplXVxyXG4gICAgICBjb2xvciA9IGlmIHNvbHZlZCB0aGVuIFwiZ3JlZW5cIiBlbHNlIFwiYmxhY2tcIlxyXG4gICAgICBsaW5lV2lkdGggPSBAbGluZVdpZHRoVGhpblxyXG4gICAgICBpZiAoKHNpemUgPT0gMSkgfHwgKGkgJSAzKSA9PSAwKVxyXG4gICAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGlja1xyXG5cclxuICAgICAgIyBIb3Jpem9udGFsIGxpbmVzXHJcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBzaXplKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgY29sb3IsIGxpbmVXaWR0aClcclxuXHJcbiAgICAgICMgVmVydGljYWwgbGluZXNcclxuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIHNpemUpLCBjb2xvciwgbGluZVdpZHRoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdMaW5rOiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIGNvbG9yLCBsaW5lV2lkdGgpIC0+XHJcbiAgICB4MSA9IChzdGFydFggKyAwLjUpICogQGNlbGxTaXplXHJcbiAgICB5MSA9IChzdGFydFkgKyAwLjUpICogQGNlbGxTaXplXHJcbiAgICB4MiA9IChlbmRYICsgMC41KSAqIEBjZWxsU2l6ZVxyXG4gICAgeTIgPSAoZW5kWSArIDAuNSkgKiBAY2VsbFNpemVcclxuICAgIHIgPSAyLjIgKiBNYXRoLnNxcnQoKHgyIC0geDEpICogKHgyIC0geDEpICsgKHkyIC0geTEpICogKHkyIC0geTEpKSAjIDIuMiBnaXZlcyB0aGUgbW9zdCBjdXJ2ZSB3aXRob3V0IGdvaW5nIG9mZiB0aGUgYm9hcmRcclxuICAgIEBhcHAuZHJhd0FyYyh4MSwgeTEsIHgyLCB5MiwgciwgY29sb3IsIGxpbmVXaWR0aClcclxuICAgIEBhcHAuZHJhd1BvaW50KHgxLCB5MSwgQGxpbmtEb3RSYWRpdXMsIGNvbG9yKVxyXG4gICAgQGFwcC5kcmF3UG9pbnQoeDIsIHkyLCBAbGlua0RvdFJhZGl1cywgY29sb3IpXHJcblxyXG4gIGRyYXc6IChmbGFzaFgsIGZsYXNoWSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxyXG5cclxuICAgICMgTWFrZSB3aGl0ZSBwaG9uZS1zaGFwZWQgYmFja2dyb3VuZFxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxyXG5cclxuICAgICMgRHJhdyBib2FyZCBudW1iZXJzXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiAoaSA9PSBmbGFzaFgpICYmIChqID09IGZsYXNoWSlcclxuICAgICAgICAgICMgRHJhdyBmbGFzaFxyXG4gICAgICAgICAgQGRyYXdGbGFzaENlbGwoaSwgailcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAjIERyYXcgc29sdmVkIG9yIHVuc29sdmVkIGNlbGxcclxuICAgICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXHJcblxyXG4gICAgICAgICAgIyBEZXRlcm1pbmUgYmFja2dyb3VuZCBjb2xvclxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQGNob29zZUJhY2tncm91bmRDb2xvcihpLCBqLCBjZWxsLmxvY2tlZClcclxuXHJcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID09IDBcclxuICAgICAgICAgICAgbWFya3MgPSBAZ2FtZS5wZW5jaWxNYXJrcyhpLCBqKVxyXG4gICAgICAgICAgICBAZHJhd1Vuc29sdmVkQ2VsbChpLCBqLCBiYWNrZ3JvdW5kQ29sb3IsIG1hcmtzKVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBpZiBjZWxsLmVycm9yIHRoZW4gQ29sb3IuZXJyb3IgZWxzZSBDb2xvci52YWx1ZVxyXG4gICAgICAgICAgICBAZHJhd1NvbHZlZENlbGwoaSwgaiwgYmFja2dyb3VuZENvbG9yLCB0ZXh0Q29sb3IsIGNlbGwudmFsdWUpXHJcblxyXG4gICAgIyBEcmF3IGxpbmtzIGluIExJTktTIG1vZGVcclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIGZvciBsaW5rIGluIEBzdHJvbmdMaW5rc1xyXG4gICAgICAgIEBkcmF3TGluayhsaW5rWzBdLngsIGxpbmtbMF0ueSwgbGlua1sxXS54LCBsaW5rWzFdLnksIENvbG9yLmxpbmtzLCBAbGluZVdpZHRoVGhpY2spXHJcbiAgICAgIGZvciBsaW5rIGluIEB3ZWFrTGlua3NcclxuICAgICAgICBAZHJhd0xpbmsobGlua1swXS54LCBsaW5rWzBdLnksIGxpbmtbMV0ueCwgbGlua1sxXS55LCBDb2xvci5saW5rcywgQGxpbmVXaWR0aFRoaW4pXHJcblxyXG4gICAgIyBEcmF3IHBlbiBhbmQgcGVuY2lsIG51bWJlciBidXR0b25zXHJcbiAgICBkb25lID0gQGdhbWUuZG9uZSgpXHJcbiAgICBmb3IgaiBpbiBbMC4uLjNdXHJcbiAgICAgIGZvciBpIGluIFswLi4uM11cclxuICAgICAgICBjdXJyZW50VmFsdWUgPSAoaiAqIDMpICsgaSArIDFcclxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxyXG4gICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci52YWx1ZVxyXG4gICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IucGVuY2lsXHJcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cclxuICAgICAgICAgIHZhbHVlQ29sb3IgPSBDb2xvci5kb25lXHJcbiAgICAgICAgICBwZW5jaWxDb2xvciA9IENvbG9yLmRvbmVcclxuXHJcbiAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gbnVsbFxyXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcclxuICAgICAgICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTCBvciBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcclxuXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXHJcbiAgICAgICAgQGRyYXdDZWxsKFBFTkNJTF9QT1NfWCArIGksIFBFTkNJTF9QT1NfWSArIGosIHBlbmNpbEJhY2tncm91bmRDb2xvciwgY3VycmVudFZhbHVlU3RyaW5nLCBAZm9udHMucGVuLCBwZW5jaWxDb2xvcilcclxuXHJcbiAgICAjIERyYXcgcGVuIGFuZCBwZW5jaWwgQ0xFQVIgYnV0dG9uc1xyXG4gICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXHJcbiAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcclxuICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICAgICAgcGVuY2lsQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB2YWx1ZUJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxyXG5cclxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcclxuICAgIEBkcmF3Q2VsbChQRU5DSUxfQ0xFQVJfUE9TX1gsIFBFTkNJTF9DTEVBUl9QT1NfWSwgcGVuY2lsQmFja2dyb3VuZENvbG9yLCBcIkNcIiwgQGZvbnRzLnBlbiwgQ29sb3IuZXJyb3IpXHJcblxyXG4gICAgIyBEcmF3IG1vZGVcclxuICAgIHN3aXRjaCBAbW9kZVxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkhJR0hMSUdIVElOR1xyXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVTZWxlY3RcclxuICAgICAgICBtb2RlVGV4dCA9IFwiSGlnaGxpZ2h0aW5nXCJcclxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlUGVuY2lsXHJcbiAgICAgICAgbW9kZVRleHQgPSBcIlBlbmNpbFwiXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlblxyXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5cIlxyXG4gICAgICB3aGVuIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZUxpbmtzXHJcbiAgICAgICAgbW9kZVRleHQgPSBcIkxpbmtzXCJcclxuICAgIEBkcmF3Q2VsbChNT0RFX0NFTlRFUl9QT1NfWCwgTU9ERV9QT1NfWSwgbnVsbCwgbW9kZVRleHQsIEBmb250cy5tZW51LCBtb2RlQ29sb3IpXHJcblxyXG4gICAgQGRyYXdDZWxsKE1FTlVfUE9TX1gsIE1FTlVfUE9TX1ksIG51bGwsIFwiTWVudVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSlcclxuICAgIEBkcmF3Q2VsbChVTkRPX1BPU19YLCBVTkRPX1BPU19ZLCBudWxsLCBcIlxcdXsyNWM0fVwiLCBAZm9udHMubWVudSwgQ29sb3IubWVudSkgaWYgKEBnYW1lLnVuZG9Kb3VybmFsLmxlbmd0aCA+IDApXHJcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxyXG5cclxuICAgICMgTWFrZSB0aGUgZ3JpZHNcclxuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXHJcbiAgICBAZHJhd0dyaWQoUEVOX1BPU19YLCBQRU5fUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX1BPU19YLCBQRU5DSUxfUE9TX1ksIDMpXHJcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXHJcbiAgICBAZHJhd0dyaWQoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIDEpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5wdXRcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcIlN1ZG9rdVZpZXcubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcbiAgICBAZ2FtZS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQHJlc2V0U3RhdGUoKVxyXG4gICAgQGdhbWUucmVzZXQoKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICBAcmVzZXRTdGF0ZSgpXHJcbiAgICByZXR1cm4gQGdhbWUuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgcmV0dXJuIEBnYW1lLmV4cG9ydCgpXHJcblxyXG4gIGhvbGVDb3VudDogLT5cclxuICAgIHJldHVybiBAZ2FtZS5ob2xlQ291bnQoKVxyXG5cclxuICBoYW5kbGVTZWxlY3RBY3Rpb246IChhY3Rpb24pIC0+XHJcbiAgICBzd2l0Y2ggQG1vZGVcclxuICAgICAgd2hlbiBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgICBpZiAoQGhpZ2hsaWdodFggPT0gYWN0aW9uLngpICYmIChAaGlnaGxpZ2h0WSA9PSBhY3Rpb24ueSlcclxuICAgICAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IGFjdGlvbi54XHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XHJcbiAgICAgICAgcmV0dXJuIFtdXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IENMRUFSXHJcbiAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXHJcbiAgICAgICAgZWxzZSBpZiBAcGVuVmFsdWUgIT0gTk9ORVxyXG4gICAgICAgICAgQGdhbWUudG9nZ2xlUGVuY2lsKGFjdGlvbi54LCBhY3Rpb24ueSwgQHBlblZhbHVlKVxyXG4gICAgICAgIHJldHVybiBbIGFjdGlvbi54LCBhY3Rpb24ueSBdXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgaWYgQHBlblZhbHVlID09IENMRUFSXHJcbiAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIDApXHJcbiAgICAgICAgZWxzZSBpZiBAcGVuVmFsdWUgIT0gTk9ORVxyXG4gICAgICAgICAgQGdhbWUuc2V0VmFsdWUoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuIFsgYWN0aW9uLngsIGFjdGlvbi55IF1cclxuXHJcbiAgaGFuZGxlUGVuY2lsQWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgIyBJbiBMSU5LUyBtb2RlLCBhbGwgbGlua3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBudW1iZXIgYXJlIHNob3duLiBDTEVBUiBzaG93cyBub3RoaW5nLlxyXG4gICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcclxuICAgICAgaWYgKGFjdGlvbi52YWx1ZSA9PSBDTEVBUilcclxuICAgICAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICAgICAgQHN0cm9uZ0xpbmtzID0gW11cclxuICAgICAgICBAd2Vha0xpbmtzID0gW11cclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBwZW5WYWx1ZSA9IGFjdGlvbi52YWx1ZVxyXG4gICAgICAgIHsgc3Ryb25nOiBAc3Ryb25nTGlua3MsIHdlYWs6IEB3ZWFrTGlua3MgfSA9IEBnYW1lLmdldExpbmtzKGFjdGlvbi52YWx1ZSlcclxuXHJcbiAgICAjIEluIFBFTkNJTCBtb2RlLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIEhJR0hMSUdIVElORyBpZiB0aGUgc2VsZWN0ZWQgdmFsdWUgaXMgYWxyZWFkeSBjdXJyZW50XHJcbiAgICBlbHNlIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTkNJTCBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuXHJcbiAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTkNJTCB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcclxuICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcblxyXG4gICAgICAjIE1ha2Ugc3VyZSBhbnkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXHJcbiAgICAgIEBoaWdobGlnaHRYID0gLTFcclxuICAgICAgQGhpZ2hsaWdodFkgPSAtMVxyXG4gICAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgICBAd2Vha0xpbmtzID0gW11cclxuXHJcbiAgaGFuZGxlUGVuQWN0aW9uOiAoYWN0aW9uKSAtPlxyXG4gICAgIyBJZ25vcmVkIGluIExJTktTIG1vZGVcclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICMgSW4gUEVOIG1vZGUsIHRoZSBtb2RlIGlzIGNoYW5nZWQgdG8gSElHSExJR0hUSU5HIGlmIHRoZSBzZWxlY3RlZCB2YWx1ZSBpcyBhbHJlYWR5IGN1cnJlbnRcclxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLlBFTiBhbmQgKEBwZW5WYWx1ZSA9PSBhY3Rpb24udmFsdWUpXHJcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcclxuXHJcbiAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTiB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5cclxuICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXHJcblxyXG4gICAgICAjIE1ha2Ugc3VyZSBhbnkgaGlnaGxpZ2h0aW5nIGlzIG9mZiBhbmQgbGlua3MgYXJlIGNsZWFyZWQuXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gIGhhbmRsZVVuZG9BY3Rpb246IC0+XHJcbiAgICByZXR1cm4gQGdhbWUudW5kbygpIGlmIEBtb2RlIGlzbnQgTW9kZVR5cGUuTElOS1NcclxuXHJcbiAgaGFuZGxlUmVkb0FjdGlvbjogLT5cclxuICAgIHJldHVybiBAZ2FtZS5yZWRvKCkgaWYgQG1vZGUgaXNudCBNb2RlVHlwZS5MSU5LU1xyXG5cclxuICBoYW5kbGVNb2RlQWN0aW9uOiAtPlxyXG4gICAgc3dpdGNoIEBtb2RlXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOXHJcbiAgICAgIHdoZW4gTW9kZVR5cGUuUEVOXHJcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcclxuICAgICAgd2hlbiBNb2RlVHlwZS5MSU5LU1xyXG4gICAgICAgIEBtb2RlID0gTW9kZVR5cGUuUEVOQ0lMXHJcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gIGNsaWNrOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJjbGljayAje3h9LCAje3l9XCJcclxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXHJcbiAgICB5ID0gTWF0aC5mbG9vcih5IC8gQGNlbGxTaXplKVxyXG5cclxuICAgIGZsYXNoWCA9IG51bGxcclxuICAgIGZsYXNoWSA9IG51bGxcclxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcclxuICAgICAgICBpbmRleCA9ICh5ICogOSkgKyB4XHJcbiAgICAgICAgYWN0aW9uID0gQGFjdGlvbnNbaW5kZXhdXHJcbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiQWN0aW9uOiBcIiwgYWN0aW9uXHJcblxyXG4gICAgICAgICAgaWYgYWN0aW9uLnR5cGUgaXMgQWN0aW9uVHlwZS5NRU5VXHJcbiAgICAgICAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgc3dpdGNoIGFjdGlvbi50eXBlXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1QgdGhlbiBbIGZsYXNoWCwgZmxhc2hZIF0gPSBAaGFuZGxlU2VsZWN0QWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlBFTkNJTCB0aGVuIEBoYW5kbGVQZW5jaWxBY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUEVOIHRoZW4gQGhhbmRsZVBlbkFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5VTkRPIHRoZW4gWyBmbGFzaFgsIGZsYXNoWSBdID0gQGhhbmRsZVVuZG9BY3Rpb24oKVxyXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuUkVETyB0aGVuIFsgZmxhc2hYLCBmbGFzaFkgXSA9IEBoYW5kbGVSZWRvQWN0aW9uKClcclxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLk1PREUgdGhlbiBAaGFuZGxlTW9kZUFjdGlvbigpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIyBubyBhY3Rpb24sIGRlZmF1bHQgdG8gaGlnaGxpZ2h0aW5nIG1vZGVcclxuICAgICAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXHJcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IC0xXHJcbiAgICAgICAgICBAcGVuVmFsdWUgPSBOT05FXHJcbiAgICAgICAgICBAc3Ryb25nTGlua3MgPSBbXVxyXG4gICAgICAgICAgQHdlYWtMaW5rcyA9IFtdXHJcblxyXG4gICAgICAgIEBkcmF3KGZsYXNoWCwgZmxhc2hZKVxyXG4gICAgICAgIGlmIChmbGFzaFg/ICYmIGZsYXNoWT8pXHJcbiAgICAgICAgICBzZXRUaW1lb3V0ID0+XHJcbiAgICAgICAgICAgIEBkcmF3KClcclxuICAgICAgICAgICwgMzNcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBIZWxwZXJzXHJcblxyXG4gIGNvbmZsaWN0czogKHgxLCB5MSwgeDIsIHkyKSAtPlxyXG4gICAgIyBzYW1lIHJvdyBvciBjb2x1bW4/XHJcbiAgICBpZiAoeDEgPT0geDIpIHx8ICh5MSA9PSB5MilcclxuICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICAjIHNhbWUgc2VjdGlvbj9cclxuICAgIHN4MSA9IE1hdGguZmxvb3IoeDEgLyAzKSAqIDNcclxuICAgIHN5MSA9IE1hdGguZmxvb3IoeTEgLyAzKSAqIDNcclxuICAgIHN4MiA9IE1hdGguZmxvb3IoeDIgLyAzKSAqIDNcclxuICAgIHN5MiA9IE1hdGguZmxvb3IoeTIgLyAzKSAqIDNcclxuICAgIGlmIChzeDEgPT0gc3gyKSAmJiAoc3kxID09IHN5MilcclxuICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdVZpZXdcclxuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcclxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxyXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxyXG5cclxuICAjIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cclxuICAjICAgY29uc29sZS5sb2cgT2JqZWN0LmtleXMoZS50b3VjaGVzWzBdKVxyXG4gICMgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAjICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAjICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjEyXCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMy4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcChhLGMpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYywhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGMpfWZ1bmN0aW9uIHUoYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGIoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGIpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gZygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZyksYSgpfSl9O2Z1bmN0aW9uIHcoYSl7dGhpcy5nPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5nLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLm09ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5qPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMubD0tMTt0aGlzLmguc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmouc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMubS5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmguYXBwZW5kQ2hpbGQodGhpcy5tKTt0aGlzLmkuYXBwZW5kQ2hpbGQodGhpcy5qKTt0aGlzLmcuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmcuYXBwZW5kQ2hpbGQodGhpcy5pKX1cbmZ1bmN0aW9uIHgoYSxjKXthLmcuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2MrXCI7XCJ9ZnVuY3Rpb24gQihhKXt2YXIgYz1hLmcub2Zmc2V0V2lkdGgsYj1jKzEwMDthLmouc3R5bGUud2lkdGg9YitcInB4XCI7YS5pLnNjcm9sbExlZnQ9YjthLmguc2Nyb2xsTGVmdD1hLmguc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmwhPT1jPyhhLmw9YywhMCk6ITF9ZnVuY3Rpb24gQyhhLGMpe2Z1bmN0aW9uIGIoKXt2YXIgZT1nO0IoZSkmJm51bGwhPT1lLmcucGFyZW50Tm9kZSYmYyhlLmwpfXZhciBnPWE7cChhLmgsYik7cChhLmksYik7QihhKX07ZnVuY3Rpb24gRChhLGMsYil7Yz1jfHx7fTtiPWJ8fHdpbmRvdzt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwiO3RoaXMuY29udGV4dD1ifXZhciBFPW51bGwsRj1udWxsLEc9bnVsbCxIPW51bGw7ZnVuY3Rpb24gSShhKXtudWxsPT09RiYmKE0oYSkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcik/KGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEY9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCkpOkY9ITEpO3JldHVybiBGfWZ1bmN0aW9uIE0oYSl7bnVsbD09PUgmJihIPSEhYS5kb2N1bWVudC5mb250cyk7cmV0dXJuIEh9XG5mdW5jdGlvbiBOKGEsYyl7dmFyIGI9YS5zdHlsZSxnPWEud2VpZ2h0O2lmKG51bGw9PT1HKXt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXtlLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKHEpe31HPVwiXCIhPT1lLnN0eWxlLmZvbnR9cmV0dXJuW2IsZyxHP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixjXS5qb2luKFwiIFwiKX1cbkQucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxjKXt2YXIgYj10aGlzLGc9YXx8XCJCRVNic3d5XCIsZT0wLHE9Y3x8M0UzLEo9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKEssTCl7aWYoTShiLmNvbnRleHQpJiYhSShiLmNvbnRleHQpKXt2YXIgTz1uZXcgUHJvbWlzZShmdW5jdGlvbihyLHQpe2Z1bmN0aW9uIGgoKXsobmV3IERhdGUpLmdldFRpbWUoKS1KPj1xP3QoRXJyb3IoXCJcIitxK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk6Yi5jb250ZXh0LmRvY3VtZW50LmZvbnRzLmxvYWQoTihiLCdcIicrYi5mYW1pbHkrJ1wiJyksZykudGhlbihmdW5jdGlvbihuKXsxPD1uLmxlbmd0aD9yKCk6c2V0VGltZW91dChoLDI1KX0sdCl9aCgpfSksUD1uZXcgUHJvbWlzZShmdW5jdGlvbihyLHQpe2U9c2V0VGltZW91dChmdW5jdGlvbigpe3QoRXJyb3IoXCJcIitxK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LHEpfSk7UHJvbWlzZS5yYWNlKFtQLE9dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGUpO1xuSyhiKX0sTCl9ZWxzZSB1KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcigpe3ZhciBkO2lmKGQ9LTEhPWsmJi0xIT1sfHwtMSE9ayYmLTEhPW18fC0xIT1sJiYtMSE9bSkoZD1rIT1sJiZrIT1tJiZsIT1tKXx8KG51bGw9PT1FJiYoZD0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksRT0hIWQmJig1MzY+cGFyc2VJbnQoZFsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGRbMV0sMTApJiYxMT49cGFyc2VJbnQoZFsyXSwxMCkpKSxkPUUmJihrPT15JiZsPT15JiZtPT15fHxrPT16JiZsPT16JiZtPT16fHxrPT1BJiZsPT1BJiZtPT1BKSksZD0hZDtkJiYobnVsbCE9PWYucGFyZW50Tm9kZSYmZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGYpLGNsZWFyVGltZW91dChlKSxLKGIpKX1mdW5jdGlvbiB0KCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSj49cSludWxsIT09Zi5wYXJlbnROb2RlJiZmLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZiksXG5MKEVycm9yKFwiXCIrcStcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpO2Vsc2V7dmFyIGQ9Yi5jb250ZXh0LmRvY3VtZW50LmhpZGRlbjtpZighMD09PWR8fHZvaWQgMD09PWQpaz1oLmcub2Zmc2V0V2lkdGgsbD1uLmcub2Zmc2V0V2lkdGgsbT12Lmcub2Zmc2V0V2lkdGgscigpO2U9c2V0VGltZW91dCh0LDUwKX19dmFyIGg9bmV3IHcoZyksbj1uZXcgdyhnKSx2PW5ldyB3KGcpLGs9LTEsbD0tMSxtPS0xLHk9LTEsej0tMSxBPS0xLGY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmLmRpcj1cImx0clwiO3goaCxOKGIsXCJzYW5zLXNlcmlmXCIpKTt4KG4sTihiLFwic2VyaWZcIikpO3godixOKGIsXCJtb25vc3BhY2VcIikpO2YuYXBwZW5kQ2hpbGQoaC5nKTtmLmFwcGVuZENoaWxkKG4uZyk7Zi5hcHBlbmRDaGlsZCh2LmcpO2IuY29udGV4dC5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGYpO3k9aC5nLm9mZnNldFdpZHRoO3o9bi5nLm9mZnNldFdpZHRoO0E9di5nLm9mZnNldFdpZHRoO3QoKTtcbkMoaCxmdW5jdGlvbihkKXtrPWQ7cigpfSk7eChoLE4oYiwnXCInK2IuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0MobixmdW5jdGlvbihkKXtsPWQ7cigpfSk7eChuLE4oYiwnXCInK2IuZmFtaWx5KydcIixzZXJpZicpKTtDKHYsZnVuY3Rpb24oZCl7bT1kO3IoKX0pO3godixOKGIsJ1wiJytiLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9RDood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9RCx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1ELnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
