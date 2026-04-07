import { useState } from "react";

export function useMessage() {
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const showMessage = (text: string, isError: boolean = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  return { message, showMessage };
}