const mongoose= require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

//creating model with mongoose and naming it as post_schema and exporting it
//here model name is post_schema, we can create new post_schema object using it
//mongoose is Object Data Modeling b/w nodejs and mongoDB
module.exports= mongoose.model("post_schema", postSchema);
