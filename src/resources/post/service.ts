import { Request, Response } from "express";
import postRepository from "./repository";
import { HttpStatus } from "../../lib/constants/http_status";

class PostService {
	async createpost(req: Request, res: Response): Promise<any> {
		const { title, description, image_url, likes, status } = req.body;
		try {
			const data = await postRepository.createPost({
				title,
				description,
				image_url,
				status,
				userId: res.locals.user?.userId ?? "",
			});

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}

	async editPost(req: Request, res: Response): Promise<any> {
		const { post } = req.body;
		const { postId } = req.params;

		console.log("local user", res.locals.user?.userId);
		console.log(post)

		try {
			const data = await postRepository.editPost(
				postId,
				res.locals.user?.userId ?? "",
				post,
			);

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}

	async getAllPost(req: Request, res: Response): Promise<any> {
		const { pageSize, pageNumber } = req.body;
		try {
			const data = await postRepository.getAllPost();

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data?.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
	async getAPost(req: Request, res: Response): Promise<any> {
		const { pageSize, pageNumber } = req.query;
		const { postId } = req.body;

		try {
			const data = await postRepository.getAPost(postId);

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data?.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
	async getUserPost(req: Request, res: Response): Promise<any> {
		const { pageSize, pageNumber } = req.body;
		const { userId } = req.params;
		try {
			const data = await postRepository.getAllUserPosts(userId);

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data?.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
	async deletetPostById(req: Request, res: Response): Promise<any> {
		const { postId } = req.params;

		try {
			const data = await postRepository.deletePost(
				postId,
				res.locals.user?.userId ?? "",
			);

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data?.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
}

export default new PostService();
