import express from "express";
import {googleAuth, signin, signup} from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/google', googleAuth);

export default authRouter;