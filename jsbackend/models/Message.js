const mongoose=require('mongoose');
const crypto=require('crypto');
const { v1: uuidv1 } = require('uuid');
const { ObjectId } = mongoose.Schema;

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversation: {
        type:ObjectId,
        ref: 'conversations',
    },
    to: {
        type: ObjectId,
        ref: 'users',
    },
    from: {
        type:ObjectId,
        ref: 'users',
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports=mongoose.model("Message",messageSchema);