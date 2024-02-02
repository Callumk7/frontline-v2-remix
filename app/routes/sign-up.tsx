import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createServerClient } from "@/features/auth/supabase/supabase.server";
import { Container } from "@/features/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users";
import { UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { zx } from "zodix";

// Used with react-hook-form, and zodix
const signupSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(5),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

///
/// ACTION
///
export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, signupSchema);

  const { supabase, headers } = createServerClient(request);
  if (result.success) {
    const res = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
    });

    if (res.error) {
      return json({ failure: res.error });
    }

    // I need to ensure that this happens!!
    const dbResult = await db.insert(users).values({
      username: result.data.username,
      email: result.data.email,
      password: result.data.password,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      id: res.data.user!.id, // this is from supabase
    });

    console.log(dbResult)

    return redirect("/sign-up-confirmation", { headers });
  } else return json({ failure: result.error });
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema) });

  const fetcher = useFetcher();

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    fetcher.submit(values, { method: "POST" });
  };

  console.log(watch("email"));

  return (
    <Container className="mt-10 flex h-[80vh] flex-col items-center justify-center">
      <form className="flex w-2/3 flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          name="email"
          label="Email"
          placeholder="What email do you want to use?"
          register={register}
          error={errors.email?.message}
        />
        <FormInputField
          name="password"
          type="password"
          label="Password"
          placeholder="Choose a password, make it a good one"
          register={register}
          error={errors.password?.message}
        />
        <FormInputField
          name="username"
          label="Username"
          placeholder="Pick something awesome"
          register={register}
          error={errors.username?.message}
        />
        <FormInputField
          name="firstName"
          label="First Name"
          placeholder="This is not required"
          register={register}
          error={errors.firstName?.message}
        />
        <FormInputField
          name="lastName"
          label="Last Name"
          placeholder="This is not required"
          register={register}
          error={errors.lastName?.message}
        />
        <Button>{fetcher.state === "idle" ? "Sign Up" : <UpdateIcon className="animate-spin" />}</Button>
      </form>
    </Container>
  );
}

interface FormInputFieldProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<z.infer<typeof signupSchema>>;
  error?: string;
}

function FormInputField({
  label,
  type = "text",
  placeholder,
  name,
  register,
  error,
}: FormInputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input type={type} id={name} placeholder={placeholder} {...register(name)} />
      <p className="min-h-4 text-sm font-medium leading-none text-destructive">
        {error && error}
      </p>
    </div>
  );
}
