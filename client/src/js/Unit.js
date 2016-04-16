/**
 * Created by jonas on 2016-04-16.
 */

var Unit = function (game, cx, cy, spriteName, team) {

	Phaser.Sprite.call(this, game, cx, cy, spriteName);

	this.game.physics.enable(this);

	this.body.bounce.y = 0.1;
	this.body.maxVelocity = 200;
	this.anchor.setTo(0.5, 0.5); //so it flips around its middle
	this.scale.set(2);
};
Unit.prototype = Object.create(Phaser.Sprite.prototype);

Unit.prototype.update = function() {

	//this.x = (this.x + this.game.world.width) % this.game.world.width;
	//this.y = (this.y + this.game.world.height) % this.game.world.height;

	//this.x = (this.x + this.game.world.width) % this.game.world.width;
	//this.y = (this.y + this.game.world.height-200) % (this.game.world.height-200);
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