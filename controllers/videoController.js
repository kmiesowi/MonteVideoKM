import axios from 'axios';
import Video from '../models/video.js';
import dotenv from 'dotenv';
import urlRegex from 'url-regex'
import emailvalidator from 'email-validator';

dotenv.config();

// todo MOVE TO .ENV
let videosUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&key=${process.env.API_KEY}`

const vMethods = {
    async getRandomVideoFromYT(req, res) {
        const videos = await axios.get(videosUrl)
            .catch(err => console.error(err));
        videos.data.items.forEach(item => {
            const video = new Video({
                videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
                videoTitle: item.snippet.title,
                videoDescription: item.snippet.description,
                tags: item.snippet.tags ? item.snippet.tags.join() : '',
                uploadedBy: item.snippet.channelTitle,
                contactEmail: `${item.snippet.channelTitle.replace(/\ /g, ".")}@motorola.test`,
            })
            video.save();
        })
        res.send("Five random videos from Youtube added to database");
    },

    async getRandomVideo(req, res) {
        let count = req.query.hasOwnProperty('count') ? req.query.count : 5;
        let random = req.query.hasOwnProperty('random') ? req.query.random : false;
        let tag = req.query.hasOwnProperty('tag') ? req.query.tag : false;
        let selectedVideos = await selectVideo(count, random, tag);
        res.send(selectedVideos);
    },

    async addNewVideo(req, res) {
        let { videoUrl, videoTitle, videoDescription, tags, uploadedBy, contactEmail } = req.body;
        if (validateURL(videoUrl) && validateTitle(videoTitle) && validateTags(tags) && validateUploadedBy(uploadedBy) && validateEmail(contactEmail)) {
            tags = tags.replace(/#/g, " ");
            const newVideo = new Video({
                videoUrl, videoTitle, videoDescription, tags, uploadedBy, contactEmail
            });
            await newVideo.save();
            return res.send("Video has been added");
        }
        return res.send("Incorrect provided data");
    },

    async updateVideo(req, res) {
        const videoId = req.params.id;
        let existingVideo = await Video.findOne({
            _id: videoId
        });
        for (let key in req.body) {
            existingVideo[key] = req.body[key];
        }
        await existingVideo.save();
        res.send(existingVideo);
    }
}

async function selectVideo(count = 5, random = false, tag = "") {
    if (tag) {
        const regex = new RegExp(`(^|,| )(${tag})+(,| |$)`);
        return await Video.find({ tags: { $regex: regex, $options: 'gi' }, archived: false }).limit(parseInt(count));
    }

    if (random) {
        return await Video.aggregate([{
            $match: {
                archived: false
            }
        }, { $sample: { size: parseInt(count) } }])
    }
    return await Video.find({ archived: false }).limit(parseInt(count));
}

function validateURL(url) {
    if (url.includes('\n')) return false;
    return urlRegex({ exact: true }).test(url);
}
function validateTitle(title) {
    return title.length > 3 && !(title.includes('\n'));
}
function validateTags(tags) {
    const regex = new RegExp('^#');
    return regex.test(tags) || !tags.length;

}
function validateUploadedBy(uploadedBy) {
    return uploadedBy.length > 3 && !(uploadedBy.includes('\n'));
}

function validateEmail(email) {
    return emailvalidator.validate(email);
}


export default vMethods;