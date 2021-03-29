"use strict"

const switcher = {
    currentScreen: $("#splash-screen"),
    screenSwitcher: function(screenId) {
        this.currentScreen = screenId;
        $(".screen").each(function() {
            $(this).hide();
            if ($(this)[0].id == screenId) {
                $(this).show();
            };
            
          });
          $("#quit-btn").hide();
            if (screenId == "game-screen") {
                $("#quit-btn").show();
                this.isRunning = true;
            };
        $("#help-btn").show();
        if (screenId == "game-over-screen") {
            $("#help-btn").hide();
        };
    },
    helpScreens: function(screenId) {
        if (screenId == "game-screen") {
            $("#help-window-game-screen").show();
        };
        if (screenId == "splash-screen") {
            $(".help").hide();
            $("#splash-help-window-game-screen").hide();
        };
        if (screenId == "game-over-screen") {
            $(".help").hide();
        };
        $("#help-splash-close-btn").click(function(){
            $(".help").hide();
        });
        $("#help-game-close-btn").click(function(){
            $(".help").hide();
        });
    },
};

//navigation

$("#play-game-btn").click(function(){
    switcher.screenSwitcher("game-screen");
});

$("#game-over-btn").click(function(){
    switcher.screenSwitcher("game-over-screen");
});

$("#game-over-quit-btn").click(function(){
    location.reload();
});

//header buttons

$("#quit-btn").click(function(){
    location.reload();
});

$("#help-btn").click(function(){
    $(".help").show();
});

switcher.screenSwitcher("splash-screen");
switcher.helpScreens("splash-screen");

// I reached out to my group members but no one responded :(