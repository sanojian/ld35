/**
 * Created by jonas on 2016-04-16.
 */

var express = require('express');
var config = require('./config');
var http = require('http');
var path = require('path');

var app = module.exports = express();

app.set('port', config.express.port);

app.use(express.static(path.join(__dirname, '../client/dist')));

var theApp = http.createServer(app);
theApp.listen(app.get('port'));

// socket.io
var io = require('socket.io')(theApp);


var posX = 100;
var clientColors = [0xff0000, 0x0000ff, 0xffff00, 0x00ff00, 0xff00ff];
var clients = {};
var nextClientId = 0;
var nextGemId = 0;
var world = { planets: []};

function getRelevantProps(obj) {
	return {
		id: obj.id,
		x: obj.x,
		y: obj.y,
		color: obj.color,
		angle: obj.angle,
		throttle: obj.throttle,
		turn: obj.turn,
		name: obj.name,
		form: obj.form,
		alive: obj.alive,
		points: obj.points,
		velocity: obj.velocity
	};
}

initWorld();

io.on('connection', function(socket) {
	console.log('a user connected');

	var myId = nextClientId++;
	clients[myId] = {
		socket: socket,
		id: myId,
		x: posX + (myId%5)*100,
		y: 300,
		angle: 0,
		form: 1,
		alive: true,
		name: '',
		points: 0,
		velocity: { x: 0, y: 0 },
		color: clientColors[myId % clientColors.length]
	};

	socket.emit('world', world);

	var myProps = getRelevantProps(clients[myId]);
	socket.emit('my_props', myProps);
	socket.broadcast.emit('new_player', myProps);

	for (var key in clients) {
		if (key !== myId) {
			socket.emit('new_player', getRelevantProps(clients[key]));
		}
	}

	socket.on('gemcollected', function (data) {
		clients[myId].points++;
		socket.broadcast.emit('gemcollected', data);
	});

	socket.on('newgem', function (data) {
		data.id = nextGemId++;
		var angle = Math.random() * 2 * Math.PI;
		data.angle = angle;
		socket.broadcast.emit('newgem', data);
		socket.emit('newgem', data);
	});

	socket.on('playershot', function (data) {
		socket.broadcast.emit('playershot', data);
	});

	socket.on('myname', function (name) {
		clients[myId].name = name;
		console.log('user name ' + name);
	});

	socket.on('shipdeath', function (clientId) {
		socket.broadcast.emit('shipdeath', clientId);
		clients[clientId].points = 0;
		setTimeout(function() {
			resetShip(clientId, socket);
		}, 3000);

	});

	socket.on('updateLoc', function (data) {
		clients[data.id].x = data.x;
		clients[data.id].y = data.y;
		clients[data.id].velocity = data.velocity;
		clients[data.id].dir = data.dir;
		clients[data.id].angle = data.angle;
		clients[data.id].form = data.form;
		clients[data.id].shooting = data.shooting;
		data.alive = clients[data.id].alive;
		data.points = clients[data.id].points;
		data.name = clients[data.id].name;
		socket.broadcast.emit('loc', data);
		clients[data.id].shooting = false;
	});


	socket.on('disconnect', function() {
		socket.broadcast.emit('playerLeft', myId);
		delete clients[myId];
	});
});

function resetShip(clientId, socket) {
	clients[clientId].x = Math.floor(Math.random()*world.width);
	clients[clientId].y = Math.floor(Math.random()*world.height);
	clients[clientId].alive = true;
	var myProps = getRelevantProps(clients[clientId]);
	socket.broadcast.emit('loc', myProps);
	socket.emit('loc', myProps);

}

function initWorld() {
	world.width = 4800;
	world.height = 4800;

	// generate planets
	for (var i=0; i<8; i++) {
		var x = 600 + Math.floor(Math.random() * world.width - 1200);
		var y = 500 + Math.floor(Math.random() * world.height - 1000);
		world.planets.push({ x: x, y: y });
	}
}
