"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from "react";

export default function LottieAnimation({ src, className }: { src: string, className?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className={className || "w-64 h-64 mx-auto mb-8"}></div>;

  return (
    <div className={className || "w-64 h-64 mx-auto mb-8 flex items-center justify-center"}>
      <DotLottieReact src={src} loop autoplay />
    </div>
  );
}
