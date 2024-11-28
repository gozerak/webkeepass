import React, { useEffect } from "react";


//модалка, которая используется для вывода попапже
export default function Modal({ isOpen, onClose, children }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}) {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="bg-white border-2 h-2/3 mt-2 w-1/3 fixed top-1/12 left-1/3">
            <div className="p-3 overflow-auto " onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-3 right-5 " onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}