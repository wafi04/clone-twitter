import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import React, { useState } from "react";
import { AuthFlow } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";
import { Github, TriangleAlert } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface Props {
  setState: (state: AuthFlow) => void;
}

const SignUpCard = ({ setState }: Props) => {
  const [pending, setPending] = useState<boolean>(false);
  const [name, setName] = useState("");
  const { signIn, signOut } = useAuthActions();
  const [erorr, setErorr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleProvider = (provider: "google") => {
    signIn(provider).finally(() => setPending(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErorr("Password Doesn't Match");
      return;
    }

    setPending(true);
    signIn("password", {
      name,
      email,
      password,
      flow: "signUp",
    })
      .catch(() => {
        setErorr("Something Went Wrong");
      })
      .finally(() => setPending(false));
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Register</CardTitle>
        <CardDescription>Use your email to Register</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!!erorr && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-x-2 text-sm">
            <TriangleAlert className="size-4" />
            {erorr}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={pending}
            placeholder="Full name"
            value={name}
            onChange={(E) => setName(E.target.value)}
            type="text"
            required
            className="w-full"
          />
          <Input
            disabled={pending}
            placeholder="Email"
            value={email}
            onChange={(E) => setEmail(E.target.value)}
            type="email"
            required
            className="w-full"
          />
          <Input
            placeholder="Password"
            type="password"
            disabled={pending}
            value={password}
            onChange={(E) => setPassword(E.target.value)}
            required
            className="w-full"
          />
          <Input
            placeholder="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(E) => setConfirmPassword(E.target.value)}
            required
            disabled={pending}
            className="w-full"
          />
          <Button type="submit" className="w-full" disabled={pending}>
            Sign In
          </Button>
        </form>
        <Separator className="my-4" />
        <Button
          className="w-full flex items-center justify-center gap-2 relative"
          onClick={() => handleProvider("google")}
          disabled={pending}
        >
          <FaGoogle className="size-5 absolute left-4 top-2.5" />
          Continue with Google
        </Button>

        <p className="text-xs text-muted-foreground ">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
