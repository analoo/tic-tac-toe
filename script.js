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
                if(this.moves.includes(list[0]) && this.moves.includes(list[1]) && this.moves.includes(list[2])){
                    winning = true
                    game = false
                }
            })
            return winning
            
        }
    }




    function startGame() {
        board = ["", "", "", "", "", "", "", "", ""]
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
            if (board[value] === "") {
                board[value] = human.avatar
                human.updateMoves(value)
                if(human.checkWin()){
                    $("#message").text(`${human.name} wins`)
                }
                else{
                    currentTurn++
                    $("#message").text(`${turn[currentTurn]}'s turn`)
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
        board.map((element, i) => {
            $("#game").append(`<div class="game-square height-1-4 text-center" id="square-${i}" data-id=${i}>
            ${element} </div>`)
        })
        setTimeout(() => computerPlay(), 1000)


    }

    function computerPlay() {
        if (turn[currentTurn] === "computer" && game) {


            let choices = []
            board.map((element, i) => {
                if (element === "") {
                    choices.push(i)
                }
            })

            let selection = choices[Math.floor(Math.random() * choices.length)]
            board[selection] = comp.avatar

            comp.updateMoves(selection)

            if(comp.checkWin()){
                $("#message").text(`${comp.name} wins`)
            }
            else{
                currentTurn++
                $("#message").text(`${turn[currentTurn]}'s turn`)
            }

            displayBoard()

        }
    }



    startGame()

})



