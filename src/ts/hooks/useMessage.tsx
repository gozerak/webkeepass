import { useState } from 'react';

export const useMessage = () => {
    const [message, setMessage] = useState<{ text: string, isError: boolean } | null>(null);

    const showMessage = (text: string, isError = false) => {
        setMessage({ text, isError });
        setTimeout(() => setMessage(null), 2000);
    };

    return { message, showMessage };
};