/**
 * Created by jonas on 2016-04-16.
 */

GameState.prototype.update = function() {


	this.game.physics.arcade.overlap(g_game.player, g_game.enemyBullets, damagePlayer);
	this.game.physics.arcade.overlap(g_game.player, g_game.planets, damagePlayer);
	this.game.physics.arcade.overlap(g_game.planets, g_game.myBullets, shootPlanet);
	this.game.physics.arcade.overlap(g_game.planets, g_game.enemyBullets, shootPlanet);

};

function damagePlayer(player, planet) {

	if (!player.customProps.alive) {
		return;
	}

	player.customProps.alive = false;
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	gameSocket.emit('shipdeath', g_game.myId);
}

function shootPlanet(planet, bullet) {
	bullet.kill();
}

