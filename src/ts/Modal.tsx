import React, { useEffect } from "react";


//модалка, которая используется для вывода попапже
export default function Modal({ isOpen, onClose, children, width }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode,
    width: string
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Оверлей */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
  
        {/* Модальное окно */}
        <div
          className={`relative bg-white border rounded-md p-5 w-${width} h-fit max-x-3/4 overflow-auto z-10`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Кнопка закрытия */}
          <button
            className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            X
          </button>
                {children}
            </div>
        </div>
    );
}