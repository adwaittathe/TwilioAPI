const express=require('express');
const app=express();
const mongoose = require('mongoose');
const dotenv= require('dotenv');
dotenv.config();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);


mongoose.set('useFindAndModify', false);
const twilioRoutes = require( './routes/twilioRoutes');

mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser:true , useUnifiedTopology: true } , ()=>{
        console.log('Connected to DB');
    } 
);

// client.messages.create({
//     body : 'Hello from Twilio',
//     from : process.env.TWILIO_PHONE_NO,
//     to : process.env.MY_PHONE_NO
// })
// .then((message) => console.log(message.sid))



app.use('/api/twilio',  twilioRoutes);

app.use(express.json());
app.listen(80, ()=> console.log('Server Up. Listening to port 80.........'));