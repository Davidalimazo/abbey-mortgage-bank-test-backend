//@ts-ignore
exports.seed = async function seed(knex) {
	await knex("users").insert([
		{
			userId: "3168001f-903e-4f37-b320-0a0c757def9e",
			email: "okechukwu.aneke@test2.com",
			userType: "admin",
			firstName: "Okechukwu",
			lastName: "Aneke",
			isEmailVerified: true,
			city: "lagos",
			avatarUrl: "",
			username: "",
			state: "ikeja",
			gender: "male",
			phoneNumber: "09012345678",
			dateOfBirth: "1992-10-23",
			password: "$2a$12$cJ4MW9TvDWD/1wLKLiodSOqzQioBGWlqBTE4S2Et41HHIb0dIdOHW",
		},
		{
			userId: "92b9b12a-4dcc-4325-9da0-054f81dc9f90",
			email: "aluka.chiama@test2.com",
			userType: "user",
			firstName: "Aluka",
			lastName: "Chiama",
			isEmailVerified: true,
			city: "lagos",
			avatarUrl: "",
			username: "",
			state: "ikeja",
			gender: "male",
			phoneNumber: "09012345678",
			dateOfBirth: "1992-10-23",
			password: "$2a$12$cJ4MW9TvDWD/1wLKLiodSOqzQioBGWlqBTE4S2Et41HHIb0dIdOHW",
		},
	]);
};
