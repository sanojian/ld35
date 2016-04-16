/**
 * Created by jonas on 2016-04-16.
 */

function initNetworking() {
	gameSocket = io();

	gameSocket.on('my_props', function(props) {
		myId = props.id;
		clients[props.id] = props;
		g_game.player.x = props.x;
		g_game.player.y = props.y;
		g_game.player.angle = props.angle;
		g_game.player.tint = props.color;
		clients[props.id].sprite = g_game.player;
	});

	gameSocket.on('new_player', function(props) {
		if (props.id === myId) {
			return;
		}
		clients[props.id] = props;
		var player = new Unit(g_game.phaserGame, props.x, props.y, 'ship');
		player.tint = props.color;
		g_game.friendlyUnits.add(player);
		clients[props.id].sprite = player;
	});

	gameSocket.on('playerLeft', function(id) {
		clients[id].sprite.destroy();
		delete clients[id];
	});

	gameSocket.on('removeBlock', function(wall) {
		g_game.map.removeTile(wall.x, wall.y);

	});

	gameSocket.on('loc', function(client) {
		for (var key in client) {
			clients[client.id][key] = client[key];
		}
		clients[client.id].sprite.x = client.x;
		clients[client.id].sprite.y = client.y;
		clients[client.id].sprite.angle = client.angle;
		clients[client.id].sprite.customProps.throttle = client.throttle;
		clients[client.id].sprite.customProps.turn = client.turn;
		clients[client.id].sprite.body.velocity.x = client.velocity.x;
		clients[client.id].sprite.body.velocity.y = client.velocity.y;

		if (client.form && client.form != clients[client.id].sprite.customProps.form) {
			clients[client.id].sprite.xform(client.form);
		}
		if (client.shooting) {
			clients[client.id].sprite.shoot();
		}

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