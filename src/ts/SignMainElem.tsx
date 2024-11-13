import React from "react";
import { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export function LogPassInputs({isSignIn}: {isSignIn: boolean}) {
    return(
        <div>
            <div>
                <div>Логин</div>
                <input type="text" placeholder="Логин"/>
            </div>
            <div>
                <div>Пароль</div>
                <input type="password" placeholder="Пароль"/>
            </div>
            <button>{isSignIn? "Войти": "Зарегистрироваться"}</button>
        </div>
    )
}

export default function SignMainElem() {
    const [isSignIn, setIsSignIn] = useState(true)
    return(
        <div>
            {isSignIn? <SignIn isSignIn={true} />: <SignUp isSignIn={false} />}
        </div>
    )
}