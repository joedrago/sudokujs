Sudoku = require './Sudoku'

init = ->
  console.log "init"
  canvas = document.createElement("canvas")
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  document.body.insertBefore(canvas, document.body.childNodes[0])
  canvasRect = canvas.getBoundingClientRect()

  window.sudoku = new Sudoku(canvas)

  canvas.addEventListener "touchstart", (e) ->
    x = e.touches[0].clientX - canvasRect.left
    y = e.touches[0].clientY - canvasRect.top
    window.sudoku.click(x, y)

  canvas.addEventListener "mousedown", (e) ->
    x = e.clientX - canvasRect.left
    y = e.clientY - canvasRect.top
    window.sudoku.click(x, y)

window.addEventListener('load', (e) ->
    init()
, false)
