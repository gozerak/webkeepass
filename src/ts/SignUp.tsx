import React from "react";
import { LogPassInputs } from "./SignMainElem";

export default function SignUp({isSignIn, showMessage}:{isSignIn: boolean, showMessage: (text: string, isError?: boolean) => void}) {
    return(
        <>
            <LogPassInputs isSignIn={isSignIn} showMessage={showMessage}/>
        </>
    )
}