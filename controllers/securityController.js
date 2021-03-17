import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import userController from './userController.js';
dotenv.config();

const tokenMethod = {
    authenticateToken(req, res, next) {
        // Gather the jwt access token from the request header
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401) // if there isn't any token
    
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(401)
          req.user = user
          next();
        })
      },
      async refresh(req, res) {
        const refreshToken = req.body.token;
        if (refreshToken == null) return res.sendStatus(401);
        if (!User.find({refreshToken : refreshToken})) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = userController.generateToken({ email: user.email });
          res.json({ authorizationToken: accessToken });
        })
      }
}

export default tokenMethod;