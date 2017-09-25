FontFaceObserver = require 'FontFaceObserver'

MenuView = require './MenuView'
SudokuView = require './SudokuView'
version = require './version'

class App
  constructor: (@canvas) ->
    @ctx = @canvas.getContext("2d")
    @loadFont("saxMono")
    @fonts = {}

    @versionFontHeight = Math.floor(@canvas.height * 0.02)
    @versionFont = @registerFont("version", "#{@versionFontHeight}px saxMono, monospace")

    @views =
      menu: new MenuView(this, @canvas)
      sudoku: new SudokuView(this, @canvas)
    @switchView("sudoku")

  measureFonts: ->
    for fontName, f of @fonts
      @ctx.font = f.style
      @ctx.fillStyle = "black"
      @ctx.textAlign = "center"
      f.height = Math.floor(@ctx.measureText("m").width * 1.1) # best hack ever
      console.log "Font #{fontName} measured at #{f.height} pixels"
    return

  registerFont: (name, style) ->
    font =
      name: name
      style: style
      height: 0
    @fonts[name] = font
    @measureFonts()
    return font

  loadFont: (fontName) ->
    font = new FontFaceObserver(fontName)
    font.load().then =>
      console.log("#{fontName} loaded, redrawing...")
      @measureFonts()
      @draw()

  switchView: (view) ->
    @view = @views[view]
    @draw()

  newGame: (difficulty) ->
    # console.log "app.newGame(#{difficulty})"
    @views.sudoku.newGame(difficulty)
    @switchView("sudoku")

  clear: (difficulty) ->
    @views.sudoku.clear()
    @switchView("sudoku")

  draw: ->
    @view.draw()

  click: (x, y) ->
    @view.click(x, y)

  drawFill: (x, y, w, h, color) ->
    @ctx.beginPath()
    @ctx.rect(x, y, w, h)
    @ctx.fillStyle = color
    @ctx.fill()

  drawRoundedRect: (x, y, w, h, r, fillColor = null, strokeColor = null) ->
    @ctx.roundRect(x, y, w, h, r)
    if fillColor != null
      @ctx.fillStyle = fillColor
      @ctx.fill()
    if strokeColor != null
      @ctx.strokeStyle = strokeColor
      @ctx.stroke()
    return

  drawRect: (x, y, w, h, color, lineWidth = 1) ->
    @ctx.beginPath()
    @ctx.strokeStyle = color
    @ctx.lineWidth = lineWidth
    @ctx.rect(x, y, w, h)
    @ctx.stroke()

  drawLine: (x1, y1, x2, y2, color = "black", lineWidth = 1) ->
    @ctx.beginPath()
    @ctx.strokeStyle = color
    @ctx.lineWidth = lineWidth
    @ctx.moveTo(x1, y1)
    @ctx.lineTo(x2, y2)
    @ctx.stroke()

  drawTextCentered: (text, cx, cy, font, color) ->
    @ctx.font = font.style
    @ctx.fillStyle = color
    @ctx.textAlign = "center"
    @ctx.fillText(text, cx, cy + (font.height / 2))

  drawVersion: (color = "white") ->
    @ctx = @canvas.getContext("2d")
    @ctx.font = @versionFont.style
    @ctx.fillStyle = color
    @ctx.textAlign = "right"
    @ctx.fillText("v#{version}", @canvas.width - (@versionFont.height / 2), @canvas.height - (@versionFont.height / 2))

CanvasRenderingContext2D.prototype.roundRect = (x, y, w, h, r) ->
  if (w < 2 * r) then r = w / 2
  if (h < 2 * r) then r = h / 2
  @beginPath()
  @moveTo(x+r, y)
  @arcTo(x+w, y,   x+w, y+h, r)
  @arcTo(x+w, y+h, x,   y+h, r)
  @arcTo(x,   y+h, x,   y,   r)
  @arcTo(x,   y,   x+w, y,   r)
  @closePath()
  return this

module.exports = App
