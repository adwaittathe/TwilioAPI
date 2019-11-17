const router = require('express').Router();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , (req,res) => {

    const twiml = new MessagingResponse();
    twiml.message('Lets register to twilio');

    res.writeHead(200 , {'Content-Type' : 'text/xml' });
    res.end(twiml.toString());

});



// client.messages.create({
//     to : process.env.MY_PHONE_NO,
//     from : process.env.TWILIO_PHONE_NO,
//     body : 'Hello from Twilio',
// })
// .then((message) => console.log(message.sid))



module.exports = router;