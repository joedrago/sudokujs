SudokuGenerator = require './SudokuGenerator'

class SudokuGame
  constructor: ->
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
    if not @load()
      @newGame(SudokuGenerator.difficulty.easy)
    return

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

  clearPencil: (x, y) ->
    cell = @grid[x][y]
    if cell.locked
      return
    for i in [0...9]
      cell.pencil[i] = false
    @save()

  togglePencil: (x, y, v) ->
    cell = @grid[x][y]
    if cell.locked
      return
    cell.pencil[v-1] = !cell.pencil[v-1]
    @save()

  setValue: (x, y, v) ->
    cell = @grid[x][y]
    if cell.locked
      return
    cell.value = v
    @updateCells()
    @save()

  clear: ->
    console.log "clear()"
    for j in [0...9]
      for i in [0...9]
        cell = @grid[i][j]
        if not cell.locked
          cell.value = 0
        cell.error = false
        for k in [0...9]
          cell.pencil[k] = false
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
