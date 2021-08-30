var mongoose = require('mongoose');
const validator = require('validator');
const {Registration} = require('./userModel');


var mainStakingSchema = mongoose.Schema({

    user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref: Registration
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

var MainStake =  mongoose.model('main_stake', mainStakingSchema);


var StakingSchema = mongoose.Schema({

    m_stake_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: MainStake

	},

    startingbalance:{
        type:String
    },
    closingbalance:{
        type:String
    },
    valueinUSD:{
        type:String
    },
    closingbalanceUSD:{
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
    interestinUSD:{
        type:String
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
    interest_rate:{
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

var Stake =  mongoose.model('stake', StakingSchema);


var StakeAdminSchema =  new mongoose.Schema({
    
    interest_rate:{
        type:String,
        required:true
    },
    created_at: { 
        type: String
    },
    updated_at: {
        type: String,
        default: null
    },
    updated_by: {
        type:String,
        default:0
    }
});

var StakeRate =  mongoose.model('stake_rate',StakeAdminSchema);

module.exports={Stake,MainStake,StakeRate};