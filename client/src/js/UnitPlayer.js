/**
 * Created by jonas on 2016-04-16.
 */

var UnitPlayer = function (game, x, y, id, type) {

	Unit.call(this, game, x, y, id, type);

	this.customProps.frame = 0;
	this.customProps.lastShot = 0;
};

UnitPlayer.prototype = Object.create(Unit.prototype);
UnitPlayer.prototype.constructor = UnitPlayer;

UnitPlayer.prototype.update = function() {

	// no controls allowed if transforming
	if (this.customProps.form !== 0) {

		var oldThrottle = this.customProps.throttle;
		var oldTurn = this.customProps.turn;
		var oldForm = this.customProps.form;
		var shooting = false;

		this.customProps.turn = 0;
		this.customProps.throttle = 0;

		if (g_game.cursors.up.isDown) {
			this.customProps.throttle = 1;
		}
		if (g_game.cursors.left.isDown) {
			this.customProps.turn = -1;
		}
		if (g_game.cursors.right.isDown) {
			this.customProps.turn = 1;
		}

		var curTime = new Date().getTime();
		if (g_game.shootButton.isDown && curTime - this.customProps.lastShot >= g_game['FORM_' + this.customProps.form].shoot_timer) {
			this.shoot();
			this.customProps.lastShot = curTime;
			shooting = true;
		}

		var xform, self;
		if (g_game.cursors.down.isDown && this.customProps.form === 1) {
			this.xform(2);
		}
		else if (g_game.cursors.down.isDown && this.customProps.form === 2) {
			this.xform(1);
		}

		this.customProps.frame++;
		if (oldThrottle != this.customProps.throttle ||
				oldTurn != this.customProps.turn ||
				oldForm != this.customProps.form ||
				shooting ||
				this.customProps.frame % 30 === 0)
		{
			gameSocket.emit('updateLoc', getPropsForPlayer(clients[myId], shooting));
		}
	}

	Unit.prototype.update.call(this);
};

