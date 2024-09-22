/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.up = async function up(knex) {
	return knex.schema.createTable(
		"post_reactions",
//@ts-ignore
		(table) => {
			table.uuid("postReactionId").primary();
			table.uuid("userId");
			table.uuid("postId");
			table.integer("like");
			table.integer("dislike");
            table
            .foreign("userId", "user_post_rk_id_f_key")
            .references("userId")
            .inTable("users")
            .onUpdate("CASCADE");
        table
            .foreign("postId", "post_post_rk_id_f_key")
            .references("postId")
            .inTable("posts")
            .onUpdate("CASCADE");
			table.timestamps(false, true);
		},
	)
	//.then(() => knex.raw(onTableUpdateTrigger("post_reactions")));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.down = async function down(knex) {
	return knex.schema.dropTable("post_reactions");
};
