"use strict"

class Game {
    constructor(selector, bestOfValue, bestOfInput) {
        this.ROWS = 6;
        this.COLS = 7;
        this.selector = selector;
        this.player = 'red';
        this.isRoundOver = false;
        this.isGameOver = false;
        this.onPlayerMove = function() {};
        this.createGrid();
        this.setupEventListeners();
        this.scoreboard();
        this.bestOfValue = bestOfValue;
        this.bestOfInput = bestOfInput;
        this.currentPlayerName = ''
    }


    scoreboard() {
        const that = this;
        const scoreboardObject = {
            players: [],
            scoreboard: document.querySelector('.scoreboard'),
            addPlayer(oPlayer) {
                this.players.push(oPlayer);
                const playerNameDiv = `<div class='player-name'>${oPlayer.playerName}:</div>`;
                const playerScoreDiv = `<div class='player-score'>${oPlayer.playerScore}</div>`;
                const scoreboardDiv = `<div id='player-${oPlayer.playerName}' class='player-display'>${playerNameDiv}${playerScoreDiv}</div>`;
                this.scoreboard.innerHTML += scoreboardDiv;
            },
            updateScoreBoards(oPlayer) {
                $(`#player-${oPlayer.playerName} > div`)[1].innerHTML = oPlayer.playerScore;  
            },
        };
        class Player {
            constructor(strName) {
                this.playerName = strName;
                this.playerScore = 0;
                scoreboardObject.addPlayer(this);
            }
            addPoint(score) {
                this.playerScore += score;
                scoreboardObject.updateScoreBoards(this)
            }
        };
        
        window.player1 = new Player(window.playerOneName);
        window.player2 = new Player(window.playerTwoName);



    }


    gameOver() {
        this.isGameOver = true;
        switcher.screenSwitcher("game-over-screen");
        $(".rounds-won").text(this.bestOfValue);
        $(".best-of").text(this.bestOfInput);
    }

    createGrid() {
        const $board = $(this.selector);
        $board.empty();
        this.isRoundOver = false;
        this.isGameOver = false;
        this.player = 'red'
        for (let row = 0; row < this.ROWS; row++) {
            const $row = $('<div>')
                .addClass('row');
            
            for (let col = 0; col < this.COLS; col++) {
                const $col = $('<div>')
                    .addClass('col empty')
                    .attr('data-col', col)
                    .attr('data-row', row);
                $row.append($col);
            }
            $board.append($row);
        }
    }

    setupEventListeners() {
        const $board = $(this.selector);
        const that = this;

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i =cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        $board.on('mouseenter', '.col.empty', function() {
            if (that.isRoundOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
        });

        $board.on('mouseleave', '.col', function() {
            $('.col').removeClass(`next-${that.player}`);
        });

        $board.on('click', '.col.empty', function() {
            if (that.isRoundOver) return;
            const col = $(this).data('col');
            const row = $(this).data('row');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player)

            let winner = that.checkForWinner(
                $lastEmptyCell.data('row'), 
                $lastEmptyCell.data('col')
            )
            if (winner) {
                that.isRoundOver = true;
                
                $('.col.empty').removeClass('empty') ;
                if(that.player === 'red'){
                    player1.addPoint(1);
                }else{
                    player2.addPoint(1);
                }
                that.gameWinner();
                if(that.isGameOver == true){
                    return;
                }else{
                    $('.winner-window').removeClass('hidden');
                    $('.winning-player').text(that.currentPlayerName)
                    $('.close-btn').click(function() {
                        $('.winner-window').addClass('hidden');
                        winner = false;
                    });
                }

                // if(this.player === 'red'){
                //     this.onPlayerMove('black')
                // }else if(this.player === 'black'){
                //     this.onPlayerMove ('red')
                // }

                return;
            }
           
            that.currentPlayerName = (that.player === 'red') ? playerTwoName : playerOneName ;
            that.player = (that.player === 'red') ? 'black' : 'red';
            that.onPlayerMove()
            $(this).trigger('mouseenter');
        });
    }



    gameWinner() {
        if(window.player1.playerScore >= this.bestOfValue || window.player2.playerScore >= this.bestOfValue){
            this.gameOver()
            if(this.player === 'red'){
                return window.playerOneName;
            }else{
                return window.playerTwoName;
            }
        }else{
            return;
        }
    }


    checkForWinner(row, col) {  
        const that = this;

        function $getCell(i, j) {
            return $(`.col[data-row='${i}'][data-col='${j}']`)
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 &&
                i < that.ROWS &&
                j >= 0 && 
                j < that.COLS &&
                $next.data('player') === that.player
            ) {
                total++;
                i += direction.i
                j += direction.j;
                $next = $getCell(i, j);
            }
            return total;
        }

        function checkWin(directionA, directionB) {
            const total = 1 +
                checkDirection(directionA) +
                checkDirection(directionB);
            if (total >= 4) {
                return that.player;
            } else {
                return null;
            }
        }

        function checkDiagonalBLtoTR() {
            return checkWin({i: 1, j: -1}, {i: 1, j: 1});
        }

        function checkDiagonalTLtoBR() {
            return checkWin({i: 1, j: 1}, {i: -1, j: -1});
        }

        function checkVerticals() {
            return checkWin({i: -1, j: 0}, {i: 1, j: 0})
        }

        function checkHorizontals() {
            return checkWin({i: 0, j: -1}, {i: 0, j: 1})
        }
        return checkVerticals() || 
        checkHorizontals() ||
        checkDiagonalBLtoTR() ||
        checkDiagonalTLtoBR();
    }

    restart() {
        this.createGrid()
        this.onPlayerMove()
        $('.scoreboard').empty()
    }

    reset() {
        this.createGrid()
        this.onPlayerMove()
        
    }
}




//tutorial that helped me https://www.youtube.com/watch?v=531FRc8e2Sk