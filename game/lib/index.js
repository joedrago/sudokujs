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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2FtZS5jb2ZmZWUiLCJnYW1lL3NyYy9TdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVKO0VBQ1MsYUFBQyxNQUFEO0lBQUMsSUFBQyxDQUFBLFNBQUQ7SUFDWixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBNEIsSUFBQyxDQUFBLGlCQUFGLEdBQW9CLHVCQUEvQztJQUVmLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUN4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QUFDLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEI7RUFIbUMsQ0FBckM7QUFoQks7O0FBcUJQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQ3ZCQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnZm9udGZhY2VvYnNlcnZlcidcblxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xuU3Vkb2t1VmlldyA9IHJlcXVpcmUgJy4vU3Vkb2t1VmlldydcbnZlcnNpb24gPSByZXF1aXJlICcuL3ZlcnNpb24nXG5cbmNsYXNzIEFwcFxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxuICAgIEBmb250cyA9IHt9XG5cbiAgICBAdmVyc2lvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQGdlbmVyYXRpbmdGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDQpXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEB2aWV3cyA9XG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcbiAgICAgIHN1ZG9rdTogbmV3IFN1ZG9rdVZpZXcodGhpcywgQGNhbnZhcylcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIG1lYXN1cmVGb250czogLT5cbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXG4gICAgICBAY3R4LmZvbnQgPSBmLnN0eWxlXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgICBmLmhlaWdodCA9IE1hdGguZmxvb3IoQGN0eC5tZWFzdXJlVGV4dChcIm1cIikud2lkdGggKiAxLjEpICMgYmVzdCBoYWNrIGV2ZXJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxuICAgIHJldHVyblxuXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxuICAgIGZvbnQgPVxuICAgICAgbmFtZTogbmFtZVxuICAgICAgc3R5bGU6IHN0eWxlXG4gICAgICBoZWlnaHQ6IDBcbiAgICBAZm9udHNbbmFtZV0gPSBmb250XG4gICAgQG1lYXN1cmVGb250cygpXG4gICAgcmV0dXJuIGZvbnRcblxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcbiAgICBmb250LmxvYWQoKS50aGVuID0+XG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXG4gICAgICBAbWVhc3VyZUZvbnRzKClcbiAgICAgIEBkcmF3KClcblxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cbiAgICBAdmlldyA9IEB2aWV3c1t2aWV3XVxuICAgIEBkcmF3KClcblxuICBuZXdHYW1lOiAoZGlmZmljdWx0eSkgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuXG4gICAgIyBAZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzQ0NDQ0NFwiKVxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgIyB3aW5kb3cuc2V0VGltZW91dCA9PlxuICAgIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxuICAgIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG4gICAgIyAsIDBcblxuICByZXNldDogLT5cbiAgICBAdmlld3Muc3Vkb2t1LnJlc2V0KClcbiAgICBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxuXG4gIGhvbGVDb3VudDogLT5cbiAgICByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxuXG4gIGRyYXc6IC0+XG4gICAgQHZpZXcuZHJhdygpXG5cbiAgY2xpY2s6ICh4LCB5KSAtPlxuICAgIEB2aWV3LmNsaWNrKHgsIHkpXG5cbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHguZmlsbCgpXG5cbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXG4gICAgICBAY3R4LmZpbGwoKVxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxuICAgICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yKSAtPlxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCBjeCwgY3kgKyAoZm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxuXG4gIGRyYXdBcmM6ICh4MSwgeTEsIHgyLCB5MiwgcmFkaXVzLCBjb2xvciwgbGluZVdpZHRoKSAtPlxuICAgICMgRGVyaXZlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW1ib2xvL2RyYXdBcmMgYXQgNmMzZTBkM1xuXG4gICAgUDEgPSB7IHg6IHgxLCB5OiB5MSB9XG4gICAgUDIgPSB7IHg6IHgyLCB5OiB5MiB9XG5cbiAgICAjIERldGVybWluZSB0aGUgbWlkcG9pbnQgKE0pIGZyb20gUDEgdG8gUDJcbiAgICBNID1cbiAgICAgIHg6IChQMS54ICsgUDIueCkgLyAyXG4gICAgICB5OiAoUDEueSArIFAyLnkpIC8gMlxuXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gTSB0byBQMVxuICAgIGRNUDEgPSBNYXRoLnNxcnQoKFAxLnggLSBNLngpKihQMS54IC0gTS54KSArIChQMS55IC0gTS55KSooUDEueSAtIE0ueSkpXG5cbiAgICAjIFZhbGlkYXRlIHRoZSByYWRpdXNcbiAgICBpZiBub3QgcmFkaXVzPyBvciByYWRpdXMgPCBkTVAxXG4gICAgICByYWRpdXMgPSBkTVAxXG5cbiAgICAjIERldGVybWluZSB0aGUgdW5pdCB2ZWN0b3IgZnJvbSBNIHRvIFAxXG4gICAgdU1QMSA9XG4gICAgICB4OiAoUDEueCAtIE0ueCkgLyBkTVAxXG4gICAgICB5OiAoUDEueSAtIE0ueSkgLyBkTVAxXG5cbiAgICAjIERldGVybWluZSB0aGUgdW5pdCB2ZWN0b3IgZnJvbSBNIHRvIFEgKGp1c3QgdU1QMSByb3RhdGVkIHBpLzIpXG4gICAgdU1RID0geyB4OiAtdU1QMS55LCB5OiB1TVAxLnggfVxuXG4gICAgIyBEZXRlcm1pbmUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlIChDKSB0byBNXG4gICAgZENNID0gTWF0aC5zcXJ0KHJhZGl1cypyYWRpdXMgLSBkTVAxKmRNUDEpXG5cbiAgICAjIERldGVybWluZSB0aGUgZGlzdGFuY2UgZnJvbSBNIHRvIFFcbiAgICBkTVEgPSBkTVAxICogZE1QMSAvIGRDTVxuXG4gICAgIyBEZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIFFcbiAgICBRID1cbiAgICAgIHg6IE0ueCArIHVNUS54ICogZE1RXG4gICAgICB5OiBNLnkgKyB1TVEueSAqIGRNUVxuXG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxuICAgIEBjdHguYXJjVG8oUS54LCBRLnksIHgyLCB5MiwgcmFkaXVzKVxuICAgIEBjdHguc3Ryb2tlKClcbiAgICByZXR1cm5cblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcbiAgQGJlZ2luUGF0aCgpXG4gIEBtb3ZlVG8oeCtyLCB5KVxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxuICBAY2xvc2VQYXRoKClcbiAgcmV0dXJuIHRoaXNcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xuXG5CVVRUT05fSEVJR0hUID0gMC4wNlxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXG5cbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXG4gIGlmIGluZGV4ID4gM1xuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDRcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgaWYgaW5kZXggPiA2XG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIHJldHVybiB5XG5cbmNsYXNzIE1lbnVWaWV3XG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cbiAgICBAYnV0dG9ucyA9XG4gICAgICBuZXdFYXN5OlxuICAgICAgICB5OiBidXR0b25Qb3MoMClcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRWFzeVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNzczM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdFYXN5LmJpbmQodGhpcylcbiAgICAgIG5ld01lZGl1bTpcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IE1lZGl1bVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdNZWRpdW0uYmluZCh0aGlzKVxuICAgICAgbmV3SGFyZDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEhhcmRcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzMzNcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAbmV3SGFyZC5iaW5kKHRoaXMpXG4gICAgICBuZXdFeHRyZW1lOlxuICAgICAgICB5OiBidXR0b25Qb3MoMylcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogRXh0cmVtZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MTExMVwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBuZXdFeHRyZW1lLmJpbmQodGhpcylcbiAgICAgIHJlc2V0OlxuICAgICAgICB5OiBidXR0b25Qb3MoNClcbiAgICAgICAgdGV4dDogXCJSZXNldCBQdXp6bGVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzNzdcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzZXQuYmluZCh0aGlzKVxuICAgICAgaW1wb3J0OlxuICAgICAgICB5OiBidXR0b25Qb3MoNSlcbiAgICAgICAgdGV4dDogXCJMb2FkIFB1enpsZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBpbXBvcnQuYmluZCh0aGlzKVxuICAgICAgZXhwb3J0OlxuICAgICAgICB5OiBidXR0b25Qb3MoNilcbiAgICAgICAgdGV4dDogXCJTaGFyZSBQdXp6bGVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAZXhwb3J0LmJpbmQodGhpcylcbiAgICAgIHJlc3VtZTpcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXG5cbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcblxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNilcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICBzdWJ0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcbiAgICBAc3VidGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3N1YnRpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICByZXR1cm5cblxuICBkcmF3OiAtPlxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxuXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAwNVxuXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcbiAgICB5MiA9IHkxICsgQGNhbnZhcy5oZWlnaHQgKiAwLjA2XG4gICAgeTMgPSB5MiArIEBjYW52YXMuaGVpZ2h0ICogMC4wNlxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkJhZCBHdXlcIiwgeCArIHNoYWRvd09mZnNldCwgeTEgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJJdCdzIGxpa2UgU3Vkb2t1LCBidXQgeW91IGFyZSB0aGUgYmFkIGd1eS5cIiwgeCwgeTMsIEBzdWJ0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcblxuICAgIEBhcHAuZHJhd0xvd2VyTGVmdChcIiN7QGFwcC5ob2xlQ291bnQoKX0vODFcIilcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcblxuICBjbGljazogKHgsIHkpIC0+XG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcbiAgICByZXR1cm5cblxuICBuZXdFYXN5OiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxuXG4gIG5ld01lZGl1bTogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtKVxuXG4gIG5ld0hhcmQ6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQpXG5cbiAgbmV3RXh0cmVtZTogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSlcblxuICByZXNldDogLT5cbiAgICBAYXBwLnJlc2V0KClcblxuICByZXN1bWU6IC0+XG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbiAgZXhwb3J0OiAtPlxuICAgIGlmIG5hdmlnYXRvci5zaGFyZSAhPSB1bmRlZmluZWRcbiAgICAgIG5hdmlnYXRvci5zaGFyZSB7XG4gICAgICAgIHRpdGxlOiBcIlN1ZG9rdSBTaGFyZWQgR2FtZVwiXG4gICAgICAgIHRleHQ6IEBhcHAuZXhwb3J0KClcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIHdpbmRvdy5wcm9tcHQoXCJDb3B5IHRoaXMgYW5kIHBhc3RlIHRvIGEgZnJpZW5kOlwiLCBAYXBwLmV4cG9ydCgpKVxuXG4gIGltcG9ydDogLT5cbiAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiUGFzdGUgYW4gZXhwb3J0ZWQgZ2FtZSBoZXJlOlwiLCBcIlwiKVxuICAgIGlmIGltcG9ydFN0cmluZyA9PSBudWxsXG4gICAgICByZXR1cm5cbiAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXG4gICAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXG5cbiMgUmV0dXJucyB0aGUgaW5kZXggb2YgYSBjZWxsIGluIHJvdyBtYWpvciBvcmRlciAodGhvdWdoIHRoZXkgYXJlIHN0b3JlZCBpbiBjb2x1bW4gbWFqb3Igb3JkZXIpXG5jZWxsSW5kZXggPSAoeCwgeSkgLT4geSAqIDkgKyB4XG5cbiMgU29ydCBieSBhc2NlbmRpbmcgbG9jYXRpb24gYW5kIHRoZW4gYnkgc3RyZW5ndGggKHN0cm9uZyB0aGVuIHdlYWspXG5hc2NlbmRpbmdMaW5rU29ydCA9IChhLCBiKSAtPlxuICBhMCA9IGNlbGxJbmRleChhLmNlbGxzWzBdLngsIGEuY2VsbHNbMF0ueSlcbiAgYTEgPSBjZWxsSW5kZXgoYS5jZWxsc1sxXS54LCBhLmNlbGxzWzFdLnkpXG4gIGIwID0gY2VsbEluZGV4KGIuY2VsbHNbMF0ueCwgYi5jZWxsc1swXS55KVxuICBiMSA9IGNlbGxJbmRleChiLmNlbGxzWzFdLngsIGIuY2VsbHNbMV0ueSlcbiAgcmV0dXJuIGlmIGEwID4gYjAgb3IgKGEwID09IGIwIGFuZCAoYTEgPiBiMSBvciAoYTEgPT0gYjEgYW5kIChub3QgYS5zdHJvbmc/IGFuZCBiLnN0cm9uZz8pKSkpIHRoZW4gMSBlbHNlIC0xXG5cbiMgTm90ZSBzdHJlbmd0aCBpcyBub3QgY29tcGFyZWRcbnVuaXF1ZUxpbmtGaWx0ZXIgPSAoZSwgaSwgYSkgLT5cbiAgaWYgaSA9PSAwXG4gICAgcmV0dXJuIHRydWUgXG4gIHAgPSBhW2ktMV1cbiAgZTAgPSBjZWxsSW5kZXgoZS5jZWxsc1swXS54LCBlLmNlbGxzWzBdLnkpXG4gIGUxID0gY2VsbEluZGV4KGUuY2VsbHNbMV0ueCwgZS5jZWxsc1sxXS55KVxuICBwMCA9IGNlbGxJbmRleChwLmNlbGxzWzBdLngsIHAuY2VsbHNbMF0ueSlcbiAgcDEgPSBjZWxsSW5kZXgocC5jZWxsc1sxXS54LCBwLmNlbGxzWzFdLnkpXG4gIHJldHVybiBlMCAhPSBwMCBvciBlMSAhPSBwMVxuXG5nZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMgPSAoY2VsbHMpIC0+XG4gIGxpbmtzID0gW11cbiAgY291bnQgPSBjZWxscy5sZW5ndGhcbiAgZm9yIGkgaW4gWzAuLi5jb3VudC0xXVxuICAgIGZvciBqIGluIFtpKzEuLi5jb3VudF1cbiAgICAgIGxpbmtzLnB1c2goeyBjZWxsczogW2NlbGxzW2ldLCBjZWxsc1tqXV0gfSlcbiAgcmV0dXJuIGxpbmtzXG5cbmNsYXNzIFN1ZG9rdUdhbWVcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGNsZWFyKClcbiAgICBpZiBub3QgQGxvYWQoKVxuICAgICAgQG5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcbiAgICByZXR1cm5cblxuICBjbGVhcjogLT5cbiAgICBAZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0gPVxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgZXJyb3I6IGZhbHNlXG4gICAgICAgICAgbG9ja2VkOiBmYWxzZVxuICAgICAgICAgIHBlbmNpbDogbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXG5cbiAgICBAc29sdmVkID0gZmFsc2VcbiAgICBAdW5kb0pvdXJuYWwgPSBbXVxuICAgIEByZWRvSm91cm5hbCA9IFtdXG5cbiAgaG9sZUNvdW50OiAtPlxuICAgIGNvdW50ID0gMFxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgbm90IEBncmlkW2ldW2pdLmxvY2tlZFxuICAgICAgICAgIGNvdW50ICs9IDFcbiAgICByZXR1cm4gY291bnRcblxuICBleHBvcnQ6IC0+XG4gICAgZXhwb3J0U3RyaW5nID0gXCJTRFwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXS5sb2NrZWRcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIje0BncmlkW2ldW2pdLnZhbHVlfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBleHBvcnRTdHJpbmcgKz0gXCIwXCJcbiAgICByZXR1cm4gZXhwb3J0U3RyaW5nXG5cbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIEBjbGVhcigpXG5cbiAgICBpbmRleCA9IDBcbiAgICB6ZXJvQ2hhckNvZGUgPSBcIjBcIi5jaGFyQ29kZUF0KDApXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICB2ID0gaW1wb3J0U3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpIC0gemVyb0NoYXJDb2RlXG4gICAgICAgIGluZGV4ICs9IDFcbiAgICAgICAgaWYgdiA+IDBcbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXG4gICAgICAgICAgQGdyaWRbaV1bal0udmFsdWUgPSB2XG5cbiAgICBAdXBkYXRlQ2VsbHMoKVxuICAgIEBzYXZlKClcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHVwZGF0ZUNlbGw6ICh4LCB5KSAtPlxuICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgeCAhPSBpXG4gICAgICAgIHYgPSBAZ3JpZFtpXVt5XS52YWx1ZVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGlmIHYgPT0gY2VsbC52YWx1ZVxuICAgICAgICAgICAgQGdyaWRbaV1beV0uZXJyb3IgPSB0cnVlXG4gICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuXG4gICAgICBpZiB5ICE9IGlcbiAgICAgICAgdiA9IEBncmlkW3hdW2ldLnZhbHVlXG4gICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgaWYgdiA9PSBjZWxsLnZhbHVlXG4gICAgICAgICAgICBAZ3JpZFt4XVtpXS5lcnJvciA9IHRydWVcbiAgICAgICAgICAgIGNlbGwuZXJyb3IgPSB0cnVlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgdiA9IEBncmlkW3N4ICsgaV1bc3kgKyBqXS52YWx1ZVxuICAgICAgICAgIGlmIHYgPiAwXG4gICAgICAgICAgICBpZiB2ID09IGNlbGwudmFsdWVcbiAgICAgICAgICAgICAgQGdyaWRbc3ggKyBpXVtzeSArIGpdLmVycm9yID0gdHJ1ZVxuICAgICAgICAgICAgICBjZWxsLmVycm9yID0gdHJ1ZVxuICAgIHJldHVyblxuXG4gIHVwZGF0ZUNlbGxzOiAtPlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgQGdyaWRbaV1bal0uZXJyb3IgPSBmYWxzZVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqKVxuXG4gICAgQHNvbHZlZCA9IHRydWVcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLmVycm9yXG4gICAgICAgICAgQHNvbHZlZCA9IGZhbHNlXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlID09IDBcbiAgICAgICAgICBAc29sdmVkID0gZmFsc2VcblxuICAgICMgaWYgQHNvbHZlZFxuICAgICMgICBjb25zb2xlLmxvZyBcInNvbHZlZCAje0Bzb2x2ZWR9XCJcblxuICAgIHJldHVybiBAc29sdmVkXG5cbiAgZG9uZTogLT5cbiAgICBkID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXG4gICAgY291bnRzID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIEBncmlkW2ldW2pdLnZhbHVlICE9IDBcbiAgICAgICAgICBjb3VudHNbQGdyaWRbaV1bal0udmFsdWUtMV0gKz0gMVxuXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgaWYgY291bnRzW2ldID09IDlcbiAgICAgICAgZFtpXSA9IHRydWVcbiAgICByZXR1cm4gZFxuXG4gIHBlbmNpbFN0cmluZzogKHgsIHkpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgcyA9IFwiXCJcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiBjZWxsLnBlbmNpbFtpXVxuICAgICAgICBzICs9IFN0cmluZyhpKzEpXG4gICAgcmV0dXJuIHNcblxuICBkbzogKGFjdGlvbiwgeCwgeSwgdmFsdWVzLCBqb3VybmFsKSAtPlxuICAgIGlmIHZhbHVlcy5sZW5ndGggPiAwXG4gICAgICBjZWxsID0gQGdyaWRbeF1beV1cbiAgICAgIHN3aXRjaCBhY3Rpb25cbiAgICAgICAgd2hlbiBcInRvZ2dsZVBlbmNpbFwiXG4gICAgICAgICAgam91cm5hbC5wdXNoIHsgYWN0aW9uOiBcInRvZ2dsZVBlbmNpbFwiLCB4OiB4LCB5OiB5LCB2YWx1ZXM6IHZhbHVlcyB9XG4gICAgICAgICAgY2VsbC5wZW5jaWxbdi0xXSA9ICFjZWxsLnBlbmNpbFt2LTFdIGZvciB2IGluIHZhbHVlc1xuICAgICAgICB3aGVuIFwic2V0VmFsdWVcIlxuICAgICAgICAgIGpvdXJuYWwucHVzaCB7IGFjdGlvbjogXCJzZXRWYWx1ZVwiLCB4OiB4LCB5OiB5LCB2YWx1ZXM6IFtjZWxsLnZhbHVlXSB9XG4gICAgICAgICAgY2VsbC52YWx1ZSA9IHZhbHVlc1swXVxuICAgICAgQHVwZGF0ZUNlbGxzKClcbiAgICAgIEBzYXZlKClcblxuICB1bmRvOiAtPlxuICAgIGlmIChAdW5kb0pvdXJuYWwubGVuZ3RoID4gMClcbiAgICAgIHN0ZXAgPSBAdW5kb0pvdXJuYWwucG9wKClcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAcmVkb0pvdXJuYWxcblxuICByZWRvOiAtPlxuICAgIGlmIChAcmVkb0pvdXJuYWwubGVuZ3RoID4gMClcbiAgICAgIHN0ZXAgPSBAcmVkb0pvdXJuYWwucG9wKClcbiAgICAgIEBkbyBzdGVwLmFjdGlvbiwgc3RlcC54LCBzdGVwLnksIHN0ZXAudmFsdWVzLCBAdW5kb0pvdXJuYWxcblxuICBjbGVhclBlbmNpbDogKHgsIHkpIC0+XG4gICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIEBkbyBcInRvZ2dsZVBlbmNpbFwiLCB4LCB5LCAoaSsxIGZvciBmbGFnLCBpIGluIGNlbGwucGVuY2lsIHdoZW4gZmxhZyksIEB1bmRvSm91cm5hbFxuICAgIEByZWRvSm91cm5hbCA9IFtdXG5cbiAgdG9nZ2xlUGVuY2lsOiAoeCwgeSwgdikgLT5cbiAgICBpZiBAZ3JpZFt4XVt5XS5sb2NrZWRcbiAgICAgIHJldHVyblxuICAgIEBkbyBcInRvZ2dsZVBlbmNpbFwiLCB4LCB5LCBbdl0sIEB1bmRvSm91cm5hbFxuICAgIEByZWRvSm91cm5hbCA9IFtdXG5cbiAgc2V0VmFsdWU6ICh4LCB5LCB2KSAtPlxuICAgIGlmIEBncmlkW3hdW3ldLmxvY2tlZFxuICAgICAgcmV0dXJuXG4gICAgQGRvIFwic2V0VmFsdWVcIiwgeCwgeSwgW3ZdLCBAdW5kb0pvdXJuYWxcbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxuXG4gIHJlc2V0OiAtPlxuICAgIGNvbnNvbGUubG9nIFwicmVzZXQoKVwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgaWYgbm90IGNlbGwubG9ja2VkXG4gICAgICAgICAgY2VsbC52YWx1ZSA9IDBcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBjZWxsLnBlbmNpbFtrXSA9IGZhbHNlXG4gICAgQHVuZG9Kb3VybmFsID0gW11cbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxuICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBAc2F2ZSgpXG5cbiAgZ2V0TGlua3M6ICh2YWx1ZSkgLT5cbiAgICAjIE5vdGU6IHRoZSBzZWFyY2ggc29ydHMgdGhlIGxpbmtzIGluIHJvdyBtYWpvciBvcmRlciwgZmlyc3QgYnkgc3RhcnQgY2VsbCwgdGhlbiBieSBlbmQgY2VsbFxuICAgIGxpbmtzID0gW11cblxuICAgICMgR2V0IHJvdyBsaW5rc1xuICAgIGZvciB5IGluIFswLi4uOV1cbiAgICAgIGxpbmtzLnB1c2ggQGdldFJvd0xpbmtzKHksIHZhbHVlKS4uLlxuXG4gICAgIyBHZXQgY29sdW1uIGxpbmtzXG4gICAgZm9yIHggaW4gWzAuLi45XVxuICAgICAgbGlua3MucHVzaCBAZ2V0Q29sdW1uTGlua3MoeCwgdmFsdWUpLi4uXG5cbiAgICAjIEdldCBib3ggbGlua3NcbiAgICBmb3IgYm94WCBpbiBbMC4uLjNdXG4gICAgICBmb3IgYm94WSBpbiBbMC4uLjNdXG4gICAgICAgIGxpbmtzLnB1c2ggQGdldEJveExpbmtzKGJveFgsIGJveFksIHZhbHVlKS4uLlxuXG4gICAgIyBUaGUgYm94IGxpbmtzIG1pZ2h0IGhhdmUgZHVwbGljYXRlZCBzb21lIHJvdyBhbmQgY29sdW1uIGxpbmtzLCBzbyBkdXBsaWNhdGVzIG11c3QgYmUgZmlsdGVyZWQgb3V0LiBOb3RlIHRoYXQgb25seVxuICAgICMgbG9jYXRpb25zIGFyZSBjb25zaWRlcmVkIHdoZW4gZmluZGluZyBkdXBsaWNhdGVzLCBidXQgc3Ryb25nIGxpbmtzIHRha2UgcHJlY2VkZW5jZSB3aGVuIGR1cGxpY2F0ZXMgYXJlIHJlbW92ZWQgXG4gICAgIyAoYmVjYXVzZSB0aGV5IGFyZSBvcmRlcmVkIGJlZm9yZSB3ZWFrIGxpbmtzKS5cbiAgICBsaW5rcyA9IGxpbmtzLnNvcnQoYXNjZW5kaW5nTGlua1NvcnQpLmZpbHRlcih1bmlxdWVMaW5rRmlsdGVyKVxuXG4gICAgc3Ryb25nID0gW11cbiAgICBmb3IgbGluayBpbiBsaW5rc1xuICAgICAgc3Ryb25nLnB1c2ggbGluay5jZWxscyBpZiBsaW5rLnN0cm9uZz9cbiAgICB3ZWFrID0gW11cbiAgICBmb3IgbGluayBpbiBsaW5rc1xuICAgICAgd2Vhay5wdXNoIGxpbmsuY2VsbHMgaWYgbm90IGxpbmsuc3Ryb25nP1xuXG4gICAgcmV0dXJuIHsgc3Ryb25nLCB3ZWFrIH1cblxuICBnZXRSb3dMaW5rczogKHksIHZhbHVlKS0+XG4gICAgY2VsbHMgPSBbXVxuICAgIGZvciB4IGluIFswLi4uOV1cbiAgICAgIGNlbGwgPSBAZ3JpZFt4XVt5XVxuICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwIGFuZCBjZWxsLnBlbmNpbFt2YWx1ZS0xXVxuICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxuXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgbGlua3MgPSBbXVxuICAgIHJldHVybiBsaW5rc1xuXG4gIGdldENvbHVtbkxpbmtzOiAoeCwgdmFsdWUpLT5cbiAgICBjZWxscyA9IFtdXG4gICAgZm9yIHkgaW4gWzAuLi45XVxuICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgICBpZiBjZWxsLnZhbHVlID09IDAgYW5kIGNlbGwucGVuY2lsW3ZhbHVlLTFdXG4gICAgICAgIGNlbGxzLnB1c2goeyB4LCB5IH0pXG5cbiAgICBpZiBjZWxscy5sZW5ndGggPiAxXG4gICAgICBsaW5rcyA9IGdlbmVyYXRlTGlua1Blcm11dGF0aW9ucyhjZWxscylcbiAgICAgIGlmIGxpbmtzLmxlbmd0aCA9PSAxXG4gICAgICAgIGxpbmtzWzBdLnN0cm9uZyA9IHRydWVcbiAgICBlbHNlXG4gICAgICBsaW5rcyA9IFtdXG4gICAgcmV0dXJuIGxpbmtzXG5cbiAgZ2V0Qm94TGlua3M6IChib3hYLCBib3hZLCB2YWx1ZSkgLT5cbiAgICBjZWxscyA9IFtdXG4gICAgc3ggPSBib3hYICogM1xuICAgIHN5ID0gYm94WSAqIDNcbiAgICBmb3IgeSBpbiBbc3kuLi5zeSszXVxuICAgICAgZm9yIHggaW4gW3N4Li4uc3grM11cbiAgICAgICAgY2VsbCA9IEBncmlkW3hdW3ldXG4gICAgICAgIGlmIGNlbGwudmFsdWUgPT0gMCBhbmQgY2VsbC5wZW5jaWxbdmFsdWUtMV1cbiAgICAgICAgICBjZWxscy5wdXNoKHsgeCwgeSB9KVxuXG4gICAgaWYgY2VsbHMubGVuZ3RoID4gMVxuICAgICAgbGlua3MgPSBnZW5lcmF0ZUxpbmtQZXJtdXRhdGlvbnMoY2VsbHMpXG4gICAgICBpZiBsaW5rcy5sZW5ndGggPT0gMVxuICAgICAgICBsaW5rc1swXS5zdHJvbmcgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgbGlua3MgPSBbXVxuICAgIHJldHVybiBsaW5rc1xuXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGNvbnNvbGUubG9nIFwibmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBjZWxsID0gQGdyaWRbaV1bal1cbiAgICAgICAgY2VsbC52YWx1ZSA9IDBcbiAgICAgICAgY2VsbC5lcnJvciA9IGZhbHNlXG4gICAgICAgIGNlbGwubG9ja2VkID0gZmFsc2VcbiAgICAgICAgZm9yIGsgaW4gWzAuLi45XVxuICAgICAgICAgIGNlbGwucGVuY2lsW2tdID0gZmFsc2VcblxuICAgIGdlbmVyYXRvciA9IG5ldyBTdWRva3VHZW5lcmF0b3IoKVxuICAgIG5ld0dyaWQgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoZGlmZmljdWx0eSlcbiAgICAjIGNvbnNvbGUubG9nIFwibmV3R3JpZFwiLCBuZXdHcmlkXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBuZXdHcmlkW2ldW2pdICE9IDBcbiAgICAgICAgICBAZ3JpZFtpXVtqXS52YWx1ZSA9IG5ld0dyaWRbaV1bal1cbiAgICAgICAgICBAZ3JpZFtpXVtqXS5sb2NrZWQgPSB0cnVlXG4gICAgQHVuZG9Kb3VybmFsID0gW11cbiAgICBAcmVkb0pvdXJuYWwgPSBbXVxuICAgIEB1cGRhdGVDZWxscygpXG4gICAgQHNhdmUoKVxuXG4gIGxvYWQ6IC0+XG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxuICAgICAgYWxlcnQoXCJObyBsb2NhbCBzdG9yYWdlLCBub3RoaW5nIHdpbGwgd29ya1wiKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVwiKVxuICAgIGlmIGpzb25TdHJpbmcgPT0gbnVsbFxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAjIGNvbnNvbGUubG9nIGpzb25TdHJpbmdcbiAgICBnYW1lRGF0YSA9IEpTT04ucGFyc2UoanNvblN0cmluZylcbiAgICAjIGNvbnNvbGUubG9nIFwiZm91bmQgZ2FtZURhdGFcIiwgZ2FtZURhdGFcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgc3JjID0gZ2FtZURhdGEuZ3JpZFtpXVtqXVxuICAgICAgICBkc3QgPSBAZ3JpZFtpXVtqXVxuICAgICAgICBkc3QudmFsdWUgPSBzcmMudlxuICAgICAgICBkc3QuZXJyb3IgPSBpZiBzcmMuZSA+IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgZHN0LmxvY2tlZCA9IGlmIHNyYy5sID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICBmb3IgayBpbiBbMC4uLjldXG4gICAgICAgICAgZHN0LnBlbmNpbFtrXSA9IGlmIHNyYy5wW2tdID4gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXG4gICAgQHVwZGF0ZUNlbGxzKClcbiAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBnYW1lLlwiXG4gICAgcmV0dXJuIHRydWVcblxuICBzYXZlOiAtPlxuICAgIGlmIG5vdCBsb2NhbFN0b3JhZ2VcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgZ2FtZURhdGEgPVxuICAgICAgZ3JpZDogbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBnYW1lRGF0YS5ncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcblxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgY2VsbCA9IEBncmlkW2ldW2pdXG4gICAgICAgIGdhbWVEYXRhLmdyaWRbaV1bal0gPVxuICAgICAgICAgIHY6IGNlbGwudmFsdWVcbiAgICAgICAgICBlOiBpZiBjZWxsLmVycm9yIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICBsOiBpZiBjZWxsLmxvY2tlZCB0aGVuIDEgZWxzZSAwXG4gICAgICAgICAgcDogW11cbiAgICAgICAgZHN0ID0gZ2FtZURhdGEuZ3JpZFtpXVtqXS5wXG4gICAgICAgIGZvciBrIGluIFswLi4uOV1cbiAgICAgICAgICBkc3QucHVzaChpZiBjZWxsLnBlbmNpbFtrXSB0aGVuIDEgZWxzZSAwKVxuXG4gICAganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGdhbWVEYXRhKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVwiLCBqc29uU3RyaW5nKVxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgZ2FtZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcbiAgICByZXR1cm4gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdhbWVcbiIsInNodWZmbGUgPSAoYSkgLT5cbiAgICBpID0gYS5sZW5ndGhcbiAgICB3aGlsZSAtLWkgPiAwXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcbiAgICAgICAgdCA9IGFbal1cbiAgICAgICAgYVtqXSA9IGFbaV1cbiAgICAgICAgYVtpXSA9IHRcbiAgICByZXR1cm4gYVxuXG5jbGFzcyBCb2FyZFxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxuICAgIEBsb2NrZWRDb3VudCA9IDA7XG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcbiAgICBpZiBvdGhlckJvYXJkICE9IG51bGxcbiAgICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICAgIEBncmlkW2ldW2pdID0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXG4gICAgICAgICAgQGxvY2soaSwgaiwgb3RoZXJCb2FyZC5sb2NrZWRbaV1bal0pXG4gICAgcmV0dXJuXG5cbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGxvY2s6ICh4LCB5LCB2ID0gdHJ1ZSkgLT5cbiAgICBpZiB2XG4gICAgICBAbG9ja2VkQ291bnQgKz0gMSBpZiBub3QgQGxvY2tlZFt4XVt5XVxuICAgIGVsc2VcbiAgICAgIEBsb2NrZWRDb3VudCAtPSAxIGlmIEBsb2NrZWRbeF1beV1cbiAgICBAbG9ja2VkW3hdW3ldID0gdjtcblxuXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcbiAgQGRpZmZpY3VsdHk6XG4gICAgZWFzeTogMVxuICAgIG1lZGl1bTogMlxuICAgIGhhcmQ6IDNcbiAgICBleHRyZW1lOiA0XG5cbiAgY29uc3RydWN0b3I6IC0+XG5cbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cbiAgICBuZXdCb2FyZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXG4gICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXG4gICAgICAgICAgbmV3Qm9hcmRbaV1bal0gPSBib2FyZC5ncmlkW2ldW2pdXG4gICAgcmV0dXJuIG5ld0JvYXJkXG5cbiAgY2VsbFZhbGlkOiAoYm9hcmQsIHgsIHksIHYpIC0+XG4gICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICByZXR1cm4gYm9hcmQuZ3JpZFt4XVt5XSA9PSB2XG5cbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh5ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFt4XVtpXSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgc3ggPSBNYXRoLmZsb29yKHggLyAzKSAqIDNcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgcGVuY2lsTWFya3M6IChib2FyZCwgeCwgeSkgLT5cbiAgICBpZiBib2FyZC5sb2NrZWRbeF1beV1cbiAgICAgIHJldHVybiBbIGJvYXJkLmdyaWRbeF1beV0gXVxuICAgIG1hcmtzID0gW11cbiAgICBmb3IgdiBpbiBbMS4uOV1cbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXG4gICAgICAgIG1hcmtzLnB1c2ggdlxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcbiAgICAgIHNodWZmbGUobWFya3MpXG4gICAgcmV0dXJuIG1hcmtzXG5cbiAgbmV4dEF0dGVtcHQ6IChib2FyZCwgYXR0ZW1wdHMpIC0+XG4gICAgcmVtYWluaW5nSW5kZXhlcyA9IFswLi4uODFdXG5cbiAgICAjIHNraXAgbG9ja2VkIGNlbGxzXG4gICAgZm9yIGluZGV4IGluIFswLi4uODFdXG4gICAgICB4ID0gaW5kZXggJSA5XG4gICAgICB5ID0gaW5kZXggLy8gOVxuICAgICAgaWYgYm9hcmQubG9ja2VkW3hdW3ldXG4gICAgICAgIGsgPSByZW1haW5pbmdJbmRleGVzLmluZGV4T2YoaW5kZXgpXG4gICAgICAgIHJlbWFpbmluZ0luZGV4ZXMuc3BsaWNlKGssIDEpIGlmIGsgPj0gMFxuXG4gICAgIyBza2lwIGNlbGxzIHRoYXQgYXJlIGFscmVhZHkgYmVpbmcgdHJpZWRcbiAgICBmb3IgYSBpbiBhdHRlbXB0c1xuICAgICAgayA9IHJlbWFpbmluZ0luZGV4ZXMuaW5kZXhPZihhLmluZGV4KVxuICAgICAgcmVtYWluaW5nSW5kZXhlcy5zcGxpY2UoaywgMSkgaWYgayA+PSAwXG5cbiAgICByZXR1cm4gbnVsbCBpZiByZW1haW5pbmdJbmRleGVzLmxlbmd0aCA9PSAwICMgYWJvcnQgaWYgdGhlcmUgYXJlIG5vIGNlbGxzIChzaG91bGQgbmV2ZXIgaGFwcGVuKVxuXG4gICAgZmV3ZXN0SW5kZXggPSAtMVxuICAgIGZld2VzdE1hcmtzID0gWzAuLjldXG4gICAgZm9yIGluZGV4IGluIHJlbWFpbmluZ0luZGV4ZXNcbiAgICAgIHggPSBpbmRleCAlIDlcbiAgICAgIHkgPSBpbmRleCAvLyA5XG4gICAgICBtYXJrcyA9IEBwZW5jaWxNYXJrcyhib2FyZCwgeCwgeSlcblxuICAgICAgIyBhYm9ydCBpZiB0aGVyZSBpcyBhIGNlbGwgd2l0aCBubyBwb3NzaWJpbGl0aWVzXG4gICAgICByZXR1cm4gbnVsbCBpZiBtYXJrcy5sZW5ndGggPT0gMFxuXG4gICAgICAjIGRvbmUgaWYgdGhlcmUgaXMgYSBjZWxsIHdpdGggb25seSBvbmUgcG9zc2liaWxpdHkgKClcbiAgICAgIHJldHVybiB7IGluZGV4OiBpbmRleCwgcmVtYWluaW5nOiBtYXJrcyB9IGlmIG1hcmtzLmxlbmd0aCA9PSAxXG5cbiAgICAgICMgcmVtZW1iZXIgdGhpcyBjZWxsIGlmIGl0IGhhcyB0aGUgZmV3ZXN0IG1hcmtzIHNvIGZhclxuICAgICAgaWYgbWFya3MubGVuZ3RoIDwgZmV3ZXN0TWFya3MubGVuZ3RoXG4gICAgICAgIGZld2VzdEluZGV4ID0gaW5kZXhcbiAgICAgICAgZmV3ZXN0TWFya3MgPSBtYXJrc1xuICAgIHJldHVybiB7IGluZGV4OiBmZXdlc3RJbmRleCwgcmVtYWluaW5nOiBmZXdlc3RNYXJrcyB9XG5cbiAgc29sdmU6IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgYXR0ZW1wdHMgPSBbXVxuICAgIHJldHVybiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKVxuXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgIGF0dGVtcHRzID0gW11cblxuICAgICMgaWYgdGhlcmUgaXMgbm8gc29sdXRpb24sIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBmYWxzZSBpZiBAc29sdmVJbnRlcm5hbChzb2x2ZWQsIGF0dGVtcHRzKSA9PSBudWxsXG5cbiAgICB1bmxvY2tlZENvdW50ID0gODEgLSBzb2x2ZWQubG9ja2VkQ291bnRcblxuICAgICMgaWYgdGhlcmUgYXJlIG5vIHVubG9ja2VkIGNlbGxzLCB0aGVuIHRoaXMgc29sdXRpb24gbXVzdCBiZSB1bmlxdWVcbiAgICByZXR1cm4gdHJ1ZSBpZiB1bmxvY2tlZENvdW50ID09IDBcblxuICAgICMgY2hlY2sgZm9yIGEgc2Vjb25kIHNvbHV0aW9uXG4gICAgcmV0dXJuIEBzb2x2ZUludGVybmFsKHNvbHZlZCwgYXR0ZW1wdHMsIHVubG9ja2VkQ291bnQtMSkgPT0gbnVsbFxuXG4gIHNvbHZlSW50ZXJuYWw6IChzb2x2ZWQsIGF0dGVtcHRzLCB3YWxrSW5kZXggPSAwKSAtPlxuICAgIHVubG9ja2VkQ291bnQgPSA4MSAtIHNvbHZlZC5sb2NrZWRDb3VudFxuICAgIHdoaWxlIHdhbGtJbmRleCA8IHVubG9ja2VkQ291bnRcbiAgICAgIGlmIHdhbGtJbmRleCA+PSBhdHRlbXB0cy5sZW5ndGhcbiAgICAgICAgYXR0ZW1wdCA9IEBuZXh0QXR0ZW1wdChzb2x2ZWQsIGF0dGVtcHRzKVxuICAgICAgICBhdHRlbXB0cy5wdXNoKGF0dGVtcHQpIGlmIGF0dGVtcHQgIT0gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBhdHRlbXB0ID0gYXR0ZW1wdHNbd2Fsa0luZGV4XVxuXG4gICAgICBpZiBhdHRlbXB0ICE9IG51bGxcbiAgICAgICAgeCA9IGF0dGVtcHQuaW5kZXggJSA5XG4gICAgICAgIHkgPSBhdHRlbXB0LmluZGV4IC8vIDlcbiAgICAgICAgaWYgYXR0ZW1wdC5yZW1haW5pbmcubGVuZ3RoID4gMFxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gYXR0ZW1wdC5yZW1haW5pbmcucG9wKClcbiAgICAgICAgICB3YWxrSW5kZXggKz0gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXR0ZW1wdHMucG9wKClcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcbiAgICAgICAgICB3YWxrSW5kZXggLT0gMVxuICAgICAgZWxzZVxuICAgICAgICB3YWxrSW5kZXggLT0gMVxuXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gc29sdmVkXG5cbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxuICAgIGJvYXJkID0gQHNvbHZlKG5ldyBCb2FyZCgpKVxuICAgICMgaGFja1xuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYm9hcmQubG9jayhpLCBqKVxuXG4gICAgaW5kZXhlc1RvUmVtb3ZlID0gc2h1ZmZsZShbMC4uLjgxXSlcbiAgICByZW1vdmVkID0gMFxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxuICAgICAgaWYgaW5kZXhlc1RvUmVtb3ZlLmxlbmd0aCA9PSAwXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIHJlbW92ZUluZGV4ID0gaW5kZXhlc1RvUmVtb3ZlLnBvcCgpXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcblxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcbiAgICAgIG5leHRCb2FyZC5sb2NrKHJ4LCByeSwgZmFsc2UpXG5cbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXG4gICAgICAgIHJlbW92ZWQgKz0gMVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxuICAgICAgZWxzZVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcblxuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogYm9hcmRcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICB9XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxuXG4gICAgYmVzdCA9IG51bGxcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBpZiBiZXN0ID09IG51bGxcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG5cbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxuXG4gIHNvbHZlU3RyaW5nOiAoaW1wb3J0U3RyaW5nKSAtPlxuICAgIGlmIGltcG9ydFN0cmluZy5pbmRleE9mKFwiU0RcIikgIT0gMFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaW1wb3J0U3RyaW5nID0gaW1wb3J0U3RyaW5nLnN1YnN0cigyKVxuICAgIGltcG9ydFN0cmluZyA9IGltcG9ydFN0cmluZy5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcubGVuZ3RoICE9IDgxXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGJvYXJkID0gbmV3IEJvYXJkKClcblxuICAgIGluZGV4ID0gMFxuICAgIHplcm9DaGFyQ29kZSA9IFwiMFwiLmNoYXJDb2RlQXQoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIHYgPSBpbXBvcnRTdHJpbmcuY2hhckNvZGVBdChpbmRleCkgLSB6ZXJvQ2hhckNvZGVcbiAgICAgICAgaW5kZXggKz0gMVxuICAgICAgICBpZiB2ID4gMFxuICAgICAgICAgIGJvYXJkLmdyaWRbal1baV0gPSB2XG4gICAgICAgICAgYm9hcmQubG9jayhqLCBpKVxuXG4gICAgc29sdmVkID0gQHNvbHZlKGJvYXJkKVxuICAgIGlmIHNvbHZlZCA9PSBudWxsXG4gICAgICBjb25zb2xlLmxvZyBcIkVSUk9SOiBDYW4ndCBiZSBzb2x2ZWQuXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgaWYgbm90IEBoYXNVbmlxdWVTb2x1dGlvbihib2FyZClcbiAgICAgIGNvbnNvbGUubG9nIFwiRVJST1I6IEJvYXJkIHNvbHZlIG5vdCB1bmlxdWUuXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgYW5zd2VyU3RyaW5nID0gXCJcIlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgYW5zd2VyU3RyaW5nICs9IFwiI3tzb2x2ZWQuZ3JpZFtqXVtpXX0gXCJcbiAgICAgIGFuc3dlclN0cmluZyArPSBcIlxcblwiXG5cbiAgICByZXR1cm4gYW5zd2VyU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcblN1ZG9rdUdhbWUgPSByZXF1aXJlICcuL1N1ZG9rdUdhbWUnXG5cblBFTl9QT1NfWCA9IDFcblBFTl9QT1NfWSA9IDEwXG5QRU5fQ0xFQVJfUE9TX1ggPSAyXG5QRU5fQ0xFQVJfUE9TX1kgPSAxM1xuXG5QRU5DSUxfUE9TX1ggPSA1XG5QRU5DSUxfUE9TX1kgPSAxMFxuUEVOQ0lMX0NMRUFSX1BPU19YID0gNlxuUEVOQ0lMX0NMRUFSX1BPU19ZID0gMTNcblxuTUVOVV9QT1NfWCA9IDRcbk1FTlVfUE9TX1kgPSAxM1xuXG5NT0RFX1NUQVJUX1BPU19YID0gMlxuTU9ERV9DRU5URVJfUE9TX1ggPSA0XG5NT0RFX0VORF9QT1NfWCA9IDZcbk1PREVfUE9TX1kgPSA5XG5cblVORE9fUE9TX1ggPSAwXG5VTkRPX1BPU19ZID0gMTNcblJFRE9fUE9TX1ggPSA4XG5SRURPX1BPU19ZID0gMTNcblxuQ29sb3IgPVxuICB2YWx1ZTogXCJibGFja1wiXG4gIHBlbmNpbDogXCIjMDAwMGZmXCJcbiAgZXJyb3I6IFwiI2ZmMDAwMFwiXG4gIGRvbmU6IFwiI2NjY2NjY1wiXG4gIG1lbnU6IFwiIzAwODgzM1wiXG4gIGxpbmtzOiBcIiNjYzMzMzNcIlxuICBiYWNrZ3JvdW5kU2VsZWN0ZWQ6IFwiI2VlZWVhYVwiXG4gIGJhY2tncm91bmRMb2NrZWQ6IFwiI2VlZWVlZVwiXG4gIGJhY2tncm91bmRMb2NrZWRDb25mbGljdGVkOiBcIiNmZmZmZWVcIlxuICBiYWNrZ3JvdW5kTG9ja2VkU2VsZWN0ZWQ6IFwiI2VlZWVkZFwiXG4gIGJhY2tncm91bmRDb25mbGljdGVkOiBcIiNmZmZmZGRcIlxuICBiYWNrZ3JvdW5kRXJyb3I6IFwiI2ZmZGRkZFwiXG4gIG1vZGVTZWxlY3Q6IFwiIzc3Nzc0NFwiXG4gIG1vZGVQZW46IFwiIzAwMDAwMFwiXG4gIG1vZGVQZW5jaWw6IFwiIzAwMDBmZlwiXG4gIG1vZGVMaW5rczogXCIjY2MzMzMzXCJcblxuQWN0aW9uVHlwZSA9XG4gIFNFTEVDVDogMFxuICBQRU5DSUw6IDFcbiAgUEVOOiAyXG4gIE1FTlU6IDNcbiAgVU5ETzogNFxuICBSRURPOiA1XG4gIE1PREU6IDZcblxuTW9kZVR5cGUgPVxuICBISUdITElHSFRJTkc6IDBcbiAgUEVOQ0lMOiAxXG4gIFBFTjogMlxuICBMSU5LUzogM1xuXG4jIFNwZWNpYWwgcGVuL3BlbmNpbCB2YWx1ZXNcbk5PTkUgPSAwXG5DTEVBUiA9IDEwXG5cbmNsYXNzIFN1ZG9rdVZpZXdcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSW5pdFxuXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxuXG4gICAgd2lkdGhCYXNlZENlbGxTaXplID0gQGNhbnZhcy53aWR0aCAvIDlcbiAgICBoZWlnaHRCYXNlZENlbGxTaXplID0gQGNhbnZhcy5oZWlnaHQgLyAxNFxuICAgIGNvbnNvbGUubG9nIFwid2lkdGhCYXNlZENlbGxTaXplICN7d2lkdGhCYXNlZENlbGxTaXplfSBoZWlnaHRCYXNlZENlbGxTaXplICN7aGVpZ2h0QmFzZWRDZWxsU2l6ZX1cIlxuICAgIEBjZWxsU2l6ZSA9IE1hdGgubWluKHdpZHRoQmFzZWRDZWxsU2l6ZSwgaGVpZ2h0QmFzZWRDZWxsU2l6ZSlcblxuICAgICMgY2FsYyByZW5kZXIgY29uc3RhbnRzXG4gICAgQGxpbmVXaWR0aFRoaW4gPSAxXG4gICAgQGxpbmVXaWR0aFRoaWNrID0gTWF0aC5tYXgoQGNlbGxTaXplIC8gMjAsIDMpXG5cbiAgICBmb250UGl4ZWxzUyA9IE1hdGguZmxvb3IoQGNlbGxTaXplICogMC4zKVxuICAgIGZvbnRQaXhlbHNNID0gTWF0aC5mbG9vcihAY2VsbFNpemUgKiAwLjUpXG4gICAgZm9udFBpeGVsc0wgPSBNYXRoLmZsb29yKEBjZWxsU2l6ZSAqIDAuOClcblxuICAgICMgaW5pdCBmb250c1xuICAgIEBmb250cyA9XG4gICAgICBwZW5jaWw6ICBAYXBwLnJlZ2lzdGVyRm9udChcInBlbmNpbFwiLCAgXCIje2ZvbnRQaXhlbHNTfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgICAgbWVudTogICAgQGFwcC5yZWdpc3RlckZvbnQoXCJtZW51XCIsICAgIFwiI3tmb250UGl4ZWxzTX1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICAgIHBlbjogICAgIEBhcHAucmVnaXN0ZXJGb250KFwicGVuXCIsICAgICBcIiN7Zm9udFBpeGVsc0x9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAaW5pdEFjdGlvbnMoKVxuXG4gICAgIyBpbml0IHN0YXRlXG4gICAgQGdhbWUgPSBuZXcgU3Vkb2t1R2FtZSgpXG4gICAgQHJlc2V0U3RhdGUoKVxuXG4gICAgQGRyYXcoKVxuXG4gIGluaXRBY3Rpb25zOiAtPlxuICAgIEBhY3Rpb25zID0gbmV3IEFycmF5KDkgKiAxNSkuZmlsbChudWxsKVxuXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBpbmRleCA9IChqICogOSkgKyBpXG4gICAgICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5TRUxFQ1QsIHg6IGksIHk6IGogfVxuXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpbmRleCA9ICgoUEVOX1BPU19ZICsgaikgKiA5KSArIChQRU5fUE9TX1ggKyBpKVxuICAgICAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUEVOLCB2YWx1ZTogMSArIChqICogMykgKyBpIH1cblxuICAgIGZvciBqIGluIFswLi4uM11cbiAgICAgIGZvciBpIGluIFswLi4uM11cbiAgICAgICAgaW5kZXggPSAoKFBFTkNJTF9QT1NfWSArIGopICogOSkgKyAoUEVOQ0lMX1BPU19YICsgaSlcbiAgICAgICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlBFTkNJTCwgdmFsdWU6IDEgKyAoaiAqIDMpICsgaSB9XG5cbiAgICAjIFBlbiBjbGVhciBidXR0b25cbiAgICBpbmRleCA9IChQRU5fQ0xFQVJfUE9TX1kgKiA5KSArIFBFTl9DTEVBUl9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU4sIHZhbHVlOiBDTEVBUiB9XG5cbiAgICAjIFBlbmNpbCBjbGVhciBidXR0b25cbiAgICBpbmRleCA9IChQRU5DSUxfQ0xFQVJfUE9TX1kgKiA5KSArIFBFTkNJTF9DTEVBUl9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5QRU5DSUwsIHZhbHVlOiBDTEVBUiB9XG5cbiAgICAjIE1lbnUgYnV0dG9uXG4gICAgaW5kZXggPSAoTUVOVV9QT1NfWSAqIDkpICsgTUVOVV9QT1NfWFxuICAgIEBhY3Rpb25zW2luZGV4XSA9IHsgdHlwZTogQWN0aW9uVHlwZS5NRU5VIH1cblxuICAgICMgVW5kbyBidXR0b25cbiAgICBpbmRleCA9IChVTkRPX1BPU19ZICogOSkgKyBVTkRPX1BPU19YXG4gICAgQGFjdGlvbnNbaW5kZXhdID0geyB0eXBlOiBBY3Rpb25UeXBlLlVORE8gfVxuXG4gICAgIyBSZWRvIGJ1dHRvblxuICAgIGluZGV4ID0gKFJFRE9fUE9TX1kgKiA5KSArIFJFRE9fUE9TX1hcbiAgICBAYWN0aW9uc1tpbmRleF0gPSB7IHR5cGU6IEFjdGlvblR5cGUuUkVETyB9XG5cbiAgICAjIE1vZGUgc3dpdGNoXG4gICAgZm9yIGkgaW4gWyhNT0RFX1BPU19ZKjkpK01PREVfU1RBUlRfUE9TX1guLihNT0RFX1BPU19ZKjkpK01PREVfRU5EX1BPU19YXVxuICAgICAgQGFjdGlvbnNbaV0gPSB7IHR5cGU6IEFjdGlvblR5cGUuTU9ERSB9XG5cbiAgICByZXR1cm5cblxuICByZXNldFN0YXRlOiAtPlxuICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXG4gICAgQHBlblZhbHVlID0gTk9ORVxuICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICBAaGlnaGxpZ2h0WSA9IC0xXG4gICAgQHN0cm9uZ0xpbmtzID0gW11cbiAgICBAd2Vha0xpbmtzID0gW11cblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBSZW5kZXJpbmdcblxuICBkcmF3Q2VsbDogKHgsIHksIGJhY2tncm91bmRDb2xvciwgcywgZm9udCwgY29sb3IpIC0+XG4gICAgcHggPSB4ICogQGNlbGxTaXplXG4gICAgcHkgPSB5ICogQGNlbGxTaXplXG4gICAgaWYgYmFja2dyb3VuZENvbG9yICE9IG51bGxcbiAgICAgIEBhcHAuZHJhd0ZpbGwocHgsIHB5LCBAY2VsbFNpemUsIEBjZWxsU2l6ZSwgYmFja2dyb3VuZENvbG9yKVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChzLCBweCArIChAY2VsbFNpemUgLyAyKSwgcHkgKyAoQGNlbGxTaXplIC8gMiksIGZvbnQsIGNvbG9yKVxuXG4gIGRyYXdHcmlkOiAob3JpZ2luWCwgb3JpZ2luWSwgc2l6ZSwgc29sdmVkID0gZmFsc2UpIC0+XG4gICAgZm9yIGkgaW4gWzAuLnNpemVdXG4gICAgICBjb2xvciA9IGlmIHNvbHZlZCB0aGVuIFwiZ3JlZW5cIiBlbHNlIFwiYmxhY2tcIlxuICAgICAgbGluZVdpZHRoID0gQGxpbmVXaWR0aFRoaW5cbiAgICAgIGlmICgoc2l6ZSA9PSAxKSB8fCAoaSAlIDMpID09IDApXG4gICAgICAgIGxpbmVXaWR0aCA9IEBsaW5lV2lkdGhUaGlja1xuXG4gICAgICAjIEhvcml6b250YWwgbGluZXNcbiAgICAgIEBhcHAuZHJhd0xpbmUoQGNlbGxTaXplICogKG9yaWdpblggKyAwKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgQGNlbGxTaXplICogKG9yaWdpblggKyBzaXplKSwgQGNlbGxTaXplICogKG9yaWdpblkgKyBpKSwgY29sb3IsIGxpbmVXaWR0aClcblxuICAgICAgIyBWZXJ0aWNhbCBsaW5lc1xuICAgICAgQGFwcC5kcmF3TGluZShAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIDApLCBAY2VsbFNpemUgKiAob3JpZ2luWCArIGkpLCBAY2VsbFNpemUgKiAob3JpZ2luWSArIHNpemUpLCBjb2xvciwgbGluZVdpZHRoKVxuICAgIHJldHVyblxuXG4gIGRyYXdMaW5rOiAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFksIGNvbG9yLCBsaW5lV2lkdGgpIC0+XG4gICAgeDEgPSAoc3RhcnRYICsgMC41KSAqIEBjZWxsU2l6ZVxuICAgIHkxID0gKHN0YXJ0WSArIDAuNSkgKiBAY2VsbFNpemVcbiAgICB4MiA9IChlbmRYICsgMC41KSAqIEBjZWxsU2l6ZVxuICAgIHkyID0gKGVuZFkgKyAwLjUpICogQGNlbGxTaXplXG4gICAgciA9IDIuMiAqIE1hdGguc3FydCgoeDIgLSB4MSkgKiAoeDIgLSB4MSkgKyAoeTIgLSB5MSkgKiAoeTIgLSB5MSkpICMgMi4yIGdpdmVzIHRoZSBtb3N0IGN1cnZlIHdpdGhvdXQgZ29pbmcgb2ZmIHRoZSBib2FyZFxuICAgIEBhcHAuZHJhd0FyYyh4MSwgeTEsIHgyLCB5MiwgciwgY29sb3IsIGxpbmVXaWR0aClcblxuICBkcmF3OiAtPlxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcblxuICAgICMgQ2xlYXIgc2NyZWVuIHRvIGJsYWNrXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxuXG4gICAgIyBNYWtlIHdoaXRlIHBob25lLXNoYXBlZCBiYWNrZ3JvdW5kXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2VsbFNpemUgKiA5LCBAY2FudmFzLmhlaWdodCwgXCJ3aGl0ZVwiKVxuXG4gICAgIyBEcmF3IGJvYXJkIG51bWJlcnNcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGNlbGwgPSBAZ2FtZS5ncmlkW2ldW2pdXG5cbiAgICAgICAgIyBEZXRlcm1pbmUgdGV4dCBhdHRyaWJ1dGVzXG4gICAgICAgIGJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICAgICAgZm9udCA9IEBmb250cy5wZW5cbiAgICAgICAgdGV4dENvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgdGV4dCA9IFwiXCJcbiAgICAgICAgaWYgY2VsbC52YWx1ZSA9PSAwXG4gICAgICAgICAgZm9udCA9IEBmb250cy5wZW5jaWxcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgICB0ZXh0ID0gQGdhbWUucGVuY2lsU3RyaW5nKGksIGopXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBjZWxsLnZhbHVlID4gMFxuICAgICAgICAgICAgdGV4dCA9IFN0cmluZyhjZWxsLnZhbHVlKVxuXG4gICAgICAgIGlmIGNlbGwuZXJyb3JcbiAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5lcnJvclxuXG4gICAgICAgICMgRGV0ZXJtaW5lIGJhY2tncm91bmQgY29sb3JcbiAgICAgICAgaWYgY2VsbC5sb2NrZWRcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kTG9ja2VkXG5cbiAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuSElHSExJR0hUSU5HXG4gICAgICAgICAgaWYgKEBoaWdobGlnaHRYICE9IC0xKSAmJiAoQGhpZ2hsaWdodFkgIT0gLTEpXG4gICAgICAgICAgICBpZiAoaSA9PSBAaGlnaGxpZ2h0WCkgJiYgKGogPT0gQGhpZ2hsaWdodFkpXG4gICAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZFNlbGVjdGVkXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgICAgIGVsc2UgaWYgQGNvbmZsaWN0cyhpLCBqLCBAaGlnaGxpZ2h0WCwgQGhpZ2hsaWdodFkpXG4gICAgICAgICAgICAgIGlmIGNlbGwubG9ja2VkXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZExvY2tlZENvbmZsaWN0ZWRcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRDb25mbGljdGVkXG5cbiAgICAgICAgQGRyYXdDZWxsKGksIGosIGJhY2tncm91bmRDb2xvciwgdGV4dCwgZm9udCwgdGV4dENvbG9yKVxuXG4gICAgIyBEcmF3IGxpbmtzIGluIExJTktTIG1vZGVcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xuICAgICAgZm9yIGxpbmsgaW4gQHN0cm9uZ0xpbmtzXG4gICAgICAgIEBkcmF3TGluayhsaW5rWzBdLngsIGxpbmtbMF0ueSwgbGlua1sxXS54LCBsaW5rWzFdLnksIENvbG9yLmxpbmtzLCBAbGluZVdpZHRoVGhpY2spXG4gICAgICBmb3IgbGluayBpbiBAd2Vha0xpbmtzXG4gICAgICAgIEBkcmF3TGluayhsaW5rWzBdLngsIGxpbmtbMF0ueSwgbGlua1sxXS54LCBsaW5rWzFdLnksIENvbG9yLmxpbmtzLCBAbGluZVdpZHRoVGhpbilcblxuICAgICMgRHJhdyBwZW4gYW5kIHBlbmNpbCBudW1iZXIgYnV0dG9uc1xuICAgIGRvbmUgPSBAZ2FtZS5kb25lKClcbiAgICBmb3IgaiBpbiBbMC4uLjNdXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXG4gICAgICAgIGN1cnJlbnRWYWx1ZSA9IChqICogMykgKyBpICsgMVxuICAgICAgICBjdXJyZW50VmFsdWVTdHJpbmcgPSBTdHJpbmcoY3VycmVudFZhbHVlKVxuICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IudmFsdWVcbiAgICAgICAgcGVuY2lsQ29sb3IgPSBDb2xvci5wZW5jaWxcbiAgICAgICAgaWYgZG9uZVsoaiAqIDMpICsgaV1cbiAgICAgICAgICB2YWx1ZUNvbG9yID0gQ29sb3IuZG9uZVxuICAgICAgICAgIHBlbmNpbENvbG9yID0gQ29sb3IuZG9uZVxuXG4gICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG4gICAgICAgIGlmIEBwZW5WYWx1ZSA9PSBjdXJyZW50VmFsdWVcbiAgICAgICAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5QRU5DSUwgb3IgQG1vZGUgaXMgTW9kZVR5cGUuTElOS1NcbiAgICAgICAgICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IENvbG9yLmJhY2tncm91bmRTZWxlY3RlZFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gQ29sb3IuYmFja2dyb3VuZFNlbGVjdGVkXG5cbiAgICAgICAgQGRyYXdDZWxsKFBFTl9QT1NfWCArIGksIFBFTl9QT1NfWSArIGosIHZhbHVlQmFja2dyb3VuZENvbG9yLCBjdXJyZW50VmFsdWVTdHJpbmcsIEBmb250cy5wZW4sIHZhbHVlQ29sb3IpXG4gICAgICAgIEBkcmF3Q2VsbChQRU5DSUxfUE9TX1ggKyBpLCBQRU5DSUxfUE9TX1kgKyBqLCBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IsIGN1cnJlbnRWYWx1ZVN0cmluZywgQGZvbnRzLnBlbiwgcGVuY2lsQ29sb3IpXG5cbiAgICAjIERyYXcgcGVuIGFuZCBwZW5jaWwgQ0xFQVIgYnV0dG9uc1xuICAgIHZhbHVlQmFja2dyb3VuZENvbG9yID0gbnVsbFxuICAgIHBlbmNpbEJhY2tncm91bmRDb2xvciA9IG51bGxcbiAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcbiAgICAgICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOQ0lMXG4gICAgICAgICAgICBwZW5jaWxCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsdWVCYWNrZ3JvdW5kQ29sb3IgPSBDb2xvci5iYWNrZ3JvdW5kU2VsZWN0ZWRcblxuICAgIEBkcmF3Q2VsbChQRU5fQ0xFQVJfUE9TX1gsIFBFTl9DTEVBUl9QT1NfWSwgdmFsdWVCYWNrZ3JvdW5kQ29sb3IsIFwiQ1wiLCBAZm9udHMucGVuLCBDb2xvci5lcnJvcilcbiAgICBAZHJhd0NlbGwoUEVOQ0lMX0NMRUFSX1BPU19YLCBQRU5DSUxfQ0xFQVJfUE9TX1ksIHBlbmNpbEJhY2tncm91bmRDb2xvciwgXCJDXCIsIEBmb250cy5wZW4sIENvbG9yLmVycm9yKVxuXG4gICAgIyBEcmF3IG1vZGVcbiAgICBzd2l0Y2ggQG1vZGVcbiAgICAgIHdoZW4gTW9kZVR5cGUuSElHSExJR0hUSU5HXG4gICAgICAgIG1vZGVDb2xvciA9IENvbG9yLm1vZGVTZWxlY3RcbiAgICAgICAgbW9kZVRleHQgPSBcIkhpZ2hsaWdodGluZ1wiXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxuICAgICAgICBtb2RlQ29sb3IgPSBDb2xvci5tb2RlUGVuY2lsXG4gICAgICAgIG1vZGVUZXh0ID0gXCJQZW5jaWxcIlxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZVBlblxuICAgICAgICBtb2RlVGV4dCA9IFwiUGVuXCJcbiAgICAgIHdoZW4gTW9kZVR5cGUuTElOS1NcbiAgICAgICAgbW9kZUNvbG9yID0gQ29sb3IubW9kZUxpbmtzXG4gICAgICAgIG1vZGVUZXh0ID0gXCJMaW5rc1wiXG4gICAgQGRyYXdDZWxsKE1PREVfQ0VOVEVSX1BPU19YLCBNT0RFX1BPU19ZLCBudWxsLCBtb2RlVGV4dCwgQGZvbnRzLm1lbnUsIG1vZGVDb2xvcilcblxuICAgIEBkcmF3Q2VsbChNRU5VX1BPU19YLCBNRU5VX1BPU19ZLCBudWxsLCBcIk1lbnVcIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpXG4gICAgQGRyYXdDZWxsKFVORE9fUE9TX1gsIFVORE9fUE9TX1ksIG51bGwsIFwiXFx1ezI1YzR9XCIsIEBmb250cy5tZW51LCBDb2xvci5tZW51KSBpZiAoQGdhbWUudW5kb0pvdXJuYWwubGVuZ3RoID4gMClcbiAgICBAZHJhd0NlbGwoUkVET19QT1NfWCwgUkVET19QT1NfWSwgbnVsbCwgXCJcXHV7MjViYX1cIiwgQGZvbnRzLm1lbnUsIENvbG9yLm1lbnUpIGlmIChAZ2FtZS5yZWRvSm91cm5hbC5sZW5ndGggPiAwKVxuXG4gICAgIyBNYWtlIHRoZSBncmlkc1xuICAgIEBkcmF3R3JpZCgwLCAwLCA5LCBAZ2FtZS5zb2x2ZWQpXG4gICAgQGRyYXdHcmlkKFBFTl9QT1NfWCwgUEVOX1BPU19ZLCAzKVxuICAgIEBkcmF3R3JpZChQRU5DSUxfUE9TX1gsIFBFTkNJTF9QT1NfWSwgMylcbiAgICBAZHJhd0dyaWQoUEVOX0NMRUFSX1BPU19YLCBQRU5fQ0xFQVJfUE9TX1ksIDEpXG4gICAgQGRyYXdHcmlkKFBFTkNJTF9DTEVBUl9QT1NfWCwgUEVOQ0lMX0NMRUFSX1BPU19ZLCAxKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIElucHV0XG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgY29uc29sZS5sb2cgXCJTdWRva3VWaWV3Lm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxuICAgIEByZXNldFN0YXRlKClcbiAgICBAZ2FtZS5uZXdHYW1lKGRpZmZpY3VsdHkpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQHJlc2V0U3RhdGUoKVxuICAgIEBnYW1lLnJlc2V0KClcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgQHJlc2V0U3RhdGUoKVxuICAgIHJldHVybiBAZ2FtZS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gQGdhbWUuZXhwb3J0KClcblxuICBob2xlQ291bnQ6IC0+XG4gICAgcmV0dXJuIEBnYW1lLmhvbGVDb3VudCgpXG5cbiAgaGFuZGxlU2VsZWN0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgIHN3aXRjaCBAbW9kZVxuICAgICAgd2hlbiBNb2RlVHlwZS5ISUdITElHSFRJTkdcbiAgICAgICAgaWYgKEBoaWdobGlnaHRYID09IGFjdGlvbi54KSAmJiAoQGhpZ2hsaWdodFkgPT0gYWN0aW9uLnkpXG4gICAgICAgICAgQGhpZ2hsaWdodFggPSAtMVxuICAgICAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBoaWdobGlnaHRYID0gYWN0aW9uLnhcbiAgICAgICAgICBAaGlnaGxpZ2h0WSA9IGFjdGlvbi55XG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcbiAgICAgICAgICBAZ2FtZS5jbGVhclBlbmNpbChhY3Rpb24ueCwgYWN0aW9uLnkpXG4gICAgICAgIGVsc2UgaWYgQHBlblZhbHVlICE9IE5PTkVcbiAgICAgICAgICBAZ2FtZS50b2dnbGVQZW5jaWwoYWN0aW9uLngsIGFjdGlvbi55LCBAcGVuVmFsdWUpXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTlxuICAgICAgICBpZiBAcGVuVmFsdWUgPT0gQ0xFQVJcbiAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIDApXG4gICAgICAgIGVsc2UgaWYgQHBlblZhbHVlICE9IE5PTkVcbiAgICAgICAgICBAZ2FtZS5zZXRWYWx1ZShhY3Rpb24ueCwgYWN0aW9uLnksIEBwZW5WYWx1ZSlcblxuICBoYW5kbGVQZW5jaWxBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgIyBJbiBMSU5LUyBtb2RlLCBhbGwgbGlua3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBudW1iZXIgYXJlIHNob3duLiBDTEVBUiBzaG93cyBub3RoaW5nLlxuICAgIGlmIEBtb2RlIGlzIE1vZGVUeXBlLkxJTktTXG4gICAgICBpZiAoYWN0aW9uLnZhbHVlID09IENMRUFSKVxuICAgICAgICBAcGVuVmFsdWUgPSBOT05FXG4gICAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXG4gICAgICAgIEB3ZWFrTGlua3MgPSBbXVxuICAgICAgZWxzZVxuICAgICAgICBAcGVuVmFsdWUgPSBhY3Rpb24udmFsdWVcbiAgICAgICAgeyBzdHJvbmc6IEBzdHJvbmdMaW5rcywgd2VhazogQHdlYWtMaW5rcyB9ID0gQGdhbWUuZ2V0TGlua3MoYWN0aW9uLnZhbHVlKVxuXG4gICAgIyBJbiBQRU5DSUwgbW9kZSwgdGhlIG1vZGUgaXMgY2hhbmdlZCB0byBISUdITElHSFRJTkcgaWYgdGhlIHNlbGVjdGVkIHZhbHVlIGlzIGFscmVhZHkgY3VycmVudFxuICAgIGVsc2UgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOQ0lMIGFuZCAoQHBlblZhbHVlID09IGFjdGlvbi52YWx1ZSlcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXG4gICAgICBAcGVuVmFsdWUgPSBOT05FXG5cbiAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTkNJTCB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcbiAgICBlbHNlXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTkNJTFxuICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXG5cbiAgICAgICMgTWFrZSBzdXJlIGFueSBoaWdobGlnaHRpbmcgaXMgb2ZmIGFuZCBsaW5rcyBhcmUgY2xlYXJlZC5cbiAgICAgIEBoaWdobGlnaHRYID0gLTFcbiAgICAgIEBoaWdobGlnaHRZID0gLTFcbiAgICAgIEBzdHJvbmdMaW5rcyA9IFtdXG4gICAgICBAd2Vha0xpbmtzID0gW11cblxuICBoYW5kbGVQZW5BY3Rpb246IChhY3Rpb24pIC0+XG4gICAgIyBJZ25vcmVkIGluIExJTktTIG1vZGVcbiAgICBpZiBAbW9kZSBpcyBNb2RlVHlwZS5MSU5LU1xuICAgICAgcmV0dXJuXG5cbiAgICAjIEluIFBFTiBtb2RlLCB0aGUgbW9kZSBpcyBjaGFuZ2VkIHRvIEhJR0hMSUdIVElORyBpZiB0aGUgc2VsZWN0ZWQgdmFsdWUgaXMgYWxyZWFkeSBjdXJyZW50XG4gICAgaWYgQG1vZGUgaXMgTW9kZVR5cGUuUEVOIGFuZCAoQHBlblZhbHVlID09IGFjdGlvbi52YWx1ZSlcbiAgICAgIEBtb2RlID0gTW9kZVR5cGUuSElHSExJR0hUSU5HXG4gICAgICBAcGVuVmFsdWUgPSBOT05FXG5cbiAgICAjIE90aGVyd2lzZSwgdGhlIG1vZGUgaXMgc3dpdGNoZWQgdG8gKG9yIHJlbWFpbnMgYXMpIFBFTiB1c2luZyB0aGUgc2VsZWN0ZWQgdmFsdWVcbiAgICBlbHNlXG4gICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTlxuICAgICAgQHBlblZhbHVlID0gYWN0aW9uLnZhbHVlXG5cbiAgICAgICMgTWFrZSBzdXJlIGFueSBoaWdobGlnaHRpbmcgaXMgb2ZmIGFuZCBsaW5rcyBhcmUgY2xlYXJlZC5cbiAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgIEBzdHJvbmdMaW5rcyA9IFtdXG4gICAgQHdlYWtMaW5rcyA9IFtdXG5cbiAgaGFuZGxlVW5kb0FjdGlvbjogLT5cbiAgICBAZ2FtZS51bmRvKCkgaWYgQG1vZGUgaXNudCBNb2RlVHlwZS5MSU5LU1xuICAgIFxuICBoYW5kbGVSZWRvQWN0aW9uOiAtPlxuICAgIEBnYW1lLnJlZG8oKSBpZiBAbW9kZSBpc250IE1vZGVUeXBlLkxJTktTXG4gICAgXG4gIGhhbmRsZU1vZGVBY3Rpb246IC0+XG4gICAgc3dpdGNoIEBtb2RlXG4gICAgICB3aGVuIE1vZGVUeXBlLkhJR0hMSUdIVElOR1xuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLkxJTktTXG4gICAgICB3aGVuIE1vZGVUeXBlLlBFTkNJTFxuICAgICAgICBAbW9kZSA9IE1vZGVUeXBlLlBFTlxuICAgICAgd2hlbiBNb2RlVHlwZS5QRU5cbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcbiAgICAgIHdoZW4gTW9kZVR5cGUuTElOS1NcbiAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5QRU5DSUxcbiAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgIEBwZW5WYWx1ZSA9IE5PTkVcbiAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgIEB3ZWFrTGlua3MgPSBbXVxuICAgIFxuICBjbGljazogKHgsIHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImNsaWNrICN7eH0sICN7eX1cIlxuICAgIHggPSBNYXRoLmZsb29yKHggLyBAY2VsbFNpemUpXG4gICAgeSA9IE1hdGguZmxvb3IoeSAvIEBjZWxsU2l6ZSlcblxuICAgIGlmICh4IDwgOSkgJiYgKHkgPCAxNSlcbiAgICAgICAgaW5kZXggPSAoeSAqIDkpICsgeFxuICAgICAgICBhY3Rpb24gPSBAYWN0aW9uc1tpbmRleF1cbiAgICAgICAgaWYgYWN0aW9uICE9IG51bGxcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIkFjdGlvbjogXCIsIGFjdGlvblxuXG4gICAgICAgICAgaWYgYWN0aW9uLnR5cGUgaXMgQWN0aW9uVHlwZS5NRU5VXG4gICAgICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIHN3aXRjaCBhY3Rpb24udHlwZSBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5TRUxFQ1QgdGhlbiBAaGFuZGxlU2VsZWN0QWN0aW9uKGFjdGlvbilcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU5DSUwgdGhlbiBAaGFuZGxlUGVuY2lsQWN0aW9uKGFjdGlvbilcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5QRU4gdGhlbiBAaGFuZGxlUGVuQWN0aW9uKGFjdGlvbilcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uVHlwZS5VTkRPIHRoZW4gQGhhbmRsZVVuZG9BY3Rpb24oKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb25UeXBlLlJFRE8gdGhlbiBAaGFuZGxlUmVkb0FjdGlvbigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvblR5cGUuTU9ERSB0aGVuIEBoYW5kbGVNb2RlQWN0aW9uKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgbm8gYWN0aW9uLCBkZWZhdWx0IHRvIGhpZ2hsaWdodGluZyBtb2RlXG4gICAgICAgICAgQG1vZGUgPSBNb2RlVHlwZS5ISUdITElHSFRJTkdcbiAgICAgICAgICBAaGlnaGxpZ2h0WCA9IC0xXG4gICAgICAgICAgQGhpZ2hsaWdodFkgPSAtMVxuICAgICAgICAgIEBwZW5WYWx1ZSA9IE5PTkVcbiAgICAgICAgICBAc3Ryb25nTGlua3MgPSBbXVxuICAgICAgICAgIEB3ZWFrTGlua3MgPSBbXVxuXG4gICAgICAgIEBkcmF3KClcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBIZWxwZXJzXG5cbiAgY29uZmxpY3RzOiAoeDEsIHkxLCB4MiwgeTIpIC0+XG4gICAgIyBzYW1lIHJvdyBvciBjb2x1bW4/XG4gICAgaWYgKHgxID09IHgyKSB8fCAoeTEgPT0geTIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyBzYW1lIHNlY3Rpb24/XG4gICAgc3gxID0gTWF0aC5mbG9vcih4MSAvIDMpICogM1xuICAgIHN5MSA9IE1hdGguZmxvb3IoeTEgLyAzKSAqIDNcbiAgICBzeDIgPSBNYXRoLmZsb29yKHgyIC8gMykgKiAzXG4gICAgc3kyID0gTWF0aC5mbG9vcih5MiAvIDMpICogM1xuICAgIGlmIChzeDEgPT0gc3gyKSAmJiAoc3kxID09IHN5MilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VWaWV3XG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcblxuaW5pdCA9IC0+XG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcbiAgY2FudmFzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxuICBjYW52YXNSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxuXG4gICMgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxuICAjICAgY29uc29sZS5sb2cgT2JqZWN0LmtleXMoZS50b3VjaGVzWzBdKVxuICAjICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICMgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAjICAgd2luZG93LmFwcC5jbGljayh4LCB5KVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgICB3aW5kb3cuYXBwLmNsaWNrKHgsIHkpXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XG4gICAgaW5pdCgpXG4sIGZhbHNlKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xMVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
