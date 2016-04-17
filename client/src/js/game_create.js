/**
 * Created by jonas on 2016-04-16.
 */

GameState.prototype.create = function() {

	this.game.stage.backgroundColor = '#140C1C';

	this.game.world.setBounds(0, 0, 4800, 4800);

	// draw random starfield
	var starMap = [];
	var x, y;
	for (y=0; y<this.game.world.height; y++) {
		starMap[y] = [];
		for (x=0; x<this.game.world.width; x++) {
			if (Math.random() < 0.0001) {
				starMap[y][x] = { alpha: Math.random(), tintR: Math.random(), tintG: Math.random(), tintB: Math.random() };
			}
			else {
				starMap[y][x] = 0;
			}
		}
	}
	// copy edges of starmap for wrapping map
	for (y=0; y < this.game.height; y++) {
		for (x = 0; x < this.game.world.width; x++) {
			starMap[this.game.world.height - this.game.height + y][x] = starMap[y][x];
		}
	}
	for (y=this.game.height; y < this.game.world.height - this.game.height; y++) {
		for (x = 0; x < this.game.width; x++) {
			starMap[y][this.game.world.width - this.game.width + x] = starMap[y][x];
		}
	}
	// make sure all corners match
	for (y=0; y < this.game.height; y++) {
		for (x = 0; x < this.game.width; x++) {
			starMap[y][this.game.world.width - this.game.width + x] = starMap[y][x];
			starMap[this.game.world.height - this.game.height + y][this.game.world.width - this.game.width + x] = starMap[y][x];
		}
	}
	// fill in stars
	for (y=0; y<this.game.world.height; y++) {
		for (x = 0; x < this.game.world.width; x++) {
			if (starMap[y][x] !== 0) {
				var star = this.game.add.image(x, y, 'star');
				star.scale.set(g_game.scale);
				star.alpha = 0.3 + starMap[y][x].alpha * 0.5;
				var starTint = Math.floor(0xc0 + starMap[y][x].tintR * 0x3f) << 16;
				starTint += Math.floor(0xc0 + starMap[y][x].tintG * 0x3f) << 8;
				starTint += Math.floor(0xc0 + starMap[y][x].tintB * 0x3f);
				star.tint = starTint;
			}
		}
	}

	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	g_game.planets = this.game.add.group();

	g_game.propulsionFx = this.game.add.group();
	for (var i=0; i<200; i++) {
		var p = new Entity(g_game.phaserGame, 0, 0, 'propulsion');
		p.scale.set(g_game.scale);
		g_game.propulsionFx.add(p);
		p.kill();
	}
	g_game.particles = this.game.add.group();
	for (i=0; i<30; i++) {
		var p2 = new Entity(g_game.phaserGame, 0, 0, 'particle');
		p2.scale.set(g_game.scale);
		g_game.particles.add(p2);
		p2.kill();
	}
	g_game.gems = this.game.add.group();
	for (i=0; i<30; i++) {
		var gem = new Entity(g_game.phaserGame, 0, 0, 'gem');
		gem.scale.set(g_game.scale);
		gem.customProps = { id: -1 };
		g_game.gems.add(gem);
		gem.kill();
	}
	g_game.myBullets = this.game.add.group();
	var bullet;
	for (i=0; i<20; i++) {
		bullet = new Entity(g_game.phaserGame, 0, 0, 'bullet');
		bullet.scale.set(g_game.scale);
		bullet.customProps = { ownerId: -1 };
		g_game.myBullets.add(bullet);
		bullet.kill();
	}
	g_game.enemyBullets = this.game.add.group();
	for (i=0; i<200; i++) {
		bullet = new Entity(g_game.phaserGame, 0, 0, 'bullet');
		bullet.scale.set(g_game.scale);
		bullet.customProps = { ownerId: -1 };
		g_game.enemyBullets.add(bullet);
		bullet.kill();
	}

	g_game.friendlyUnits = this.game.add.group();
	g_game.player = new UnitPlayer(this.game, 1200, 1200, 'ship');
	g_game.friendlyUnits.add(g_game.player);

	g_game.enemyUnits = this.game.add.group();

	var style = { font: "bold 16px 'Press Start 2P'", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top" };

	//  The Text is positioned at 0, 100
	g_game.scoreText = this.game.add.text(this.game.width - 240, 8, "SCOREBOARD", style);
	g_game.scoreText.fixedToCamera = true;
	//g_game.scoreText.scale.set(2);

	g_game.uiHearts = [];
	g_game.uiHearts[0] = this.game.add.image(this.game.width - 500, 4, 'heart');
	g_game.uiHearts[0].scale.set(4);
	g_game.uiHearts[0].fixedToCamera = true;
	g_game.uiHearts[1] = this.game.add.image(this.game.width - 420, 4, 'heart');
	g_game.uiHearts[1].scale.set(4);
	g_game.uiHearts[1].fixedToCamera = true;
	g_game.uiHearts[2] = this.game.add.image(this.game.width - 340, 4, 'heart');
	g_game.uiHearts[2].scale.set(4);
	g_game.uiHearts[2].fixedToCamera = true;

	g_game.cursors = this.game.input.keyboard.createCursorKeys();

	g_game.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	this.game.camera.follow(g_game.player, Phaser.Camera.FOLLOW_LOCKON);
	//this.game.camera.follow(g_game.player, Phaser.Camera.FOLLOW_PLATFORMER);

	// dont pause when tab out of focus
	this.stage.disableVisibilityChange = true;
	initNetworking();

	this.game.time.events.loop(Phaser.Timer.SECOND, updateScoreBoard, this);
};

function updateScoreBoard() {

	var scores = [];
	for (var key in clients) {
		if (clients[key].sprite.customProps.alive) {
			scores.push({ name: key == g_game.myId ? g_game.playerName : clients[key].name, score: clients[key].sprite.customProps.points });
		}
	}

	scores.sort(function(a, b) {
		return b.score - a.score;
	});

	var scoreText = '';
	for (var i=0; i<scores.length; i++) {
		scoreText += zeroFill(scores[i].score, 3) + ' ' + scores[i].name + '\n';
	}

	g_game.scoreText.text = scoreText;

}

function zeroFill( number, width )
{
	width -= number.toString().length;
	if ( width > 0 )
	{
		return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	return number + ""; // always return a string
}

function explodeHere(x, y, game) {

	for (var i=0; i<4; i++) {
		var p = g_game.particles.getFirstExists(false);
		if (p) {
			p.revive();
			p.x = x;
			p.y = y;
			var angle = Math.PI/2 * i + Math.random() * Math.PI/2;
			p.angle = 180 - angle * 180/Math.PI;
			p.body.velocity.x = (100 + Math.random() * 100) * Math.cos(angle);
			p.body.velocity.y = (100 + Math.random() * 100) * Math.sin(angle);
			game.time.events.add(Phaser.Timer.SECOND * 1, p.kill, p);
		}
	}

}