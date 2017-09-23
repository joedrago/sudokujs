FontFaceObserver = require 'FontFaceObserver'
SudokuGame = require './SudokuGame'

PEN_POS_X = 1
PEN_POS_Y = 10
PEN_CLEAR_POS_X = 2
PEN_CLEAR_POS_Y = 13

PENCIL_POS_X = 5
PENCIL_POS_Y = 10
PENCIL_CLEAR_POS_X = 6
PENCIL_CLEAR_POS_Y = 13

NEWGAME_POS_X = 4
NEWGAME_POS_Y = 13

Color =
  value: "black"
  pencil: "#0000ff"
  error: "#ff0000"
  done: "#cccccc"
  newGame: "#008833"
  backgroundSelected: "#eeeeaa"
  backgroundLocked: "#eeeeee"
  backgroundLockedConflicted: "#ffffee"
  backgroundLockedSelected: "#eeeedd"
  backgroundConflicted: "#ffffdd"
  backgroundError: "#ffdddd"

ActionType =
  SELECT: 0
  PENCIL: 1
  VALUE: 2
  NEWGAME: 3

class SudokuRenderer
  # -------------------------------------------------------------------------------------
  # Init

  constructor: (@canvas) ->
    @ctx = @canvas.getContext("2d")
    console.log "canvas size #{@canvas.width}x#{@canvas.height}"

    widthBasedCellSize = @canvas.width / 9
    heightBasedCellSize = @canvas.height / 14
    console.log "widthBasedCellSize #{widthBasedCellSize} heightBasedCellSize #{heightBasedCellSize}"
    @cellSize = Math.min(widthBasedCellSize, heightBasedCellSize)

    # calc render constants
    @lineWidthThin = 1
    @lineWidthThick = Math.max(@cellSize / 20, 3)

    fontPixelsS = Math.floor(@cellSize * 0.3)
    fontPixelsM = Math.floor(@cellSize * 0.5)
    fontPixelsL = Math.floor(@cellSize * 0.8)

    # init fonts
    @font =
      pencil:
        style: "#{fontPixelsS}px saxMono, monospace"
        height: 0
      newgame:
        style: "#{fontPixelsM}px saxMono, monospace"
        height: 0
      pen:
        style: "#{fontPixelsL}px saxMono, monospace"
        height: 0
    for fontName, f of @font
      @ctx.font = f.style
      @ctx.fillStyle = "black"
      @ctx.textAlign = "center"
      f.height = @ctx.measureText("m").width * 1.1 # best hack ever

    @initActions()

    # init state
    @game = new SudokuGame()
    @penValue = 0
    @isPencil = false
    @highlightX = -1
    @highlightY = -1

    @draw()

    @redrawWhenFontLoads()

  initActions: ->
    @actions = new Array(9 * 15).fill(null)

    for j in [0...9]
      for i in [0...9]
        index = (j * 9) + i
        @actions[index] = { type: ActionType.SELECT, x: i, y: j }

    for j in [0...3]
      for i in [0...3]
        index = ((PEN_POS_Y + j) * 9) + (PEN_POS_X + i)
        @actions[index] = { type: ActionType.VALUE, x: 1 + (j * 3) + i, y: 0 }

    for j in [0...3]
      for i in [0...3]
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i)
        @actions[index] = { type: ActionType.PENCIL, x: 1 + (j * 3) + i, y: 0 }

    # Value clear button
    index = (PEN_CLEAR_POS_Y * 9) + PEN_CLEAR_POS_X
    @actions[index] = { type: ActionType.VALUE, x: 10, y: 0 }

    # Pencil clear button
    index = (PENCIL_CLEAR_POS_Y * 9) + PENCIL_CLEAR_POS_X
    @actions[index] = { type: ActionType.PENCIL, x: 10, y: 0 }

    # New Game button
    index = (NEWGAME_POS_Y * 9) + NEWGAME_POS_X
    @actions[index] = { type: ActionType.NEWGAME, x: 0, y: 0 }

    return

  # -------------------------------------------------------------------------------------
  # Rendering

  drawFill: (x, y, w, h, color) ->
    @ctx.beginPath()
    @ctx.rect(x, y, w, h)
    @ctx.fillStyle = color
    @ctx.fill()

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

  drawCell: (x, y, backgroundColor, s, font, color) ->
    px = x * @cellSize
    py = y * @cellSize
    if backgroundColor != null
      @drawFill(px, py, @cellSize, @cellSize, backgroundColor)
    @drawTextCentered(s, px + (@cellSize / 2), py + (@cellSize / 2), font, color)

  drawGrid: (originX, originY, size, solved = false) ->
    for i in [0..size]
      color = if solved then "green" else "black"
      lineWidth = @lineWidthThin
      if ((size == 1) || (i % 3) == 0)
        lineWidth = @lineWidthThick

      # Horizontal lines
      @drawLine(@cellSize * (originX + 0), @cellSize * (originY + i), @cellSize * (originX + size), @cellSize * (originY + i), color, lineWidth)

      # Vertical lines
      @drawLine(@cellSize * (originX + i), @cellSize * (originY + 0), @cellSize * (originX + i), @cellSize * (originY + size), color, lineWidth)

    return

  draw: ->
    console.log "draw()"

    # Clear screen
    @drawFill(0, 0, @canvas.width, @canvas.height, "black")

    # Make white phone-shaped background
    @drawFill(0, 0, @cellSize * 9, @canvas.height, "white")

    for j in [0...9]
      for i in [0...9]
        cell = @game.grid[i][j]

        backgroundColor = null
        font = @font.pen
        textColor = Color.value
        text = ""
        if cell.value == 0
          font = @font.pencil
          textColor = Color.pencil
          text = @game.pencilString(i, j)
        else
          if cell.value > 0
            text = String(cell.value)

        if cell.locked
          backgroundColor = Color.backgroundLocked

        if (@highlightX != -1) && (@highlightY != -1)
          if (i == @highlightX) && (j == @highlightY)
            if cell.locked
              backgroundColor = Color.backgroundLockedSelected
            else
              backgroundColor = Color.backgroundSelected
          else if @conflicts(i, j, @highlightX, @highlightY)
            if cell.locked
              backgroundColor = Color.backgroundLockedConflicted
            else
              backgroundColor = Color.backgroundConflicted

        if cell.error
          textColor = Color.error

        @drawCell(i, j, backgroundColor, text, font, textColor)

    done = [false, false, false, false, false, false, false, false, false]
    for j in [0...3]
      for i in [0...3]
        currentValue = (j * 3) + i + 1
        currentValueString = String(currentValue)
        valueColor = Color.value
        pencilColor = Color.pencil
        if done[(j * 3) + i]
          valueColor = Color.done
          pencilColor = Color.done

        valueBackgroundColor = null
        pencilBackgroundColor = null
        if @penValue == currentValue
          if @isPencil
            pencilBackgroundColor = Color.backgroundSelected
          else
            valueBackgroundColor = Color.backgroundSelected

        @drawCell(PEN_POS_X + i, PEN_POS_Y + j, valueBackgroundColor, currentValueString, @font.pen, valueColor)
        @drawCell(PENCIL_POS_X + i, PENCIL_POS_Y + j, pencilBackgroundColor, currentValueString, @font.pen, pencilColor)

    valueBackgroundColor = null
    pencilBackgroundColor = null
    if @penValue == 10
        if @isPencil
            pencilBackgroundColor = Color.backgroundSelected
        else
            valueBackgroundColor = Color.backgroundSelected

    @drawCell(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, valueBackgroundColor, "C", @font.pen, Color.error)
    @drawCell(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, pencilBackgroundColor, "C", @font.pen, Color.error)

    @drawCell(NEWGAME_POS_X, NEWGAME_POS_Y, null, "New", @font.newgame, Color.newGame)

    # Make the grids
    @drawGrid(0, 0, 9, @game.solved)
    @drawGrid(PEN_POS_X, PEN_POS_Y, 3)
    @drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3)
    @drawGrid(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, 1)
    @drawGrid(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, 1)

  # -------------------------------------------------------------------------------------
  # Input

  offerNewGame: ->

  click: (x, y) ->
    # console.log "click #{x}, #{y}"
    x = Math.floor(x / @cellSize)
    y = Math.floor(y / @cellSize)

    if (x < 9) && (y < 15)
        index = (y * 9) + x
        action = @actions[index]
        if action != null
          console.log "Action: ", action
          switch action.type
            when ActionType.SELECT
              if @penValue == 0
                if (@highlightX == action.x) && (@highlightY == action.y)
                  @highlightX = -1
                  @highlightY = -1
                else
                  @highlightX = action.x
                  @highlightY = action.y
              else
                if @isPencil
                  if @penValue == 10
                    @game.clearPencil(action.x, action.y)
                  else
                    @game.togglePencil(action.x, action.y, @penValue)
                else
                  if @penValue == 10
                    @game.setValue(action.x, action.y, 0)
                  else
                    @game.setValue(action.x, action.y, @penValue)

            when ActionType.PENCIL
              @penValue = action.x
              @isPencil = true

            when ActionType.VALUE
              @penValue = action.x
              @isPencil = false

            when ActionType.NEWGAME
              @offerNewGame()
        else
          # no action
          @highlightX = -1
          @highlightY = -1
          @penValue = 0
          @isPencil = false

        @draw()

  # -------------------------------------------------------------------------------------
  # Loading

  redrawWhenFontLoads: ->
    font = new FontFaceObserver("saxMono")
    font.load().then =>
      console.log('saxMono loaded, redrawing...')
      @draw()

  # -------------------------------------------------------------------------------------
  # Helpers

  conflicts: (x1, y1, x2, y2) ->
    # same row or column?
    if (x1 == x2) || (y1 == y2)
      return true

    # same section?
    sx1 = Math.floor(x1 / 3) * 3
    sy1 = Math.floor(y1 / 3) * 3
    sx2 = Math.floor(x2 / 3) * 3
    sy2 = Math.floor(y2 / 3) * 3
    if (sx1 == sx2) && (sy1 == sy2)
      return true

    return false

  # -------------------------------------------------------------------------------------

module.exports = SudokuRenderer
