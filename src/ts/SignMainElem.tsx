import React from "react";
import { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export function LogPassInputs({isSignIn}: {isSignIn: boolean}) {
    return(
        <div className="border-2 relative w-1/4 h-52 flex flex-col justify-center">
            <div className="flex-col h-1/2 mt-2">
                <p>Логин</p>
                <input className="border-2 black" type="text" placeholder="Логин"/>
            </div>
            <div className="flex-col h-1/2">
                <p>Пароль</p>
                <input className="border-2 black" type="password" placeholder="Пароль"/>
            </div>
            <button className="border-2 black rounded-full bg-blue-600 text-white mb-5 w-1/2 ml-1/4">{isSignIn? "Войти": "Зарегистрироваться"}</button>
        </div>
    )
}

export default function SignMainElem() {
    const [isSignIn, setIsSignIn] = useState(true)
    return(
        <div className="flex flex-col justify-center">
            <div className="flex flex-row w-1/4 h-16">
                <div className="w-auto h-min border-2">Войти</div>
                <div className="w-auto h-min border-2">Зарегистрироваться</div>
            </div>
            <div className="flex justify-center align-middle">
                {isSignIn? <SignIn isSignIn={true} />: <SignUp isSignIn={false} />}
            </div>
        </div>
    )
}