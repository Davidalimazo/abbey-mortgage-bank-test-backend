
import { Schema, model } from "mongoose";
import { IPost } from "./interfaces";

// Define the Comment Schema as a subdocument
const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false }); // Disable _id for subdocuments

// Define the Post Schema
const postSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        default: '',
    },
    comments: [commentSchema], // Array of comments
    likes: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Overdue'], // Enum for status
        default: 'In Progress',
    },
    assigned_to: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the Post model
const Post = model('Post', postSchema);

export default Post;
