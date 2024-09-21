import { model, Schema } from "mongoose";
import { IUser } from "./interfaces";

// Define the User Schema
const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		profile_picture: {
			type: String,
		},
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User", // Reference to the User model
			},
		],
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Post", // Assuming you have a Post model
			},
		],
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields
	},
);

// Create the User model
const User = model("User", userSchema);

export default User;
