import express from 'express';
import {createListing, deleteListing} from "../controllers/ListingController.js";
import {verifyUser} from "../utils/VerifyUser.js";

const listingRouter = express.Router();

listingRouter.post('/create', verifyUser, createListing);
listingRouter.delete('/delete/:id', verifyUser, deleteListing);

export default listingRouter;