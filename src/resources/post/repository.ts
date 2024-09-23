import { IMediator } from "../../lib/interfaces";
import { HttpStatus } from "../../lib/constants/http_status";
import {
	Comments,
	CreatePostDto,
	IPost,
	IPostRepository,
	IUpdatePostModel,
} from "./interfaces";
import { POST_STATUS } from "../../lib/enums/post.enum";
import PostDAO from "./dao";
import { v4 } from "uuid";

class PostRepository extends IPostRepository {
	async getAllPost(): Promise<IMediator<IPost[]>> {
		const posts = await PostDAO.findAllPost();
		return {
			data: posts,
			message: `successful`,
			status: HttpStatus.OK,
		};
	}
	async editPost(
		postId: string,
		userId: string,
		editPostDto: Partial<IPost>,
	): Promise<IMediator<IPost | null>> {
		const userPost = await PostDAO.findPostById({ postId });

		if (!userPost) {
			return {
				data: null,
				message: `Post record not found for this id: ${postId}`,
				status: HttpStatus.NOT_ACCEPTABLE,
			};
		}
		console.log("post owner", userPost.userId);
		if (userPost.userId === userId) {
			let updatedPost = await PostDAO.updatePost({
				postId,
				post: editPostDto,
			});

			return {
				data: updatedPost,
				message: `Post record updated successfully`,
				status: HttpStatus.OK,
			};
		}

		return {
			data: null,
			message: `Operation not allowed`,
			status: HttpStatus.NOT_ACCEPTABLE,
		};
	}
	async deletePost(
		postId: string,
		userId: string,
	): Promise<IMediator<string | null>> {
		const userPost = await PostDAO.findPostById({ postId });

		if (!userPost) {
			return {
				data: null,
				message: `Post record not found for this id: ${postId}`,
				status: HttpStatus.NOT_ACCEPTABLE,
			};
		}

		if (userPost.userId === userId) {
			const posts = await PostDAO.deletePost({ postId });
			return {
				data: posts[0].postId,
				message: `successful`,
				status: HttpStatus.OK,
			};
		}
		return {
			data: null,
			message: `Operation not allowed`,
			status: HttpStatus.NOT_ACCEPTABLE,
		};
	}
	async getAllUserPosts(
		userId: string,
		limit?: number,
	): Promise<IMediator<IPost[]>> {
		const posts = await PostDAO.findPostByUserId({ userId });
		return {
			data: posts,
			message: `successful`,
			status: HttpStatus.OK,
		};
	}
	async getAPost(postId: string): Promise<IMediator<IPost>> {
		const posts = await PostDAO.findPostById({ postId });
		return {
			data: posts,
			message: `successful`,
			status: HttpStatus.OK,
		};
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
	): Promise<IMediator<IPost>> {
		throw new Error("Method not implemented.");
	}

	async createPost(postDTO: CreatePostDto): Promise<IMediator<IPost>> {
		try {
			// Create a new Post
			const newPost = await PostDAO.createPost({
				...postDTO,
				postId: v4(),
			});

			return {
				data: newPost,
				message: "Success",
				status: HttpStatus.OK,
			};
		} catch (error) {
			throw error;
		}
	}
}

export default new PostRepository();
