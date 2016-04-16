/**
 * Created by jonas on 2016-04-16.
 */


window.g_game = {
	baseWidth: 24*48,
	baseHeight: 15*48,
	//Room width and height (?)

	gravity: 1400,
	hozMove: 160,
	vertMove: -460,
	maxVertMove: 600,
	//Physics & movement

	jumpTimer: 0,
	shootTimer: 0,
	JUMP_TIMEOUT: 350,
	SHOOT_TIMEOUT: 550,
	//Timing

	currentLevel: 0,
	LEVEL_TIMEOUT: 15000,
	PLATFORM_SPEED: 150
	//Misc
};