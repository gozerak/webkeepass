import React, { useState } from "react"
import Modal from "./Modal";
import { AddEntryData } from "./Services/apiService";

export default function AddEntry () {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleSubmit = () => {

    }

    const handleChange = () => {

    }

    return(
        <>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmit}>

            </form>
        </Modal>
        <div className="align-middle h-10 mt-5 mr-16 min-w-12 max-w-fit">
        <button className="border-2 border-gray-300 bg-green-500 w-fit p-2 align-middle text-nowrap text-white" onClick={handleClick}>Добавить запись</button>
        </div>
        </>
    )
}