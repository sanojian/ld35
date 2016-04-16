/**
 * Created by jonas on 2016-04-16.
 */


window.g_game = {
	baseWidth: 24*48,
	baseHeight: 15*48,
	scale: 3,

	SHOOT_TIMER: 2000,

	FORM_0: {
		thrust: 0,
		turn: 0,
		shoot_timer: 100000
	},
	FORM_1: {
		thrust: 2,
		turn: 1,
		shoot_timer: 2000
	},
	FORM_2: {
		thrust: 1,
		turn: 3,
		shoot_timer: 500
	}
};