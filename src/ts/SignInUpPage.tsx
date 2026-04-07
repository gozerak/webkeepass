import React from "react";
import Header from "./Header";
import SignMainElem from "./SignMainElem";
import { Key, LogIn, UserPlus } from "lucide-react";



export default function SignInUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <SignMainElem />
      </div>
    </div>
  );
}

