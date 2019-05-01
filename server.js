var todos = require('./todos.js')
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var port = process.env.PORT || 8080

// get
app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my API!'
  })
})

app.get('/todos', function (request, response) {
  response.json(todos)
})

app.get('/todos/:id', function (request, response) {
  if (!todos[request.params.id]) {
    response.status(404).json({
      error: 'sorry, no such todo item: ' + request.params.id
    })
    return
  }
  response.json(todos[request.params.id])
})

// post
app.post('/todos', function (request, response) {
  var id = request.body.text.trim().toLowerCase().split(' ').join('-')
  todos[id] = {
    text: request.body.text.trim(),
    status: request.body.status.trim()
  }
  response.redirect('/todos/' + id)
})

// delete
app.delete('/todos/:id', function (request, response) {
  if (!todos[request.params.id]) {
    response.status(404).json({
      error: 'sorry, no such todo item: ' + request.params.id
    })
    return
  }
  delete todos[request.params.id]
  response.redirect('/todos')
})

// put: update
app.put('/todos/:id', function (request, response) {
  if (!todos[request.params.id]) {
    response.status(404).json({
      error: 'sorry, no such todo item: ' + request.params.id
    })
    return
  }
  var todo = todos[request.params.id]
  if (request.body.text !== undefined) {
    todo.text = request.body.text.trim()
  }
  if (request.body.status !== undefined) {
    todo.status = request.body.status.trim()
  }
  response.redirect('/todos/' + request.params.id)
})

// 404 message
app.use(function (request, response, next) {
  response.status(404).json({
    error: 'sorry, the link: ' + request.url + ' not found'
  })
})

app.listen(port)
