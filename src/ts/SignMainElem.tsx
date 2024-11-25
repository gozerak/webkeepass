import React from "react";
import { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export function LogPassInputs({isSignIn}: {isSignIn: boolean}) {
    return(
        <div className="border-2 w-1/5 h-auto flex flex-col justify-center items-center p-5 mt-0 border-t-0 ">
            <div className="flex flex-col mb-4">
                <label htmlFor="login" className="mb-2">Логин</label>
                <input id='login' className="border-2 border-gray-500 p-2" type="text" placeholder="Логин"/>
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor='password' className="mb-2">Пароль</label>
                <input id="password" className="border-2 border-gray-500 p-2" type="password" placeholder="Пароль"/>
            </div>
            {isSignIn?
            <button className="border-2 border-black border-opacity-35 rounded-full bg-blue-800 text-white px-16 py-2">Войти</button>:
            <button className="border-2 border-black border-opacity-35 rounded-full bg-blue-800 text-white px-4 py-2">Зарегистрироваться</button>   
        }
            </div>
    )
}

export default function SignMainElem() {
    const [isSignIn, setIsSignIn] = useState(true)
    return(
        <div className="flex flex-col items-center">
            <div className="flex justify-center w-1/5 flex-row h-min mt-5 items-center">
                <div className="flex justify-center items-center w-1/3 p-1 border-r-0  h-min border-2 hover:cursor-pointer" onClick={!isSignIn? ()=> setIsSignIn(true): undefined}>Войти</div>
                <div className="flex justify-center items-center w-2/3 p-1 h-min border-2 hover:cursor-pointer" onClick={isSignIn? ()=> setIsSignIn(false): undefined}>Зарегистрироваться</div>
            </div>
                {isSignIn? <SignIn isSignIn={true} />: <SignUp isSignIn={false} />}
        </div>
    )
}