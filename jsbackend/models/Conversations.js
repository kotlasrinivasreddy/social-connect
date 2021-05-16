const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v1: uuidv1 } = require('uuid');
const { ObjectId } = mongoose.Schema;


// Create Schema for Users
const ConversationSchema = new Schema({
    recipients: [{ type: ObjectId, ref: 'users' }],
    lastMessage: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
module.exports=mongoose.model("Conversations",ConversationSchema);