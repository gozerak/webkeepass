import React from "react";
import Header from "./Header";
import SignMainElem from "./SignMainElem";



export default function SignInUpPage(){
    return(
        <div>
            <Header/>
            <div className="w-full h-full ">
                <SignMainElem />
            </div>
        </div>
    )
}