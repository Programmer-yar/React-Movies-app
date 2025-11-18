import { Client, Databases, TablesDB, Query, ID } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint
    .setProject(APPWRITE_PROJECT_ID); // Your project ID

// const database = new Databases(client);
const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // console.log(APPWRITE_PROJECT_ID, DATABASE_ID, COLLECTION_ID);
    // 1. Use appwrite SDK to check if the search term already exists in the database
    // const searchTerm = "ultron"; // Example search term
    console.log("Query", searchTerm);
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [Query.equal('searchTerm', [searchTerm])]
        });

        console.log(`Total rows found: ${result.total}`);
        if (result.total > 0) {
            console.log(`Search term "${searchTerm}" found. Updating count.`);
            const firstRow = result.rows[0];
            console.log(`row id ${firstRow.$id}`);
            console.log(`search term: ${firstRow.searchTerm}`);
            const updatedRow = await tablesDB.updateRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: firstRow.$id,
                data: {
                    count: firstRow.count + 1
                }
            });
            console.log('Updated existing search term:', updatedRow);
        } else {
            console.log(`Search term "${searchTerm}" not found. Creating new entry.`);
            const newRow = await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            });
            console.log('Created new search term:', newRow);
        }
    } catch(error) {
        console.error('Error updating search count:', error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [Query.orderDesc('count'), Query.limit(5)]
        });
        console.log('Trending movies:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}