/**
 * Created by jonas on 2016-04-16.
 */

var UnitPlayer = function (game, x, y, id, type) {

	var self = this;

	Unit.call(this, game, x, y, id, type);

};

UnitPlayer.prototype = Object.create(Unit.prototype);
UnitPlayer.prototype.constructor = UnitPlayer;

UnitPlayer.prototype.update = function() {

	if (g_game.cursors.up.isDown) {
		this.body.velocity.x += Math.cos(this.angle * Math.PI/180) * 1;
		this.body.velocity.y += Math.sin(this.angle * Math.PI/180) * 1;
	}
	if (g_game.cursors.left.isDown) {
		this.angle -= 3;
	}
	if (g_game.cursors.right.isDown) {
		this.angle += 3;
	}

	Unit.prototype.update.call(this);
};

