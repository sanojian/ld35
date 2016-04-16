/**
 * Created by jonas on 2016-04-16.
 */

GameState.prototype.preload = function() {

	this.game.load.image('ship', './assets/ship.png');
	this.game.load.image('star', './assets/star.png');
	this.game.load.image('engine', './assets/engine.png');
	this.game.load.image('bullet', './assets/bullet.png');

};//Loads art assets (pictures and sounds)