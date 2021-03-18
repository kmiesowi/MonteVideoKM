import express from "express";
import userController from '../controllers/userController.js'
import videoController from '../controllers/videoController.js'
import securityController from '../controllers/securityController.js'

const router = express.Router();
/**
 * @swagger
 * paths:
 *  /refresh:
 *   post:
 *      description: Add new user to database.
 *      tags:
 *        - User
 *      responses:
 *       200: 
 *        description: Successful operation
 *       401: 
 *        description: Unauthorized. Incorrect refresh token.
 *      requestBody:
 *       description: Get new access token for user
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           refreshToken:
 *            type: string
 *            description: User unique refresh token
 *         example:
 *          token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpLb3dhbEBnbWFpbC5jb20iLCJpYXQiOjE2MTYwNjk2OTZ9.Bn5lI5n4phk2IvJNSKRXTBSs14K84bpYyczIxunjxOk
 */
 router.post('/refresh',securityController.refresh);
/**
 * @swagger
 * paths:
 *  /add-user:
 *   post:
 *      description: Add new user to database.
 *      tags:
 *        - User
 *      responses:
 *       200: 
 *        description: Successful operation
 *      requestBody:
 *       description: Create a default user
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/definitions/User'
 *         example:
 *          firstName: Jan
 *          lastName: Kowalski
 *          userName: JKowal
 *          age: 23
 *          email: JKowal@gmail.com
 *          password: abc123 
 */
router.post('/add-user', userController.addUser);
/**
 * @swagger
 * paths:
 *  /login:
 *   post:
 *      description: Log user to account
 *      tags:
 *        - User
 *      responses:
 *       200: 
 *        description: Successful operation
 *      requestBody:
 *       description: Log user to account
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/definitions/LoginUser'
 *         example:
 *          email: JKowal@gmail.com
 *          password: abc123 
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * paths:
 *  /logout:
 *   get:
 *      description: Logout user
 *      tags:
 *        - User
 *      security:
 *       - Bearer: []
 *      responses:
 *       200: 
 *        description: Successful operation
 */
 router.get('/logout', securityController.authenticateToken, userController.logoutUser);

/**
 * @swagger
 * paths:
 *  /yt/add-video:
 *   get:
 *      description: Get random videos from You Tube.
 *      tags:
 *        - Video
 *      responses:
 *       200: 
 *        description: Successful operation
 */

router.get('/yt/add-video', videoController.getRandomVideoFromYT);
/**
 * @swagger
 * paths:
 *  /:
 *   get:
 *      description: Get five random videos from database
 *      tags:
 *        - Video
 *      responses:
 *       200: 
 *        description: Successful operation
 */
router.get('/', videoController.getRandomVideo);
/**
 * @swagger
 * paths:
 *  /api/videos:
 *   get:
 *      description: Get video with specific parameters.
 *      tags:
 *        - Video
 *      responses:
 *       200: 
 *        description: Successful operation
 *      parameters:
 *          - name: random
 *            in: query
 *            required: false
 *            description: Use of random parameter allows to get randomly selected videos
 *            schema:
 *              type: boolean
 *          - name: tag
 *            in: query
 *            required: false
 *            description: tags needs to be entered without hash
 *            schema:
 *              type: string
 *          - name: count
 *            in: query
 *            required: false
 *            description: Number of received movies
 *            schema:
 *              type: number 
 */

router.get('/api/videos', videoController.getRandomVideo);
/**
 * @swagger
 * paths:
 *  /api/videos:
 *   post:
 *      description: Add new video to database
 *      tags:
 *        - Video 
 *      security:
 *       - Bearer: []
 *      responses:
 *       200: 
 *        description: Successful operation
 *       401: 
 *        description: Users is unauthorized. Fill authorize field by correct token.
 *      requestBody:
 *       description: Add video to database
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/definitions/Video'
 *         example:
 *          videoUrl: https://www.youtube.com/watch?v=c79E-t7j4CE
 *          videoTitle: Rafał Brzoza
 *          videoDescription: Eurovision 2021
 *          tags: '#OK'
 *          uploadedBy: rafciuxD
 *          contactEmail: raf@gmail.com 
 */

router.post('/api/videos', securityController.authenticateToken,videoController.addNewVideo);

/**
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      firstName:
 *       type: string
 *       description: String value of user first name
 *      lastName:
 *       type: string
 *       description: String value of user last name
 *      userName:
 *       type: string
 *       description: String value of username
 *      age:
 *       type: number
 *       description: Number value of user age
 *      email:
 *       type: string
 *       description: String value of unique user email
 *      password:
 *       type: string
 *       description: String value of user password
 *    required:
 *     - firstName
 *     - lastName
 *     - userName
 *     - email
 *     - password
 *  LoginUser:
 *    type: object
 *    properties:
 *      email:
 *       type: string
 *       description: String value of unique user email
 *      password:
 *       type: string
 *       description: String value of user password
 *    required:
 *     - email
 *     - password
 *  Video:
 *    type: object
 *    properties:
 *      videoUrl:
 *       type: string
 *       description: New video url
 *      videoTitle:
 *       type: string
 *       description: New video title
 *      videoDescription:
 *       type: string
 *       description: New video description
 *      tags:
 *       type: string
 *       description: New video tags
 *      uploadedBy:
 *       type: string
 *       description: Video editor
 *      contactEmail:
 *       type: string
 *       description: Editor email
 *    required:
 *     - videoUrl
 *     - videoTitle
 *     - videoDescription
 *     - uploadedBy
 *     - contactEmail
*/

router.put('/video/:id', securityController.authenticateToken, videoController.updateVideo);

/**
 * @swagger
 * paths:
 *  /video/{videoId}:
 *   put:
 *      description: Update video in database
 *      tags:
 *        - Video
 *      security:
 *       - Bearer: []
 *      responses:
 *       200: 
 *        description: Successful updating
 *       401: 
 *        description: Users is unauthorized. Fill authorize field by correct token.
 *      parameters:
 *          - name: videoId
 *            in: path
 *            required: true
 *            description: videoId
 *            schema:
 *              type: string
 *      requestBody:
 *       description: Add video to database
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/definitions/VideoUpdate'
 *         example:
 *          videoTitle: update-Marek
 *          videoDescription: Updated
 *          uploadedBy: rafciuxD
 */

/**
 * @swagger
 * definitions:
 *  VideoUpdate:
 *    type: object
 *    properties:
 *      videoUrl:
 *       type: string
 *       description: New video url
 *      videoTitle:
 *       type: string
 *       description: New video title
 *      videoDescription:
 *       type: string
 *       description: New video description
 *      tags:
 *       type: string
 *       description: New video tags
 *      uploadedBy:
 *       type: string
 *       description: Video editor
 *      contactEmail:
 *       type: string
 *       description: Editor email
 *    required:
*/

/**
 * @swagger
 * paths:
 *  /user/video/{videoId}:
 *   post:
 *      description: Add video as my favourites video
 *      tags:
 *        - Video
 *      security:
 *       - Bearer: []
 *      responses:
 *       200: 
 *        description: Successful addding
 *       401: 
 *        description: Users is unauthorized. Fill authorize field by correct token.
 *      parameters:
 *          - name: videoId
 *            in: path
 *            required: true
 *            description: videoId
 *            schema:
 *              type: string
 */

router.post('/user/video/:id', securityController.authenticateToken, userController.addFavouritesVideo);

/**
 * @swagger
 * paths:
 *  /user/videos:
 *   get:
 *      description: Show my favourites video
 *      tags:
 *        - Video
 *      security:
 *       - Bearer: []
 *      responses:
 *       200: 
 *        description: Success!
 *       401: 
 *        description: Users is unauthorized. Fill authorize field by correct token.
 */

router.get('/user/videos', securityController.authenticateToken, userController.getFavouritesVideo);

export default router;