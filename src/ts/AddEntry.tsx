import React, { ChangeEvent, useState } from "react"
import Modal from "./Modal";
import { AddEntryData, FoldersData } from "./Services/apiService";
import { API_BASE_URL } from './SignMainElem';
import CryptoJS from "crypto-js";

export function AddEntryInput({title,type='text', name, value, onChange, required }: {
    title: string,
    type?: string,
    name: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    required?: boolean 
}) {
    return(
        <div className="flex flex-col">
            <p className="text-lg pb-3 select-none">{title}</p>
            <input
            className="border-2 w-4/5 border-gray-300 outline-none pl-1"
            autoComplete="off"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            />
        </div>
    )
}

function createEncryptedPass (pass:string, userPass:string) {
    const cipherText= CryptoJS.AES.encrypt(pass, userPass).toString();
    return cipherText;
}

export default function AddEntry ({folders, chosenFolder, refresh}: {
    folders: FoldersData[],
    chosenFolder: string,
    refresh: (userId: string | null, authToken: string | null) => void;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [againPassword, setAgainPassword] = useState('');
    const [isPasswordsMatch, setIsPasswordsMatch] = useState(true);

    const rootFolder = folders.find(folder => folder.primaryFolder_id === null)?.folder_id || "";

    const [addEntryData, setAddEntryData] = useState<AddEntryData>({
        user_id: "",
        record_title: "",
        password: "",
        user_name: "",
        description: "",
        record_url: "",
        folder_id: chosenFolder || rootFolder,
    });

    const handleClick = () => {
        setIsModalOpen(true)

        setAddEntryData(prevData => ({
            ...prevData,
            folder_id: chosenFolder || rootFolder,
        }));
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddEntryData((prevData) => ({ ...prevData, [name]: value }));

        // Проверить совпадение паролей
        if (name === 'password') {
            setIsPasswordsMatch(value === againPassword);
        }
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAgainPassword(value);

        // Проверить совпадение паролей
        setIsPasswordsMatch(value === addEntryData.password);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userPass = sessionStorage.getItem('pass')
        const userId = sessionStorage.getItem('userId')
        const authToken = sessionStorage.getItem('authToken')
        if(!userPass || !userId || !authToken){
            alert("Необходимо перелогиниться!")
    }
        else {
            const userId = sessionStorage.getItem('userId')
            const cipherPass = createEncryptedPass(addEntryData.password, userPass)
            const updatedAddEntryData = {
                ...addEntryData,
                password: cipherPass,
                user_id: userId,
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/PasswordsRecords/CreatePasswordRecord`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify(updatedAddEntryData)
                });
                if (response.ok) {
                    console.log('Работа создалась!')
                    //логика для AJAX обновления страницы
                    refresh(userId, authToken)
                } else {
                    console.error('Все пошло по пизде')
                }
            } catch (error) {
                console.error("Error:", error)
            }
        }
        setIsModalOpen(false)
};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setAddEntryData({...addEntryData, [e.target.name]: e.target.value})
    }

    const checkPasswordsMatch = (pass: string, repeatPass: string) => {
         setIsPasswordsMatch(pass === repeatPass);
    }

    return(
        <>
        <div className="">
        <Modal width="1/3" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmit} className="flex flex-col p-2">
                <AddEntryInput
                title='Название'
                name='record_title'
                value={addEntryData.record_title}
                onChange={handleChange}
                required 
                />

                <AddEntryInput
                title="Логин"
                name='user_name'
                value={addEntryData.user_name}
                onChange={handleChange}
                />

                <AddEntryInput
                type="password"
                title="Пароль"
                name="password"
                value={addEntryData.password}
                onChange={handlePasswordChange}
                />

                <AddEntryInput
                type="password"
                title="Пароль еще раз"
                name="againPassword"
                value={againPassword}
                onChange={handleRepeatPasswordChange}
                />

                <AddEntryInput
                title="URL"
                name="record_url"
                value={addEntryData.record_url}
                onChange={handleChange}
                />

                <div className="flex flex-col">
                    <p className="text-lg pb-3 select-none">Папка</p>
                    <select
                        className="border-2 w-4/5 border-gray-300 outline-none pl-1"
                        name="folder_id"
                        value={addEntryData.folder_id}
                        onChange={handleChange}
                        >
                            {folders.map((folder) => (
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
                value={addEntryData.description}
                onChange={handleChange}
                />
                </div>
                <div className="flex flex-row justify-around mt-5">
                    <button type="button"
                    className="border-2 w-28 h-10 bg-red-600 text-white rounded-md"
                    onClick={() => setIsModalOpen(false)}>
                        Назад
                    </button>
                    <button type="submit"
                    className="border-2 w-28 h-10 bg-green-600 text-white rounded-md disabled:bg-green-400 disabled:hover:cursor-not-allowed" 
                    disabled={!isPasswordsMatch}>
                        Добавить
                    </button> 
                </div>
            </form>
        </Modal>
        </div>
        <div className="align-middle h-14 mt-5 mr-16 min-w-12 max-w-fit">
        <button className="border-2 border-gray-300 bg-green-500 w-fit p-2 align-middle text-nowrap text-white" onClick={handleClick}>Добавить запись</button>
        </div>
        </>
    )
}