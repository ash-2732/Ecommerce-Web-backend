import bcrypt  from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.log(error)
    }
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

