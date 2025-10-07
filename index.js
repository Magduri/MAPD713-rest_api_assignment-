let SERVER_NAME = 'students-api'
let PORT = 3000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify')


  , studentSave = require('save')('student');
  let courseSave = require('save')('course');
  let assignmentSave = require('save')('assignment');

  
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
    '/course': { 'GET': 0, 'POST': 0, 'DEL': 0 }, 
    '/course/:id': { 'GET': 0, 'DEL': 0},
     '/assignment': { 'GET': 0, 'POST': 0, 'DEL': 0 }, 
    '/assignment/:id': { 'GET': 0, 'DEL': 0},
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
    studentSave.findOne({ _id: req.params.id }, function (error, student) {
     if (error) return next(new Error(JSON.stringify(error.errors)))

        if (student) {
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


//Delete user by id
server.del('/student/:id', function (req, res, next) {
    countingAPI['/student']['DEL'] += 1;

    console.log('POST/student params=>' + JSON.stringify(req.params));
    studentSave.delete(req.params.id, function (error, student) {
        if (error) return next(new Error(JSON.stringify(error.errors))) 
        res.send(204);
    })
})


//create courses
server.post('/course', function (req, res, next) {
    countingAPI['/course']['POST'] += 1;

  console.log('POST /course params=>' + JSON.stringify(req.params));
  console.log('POST /course body=>' + JSON.stringify(req.body));

  if (req.body.courseCode === undefined ) {
    return next(new errors.BadRequestError('courseCode must be supplied'));
  }
  if (req.body.shortDescription === undefined ) {
    return next(new errors.BadRequestError('shortDescription must be supplied'));
  }
  if (req.body.fullDescription === undefined ) {
    return next(new errors.BadRequestError('fullDescription must be supplied'));
  }
 

  let newUser = {
    courseCode: req.body.courseCode,
    shortDescription: req.body.shortDescription,
    fullDescription: req.body.fullDescription,
  }

    courseSave.create( newUser, function (error, course) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(201, course)
    })
})

//get all courses
server.get('/course', function (req, res, next) {
    countingAPI['/course']['GET'] += 1;
  console.log('GET /course params=>' + JSON.stringify(req.params));
    courseSave.find({}, function (error, course) {
        res.send(course);
    })
})

//get course by id
server.get('/course/:id', function (req, res, next) {
  console.log('GET /course/:id params=>' + JSON.stringify(req.params));  
    courseSave.findOne({ _id: req.params.id }, function (error, course) {
     if (error) return next(new Error(JSON.stringify(error.errors)))
        if (course) {
            res.send(course);
        } else {
            res.send(404);
        }
    })
})

//Delete course by id
server.del('/course/:id', function (req, res, next) {
    countingAPI['/course']['DEL'] += 1; 
    console.log('POST/course params=>' + JSON.stringify(req.params));
    courseSave.delete(req.params.id, function (error, course) {

        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(204);
    })
})

//create assignment
server.post('/assignment', function (req, res, next) {
    countingAPI['/assignment']['POST'] += 1;

  console.log('POST /assignment params=>' + JSON.stringify(req.params));
  console.log('POST /assignment body=>' + JSON.stringify(req.body));

  if (req.body.assignmentCode === undefined ) {
    return next(new errors.BadRequestError('assignmentCode must be supplied'));
  }
  if (req.body.courseCode === undefined ) {
    return next(new errors.BadRequestError('courseCode must be supplied'));
  }
  if (req.body.dueDate === undefined ) {
    return next(new errors.BadRequestError('dueDate must be supplied'));
  }
  if (req.body.title === undefined ) {
    return next(new errors.BadRequestError('title must be supplied'));
  }
 

  let newUser = {
    assignmentCode: req.body.assignmentCode,
    courseCode: req.body.courseCode,
    dueDate: req.body.dueDate,
    title: req.body.title,
  }

    assignmentSave.create( newUser, function (error, assignment) {
        if (error) return next(new Error(JSON.stringify(error.errors)))
        res.send(201, assignment)
    })
})

//get all assignment
server.get('/assignment', function (req, res, next) {
    countingAPI['/assignment']['GET'] += 1;
  console.log('GET /assignment params=>' + JSON.stringify(req.params));
    assignmentSave.find({}, function (error, assignment) {
        res.send(assignment);
    })
})

//get assignment by id
server.get('/assignment/:id', function (req, res, next) {
  console.log('GET /assignment/:id params=>' + JSON.stringify(req.params));  
    assignmentSave.findOne({ _id: req.params.id }, function (error, assignment) {
     if (error) return next(new Error(JSON.stringify(error.errors)))
        if (assignment) {
            res.send(assignment);
        } else {
            res.send(404);
        }
    })
})

//Delete assignment by id
server.del('/assignment/:id', function (req, res, next) {
    countingAPI['/assignment']['DEL'] += 1; 
    console.log('POST/assignment params=>' + JSON.stringify(req.params));
    assignmentSave.delete(req.params.id, function (error, assignment) {

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

