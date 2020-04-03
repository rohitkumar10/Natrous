const mongoose = require('mongoose')
const dotenv = require('dotenv')

// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//     console.log(err.name, err.message);
//     process.exit(1);
// });

dotenv.config({path:'./config.env'})
const app = require('./app');

//console.log(process.env);
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
//console.log(process.env.DATABASE_LOCAl)
 
mongoose.connect(process.env.DATABASE_LOCAL, {       // replace DB with process.env.DATABASE_LOCAL // for local database 
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((con) => { 
    //console.log(con.connections)  
    console.log('DB connection successful !');
}).catch(()=> {
    console.log('Error') 
})

// const tourSchema = new mongoose.Schema({
//     name: {
//         type:String,
//         unique: true,
//         required: [true, 'Please give name of tour']
        
//     },
//     rating: {
//         type: Number,
//         default: 4.5
//     },
//     price: {
//         type: Number,
//         required: [true, 'Please give price for tour']
//     }
// })

// const Tour = mongoose.model('Tour',tourSchema);

// const testTour = new Tour({
//     name: 'Dargaleng',
//     rating: 4.8,
//     price: 510
// });

// testTour.save().then(doc=>{
//     console.log(doc)
// }).catch(err=>{
//     console.log(err)
// })
 
const server = app.listen(process.env.PORT, ()=>{
    console.log(`App is running on port: ${process.env.PORT} ...`);
})

// process.on('unhandledRejection', err => {
//     console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     })
// })
  
