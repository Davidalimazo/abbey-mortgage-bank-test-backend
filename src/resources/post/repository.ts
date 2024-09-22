import { IMediator } from "../../lib/interfaces";
import { HttpStatus } from "../../lib/constants/http_status";
import {
	Comments,
	CreatePostDto,
	IPostRepository,
	IPostResonse,
	IUpdatePostModel,
} from "./interfaces";

class PostRepository extends IPostRepository {
	async getAllPost(): Promise<IMediator<IPostResonse[]>> {
		return {
			data: [] || null,
			message: `Post record updated successfully`,
			status: HttpStatus.OK,
		};
	}
	async editPost(
		userId: string,
		editPostDto: IUpdatePostModel,
	): Promise<IMediator<IPostResonse | null>> {
		const userPost = null;
		if (!userPost) {
			return {
				data: null,
				message: `Post record not found for this id: ${userId}`,
				status: HttpStatus.NOT_ACCEPTABLE,
			};
		}
		let updatedPost = null;

		return {
			data: null,
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
	}: CreatePostDto): Promise<IMediator<IPostResonse>> {
		try {
			// Create a new Post
			const newPost = null;

			// Save the new Post to the database
			const savedPost = null;

			const post = null;

			return {
				data: {
					id: "",
					comments: [],
					createdAt,
					description: "",
					image_url: "",
					likes: 0,
					status: "In Progress",
					title: "",
					updatedAt: "",
				},
				message: "Success",
				status: HttpStatus.OK,
			};
		} catch (error) {
			throw error;
		}
	}
}

export default new PostRepository();
