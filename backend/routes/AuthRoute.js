import express from "express";
import {googleAuth, signin, signOut, signup} from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/google', googleAuth);
authRouter.get('/signout', signOut);

export default authRouter;