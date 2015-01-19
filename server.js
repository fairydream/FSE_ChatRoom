var http = require("http")
  , url = require("url")
  , express = require("express")
  , bodyParser = require('body-parser')
  , ejs = require("ejs")
  , chatRoom = express();


chatRoom.set('port', process.env.PORT || 3000);
chatRoom.engine('.html', ejs.__express);
chatRoom.set('views', __dirname + '/views');
chatRoom.set('view engine', 'html');
chatRoom.use(express.favicon());
chatRoom.use(express.logger('dev'));
chatRoom.use(express.bodyParser());
chatRoom.use(express.methodOverride());
chatRoom.use(express.cookieParser()); 
chatRoom.use(express.static(__dirname + '/public'));

chatRoom.use(function(request,response,next){
	console.log('%s %s', request.method, request.url);
	console.log('%s %s', url.parse(request.url).pathname,url.parse(request.url).query);
	next();
});

chatRoom.get('/',function(request,response){
		response.render('login');
	});

chatRoom.post('/',function(request, response){
	var username = request.body.username;
	console.log(username);
	response.render('chatRoom', {'username':username});
});

var server = chatRoom.listen(3000,function(){
		console.log('Listening on port %d',server.address().port);
	});

var io = require("socket.io").listen(server);

io.sockets.on('connection', function(socket){
		var myname;
		console.log("Connection " + socket.id + " accepted.");

		socket.on('new_user_login', function(username){
				myname = username;
				console.log(username + " log in.");
				socket.emit('system_message', getTime(), username + " entered the room");
				socket.broadcast.emit('system_message', getTime(), username + " entered the room");
			});

		socket.on('user_speak', function(username, content){
				console.log(username + " speak: " + content);
				socket.broadcast.emit('user_message', username, getTime(), content);			
			});

		socket.on('disconnect', function(){
				console.log(myname + " left the room.");
				socket.emit('system_message', getTime(), myname + " left the room");
				socket.broadcast.emit('system_message', getTime(), myname + " left the room");
			});

		socket.on('logout', function(){
				console.log(myname + " logged out.");
				socket.broadcast('system_message', getTime(), myname + " left the room");
			});
 });

var getTime=function(){
  	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
	var second = date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds();
	return hour+":"+minute+":"+second;
}

