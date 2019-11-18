const router = require('express').Router();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const phoneModel = require('../model/phone');
const authToken = process.env.TWILIO_AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.post('/register' , async (req,res) => {

    let from =  req.body.From;
    let to = req.body.To;
    let msgBody = req.body.Body; 
    let phone = await phoneModel.findOne({phoneNo : from });
    if(msgBody == "START")
    {     
        if(!phone){
            let phoneObj = new phoneModel({
                phoneNo : from
            })
            phone = await phoneObj.save();
            await client.messages.create({
              to : from,
              from : process.env.TWILIO_PHONE_NO,
              body : 'Welcome to the study',})
        }
        if(!phone.symptom){
            await client.messages.create({
                to : from,
                from : process.env.TWILIO_PHONE_NO,
                body : 'Please indicate your symptom (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None'})
        }
    }
    else{
    if(phone)
    {
        if(!phone.symptom){
            let symptomList = [];
            let sympObj   
            switch(msgBody){
                case "1":
                    sympObj = "Headache";
                    break;
                
                case "2":
                    sympObj = "Dizziness";
                    break;
            
                case "3":
                    sympObj = "Nausea";
                    break;
    
                case "4":
                    sympObj = "Fatigue";
                    break;
                    
                case "5":
                    sympObj = "Sadness";
                    break;
    
                case "0":
                    sympObj = "None";
                    break;
    
                default:
                    sympObj = "wrongInput";            
            }
            if(sympObj == "wrongInput")
            {
                await client.messages.create({
                    to : from,
                    from : process.env.TWILIO_PHONE_NO,
                    body : 'Please enter a number from 0 to 5'})
            }
            else if(sympObj == "None")
            {
                await client.messages.create({
                    to : from,
                    from : process.env.TWILIO_PHONE_NO,
                    body : 'Thank you and we will check with you later.'})
            }
            else{
                symptomList.push(sympObj);
                console.log("msgBody  " + msgBody);
                await phoneModel.findOneAndUpdate({phoneNo : from},
                {
                    $set:{
                        symptom : symptomList
                    }
                });
                await client.messages.create({
                    to : from,
                    from : process.env.TWILIO_PHONE_NO,
                    body : "On a scale from 0 (none) to 4 (severe), how would you rate your "+ sympObj +" in the last 24 hours?"})
            }
    
        }

    } 

    }
         
});

module.exports = router;