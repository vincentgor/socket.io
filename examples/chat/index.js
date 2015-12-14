// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var soc = require('socket.io');
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;
var io1 = soc.listen(server);
var io = io1.of('/q');

io.on('connection', function (socket) {
    console.log('cccc');
  var addedUser = false;

  var myRoom =  socket.adapter.rooms;
  // console.log('myRoom.length', myRoom);
  socket.leave(socket.id);
  socket.join('aaaaaaaaaaaaaaaaaaaaaaa');
  // console.log('myRoom.length', myRoom);
  // console.log('myRoom.length', Object.getOwnPropertyNames(myRoom['aaaaaaaaaaaaaaaaaaaaaaa']).length);

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    var sockets = myRoom['aaaaaaaaaaaaaaaaaaaaaaa'];
    var name = '';
    console.log(io);
    // for (var ss in sockets) {
    //     if (sockets.hasOwnProperty(ss)) {
    //         name += io.sockets[ss].username;
    //     }
    // }
    socket.broadcast.to('aaaaaaaaaaaaaaaaaaaaaaa').emit('new message', {
      username: name,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username, instance) {
    if (addedUser) return;

    var myRoom =  socket.adapter.rooms;
    // if (Object.getOwnPropertyNames(myRoom[instance]).length>=3) {
    //     socket.broadcast.emit('new message', {
    //       username: socket.username,
    //       message: 'game begin'
    //     });
    //     return;
    // }
    // socket.leave(socket.id);
    // socket.join(instance);

    console.log('myRoom.length', myRoom);

    // var roomLength = Object.getOwnPropertyNames(myRoom[instance]).length;



    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

    // if (roomLength == 3) {
    //     socket.broadcast.emit('new message', {
    //       username: socket.username,
    //       message: 'game begin'
    //     });
    // }

  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
