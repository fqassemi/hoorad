const API_BASE_URL = process?.env?.NEXT_PUBLIC_API_BASE_URL;

const fetchDataHandler = async (endpoint, options, baseUrl = API_BASE_URL) => {
   const response = await fetch(`${baseUrl}${endpoint}`, options);
   return response.json();
};

export default fetchDataHandler;
