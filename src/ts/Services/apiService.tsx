import { API_BASE_URL } from "../SignMainElem";

export interface EntriesData {
    id: string,
    user_id: string,
    record_title?: string,
    password?: string,
    user_name?: string,
    description?: string,
    record_url?: string,
    created_date: string
}

export async function fetchEntries (userId: string, authtoken: string): Promise<EntriesData[]> {
    const response = await fetch (`${API_BASE_URL}/api/PasswordRecords/GetPasswordRecord`, {
        method:'GET',
    });
    if (response.ok) {
        const data: EntriesData[] = await response.json();
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