import * as bcrypt from 'bcryptjs'

export const generatePassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hashPassword: string) => await bcrypt.compare(password, hashPassword) 

// export const decrypassword = async (password) => await bcrypt