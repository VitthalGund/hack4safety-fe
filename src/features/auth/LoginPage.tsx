"use client";
import { useState } from "react";
import type React from "react";

import { useLogin } from "@/src/api/apiHooks";
import { useAuthStore } from "@/src/state/authStore";
import { AlertCircle, Loader } from "lucide-react";

export const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();
  const { setUser } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { username, password },
      {
        onSuccess: (data) => {
          setUser(data.user);
          window.location.href = "/";
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Intelligence
          </h1>
          <p className="text-muted-foreground">
            Law Enforcement Analytics Platform
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle
                size={20}
                className="text-destructive flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-destructive">
                {(error as any)?.response?.data?.message ||
                  "Login failed. Please try again."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="user"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Username
              </label>
              <input
                id="user"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isPending ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">
                  admin@agency.gov
                </span>{" "}
                (All Access)
              </p>
              <p className="text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">
                  sp@agency.gov
                </span>{" "}
                (SP Role)
              </p>
              <p className="text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">
                  judge@agency.gov
                </span>{" "}
                (Judge Role)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Intelligence Platform v1.0 | Secure Law Enforcement Analytics
        </p>
      </div>
    </div>
  );
};
