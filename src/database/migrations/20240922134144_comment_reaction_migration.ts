/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.up = async function up(knex) {
	return knex.schema.createTable(
		"comment_reactions",
		//@ts-ignore
		(table) => {
			table.increments();
			table.uuid("userId");
			table.uuid("postId");
			table.uuid("commentReactionId");
			table.integer("like");
			table.integer("dislike");
			table
				.foreign("userId", "user_comment_rk_id_f_key")
				.references("userId")
				.inTable("users")
				.onUpdate("CASCADE");
			table
				.foreign("postId", "post_comment_rk_id_f_key")
				.references("postId")
				.inTable("posts")
				.onUpdate("CASCADE");
			table.timestamps(false, true);
		},
	);
	//	.then(() => knex.raw(onTableUpdateTrigger("comment_reactions")));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.down = async function down(knex) {
	return knex.schema.dropTable("comment_reactions");
};
