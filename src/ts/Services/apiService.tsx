import { API_BASE_URL } from "../SignMainElem";

export interface EntriesData {
    id: string,
    user_id: string,
    folder_id: string,
    record_title?: string,
    password?: string,
    user_name?: string,
    description?: string,
    record_url?: string,
    created_date: string
}

export async function fetchEntries ({userId, authToken}:{
    userId: string | null, 
    authToken: string | null
}): Promise<EntriesData[]> {
    const response = await fetch (`${API_BASE_URL}/api/PasswordsRecords/GetPasswordRecord?userId=${userId}`, {
        method:'GET',
        headers: {
           "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}` 
        }
    });
    if (response.ok) {
        const json = await response.json()
        const data: EntriesData[] = json.value.passwords
        console.log(data)
        return data;
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
}