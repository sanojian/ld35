/**
 * Created by jonas on 2016-04-17.
 */

function SplashState(game) {}

SplashState.prototype = {
	preload: function() {

	},
	create: function() {
		var self = this;

		this.game.stage.backgroundColor = '#140C1C';

		this.game.stage.smoothed = false;

		//this.game.add.image(0, 0, 'splashBackground');

		var style = { font: "bold 32px 'Press Start 2P'", fill: "#DEEED6" };

		this.game.add.text(this.game.width/2, 90, 'XFORM ARENA', style).anchor.set(0.5, 0.5);

		style = { font: "bold 24px 'Press Start 2P'", fill: "#6DC2CA" };

		var nameText = this.game.add.text(this.game.width/2, 360, localStorage.playerName || '---', style);
		nameText.anchor.set(0.5, 0.5);

		style = { font: "bold 24px 'Press Start 2P'", fill: "#DEEED6" };
		this.game.add.text(this.game.width/2, 500, 'Type in a name and ENTER to play', style).anchor.set(0.5, 0.5);

		var keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		var name = localStorage.playerName || '';
		function addKey() {
			if (name.length < 10) {
				name += this;
				nameText.setText(name);
			}
		}
		for (var i=0; i<keys.length; i++) {
			var letter = keys.charAt(i);
			var key = this.game.input.keyboard.addKey(Phaser.Keyboard[letter]);
			key.onDown.add(addKey, letter);
		}

		var keyBack = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
		keyBack.onDown.add(function() {
			name = name.substring(0, Math.max(0, name.length-1));
			nameText.setText(name || '---');
		}, this);
		var keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		keyEnter.onDown.add(function() {
			if (name.length) {
				g_game.playerName = name;
				localStorage.playerName = name;
				this.game.state.start('game');
			}
		}, this);
	}
};