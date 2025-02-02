const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const ACCESS_TOKEN = getCookie('courses_accessToken');
console.log(ACCESS_TOKEN);

const authHeaders = () => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
});

export const fetchUsers = async () => {
    try {
        const response = await fetch(API_URL, authHeaders());

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
        }, authHeaders());

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};