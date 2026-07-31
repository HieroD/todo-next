"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={className + " pr-12"}
        {...props}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeSlash /> : <Eye />}
      </button>
    </div>
  );
}
