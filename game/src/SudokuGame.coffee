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

    return @solved

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

  togglePencil: (x, y, v) ->
    cell = @grid[x][y]
    if cell.locked
      return
    cell.pencil[v-1] = !cell.pencil[v-1]

  setValue: (x, y, v) ->
    cell = @grid[x][y]
    if cell.locked
      return
    cell.value = v
    @updateCells()

module.exports = SudokuGame
