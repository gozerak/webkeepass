import { useNavigate } from "react-router-dom";
import AddEntry from "./AddEntry";
import Entries from "./Entries";
import Header from "./Header";
import React, { useEffect } from "react";


export default function MainPage({pass}: {pass:string | null}) {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId')
    const authToken = sessionStorage.getItem('authToken')

    useEffect(() => {
        if (!sessionStorage.getItem('pass')) {
            navigate("/auth");
        }

    }, [navigate]);

    return(
        <div className="w-full h-full">
            <Header pass ={pass}/>
            <div className="flex flex-row ">
                <Entries userId={userId} authToken={authToken} />
                <AddEntry />
            </div>
        </div>
    )
}