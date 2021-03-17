import axios from 'axios';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const options = {
    async addUser(req, res){
        const existingUser = await findEmail(req.body.email);
        if(existingUser) {
            return res.send("Such a person is already registered");
        };
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            age: req.body.age,
            email: req.body.email,
            password: hashedPassword
        })

        const result = await user.save()
        res.send(result) 
    },

    async loginUser(req, res){
        const existingUser = await findEmail(req.body.email);
        if(!existingUser) {
            return res.send("Such user does not exist");
        };

        const foundPassword = await findPassword(req.body.email);

        if(!await bcrypt.compare(req.body.password, foundPassword)) {
            return res.send("Invalid password");
        };
        
        const user = {
            email: req.body.email
        }

        res.json({
            authorizationToken: giveToken(user)
        })
    }
}

async function findEmail(email){
    const result = await User.findOne({
        email: email
    });
    return result;
}

async function findPassword(email){
    const result = await User.findOne({
        email: email
    });
    return result.password;
}

function giveToken(person){
    return jwt.sign(person, process.env.TOKEN_SECRET);
}





export default options;