const router = require('express').Router();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const phoneModel = require('../model/phone');
const authToken = process.env.TWILIO_AUHT_TOKEN;
const client = require('twilio')(accountSID,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
let symptomList=[]
router.post('/register' , async (req,res) => {

    console.log("IN RESGISTER");
    let from =  req.body.From;
    //let to = req.body.To;
    let msgBody = req.body.Body; 
    // console.log("FROM " + from);
    // console.log("TO " + to);
    // console.log("BODY " + msgBody);
    let phone = await phoneModel.findOne({phoneNo : from });  
    if(!phone && msgBody=="START"){
        symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness']; 
            let phoneObj = new phoneModel({
                phoneNo : from,
                status : "Registered",
                symptoms : symptomList
                
            })
            console.log("1");
            await client.messages.create({
                to : from,
                from : process.env.TWILIO_PHONE_NO,
                body : 'Welcome to the study',})
            console.log("2");
            phone = await phoneObj.save(); 
            console.log("3");
    }
    if(phone && msgBody=="START"){
        symptomList = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Sadness']; 
        await phoneModel.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    status : "Registered",
                    symptoms : symptomList
            }
        });
        console.log("4");
    } 
    switch(phone.status)
    {
            case "Registered":
                    symptomMail();
                    // symptomList = phone.symptoms;
                    // let symptString = "Please indicate your symptom ";
                    // for(let i=0;i<symptomList.length;i++)
                    // {
                    //     symptString+= "("+(i+1)+")"+ symptomList[i] + ", "
                    // }
                    // symptString+= "(0) None";
                    // await client.messages.create({
                    //     to : from,
                    //     from : process.env.TWILIO_PHONE_NO,
                    //     body : symptString})
                    // console.log("5");
                    // await phoneModel.findOneAndUpdate({phoneNo : from},
                    //     {
                    //         $set:{
                    //             status : "AwaitingSymptom"
                    //         }
                    //     });
                    // console.log("6");
                    break;
                    
            
            case "AwaitingSymptom":
                symptomList = phone.symptoms;
                let symp = symptomList[msgBody-1];
                await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : "On a scale from 0 (none) to 4 (severe), how would you rate your " + symp + " in the last 24 hours?"});
                var newArray = symptomList.filter(e => e !== symp);
    
                await phoneModel.findOneAndUpdate({phoneNo : from},
                        {
                            $set:{
                                    status : "AwaitingScale",
                                    currentSymptom : symp,
                                    symptoms : newArray
                            }
                        });
                break;

            case "AwaitingScale":
                if(msgBody ==0){
                    await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : "You do not have a " + phone.currentSymptom});
                }
                if(msgBody >=1 && msgBody <=2){
                    await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : "You have a mild " + phone.currentSymptom});
                }
                if(msgBody == 3){
                    await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : "You have a moderate " + phone.currentSymptom});
                }
                if(msgBody == 4){
                    await client.messages.create({
                        to : from,
                        from : process.env.TWILIO_PHONE_NO,
                        body : "You have a severe " + phone.currentSymptom});
                }
                await phoneModel.findOneAndUpdate({phoneNo : from},
                {
                    $set:{
                        status : "AwaitingSymptom",
                        currentSymptom : null
                    }
                });
            

            
    }

    function symptomMail(){
        symptomList = phone.symptoms;
        let symptString = "Please indicate your symptom ";
        for(let i=0;i<symptomList.length;i++)
        {
            symptString+= "("+(i+1)+")"+ symptomList[i] + ", "
        }
        symptString+= "(0) None";
        await client.messages.create({
            to : from,
            from : process.env.TWILIO_PHONE_NO,
            body : symptString})
        console.log("5");
        await phoneModel.findOneAndUpdate({phoneNo : from},
            {
                $set:{
                    status : "AwaitingSymptom"
                }
            });
        console.log("6");
    }
    


    // else{
    // if(phone)
    // {
    //     if(!phone.symptom){
    //         let symptomList = [];
    //         let sympObj   
    //         switch(msgBody){
    //             case "1":
    //                 sympObj = "Headache";
    //                 break;
                
    //             case "2":
    //                 sympObj = "Dizziness";
    //                 break;
            
    //             case "3":
    //                 sympObj = "Nausea";
    //                 break;
    
    //             case "4":
    //                 sympObj = "Fatigue";
    //                 break;
                    
    //             case "5":
    //                 sympObj = "Sadness";
    //                 break;
    
    //             case "0":
    //                 sympObj = "None";
    //                 break;
    
    //             default:
    //                 sympObj = "wrongInput";            
    //         }
    //         if(sympObj == "wrongInput")
    //         {
    //             await client.messages.create({
    //                 to : from,
    //                 from : process.env.TWILIO_PHONE_NO,
    //                 body : 'Please enter a number from 0 to 5'})
    //         }
    //         else if(sympObj == "None")
    //         {
    //             await client.messages.create({
    //                 to : from,
    //                 from : process.env.TWILIO_PHONE_NO,
    //                 body : 'Thank you and we will check with you later.'})
    //         }
    //         else{
    //             symptomList.push(sympObj);
    //             console.log("msgBody  " + msgBody);
    //             await phoneModel.findOneAndUpdate({phoneNo : from},
    //             {
    //                 $set:{
    //                     symptom : symptomList
    //                 }
    //             });
    //             await client.messages.create({
    //                 to : from,
    //                 from : process.env.TWILIO_PHONE_NO,
    //                 body : "On a scale from 0 (none) to 4 (severe), how would you rate your "+ sympObj +" in the last 24 hours?"})
    //         }
    
    //     }

    // } 

    // }
         
});






module.exports = router;