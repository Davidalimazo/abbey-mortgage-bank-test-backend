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
			table.increments();
			table.uuid("idUser");
			table.uuid("postId").unique();
			table.string("title");
			table.string("description");
			table.string("image_url");
			table
				.enum("status", ["In Progress", "Completed", "Overdue"])
				.notNullable();
			table
				.foreign("idUser", "user_id_f_key")
				.references("userId")
				.inTable("users")
				.onUpdate("CASCADE")
				.onDelete("CASCADE");

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
