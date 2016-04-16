/**
 * Created by jonas on 2016-04-16.
 */

var Unit = function (game, cx, cy, spriteName, team) {

	Phaser.Sprite.call(this, game, cx, cy, spriteName);

	this.customProps = {
		form: 1,
		throttle: 0,
		turn: 0
	};

	this.game.physics.enable(this);

	this.body.bounce.y = 0.1;
	this.body.maxVelocity = 200;
	this.anchor.setTo(0.5, 0.5); //so it flips around its middle

	this.engine1 = game.add.sprite(-9, -6,  'engine');
	this.addChild(this.engine1);
	this.engine2 = game.add.sprite(-9, 6,  'engine');
	this.engine2.scale.set(1, -1);
	this.addChild(this.engine2);

	this.scale.set(2);
};
Unit.prototype = Object.create(Phaser.Sprite.prototype);

Unit.prototype.xform = function(toForm) {
	this.customProps.form = 0;
	this.customProps.transformingTo = toForm;
	// transform!

	var props_engine1_forms = {
		1: {angle: 0, x: -9, y: -6},
		2: {angle: 90, x: 1, y: -9}
	};
	var props_engine2_forms = {
		1: {angle: 0, x: -9, y: 6},
		2: {angle: -90, x: 1, y: 9}
	};

	var xform = this.game.add.tween(this.engine1).to( props_engine1_forms[toForm], 2000, "Linear", true);
	this.game.add.tween(this.engine2).to( props_engine2_forms[toForm], 2000, "Linear", true);

	var self = this;
	xform.onComplete.add(function() { self.customProps.form = toForm; });

};

Unit.prototype.shoot = function() {
	var bullet = this.game.add.sprite(this.x, this.y, 'bullet');
	bullet.anchor.set(0.5, 0.5);
	bullet.scale.set(2);
	this.game.physics.enable(bullet);
	bullet.body.velocity.x = this.body.velocity.x + 300*Math.cos(this.angle * Math.PI/180);
	bullet.body.velocity.y = this.body.velocity.y + 300*Math.sin(this.angle * Math.PI/180);
};

Unit.prototype.update = function() {

	this.body.velocity.x += Math.cos(this.angle * Math.PI / 180) * this.customProps.throttle * g_game['FORM_' + this.customProps.form].thrust;
	this.body.velocity.y += Math.sin(this.angle * Math.PI / 180) * this.customProps.throttle * g_game['FORM_' + this.customProps.form].thrust;
	this.angle += this.customProps.turn * g_game['FORM_' + this.customProps.form].turn;

	// keep the unit withing the visible game area
	if (this.x < this.game.width / 2) {
		this.x += this.game.world.width - this.game.width;
	}
	else if (this.x > this.game.world.width - this.game.width / 2) {
		this.x -= this.game.world.width - this.game.width;
	}
	if (this.y < this.game.height / 2) {
		this.y += this.game.world.height - this.game.height;
	}
	else if (this.y > this.game.world.height - this.game.height / 2) {
		this.y -= this.game.world.height - this.game.height;
	}
	if (this !== g_game.player) {
		// keep this unit within view of player
		if (this.x < this.game.width && g_game.player.x > this.game.world.width/2) {
			this.x = this.game.world.width - this.game.width + this.x;
		}
		else if (this.x > this.game.world.width - this.game.width && g_game.player.x < this.game.world.width/2) {
			this.x = this.x - (this.game.world.width - this.game.width);
		}
		if (this.y < this.game.height && g_game.player.y > this.game.world.height/2) {
			this.y = this.game.world.height - this.game.height + this.y;
		}
		else if (this.y > this.game.world.height - this.game.height && g_game.player.y < this.game.world.height/2) {
			this.y = this.y - (this.game.world.height - this.game.height);
		}
	}
	if (this !== g_game.player) {
		// make this object visible to player
		var dx = Math.abs(this.x - g_game.player.x);
		var dy = Math.abs(this.y - g_game.player.y);
		var wrapX =  Math.abs(this.x - (this.game.world.width - g_game.player.x));
		var wrapY = Math.abs(this.y - (this.game.world.height - g_game.player.y));
	}
};