"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  // This function is called when the form is submitted.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optionally, add authentication logic here.
    router.push("/contracts");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to Account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter credentials below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          {/* TODO: Add `required` to the input below */}
          <Input id="email" type="email" placeholder="your@email.com"/>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          {/* TODO: Add `required` to the input below */}
          <Input id="password" type="password"/>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        👋 {"\u00A0"}{"\u00A0"}
        <a href="/auth/signup" className="underline underline-offset-4">
          I don´t have a Snapture account{" "}
        </a>
      </div>
    </form>
  );
}
