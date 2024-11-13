import Header from "./Header";
import React from "react";


export default function MainPage({pass}: {pass:string | null}) {
    return(
        <div>
            <Header pass ={pass}/>
        </div>
    )
}