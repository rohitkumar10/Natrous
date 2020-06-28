Node.js
install node.js  node --version

Type node in terminal that open REPL Read-Eval-Print-Loop for writing javascript code in terminal
Type file_name.js in terminal for running node.js file with relative location

fs :- file system
const fs = require('fs')

Synchronous
const textIn = fs.readFileSync('file_name', 'utf-8');   // textIn - var_name
console.log(textIn);

const textOut = `${textIn} some_text`;             // textOut - var_name
fs.writeFileSync('file_name', textOut);             // file_name eg. Code.txt

Asynchronous
fs.readFile('file_name', 'utf-8', (err, data) => {       // (err, data) => {} - callback func
   if(err) return console.log('Error');
   console.log(data);
   
   fs.writeFile('file_name', `some_text ${data} some_text`, 'utf-8', err => {
       if(err) return console.log('Error');
       console.log('Saved');
       
       // if more fs.write comes here it leads to call back hell 
   })
})

//fs.writeFile('file_name', `some_text ${data} some_text`, 'utf-8', err => {
//    if(err) return console.log('Error');
//    console.log(Saved');
//})                                              

http :- gives us networking capability such as building http server
const http = require('http')

const server = http.createServer((req, res) => {        // (request, response)
    console.log(req)                // request object 
    res.end('Hello');    // simplest way of sending back response to browser
})

server.listen(8000, '127.0.0.1', () => {   // server.listen() starts the server
console.log('Listening to requests on port 8000');              
})                // 8000 - sub-address in certain host, 127.0.0.1 - localhost


url 
Routing means implementing different urls
const url = require('url');

const server = http.createServer((req, res) => {
    const pathName = req.url;          // req.url returns last part of url
    if(pathName === '/url_that_want_to_compare'){
        res.end();
    } else{
        res.writeHead(404, {
            'Content-type': 'text/html',      // text/html as we use html in res.end()
            'my-own-header': 'Kido'        
                    // see my-own-header in inspect->network->response header
        });
        // res.write('Hello World');
        res.end('<h1>  </h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {   // server.listen() starts the server
    console.log('Listening to requests on port 8000');              
})

api :- Application Programming Interface
const server = http.createServer((req, res) => {
    const pathName = req.url;
    if(pathName === './api'){
        fs.readFile(`${__dirname}/file_path/file_name.json`, 'utf-8', (err, data) => {
            const prodData = JSON.parse(data);
            // console.log(prodData);
            res.writeHead(200, {
                'content-type': 'application/json'
            })
            res.end(data);
        })
    }
})

// if file has to execute only once after start of program then we can use fs outside
// server and also use Sync read
// const data = fs.readFileSync(`${__dirname}/file_path/file_name.json`, 'utf-8');
// const prodData = JSON.parse(data);     // convert json to javaScript object

// const {query, pathname } = url.parse(req.url, true);  // for parsing url to object
// query has data after ? eg. id = 0 and pathname has last part of url eg. /product

npm :- node package manager
run npm init in terminal for downloading package.json at starting of project
node_modules and package-lock.json is downloaded when a dependency is downloaded 

Two types of dependencies - simple dependencies and development dependencies
npm install slugify --save or npm install slugify :- slugify will be added in dependencies in package.json file
Slugify is used to create a function called slug which is last part of url that contain unique string that identifies the resource thet website is displaying
npm install nodemon --save -dev :- nodemon will be added in devDependencies

npm outdated :- for checking which packages are outdated
npm install :- reinstall node_modules after delete





EVENT-DRIVEN ARCHITECTURE

     OBSERVER PATTERN
________________________________
|                                     |
Event Emitter ----------------> Event Listener ------------------> Attached callback function
             Emit events                  Calls

Most of node core modules eg. Fs, http, timer are built around event-driven architecture

Object called event emitter that emits named event as soon as something important happens in the app like requests hitting server or a timer expiring or a file finishing to read, these events are then picked up by event listeners that we developers set up which will fire callback functions that are attached to each listeners.

On one hand we have event emitters and on the other hand event listeners, it will react to emit events by calling callback functions.

How node use event-driven architecture to handle server requests in the http module ?
Let server running and a request is made, the server acts as a emitter and automatically emit an event called request each time that a request hit the server.Since we already have a listener setup for this exact event, the callback function that we attach with this listener will automatically be called that simply send data back to client.
This works the same way because behind the scenes the server is actually a instance of node.js event emitter class so it inherit all the emitting and listening logic from that emitter class.

const EventEmitter = require("events");
//const fEmitter = new EventEmitter();
class Class_name extends EventEmitter{
   Constructor(){
      Super();
}
} 
const fEmitter = new Class_name();

fEmitter.on("str", () => {
   console.log("");
})

fEmitter.on("str", () => {
   console.log("");
})

fEmitter.on("str", argument => {
   console.log("");
})
fEmitter.emit("str", );


const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
console.log('Request received')
res.end('Request received')
})
// When we want to create a server we create and store it in server variable
// server.on is how we actually create a listener and in this case for request event 
// We can set multiple listeners for the same event

server.on('request', (req, res) => {
    console.log('Another request');        // We can send only one response
})

server.on('close', () => {
   console.log('Server closed');
})

server.listen(8000, '127.0.0.1', () => {
   console.log('Waiting for requests');
})
// Browser automatically try to request a favicon for each website so two extra output

Stream
Loading a very very big file

const server = require('http').createServer();
server.on('request', (req, res) => {
    fs.readFile('fnwe', (err,data) => {        // fnwe - file_name_with_extension
        if(err) console.log(err);
        res.end(data);
    });
    // In this method node has to actually load entire data and then only it sends
    // this takes a lot of time when file is very very big
})

Solution of this is we first load a piece of file and as soon as it is available we send it right to the client using the write method
server.on('request', (req, res) => {
    const readable = fs.createReadStream('fnwe')
    readable.on('data', chunk => {
        res.write(chunk);
    });
    readable.on('end', () =>{
        res.end();
    })
    readable.on('error', err => {
        console.log(err);
        res.statusCode = 500;
        res.end('File not found!');
    })
})

But in this method back crasher becomes the problem, back crasher - when the response does not sends data as fast as it is receiving
Solution to back crasher is pipe
const readable = fs.createReadStream('');
readable.pipe(res);
// readableSource.pipe(writeableDest)             // Dest - Destination
// Pipe allows the output of a readable stream to input of a writable stream

Express :- It is minimal node.js framework, a higher level of abstraction
npm i express

const express = require('express');

const app = express();            // add a bunch of methods
const port = 3000;

app.get('/url', (req, res) => {        // get - http method that we want to respond
   res.send();                   // or res.status(statusCode).send();
})

app.listen(port, () => {            // for starting server
   console.log(`App is running on port: ${port} … `);
})

// res.status(statusCode).json({          // eg. statusCode - 200
//    status: 'success',
//    data: 
// });

                   http methods
add new or create     POST             Create
get                  GET               Read 
update              PUT / PATCH       Update
delete                DELETE          Delete      CRUD Operations

// api get
// const jSO = JSON.parse(fs.readFileSync(`${__dirname}/`,'utf-8'));
// app.get('/', () =>{
//   res.status(200).json({
//     status: 'success',
//     data: jSO
//   })
// })

// api post
// app.use(express.json());    // middleware
// app.post('/', (req, res) => {
//    console.log(req.body);
//    res.send();
// })

Middleware is a function that modify the incoming data as it stands in the middle of accept and send data

// api post
// app.post('/', (req, res) => {
//   const newId = jSO[ jSO.length -1 ].id +1;   
//    const jSO2 = Object.assign({ id: newId }, req.body );
//    jSO.push(jSO2);
//    fs.writeFile(`${__dirname}/`, JSON.stringify(jSO), err => {
//        res.status(201).json({
//            data: jSO2
//        })
//    })
// })

Object.assign allows to create a new object by merging to existing object together
We are inside event loop so,we are never going to block event loop so use fs.writeFile

Params :- parameters that are stored

// api get only one whose id matched
// app.get('/…/:id', (req, res) => {
//     //console.log(req.params);
//     const id = req.params.id *1;           // id changed to integer
//     const jSO3 = jSO.find(el => el.id === id);
//     // if(id>jSO.length){
//     if(!jSO3){
//         return res.status(404).json({
//             status:'fail',
//             message: ''
//         })
//     }
//     res.status(200).json({
//         status:'',
//         data:{
//             jSO3
//         }
//     })
// })
?:id/:x/:y can give three parameters
?:id/:x/:y? y becomes optional

// api patch
// app.patcht('/…/:id', (req, res) => {
//     //console.log(req.params);
//     if(req.params.id > tours.length){
//         return res.status(404).json({
//             status:'fail',
//             message: ''
//         })
//     }
//     res.status(200).json({
//         status:'',
//         data:{
//             jSO3:'<Updated …>'
//         }
//     })
// })

// api delete
// app.delete('/…/:id', (req, res) => {
//     //console.log(req.params);
//     if(req.params.id > tours.length){
//         return res.status(404).json({
//             status:'fail',
//             message: ''
//         })
//     }
//     res.status(200).json({
//         status:'',
//         data:null
//     })
// })

// app.get('/url1', getAll);
// app.post('/url', createOne);
// app.get('/url2/:parameter1', getOne);             //eg. Parameter - id
// app.patch('/url2/:parameter1/:parameter2', updateOne);
// app.delete('/url2/:parameter1', deleteOne);
PUT update whole data set while PATCH update only one

app.route('/url1').get(getAll).post(createOne);
app.route('/url2/:parameter1').get(getOne).patch(updateOne).delete(deleteOne);

route are also middlewares which are only applicable to certain routes

// const fRouter = express.Router();
// fRouter.route('/').get(getAll).post(createOne);
// fRouter.route('/:parameter1').get(getOne).patch(updateOne).delete(deleteOne);
// app.use('/url1', fRouter);

Separate Routers in one folder and controllers in one folder for easy maintainence and make a server.js file for placing all server stuff in one file
Never call next() of middleware after rending response

eg. middleware app.use((req,res,next)=>{           // express middleware
// console.log(' ');
next();
})

Param middleware eg. Router.param('parameter', (req,res,val,next)=>{
    contents …
next();
})
If no next then the response cycle get stuck in the middleware function and it is not going to move to the next middleware

// app.use(express.static(`${__dirname}/path`));   - for using html files





MongoDB :- noSQL database
database  >  collection  >  documents
              (Tables)       (Rows)
install mongodb and gui and add path of bin to path

show dbs :- for showing all databases
show collections :- for showing all collections

use database_name :- create database and switch to it
db - database_name, coll - collection_name
db.coll.insertOne({ }) :- for inserting one
db.coll.insertMany({ }, { }) :- for inserting many
db.coll.find() :- for showing all documents
db.coll.find({ }) :- for searching           

eg. db.coll.find({age:21})
eg. db.coll.find({age: {$lte: 25}}, {price:{$gte:500}})     
eg. db.coll.find({$or:[{price:{$gte:500}}, {age:{$lte:25}}]}) :- or
eg. db.coll.find({$or:[{price:{$gte:500}}, {age:{$lte:25}}]}, {name:1}) - only name to display 
lte - less than or equal, gte - greater than or equal, lt - less than, gt - greater than

db.coll.updateOne({ }, {$set:{}}) :- for updating
db.coll.deleteOne({ }) :- for deleting

MongoDB gui -> click on connect for local database all the things are previsiously set up, while running mongodb gui run mongo on terminal

Local database
mongodb  ->  cloud  ->  mongodb atlas
Click start free

New project  ->  name  ->  create project

Build a cluster  ->   choose options  ->  create cluster

Connect  ->  add current ip address  ->  user name & password(may be auto generated)  ->  create mongodb User  ->  choose a connection method

Connect with mongodb compass  ->  I have a compass  ->  copy the connection string  ->  open mongodb compass  ->  paste connection string ( replace <password> with the password provided)  ->  connect
You are connected

DATABASE_LOCAL=mongodb://localhost:27017/database_name

Cloud database
Connect  ->  connect your application  ->  I have mongodb compass  ->  copy connection string  ->  use it in config.env file
Also use password in config.env file

Mongodb  ->  docs  ->  server(database)  ->  mongodb manual



Mongoose Library :- ODM (Object Data Modelling) library for mongodb
npm i mongoose
const mongoose = require('mongoose')
 
npm install dotenv
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

in server.js
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
 
mongoose.connect(DB, {       // replace DB with process.env.DATABASE_LOCAL // for local database 
   useNewUrlParser: true,
useCreateIndex: true, 
useFindAndModify: false,
useUnifiedTopology: true
}).then(() => {
   console.log('DB connection successful !');
})

Model is like a blueprint that we use to create a document

const fSchema = new mongoose.Schema({
field1: {
   type: String,
   required: [true, 'error_message (if any leave it blank)' ]
   unique: true,
   trim: true,
   maxlength: [true, 'error'],
   minlength: [ ]
//  Eg. set: val => Math.round(val * 10) /10
},
field2:{
    default: val,                //eg. default: 4.5, val - value
    enum: {
    values:['','',''],
    message: ''
},
}
});
const var_name = mongoose.model('coll', fSchema);

const input1 = var_name({
   
})

input1.save()
.then(()=>{})
.catch(err=>{});











MVC Architecture (Model-View-Controller)

Blank

create models folder 
place schema there and export it and call it in controller

createOne
exports.createOne = async (req,res)=>{
    try{
        const input = await coll.create(req.body);
        res.status(201).json({
            status: 'success',
            data:{
                var_name: input
            }
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:'Invalid data sent !'       // message: err
        })
    }
}

getAll
async (req, res)=>{
    try{
        const out = await Tour.find();
        res.status(201).json({
            status: 'success',
            results: out.length,
            data:{
                out
            }
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:err
        })
}
}

getOne
async (req,res)=>{
    try{
        const out = await jSO4.findById(req.params.id);
        res.status(201).json({
            status: 'success',
            data:{
                out
            }
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

updateOne
async (req,res)=>{
    try{
        const updateOne = await jSO4.findByIdAndUpdate(req.param.id, req.body,{
            new: true,          // to return only the updated one
            runValidators: true
        });
        res.status(201).json({
            status: 'success',
            data:{
                Doc: updateOne
            }
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:'Invalid data sent !'
        })
}
}

deleteOne
async (req,res)=>{
    try{
        const deleteOne = await jSO4.findByIdAndDelete(req.param.id);
        res.status(201).json({
            status: 'success',
            data:null
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:'Invalid data sent !'
        })
}
}

Import data from a file
Const jSO5 = require()      // model
Load mongoose database setup 
const input = JSON.parse(fs.readFileSync(`${__dirname}/file_name.json`,'utf-8'));

const importData = async () =>{
    try{
        await jSO5.create(input);
        console.log('Data successfully loaded')
    } catch (err){
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    importData();
}  // process.exit()\
In terminal node file_name_with full_path --import        // argv[2]=--import

Query string, url?key=value&key=value
in postman / in url and key, value in params
Two ways of filtering of api or database
1)mongodb method
eg. const out = await jSO4.find({duration:5,difficulty:'easy'})

2)mongoose method
eg. const out = await jSO4.find()
.where('duration')
.equals(5)
.where('difficulty')
.equals('easy');

We use first method because we have a object that looks like first that is req.query

getAll
exports.getAll = async (req, res)=>{
    try{
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el=>delete queryObj[el]);

        const query = jSO4.find(queryObj);
        const out = await query;
        res.status(201).json({
            status: 'success',
            results: jSO4.length,
            data:{
                out
            }
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

eg. req.query returns gte:'5' where $ is missing as in mongodb so advance filtering is required

exports.getAll = async (req, res)=>{
    try{
        const queryObj = {...req.query};
const excludedFields = ['page', 'sort', 'limit', 'fields'];
excludedFields.forEach(el=>delete queryObj[el]);
// const query = jSO4.find(queryObj);

let queryStr = JSON.stringify(queryObj);
queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
const query = Tour.find(JSON.parse(queryStr));
const out = await query;

        res.status(201).json({
            status: 'success',
            results: jSO4.length,
            data:{
                out
            }
        })
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}
 
Change const query to let query
if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
} else{
    query = query.sort('-createdAt');
}

For selecting certain field name query.select(field1 field2 …)
Change in schema to select:false by default all fields has select: true value by select:false it will not be shown to the client

if(req.query.fields){
   const fields = req.query.fields.split(',').join(' ');
   query = query.select(fields);
}else{
   query = query.select('-__v');
}

Default Pagination
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 100;
const skip = (page - 1) * limit;
query = query.skip(skip).limit(limit);

Set pagination
if(req.query.page){
   const numTours = await Tour.countDocuments();
   if(skip > numTours) throw new Error('This page does not exist');// go in catch block
}

// query.sort().select().skip(). …

Alias for better output of thier requests
router.route('/url3').get(file_name.middleware_function_name, file_name.getAllDoc);            // fille_name - file in which middleware is present

// aliasFun - middleware_function_name
eg. exports.aliasFun = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next();
}

Separate all filters 
class APIFeatures {
  constructor(query, queryString) {        (query Object, query String)
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;

const features = new APIFeatures(jSO4.find(), req.query)
.filter()
.sort()
.limitFields()
.paginate();
const out = await features.query;
Creating an instance of APIFeatures that will then get stored into features and features get all the access to the methods that we define in the class

Aggregation pipeline - matchng grouping
exports.getjSO4Stats = async (req, res) => {
    try{
        const stats = await jSO4.aggregate([
            {
                $match: {ratingsAverage : {$gte : 4.5} }
            },
            {
                $group:{
                    _id: null,
                    num: { $sum: 1},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data:stats
        })
    } catch (err){
        console.log(err);
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}
Router.route('url4').get();
Document pass through these stages one by one step by step in the defined sequence as we define
First - what we want to group by      eg. _id: { $toUpper: { '$difficulty' }
Can also repeat match

Aggregation pipeline - unwinding and projecting
Blank

Virtual properties
Add fSchema toJSON :{ vitual : true},
            toObject: {virtual: true}       // object is outputted

fSchema.virtual('name_of_virtual_property').get(function(){
    return this.field operator;            // eg. this.durationWeeks/7 
})

Mongoose middleware
pre run before .save() and .create() but not insertMany like functions
Can have multiple pre hook or pre save middleware
fSchema.pre('save', function(next) {
    eg. this.slug = slugify(this.name, {lower:true});
    next();
})
this - points to currently processed document
We can act on data before it save to the document
Slug is basically a string that we put in the url usually based on string like name

fSchema.post('save', function(doc, next) {
    console.log(doc);
    next();
}) // post has no longer this 

Query middleware
fSchema.pre(/^find/,function(next){
eg. this.find({secretTour:{$ne: true } });
Eg.this.start = Date.now();
next();
})

fSchema.post(/^find/, function(doc, next){
   Eg. Console.log(`${ Date.now() - this.start}`);
   next();
})

fSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretjSO4: { $ne: true } } });

  console.log(this.pipeline());     // here is whole aggregate function
  next();
});

Validation
npm i validator
const validator = require('validator')
const fSchema = new mongoose.Schema({
field2:{
    default: val,                //eg. default: 4.5, val - value
validate:{
    validator: function(val) {
    Eg. return val < this.price
},
message: ''
}
}
});

ndb :- node debugger
npm i ndb --globally      scripts  "debug": "ndb server.js"   npm run debug
Or npm i ndb --save-dev
Use break point for debugging

For unknown or wrong urls
app.all('*', (req, res, next) => {     // all for each get, post and other http methods
  res.status(404).json({
    status:'fail',
    message: `cant find ${req.originalUrl} on this server`
  })
})

Global error handling middleware
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message: `cant find ${req.originalUrl} on this server`
  // })
  const err = new Error(`cant find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
})

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})
next() - if any parameter is passed in next, then express assumes it as error when it is called then it skips all other middleware in stack and directly go to required middleware

Now separate it into utils folder by creating appError.js file
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError
Err.stack - shows where the error happens

And create errorController.js
module.exports = ((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
})
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message: `cant find ${req.originalUrl} on this server`
  // })
  // const err = new Error(`cant find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500
//   err.status = err.status || 'error'
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   })
// })
app.use(globalErrorHandler)

Create catchAsync function for handling catch in one file and separate it in utils catchAsync file

const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
module.exports = fn …

exports.getAllTours = catchAsync( async (req, res)=>{
    //try{
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        const tours = await features.query;
        res.status(201).json({
            status: 'success',
            results: tours.length,
            data:{
                tours
            }
        })
     // } catch (err){
    //     console.log(err);
    //     res.status(404).json({
    //         status:'fail',
    //         message:err
    //     })
    // }
})
Like this remove all try and catch 

Do not put catchAsync function in route as you have to check which is async function

Put this in getOne, updateOne
if(!tour){
   next(new AppError('No tour found with that id', 404));
}
Jump directly in global error handling middleware

In production error should be less so thst a regular person understand it while in development we want all errors so that we fix it
errorController
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
  
      // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error('ERROR', err);
  
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = ((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, res);
    }
})

Rest error handling
const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

else if (process.env.NODE_ENV === 'production') {
   let error = { ...err };

   if (error.name === 'CastError') error = handleCastErrorDB(error);
   if (error.code === 11000) error = handleDuplicateFieldsDB(error);
   if (error.name === 'ValidationError')
   error = handleValidationErrorDB(error);

   sendErrorProd(error, res);
}


const server = app.listen(process.env.PORT, ()=>{
    console.log(`App is running on port: ${process.env.PORT} ...`);
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})               //if mongodb server is down or unknown error by a programmer cental place like this which handle all promise exception

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

Create user Schema and export it
sSchema = mongoose.Schema({
email:{
   type: String,
   validate: [validator.isEmail, ' ']
}
})

In authController
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')

exports.signup = catchAsync( async (req, res, next) => {
//const newUser = await User.create(req.body);   // with this anybody can assign 
                                            // himself as admin
const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
})
    res.status(200).json({
        status: 'success',
        data:{
            newUser
        }
    })
})
router.post('/signup', authController.signup);

Encryption should be done in model, it has to do with the data
For password confirm
passwordConfirm:{
        type: String,
        required:[true, 'Please confirm your password'],
        validate:{
            // This only works on save
            validator: function(el) {
                return el === this.password
            }, message: 'Passwods are not same'
        }
    }
Write validate in schema
npm i bcryptjs       const bcrypt = require('bcryptjs')
For password encryption
userSchema.pre('save', async function(next){
    if(! this.isModified('password')) return next;
    this.password = await bcrypt.hash(this.password, 8);
    this.passwordConfirm = undefined;
    next();
})

npm i jsonwebtoken         const jwt = require('jsonwebtoken')
exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(200).json({
        status: 'success',
        token,
        data:{
            newUser
        }
    })
})
JWT_SECRET must be different in different application, 32 characters long
JWT_EXPIRES_IN=90d (days) or 90h (hours) or 90m (minutes) or 90s (seconds)
Header is easily decodable, it is due to secret it is not verified showing  jwt.io

In authController
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        return next(new AppError('Please provide email and password !', 400))
    }

    const user = User.findOne({ email }).select('+password');
    if(! user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
}

userModel
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
} 
userSchema.methods.correctPassword is an instane method available on all the documents of a certain collection
In schema set password select: false

In postman in headers
Key: Authorizaton, value:Bearer token it s accessed by req.headers
req.headers.authorizaton
//console.log(req.headers)

Only logged in user can see tours 
exports.protect = catchAsync( async(req, res, next) => {
let token;
// 1) Getting token and check of it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get secret access', 401));
    }
     // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user with ths token no longer exist', 401));
    }
    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed the password Please log in again',401))
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

In userModel
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
}

pm.environment.set("jwt",pm.response.json().token) - set {{jwt} which can be use in authorization -> bearer token -> {{jwt}} value in postman

Update schema - role:{ type: String, enum: [' ',' ', …], default:' ' }
Eg. router.route(/:id).delete(authController.protect, authController.restrictTo('admin','lead-guide', tourController.deleteTour);

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        return next();
    }
}

Email
npm i nodemailer          const nodemailer = require('nodemailer')
Node does not email itself, a service like gmail sends email
Use mailtrap for sending and seeing email for development only
In schema add passwordResetToken: String, passwordResetExpires: Date
In utils -> email.js
const sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions = {
        from: 'Rohit <rohitkumar25859@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html: 
    }
    await transporter.sendMail(mailOptions);
} 
module.exports = sendEmail

In userModel
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
// 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('There is no user with this email', 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'Token send to email'
        })
    } catch(err){
        //console.log(err)
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error while sending the email. Try again later', 500));
    }
})

Reset password
userSchema.pre('save', function(next){
    if(!this.isModified('password') || !isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

exports.resetPassword = catchAsync( async (req, res, next) => {
// 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()} })
// 2) If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or expired!', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

updateMe
const filterObj = (obj, ...allowedFields) =>{
    const newObj = {};
    Object.keys(obj).forEach( el => {
      if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.updateMe = catchAsync( async(req, res, next) => {
    if(req.body.password || req.body.passwordConfirm){
      return next(new AppError('This route is not for password update', 400));
    }
    const filterBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    })
})

In userSchema
active: { type: Boolean, default: true, select: false } if user delete its id then make Boolean false 

deleteMe
userSchema.pre(/^find/, function(next){
    this.find({ ative: {$ne: false}});
    next();
})

exports.deleteMe = catchAsync( async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(200).json({
    status: 'success',
    data: null
  })
})

JWT_COOKIE_EXPIRES_IN=90
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 * 60 * 60 * 1000),
        httpOnly: true 
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure= true
res.cookie('jwt', token, cookieOptions);
user.password=undefined            // Remove password from output
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

Implement Rate limiting in order to prevent the same ip from making too many requests to our api
npm i express-rate-limit       const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip, Please try again in an hour'
})
app.use('/api', limiter);

npm i helmet          const helmet = require('helmet')
Use app.use(helmet()) at above a]of all middleware
Can also use app.use(express,json({limit: '10kb' })) - if body use larger than 10 kb then it will not be accepted

npm i express-mongo-sanitize    const mongoSanitize = require('express-mongo-sanitize')      app.use(mongoSanitize()) - data sanitization against NoSQL query injection

npm i xss-clean    const xss = require('xss-clean')  app.use(xss()) - data sanitization against xss

npm i hpp   const hpp = require('hpp')  app.use(hpp({whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'] })) - prevent parameter pollution




Data modelling - It is a process of taking unstructured data generated by a real world scenario and then structure it into a logical data model in a database(by a set of criteria)

Mongodb supports geospatial data. Geospatial data is basially data that desribes plaes on earth using longitude and latitude coordinates
In tour Schema add 
startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations:[
      {
        type: {
          type: String, 
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ]

Embedding user documents in tour douments, when we reate a new tour the user will simply add user id and then we get corresponding user documents based on these ids and add them in our tour documents, in other words embed them in tours
Add guides: Array
tourSchema.pre('save', async function(next){
  const guidesPromises = this.guides.map( async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
})

Now we reference instead of embedding, we expect type of each element in the guides array to be mongodb id
Replace guides in tour Schema
guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'         // ref - reference
      }
]
In exports.getTour         populating data
const tour = await Tour.findById(req.params.id).populate({  
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });         // .populate('guides')

const tour = await Tour.findById(req.params.id)
tourSchema.pre(/^find/, function(next){
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })
  next();
})

Virtual populate - with virtual populate we can actually populate the tour with reviews, in other words we can get access to all the reviews for a certain tour but without keeping these array of ids on the tour
reviewModel
reviewSchema.pre(/^find/, function(next) {
    this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
        pth: 'user',
        select: 'name photo'
    })
    next();
})

tourModel
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

tourController   ->  getTour
const tour = await Tour.findById(req.params.id).populate('reviews')

Implementing nested routes
exports.createReview = catchAsync( async(req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    const newReview = await Review.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
})

router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
Instead of nested routes use this
In reviewRouter
router.use('/:tourId/reviews', reviewRouter)
When tour router finds url like /:tourId/reviews then use reviewRouter

const router = express.Router({mergeParams: true}); - access to the parameters of the specific routes

Only tours for given tourId
exports.getAllReviews = catchAsync( async (req, res, next) => {
    let filter={};
    if(req.params.tourId) filter = { tour: req.params.tourId}; 

    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data:{
            reviews
        }
    })
})

handlerFactory
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.deleteOne = Model => catchAsync( async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
        
    }
    res.status(200).json({
        status: 'success',
        data: null 
    })
})

In other Controllers import factory and use
eg. exports.deleteUser = factory.deleteOne(User) 

For update and create
exports.updateOne = Model => catchAsync( async(req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.param.id, req.body,{
        new: true,
        runValidators: true
    });

    if(!doc){
        next(new AppError('No document found with that id', 404));
    }

    res.status(201).json({
        status: 'success',
        data:{
            data: doc
        }
    })
})

exports.createOne = Model => catchAsync( async(req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data:{
            data: doc
        }
    })
})

Add another middleware in create review for setting user and tour ids
exports.setTourUserIds = (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined Please use /signup instead'
  })
}

GetAll and getOne
exports.getOne = (Model, popOptions) => exports.getTour = catchAsync( async (req,res)=>{
    let query = Model.findById(req.params.id);
    if(popOptions) query.populate(popOptions);
    const doc = await query;
    // const tour = await Tour.findById(req.params.id).populate('reviews')
    if(!tour){
        next(new AppError('No tour found with that id', 404));
    }
    res.status(201).json({
        status: 'success',
        data:{
            tour
        }
    })
})

exports.getAll = Model => catchAsync( async (req, res)=>{
    let filter={};
    if(req.params.tourId) filter = { tour: req.params.tourId};

    const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const doc = await features.query;
    res.status(201).json({
        status: 'success',
        results: doc.length,
        data:{
            doc
        }
    })
})

Middleware for using /me url
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

Restrict certain people to access all by using router.use()
router.use(authController.protect) - because middleware run in sequence

Turn off validate and remove save document middleware if you use if loading data from to api / database 
{ validateBeforeSave: false}

Also use query.explain
We can set our own indexes on fields that we query frequently
fSchema.index({field: true})

Statics method
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1},
                avgRating: { $avg: '$rating'}
            }
        }
    ])
    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity:stats[0].nRating,
            ratingsAverage: stats[0].avgRating 
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

reviewSchema.post('save', function(){
    this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function(){
    this.r.constructor.calcAverageRatings(this.r.tour);
})
findByIdAnd is a shorthand of findOneAnd

reviewSchema.index({ tour: 1, user: 1}, { unique: true}) - this achieves that one user has one review on one tour

Geospatial operator
router.route('/tours-wihtin/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)

tourSchema({ startLocation: startLocation: '2dsphere' })

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance/3963.2 : distance / 6378.1
    if(!lat || !lng){
        return next(new AppError('Please provide latitude and longitude in the format lat, lng', 400));
    }
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}
    })
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data:{
            data: tours
        }
    })
})

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

Remove this middleware
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });















Server side rendering with pug template  
PUG - template engine
npm i pug
app.set('view engine', 'pug') in app.js in above
const path = require('path')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.status(200).render('base');
})
And run in browser 127.0.0.1:3000
In views -> base.pug
h1 Kido in pug is same as <h1> Kido </h1>

Basic pug
doctype html
html
 head
  title Natrous | #{tour}         // #{tour} - javaScript not used title= because it thinks
                             // whole is javaScript
  link(rel='stylesheet' href='css/styles.css')
  link(rel='shortcut icon' type='image/png' href='/img/favicon.png')
  
 body
  h1= tour
  h2= user.toUpperCase()
  - const x = 5             // javaScript
  h3= x

app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'Darjeeling',
    user: 'Kido'
  });
})

Download pug beautify in vsCode   ctrl+p > pug beautify after select contents

app.use('/', viewRouter);

const express = require('express')
const viewController = require('./../controllers/viewController')

const router = express.Router();

router.get('/overview', viewController.getOverview);
router.get('/tour', viewController.getTour);

module.exports = router

exports.getOverview = (req, res) => {
    res.status(200).render('overview', {
        title: 'All tours'
    })
}

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'Darjeeling'
    })
}

Now pug pages
Base.pug
doctype html
html
  head
    block head
      meta(charset='UTF-8')
      meta(name='viewport' content='width=device-width, initial-scale=1.0')
      link(rel='stylesheet' href='/css/style.css')
      link(rel='shortcut icon' type='image/png' href='/img/favicon.png')
      link(rel='stylesheet' href='https://fonts.googleapis.com/css?family=Lato:300,300i,700')
      title Natours | #{title}
  
  body
    // HEADER
    include _header
        
    // CONTENT
    block content
      h1 This is a placeholder heading
      
    // FOOTER
    include _footer
    
Overview.pug
extends base

block content
  main.main
    .card-container
    
      each tour in tours
        .card
          .card__header
            .card__picture
              .card__picture-overlay &nbsp;
              img.card__picture-img(src=`/img/tours/${tour.imageCover}`, alt=`${tour.name}`)
            h3.heading-tertirary
              span= tour.name

          .card__details
            h4.card__sub-heading= `${tour.difficulty} ${tour.duration}-day tour`
            p.card__text= tour.summary
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-map-pin')
              span= tour.startLocation.description
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-calendar')
              span= tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-flag')
              span= `${tour.locations.length} stops`
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-user')
              span= `${tour.maxGroupSize} people`

          .card__footer
            p
              span.card__footer-value= `$${tour.price}`
              | 
  // after | space also needed
              span.card__footer-text per person
            p.card__ratings
              span.card__footer-value= tour.ratingsAverage
              | 
              span.card__footer-text= `rating (${tour.ratingsQuantity})`
a.btn.btn--green.btn--small(href=`/tour/${tour.slug}`) Details

exports.getOverview = catchAsync( async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();
    
    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All tours',
        tours 
    })
})

footer.footer
  .footer__logo
    img(src='/img/logo-green.png' alt='Natour logo')
  ul.footer__nav
    li: a(href='#') About us
    li: a(href='#') Download apps
    li: a(href='#') Become a guide
    li: a(href='#') Careers
    li: a(href='#') Contact
  p.footer__copyright &copy; by Jonas Schmedtmann. Feel free to use this project for your own purposes, EXCEPT producing your own course or tutorials!

header.header
  nav.nav.nav--tours
    a.nav__el(href='/') All tours
  .header__logo
    img(src='/img/logo-white.png' alt='Natours logo')
  nav.nav.nav--user
    button.nav__el Log in
    button.nav__el.nav__el--cta Sign up
    //- if user
    //-   a.nav__el.nav__el--logout Log out
    //-   a.nav__el(href='/me')
    //-     img.nav__user-img(src=`/img/users/${user.photo}` alt=`Photo of ${user.name}`)
    //-     span= user.name.split(' ')[0]
    //- else
    //-   a.nav__el(href='/login') Log in
//-   a.nav__el.nav__el--cta(href='#') Sign up

Mixen are reusable piece of code that accepts argument, a bit like a function
_reviewCard.pug
mixin reviewCard(review)
  .reviews__card
    .reviews__avatar
      img.reviews__avatar-img(src=`/img/users/${review.user.photo}`, alt=`${review.user.name}`)
      h6.reviews__user= review.user.name
    p.reviews__text= review.review
    .reviews__rating
      each star in [1, 2, 3, 4, 5]
        svg.reviews__star(class=`reviews__star--${review.rating >= star ? 'active' : 'inactive'}`)
          use(xlink:href='/img/icons.svg#icon-star')

Tour.pug
extends base
include _reviewCard

mixin overviewBox(label, text, icon)
  .overview-box__detail
    svg.overview-box__icon
      use(xlink:href=`/img/icons.svg#icon-${icon}`)
    span.overview-box__label= label
    span.overview-box__text= text

block content
  section.section-header
    .header__hero
      .header__hero-overlay &nbsp;
      img.header__hero-img(src=`/img/tours/${tour.imageCover}`, alt=`${tour.name}`)

    .heading-box
      h1.heading-primary
        span= `${tour.name} tour`
      .heading-box__group
        .heading-box__detail
          svg.heading-box__icon
            use(xlink:href='/img/icons.svg#icon-clock')
          span.heading-box__text= `${tour.duration} days`
        .heading-box__detail
          svg.heading-box__icon
            use(xlink:href='/img/icons.svg#icon-map-pin')
          span.heading-box__text= tour.startLocation.description

  section.section-description
    .overview-box
      div
        .overview-box__group
          h2.heading-secondary.ma-bt-lg Quick facts

          - const date = tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
          +overviewBox('Next date', date, 'calendar')
          +overviewBox('Difficulty', tour.difficulty, 'trending-up')
          +overviewBox('Participants', `${tour.maxGroupSize} people`, 'user')
          +overviewBox('Rating', `${tour.ratingsAverage} / 5`, 'star')

        .overview-box__group
          h2.heading-secondary.ma-bt-lg Your tour guides

          each guide in tour.guides
            .overview-box__detail
              img.overview-box__img(src=`/img/users/${guide.photo}`, alt=`${guide.name}`)

              - if (guide.role === 'lead-guide')
                span.overview-box__label Lead guide
              - if (guide.role === 'guide')
                span.overview-box__label Tour guide
              span.overview-box__text= guide.name

    .description-box
      h2.heading-secondary.ma-bt-lg= `About ${tour.name} tour`
      - const parapraphs = tour.description.split('\n');
      each p in parapraphs
        p.description__text= p

  section.section-pictures
    each img, i in tour.images
      .picture-box
        img.picture-box__img(src=`/img/tours/${img}`, alt=`The Park Camper Tour ${i + 1}`, class=`picture-box__img--${i + 1}`)

  section.section-map
    #map(data-locations=`${JSON.stringify(tour.locations)}`)

  section.section-reviews
    .reviews
      each review in tour.reviews
        +reviewCard(review)

  section.section-cta
    .cta
      .cta__img.cta__img--logo
        img(src='/img/logo-white.png', alt='Natours logo')
      img.cta__img.cta__img--1(src=`/img/tours/${tour.images[1]}`, alt='Tour picture')
      img.cta__img.cta__img--2(src=`/img/tours/${tour.images[2]}`, alt='Tour picture')
      .cta__content
        h2.heading-secondary What are you waiting for?
        p.cta__text= `${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`
        button.btn.btn--green.span-all-rows Book tour now!

data-variable_name use in stringify
dataset.variable_name use in JSON
Use mapbox 
const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oaXRrdW1hcjEwIiwiYSI6ImNrMDE0cHdrbDFsOGEzbG8xbTZqOHhha2sifQ.3z9SmgA2o77z4aIR4knCRA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rohitkumar10/ck8fxjpm93duw1invz6tsrw9l'
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);
    // Extend map bound to extend current location
    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});

Install axios using script src from axios cdn
npm i cookie-parser




npm i parcel-bundler --save-dev
npm i axios
npm i @babel/polyfill

In script
"watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
"build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
After running npm run watch:js it creates bundle.js and bundle.js.map

Should use npm start and npm run watch:js together for working

npm i multer

1.Why use so many callback functions in node.js ?      ' '     " "
2.How to overcome callback hell ?
3.How node use event-driven architecture to handle server requests in the http module ?
4.How authentication with jwt works ?
