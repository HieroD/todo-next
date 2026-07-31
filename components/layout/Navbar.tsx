"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Navbar() {
  const { data: session } = useSession();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Todo App</h1>
          <div className="flex items-center gap-4">
            {session?.user && (
              <span className="text-sm text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLogoutOpen(true)}
            >
              <SignOut />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
