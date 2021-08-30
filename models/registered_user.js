
const moongoose = require('mongoose');

var Schema  = moongoose.Schema;

const validator = require('validator');


/**How access and token works only we are perfoming just restructuring****/

var UserSchema =  new moongoose.Schema({

	name:{
		name:String
	},

	email:{
		type:String,
		required:true,
		trim:true,
		unique:true,
		validate:{

			validator:validator.isEmail,
			message:'{VALUE} Entered Invalid Email'
		}

	},
	email_varify_status:{

		type:String

	},
	mobile_no:{

		type:String,
		default:null
	},
	address:{

		type:String,
		default:null
	},
	user_address:{

		type:String,
		default:null
	},
	country:{

		type:String,
		default:null
	},
	state:{

		type:String,
		default:null
	},
	city:{

		type:String,
		default:null
	},
	Password:{
		type:String,
		required:true
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

	created_at: { 
					type: Date
				},
	
	created_by: {

			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	status:{

		type:String,
		enum: ['active', 'inactive'],
		default:'active'

	},
	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	image_name:{

		type:String,

	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});



var UserInfo =  moongoose.model('user',UserSchema);

/************Token Setting*******/

var TokenSchema =  new moongoose.Schema({

	token_name:{
		name:String,
	},

	token_quantity:{
		type:Number,
		required:true
	},
	token_remaining_quantity:{

		type:Number,
		default:null
	},
	token_eather_value:{

		type:Number,
		default:null
	},
	created_at: { 
					type: Date
				},
	
	created_by: {

			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	status:{

		type:String,
		enum: ['active', 'inactive'],
		default:'active'

	},
	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});


var TokenInfo =  moongoose.model('token_setting',TokenSchema);

/*****Verification Details****/

var VerificationSchema =  new moongoose.Schema({

	image:{
		name:String,
	},

	id_verify_status:{
		type:String,
		enum: ['Pending', 'Completed','Verified'],
		default:'Pending'
	},
	
	user_id:{ type: Schema.Types.ObjectId, ref: 'user' },
	
	user_status:{

		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	reason_of_rejection:{
		type:String
	},
	taking_status:{
		type:String,
		enum: ['0', '1'],
		default:'0'
	},
	created_at: { 
					type: Date
				},
	
	created_by: {

			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var VeriInfo =  moongoose.model('id_verification',VerificationSchema);

/****Ether Schema***/

var EtherSchema =  new moongoose.Schema({

	Tx_hash:{
		type:String
	},
	Amount:{
		type:Number
	},
	From:{
		type:String
	},
	To:{
		type:String
	},
	status:{
		type:String
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date
				},
	
	created_by: {
			
			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var EtherInfo =  moongoose.model('eather_detail',EtherSchema);

/****ERC20 Gift Token****/

var GiftSchema =  new moongoose.Schema({

	Tx_hash:{
		type:String
	},
	Amount:{
		type:Number
	},
	From:{
		type:String
	},
	To:{
		type:String
	},
	status:{
		type:String
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date
				},
	
	created_by: {
			
			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var GiftInfo =  moongoose.model('gift_token_detail',GiftSchema);

/********Contacts Schema********/

var ContactSchema =  new moongoose.Schema({

	name:{
		type:String
	},
	message:{
		type:String
	},
	email:{
		type:String
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date
				},
	
	created_by: {
			
			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var ContactInfo =  moongoose.model('enquiry_contact',ContactSchema);

/********Newsletter Schema********/

var NewsSchema =  new moongoose.Schema({

	email:{
		type:String
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date
				},
	
	created_by: {
			
			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var NewsInfo =  moongoose.model('newsletters',NewsSchema);

/********Newsletter Schema********/

var BasicSettingSchema =  new moongoose.Schema({

	token_issued:{
		type:Number
	},
	hard_cap:{
		type:String
	},
	soft_cap:{
		type:String
	},
	total_sales_reached:{
		type:String
	},
	exchange_rate:{
		type:Number
	},
	total_token_supply:{
		type:String
	},
	token_name:{
		type:String
	},
	gift_token_price:{
		type:String
	},
	token_symbol:{
		type:String
	},
	project_protocol:{
		type:String
	},
	worth_gift_token:{
		type:Number
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	start_date: { 
					type: Date
				},
	end_date:   { 
					type: Date
				},
	created_at: { 
					type: Date
				},
	
	created_by: {
			
			type:Number,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var BasictInfo =  moongoose.model('basic_setting',BasicSettingSchema);

/********Team Member Schema********/

var TeamMemberSchema =  new moongoose.Schema({

	member_email:{
		type:String
	},
	member_image:{
		type:String
	},
	member_name:{
		type:String
	},
	member_phone:{
		type:String
	},
	member_sub_title:{
		type:String
	},
	member_description:{
		type:String
	},
	member_facebook:{
		type:String
	},
	member_twitter:{
		type:String
	},
	member_linkedin:{
		type:String
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date,
					default: null
				},
	
	created_by: {
			
			type:String,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var TeamMemberInfo =  moongoose.model('our_teams',TeamMemberSchema);

/********News Schema********/

var NewsDetailsSchema =  new moongoose.Schema({

	news_title:{
		type:String
	},
	news_desc:{
		type:String
	},
	news_image:{
		type:String
	},
	news_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date,
					default: null
				},
	
	created_by: {
			
			type:String,
			default:0
	},

	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var NewsDetailsInfo =  moongoose.model('news_detail',NewsDetailsSchema);


/*********Country Schema******/

var CountrySchema =  new moongoose.Schema({

	country_name:{
		
		type:String
	
	},
	status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date,
					default: Date.now()
				},
	
	created_by: {
			
			type:String,
			default:0
	},
	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var CountryInfo =  moongoose.model('countrie',CountrySchema);

/********State Info********/

var StateSchema =  new moongoose.Schema({

	state_name:{
		
		type:String
	
	},
	country_id:{ type: Schema.Types.ObjectId, ref: 'countrie' },

	status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},
	created_at: { 
					type: Date,
					default: Date.now()
				},
	
	created_by: {
			
			type:String,
			default:0
	},
	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	tokens:[{
			access:{
				type: String,
				required: true
			},
			token:{

				type: String,
				required: true
			}

		}]
});

var StateInfo =  moongoose.model('state',StateSchema);


// for mail_configuration///
var MailSchema =  new moongoose.Schema({

	user_name:{
		
		type:String
	
	},
	userpass:{
		
		type:String
	
	},
	user_status:{
		type:String,
		enum: ['Active', 'Inactive'],
		default:'Active'
	},

	
	created_at: { 
					type: Date,
					default: Date.now()
				},
	
	created_by: {
			
			type:String,
			default:0
	},
	deleted_at: { 
					type: Date,
					default: null 
				},
	
	deleted_by: {

			type:String,
			default: null 
	},

	updated_at: {

			type: Date,
			default: null
	},

	updated_by: {

			type:String,
			default:0
	},

	deleted:{

		 type:String,
		 enum: ['0', '1'],
		 default:'0'
	},
	
});

var MailInfo =  moongoose.model('mail_configuration',MailSchema);



module.exports = {
	UserInfo:UserInfo,
	TokenInfo:TokenInfo,
	VeriInfo:VeriInfo,
	EtherInfo:EtherInfo,
	GiftInfo:GiftInfo,
	ContactInfo:ContactInfo,
	NewsInfo:NewsInfo,
	BasictInfo:BasictInfo,
	TeamMemberInfo:TeamMemberInfo,
	NewsDetailsInfo:NewsDetailsInfo,
	CountryInfo:CountryInfo,
	StateInfo:StateInfo,
	MailInfo:MailInfo
};
