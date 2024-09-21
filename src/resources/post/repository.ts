import { IMediator } from "../../lib/interfaces";
import { HttpStatus } from "../../lib/constants/http_status";
import {
	Comments,
	CreatePostDto,
	IPostRepository,
	IPostResonse,
	IUpdatePostModel,
} from "./interfaces";
import Post from "./model";
import { Types } from "mongoose";

class PostRepository extends IPostRepository {
	async getAllPost(): Promise<IMediator<IPostResonse[]>> {
		const allPost = await Post.find({});

		return {
			data: allPost || null,
			message: `Post record updated successfully`,
			status: HttpStatus.OK,
		};
	}
	async editPost(
		userId: string,
		editPostDto: IUpdatePostModel,
	): Promise<IMediator<IPostResonse | null>> {
		const oid = new Types.ObjectId(userId);
		const userPost = await Post.findOne({ assigned_to: oid });
		if (!userPost?.toObject({ flattenObjectIds: true }).assigned_to) {
			return {
				data: null,
				message: `Post record not found for this id: ${userId}`,
				status: HttpStatus.NOT_ACCEPTABLE,
			};
		}
		let updatedPost = await Post.findOneAndUpdate(
			{ assigned_to: oid }, // Criteria to find the post
			editPostDto, // Fields to update
			{ new: true, runValidators: true },
		).exec();

		return {
			data: updatedPost?.toObject({ flattenObjectIds: true }) || null,
			message: `Post record updated successfully`,
			status: HttpStatus.OK,
		};
	}
	deletePost(postId: string): Promise<IMediator<IPostResonse>> {
		throw new Error("Method not implemented.");
	}
	getAllUserPosts(
		userId: string,
		limit: number,
	): Promise<IMediator<IPostResonse[]>> {
		throw new Error("Method not implemented.");
	}
	getAPost(postId: string): Promise<IMediator<IPostResonse>> {
		throw new Error("Method not implemented.");
	}
	commentOnAPost(
		postId: string,
		userId: string,
	): Promise<IMediator<Comments[]>> {
		throw new Error("Method not implemented.");
	}
	likeAPost(
		userId: string,
		postId: string,
		action: boolean,
	): Promise<IMediator<IPostResonse>> {
		throw new Error("Method not implemented.");
	}

	async createPost({
		title,
		description,
		image_url,
		createdAt,
		updatedAt,
		comments,
		likes,
		status,
		assigned_to,
	}: CreatePostDto): Promise<IMediator<IPostResonse>> {
		try {
			// Create a new Post
			const newPost = new Post({
				title,
				description,
				image_url,
				createdAt,
				updatedAt,
				comments,
				likes,
				status,
				assigned_to,
			});

			// Save the new Post to the database
			const savedPost = await newPost.save();

			const post = savedPost.toObject();

			return {
				data: { id: post._id, ...post },
				message: "Success",
				status: HttpStatus.OK,
			};
		} catch (error) {
			throw error;
		}
	}
}

export default new PostRepository();
