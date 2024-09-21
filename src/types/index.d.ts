import { IUserResponse } from "../resources/users/interfaces";

declare module "express-serve-static-core" {
	interface Locals {
		user: IUserResponse | null;
	}
}
