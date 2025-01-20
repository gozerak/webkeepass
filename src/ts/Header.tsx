import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddEntry from "./AddEntry";
import { FoldersData } from "./Services/apiService";

function HeaderName() {
    return(
        <p className="16px bold black pl-10 pt-5">WebNedoKeepass</p>
    )
}

function HeaderLogOut({userName} : {userName: string}) {
    
        const [isDropdownOpen, setDropdownOpen] = useState(false);
        const dropdownRef = useRef<HTMLDivElement | null>(null);
        const navigate = useNavigate();
    
        const toggleDropdown = () => {
            setDropdownOpen(!isDropdownOpen);
        };
    
        const handleLogout = () => {
            // Логика выхода из системы
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
            <div className="relative w-fit h-min mr-12 mt-3" ref={dropdownRef}>
                <div className="hover:cursor-pointer text-lg" onClick={toggleDropdown}>{userName? userName: 'Профиль'}</div>
                {/* <div className={`user-icon ${userId? "unauthorized": "" }`} onClick={toggleDropdown}>
                    {userData ? userData.login : "Loading..."}
                </div> */}
                {isDropdownOpen && (
                    <div className="relative overflow-auto">
                        <button className="fixed z-50 border-2 bg-white text-lg" onClick={handleLogout}>Выйти</button>
                    </div>
                )}
            </div>
        );
    }

export default function Header({pass, folders, chosenFolder, refresh}: {
    pass?:string | null,
    folders: FoldersData[],
    chosenFolder: string,
    refresh: (userId: string | null, authToken: string | null) => void;}) {
    const [userName, setUserName] = useState('')
    useEffect(() => {
        const name = sessionStorage.getItem('userName');
        if (name) {
            setUserName(name);
        };
    }, []);

    const isAuthPage = location.pathname === "/auth"
    return(
        <div className="border-b-2 solid black h-14 flex flex-row justify-between relative">
            <HeaderName/>
            {isAuthPage? null : <AddEntry folders={folders} chosenFolder={chosenFolder} refresh={refresh} />}
            {userName && <HeaderLogOut userName={userName}/>}
        </div>
    )
}