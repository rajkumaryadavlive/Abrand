// var mongoose = require('mongoose');

// const validator = require('validator');


// /**********RegistrationSchema**********/
// var RegistrationSchema = mongoose.Schema({

//     name: {
//         type: String
//     },
//     first_name: {
//         type: String
//     },

//     last_name: {
//         type: String
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true,
//         validate: {

//             validator: validator.isEmail,
//             message: '{VALUE} Entered Invalid Email'
//         }

//     },
//     email_verify: {

//         type: String,
//         enum:['pending','verified'],
//         default :'pending'

//     },
//     mobile_no: {

//         type: String,
//         default: null
//     },
//     address: {

//         type: String,
//         default: null
//     },
//     user_address: {

//         type: String,
//         default: null
//     },
//     country: {

//         type: String,
//         default: null
//     },
//     state: {

//         type: String,
//         default: null
//     },
//     city: {

//         type: String,
//         default: null
//     },
//     dob: {

//         type: String,
//         default: null
//     },
//     password: {
//         type: String,

//     },

//     created_at: {
//         type: String
//     },
//     deleted_at: {
//         type: String,
//         default: null
//     },
//     deleted_by: {

//         type: String,
//         default: null
//     },

//     updated_at: {

//         type: String,
//         default: null
//     },
//     status: {

//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'

//     },
//     deleted: {

//         type: String,
//         enum: ['0', '1'],
//         default: '0'
//     },
//     profile_image: {

//         type: String,

//     },
//     dataURL: {

//         type: String,

//     },
//     qr_secret: {

//         type: String,

//     },
//     qr_status: {

//         type: String,

//     },
//     ref_code: {

//         type: String,

//     },
//     ref_from: {

//         type: String,

//     },
//     otp: {

//         type: String,

//     },
//     auth: {

//         type: String,
//         enum: ['email', '2fa'],
//         default: 'email'
//     },
//     // link_status:{
//     //     type:String,

//     // }
//     // tokens:[{
//     //         access:{
//     //             type: String,
//     //             required: true
//     //         },
//     //         token:{

//     //             type: String,
//     //             required: true
//     //         }

//     //     }]
// });

// /**********UserwalletSchema**********/
// var Userwalletschema = mongoose.Schema({

//     user_id: {
//         type: String
//     },
//     wallet_address: {
//         type: String
//     },
//     passphrase: {
//         type: String
//     },
//     created_at: {
//         type: String
//     },
//     deleted_at: {
//         type: String,
//         default: null
//     },
//     deleted_by: {

//         type: String,
//         default: null
//     },

//     updated_at: {

//         type: String,
//         default: null
//     },
//     status: {

//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'

//     },
//     deleted: {

//         type: String,
//         enum: ['0', '1'],
//         default: '0'
//     },
// });


// var Registration = mongoose.model('User_registration', RegistrationSchema);

// var RefCodeschema = mongoose.Schema({
//     my_ref_code: {
//         type: String
//     },
//     reg_ref_code: {
//         type: String
//     },
//     status: {
//         type: String,
//         default: "Not used"
//     },
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User_registration'
//     }
// })

// var RefCode = mongoose.model('RefCode', RefCodeschema);

// /**********UserwalletSchema**********/
// var Userwalletschema = mongoose.Schema({

//     user_id: {
//         type: String
//     },
//     wallet_address: {
//         type: String
//     },
//     passphrase: {
//         type: String
//     },
//     created_at: {
//         type: String
//     },
//     deleted_at: {
//         type: String,
//         default: null
//     },
//     deleted_by: {

//         type: String,
//         default: null
//     },

//     updated_at: {

//         type: String,
//         default: null
//     },
//     status: {

//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'

//     },
//     deleted: {

//         type: String,
//         enum: ['0', '1'],
//         default: '0'
//     },
// });

// var Userwallet = mongoose.model('User_wallet', Userwalletschema);


// /**********ImportwalletSchema**********/
// // var TokendetailsSchema = mongoose.Schema({

// //     auto: {
// //         type: Number,
// //         required: true,
// //         unique: true,
// //         integer: true
// //     },
// //     user_id: {
// //         type: String
// //     },
// //     wallet_id: {
// //         type: String
// //     },
// //     sender_wallet_address: {
// //         type: String
// //     },
// //     receiver_wallet_address: {
// //         type: String
// //     },
// //     hash: {
// //         type: String
// //     },
// //     amount: {
// //         type: String
// //     },
// //     payment_status: {
// //         type: String
// //     },
// //     token_type: {
// //         type: String
// //     },
// //     block_id: {
// //         type: String,
// //         default: null
// //     },
// //     transaction_type: {
// //         type: String
// //     },
// //     referred_to_name: {
// //         type: String
// //     },
// //     referred_to_email: {
// //         type: String
// //     },
// //     bonus_reward: {
// //         type: String
// //     },
// //     created_at: {
// //         type: String
// //     },
// //     deleted_at: {
// //         type: String,
// //         default: null
// //     },
// //     deleted_by: {

// //         type: String,
// //         default: null
// //     },

// //     updated_at: {

// //         type: String,
// //         default: null
// //     },
// //     status: {

// //         type: String,
// //         enum: ['active', 'inactive'],
// //         default: 'active'

// //     },
// //     deleted: {

// //         type: String,
// //         enum: ['0', '1'],
// //         default: '0'
// //     },
// // });

// var ImportwalletSchema = mongoose.Schema({

//     user_id: {
//         type: String
//     },
//     wallet_id: {
//         type: String
//     },
//     login_status: {
//         type: String
//     },
//     created_at: {
//         type: String
//     },
//     deleted_at: {
//         type: String,
//         default: null
//     },
//     deleted_by: {
//         type: String,
//         default: null
//     },

//     updated_at: {

//         type: String,
//         default: null
//     },
//     status: {
//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'
//     },
//     deleted: {

//         type: String,
//         enum: ['0', '1'],
//         default: '0'
//     },
// });

// var Tokendetails = mongoose.model('token_details', TokendetailsSchema);


// var ARTWsettingsSchema = mongoose.Schema({
//     token_name: {
//         type: String
//     },
//     total_quantity: {
//         type: String
//     },
//     etherValue: {
//         type: String
//     },
//     btcValue: {
//         type: String
//     },
//     usdValue: {
//         type: String
//     },
//     xrpValue: {
//         type: String
//     },
//     ltcValue: {
//         type: String
//     },
//     dashValue: {
//         type: String
//     },
//     bnbValue: {
//         type: String
//     },
//     updated_at: {
//         type: String
//     }
// })

// var Tokensettings = mongoose.model('Tokensettings', ARTWsettingsSchema);

// var OrderDeatailsSchema = mongoose.Schema({

//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User_registration'
//     },
//     rwn_count: {
//         type: String
//     },
//     rate_per_rwn: {
//         type: String
//     },
//     total_amnt: {
//         type: String
//     },
//     trnsaction_Id: {
//         type: String
//     },
//     sender_wallet_address: {
//         type: String
//     },
//     rwn_wallet_address: {
//         type: String
//     },
//     image: {
//         type: String
//     },
//     payment_type: {
//         type: String
//     },
//     payment_status: {
//         type: String,
//         default: "Pending"
//     },
//     created_at: {
//         type: String
//     }
// });

// var OrderDetails = mongoose.model('OrderDetails', OrderDeatailsSchema);

// /**********ImportwalletSchema**********/
// var ImportwalletSchema = mongoose.Schema({

//     user_id: {
//         type: String
//     },
//     wallet_id: {
//         type: String
//     },
//     login_status: {
//         type: String
//     },
//     created_at: {
//         type: String
//     },
//     deleted_at: {
//         type: String,
//         default: null
//     },
//     deleted_by: {

//         type: String,
//         default: null
//     },

//     updated_at: {

//         type: String,
//         default: null
//     },
//     status: {

//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'

//     },
//     deleted: {

//         type: String,
//         enum: ['0', '1'],
//         default: '0'
//     },
// });

// var Importwallet = mongoose.model('import_wallet', ImportwalletSchema);

// module.exports = {
//     Registration: Registration,
//     RefCode: RefCode,
//     Tokendetails: Tokendetails,
//     Importwallet: Importwallet,
//     Userwallet: Userwallet,
//     OrderDetails: OrderDetails,
//     Tokensettings: Tokensettings
    
// };

var mongoose = require('mongoose');

const validator = require('validator');


/**********RegistrationSchema**********/
var RegistrationSchema = mongoose.Schema({

    name: {
        type: String
    },
    first_name: {
        type: String
    },

    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {

            validator: validator.isEmail,
            message: '{VALUE} Entered Invalid Email'
        }

    },
    email_verify: {

        type: String,
        enum:['pending','verified'],
        default :'pending'

    },
    mobile_no: {

        type: String,
        default: null
    },
    address: {

        type: String,
        default: null
    },
    user_address: {

        type: String,
        default: null
    },
    country: {

        type: String,
        default: null
    },
    state: {

        type: String,
        default: null
    },
    city: {

        type: String,
        default: null
    },
    dob: {

        type: String,
        default: null
    },
    password: {
        type: String,

    },

    created_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    },
    deleted_by: {

        type: String,
        default: null
    },

    updated_at: {

        type: String,
        default: null
    },
    status: {

        type: String,
        enum: ['active', 'inactive'],
        default: 'active'

    },
    deleted: {

        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    profile_image: {

        type: String,

    },
    dataURL: {

        type: String,

    },
    qr_secret: {

        type: String,

    },
    qr_status: {

        type: String,

    },
    ref_code: {

        type: String,

    },
    ref_from: {

        type: String,

    },
    otp: {

        type: String,

    },
    auth: {

        type: String,
        enum: ['email', '2fa'],
        default: 'email'
    },
    // link_status:{
    //     type:String,

    // }
    // tokens:[{
    //         access:{
    //             type: String,
    //             required: true
    //         },
    //         token:{

    //             type: String,
    //             required: true
    //         }

    //     }]
});

/**********UserwalletSchema**********/
var Userwalletschema = mongoose.Schema({

    user_id: {
        type: String
    },
    wallet_address: {
        type: String
    },
    passphrase: {
        type: String
    },
    created_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    },
    deleted_by: {

        type: String,
        default: null
    },

    updated_at: {

        type: String,
        default: null
    },
    status: {

        type: String,
        enum: ['active', 'inactive'],
        default: 'active'

    },
    deleted: {

        type: String,
        enum: ['0', '1'],
        default: '0'
    },
});


var Registration = mongoose.model('User_registration', RegistrationSchema);

var RefCodeschema = mongoose.Schema({
    my_ref_code: {
        type: String
    },
    reg_ref_code: {
        type: String
    },
    status: {
        type: String,
        default: "Not used"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_registration'
    }
})

var RefCode = mongoose.model('RefCode', RefCodeschema);

/**********UserwalletSchema**********/
var Userwalletschema = mongoose.Schema({

    user_id: {
        type: String
    },
    wallet_address: {
        type: String
    },
    passphrase: {
        type: String
    },
    balance: {
        type: String,
        default: null
    },
    created_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    },
    deleted_by: {

        type: String,
        default: null
    },

    updated_at: {

        type: String,
        default: null
    },
    status: {

        type: String,
        enum: ['active', 'inactive'],
        default: 'active'

    },
    deleted: {

        type: String,
        enum: ['0', '1'],
        default: '0'
    },
});

var Userwallet = mongoose.model('User_wallet', Userwalletschema);


/**********ImportwalletSchema**********/
var TokendetailsSchema = mongoose.Schema({

    auto: {
        type: Number,
        required: true,
        unique: true,
        integer: true
    },
    user_id: {
        type: String
    },
    wallet_id: {
        type: String
    },
    sender_wallet_address: {
        type: String
    },
    receiver_wallet_address: {
        type: String
    },
    hash: {
        type: String
    },
    amount: {
        type: String
    },
    payment_status: {
        type: String
    },
    token_type: {
        type: String
    },
    block_id: {
        type: String,
        default: null
    },
    transaction_type: {
        type: String
    },
    referred_to_name: {
        type: String
    },
    referred_to_email: {
        type: String
    },
    bonus_reward: {
        type: String
    },
    created_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    },
    deleted_by: {

        type: String,
        default: null
    },

    updated_at: {

        type: String,
        default: null
    },
    status: {

        type: String,
        enum: ['active', 'inactive'],
        default: 'active'

    },
    deleted: {

        type: String,
        enum: ['0', '1'],
        default: '0'
    },
});

var Tokendetails = mongoose.model('token_details', TokendetailsSchema);


var ARTWsettingsSchema = mongoose.Schema({
    token_name: {
        type: String
    },
    total_quantity: {
        type: String
    },
    etherValue: {
        type: String
    },
    btcValue: {
        type: String
    },
    usdValue: {
        type: String
    },
    xrpValue: {
        type: String
    },
    ltcValue: {
        type: String
    },
    dashValue: {
        type: String
    },
    bnbValue: {
        type: String
    },
    updated_at: {
        type: String
    }
})

var Tokensettings = mongoose.model('Tokensettings', ARTWsettingsSchema);

var OrderDeatailsSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_registration'
    },
    ebt_count: {
        type: String
    },
    rate_per_ebt: {
        type: String
    },
    total_amnt: {
        type: String
    },
    transaction_Id: {
        type: String
    },
    sender_wallet_address: {
        type: String
    },
    eth_wallet_address: {
        type: String
    },
    image: {
        type: String
    },
    payment_type: {
        type: String
    },
    payment_status: {
        type: String,
        default: "Pending"
    },
    created_at: {
        type: String
    }
});

var OrderDetails = mongoose.model('OrderDetails', OrderDeatailsSchema);

/**********ImportwalletSchema**********/
var ImportwalletSchema = mongoose.Schema({

    user_id: {
        type: String
    },
    wallet_id: {
        type: String
    },
    login_status: {
        type: String
    },
    created_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    },
    deleted_by: {

        type: String,
        default: null
    },

    updated_at: {

        type: String,
        default: null
    },
    status: {

        type: String,
        enum: ['active', 'inactive'],
        default: 'active'

    },
    deleted: {

        type: String,
        enum: ['0', '1'],
        default: '0'
    },
});

var Importwallet = mongoose.model('import_wallet', ImportwalletSchema);

var faqSchema = mongoose.Schema({

    question: {
        type: String
    },
    answer: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    },
    deleted: {
        type: String,
        default: '0'
    }
});

var FAQ = mongoose.model('faq', faqSchema);

var contactSchema = mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    number: {
        type: String
    },
    message: {
        type: String,
        default: 'active'
    },
    created_at: {
        type: String
    },
    deleted: {
        type: String,
        default: '0'
    }
});

var ContactInfo = mongoose.model('contact', contactSchema);

module.exports = {
    Registration: Registration,
    RefCode: RefCode,
    Tokendetails: Tokendetails,
    Importwallet: Importwallet,
    Userwallet: Userwallet,
    OrderDetails: OrderDetails,
    Tokensettings: Tokensettings,
    FAQ: FAQ,
    ContactInfo: ContactInfo
};



