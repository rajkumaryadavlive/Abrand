const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/


var TeamSchema =  new moongoose.Schema({

    name:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    linkedin_url:{
        type:String,
        required:true
    },
    member_image:{
        type: String
    },
    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

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
    deleted_at: {

            type: String,
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




var Teaminfo =  moongoose.model('tbl_teammember',TeamSchema); 

/*** Vision ****/

var VisionSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },
    side_content:{
        type:String,
        required:true
    },
    main_content:{
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
    deleted_at: {

            type: String,
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




var Visioninfo =  moongoose.model('tbl_vision',VisionSchema); 

/*** Vision end ****/ 

/****** Product*****/

var ProductDetailsSchema =  new moongoose.Schema({

    product_name:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    product_video:{
        type:String,
        required:true
    },
   
    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

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
    deleted_at: {

            type: String,
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




var Productinfo =  moongoose.model('tbl_product',ProductDetailsSchema);  
/****** Product*****/ 


var RoadMapSchema =  new moongoose.Schema({

    duration:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
   
    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

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
    deleted_at: {

            type: String,
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
    section:{

         type:String,
         enum: ['1', '2', '3', '4'],
         default:'4'
    },

});




var RoadMapInfo =  moongoose.model('tbl_roadmap',RoadMapSchema); 

/***************/

var GraphSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },   
    image:{
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
    deleted_at: {

            type: String,
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




var GraphInfo =  moongoose.model('tbl_financial_graph',GraphSchema);   


/*******************/

var TermsSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },   
    content:{
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
    deleted_at: {

            type: String,
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




var TermsInfo =  moongoose.model('tbl_terms_conditions',TermsSchema); 

/*******************/

var PolicySchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },   
    content:{
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
    deleted_at: {

            type: String,
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




var PolicyInfo =  moongoose.model('tbl_privacy_policy',PolicySchema);


module.exports = {
    TeamMember:Teaminfo,
    Vision:Visioninfo,
    ProductInfo:Productinfo,
    RoadMapInfo:RoadMapInfo,
    GraphInfo:GraphInfo,
    TermsInfo:TermsInfo,
    PolicyInfo:PolicyInfo
};
