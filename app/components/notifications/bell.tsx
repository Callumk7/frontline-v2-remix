import { BellIcon } from "@radix-ui/react-icons";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

export function NotificationBell({
	supabase,
	userId,
}: { supabase: SupabaseClient; userId: string }) {
	const [nCount, setNCount] = useState<number>(0);
	const notificationChannel = supabase
		.channel("notifications")
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
				table: "activity",
			},
			(payload) => {
				console.log(payload);
				setNCount(nCount + 1);
			},
		)
		.subscribe();

	return (
		<div className="relative">
			<div className="absolute top-2 right-2 p-3 text-white bg-red-500 rounded-full">
				{nCount}
			</div>
			<BellIcon />
		</div>
	);
}
