import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.js'
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from 'dotenv';
import path from 'path';
import favicon from 'serve-favicon';
import cors from 'cors';

dotenv.config();
const app = express()

const dbURI = process.env.CONNECTION_STRING;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            swagger: "2.0",
            title: "MonteVideo API - K,D,M,W",
            version: "1.0.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
        },
        components : {
            securitySchemes: {
                Bearer: {
                    type: "http",
                    name: "Authorization",
                    in: "header",
                    scheme: "bearer"
                }
            },
        }
    },
    apis: ["./routes/routes.js"],
};

console.log(path.resolve());
app.use(cors());
app.use(favicon(path.join(path.resolve(), '/public', 'favicon.ico')))
app.use(express.json());
app.use('/', routes)
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const specs = await swaggerJsdoc(options);
        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(specs)
        );
        app.listen(8080, () => {
            console.log("Server started at localhost: 8080");
        });
    })
    .catch(error => console.error(error));
