

const API_URL = 'http://localhost:3001/users'; 


export const fetchUsers = async () => {
    try {
        const response = await fetch(API_URL);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const addUser = async (user) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};