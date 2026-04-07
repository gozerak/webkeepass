import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddEntry from "./AddEntry";
import { FoldersData } from "./Services/apiService";
import { Key, LogOut, User } from "lucide-react";

function HeaderName() {
  return (
    <div className="flex items-center gap-2 pl-6">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <Key className="w-5 h-5 text-white" />
      </div>
      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        WebNedoKeepass
      </p>
    </div>
  );
}

// HeaderLogOut Component
function HeaderLogOut({ userName }: { userName: string }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/auth");
    window.location.reload();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative mr-6" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-gray-700 group-hover:text-gray-900">
          {userName || 'Профиль'}
        </span>
        <div className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 mt-1">Управление аккаунтом</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Main Header Component
export default function Header({ pass, folders, chosenFolder, refresh }: {
  pass?: string | null,
  folders: FoldersData[],
  chosenFolder: string,
  refresh: (userId: string | null, authToken: string | null) => void;
}) {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const name = sessionStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  const isAuthPage = location.pathname === "/auth";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <HeaderName />
      {!isAuthPage && <AddEntry folders={folders} chosenFolder={chosenFolder} refresh={refresh} />}
      {userName && <HeaderLogOut userName={userName} />}
    </header>
  );
}