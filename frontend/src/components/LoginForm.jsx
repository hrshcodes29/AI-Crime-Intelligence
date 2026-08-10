import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

import Logo from "./Logo";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl">
      <Logo />

      <div className="space-y-5">
        <div>
          <Label className="mb-2 text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Enter your email"
              className="pl-10 bg-slate-900/70 border-slate-700 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 text-white">Password</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-10 pr-10 bg-slate-900/70 border-slate-700 text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button className="w-full bg-cyan-500 hover:bg-cyan-400">
          Secure Login
        </Button>
      </div>
    </Card>
  );
}