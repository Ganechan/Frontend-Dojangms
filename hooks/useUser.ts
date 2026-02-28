// hooks/useUser.ts
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import { getClientSession } from "@/lib/auth";

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getClientSession());
  }, []);

  return user;
}
