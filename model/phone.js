const mongoose =  require('mongoose');
 
const phoneSchema = new mongoose.Schema({
    phoneNo : {
        type : String
    },
    symptom: {
        type:Object,
        //required: true
    },
    status:{
        type: String,
    }
   
});
module.exports = mongoose.model('twilio', phoneSchema);