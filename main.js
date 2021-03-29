"use strict"

$(document).ready(function(){



    let bestOfValue = 1;
    $('#best1').click(function() {bestOfValue = 1});
    $('#best3').click(function() {bestOfValue = 2});
    $('#best5').click(function() {bestOfValue = 3});

    let bestOfInput = 1;
    $('#best1').click(function() {
        bestOfInput = 1;
        $('.best-of-value').text(bestOfInput);
    });
    $('#best3').click(function() {
        bestOfInput = 3;
        $('.best-of-value').text(bestOfInput)
    });
    $('#best5').click(function() {
        bestOfInput = 5;
        $('.best-of-value').text(bestOfInput)
    });
 
    //Play game button initializes game creation and assigns player names
    $('#play-game-btn').click(function(){
    window.playerOneName = $('#p1name')[0].value;
    window.playerTwoName = $('#p2name')[0].value;
    $('#current-player').text(window.playerOneName);
    window.game = new Game('#gameboard', bestOfValue, bestOfInput);
    window.game.onPlayerMove = function() {
        if(window.game.player == 'red'){
            $('#current-player').text(window.playerOneName);
        }else{
            $('#current-player').text(window.playerTwoName);
        }
    }
    })    

    


    $('.close-btn').click(function() {
        window.game.reset();
    })

});



