import React from "react";
import { LogPassInputs } from "./SignMainElem";

export default function SignIn({isSignIn}:{isSignIn:boolean}) {
    return(
        <>
            <LogPassInputs isSignIn={isSignIn} />
        </>
    )
}