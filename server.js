var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

//run server
server.listen(process.env.PORT || 3000);
console.log('server running')

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
});


io.sockets.on('connection', function(socket){
	//all events stay in here
	connections.push(socket);
	console.log('connected:%s sockets connected', connections.length);
	
	//Disconnect
	socket.on('disconnect', function(data){
	//user disconnect
	users.splice(users.indexOf(socket.username), 1)
	updateUsernames();
	connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnected : %s sockets connected', connections.length);
	});

	//Send Message
	socket.on('send message', function(data){
		console.log(data)
		io.sockets.emit('new message', {msg: data});
	})
	

	//New user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		//update usernames
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
})