sudoku = require 'sudoku'

class SudokuGenerator
  @difficulty:
    easy: 1
    medium: 2
    hard: 3

  constructor: ->

  generate: (difficulty) ->
    grid = new Array(9).fill(null)
    for i in [0...9]
      grid[i] = new Array(9).fill(0)

    loop
      puzzle   = sudoku.makepuzzle()
      solution = sudoku.solvepuzzle(puzzle)
      rating   = sudoku.ratepuzzle(puzzle, 4)
      if difficulty == rating
        index = 0
        for j in [0...9]
          for i in [0...9]
            if (puzzle[index] != null) and (puzzle[index] > 0)
              grid[i][j] = puzzle[index]
            index += 1
        break
    return grid

module.exports = SudokuGenerator

