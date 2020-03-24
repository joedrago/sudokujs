SudokuGenerator = require './SudokuGenerator'
SudokuGame = require './SudokuGame'

PEN_POS_X = 1
PEN_POS_Y = 10
PEN_CLEAR_POS_X = 2
PEN_CLEAR_POS_Y = 13

PENCIL_POS_X = 5
PENCIL_POS_Y = 10
PENCIL_CLEAR_POS_X = 6
PENCIL_CLEAR_POS_Y = 13

MENU_POS_X = 4
MENU_POS_Y = 13

MODE_POS_X = 4
MODE_POS_Y = 9

UNDO_POS_X = 0
UNDO_POS_Y = 13
REDO_POS_X = 8
REDO_POS_Y = 13

Color =
  value: "black"
  pencil: "#0000ff"
  error: "#ff0000"
  done: "#cccccc"
  menu: "#008833"
  backgroundSelected: "#eeeeaa"
  backgroundLocked: "#eeeeee"
  backgroundLockedConflicted: "#ffffee"
  backgroundLockedSelected: "#eeeedd"
  backgroundConflicted: "#ffffdd"
  backgroundError: "#ffdddd"
  modeSelect: "#777744"
  modePen: "#000000"
  modePencil: "#0000ff"

ActionType =
  SELECT: 0
  PENCIL: 1
  PEN: 2
  MENU: 3
  UNDO: 4
  REDO: 5

ModeType =
  HIGHLIGHTING: 0
  PENCIL: 1
  PEN: 2

# Special pen/pencil values
NONE = 0
CLEAR = 10

class SudokuView
  # -------------------------------------------------------------------------------------
  # Init

  constructor: (@app, @canvas) ->
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
    @fonts =
      pencil:  @app.registerFont("pencil",  "#{fontPixelsS}px saxMono, monospace")
      menu:    @app.registerFont("menu",    "#{fontPixelsM}px saxMono, monospace")
      pen:     @app.registerFont("pen",     "#{fontPixelsL}px saxMono, monospace")

    @initActions()

    # init state
    @game = new SudokuGame()
    @resetState()

    @draw()

  initActions: ->
    @actions = new Array(9 * 15).fill(null)

    for j in [0...9]
      for i in [0...9]
        index = (j * 9) + i
        @actions[index] = { type: ActionType.SELECT, x: i, y: j }

    for j in [0...3]
      for i in [0...3]
        index = ((PEN_POS_Y + j) * 9) + (PEN_POS_X + i)
        @actions[index] = { type: ActionType.PEN, value: 1 + (j * 3) + i }

    for j in [0...3]
      for i in [0...3]
        index = ((PENCIL_POS_Y + j) * 9) + (PENCIL_POS_X + i)
        @actions[index] = { type: ActionType.PENCIL, value: 1 + (j * 3) + i }

    # Pen clear button
    index = (PEN_CLEAR_POS_Y * 9) + PEN_CLEAR_POS_X
    @actions[index] = { type: ActionType.PEN, value: CLEAR }

    # Pencil clear button
    index = (PENCIL_CLEAR_POS_Y * 9) + PENCIL_CLEAR_POS_X
    @actions[index] = { type: ActionType.PENCIL, value: CLEAR }

    # Menu button
    index = (MENU_POS_Y * 9) + MENU_POS_X
    @actions[index] = { type: ActionType.MENU }

    # Undo button
    index = (UNDO_POS_Y * 9) + UNDO_POS_X
    @actions[index] = { type: ActionType.UNDO }

    # Redo button
    index = (REDO_POS_Y * 9) + REDO_POS_X
    @actions[index] = { type: ActionType.REDO }

    return

  resetState: ->
    @mode = ModeType.HIGHLIGHTING
    @penValue = NONE
    @highlightX = -1
    @highlightY = -1

  # -------------------------------------------------------------------------------------
  # Rendering

  drawCell: (x, y, backgroundColor, s, font, color) ->
    px = x * @cellSize
    py = y * @cellSize
    if backgroundColor != null
      @app.drawFill(px, py, @cellSize, @cellSize, backgroundColor)
    @app.drawTextCentered(s, px + (@cellSize / 2), py + (@cellSize / 2), font, color)

  drawGrid: (originX, originY, size, solved = false) ->
    for i in [0..size]
      color = if solved then "green" else "black"
      lineWidth = @lineWidthThin
      if ((size == 1) || (i % 3) == 0)
        lineWidth = @lineWidthThick

      # Horizontal lines
      @app.drawLine(@cellSize * (originX + 0), @cellSize * (originY + i), @cellSize * (originX + size), @cellSize * (originY + i), color, lineWidth)

      # Vertical lines
      @app.drawLine(@cellSize * (originX + i), @cellSize * (originY + 0), @cellSize * (originX + i), @cellSize * (originY + size), color, lineWidth)

    return

  draw: ->
    console.log "draw()"

    # Clear screen to black
    @app.drawFill(0, 0, @canvas.width, @canvas.height, "black")

    # Make white phone-shaped background
    @app.drawFill(0, 0, @cellSize * 9, @canvas.height, "white")

    # Draw board numbers
    for j in [0...9]
      for i in [0...9]
        cell = @game.grid[i][j]

        backgroundColor = null
        font = @fonts.pen
        textColor = Color.value
        text = ""
        if cell.value == 0
          font = @fonts.pencil
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

    # Draw pen and pencil number buttons
    done = @game.done()
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
          if @mode is ModeType.PENCIL
            pencilBackgroundColor = Color.backgroundSelected
          else
            valueBackgroundColor = Color.backgroundSelected

        @drawCell(PEN_POS_X + i, PEN_POS_Y + j, valueBackgroundColor, currentValueString, @fonts.pen, valueColor)
        @drawCell(PENCIL_POS_X + i, PENCIL_POS_Y + j, pencilBackgroundColor, currentValueString, @fonts.pen, pencilColor)

    # Draw pen and pencil CLEAR buttons
    valueBackgroundColor = null
    pencilBackgroundColor = null
    if @penValue == CLEAR
        if @mode is ModeType.PENCIL
            pencilBackgroundColor = Color.backgroundSelected
        else
            valueBackgroundColor = Color.backgroundSelected

    @drawCell(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, valueBackgroundColor, "C", @fonts.pen, Color.error)
    @drawCell(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, pencilBackgroundColor, "C", @fonts.pen, Color.error)

    # Draw mode
    switch @mode
      when ModeType.HIGHLIGHTING
      modeColor = Color.modeSelect
      modeText = "Highlighting"
      when ModeType.PENCIL
        modeColor = Color.modePencil
        modeText = "Pencil"
      when ModeType.PEN
        modeColor = Color.modePen
        modeText = "Pen"
    @drawCell(MODE_POS_X, MODE_POS_Y, null, modeText, @fonts.menu, modeColor)

    @drawCell(MENU_POS_X, MENU_POS_Y, null, "Menu", @fonts.menu, Color.menu)
    @drawCell(UNDO_POS_X, UNDO_POS_Y, null, "\u{25c4}", @fonts.menu, Color.menu) if (@game.undoJournal.length > 0)
    @drawCell(REDO_POS_X, REDO_POS_Y, null, "\u{25ba}", @fonts.menu, Color.menu) if (@game.redoJournal.length > 0)

    # Make the grids
    @drawGrid(0, 0, 9, @game.solved)
    @drawGrid(PEN_POS_X, PEN_POS_Y, 3)
    @drawGrid(PENCIL_POS_X, PENCIL_POS_Y, 3)
    @drawGrid(PEN_CLEAR_POS_X, PEN_CLEAR_POS_Y, 1)
    @drawGrid(PENCIL_CLEAR_POS_X, PENCIL_CLEAR_POS_Y, 1)

  # -------------------------------------------------------------------------------------
  # Input

  newGame: (difficulty) ->
    console.log "SudokuView.newGame(#{difficulty})"
    @resetState()
    @game.newGame(difficulty)

  reset: ->
    @resetState()
    @game.reset()

  import: (importString) ->
    @resetState()
    return @game.import(importString)

  export: ->
    return @game.export()

  holeCount: ->
    return @game.holeCount()

  handleSelectAction: (action) ->
    switch @mode
      when ModeType.HIGHLIGHTING
                if (@highlightX == action.x) && (@highlightY == action.y)
                  @highlightX = -1
                  @highlightY = -1
                else
                  @highlightX = action.x
                  @highlightY = action.y
      when ModeType.PENCIL
                  if @penValue == CLEAR
                    @game.clearPencil(action.x, action.y)
        else if @penValue != NONE
                    @game.togglePencil(action.x, action.y, @penValue)
      when ModeType.PEN
                  if @penValue == CLEAR
                    @game.setValue(action.x, action.y, 0)
        else if @penValue != NONE
                    @game.setValue(action.x, action.y, @penValue)

  handlePencilAction: (action) ->
    if @mode is ModeType.PENCIL and (@penValue == action.value)
      @mode = ModeType.HIGHLIGHTING
                @penValue = NONE
              else
      @mode = ModeType.PENCIL
                @penValue = action.value
    @highlightX = -1
    @highlightY = -1

  handlePenAction: (action) ->
    if @mode is ModeType.PEN and (@penValue == action.value)
      @mode = ModeType.HIGHLIGHTING
                @penValue = NONE
              else
      @mode = ModeType.PEN
                @penValue = action.value
    @highlightX = -1
    @highlightY = -1

  handleUndoAction: ->
              @game.undo()

  handleRedoAction: ->
              @game.redo()

  click: (x, y) ->
    # console.log "click #{x}, #{y}"
    x = Math.floor(x / @cellSize)
    y = Math.floor(y / @cellSize)

    if (x < 9) && (y < 15)
        index = (y * 9) + x
        action = @actions[index]
        if action != null
          console.log "Action: ", action

          if action.type is ActionType.MENU
            @app.switchView("menu")
            return

          switch action.type 
            when ActionType.SELECT then @handleSelectAction(action)
            when ActionType.PENCIL then @handlePencilAction(action)
            when ActionType.PEN then @handlePenAction(action)
            when ActionType.UNDO then @handleUndoAction()
            when ActionType.REDO then @handleRedoAction()
        else
          # no action, default to highlighting
          @mode = ModeType.HIGHLIGHTING
          @highlightX = -1
          @highlightY = -1
          @penValue = NONE

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

module.exports = SudokuView
