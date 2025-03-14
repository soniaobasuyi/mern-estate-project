import express from 'express';
import {
    createListing,
    deleteListing,
    getListing,
    searchListings,
    updateListing
} from "../controllers/ListingController.js";
import {verifyUser} from "../utils/VerifyUser.js";

const listingRouter = express.Router();

listingRouter.post('/create', verifyUser, createListing);
listingRouter.delete('/delete/:id', verifyUser, deleteListing);
listingRouter.post('/update/:id', verifyUser, updateListing);
listingRouter.get('/getListing/:id', getListing);
listingRouter.get('/get', searchListings);

export default listingRouter;