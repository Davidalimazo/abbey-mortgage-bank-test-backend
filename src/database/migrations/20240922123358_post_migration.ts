/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.up = async function up(knex) {
	return knex.schema.createTable(
		"posts",
		//@ts-ignore
		(table) => {
			table.uuid("postId").primary(); // Auto-increment primary key for posts
			table.uuid("userId"); // Foreign key column
			table.string("title");
			table.string("description");
			table.string("image_url");
			table
				.enum("status", ["In Progress", "Completed", "Overdue"])
				.notNullable();
			table
				.foreign("providerId", "user_post_id_f_key")
				.references("userId") // References the userId in the users table
				.inTable("users")
				.onUpdate("CASCADE") // If userId is updated, update posts as well
				.onDelete("CASCADE"); // If user is deleted, delete related posts

			table.timestamps(false, true);
		},
	);
	//	.then(() => knex.raw(onTableUpdateTrigger("posts")));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.down = async function down(knex) {
	return knex.schema.dropTable("posts");
};
