import React from "react";
import { LogPassInputs } from "./SignMainElem";

export default function SignUp({isSignIn}:{isSignIn: boolean}) {
    return(
        <>
            <LogPassInputs isSignIn={isSignIn} />
        </>
    )
}