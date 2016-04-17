/**
 * Created by jonas on 2016-04-16.
 */

var clients = {};
var myId = -1;
var gameSocket;


var GameState = function(game) {
};

function initPhaser() {

	var Boot = function(game) {
	};

	Boot.prototype = {

		/*
		 preload: function() {

		 this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
		 this.load.image('splashBackground', 'assets/gfx/Background.png');
		 },
		 */
		create: function() {

			this.game.stage.smoothed = false;
			this.scale.minWidth = g_game.baseWidth;
			this.scale.minHeight = g_game.baseHeight;
			this.scale.maxWidth = g_game.baseWidth * 3;
			this.scale.maxHeight = g_game.baseHeight * 3;
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			//this.scale.setScreenSize(true);
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

			//this.state.start('game');
			this.state.start('Splash');
		}
	};

	var width = navigator.isCocoonJS ? window.innerWidth : g_game.baseWidth;
	var height = navigator.isCocoonJS ? window.innerHeight : g_game.baseHeight;

	g_game.phaserGame = new Phaser.Game(width, height, Phaser.AUTO, '', null, false, false);	//Creating an instance of a phaser game
	g_game.phaserGame.state.add('Boot', Boot);													//Adding "boot" state
	g_game.phaserGame.state.add('Splash', SplashState);												//Adding "game" state
	g_game.phaserGame.state.add('game', GameState);												//Adding "game" state
	g_game.phaserGame.state.start('Boot');														//Starting boot state
}