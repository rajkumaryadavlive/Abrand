var mongoose = require('mongoose');
const validator = require('validator');
const {Registration} = require('./userModel');


var mainvaultSchema = mongoose.Schema({

    user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref: Registration
	},
    deposit:{
        type:String
    },
    startdate:{
        type:String,
       
    },
    days:{
        type:String,
        default:'0'
       
    },
    interest_earned:{
        type:String,
       
    },
    withdrawal:{
        type:String,
       
    },
    enddate:{
        type:String,
       
    },
    current_coin_balance:{
        type:String,
       
    },
    created_at:{
        type:String
    },
    updated_at:{
        type:String
    },
    deleted:{
        type:String,
        default:'0'
    }
});

var MVAULT =  mongoose.model('MVAULT', mainvaultSchema);

var vaultSchema = mongoose.Schema({

    vault_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: MVAULT

	},

    startingbalance:{
        type:String
    },
    valueinUSD:{
        type:String
    },
    startdate:{
        type:String,
       
    },
    days:{
        type:String,
        default:'0'
       
    },
    deposit:{
        type:String,
       
    },
    interest_earned:{
        type:String,
       
    },
    withdrawal:{
        type:String,
       
    },
    enddate:{
        type:String,
       
    },
    current_coin_balance:{
        type:String,
       
    },
    valueinUSD_current:{
        type:String,
       
    },
    type:{
        type:String
    },
    created_at:{
        type:String
    },
    deleted:{
        type:String,
        default:'0'
    }
});

var VAULT =  mongoose.model('vault', vaultSchema);







module.exports={VAULT,MVAULT};









   
   
  