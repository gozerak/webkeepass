import { API_BASE_URL } from "../SignMainElem";

export interface EntriesData {
    id: string,
    user_id: string,
    folder_id: string,
    record_title: string,
    password: string,
    user_name: string,
    description: string,
    record_url: string,
    created_date: string,
    password_id: string,
}

export interface FoldersData {
    id: string,
    folder_id: string,
    user_id: string,
    folder_name: string,
    folder_notes: string, 
    created_date: string,
    primaryFolder_id: string,
    entries: EntriesData[]; // Добавляем записи
    children: FoldersData[];
}

export async function fetchEntries ({userId, authToken}:{
    userId: string | null, 
    authToken: string | null
}): Promise<[EntriesData[], FoldersData[]]> {
    const response = await fetch (`${API_BASE_URL}/api/PasswordsRecords/GetPasswordRecord?userId=${userId}`, {
        method:'GET',
        headers: {
           "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}` 
        }
    });
    if (response.ok) {
        const responseData = await response.json()
        const data: EntriesData[] = responseData.passwords
        const folders: FoldersData[] = responseData.folders
        // console.log(data)
        return [data, folders];
    } else {
        throw new Error("Failed to fetch entries");
    }
}

export interface AddEntryData {
    user_id: string,
    record_title: string,
    password: string,
    user_name: string,
    description: string,
    record_url: string,
    folder_id: string
}