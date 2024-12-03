import React, { useMemo } from "react";
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

function copy (text: string) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("Текст скопирован:", text);
    }).catch((err) => {
        console.error("Ошибка при копировании:", err);
    });
}

function EntriesTable({data, showMessage}: 
    {
        data: EntriesData[],
        showMessage: (text: string, isError?: boolean) => void;
    }
) {

    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showMessage("Значение скопировано!");
        }).catch(() => {
            showMessage("Ошибка при копировании!", true);
        });
    }

    return(
        <table className="fixed border-2 border-gray-200 mt-4 table-fixed w-1/2 mb-5 z-2">
            <thead> 
                <tr className="children:w-fit children:select-none children:overflow-hidden children:text-ellipsis children:whitespace-nowrap children:font-semibold children:p-4 children:bg-gray-100 children:border-2 children:border-gray-300">
                    <th>Название</th>
                    <th>Логин</th>
                    <th>Пароль</th>
                    <th>Url</th>
                    <th>Дополнительно</th>
                </tr>
            </thead>
            <tbody className="odd:children:bg-white even:children:bg-gray-200 ">
                {Array.isArray(data) && data.length > 0 ? (
                    (data.map(entry => (
                        <tr key={entry.id} className="children:px-5 children:overflow-hidden children:text-ellipsis children:py-6 children:border-2 children:border-gray-200 children:text-center children:hover:cursor-pointer">
                            
                            <td data-value={entry.record_title} onClick={(e) => {
        const valueToCopy = e.currentTarget.getAttribute("data-value");
        if (valueToCopy) {
            copy(valueToCopy);
        }
    }}>{entry.record_title}</td>

                            <td data-value={entry.user_name} onClick={(e) => {
        const valueToCopy = e.currentTarget.getAttribute("data-value");
        if (valueToCopy) {
            copy(valueToCopy);
        }
    }}>{entry.user_name}</td>

                            <td className="overflow-clip" data-password={decodePass(entry.password)} onClick={(e) => {
        const valueToCopy = e.currentTarget.getAttribute("data-password");
        if (valueToCopy) {
            copy(valueToCopy);
        }
    }}>
            {decodePass(entry.password)? "•".repeat(decodePass(entry.password).length) : null}
                            </td>

                            <td data-value={entry.record_url} onClick={(e) => {
        const valueToCopy = e.currentTarget.getAttribute("data-value");
        if (valueToCopy) {
            copy(valueToCopy);
        }
    }}>{entry.record_url}</td>

                            <td data-value={entry.description} onClick={(e) => {
        const valueToCopy = e.currentTarget.getAttribute("data-value");
        if (valueToCopy) {
            copy(valueToCopy);
        }
    }}>{entry.description}</td>

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

export default function Entries({userId, authToken, entries, chosenFolder, refreshEntriesData}:{
    userId: string | null, 
    authToken: string | null,
    entries: EntriesData[],
    chosenFolder: string,
    refreshEntriesData: (userId: string | null, authToken: string | null) => void;
}) {
    // const {entries, loading, refreshEntries} = useEntriesData({userId, authToken});
    const [message, setMessage] = useState<{text: string, isError: boolean} | null>(null);

    const showMessage = (text: string, isError = false) => {
        setMessage({ text, isError });
        setTimeout(() => setMessage(null), 2000);
    }

    const filteredEntries = useMemo(() => {
        if(!chosenFolder) {
            return entries;
        }

        return entries.filter((entry) => entry.folder_id === chosenFolder)
    }, [entries, chosenFolder])

    return (
        <div className=" relative flex flex-col w-1/2">
            <EntriesTable data={filteredEntries} showMessage={showMessage} />
            {message && (
                <div
                    className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 h-fit w-fit px-4 py-2 text-white text-center rounded-md ${
                        message.isError ? "bg-red-600" : "bg-green-600"
                    }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    )
    }