SudokuGenerator = require './SudokuGenerator'

class MenuView
  constructor: (@app, @canvas) ->
    @buttons =
      newEasy:
        y: 0.32
        text: "New Game: Easy"
        bgColor: "#337733"
        textColor: "#ffffff"
        click: @newEasy.bind(this)
      newMedium:
        y: 0.44
        text: "New Game: Medium"
        bgColor: "#777733"
        textColor: "#ffffff"
        click: @newMedium.bind(this)
      newHard:
        y: 0.56
        text: "New Game: Hard"
        bgColor: "#773333"
        textColor: "#ffffff"
        click: @newHard.bind(this)
      clear:
        y: 0.68
        text: "Clear Puzzle"
        bgColor: "#333366"
        textColor: "#ffffff"
        click: @clear.bind(this)
      resume:
        y: 0.85
        text: "Resume"
        bgColor: "#773333"
        textColor: "#ffffff"
        click: @resume.bind(this)

    buttonWidth = @canvas.width * 0.8
    @buttonHeight = @canvas.height * 0.1
    buttonX = @canvas.width * 0.1
    for buttonName, button of @buttons
      button.x = buttonX
      button.y = @canvas.height * button.y
      button.w = buttonWidth
      button.h = @buttonHeight

    buttonFontHeight = Math.floor(@buttonHeight * 0.4)
    @buttonFont = @app.registerFont("button", "#{buttonFontHeight}px saxMono, monospace")
    titleFontHeight = Math.floor(@canvas.height * 0.1)
    @titleFont = @app.registerFont("button", "#{titleFontHeight}px saxMono, monospace")
    return

  draw: ->
    @app.drawFill(0, 0, @canvas.width, @canvas.height, "#333333")

    x = @canvas.width / 2
    shadowOffset = @canvas.height * 0.01

    y1 = @canvas.height * 0.1
    y2 = @canvas.height * 0.2
    @app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, @titleFont, "#000000")
    @app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, @titleFont, "#000000")
    @app.drawTextCentered("Bad Guy", x, y1, @titleFont, "#ffffff")
    @app.drawTextCentered("Sudoku", x, y2, @titleFont, "#ffffff")

    for buttonName, button of @buttons
      @app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.2, button.bgColor, "#444444")
      @app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), @buttonFont, button.textColor)

    @app.drawVersion()

  click: (x, y) ->
    for buttonName, button of @buttons
      if (y > button.y) && (y < (button.y + @buttonHeight))
        # console.log "button pressed: #{buttonName}"
        button.click()
    return

  newEasy: ->
    @app.newGame(SudokuGenerator.difficulty.easy)

  newMedium: ->
    @app.newGame(SudokuGenerator.difficulty.medium)

  newHard: ->
    @app.newGame(SudokuGenerator.difficulty.hard)

  clear: ->
    @app.clear()

  resume: ->
    @app.switchView("sudoku")

module.exports = MenuView
