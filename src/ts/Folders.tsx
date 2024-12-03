import { FoldersData } from "./Services/apiService"
import React, { useState } from "react"

function FolderTree({ 
    folders, 
    chosenFolder, 
    setChosenFolder 
}: { 
    folders: FoldersData[], 
    chosenFolder: string,
    setChosenFolder: (folderId: string) => void 
}) {
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
    console.log(folders)
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

    const handleFolder = (folder: FoldersData) => {
        if (folder.primaryFolder_id) {
            setChosenFolder(folder.folder_id)
        }
        else {
            setChosenFolder("")
        }
    }

    if (!folders || folders.length === 0) return null;

    return (
        <ul>
            {folders.map(folder => (
                <li key={folder.folder_id}>
                    <div onClick={(e) => handleFolder(folder)} className={`group flex flex-row items-center hover:cursor-pointer select-none`}>
                        <span className={`${folder.folder_id === chosenFolder || (chosenFolder === "" && folder.primaryFolder_id === null)
                            ? "bg-blue-300"
                            : "bg-white"} font-semibold text-nowrap`} >{folder.folder_name}</span>
                        {folder.children.length > 0 && (
                            <button 
                                onClick={() => toggleFolder(folder.folder_id)} 
                                className="ml-2"
                            >
                                {openFolders.has(folder.folder_id) ? '-' : '+'}
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // onDelete(folder.folder_id);
                            }}
                            className="hidden group-hover:block text-red-500 ml-2"
                        >
                            🗑
                        </button>
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
                            setChosenFolder={setChosenFolder} />
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function Folders ({
    folders, 
    chosenFolder,
    setChosenFolder}: {
    folders: FoldersData[];
    chosenFolder: string;
    setChosenFolder: (folderId: string) => void;
}) {

    return (
        <div className="w-1/3 mt-5 pl-5">
            <FolderTree 
            folders={folders}
            chosenFolder={chosenFolder}
            setChosenFolder={setChosenFolder} />
        </div>
    )
}