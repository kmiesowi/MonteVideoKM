import mongoose from "mongoose";

const user = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true]
    },
    lastName:{
        type: String,
        required: [true]
    },
    userName:{
        type: String,
        required: [true]
    },
    age:{
        type: Number,
    },
    email:{
        type: String,
        required: [true]
    },
    password:{
        type: String,
        required: [true]
    },
}, { timestamps: true, versionKey: false, collection: 'users'})

const User = mongoose.model('user', user);

export default User