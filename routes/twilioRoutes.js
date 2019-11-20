const router = require('express').Router();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const phoneModel = require('../model/phone');
const authToken = process.env.TWILIO_AUHT_TOKEN;
const client = require('twilio')(accountSID, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
let symptomList = []
router.post('/register', async (req, res) => {

    console.log("IN RESGISTER");
    let from = req.body.From;
    let msgBody = req.body.Body;
    let phone = await phoneModel.findOne({ phoneNo: from });
    if (!phone && msgBody == "START") {
        symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        let phoneObj = new phoneModel({
            phoneNo: from,
            status: "Registered",
            symptoms: symptomList

        })
        await client.messages.create({
            to: from,
            from: process.env.TWILIO_PHONE_NO,
            body: 'Welcome to the study',
        })
        phone = await phoneObj.save();
    }
    if (phone && msgBody == "START") {
        symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness'];
        await phoneModel.findOneAndUpdate({ phoneNo: from },
            {
                $set: {
                    status: "Registered",
                    symptoms: symptomList
                }
            });
    }
    switch (phone.status) {
        case "Registered":
            sendSymptomListMessage();
            break;

        case "NowSymptomInBody":
            sendScaleMessage()
            break;

        case "NowScaleInBody":
            sendScaleSeverityMessage()
            break;
    }

    async function sendSymptomListMessage() {
        symptomList = phone.symptoms;
        if(symptomList.length<=2)
        {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "Thank you and see you soon" 
            });
            await phoneModel.findOneAndUpdate({ phoneNo: from },
                {
                    $set: {
                        status: null
                    }
            });
            return;

        }
        let symptString = "Please indicate your symptom ";
        for (let i = 0; i < symptomList.length; i++) {
            symptString += "(" + (i + 1) + ")" + symptomList[i] + ", "
        }
        symptString += "(0) None";
        await client.messages.create({
            to: from,
            from: process.env.TWILIO_PHONE_NO,
            body: symptString
        })
        await phoneModel.findOneAndUpdate({ phoneNo: from },
            {
                $set: {
                    status: "NowSymptomInBody"
                }
            });
    }

    async function sendScaleSeverityMessage() {
        if (msgBody == 0) {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "You do not have a " + phone.currentSymptom
            });
            sendSymptomListMessage();

        }
        else if (msgBody >= 1 && msgBody <= 2) {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "You have a mild " + phone.currentSymptom
            });
            sendSymptomListMessage();
        }
        else if (msgBody == 3) {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "You have a moderate " + phone.currentSymptom
            });
            sendSymptomListMessage();
        }
        else if (msgBody == 4) {

            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "You have a severe " + phone.currentSymptom
            });
            sendSymptomListMessage();
        }
        else {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "Please enter a number from 0 to 4" 
            });

        }
    }

    async function sendScaleMessage() {
        symptomList = phone.symptoms;
        if (msgBody == 0) {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "Thank you and we will check with you later."
            });
            await phoneModel.findOneAndUpdate({ phoneNo: from },
                {
                    $set: {
                        status: null
                    }
                });
        }
        else if (msgBody > 0 && msgBody <= symptomList.length) {
            let symp = symptomList[msgBody - 1];
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"
            });
            var newArray = symptomList.filter(e => e !== symp);
            await phoneModel.findOneAndUpdate({ phoneNo: from },
                {
                    $set: {
                        status: "NowScaleInBody",
                        currentSymptom: symp,
                        symptoms: newArray
                    }
                });
        }
        else {
            await client.messages.create({
                to: from,
                from: process.env.TWILIO_PHONE_NO,
                body: "Please enter a number from 0 to " + symptomList.length
            });
        }

    }

});

module.exports = router;