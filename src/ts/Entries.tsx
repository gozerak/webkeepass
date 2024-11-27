import React from "react";
import { useEffect, useState } from "react";
import { EntriesData, fetchEntries } from './Services/apiService';
import EntryInstance from "./EntryInstance";

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
                {data?
                    (data.map(entry => (
                        <tr key={entry.id} className="children:px-5 children:py-6 children:border-2 children:border-gray-200 children:text-center">
                            <td>{entry.record_title}</td>
                            <td>{entry.user_name}</td>
                            <td>{entry.password}</td>
                            <td>{entry.record_url}</td>
                            <td>{entry.description}</td>
                        </tr>
                    ))) : (
                        <p>Записей не обнаружено!</p>
                    )
                }
            </tbody>
        </table>  
    )
}

export default function Entries() {
    const [entriesData, setEntriesData] = useState <EntriesData[]>([{
        id: "1",
        user_id: "12334",
        record_title: "tete",
        password: "123",
        user_name: "gena",
        description: "bimbim",
        record_url: "baambam",
        created_date: "todayble"
        }, {
            id: "2",
            user_id: "asd",
            record_title: "asf",
            password: "123",
            user_name: "dda",
            description: "zxcm",
            record_url: "bdsadam",
            created_date: "gggg"
            }])
    // useEffect(() => {
    //     const fetchData = async() => {
    //         const userId = sessionStorage.getItem('userId')
    //         const authToken = sessionStorage.getItem('authToken')
    //         if (userId && authToken) {
    //             const data = await fetchEntries(userId, authToken)
    //             if (data) {
    //                 setEntriesData(data)
    //             }
    //         }
    // }
    // fetchData();
    // })

    return (
        <div className=" ml-20 flex flex-col">
            <EntriesTable data={entriesData} />
        </div>
    )
}