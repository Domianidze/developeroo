"use client";

import { type ReactNode, useState } from "react";

export interface LoaderRenderProps {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

interface LoaderProps {
  children: (props: LoaderRenderProps) => ReactNode;
  initialLoading?: boolean;
}

export function Loader({ children, initialLoading = false }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  return children({
    isLoading,
    startLoading: () => setIsLoading(true),
    stopLoading: () => setIsLoading(false),
  });
}
