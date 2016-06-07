var chai = require('chai')
var chaiHttp = require('chai-http')
var server = require('../server.js')

//  get assertion type to use
var should = chai.should()
//  get app from server.js
var app = server.app
//  get storage object from server.js
var storage = server.storage

//  set up chai to use chai-http plugin for http requests 
chai.use(chaiHttp)

describe('Shopping List', function () {
  //  Test for GET method
  it('should list items on GET', function (done) {
    //  chaihttp request to app
    chai.request(app)
    //  call the GET method from app to the /items endpoint
      .get('/items')
      //  process the end function
      .end(function (err, res) {
        //  should return without error
        should.equal(err, null)
        //  and assert that the method should end with a 200 status
        res.should.have.status(200)
        //  return json
        res.should.be.json
        res.body.should.be.a('array')
        res.body.should.have.length(3)
        res.body[0].should.be.a('object')
        res.body[0].should.have.property('id')
        res.body[0].should.have.property('name')
        res.body[0].id.should.be.a('number')
        res.body[0].name.should.be.a('string')
        res.body[0].name.should.equal('Broad beans')
        res.body[1].name.should.equal('Tomatoes')
        res.body[2].name.should.equal('Peppers')
        //  send done status to mocha
        done()
      })
  })
  //  Test for POST method
  it('should add an item on POST', function (done) {
    chai.request(app)
      .post('/items')
      .send({name: 'Kale'})
      .end(function (err, res) {
        should.equal(err, null)
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('name')
        res.body.should.have.property('id')
        res.body.name.should.be.a('string')
        res.body.id.should.be.a('number')
        res.body.name.should.equal('Kale')
        storage.items.should.be.a('array')
        storage.items.should.have.length(4)
        storage.items[3].should.be.a('object')
        storage.items[3].should.have.property('id')
        storage.items[3].should.have.property('name')
        storage.items[3].id.should.be.a('number')
        storage.items[3].name.should.be.a('string')
        storage.items[3].id.should.equal(3)
        storage.items[3].name.should.equal('Kale')
        done()
      })
  })
  //  PUT method test
  it('should edit an item on PUT', function (done) {
    chai.request(app)
      .put('/items/0')
      .send({ name: 'Apple', id: 0 })
      .end(function (err, res) {
        should.equal(err, null)
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('array')
        res.body.should.have.length(4)
        storage.items.should.be.a('array')
        storage.items[0].name.should.equal('Apple')
        storage.items[3].name.should.equal('Kale')
        done()
      })
  })
  //  DELETE method test
  it('should delete an item on DELETE', function (done) {
    chai.request(app)
      .delete('/items/3')
      .end(function (err, res) {
        should.equal(err, null)
        res.should.have.status(200)
        res.should.be.json
        storage.items.should.have.length(3)
        done()
      })
  })
})
