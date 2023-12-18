import * as bcrypt from 'bcryptjs'

export const generateHash = async (password: string) => await bcrypt.hashSync(password) 