import express from 'express';
import session from "express-session";
import Controller from "./controller.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(
    session({secret: "any string", resave: false, saveUninitialized: true,
            cookie: {secure: false}}));
app.use(express.json());

Controller(app);

app.listen(process.env.PORT || 4000);