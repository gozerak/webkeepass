import { FoldersData } from "./Services/apiService"
import React, { useEffect, useState } from "react"
import { API_BASE_URL } from "./SignMainElem";
import Modal from "./Modal";
import { AddEntryInput } from "./AddEntry";
import { Folder, Trash2 } from "lucide-react";

function FolderTree({ 
    folders, 
    chosenFolder, 
    setChosenFolder,
    refresh ,
    foldersForSelect
}: { 
    folders: FoldersData[], 
    chosenFolder: string,
    setChosenFolder: (folderId: string) => void,
    refresh: (userId: string | null, authToken: string | null) => void;
    foldersForSelect: FoldersData[]
}) {
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrimaryFolder, setIsPrimaryFolder] = useState (true);
    const [folderToDelete, setFolderToDelete] = useState ("");
    
    const toggleFolder = (folderId: string) => {
        setOpenFolders(prevState => {
            const newState = new Set(prevState);
            if (newState.has(folderId)) {
                newState.delete(folderId);
            } else {
                newState.add(folderId);
            }
            return newState;
        });
    };
    // console.log(folders[0].primaryFolder_id)
    const handleFolder = (folder: FoldersData) => {
        if (folder.primaryFolder_id) {
            setChosenFolder(folder.folder_id)
        }
        else {
            setChosenFolder("")
        }
    }

    const handleDeleteFolder = (folders: FoldersData[], folderId: string) =>{
    
        if (folders.filter((folder)=> folder.primaryFolder_id === folderId).length) {
            setIsPrimaryFolder(true)
        }
        else {
            setIsPrimaryFolder(false)
        }
        setFolderToDelete(folderId)
        setIsModalOpen(true)
    }

    const handleDelete = async (folderId: string) => {
        const userId = sessionStorage.getItem("userId")
        const authToken = sessionStorage.getItem("authToken")
        if (userId && authToken) {
            const response = await fetch (`${API_BASE_URL}/api/PasswordsRecords/DeleteFolder?folderId=${folderId}&userId=${userId}`, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                console.log("Папка удалена!")
                refresh(userId, authToken)
                setChosenFolder('')
                setIsModalOpen(false)
            } else {
                console.error("Не удалилась папка")
            } 
        } ;
        
    }

    if (!folders || folders.length === 0) return null;

    return (
        <>
            <ul>
                {folders.map(folder => (
                    <li key={folder.folder_id}>
                        <div className="flex flex-row">
                            <img className="w-4 h-6 mr-2" src="/img/folder.svg" />
                        <div onClick={(e) => handleFolder(folder)} className={`group flex flex-row items-center hover:cursor-pointer select-none mb-2`}>
                            <span className={`${folder.folder_id === chosenFolder || (chosenFolder === "" && folder.primaryFolder_id === null)
                                ? "bg-gray-300"
                                : "bg-white"} font-semibold text-nowrap`} >{folder.folder_name}</span>
                            {folder.children.length > 0 && (
                                <button 
                                    onClick={() => toggleFolder(folder.folder_id)} 
                                    className="ml-2"
                                >
                                    {openFolders.has(folder.folder_id) ? '-' : '+'}
                                </button>
                            )}
                            {folder.primaryFolder_id?
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFolder(foldersForSelect, folder.folder_id);
                                }}
                                className="hidden group-hover:block text-red-500 ml-2"
                            >
                                🗑
                            </button> 
                            : null
                            }
                        </div>
                        </div>
                        
                        {folder.entries.length > 0 && (
                            <ul className="pl-2">
                                {folder.entries.map(entry => (
                                    <li key={entry.id}>
                                        {entry.record_title || 'Без названия'}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        {openFolders.has(folder.folder_id) && folder.children.length > 0 && (
                            <ul className="pl-2">
                                <FolderTree 
                                folders={folder.children}
                                chosenFolder={chosenFolder}
                                setChosenFolder={setChosenFolder}
                                refresh={refresh}
                                foldersForSelect={foldersForSelect} />
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            {<Modal width="1/3" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white w-100 h-fit ">
                {isPrimaryFolder? (
                    <div className="relative w-100 p-x-2 flex flex-col items-center">
                        <p className="mr-2 mt-2 text-nowrap">Прежде чем удалить эту папку, удалите вложенные папки</p>
                        <button onClick={() => setIsModalOpen(false)} className="bg-green-400 mt-4 relative text-white w-20 h-12">Oк</button>
                    </div>
                ):(
                    <div className="relative w-100 p-x-2 flex flex-col items-center">
                        <p>Вы действительно хотите удалить эту папку?</p>
                        <div className="flex flex-row justify-between mt-4">
                            <button className="bg-red-500 text-white w-1/3 h-12" onClick={() => setIsModalOpen(false)}>Отмена</button>
                            <button className="bg-green-500 text-white w-1/3 h-12" onClick={() => handleDelete(folderToDelete)}>Подтвердить</button>

                        </div>
                    </div>
                )}
                </div>
                </Modal>
                }   
        </>
    );
}

interface FolderItemProps {
  folder: FolderType;
  chosenFolder: string;
  toggleFolder: (id: string) => void;
  openFolders: Set<string>;
  handleFolder: (folder: FolderType) => void;
  handleDeleteFolder: (id: string) => void;
}

export interface FolderType {
  folder_id: string;
  folder_name: string;
  primaryFolder_id: string | null;
  children: FolderType[];
}

function FolderItem({ folder, chosenFolder, toggleFolder, openFolders, handleFolder, handleDeleteFolder }: FolderItemProps) {
  return (
    <div className="flex items-center gap-2 group py-1">
      <Folder size={16} />

      <div
        onClick={() => handleFolder(folder)}
        className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition ${
          folder.folder_id === chosenFolder
            ? "bg-gray-200"
            : "hover:bg-gray-100"
        }`}
      >
        <span className="font-medium truncate max-w-[140px]">
          {folder.folder_name}
        </span>

        {folder.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(folder.folder_id);
            }}
            className="text-xs text-gray-500"
          >
            {openFolders.has(folder.folder_id) ? "−" : "+"}
          </button>
        )}

        {folder.primaryFolder_id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFolder(folder.folder_id);
            }}
            className="opacity-0 group-hover:opacity-100 text-red-500 transition"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Folders ({
    folders, 
    chosenFolder,
    setChosenFolder,
    refresh,
    foldersForSelect}: {
    folders: FoldersData[];
    chosenFolder: string;
    setChosenFolder: (folderId: string) => void;
    refresh: (userId: string | null, authToken: string | null) => void;
    foldersForSelect: FoldersData[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userId = sessionStorage.getItem('userId')
    const authToken = sessionStorage.getItem('authToken')
    const [rootFolder, setRootFolder] = useState('');
    useEffect(() => {
        if (!rootFolder) {
            const addRootFolder = foldersForSelect.find(folder => folder.primaryFolder_id === null)?.folder_id;
            if(addRootFolder){
                setRootFolder(addRootFolder)
        }}
    }, [foldersForSelect, rootFolder])

    const [addFolderData, setAddFolderData] = useState({
        user_id: userId,
        folder_name: "",
        folder_notes: "",
        primaryFolder_id: ""
    })
    // console.log(chosenFolder)
    const handleAddFolder = async () => {
        if (addFolderData.primaryFolder_id === "") {
            setAddFolderData({...addFolderData, primaryFolder_id: rootFolder})
        }
        console.log(addFolderData)
        console.log(rootFolder)
        const response = await fetch (`${API_BASE_URL}/api/PasswordsRecords/CreatePasswordsFolders`, {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(addFolderData)
        });
        if (response.ok) {
            console.log('Папка создалась!');
            setAddFolderData({...addFolderData, folder_name: ""})
            refresh(userId, authToken)
        } else {
            console.error("Ошибка создания папки")
        }
        setIsModalOpen(false)
    }

    const handleClick = () => {
        setIsModalOpen(true);
        setAddFolderData(prevData => ({
            ...prevData,
            primaryFolder_id: chosenFolder || rootFolder,
        }));
        console.log(addFolderData.primaryFolder_id)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setAddFolderData({...addFolderData, [e.target.name] : e.target.value})
    }

    return (
        <div className="w-1/4 mt-5 pl-5">
            
            {<Modal width="1/3" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white w-100 h-fit flex flex-col items-center">

                    <AddEntryInput
                     title="Имя папки"
                     name="folder_name"
                     value={addFolderData.folder_name}
                     onChange={handleChange}
                     required
                     />

                    <div className="flex flex-col">
                        <p className="text-lg pb-3 select-none">Родительская папка</p>
                        <select
                            className="border-2 w-4/5 border-gray-300 outline-none pl-1"
                            name="primaryFolder_id"
                            value={addFolderData.primaryFolder_id}
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
                    name="folder_notes"
                    value={addFolderData.folder_notes}
                    onChange={handleChange}
                    />
                </div>

                <div className="flex flex-row justify-around mt-5 pr-10">
                    <button 
                        className="border-2 w-28 h-10 bg-red-600 text-white rounded-md"
                        onClick={() => setIsModalOpen(false)}>
                            Назад
                    </button>
                    <button
                        className="border-2 w-28 h-10 bg-green-600 text-white rounded-md"
                        onClick={() => handleAddFolder()}>
                            Добавить
                    </button> 
                </div>
                </div>
            </Modal> } 

            <button className="bg-green-600 border-2 p-1 mb-4 text-white" onClick={() => handleClick()}>Добавить папку</button>
            <FolderTree 
            folders={folders}
            chosenFolder={chosenFolder}
            setChosenFolder={setChosenFolder}
            refresh={refresh}
            foldersForSelect={foldersForSelect} />
        </div>
    )
}