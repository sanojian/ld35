/**
 * Created by jonas on 2016-04-16.
 */

var Unit = function (game, cx, cy, spriteName, team) {

	Phaser.Sprite.call(this, game, cx, cy, spriteName);

	this.customProps = {
		form: 1
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

Unit.prototype.update = function() {

	if (this.x < this.game.width/2) {
		this.x += this.game.world.width - this.game.width;
	}
	else if (this.x > this.game.world.width - this.game.width/2) {
		this.x -= this.game.world.width - this.game.width;
	}
	if (this.y < this.game.height/2) {
		this.y += this.game.world.height - this.game.height;
	}
	else if (this.y > this.game.world.height - this.game.height/2) {
		this.y -= this.game.world.height - this.game.height;
	}

};