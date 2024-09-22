/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.up = async function up(knex) {
	return knex.schema
		.createTable(
			"comments",
//@ts-ignore
			(table) => {
				table.increments();
				table.uuid("userId");
				table.uuid("postId");
				table.string("commentId");
				table.string("comment");
				table
					.foreign("userId", "user_comment_id_f_key")
					.references("userId")
					.inTable("users")
					.onUpdate("CASCADE");
				table
					.foreign("postId", "post_comment_id_f_key")
					.references("postId")
					.inTable("posts")
					.onUpdate("CASCADE");
				table.timestamps(false, true);
			},
		)
	//	.then(() => knex.raw(onTableUpdateTrigger("comments")));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//@ts-ignore
exports.down = async function down(knex) {
	return knex.schema.dropTable("comments");
};
