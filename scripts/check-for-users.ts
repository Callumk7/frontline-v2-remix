import { createClient } from "@supabase/supabase-js";
import { db } from "db";
import { users } from "db/schema/users";

async function checkForUsers() {
	const supabaseUrl = "https://otdzzteisacxicddlwlb.supabase.co";
	const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
	const supabase = createClient(supabaseUrl, supabaseKey);

	const allUsers = await supabase.auth.admin.listUsers()

	const sbUserIds = allUsers.data.users.map(user => user.id);
	const dbUsers = await db.select({id: users.id}).from(users).then(result => result.map(u => u.id));

	const onlyInSb = sbUserIds.filter(e => !dbUsers.includes(e));
	console.log("Only in supabase auth")
	console.log(onlyInSb)
	const onlyInDb = dbUsers.filter(e => !sbUserIds.includes(e));
	console.log("Only in database")
	console.log(onlyInDb)

	const result = onlyInSb.concat(onlyInDb);

	console.log(result)
}

checkForUsers();
