SudokuGenerator = require './SudokuGenerator'

class SudokuGame
  constructor: ->
    @clear()
    if not @load()
      @newGame(SudokuGenerator.difficulty.easy)
    return

  clear: ->
    @grid = new Array(9).fill(null)
    for i in [0...9]
      @grid[i] = new Array(9).fill(null)
    for j in [0...9]
      for i in [0...9]
        @grid[i][j] =
          value: 0
          error: false
          locked: false
          pencil: new Array(9).fill(false)

    @solved = false
    @undoJournal = []
    @redoJournal = []

  holeCount: ->
    count = 0
    for j in [0...9]
      for i in [0...9]
        if not @grid[i][j].locked
          count += 1
    return count

  export: ->
    exportString = "SD"
    for j in [0...9]
      for i in [0...9]
        if @grid[i][j].locked
          exportString += "#{@grid[i][j].value}"
        else
          exportString += "0"
    return exportString

  validate: ->
    board = new Array(9).fill(null)
    for i in [0...9]
      board[i] = new Array(9).fill(0)
      for j in [0...9]
        board[i][j] = @grid[i][j].value

    generator = new SudokuGenerator
    return generator.validateGrid(board)

  import: (importString) ->
    if importString.indexOf("SD") != 0
      return false
    importString = importString.substr(2)
    importString = importString.replace(/[^0-9]/g, "")
    if importString.length != 81
      return false

    @clear()

    index = 0
    zeroCharCode = "0".charCodeAt(0)
    for j in [0...9]
      for i in [0...9]
        v = importString.charCodeAt(index) - zeroCharCode
        index += 1
        if v > 0
          @grid[i][j].locked = true
          @grid[i][j].value = v

    return false if not @validate()
    
    @updateCells()
    @save()
    return true

  updateCell: (x, y) ->
    cell = @grid[x][y]

    for i in [0...9]
      if x != i
        v = @grid[i][y].value
        if v > 0
          if v == cell.value
            @grid[i][y].error = true
            cell.error = true

      if y != i
        v = @grid[x][i].value
        if v > 0
          if v == cell.value
            @grid[x][i].error = true
            cell.error = true

    sx = Math.floor(x / 3) * 3
    sy = Math.floor(y / 3) * 3
    for j in [0...3]
      for i in [0...3]
        if (x != (sx + i)) && (y != (sy + j))
          v = @grid[sx + i][sy + j].value
          if v > 0
            if v == cell.value
              @grid[sx + i][sy + j].error = true
              cell.error = true
    return

  updateCells: ->
    for j in [0...9]
      for i in [0...9]
        @grid[i][j].error = false

    for j in [0...9]
      for i in [0...9]
        @updateCell(i, j)

    @solved = true
    for j in [0...9]
      for i in [0...9]
        if @grid[i][j].error
          @solved = false
        if @grid[i][j].value == 0
          @solved = false

    # if @solved
    #   console.log "solved #{@solved}"

    return @solved

  done: ->
    d = new Array(9).fill(false)
    counts = new Array(9).fill(0)
    for j in [0...9]
      for i in [0...9]
        if @grid[i][j].value != 0
          counts[@grid[i][j].value-1] += 1

    for i in [0...9]
      if counts[i] == 9
        d[i] = true
    return d

  pencilString: (x, y) ->
    cell = @grid[x][y]
    s = ""
    for i in [0...9]
      if cell.pencil[i]
        s += String(i+1)
    return s

  do: (action, x, y, values, journal) ->
    if values.length > 0
      cell = @grid[x][y]
      switch action
        when "togglePencil"
          journal.push { action: "togglePencil", x: x, y: y, values: values }
          cell.pencil[v-1] = !cell.pencil[v-1] for v in values
        when "setValue"
          journal.push { action: "setValue", x: x, y: y, values: [cell.value] }
          cell.value = values[0]
      @updateCells()
      @save()

  undo: ->
    if (@undoJournal.length > 0)
      step = @undoJournal.pop()
      @do step.action, step.x, step.y, step.values, @redoJournal

  redo: ->
    if (@redoJournal.length > 0)
      step = @redoJournal.pop()
      @do step.action, step.x, step.y, step.values, @undoJournal

  clearPencil: (x, y) ->
    cell = @grid[x][y]
    if cell.locked
      return
    @do "togglePencil", x, y, (i+1 for flag, i in cell.pencil when flag), @undoJournal
    @redoJournal = []

  togglePencil: (x, y, v) ->
    if @grid[x][y].locked
      return
    @do "togglePencil", x, y, [v], @undoJournal
    @redoJournal = []

  setValue: (x, y, v) ->
    if @grid[x][y].locked
      return
    @do "setValue", x, y, [v], @undoJournal
    @redoJournal = []

  reset: ->
    console.log "reset()"
    for j in [0...9]
      for i in [0...9]
        cell = @grid[i][j]
        if not cell.locked
          cell.value = 0
        cell.error = false
        for k in [0...9]
          cell.pencil[k] = false
    @undoJournal = []
    @redoJournal = []
    @highlightX = -1
    @highlightY = -1
    @updateCells()
    @save()

  newGame: (difficulty) ->
    console.log "newGame(#{difficulty})"
    for j in [0...9]
      for i in [0...9]
        cell = @grid[i][j]
        cell.value = 0
        cell.error = false
        cell.locked = false
        for k in [0...9]
          cell.pencil[k] = false

    generator = new SudokuGenerator()
    newGrid = generator.generate(difficulty)
    # console.log "newGrid", newGrid
    for j in [0...9]
      for i in [0...9]
        if newGrid[i][j] != 0
          @grid[i][j].value = newGrid[i][j]
          @grid[i][j].locked = true
    @undoJournal = []
    @redoJournal = []
    @updateCells()
    @save()

  load: ->
    if not localStorage
      alert("No local storage, nothing will work")
      return false
    jsonString = localStorage.getItem("game")
    if jsonString == null
      return false

    # console.log jsonString
    gameData = JSON.parse(jsonString)
    # console.log "found gameData", gameData

    for j in [0...9]
      for i in [0...9]
        src = gameData.grid[i][j]
        dst = @grid[i][j]
        dst.value = src.v
        dst.error = if src.e > 0 then true else false
        dst.locked = if src.l > 0 then true else false
        for k in [0...9]
          dst.pencil[k] = if src.p[k] > 0 then true else false

    @updateCells()
    console.log "Loaded game."
    return true

  save: ->
    if not localStorage
      alert("No local storage, nothing will work")
      return false

    gameData =
      grid: new Array(9).fill(null)
    for i in [0...9]
      gameData.grid[i] = new Array(9).fill(null)

    for j in [0...9]
      for i in [0...9]
        cell = @grid[i][j]
        gameData.grid[i][j] =
          v: cell.value
          e: if cell.error then 1 else 0
          l: if cell.locked then 1 else 0
          p: []
        dst = gameData.grid[i][j].p
        for k in [0...9]
          dst.push(if cell.pencil[k] then 1 else 0)

    jsonString = JSON.stringify(gameData)
    localStorage.setItem("game", jsonString)
    console.log "Saved game (#{jsonString.length} chars)"
    return true

module.exports = SudokuGame
