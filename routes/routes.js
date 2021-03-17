import express from "express";
import userController from '../controllers/userController.js'
import videoController from '../controllers/videoController.js'
import securityController from '../controllers/securityController.js'

const router = express.Router();
/**
 * @swagger
 * paths:
 *  /add-user:
 *   post:
 *      description: Add new user to database.
 *      tags:
 *        - Add new user
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
 *        - Login
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
router.get('/yt/add-video', videoController.getRandomVideoFromYT);
/**
 * @swagger
 * paths:
 *  /:
 *   get:
 *      description: Get five random videos from database
 *      tags:
 *        - Get five random videos
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
 *        - Use parameters to get video
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
 *        - Add Video 
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
 *        - Update Video
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

export default router;