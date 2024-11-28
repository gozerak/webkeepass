import { useNavigate } from "react-router-dom";
import AddEntry from "./AddEntry";
import Entries from "./Entries";
import Header from "./Header";
import React from "react";


export default function MainPage({pass}: {pass:string | null}) {
    const navigate = useNavigate();
    if (!sessionStorage.getItem('pass')) {
        navigate("/auth");
    }
    return(
        <div className="w-full h-full">
            <Header pass ={pass}/>
            <div className="flex flex-row ">
                <Entries />
                <AddEntry />
            </div>
        </div>
    )
}