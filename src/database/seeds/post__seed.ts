//@ts-ignore
exports.seed = async function seed(knex) {
	await knex("posts").insert([
		{
			idUser: "3168001f-903e-4f37-b320-0a0c757def9e", // Matches userId from users table
			postId: "d371b2f3-f485-4959-82f2-1ad974fb18a0",
			title: "Out here chilling",
			description: "Why you want to know",
			image_url: "image_url",
			status: "In Progress",
		},
		{
			idUser: "92b9b12a-4dcc-4325-9da0-054f81dc9f90", // Matches userId from users table
			postId: "394e9a06-ce0c-43e0-831f-61a627421a27",
			title: "Gaming my way through",
			description: "Playing some games to cool off",
			image_url: "image_url",
			status: "Overdue",
		},
	]);
};
