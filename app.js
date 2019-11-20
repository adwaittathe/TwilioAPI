const express=require('express');
const app=express();
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({extended:false}));
//mongoose.set('useFindAndModify', false);
const twilioRoutes = require( './routes/twilioRoutes');

mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser:true , useUnifiedTopology: true } , ()=>{
        console.log('Connected to DB');
    } 
);
app.use('/api/twilio',  twilioRoutes);
app.use(express.json());
app.listen(port, ()=> console.log('Server Up. Listening to port 8080.........'));