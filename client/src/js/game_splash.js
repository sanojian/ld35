/**
 * Created by jonas on 2016-04-17.
 */

function SplashState(game) {}

SplashState.prototype = {
	preload: function() {
		this.game.load.image('ship', './assets/ship.png');
		this.game.load.image('engine', './assets/engine.png');
		this.game.load.image('gem', './assets/gem.png');

	},
	create: function() {
		var self = this;

		createShipTextures(this.game);

		this.game.stage.backgroundColor = '#140C1C';

		this.game.stage.smoothed = false;

		//this.game.add.image(0, 0, 'splashBackground');

		var style = { font: "bold 32px 'Press Start 2P'", fill: "#DEEED6" };

		this.game.add.text(this.game.width/2, 90, 'XFORM ARENA', style).anchor.set(0.5, 0.5);

		style = { font: "bold 24px 'Press Start 2P'", fill: "#6DC2CA" };

		var nameText = this.game.add.text(this.game.width/2, 400, localStorage.playerName || '---', style);
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

		var gem = this.game.add.sprite(4*this.game.width/5, 220, 'gem');
		gem.anchor.set(0.5, 0.5);
		gem.scale.set(4);
		style = { font: "bold 24px 'Press Start 2P'", fill: "#DEEED6" };
		this.game.add.text(gem.x, gem.y + 60, 'Points', style).anchor.set(0.5, 0.5);

		style = { font: "bold 24px 'Press Start 2P'", fill: "#DEEED6" };
		this.game.add.text(this.game.width/2, gem.y + 10, 'SPACE fire', style).anchor.set(0.5, 0.5);
		this.game.add.text(this.game.width/2, gem.y + 50, 'DOWN xform', style).anchor.set(0.5, 0.5);

		var ship = this.game.add.sprite(this.game.width/5, gem.y, 'ships', 'ship_grey');
		ship.anchor.set(0.5, 0.5);
		var engine1 = this.game.add.sprite(-9, -6,  'engine');
		ship.addChild(engine1);
		var engine2 = this.game.add.sprite(-9, 6,  'engine');
		engine2.scale.set(1, -1);
		ship.addChild(engine2);

		ship.scale.set(4);

		style = { font: "bold 24px 'Press Start 2P'", fill: "#DEEED6" };
		var shipText = this.game.add.text(ship.x, ship.y + 60, 'Rocket', style);
		shipText.anchor.set(0.5, 0.5);

		var props_engine1_forms = {
			1: {angle: 0, x: -9, y: -6},
			2: {angle: 90, x: 1, y: -9},
			3: {angle: 150, x: 9, y: -1}
		};
		var props_engine2_forms = {
			1: {angle: 0, x: -9, y: 6},
			2: {angle: -90, x: 1, y: 9},
			3: {angle: -150, x: 9, y: 1}
		};

		var form = 0;
		function changeForm() {
			form = (form + 1) % 3;

			self.game.add.tween(engine1).to( props_engine1_forms[form+1], g_game.XFORM_TIME, "Linear", true);
			self.game.add.tween(engine2).to( props_engine2_forms[form+1], g_game.XFORM_TIME, "Linear", true);

			if (form === 0)
				shipText.text = 'Rocket';
			else if (form === 1)
				shipText.text = 'Fighter';
			else if (form === 2)
				shipText.text = 'Miner';
		}
		this.game.time.events.loop(Phaser.Timer.SECOND * 2, changeForm, this);
	}
};