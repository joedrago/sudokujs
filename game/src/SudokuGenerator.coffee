shuffle = (a) ->
    i = a.length
    while --i > 0
        j = ~~(Math.random() * (i + 1))
        t = a[j]
        a[j] = a[i]
        a[i] = t
    return a

class Board
  constructor: (otherBoard = null) ->
    @grid = new Array(9).fill(null)
    @locked = new Array(9).fill(null)
    for i in [0...9]
      @grid[i] = new Array(9).fill(0)
      @locked[i] = new Array(9).fill(false)
    if otherBoard != null
      for j in [0...9]
        for i in [0...9]
          @grid[i][j] = otherBoard.grid[i][j]
          @locked[i][j] = otherBoard.locked[i][j]
    return

  matches: (otherBoard) ->
    for j in [0...9]
      for i in [0...9]
        if @grid[i][j] != otherBoard.grid[i][j]
          return false
    return true

class SudokuGenerator
  @difficulty:
    easy: 1
    medium: 2
    hard: 3
    extreme: 4

  constructor: ->

  boardToGrid: (board) ->
    newBoard = new Array(9).fill(null)
    for i in [0...9]
      newBoard[i] = new Array(9).fill(0)
    for j in [0...9]
      for i in [0...9]
        if board.locked[i][j]
          newBoard[i][j] = board.grid[i][j]
    return newBoard

  cellValid: (board, x, y, v) ->
    for i in [0...9]
      if (x != i) and (board.grid[i][y] == v)
          return false
      if (y != i) and (board.grid[x][i] == v)
          return false

    sx = Math.floor(x / 3) * 3
    sy = Math.floor(y / 3) * 3
    for j in [0...3]
      for i in [0...3]
        if (x != (sx + i)) && (y != (sy + j))
          if board.grid[sx + i][sy + j] == v
            return false
    return true

  pencilMarks: (board, x, y) ->
    marks = []
    for v in [1..9]
      if @cellValid(board, x, y, v)
        marks.push v
    if marks.length > 1
      shuffle(marks)
    return marks

  solve: (board) ->
    solved = new Board(board)
    pencil = new Array(9).fill(null)
    for i in [0...9]
      pencil[i] = new Array(9).fill(null)
    # debugger;

    walkIndex = 0
    direction = 1
    while walkIndex < 81
      x = walkIndex % 9
      y = Math.floor(walkIndex / 9)

      if not solved.locked[x][y]
        if (direction == 1) and ((pencil[x][y] == null) or (pencil[x][y].length == 0))
          pencil[x][y] = @pencilMarks(solved, x, y)

        if pencil[x][y].length == 0
          solved.grid[x][y] = 0
          direction = -1
        else
          solved.grid[x][y] = pencil[x][y].pop()
          direction = 1

      walkIndex += direction
      if walkIndex < 0
        return null

    return solved

  hasUniqueSolution: (board) ->
    firstSolve = @solve(board)
    for unicityTests in [0...6]
      nextSolve = @solve(board)
      if not firstSolve.matches(nextSolve)
        return false
    return true

  generateInternal: (amountToRemove) ->
    board = @solve(new Board())
    # hack
    for j in [0...9]
      for i in [0...9]
        board.locked[i][j] = true

    indexesToRemove = shuffle([0...81])
    removed = 0
    while removed < amountToRemove
      if indexesToRemove.length == 0
        break

      removeIndex = indexesToRemove.pop()
      rx = removeIndex % 9
      ry = Math.floor(removeIndex / 9)

      nextBoard = new Board(board)
      nextBoard.grid[rx][ry] = 0
      nextBoard.locked[rx][ry] = false
      if @hasUniqueSolution(nextBoard)
        board = nextBoard
        removed += 1
        # console.log "successfully removed #{rx},#{ry}"
      else
        # console.log "failed to remove #{rx},#{ry}, creates non-unique solution"

    return {
      board: board
      removed: removed
    }

  generate: (difficulty) ->
    amountToRemove = switch difficulty
      when SudokuGenerator.difficulty.extreme then 60
      when SudokuGenerator.difficulty.hard    then 52
      when SudokuGenerator.difficulty.medium  then 46
      else 40 # easy / unknown

    best = null
    for attempt in [0...3]
      generated = @generateInternal(amountToRemove)
      if generated.removed == amountToRemove
        console.log "Removed exact amount #{amountToRemove}, stopping"
        best = generated
        break

      if best == null
        best = generated
      else if best.removed < generated.removed
        best = generated
      console.log "current best #{best.removed} / #{amountToRemove}"

    console.log "giving user board: #{best.removed} / #{amountToRemove}"
    return @boardToGrid(best.board)

module.exports = SudokuGenerator

