var chat_server = 'http://' + location.hostname + ':3000';
console.log('server: ' + chat_server);
var socket = io.connect(chat_server);

socket.on('connect', function () {
	socket.emit('new_user_login',$("#myname").text());
});


socket.on('system_message', function (time, content) {
//	document.getElementById('head1').innerHTML = content ;
	var msg_list = $(".msg-list");
    msg_list.append(
			'<div class="text-center">' + content + '&nbsp&nbsp&nbsp' + time + '</div></div>');

    var chat_body = $('.chat-body');
    var height = chat_body.prop("scrollHeight");
    chat_body.prop('scrollTop', height);
});

socket.on('user_message',function addMessage(name, time, content) {
    var msg_list = $(".msg-list");
    msg_list.append(
			'<div class = "panel panel-info">' +
			'<div class="panel-heading"><div class="clearfix msg-wrap">' +
			'<span class = "pull-left">'+ name + '</span>' + 
			'<span class = "pull-right">'+ time + '</span></div></div>' +
			'<div class="panel-body">' + content + '</div>' + 
			'</div>');
	
	var chat_body = $('.chat-body');
    var height = chat_body.prop("scrollHeight");
    chat_body.prop('scrollTop', height);
});

function onClickSendMessage()
{
	var msg_list = $(".msg-list");
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
	var second = date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds();
	var time = hour+":"+minute+":"+second;
	var content = $("#input_edit").val();

    msg_list.append(
			'<div class = "panel panel-default">' +
			'<div class="panel-heading"><div class="clearfix msg-wrap">' +
			'<span class = "pull-left">Me</span>' + 
			'<span class = "pull-right">'+ time + '</span></div></div>' +
			'<div class="panel-body">' + content + '</div>' + 
			'</div>');
	
	var chat_body = $('.chat-body');
    var height = chat_body.prop("scrollHeight");
    chat_body.prop('scrollTop', height);

	socket.emit('user_speak',$("#myname").text(),content);
	$("#input_edit").val("");
}

function logout()
{
	window.location.replace(window.location);
}

