import express from "express";
import PostingCountroller from "./controller"

const PostingRouter = express.Router();

PostingRouter.get("/id/:id", PostingCountroller.getPostingByPersonalNo)
PostingRouter.post("/upload-records", PostingCountroller.upload)
PostingRouter.get("/all", PostingCountroller.getAllPosting)
PostingRouter.get("/current-posting/:id", PostingCountroller.findCurrentPosting)
//PostingRouter.post("/personnel/search", PostingCountroller.getPostingsByCriteria)

export default PostingRouter;
