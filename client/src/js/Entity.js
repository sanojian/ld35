/**
 * Created by jonas on 2016-04-16.
 */

var Entity = function (game, cx, cy, spriteName) {

	Phaser.Sprite.call(this, game, cx, cy, spriteName);

	this.game.physics.enable(this);

	this.anchor.setTo(0.5, 0.5); //so it flips around its middle

};
Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

Entity.prototype.update = function() {

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
};