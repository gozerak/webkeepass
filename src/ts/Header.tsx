import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function HeaderName() {
    return(
        <p className="16px bold black">webkeepass</p>
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
            sessionStorage.removeItem('password');
            navigate("/");
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
            <div className="user-icon-container" ref={dropdownRef}>
                {/* <div className={`user-icon ${userId? "unauthorized": "" }`} onClick={toggleDropdown}>
                    {userData ? userData.login : "Loading..."}
                </div> */}
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={handleLogout}>Выйти</button>
                    </div>
                )}
            </div>
        );
    }

export default function Header({pass}: {pass?:string | null}) {
    return(
        <div className="border-b-2 solid black h-14">
        <HeaderName/>
        {pass && <HeaderLogOut/>}
        </div>
    )
}