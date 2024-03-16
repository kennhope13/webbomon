const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Article';
const COLLECTION_NAME = 'articles';
const authorSchema = new Schema({
    article_name:{
        type:String,
        trim:true,
        maxLength:150
    },
    describe:{
        type:String,
        required:true
    },
    images: {
        type: String,
        require: true
    },
    slug:{
        type:String,
        required:true,
    },
    article_author: { 
        type: String,
    },
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, authorSchema);