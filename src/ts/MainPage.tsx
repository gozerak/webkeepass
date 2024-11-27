import AddEntry from "./AddEntry";
import Entries from "./Entries";
import Header from "./Header";
import React from "react";


export default function MainPage({pass}: {pass:string | null}) {
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