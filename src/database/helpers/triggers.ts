const onTableUpdateTrigger = (table: string) => `
	CREATE TRIGGER ${table}_updated_at
	BEFORE UPDATE ON ${table}
	FOR EACH ROW
	EXECUTE PROCEDURE on_update_timestamp();
`;

export const onDocumentationUpdateTrigger = () => `
	CREATE TRIGGER no_locked_update
	BEFORE UPDATE ON documentation FOR EACH ROW
  EXECUTE PROCEDURE no_locked_update();
`;

module.exports = {
	onTableUpdateTrigger,
	onDocumentationUpdateTrigger,
};
