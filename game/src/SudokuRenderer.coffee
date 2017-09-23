class Sudoku
  constructor: (@canvas) ->
    @ctx = @canvas.getContext("2d")

    if @canvas.width < @canvas.height
      # Portrait, aka not dumb.
      @cellSize = @canvas.width / 9
    else
      # Landscape, aka dumb. Pretend we're portrait.
      @cellSize = @canvas.height / 15

    @lineWidthThin = 1
    @lineWidthThick = Math.max(@cellSize / 20, 3)
    @draw()

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
    # Clear screen
    @drawFill(0, 0, @canvas.width, @canvas.height, "black")

    # Make white phone-shaped background
    @drawFill(0, 0, @cellSize * 9, @canvas.height, "white")

    # Make the grid
    @drawGrid(0, 0, 9)

  click: (x, y) ->
    console.log "click #{x}, #{y}"

module.exports = Sudoku
