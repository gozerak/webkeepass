import { FoldersData } from "./Services/apiService"
import React, { useState } from "react"

function FolderTree({ folders }: { folders: FoldersData[] }) {
    // Функция для управления состоянием раскрытия каждой папки
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    const toggleFolder = (folderId: string) => {
        setOpenFolders(prevState => {
            const newState = new Set(prevState);
            if (newState.has(folderId)) {
                newState.delete(folderId); // Если папка уже открыта, закрываем её
            } else {
                newState.add(folderId); // Если папка закрыта, открываем её
            }
            return newState;
        });
    };

    if (!folders || folders.length === 0) return null;

    return (
        <ul>
            {folders.map(folder => (
                <li key={folder.folder_id}>
                    <div>
                        <strong>{folder.folder_name}</strong>
                        {/* Кнопка для раскрытия/сворачивания */}
                        {folder.children.length > 0 && (
                            <button
                                onClick={() => toggleFolder(folder.folder_id)}
                                style={{ marginLeft: '10px' }}
                            >
                                {openFolders.has(folder.folder_id) ? 'Скрыть' : 'Показать'}
                            </button>
                        )}
                        {folder.entries.length > 0 && (
                            <ul>
                                {folder.entries.map(entry => (
                                    <li key={entry.id}>
                                        {entry.record_title || 'Без названия'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Дочерние папки, показываем только если они открыты */}
                    {openFolders.has(folder.folder_id) && folder.children.length > 0 && (
                        <FolderTree folders={folder.children} />
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function Folders ({folders}: {
    folders: FoldersData[]
}) {
    return (
        <div className="w-1/3 mt-5 pl-5">
            <FolderTree folders={folders} />
        </div>
    )
}