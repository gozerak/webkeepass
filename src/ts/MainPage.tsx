import Header from "./Header";
import React from "react";


export default function MainPage({pass}: {pass:string | null}) {
    return(
        <div className="w-full h-full flex justify-center items-center">
            <Header pass ={pass}/>
        </div>
    )
}