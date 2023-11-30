"use client";

import { ClientContext } from "@/context/ClientContext";
import { useContext } from "react";

export const useClientContext = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClientContext must be used within ClientProvider.");
  }

  return context;
};
