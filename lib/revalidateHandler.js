'use server';

const { revalidatePath } = require('next/cache');

const revalidatePathHandler = (path, type) => {
   revalidatePath(path, type);
};

export default revalidatePathHandler;
