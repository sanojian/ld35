/**
 * Created by jonas on 2016-04-16.
 */


window.g_game = {
	baseWidth: 24*48,
	baseHeight: 15*48,
	scale: 3,
	MAX_HEALTH: 3,
	XFORM_TIME: 1000,

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
	},
	FORM_3: {
		thrust: 1,
		turn: 2,
		shoot_timer: 100000
	}
};

g_game.palette = [
	{ name: 'red', colors: [0x442434, 0x854C30, 0xD04648] },
	{ name: 'brown', colors: [0x442434, 0x4E4A4E, 0x854C30] },
	{ name: 'dkblue', colors: [0x30346D, 0x757161, 0x597DCE] },
	{ name: 'grey', colors: [0x4E4A4E, 0x757161, 0x8595A1] },
	{ name: 'ltbrown', colors: [0x854C30, 0x757161, 0xD27D2C] },
	{ name: 'green', colors: [0x346524, 0x757161, 0x6DAA2C] },
	{ name: 'orange', colors: [0xD27D2C, 0xD2AA99, 0xDAD45E] },
	{ name: 'blue', colors: [0x597DCE, 0x8595A1, 0x6DC2CA] },
	{ name: 'yellow', colors: [0xD2AA99, 0xDAD45E, 0xDEEED6] }
];