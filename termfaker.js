var kc_enter = 13;

var CONTEXT_SHELL = "CONTEXT_SHELL"
var context = CONTEXT_SHELL

var input_area = $("#input-area");
var msg_buffer = $("#message-buffer");

input_area.keydown(function(evt){
	//console.log(evt.keyCode);
	if (evt.keyCode == kc_enter) {
		evt.preventDefault();
		sendCommand();
	}
})

function sendMsg(sender, content, rc) {
	msg_buffer.append($(
			"<section class='message' data-sender='"+sender+"' data-rc="+rc+">" +
			content +
			"</section>"
			));
	msg_buffer.animate({scrollTop: msg_buffer[0].scrollHeight-msg_buffer.height()}, 200);
}

function sendCommand() {
	if (input_area.val() != "") {
		var val = input_area.val();
		sendMsg("me@localhost", val);
		setTimeout(
			function(){callCommand(val)},
			200);
		input_area.val("");
	}
}

commandMap = {
	ls: _ls,
	where: _ls,
	location: _ls,
	dir: _ls,
	l: _ls,
	clear: _clear,
	cd: _cd,
	enter: _cd,
	go: _cd,
	go_to: _cd
}

function callCommand(cmd) {
	console.log("calling '"+cmd+"'");
	var argv = cmd.split(" ");
	var response = {
		rc: 1,
		msg: "Unknown command '"+argv[0] +
				"'. Try asking for help?",
		sender: "shellbot"};

	if (argv[0].toLowerCase() == "help") {
		response = _help(argv);
		response.sender = "helpbot";
	} else if (argv[0].toLowerCase() in commandMap) {
		response = commandMap[argv[0].toLowerCase()](argv)
		if (response != null) {
			response.sender = "shellbot";
		}
	}
	// response is an object of form
	// { rc = (0|1),
	//   msg = "..." }

	//send the actual message
	if (response != null) {
		$(msg_buffer.children()[msg_buffer.children().length-1]).attr('data-rc', response.rc)
		sendMsg(response.sender, response.msg, response.rc)		
	}
}

function _help (argv) {
	if (argv.length == 1) {
		return {
			rc: 0,
			msg: $("#helpTemplate").html()
		};
	}

	return {
		rc: 1,
		msg: "I was kidding, help is not implemented :("
	};
}

function _ls (argv) {
	var rows = 5
	var content = $("#sidebar ul li");
	splits = Math.ceil(content.length/rows);
	var buildHTML = "";
	for (var s=0; s<splits; s++){
		buildHTML = buildHTML + "<ul class='lsout'>"
		for (var i=s*rows; i< Math.min((s+1)*rows, content.length); i++) {
			buildHTML = buildHTML + content[i].outerHTML;
		}
		buildHTML = buildHTML + "</ul>"
	}

	return {
		rc: 0,
		msg: buildHTML
	};
}


function _clear (argv) {
	msg_buffer.html("");
	return null;
}

function _cd (argv) {
	if(!update_cwd_tree(argv[1])) {
		return {
			rc: 1,
			msg: "no such file or directory "+argv[1]
		}
	}
	
	return null;
}