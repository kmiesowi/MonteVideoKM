import mongoose from "mongoose";

const video = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: [true]
    },
    videoTitle:{
        type: String,
        required: [true]
    },
    videoDescription:{
        type: String,
        required: [true]
    },
    tags:{
        type: String,
    },
    uploadedBy:{
        type: String,
        required: [true]
    },
    contactEmail:{
        type: String,
        required: [true]
    },
    archived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false, collection: 'videos'})

const Video = mongoose.model('video', video);

export default Video;