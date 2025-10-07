let SERVER_NAME = 'user-api'
let PORT = 3000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify')

 // Get a persistence engine for the users
  , usersSave = require('save')('users')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /users')
  console.log(' /users/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());


let countingAPI = {
    '/users': { 'GET': 0, 'POST': 0, 'DEL': 0 }, 
    '/users/:id': { 'GET': 0, 'DEL': 0},
    '/info': { 'GET': 0 }
};

//get all users
server.get('/users', function (req, res, next) {
    countingAPI['/users']['GET'] += 1;

  console.log('GET /users params=>' + JSON.stringify(req.params));
    usersSave.find({}, function (error, users) {
        res.send(users);
    })
})

//get user by id
server.get('/users/:id', function (req, res, next) {
  console.log('GET /users/:id params=>' + JSON.stringify(req.params));  
    usersSave.findOne({ _id: req.params.id }, function (error, user) {
     if (error) return next(new Error(JSON.stringify(error.errors)))

        if (user) {
            res.send(user);
        } else {
            res.send(404);
        }           
    })
})

//create new user
server.post('/users', function (req, res, next) {
    countingAPI['/users']['POST'] += 1;

  console.log('POST /users params=>' + JSON.stringify(req.params));
  console.log('POST /users body=>' + JSON.stringify(req.body));

  if (req.body.studentId === undefined ) {
    return next(new errors.BadRequestError('studentId must be supplied'));
  }
  if (req.body.name === undefined ) {
    return next(new errors.BadRequestError('name must be supplied'));
  }
  if (req.body.address === undefined ) {
    return next(new errors.BadRequestError('address must be supplied'));
  }
  if (req.body.phone === undefined ) {
    return next(new errors.BadRequestError('phone must be supplied'));
  }

  let newUser = {
    studentId: req.body.studentId,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone
  }

    usersSave.create( newUser, function (error, user) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(201, user)
    })
})

//Delete user by id
server.del('/users/:id', function (req, res, next) {
    countingAPI['/users']['DEL'] += 1;

    console.log('POST/user params=>' + JSON.stringify(req.params));
    usersSave.delete(req.params.id, function (error, user) {
        if (error) return next(new Error(JSON.stringify(error.errors))) 
        res.send(204);
    })
})

//Get API info
server.get('/info', function (req, res, next) {
    countingAPI['/info']['GET'] += 1;
    
  console.log('GET / params=>' + JSON.stringify(req.params));

    res.send(200, info);
    return next();
})