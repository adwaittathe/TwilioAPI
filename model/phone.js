const mongoose =  require('mongoose');
 
const phoneSchema = new mongoose.Schema({
    phoneNo : {
        type : String
    },
    symptoms: {
        type:Object,
        //required: true
    },
    currentSymptom : {
        type:String,
    },
    status:{
        type: String,
    }
   
});
module.exports = mongoose.model('twilio', phoneSchema);