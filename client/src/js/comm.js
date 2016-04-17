/**
 * Created by jonas on 2016-04-16.
 */

function initNetworking() {
	gameSocket = io();

	gameSocket.on('my_props', function(props) {
		myId = props.id;
		var color = g_game.palette[myId % g_game.palette.length].name;
		console.log(color);
		g_game.player.frameName = 'ship_' + color;
		g_game.myId = myId;
		clients[props.id] = props;
		g_game.player.x = props.x;
		g_game.player.y = props.y;
		g_game.player.angle = props.angle;
		clients[props.id].sprite = g_game.player;
	});

	gameSocket.on('new_player', function(props) {
		if (props.id === myId) {
			gameSocket.emit('myname', g_game.playerName);
			return;
		}
		clients[props.id] = props;
		var color = g_game.palette[props.id % g_game.palette.length].name;
		var player = new Unit(g_game.phaserGame, props.x, props.y, 'ship_' + color);
		g_game.enemyUnits.add(player);
		clients[props.id].sprite = player;
	});

	gameSocket.on('gemcollected', function(data) {
		g_game.gems.forEach(function(gem) {
			if (gem.customProps.id === data.id) {
				gem.kill();
			}
		});
	});

	gameSocket.on('newgem', function(data) {
		var gem = g_game.gems.getFirstExists(false);
		if (gem) {
			gem.x = data.x;
			gem.y = data.y;
			gem.revive();
			gem.body.velocity.x = 10 * Math.cos(data.angle);
			gem.body.velocity.y = 10 * Math.sin(data.angle);
		}

	});

	gameSocket.on('playerLeft', function(id) {
		clients[id].sprite.destroy();
		delete clients[id];
	});

	gameSocket.on('world', function(world) {
		for (var i=0; i<world.planets.length; i++) {
			var planet = new Entity(g_game.phaserGame, world.planets[i].x, world.planets[i].y, 'planet');
			planet.anchor.set(0.5, 0.5);
			planet.scale.set(g_game.scale);
			planet.body.immovable = true;
			planet.body.moves = false;
			g_game.phaserGame.physics.enable(planet);
			g_game.planets.add(planet);
		}
	});

	gameSocket.on('playershot', function(data) {
		explodeHere(data.x, data.y);
	});

	gameSocket.on('shipdeath', function(clientId) {
		console.log('kill ' + clientId);
		clients[clientId].sprite.customProps.alive = false;
		setTimeout(function() {
			clients[clientId].sprite.customProps.alive = true;
		}, 3000);
	});

	gameSocket.on('loc', function(client) {
		for (var key in client) {
			clients[client.id][key] = client[key];
		}
		clients[client.id].sprite.x = client.x;
		clients[client.id].sprite.y = client.y;
		clients[client.id].name = client.name;
		clients[client.id].sprite.angle = client.angle;
		clients[client.id].sprite.customProps.throttle = client.throttle;
		clients[client.id].sprite.customProps.turn = client.turn;
		clients[client.id].sprite.customProps.points = client.points;
		clients[client.id].sprite.body.velocity.x = client.velocity.x;
		clients[client.id].sprite.body.velocity.y = client.velocity.y;

		if (client.form && client.form != clients[client.id].sprite.customProps.form) {
			clients[client.id].sprite.xform(client.form);
		}
		if (client.shooting) {
			clients[client.id].sprite.shoot(client.id);
		}
		if (client.alive && !clients[client.id].sprite.customProps.alive) {
			// revive
			if (client.id === myId) {
				clients[client.id].sprite.customProps.health = g_game.MAX_HEALTH;
				clients[client.id].sprite.damage(0);
			}
		}
		clients[client.id].sprite.customProps.alive = client.alive;

	});

	gameSocket.on('disconnect', function() {
		//clients[myId] = null;
	});

}

function getPropsForPlayer(client, shooting) {
	return {
		id: client.id,
		x: client.sprite.x,
		y: client.sprite.y,
		angle: client.sprite.angle,
		throttle: client.sprite.customProps.throttle,
		turn: client.sprite.customProps.turn,
		form: client.sprite.customProps.transformingTo,
		shooting: shooting,
		velocity: { x: client.sprite.body.velocity.x, y: client.sprite.body.velocity.y }
	};
}