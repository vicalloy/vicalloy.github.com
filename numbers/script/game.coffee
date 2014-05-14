$ ->
	isMobile = true
	board = $("#board")
	gameContainer = $('#game-container')
	boardContainer = $('#board-container')
	animationTiles = $('#animation-tiles')
	curStep = $('.cur-step .tb-val')
	elRecord = $('.record .tb-val')
	elTimer = $('.timer .tb-val')

	xSize = 6
	ySize = 6
	windowReszie = ->
		borderWidth = 4
		if $('body').width() <= 520
			borderWidth = 3
		borderWidth = borderWidth  # TODO mobile border
		cells = board.find(".grid-cell")
		tWidth = board.find(".grid-row").width() + borderWidth
		size = Math.floor(tWidth/xSize) - borderWidth
		cells.height size
		cells.width size
		cells.css('line-height', size + 'px')

		tiles = board.find(".tile")
		tiles.height size
		tiles.width size
		tiles.css('line-height', size + 8 + 'px')
		
		#.position().top
		$(".tile").each ->
			n = $(this)
			t = $("#" + n.attr("sid"))
			if t.length
				n.css "top", t.position("#board-container").top + "px"
				n.css "left", t.position("#board-container").left + "px"
				n.height t.height() + 2
				n.width t.width() + 2
				n.css "line-height", t.height() + "px"
		wheight = $(window).height()
		cheight = $('#container').height()
		if isMobile
			mg = (wheight - cheight) / 3
			$('#container').css('margin-top', mg + 'px')


	class Game
		constructor: (@xSize, @ySize) ->
			@numCount = @xSize * @ySize
			@sw = new Stopwatch($('.timer .tb-val')[0], {game: @});

		initPool: ->
			@pool = new Array(@numCount)
			i = 0
			while i < @pool.length
				@pool[i] = i + 1
				i++

		getNumber: ->
			pool = @pool
			throw "No numbers left"	if pool.length is 0
			index = Math.floor(pool.length * Math.random())
			return pool.splice(index, 1)[0]

		buildBoard: ->
			y = 0
			while y < @ySize
				row = $('<div class="grid-row"/>')
				x = 0
				while x < @xSize
					cell = $('<div class="grid-cell"><div class="tile">' + @getNumber() + '</div></div>')
					cell.attr "id", "title-" + x + "-" + y
					row.append cell
					x++
				board.append row
				y++

		initTile: (newTile, tdTile) ->
			n = newTile
			t = tdTile
			n.height t.height() + 2
			n.width t.width() + 2
			n.css "line-height", t.height() + "px"
			n.css "top", t.position("#board-container").top + "px"
			n.css "left", t.position("#board-container").left + "px"
			n.attr "sid", t.attr("id")

		initEvent: ->
			self = @
			@cells.mousedown ->
				t = $(this)
				return	if t.hasClass("clicked")
				ok = false
				if parseInt(t.text()) is self.step # error
					ok = true
					t.addClass "clicked"
					if self.step == self.numCount
						self.endGame('clear')
					self.step += 1
					curStep.text(self.step)
				if not ok
					t.addClass "invalid-clicked"
					setTimeout (->
						t.removeClass "invalid-clicked"
						return
					), 100

		endGame: (tp) ->
			@sw.stop()
			# set time out (wait timer to stop)
			setTimeout (->
				if tp == 'clear' && elRecord.text() > elTimer.text()
					tp = 'record'
				if tp == 'timeout'
					$('.game-message p').text('Timeout!')
					$('.game-message').addClass('game-over')
				if tp == 'clear'
					$('.game-message p').text('Clear!')
					$('.game-message').addClass('game-over')
				if tp == 'record'
					$('.game-message p').html('Record ' + $('.timer .tb-val').html() + 's')
					elRecord.text(elTimer.text())
					$('.game-message').addClass('game-won')
			), 50

			#TODO show game end page
			#succ or fail

		newGame: ->
			$('.game-message').attr('class', 'game-message')
			@step = 1
			@sw.reset()
			@sw.start()
			curStep.text(self.step)
			board.html('')
			animationTiles.html('')
			@initPool()
			@buildBoard()
			windowReszie()
			@cells = board.find(".grid-cell")
			@initEvent()

	game = new Game(xSize, ySize)
	$(window).resize windowReszie
	game.newGame()
	$('.btn-new-game').click ->
		game.newGame()
