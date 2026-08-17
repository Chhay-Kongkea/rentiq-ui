"use client";

import { useEffect, useRef } from "react";
import { loginWithKeycloak } from "./actions";

export default function LoginPage() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void loginWithKeycloak();
  }, []);

  return null;
}