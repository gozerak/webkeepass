import { useNavigate } from "react-router-dom";
import AddEntry from "./AddEntry";
import Entries from "./Entries";
import Header from "./Header";
import React, { useEffect, useState } from "react";
import { useEntriesData } from "./hooks/useEntriesData";
import Folders from "./Folders";
import { EntriesData, FoldersData } from "./Services/apiService";

function buildFolderTree(folders: FoldersData[], passwords: EntriesData[]) {
    const folderMap: {[key: string]: FoldersData} = {};
    const rootFolders: FoldersData[] = [];

    // Создаем хранилище папок
    folders.forEach(folder => {
        folder.children = [];
        folder.entries = [];
        folderMap[folder.folder_id] = folder;
    });

    // Привязываем папки к их родителям
    folders.forEach(folder => {
        if (folder.primaryFolder_id) {
            const parent = folderMap[folder.primaryFolder_id];
            if (parent) {
                parent.children.push(folder);
            }
        } else {
            rootFolders.push(folder);
        }
    });

    return rootFolders;
}



export default function MainPage({pass}: {pass:string | null}) {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId')
    const authToken = sessionStorage.getItem('authToken')
    
    useEffect(() => {
        if (!sessionStorage.getItem('pass') || !userId || !authToken) {
            navigate("/auth");
        }

    }, [navigate]);

    const {entries, folders, loading, refreshEntries} = useEntriesData({userId, authToken});

    const folderTree = buildFolderTree(folders, entries);
    const [chosenFolder, setChosenFolder] = useState("");
// console.log(folders)
    return(
        <div className="w-full h-full">
            <Header pass ={pass} folders={folders} chosenFolder={chosenFolder} refresh={refreshEntries}/>
            <div className="flex flex-row overflow-y-auto ">
                <Folders folders={folderTree} foldersForSelect={folders} chosenFolder={chosenFolder} refresh={refreshEntries} setChosenFolder={setChosenFolder} />
                <Entries userId={userId} authToken={authToken} entries={entries} chosenFolder={chosenFolder} refreshEntriesData={refreshEntries} foldersForSelect={folders} />
            </div>
        </div>
    )
}