import React, { ChangeEvent, useMemo, useRef } from "react";
import { useState } from "react";
import { EntriesData, FoldersData } from './Services/apiService';
import CryptoJS from "crypto-js";
import Modal from "./Modal";
import { AddEntryInput, createEncryptedPass } from "./AddEntry";
import { API_BASE_URL } from "./SignMainElem";
import { useMessage } from "./hooks/useMessage";


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

function AddEntryPassword({title, name, value, onChange, required }: {
    title: string,
    name: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    required?: boolean 
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Функция для переключения видимости пароля
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    return (
        <div className="flex flex-col relative">
            <p className="text-lg pb-3 select-none">{title}</p>
            <div className="flex flex-row">
            <input
                className="border-2 w-4/5 border-gray-300 outline-none pl-1 pr-10"
                autoComplete="off"
                type={isPasswordVisible ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                maxLength={100}
                required={required}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="relative mt-4 right-6 transform -translate-y-1/2 text-gray-500"
            >
                {isPasswordVisible ? (
                 <img className="w-4 h-4" src='/img/eye-slash-solid.svg'/>  
                ) : (
                <img className="w-4 h-4" src="/img/eye-solid.svg" />
                )}
            </button>
            </div>
        </div>
    );
}

function EntriesTable({data, showMessage, chosenFolder, foldersForSelect, refresh}: 
    {
        data: EntriesData[],
        showMessage: (text: string, isError?: boolean) => void;
        chosenFolder: string;
        foldersForSelect: FoldersData[];
        refresh: (userId: string | null, authToken: string | null) => void;
    }
) {
    const userId = sessionStorage.getItem('userId')
    const [entryData, setEntryData] = useState({
        id: "",
        user_id: userId,
        folder_id: "",
        record_title: "",
        password: "",
        user_name: "",
        description: "",
        record_url: "",
        created_date: "",
        password_id: "",

    })
    const [againPassword, setAgainPassword] = useState('');
    const [isPasswordsMatch, setIsPasswordsMatch] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const rootFolder = foldersForSelect.find(folder => folder.primaryFolder_id === null)?.folder_id || "";

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null); // Для отмены одиночного клика
    const isDoubleClickRef = useRef(false);

    // Функция для переключения видимости пароля
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showMessage("Значение скопировано!");
        }).catch(() => {
            showMessage("Ошибка при копировании!", true);
        });
    }

    const undoEntryData = () => {
        setEntryData({
        id: "",
        user_id: userId,
        folder_id: "",
        record_title: "",
        password: "",
        user_name: "",
        description: "",
        record_url: "",
        created_date: "",
        password_id: "",
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userPass = sessionStorage.getItem('pass');
        const authToken = sessionStorage.getItem('authToken')
        if(!userPass || !userId || !authToken){
            alert("Необходимо перелогиниться!")
    }
        else {
            const userId = sessionStorage.getItem('userId')
            const cipherPass = createEncryptedPass(entryData.password, userPass)
            if (entryData.folder_id === null) {
                setEntryData({...entryData, folder_id:rootFolder})
            }
            const updatedEntryData = {
                ...entryData,
                password: cipherPass,
            }
            console.log(updatedEntryData)
            try {
                const response = await fetch(`${API_BASE_URL}/api/PasswordsRecords/ChangePasswordRecord?userId=${userId}&oldPasswordRecordId=${entryData.password_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify(updatedEntryData)
                });
                if (response.ok) {
                    console.log('Запись изменилась!')
                    showMessage('Изменения сохранены!', false)
                    //логика для AJAX обновления страницы
                    refresh(userId, authToken)
                } else {
                    console.error('Все пошло по пизде')
                    showMessage('Ошибка при изменении данных', true)
                }
            } catch (error) {
                console.error("Error:", error)
            }
        }
        undoEntryData;
        setIsModalOpen(false);
    }

    const handleClick = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, valueToCopy: string | null) => {
        // Если двойной клик произошёл, отменяем копирование
        if (isDoubleClickRef.current) {
            isDoubleClickRef.current = false; // Сбрасываем флаг
            return;
        }
        // Устанавливаем таймер для обработки одиночного клика
        const timeout = setTimeout(() => {
            if (valueToCopy) {
                copy(valueToCopy);
            }
        }, 200); // Задержка для определения, был ли это одиночный клик

        setClickTimeout(timeout);
    };

    const handleDoubleClick = (entry: any) => {
        // Если двойной клик произошёл, отменяем таймер одиночного клика
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }

        // Устанавливаем флаг, чтобы копирование не выполнялось
        isDoubleClickRef.current = true;

        // Логика открытия модального окна
        handleEdit(entry);
    };

    const handleEdit = (entry: EntriesData) => {
        console.log(entry)
        const decodedPassword = decodePass(entry.password);
        console.log(decodedPassword)
        setEntryData({...entry, password: decodedPassword});
        setIsModalOpen(true);
        setAgainPassword(decodedPassword);
        checkPasswordsMatch(decodedPassword, decodedPassword);
        console.log(entryData)
    };
    

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEntryData((prevData) => ({ ...prevData, [name]: value }));

        // Проверить совпадение паролей
            setIsPasswordsMatch(value === againPassword);
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAgainPassword(value);

        setIsPasswordsMatch(value === entryData.password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setEntryData({...entryData, [e.target.name]: e.target.value})
    }

    const checkPasswordsMatch = (pass: string, repeatPass: string) => {
         setIsPasswordsMatch(pass === repeatPass);
    }

    const handleDeleteEntry = async (recordId: string) => {
        const authToken = sessionStorage.getItem('authToken')

        try {
            const response = await fetch(`${API_BASE_URL}/api/PasswordsRecords/DeletePasswordRecord?recordId=${recordId}&userId=${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
            });
            if (response.ok) {
                console.log('Запись удалена!')
                showMessage('Запись удалена!', false)
                //логика для AJAX обновления страницы
                refresh(userId, authToken)
            } else {
                console.error('Все пошло по пизде')
                showMessage('Ошибка при удалении записи', true)
            }
        } catch (error) {
            console.error("Error:", error)
        }
        setIsModalOpen(false)
    }

    return(
        <>
            {<Modal width="1/2" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmit} className="flex flex-col p-2">
                <AddEntryInput
                title='Название'
                name='record_title'
                value={entryData.record_title}
                // value={entryData.id}
                onChange={handleChange}
                required 
                />

                <AddEntryInput
                title="Логин"
                name='user_name'
                value={entryData.user_name}
                onChange={handleChange}
                />

        <div className="flex flex-col relative">
            <p className="text-lg pb-3 select-none">Пароль</p>
            <div className="flex flex-row">
            <input
                className="border-2 w-4/5 border-gray-300 outline-none pl-1 pr-10"
                autoComplete="off"
                maxLength={100}
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                value={entryData.password}
                onChange={handlePasswordChange}
                required
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="relative mt-4 right-6 transform -translate-y-1/2 text-gray-500"
            >
                {isPasswordVisible ? (
                 <img className="w-4 h-4" src='/img/eye-slash-solid.svg'/>  
                ) : (
                <img className="w-4 h-4" src="/img/eye-solid.svg" />
                )}
            </button>
            </div>
        </div>

        <div className="flex flex-col relative">
            <p className="text-lg pb-3 select-none">Пароль еще раз</p>
            <input
                className="border-2 w-4/5 border-gray-300 outline-none pl-1 pr-10 disabled:border-gray-200"
                autoComplete="off"
                maxLength={100}
                type='password'
                name="againPassword"
                value={againPassword}
                onChange={handleRepeatPasswordChange}
                required={isPasswordVisible}
                disabled={isPasswordVisible}
            />
        </div>


                <AddEntryInput
                title="URL"
                name="record_url"
                value={entryData.record_url}
                onChange={handleChange}
                />
                <div className="flex flex-col">
                    <p className="text-lg pb-3 select-none">Папка</p>
                    <select
                        className="border-2 w-4/5 border-gray-300 outline-none pl-1"
                        name="folder_id"
                        value={entryData.folder_id}
                        onChange={handleChange}
                        >
                            {foldersForSelect.map((folder) => (
                                <option key={folder.folder_id} value={folder.folder_id}>{folder.folder_name}</option>
                            ))}
                        </select>
                </div>
                
                <div className="">
                <p className="text-lg pb-3 select-none">Дополнительно</p>
                <textarea
                rows={5}
                cols={50}
                className="border-2 w-4/5 border-gray-300 outline-none pl-1"
                autoComplete="off"
                name="description"
                value={entryData.description}
                onChange={handleChange}
                />
                </div>
                <div className="flex flex-row justify-around mt-5">
                    <button type="button"
                    className="border-2 w-28 h-10 bg-red-600 text-white rounded-md"
                    onClick={() => handleDeleteEntry(entryData.password_id)}>
                        Удалить
                    </button>
                    <button type="submit"
                    className="border-2 w-28 h-10 bg-green-600 text-white rounded-md disabled:bg-green-400 disabled:hover:cursor-not-allowed" 
                    disabled={isPasswordVisible? false: !isPasswordsMatch}>
                        Сохранить
                    </button> 
                </div>
            </form>
                </Modal>}
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
                            <tr key={entry.id} 
                            className="children:px-5 children:overflow-hidden children:py-6 children:border-2 children:border-gray-200 children:text-center children:hover:cursor-pointer"
                            onDoubleClick={() => handleDoubleClick(entry)}
                            >
                                
                                <td className="text-ellipsis" data-value={entry.record_title} onClick={(e) => {
            const valueToCopy = e.currentTarget.getAttribute("data-value");
            if (valueToCopy) {
                handleClick(e, e.currentTarget.getAttribute("data-value"))
            }
        }}>{entry.record_title}</td>

                                <td className="text-ellipsis" data-value={entry.user_name} onClick={(e) => {
            const valueToCopy = e.currentTarget.getAttribute("data-value");
            if (valueToCopy) {
                handleClick(e, e.currentTarget.getAttribute("data-value"))
            }
        }}>{entry.user_name}</td>

                                <td className="text-clip" data-password={decodePass(entry.password)} onClick={(e) => {
            const valueToCopy = e.currentTarget.getAttribute("data-password");
            if (valueToCopy) {
                handleClick(e, e.currentTarget.getAttribute("data-value"))
            }
        }}>
                {decodePass(entry.password)? "•".repeat(decodePass(entry.password).length) : null}
                                </td>

                                <td className="text-ellipsis" data-value={entry.record_url} onClick={(e) => {
            const valueToCopy = e.currentTarget.getAttribute("data-value");
            if (valueToCopy) {
                handleClick(e, e.currentTarget.getAttribute("data-value"))
            }
        }}>{entry.record_url}</td>

                                <td className="text-ellipsis" data-value={entry.description} onClick={(e) => {
            const valueToCopy = e.currentTarget.getAttribute("data-value");
            if (valueToCopy) {
                handleClick(e, e.currentTarget.getAttribute("data-value"))
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
        </>
    )
}

export default function Entries({userId, authToken, entries, chosenFolder, refreshEntriesData, foldersForSelect}:{
    userId: string | null, 
    authToken: string | null,
    entries: EntriesData[],
    chosenFolder: string,
    refreshEntriesData: (userId: string | null, authToken: string | null) => void;
    foldersForSelect: FoldersData[];
}) {
    const { message, showMessage } = useMessage();

    const filteredEntries = useMemo(() => {
        if(!chosenFolder) {
            return entries;
        }

        return entries.filter((entry) => entry.folder_id === chosenFolder)
    }, [entries, chosenFolder])

    return (
        <div className=" relative flex flex-col w-1/2">
            <EntriesTable data={filteredEntries} showMessage={showMessage} chosenFolder={chosenFolder} foldersForSelect={foldersForSelect} refresh={refreshEntriesData} />
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