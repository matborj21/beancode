"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    if (!login || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid username or password.");
      return;
    }

    // Fetch session to get role for redirect
    const sessionRes = await fetch("/api/auth/session");
    const session = (await sessionRes.json()) as { user?: { role?: string } };
    const role = session?.user?.role;

    if (role === "ADMIN") {
      router.push("/dashboard");
    } else {
      router.push("/mobile");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200"
          alt="Coffee background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-900/80 backdrop-blur-sm">
            <Coffee size={32} className="text-amber-50" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-50">BeanCode</h1>
            <p className="text-sm text-amber-300">Point of Sale System</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
          <h2 className="mb-6 text-center text-lg font-semibold text-amber-50">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/20 px-4 py-2 text-center text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-amber-200">
              Username or Email
            </label>
            <Input
              type="text"
              placeholder="Enter your username or email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="border-white/20 bg-white/10 text-amber-50 placeholder-amber-300/50"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-medium text-amber-200">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                className="border-white/20 bg-white/10 pr-10 text-amber-50 placeholder-amber-300/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300 hover:text-amber-50"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-amber-700 py-5 text-sm font-bold text-amber-50 hover:bg-amber-600"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-amber-400">
          BeanCode POS © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
