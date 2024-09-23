import db from "../../database";
import { CreatePostDto, IPost } from "./interfaces";

class PostDAO {
	async createPost(postDto: CreatePostDto) {
		const data = await db<IPost>("posts")
			.insert({
				...postDto,
			})
			.returning("*");
		return data[0];
	}

	async findPostByUserId({ userId }: { userId: string }) {
		const post = await db<IPost>("posts").where("userId", userId);
		return post;
	}

	async findAllPost() {
		const post = await db<IPost>("posts").select("*");
		return post;
	}

	async findPostById({ postId }: { postId: string }) {
		const post = await db<IPost>("posts").where("postId", postId);
		return post[0];
	}

	async updatePost({
		post,
		postId,
	}: {
		post: Partial<IPost>;
		postId: string;
	}) {
		const updatedpost = await db<IPost>("posts")
			.where({ postId })
			.update(post)
			.returning("*");
		return updatedpost[0];
	}

	async deletePost({ postId }: { postId: string }) {
		return db<IPost>("posts")
			.del()
			.where("postId", postId)
			.returning("*")
			.returning("postId");
	}
}

export default new PostDAO();
