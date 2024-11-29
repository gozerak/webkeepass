import { useEffect, useState } from "react"
import { EntriesData, fetchEntries } from "../Services/apiService"

export const useEntriesData = ({userId, authToken}:
    {userId: string | null, authToken: string | null}) => {
    const [entries, setEntries] = useState<EntriesData[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async ({userId, authToken}:
        {userId: string | null, authToken: string | null}) => {
        try {
            const entriesData = await fetchEntries({userId, authToken});
            setEntries(entriesData);
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

    return {entries, loading, refreshEntries}
}