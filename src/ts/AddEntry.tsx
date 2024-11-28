import React, { ChangeEvent, useState } from "react"
import Modal from "./Modal";
import { AddEntryData } from "./Services/apiService";

function AddEntryInput({title,type='text', name, value, onChange, required }: {
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
            className="border-2 w-1/2 border-gray-300 outline-none pl-1"
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

export default function AddEntry () {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [againPassword, setAgainPassword] = useState('');
    const [isPasswordsMatch] = useState(true);
    const [addEntryData, setAddEntryData] = useState<AddEntryData>({
        user_id: "",
        record_title: "",
        password: "",
        user_name: "",
        description: "",
        record_url: "",
    });

    const handleClick = () => {
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!sessionStorage.getItem('pass') && sessionStorage.getItem('userId')){
            alert("Необходимо перелогиниться!")
    }
        else {
            const userId = sessionStorage.getItem('userId')
            // const folderId = sessionStorage.getItem('folderId')
            
        }
}

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddEntryData({...addEntryData, [e.target.name]: e.target.value})
    }

    return(
        <>
        <div className="">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                onChange={handleChange}
                />

                <AddEntryInput
                type="password"
                title="Пароль еще раз"
                name="againPassword"
                value={againPassword}
                onChange={(e) => setAgainPassword(e.target.value)}
                />

                <AddEntryInput
                title="URL"
                name="record_url"
                value={addEntryData.record_url}
                onChange={handleChange}
                />
                
                <div className="">
                <p className="text-lg pb-3 select-none">Дополнительно</p>
                <textarea
                rows={5}
                cols={50}
                className="border-2 w-1/2 border-gray-300 outline-none pl-1"
                autoComplete="off"
                name="description"
                value={addEntryData.description}
                onChange={handleChange}
                />
                </div>
                <div className="flex flex-row justify-between mt-5">
                    <button type="button"
                    className="border-2 w-1/6 h-10 bg-red-600 text-white rounded-md"
                    onClick={() => setIsModalOpen(false)}>
                        Назад
                    </button>
                    <button type="submit"
                    className="border-2 w-1/6 h-10 bg-green-600 text-white rounded-md disabled:bg-green-400 disabled:hover:cursor-not-allowed" 
                    disabled={!isPasswordsMatch}>
                        Добавить
                    </button> 
                </div>
            </form>
        </Modal>
        </div>
        <div className="align-middle h-10 mt-5 mr-16 min-w-12 max-w-fit">
        <button className="border-2 border-gray-300 bg-green-500 w-fit p-2 align-middle text-nowrap text-white" onClick={handleClick}>Добавить запись</button>
        </div>
        </>
    )
}