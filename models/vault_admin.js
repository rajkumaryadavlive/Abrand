const moongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


var VaultAdminSchema =  new moongoose.Schema({
    
    interest_rate:{
        type:String,
        required:true
    },

    
    created_at: { 
                type: String,
                default: Date.now 
        },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },
   

    updated_by: {

            type:String,
            default:0
    },

    
    
});




var VaultRate =  moongoose.model('tbl_vault_percent',VaultAdminSchema);


module.exports={ VaultRate};





