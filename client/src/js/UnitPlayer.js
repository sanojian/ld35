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

	// no controls allowed if transforming
	if (this.customProps.form !== 0) {
		if (g_game.cursors.up.isDown) {
			this.body.velocity.x += Math.cos(this.angle * Math.PI / 180) * 1;
			this.body.velocity.y += Math.sin(this.angle * Math.PI / 180) * 1;
		}
		if (g_game.cursors.left.isDown) {
			this.angle -= 3;
		}
		if (g_game.cursors.right.isDown) {
			this.angle += 3;
		}

		var xform, self;
		if (g_game.buttonXform.isDown && this.customProps.form === 1) {
			this.xform(2);
		}
		else if (g_game.buttonXform.isDown && this.customProps.form === 2) {
			this.xform(1);
		}
	}

	Unit.prototype.update.call(this);
};

