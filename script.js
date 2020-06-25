$(document).ready(function () {

    let icons = [`<i class="icon-sel fas fa-dot-circle fa-4x text-shadow-inverse text-center top-padding"></i>`, `<i class="icon-sel fas fa-times fa-5x text-shadow-inverse text-center top-padding"></i>`]
    let human;
    let comp;
    let board;
    let turn;
    let currentTurn = 0;
    let game;

    let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6]]
    // creates Player
    class Player {
        constructor(name, avatar, moves = []) {
            this.name = name
            this.avatar = avatar
            this.moves = moves
        }
        avatar() {
            return this.avatar
        }
        updateMoves(x) {
            this.moves.push(x)
        }
        name() {
            return this.name
        }

        checkWin() {
            let winning = false
            wins.forEach(list => {
                if (this.moves.includes(list[0]) && this.moves.includes(list[1]) && this.moves.includes(list[2])) {
                    winning = true
                    game = false
                }
            })
            return winning
        }

        winningMoves(avail) {
            let remMoves = [];
            wins.forEach(list => {
                let match = 0
                let moves
                for (let i = 0; i < 3; i++) {
                    if (this.moves.includes(list[i])) {
                        match++
                    }
                    else {
                        if (avail.includes(list[i])) {
                            moves = list[i]
                        }
                        else {
                            match = 0
                        }
                    }
                }
                if (match == 2) {
                    if (moves) {
                        remMoves.push(moves)
                    }
                }
            })

            return remMoves

        }
    }
    // creates board

    class Board {
        constructor(board = { 0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" }) {
            this.board = board
        }

        getboard() {
            return this.board
        }

        updateBoard(num) {
            this.board[num.id] = `${num.value}`
        }

        checkPlace(num) {
            return this.board[num]
        }

        returnBoard() {
            let elements = []
            Object.keys(this.board).forEach(key => {
                elements.push(`<div class="game-square height-1-4 text-center" id="square-${key}" data-id=${key}>${this.board[key]} </div>`)
            })
            return elements
        }

    }


    function startGame() {
        board = new Board;
        currentTurn = 0;
        game = true;

    }


    $(".icon").on("click", event => {
        if (event.target.id === "o") {
            human = new Player("human", icons[0])
            comp = new Player("computer", icons[1])
        }
        else {
            human = new Player("human", icons[1])
            comp = new Player("computer", icons[0])
        }

        $(".main-div").css("display", "none")

        let index = Math.floor(Math.random() * 2)
        if (index === 0) {
            turn = ["human", "computer", "human", "computer", "human", "computer", "human", "computer", "human"]
        }
        else {
            turn = ["computer", "human", "computer", "human", "computer", "human", "computer", "human", "computer"]
        }

        $("#message").text(`${turn[currentTurn]} goes first!`)

        $("#game").css("display", "block")

        displayBoard()
    })


    $(document).on("click", ".game-square", event => {
        event.preventDefault();
        if (turn[currentTurn] === "human" && game) {
            let id = event.target.id
            let value = $(`#${id}`).data("id")
            if (board.checkPlace(value) === "") {
                board.updateBoard({ id: value, value: human.avatar })
                human.updateMoves(value)
                if (human.checkWin()) {
                    $("#message").text(`${human.name} wins`)
                }
                else {
                    currentTurn++
                    if (currentTurn < 9) {
                        $("#message").text(`${turn[currentTurn]}'s turn`)
                    }
                    else {
                        $("#message").text(`Game Over`)
                        game = false
                    }
                }
                displayBoard()

            }
            else {
                alert("Try again!")
            }

        }

    })

    $(document).on("click", ".icon-sel", event => {
        event.preventDefault()
        alert("Try again!")
    })


    function displayBoard() {
        $("#game").empty()
        board.returnBoard().map((element) => {
            $("#game").append(element)
        })

        setTimeout(() => computerPlay(), 1000)
    }

    async function computerMove(possibilities) {

        let choices = []


        if (comp.winningMoves(possibilities).length > 0) {
            console.log("computer called")
            choices = await comp.winningMoves(possibilities)
        }

        else if (human.winningMoves(possibilities).length > 0) {
            console.log("human called")
            choices = await human.winningMoves(possibilities)
            console.log(choices)
        }

        else {
            choices.push(...possibilities)

        }

        return choices
    }

    async function computerPlay() {
        if (turn[currentTurn] === "computer" && game) {

            let possibilities = []

            for (let i = 0; i < 9; i++) {
                if (board.checkPlace(i) === "") {
                    possibilities.push(i)
                }
            }


            let choices = await computerMove(possibilities)

            if (choices.length === 0) {
                let selection = possibilities[Math.floor(Math.random() * possibilities.length)]
                board.updateBoard({ id: selection, value: comp.avatar })
                comp.updateMoves(selection)
            }
            else {
                let selection = choices[Math.floor(Math.random() * choices.length)]
                board.updateBoard({ id: selection, value: comp.avatar })
                comp.updateMoves(selection)
            }


            if (comp.checkWin()) {
                $("#message").text(`${comp.name} wins`)
            }
            else {
                currentTurn++
                if (currentTurn < 9) {
                    $("#message").text(`${turn[currentTurn]}'s turn`)
                }
                else {
                    $("#message").text(`Game Over`)
                    game = false
                }
            }

            displayBoard()

        }
    }



    startGame()

})



