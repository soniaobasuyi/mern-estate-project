import express from 'express';
import {createListing} from "../controllers/ListingController.js";
import {verifyUser} from "../utils/VerifyUser.js";

const listingRouter = express.Router();

listingRouter.post('/create', verifyUser, createListing);

export default listingRouter;