import bcrypt from 'bcrypt';

export default {
    generateHash: async (key: string, load: number): Promise<string> => {
        const hash = await bcrypt.hash(key, load);

        return hash;
    },

    compareHash: async (key: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(key, hash);
    },
};
