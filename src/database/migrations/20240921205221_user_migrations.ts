//@ts-ignore
const onTableUpdateTrigger = (table) => `
	CREATE TRIGGER ${table}_updated_at
	BEFORE UPDATE ON ${table}
	FOR EACH ROW
	EXECUTE PROCEDURE on_update_timestamp();
`;

const onDocumentationUpdateTrigger = () => `
	CREATE TRIGGER no_locked_update
	BEFORE UPDATE ON documentation FOR EACH ROW
  EXECUTE PROCEDURE no_locked_update();
`;
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.up = async function up(knex) {
	return knex.schema.createTable(
		"users",
		//@ts-ignore
		(table) => {
			table.increments();
			table.uuid("userId").unique();
			table.string("firstName");
			table.string("middleName");
			table.string("lastName");
			table.string("username");
			table.enum("userType", ["admin", "user", "vip"]).notNullable();
			table.string("email").unique();
			table.string("city");
			table.string("state");
			table.string("password");
			table.boolean("isEmailVerified").defaultTo(true);
			table.boolean("isActivated").defaultTo(true);
			table.string("gender");
			table.string("phoneNumber");
			table.date("dateOfBirth");
			table.string("avatarUrl");
			table.timestamps(false, true);
		},
	);
	//	.then(() => knex.raw(onTableUpdateTrigger("users")));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//@ts-ignore
exports.down = async function down(knex) {
	return knex.schema.dropTable("users");
};
