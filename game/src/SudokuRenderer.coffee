SudokuGame = require './SudokuGame'

VALUE_POS_X = 1
VALUE_POS_Y = 10
VALUE_CLEAR_POS_X = 2
VALUE_CLEAR_POS_Y = 13

PENCIL_POS_X = 5
PENCIL_POS_Y = 10
PENCIL_CLEAR_POS_X = 6
PENCIL_CLEAR_POS_Y = 13

NEWGAME_POS_X = 4
NEWGAME_POS_Y = 13

COLOR_VALUE = "black"
COLOR_PENCIL = "#0000ff"
COLOR_ERROR = "#ff0000"
COLOR_DONE = "#cccccc"
COLOR_NEWGAME = "#008833"
COLOR_BACKGROUND_SELECTED = "#eeeeaa"
COLOR_BACKGROUND_LOCKED = "#eeeeee"
COLOR_BACKGROUND_LOCKED_CONFLICTED = "#ffffee"
COLOR_BACKGROUND_LOCKED_SELECTED = "#eeeedd"
COLOR_BACKGROUND_CONFLICTED = "#ffffdd"
COLOR_BACKGROUND_ERROR = "#ffdddd"

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

    # calc @cellSize
    if @canvas.width < @canvas.height
      # Portrait, aka not dumb.
      @cellSize = @canvas.width / 9
    else
      # Landscape, aka dumb. Pretend we're portrait.
      @cellSize = @canvas.height / 15

    # calc render constants
    @lineWidthThin = 1
    @lineWidthThick = Math.max(@cellSize / 20, 3)

    fontPixelsS = Math.floor(@cellSize * 0.3)
    fontPixelsM = Math.floor(@cellSize * 0.5)
    fontPixelsL = Math.floor(@cellSize * 0.8)

    # init fonts
    @font =
      pencil:
        style: "#{fontPixelsS}px monospace"
        height: 0
      newgame:
        style: "#{fontPixelsM}px monospace"
        height: 0
      pen:
        style: "#{fontPixelsL}px monospace"
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

  initActions: ->
    @actions = new Array(9 * 15).fill(null)

    for j in [0...9]
      for i in [0...9]
        index = (j * 9) + i
        @actions[index] = { type: ActionType.SELECT, x: i, y: j }

    for j in [0...3]
      for i in [0...3]
        index = ((VALUE_POS_Y + j) * 9) + (VALUE_POS_X + i)
        @actions[index] = { type: ActionType.VALUE, x: 1 + (j * 3) + i, y: 0 }

    for j in [0...3]
      for i in [0...3]
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i)
        @actions[index] = { type: ActionType.PENCIL, x: 1 + (j * 3) + i, y: 0 }

    # Value clear button
    index = (VALUE_CLEAR_POS_Y * 9) + VALUE_CLEAR_POS_X
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
        textColor = COLOR_VALUE
        text = ""
        if cell.value == 0
          font = @font.pencil
          textColor = COLOR_PENCIL
          text = @game.pencilString(i, j)
        else
          if cell.value > 0
            text = String(cell.value)

        if cell.locked
          backgroundColor = COLOR_BACKGROUND_LOCKED

        if (@highlightX != -1) && (@highlightY != -1)
          if (i == @highlightX) && (j == @highlightY)
            if cell.locked
              backgroundColor = COLOR_BACKGROUND_LOCKED_SELECTED
            else
              backgroundColor = COLOR_BACKGROUND_SELECTED
          else if @conflicts(i, j, @highlightX, @highlightY)
            if cell.locked
              backgroundColor = COLOR_BACKGROUND_LOCKED_CONFLICTED
            else
              backgroundColor = COLOR_BACKGROUND_CONFLICTED

        if cell.error
          textColor = COLOR_ERROR

        @drawCell(i, j, backgroundColor, text, font, textColor)

    done = [false, false, false, false, false, false, false, false, false]
    for j in [0...3]
      for i in [0...3]
        currentValue = (j * 3) + i + 1
        currentValueString = String(currentValue)
        valueColor = COLOR_VALUE
        pencilColor = COLOR_PENCIL
        if done[(j * 3) + i]
          valueColor = COLOR_DONE
          pencilColor = COLOR_DONE

        valueBackgroundColor = null
        pencilBackgroundColor = null
        if @penValue == currentValue
          if @isPencil
            pencilBackgroundColor = COLOR_BACKGROUND_SELECTED
          else
            valueBackgroundColor = COLOR_BACKGROUND_SELECTED

        @drawCell(VALUE_POS_X + i, VALUE_POS_Y + j, valueBackgroundColor, currentValueString, @font.pen, valueColor)
        @drawCell(PENCIL_POS_X + i, PENCIL_POS_Y + j, pencilBackgroundColor, currentValueString, @font.pen, pencilColor)

    valueBackgroundColor = null
    pencilBackgroundColor = null
    if @penValue == 10
        if @isPencil
            pencilBackgroundColor = COLOR_BACKGROUND_SELECTED
        else
            valueBackgroundColor = COLOR_BACKGROUND_SELECTED

    @drawCell(VALUE_CLEAR_POS_X, VALUE_CLEAR_POS_Y, valueBackgroundColor, "C", @font.pen, COLOR_ERROR)
    @drawCell(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, pencilBackgroundColor, "C", @font.pen, COLOR_ERROR)

    @drawCell(NEWGAME_POS_X, NEWGAME_POS_Y, null, "New", @font.newgame, COLOR_NEWGAME);

    # Make the grids
    @drawGrid(0, 0, 9, @game.solved)
    @drawGrid(VALUE_POS_X, VALUE_POS_Y, 3)
    @drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3)
    @drawGrid(VALUE_CLEAR_POS_X, VALUE_CLEAR_POS_Y, 1)
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
                  @highlightX = -1;
                  @highlightY = -1;
                else
                  @highlightX = action.x;
                  @highlightY = action.y;
              else
                if @isPencil
                  if @penValue == 10
                    @game.clearPencil(action.x, action.y);
                  else
                    @game.togglePencil(action.x, action.y, @penValue);
                else
                  if @penValue == 10
                    @game.setValue(action.x, action.y, 0);
                  else
                    @game.setValue(action.x, action.y, @penValue);

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
