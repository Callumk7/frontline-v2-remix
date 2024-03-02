import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { zx } from "zodix";

// schema for update form validation used by react-hook-form, and zodix
const updateUserSchema = z.object({
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().email(),
	username: z.string().min(4),
});

///
/// ACTION
///
export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	// zodix for formData validation
	const result = await zx.parseFormSafe(request, updateUserSchema);

	if (result.success) {
		const sResult = await supabase.auth.updateUser({
			email: result.data.email,
		});
		if (sResult.error) {
			throw new Error("supabase went wrong");
		}
		await db
			.update(users)
			.set({
				firstName: result.data.first_name,
				lastName: result.data.last_name,
				email: result.data.email,
				username: result.data.username,
			})
			.where(eq(users.id, session.user.id));
	}

	return json({ updated: true });
};

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const userProfile = await db.query.users.findFirst({
		where: eq(users.id, session.user.id),
	});

	if (!userProfile) {
		return redirect("/sign-up", { headers });
	}

	return json({ userProfile });
};

export default function ProfileRoute() {
	const { userProfile } = useLoaderData<typeof loader>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof updateUserSchema>>({
		resolver: zodResolver(updateUserSchema),
	});

	const fetcher = useFetcher();
	const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
		fetcher.submit(values, { method: "POST" });
	};

	return (
		<main className="mt-10">
			<Card>
				<CardHeader>
					<CardTitle>Personal Details</CardTitle>
					<CardDescription>
						Update your key information so others can find you.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
						<FormInputField
							label="First Name"
							type="text"
							name="first_name"
							register={register}
							error={errors.first_name?.message}
							defaultValue={userProfile.firstName ?? ""}
						/>
						<FormInputField
							label="Last Name"
							type="text"
							name="last_name"
							register={register}
							error={errors.last_name?.message}
							defaultValue={userProfile.lastName ?? ""}
						/>
						<FormInputField
							label="Email"
							type="email"
							name="email"
							register={register}
							error={errors.email?.message}
							defaultValue={userProfile.email}
						/>
						<FormInputField
							label="Username"
							type="text"
							name="username"
							register={register}
							error={errors.username?.message}
							defaultValue={userProfile.username}
						/>
						<Button
							type="submit"
							className={`transition-colors ease-in-out ${
								fetcher.state === "submitting" ? "bg-lime-500" : "bg-primary"
							}`}
						>
							Update
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}

interface FormInputFieldProps<T extends FieldValues> {
	name: keyof T;
	type?: string;
	label: string;
	placeholder?: string;
	register: UseFormRegister<T>;
	error?: string;
	defaultValue?: string;
}

function FormInputField({
	label,
	type = "text",
	placeholder,
	name,
	register,
	error,
	defaultValue,
}: FormInputFieldProps<z.infer<typeof updateUserSchema>>) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={name as string}>{label}</Label>
			<Input
				type={type}
				id={name as string}
				placeholder={placeholder}
				defaultValue={defaultValue}
				{...register(name)}
			/>
			<p className="min-h-4 text-sm font-medium leading-none text-destructive">
				{error && error}
			</p>
		</div>
	);
}
