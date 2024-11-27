import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function HeaderName() {
    return(
        <p className="16px bold black pl-10 pt-5">Webkeepass</p>
    )
}

function HeaderLogOut() {
    
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
            <div className="relative w-12 h-min mr-12 mt-3" ref={dropdownRef}>
                <div className="hover:cursor-pointer text-lg" onClick={toggleDropdown}>gay</div>
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

export default function Header({pass}: {pass?:string | null}) {
    console.log(pass)
    return(
        <div className="border-b-2 solid black h-14 flex flex-row justify-between relative">
            <HeaderName/>
            {pass && <HeaderLogOut/>}
        </div>
    )
}