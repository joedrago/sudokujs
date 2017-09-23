class SudokuGenerator
  @difficulty:
    easy: 0
    medium: 1
    hard: 2

  constructor: ->

  generate: (difficulty) ->
    grid = new Array(9).fill(null)
    for i in [0...9]
      grid[i] = new Array(9).fill(null)
    for j in [0...9]
      for i in [0...9]
        grid[i][j] = 0

    grid[4][2] = 5
    return grid

module.exports = SudokuGenerator

