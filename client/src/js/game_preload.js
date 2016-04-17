/**
 * Created by jonas on 2016-04-16.
 */

GameState.prototype.preload = function() {

	this.game.load.image('ship', './assets/ship.png');
	this.game.load.image('star', './assets/star.png');
	this.game.load.image('star2', './assets/star2.png');
	this.game.load.image('engine', './assets/engine.png');
	this.game.load.image('bullet', './assets/bullet.png');
	this.game.load.image('planet', './assets/planet.png');
	this.game.load.image('gem', './assets/gem.png');
	this.game.load.image('heart', './assets/heart.png');
	this.game.load.image('heart_empty', './assets/heart_empty.png');
	this.game.load.image('propulsion', './assets/propulsion.png');
	this.game.load.image('particle', './assets/particle.png');

	//this.game.load.audio('shoot', './assets/shoot.mp3');
	//this.game.load.audio('bump', './assets/bump.mp3');

};//Loads art assets (pictures and sounds)