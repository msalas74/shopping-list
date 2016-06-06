//  shopping list server
var express = require('express')
var bodyParser = require('body-parser')

var Storage = function () {
  this.items = []
  this.id = 0
}

// Add method
Storage.prototype.add = function (name) {
  if (name !== undefined && name !== '') {
    var item = {name: name, id: this.id}
    this.items.push(item)
    this.id += 1
    item = null
    return item
  } else {
    throw {
      name: 'ArgumentError',
      message: 'Argument value must be valid; Class: \"Storage.add\" method'
    }
  }
}

// Delete method
Storage.prototype.delete = function (itemId) {

  if (itemId !== undefined && itemId !== '') {
    //  check to see if the list has only one item left
    if (this.length === 1) {
      this.items = []
      return this.items
    }
    //  look for item to be deleted
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i]['id'].toString() === itemId) {
        this.items.splice(i, 1)
        return this.items
      }
    }
    return null
  } else {
    throw {
      name: 'ArgumentError',
      message: 'Argument value must be valid; Class: \"Storage.delete\" method'
    }
  }
}

//  PUT method
Storage.prototype.put = function (itemId, name) {
  if (itemId !== undefined && itemId !== '' && name !== undefined && name !== '') {
    //  check to see if the list has only one item left
    if (this.length === 1) {
      this.items[0].name = name
      this.items[0].id = itemId
      return this.items
    }
    //  look for item to be deleted
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i]['id'].toString() === itemId) {
        this.items[i].name = name
        this.items[i].id = itemId
        return this.items
      }
    }
    //  create new item if id is not found in list
    var item = {name: name, id: itemId}
    this.items.push(item)
    this.id = itemId
    item = null
    return this.items
  } else {
    throw {
      name: 'ArgumentError',
      message: 'Argument value must be valid; Class: \"Storage.delete\" method'
    }
  }
}

var storage = new Storage()
storage.add('Broad beans')
storage.add('Tomatoes')
storage.add('Peppers')

var app = express()
// set up path for static files to be served
app.use(express.static('public'))
// create a JSON parser
var jsonParser = bodyParser.json()

//  ** Routes **
//  List items endpoint
app.get('/items', function (req, res) {
  res.json(storage.items)
})

//  POST route,  setup Express to use the jsonParser middleware we just created
//  Add item to list endpoint
app.post('/items', jsonParser, function (req, res) {
  if (!req.body) {
    return res.sendStatus(400)
  }

  var item = storage.add(req.body.name)
  res.status(200).json(item)
  item = null
})

//  DELETE
app.delete('/items/:itemId', function (req, res) {
  var itemId = req.params.itemId
  var items = storage.delete(itemId)
  if (items) {
    res.status(200).json(items)
  } else {
    res.status(500).json({error: 'JSONError: Invalid Id or object does not exist.'})
  }
  itemId = null
  items = null
})

//  PUT - edit
app.put('/items/:itemId', jsonParser, function (req, res) {
  if (!req.body) {
    return res.sendStatus(400)
  }
  var name = req.body.name
  var itemId = req.params.itemId
  var items = storage.put(itemId, name)
  if (items) {
    res.status(200).json(items)
  } else {
    res.status(500).json({error: 'JSONError: Invalid Id or object does not exist.'})
  }
  name = null
  itemId = null
  items = null
})

console.log('App started.  Server listening at port 8080')
console.log('Ctrl+C to exit...')
app.listen(process.env.PORT || 8080)
