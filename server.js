var { Pool } = require('pg')
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var port = process.env.PORT || 8080

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my API!'
  })
})

// get
app.get('/todos', async function (request, response) {
  var client = await pool.connect()
  var result = await client.query('select * from todos')
  response.json(result.rows)
  client.release()
})

app.get('/todos/:id', async function (request, response) {
  var client = await pool.connect()
  var result = await client.query(
    'select * from todos where id = $1',
    [request.params.id]
  )
  if (result.rows.length === 1) {
    response.json(result.rows[0])
  } else {
    response.status(404).json({
      error: 'sorry, no such todo item: ' + request.params.id
    })
  }
  client.release()
})

// post
app.post('/todos', async function (request, response) {
  var text = request.body.text.trim()
  var slug = text.toLowerCase().split(' ').join('-')
  var status = request.body.status.trim()

  var client = await pool.connect()
  var result = await client.query(
    'insert into todos (slug, text, status) values ($1, $2, $3) returning *',
    [slug, text, status]
  )
  response.json(result.rows[0])
  client.release()
})

// delete
app.delete('/todos/:id', async function (request, response) {
  var client = await pool.connect()
  var result = await client.query(
    'select * from todos where id = $1',
    [request.params.id]
  )
  if (result.rows.length > 0) {
    await client.query(
      'delete from todos where id = $1',
      [request.params.id]
    )
    response.redirect('/todos')
  } else {
    response.status(404).json({
      error: 'sorry, no such todo item: ' + request.params.id
    })
  }
  client.release()
})

// put: update
app.put('/todos/:id', async function (request, response) {
  if (
    request.body.text === undefined ||
    request.body.status === undefined
  ) {
    response.status(404).json({
      error: 'text and status are required'
    })
    return
  }

  var text = request.body.text.trim()
  var slug = text.toLowerCase().split(' ').join('-')
  var status = request.body.status.trim()

  var client = await pool.connect()
  var result = await client.query(
    'update todos set slug = $1, text = $2, status = $3 where id = $4 returning *',
    [slug, text, status, request.params.id]
  )
  if (result.rows.length === 1) {
    response.json(result.rows[0])
  } else {
    response.status(404).json({
      error: 'sorry, no such todo item: ' + request.params.id
    })
  }
  client.release()
})

// 404 message
app.use(function (request, response, next) {
  response.status(404).json({
    error: 'sorry, the link: ' + request.url + ' not found'
  })
})

app.listen(port)
