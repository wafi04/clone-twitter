import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthActions } from "@convex-dev/auth/react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import { Github, TriangleAlert } from "lucide-react";
import { AuthFlow } from "../types";
import { error } from "console";

interface Props {
  setState: (state: AuthFlow) => void;
}

const SignInCard: React.FC<Props> = ({ setState }) => {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [erorr, setErorr] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuthActions();

  const handleProvider = (provider: "google") => {
    setPending(true);
    signIn(provider).finally(() => setPending(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", {
      email,
      password,
      flow: "signIn",
    })
      .catch(() => {
        setErorr("Invalid Email Or Password");
      })
      .finally(() => setPending(false));
  };

  return (
    <Card className="w-full shadow-lg p-3">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Login to Continue</CardTitle>
        <CardDescription>Use your email to login</CardDescription>
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
            placeholder="Email"
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full"
          />
          <Input
            placeholder="Password"
            type="password"
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
