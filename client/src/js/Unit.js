/**
 * Created by jonas on 2016-04-16.
 */

var Unit = function (game, cx, cy, spriteName) {

	Entity.call(this, game, cx, cy, 'ships', spriteName);

	this.customProps = {
		form: 1,
		throttle: 0,
		turn: 0,
		alive: true,
		points: 0,
		frame: 0
	};

	this.game.physics.enable(this);

	this.body.bounce.set(0.3);
	this.engine1 = game.add.sprite(-9, -6,  'engine');
	this.addChild(this.engine1);
	this.engine2 = game.add.sprite(-9, 6,  'engine');
	this.engine2.scale.set(1, -1);
	this.addChild(this.engine2);

	this.scale.set(g_game.scale);
};
Unit.prototype = Object.create(Entity.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.xform = function(toForm) {
	this.customProps.form = 0;
	this.customProps.transformingTo = toForm;
	// transform!

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

	var xform = this.game.add.tween(this.engine1).to( props_engine1_forms[toForm], g_game.XFORM_TIME, "Linear", true);
	this.game.add.tween(this.engine2).to( props_engine2_forms[toForm], g_game.XFORM_TIME, "Linear", true);

	var self = this;
	xform.onComplete.add(function() { self.customProps.form = toForm; });

};

Unit.prototype.shoot = function(clientId) {
	var bullet;
	if (this === g_game.player) {
		bullet = g_game.myBullets.getFirstExists(false);
	}
	else {
		bullet = g_game.enemyBullets.getFirstExists(false);
	}

	if (bullet) {
		bullet.revive();
		bullet.customProps.ownerId = clientId;
		bullet.x = this.x;
		bullet.y = this.y;
		bullet.body.velocity.x = this.body.velocity.x + 300*Math.cos(this.angle * Math.PI/180);
		bullet.body.velocity.y = this.body.velocity.y + 300*Math.sin(this.angle * Math.PI/180);
		this.game.time.events.add(Phaser.Timer.SECOND * 3, bullet.kill, bullet);
	}
};

Unit.prototype.update = function() {

	this.customProps.frame++;

	if (this.customProps.alive) {
		this.alpha = 1;
	}
	else {
		this.alpha = 0;
		return;
	}

	this.body.velocity.x += Math.cos(this.angle * Math.PI / 180) * this.customProps.throttle * g_game['FORM_' + this.customProps.form].thrust;
	this.body.velocity.y += Math.sin(this.angle * Math.PI / 180) * this.customProps.throttle * g_game['FORM_' + this.customProps.form].thrust;
	this.angle += this.customProps.turn * g_game['FORM_' + this.customProps.form].turn;

	if (this.customProps.form !== 0 && this.customProps.throttle && this.customProps.frame % (60 / g_game['FORM_' + this.customProps.form].thrust) === 0) {
		// show propulsion
		var p = g_game.propulsionFx.getFirstExists(false);
		if (p) {
			p.revive();
			p.x = this.x;
			p.y = this.y;
			this.game.time.events.add(Phaser.Timer.SECOND * 3, p.kill, p);
		}
	}

	Entity.prototype.update.call(this);
};