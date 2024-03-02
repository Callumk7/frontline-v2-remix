import { eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export const isFalse = (column: PgColumn) => {
	return eq(column, false);
};
