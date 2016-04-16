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

function getRelevantProps(obj) {
	return {
		id: obj.id,
		x: obj.x,
		y: obj.y,
		color: obj.color,
		angle: obj.angle,
		throttle: obj.throttle,
		turn: obj.turn,
		form: obj.form,
		velocity: obj.velocity
	};
}

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
		velocity: { x: 0, y: 0 },
		color: clientColors[myId % clientColors.length]
	};

	var myProps = getRelevantProps(clients[myId]);
	socket.emit('my_props', myProps);
	socket.broadcast.emit('new_player', myProps);

	for (var key in clients) {
		if (key !== myId) {
			socket.emit('new_player', getRelevantProps(clients[key]));
		}
	}

	socket.on('removeBlock', function (data) {
		socket.broadcast.emit('removeBlock', data);
	});

	socket.on('updateLoc', function (data) {
		clients[data.id].x = data.x;
		clients[data.id].y = data.y;
		clients[data.id].velocity = data.velocity;
		clients[data.id].dir = data.dir;
		clients[data.id].angle = data.angle;
		clients[data.id].form = data.form;
		clients[data.id].shooting = data.shooting;
		socket.broadcast.emit('loc', data);
		clients[data.id].shooting = false;
	});


	socket.on('disconnect', function() {
		socket.broadcast.emit('playerLeft', myId);
		delete clients[myId];
	});
});
