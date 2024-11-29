import React from "react";
import { useEffect, useState } from "react";
import { EntriesData, fetchEntries } from './Services/apiService';
import EntryInstance from "./EntryInstance";
import { useEntriesData } from "./hooks/useEntriesData";
import CryptoJS from "crypto-js";

function decodePass(pass:string | undefined){
    const userPass = sessionStorage.getItem('pass')
    if (userPass && pass) {
        const bytes = CryptoJS.AES.decrypt(pass, userPass);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    }
    return null
}

function EntriesTable({data}: 
    {data: EntriesData[]}
) {
    return(
        <table className="fixed border-2 border-gray-200 mt-4 table-fixed w-max mb-5 z-2">
            <thead> 
                <tr className="children:w-fit children:font-semibold children:p-4 children:bg-gray-100 children:border-2 children:border-gray-300">
                    <th>Название</th>
                    <th>Логин</th>
                    <th>Пароль</th>
                    <th>Url</th>
                    <th>Дополнительно</th>
                </tr>
            </thead>
            <tbody className="odd:children:bg-white even:children:bg-gray-200">
                {Array.isArray(data) && data.length > 0 ? (
                    (data.map(entry => (
                        <tr key={entry.id} className="children:px-5 children:py-6 children:border-2 children:border-gray-200 children:text-center">
                            <td>{entry.record_title}</td>
                            <td>{entry.user_name}</td>
                            <td>{decodePass(entry.password)}</td>
                            <td>{entry.record_url}</td>
                            <td>{entry.description}</td>
                        </tr>
                    )))
                ) : (
                        <tr>
                            <td colSpan={5}>Записей не обнаружено!</td>
                        </tr>
                    )
                }
            </tbody>
        </table>  
    )
}

export default function Entries({userId, authToken}:{userId: string | null, authToken: string | null}) {
    const{entries, loading, refreshEntries} = useEntriesData({userId, authToken});

    return (
        <div className=" ml-20 flex flex-col">
            <EntriesTable data={entries} />
        </div>
    )
}