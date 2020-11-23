let express = require('express')
let app = express()
let http = require('http').Server(app)
let fs = require('fs')
let io = require('socket.io')(http)

app.use(express.static('public'))

// returns the file index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})
let users = []
io.on('connection', function (socket) {

  // when the server receives a ype message 'newPseudo', it sends a signal of the same type to all users that a person has joined the chat.
  socket.on('newPseudo', function (pseudo) {
    socket.username = pseudo
    if (pseudo !== undefined) {
      users.push(socket.username)
      io.emit('newPseudo', pseudo)
    }
    for (let i = 0; i < users.length; i++) {
      io.emit('addUserList', users[i])
    }
  })

  // when the server receives a ype 'chat' message, it sends a signal of the same type to all users who will insert the message in the chat.
  socket.on('chat', function (pseudo, message) {
    io.emit('chat', pseudo, message)
  })

  socket.on('disconnect', function () {
    var i = users.indexOf(socket.username)
    users.splice(i, 1)
    socket.broadcast.emit('disc', socket.username)
  })
})

http.listen(8080)
