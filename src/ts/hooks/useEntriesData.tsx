import { useEffect, useState } from "react"
import { EntriesData, fetchEntries, FoldersData } from "../Services/apiService"

export const useEntriesData = ({userId, authToken}:
    {userId: string | null, authToken: string | null}) => {
    const [entries, setEntries] = useState<EntriesData[]>([]);
    const [folders, setFolders] = useState<FoldersData[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async ({userId, authToken}:
        {userId: string | null, authToken: string | null}) => {
        try {
            const [entriesData, foldersData] = await fetchEntries({userId, authToken});
            setEntries(entriesData);
            setFolders(foldersData)
        } catch (error) {
            console.error("Error fetching entriesData:", error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    getData({userId, authToken});
    }, []);

    const refreshEntries = (userId: string | null, authToken: string | null) => {
        getData({userId, authToken});
    }

    return {entries, folders, loading, refreshEntries}
}