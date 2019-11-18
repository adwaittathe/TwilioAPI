const mongoose =  require('mongoose');
 
const phoneSchema = new mongoose.Schema({
    phoneNo : {
        type : String
    },
    symptom: {
        type:Object,
        //required: true
    }
   
});
module.exports = mongoose.model('TwilioNumber', phoneSchema);