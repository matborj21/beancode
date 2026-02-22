"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

type User = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: "CASHIER" | "BARISTA" | "ADMIN";
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
};

type FormErrors = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
};

const ROLES = ["CASHIER", "BARISTA", "ADMIN"] as const;

export function UserFormModal({ open, onClose, onSuccess, user }: Props) {
  const isEdit = !!user;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("CASHIER");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setUsername(user.username ?? "");
      setEmail(user.email ?? "");
      setPassword("");
      setRole(user.role);
    } else {
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("CASHIER");
    }
    setErrors({});
    setShowPassword(false);
  }, [user, open]);

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("User created successfully!");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!username.trim()) newErrors.username = "Username is required.";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address.";
    if (!isEdit && !password) newErrors.password = "Password is required.";
    else if (password && password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!role) newErrors.role = "Please select a role.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (isEdit && user) {
      updateUser.mutate({
        id: user.id,
        name,
        username,
        email: email || undefined,
        password: password || undefined,
        role,
      });
    } else {
      createUser.mutate({
        name,
        username,
        email: email || undefined,
        password,
        role,
      });
    }
  }

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900">
            {isEdit ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="e.g. Juan dela Cruz"
              className={errors.name ? "border-red-400" : ""}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username)
                  setErrors((p) => ({ ...p, username: undefined }));
              }}
              placeholder="e.g. juan123"
              className={errors.username ? "border-red-400" : ""}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Email{" "}
              <span className="font-normal text-amber-400">(optional)</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="e.g. juan@beancode.com"
              className={errors.email ? "border-red-400" : ""}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Password{" "}
              {isEdit && (
                <span className="font-normal text-amber-400">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                placeholder={isEdit ? "••••••••" : "Min. 6 characters"}
                className={errors.password ? "border-red-400 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Role
            </label>
            <Select
              value={role}
              onValueChange={(val) => {
                setRole(val as (typeof ROLES)[number]);
                if (errors.role) setErrors((p) => ({ ...p, role: undefined }));
              }}
            >
              <SelectTrigger className={errors.role ? "border-red-400" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-amber-200 text-amber-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 bg-amber-900 text-amber-50 hover:bg-amber-800"
            >
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
