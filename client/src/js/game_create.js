/**
 * Created by jonas on 2016-04-16.
 */

GameState.prototype.create = function() {

	this.game.stage.backgroundColor = '#333333';

	this.game.world.setBounds(0, 0, 2400, 2400);

	// draw random starfield
	var starMap = [];
	var x, y;
	for (y=0; y<this.game.world.height; y++) {
		starMap[y] = [];
		for (x=0; x<this.game.world.width; x++) {
			if (Math.random() < 0.0002) {
				starMap[y][x] = { alpha: Math.random(), tint: Math.random() };
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
				star.tint = starMap[y][x].tint * 0xffffff;
			}
		}
	}



	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	g_game.planets = this.game.add.group();

	g_game.myBullets = this.game.add.group();
	var bullet;
	for (var i=0; i<20; i++) {
		bullet = this.game.add.sprite(0, 0, 'bullet');
		bullet.anchor.set(0.5, 0.5);
		bullet.scale.set(2);
		bullet.customProps = { ownerId: -1 };
		this.game.physics.enable(bullet);
		g_game.myBullets.add(bullet);
		bullet.kill();
	}
	g_game.enemyBullets = this.game.add.group();
	for (i=0; i<200; i++) {
		bullet = this.game.add.sprite(0, 0, 'bullet');
		bullet.anchor.set(0.5, 0.5);
		bullet.scale.set(2);
		bullet.customProps = { ownerId: -1 };
		this.game.physics.enable(bullet);
		g_game.enemyBullets.add(bullet);
		bullet.kill();
	}

	g_game.friendlyUnits = this.game.add.group();
	g_game.player = new UnitPlayer(this.game, 1200, 1200, 'ship');
	g_game.friendlyUnits.add(g_game.player);

	g_game.enemyUnits = this.game.add.group();

	g_game.cursors = this.game.input.keyboard.createCursorKeys();

	g_game.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	this.game.camera.follow(g_game.player, Phaser.Camera.FOLLOW_LOCKON);
	//this.game.camera.follow(g_game.player, Phaser.Camera.FOLLOW_PLATFORMER);

	// dont pause when tab out of focus
	this.stage.disableVisibilityChange = true;
	initNetworking();
};