let SERVER_NAME = 'students-api'
let PORT = 3000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify')


  , studentSave = require('save')('student');
 // , coursesSave = require('save')('courses');

  
  let server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /student')
  console.log(' /student/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());



let countingAPI = {
    '/student': { 'GET': 0, 'POST': 0, 'DEL': 0 }, 
    '/student/:id': { 'GET': 0, 'DEL': 0},
    '/info': { 'GET': 0 }
};

//get all students
server.get('/student', function (req, res, next) {
    countingAPI['/student']['GET'] += 1;

  console.log('GET /student params=>' + JSON.stringify(req.params));
    studentSave.find({}, function (error, student) {
        res.send(student);
    })
})

//get user by id
server.get('/student/:id', function (req, res, next) {
  console.log('GET /student/:id params=>' + JSON.stringify(req.params));  
    usersSave.findOne({ _id: req.params.id }, function (error, student) {
     if (error) return next(new Error(JSON.stringify(error.errors)))

        if (user) {
            res.send(student);
        } else {
            res.send(404);
        }           
    })
})

//create new student user
server.post('/student', function (req, res, next) {
    countingAPI['/student']['POST'] += 1;

  console.log('POST /student params=>' + JSON.stringify(req.params));
  console.log('POST /student body=>' + JSON.stringify(req.body));

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

  studentSave.create( newUser, function (error, student) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(201, student)
    })
})

// //create new user for courses
// server.post('/users', function (req, res, next) {
//     countingAPI['/users']['POST'] += 1;

//   console.log('POST /users params=>' + JSON.stringify(req.params));
//   console.log('POST /users body=>' + JSON.stringify(req.body));

//   if (req.body.courseCode === undefined ) {
//     return next(new errors.BadRequestError('courseCode must be supplied'));
//   }
//   if (req.body.shortDescription === undefined ) {
//     return next(new errors.BadRequestError('shortDescription must be supplied'));
//   }
//   if (req.body.fullDescription === undefined ) {
//     return next(new errors.BadRequestError('fullDescription must be supplied'));
//   }
 

//   let newUser = {
//     courseCode: req.body.courseCode,
//     shortDescription: req.body.shortDescription,
//     fullDescription: req.body.fullDescription,
//   }

//     usersSave.create( newUser, function (error, user) {
//         if (error) return next(new Error(JSON.stringify(error.errors)))
//         res.send(201, user)
//     })
// })


//Delete user by id
server.del('/student/:id', function (req, res, next) {
    countingAPI['/student']['DEL'] += 1;

    console.log('POST/student params=>' + JSON.stringify(req.params));
    usersSave.delete(req.params.id, function (error, student) {
        if (error) return next(new Error(JSON.stringify(error.errors))) 
        res.send(204);
    })
})

//Get API info
server.get('/info', function (req, res, next) {
    countingAPI['/info']['GET'] += 1;

    let info = {
    //name: SERVER_NAME,
    //port: PORT,
    //host: HOST,
    //status: 'Running',
    usage: countingAPI 
}; 

    
  console.log('GET / params=>' + JSON.stringify(req.params));

    res.send(200, info);
    return next();
})

