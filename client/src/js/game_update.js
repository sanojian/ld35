/**
 * Created by jonas on 2016-04-16.
 */

GameState.prototype.update = function() {


	this.game.physics.arcade.overlap(g_game.player, g_game.enemyBullets, shootPlayer);
	if (g_game.player.customProps.form === 3) {
		// mining mode
		this.game.physics.arcade.collide(g_game.player, g_game.planets, minePlanet);
	}
	else {
		// kill player
		this.game.physics.arcade.overlap(g_game.player, g_game.planets, damagePlayer);
	}

	this.game.physics.arcade.overlap(g_game.player, g_game.gems, collectGem);
	this.game.physics.arcade.overlap(g_game.planets, g_game.myBullets, shootPlanet);
	this.game.physics.arcade.overlap(g_game.planets, g_game.enemyBullets, shootPlanet);

};

function collectGem(player, gem) {

	gameSocket.emit('gemcollected', {id: gem.customProps.id });
	player.customProps.points++;
	gem.kill();
}

function minePlanet(player, planet) {
	var speed = Math.sqrt(Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2));
	if (speed > 60) {
		gameSocket.emit('newgem', {x: planet.x, y: planet.y});
	}
}

function shootPlayer(player, bullet) {

	if (!player.customProps.alive) {
		return;
	}

	player.damage(1);
	console.log('damage');
	bullet.kill();
}

function damagePlayer(player, planet) {

	if (!player.customProps.alive) {
		return;
	}

	player.damage(5);
}

function shootPlanet(planet, bullet) {
	bullet.kill();
}

