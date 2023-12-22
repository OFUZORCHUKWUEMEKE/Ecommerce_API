import { Module } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data'


export const sendEmail = async (to: string, templateName, subject: string, templateVars: Record<string, any>) => {
    try {
        const form = new FormData();
        form.append('to', to)
        form.append("template", templateName),
            form.append('subject', subject)
        form.append('from', '@sandboxnddhknsdknksdlak')

        Object.keys(templateVars).forEach((key) => {
            form.append(`v:${key}`, templateVars[key])
        })

        const username = 'api'
        const password = ''
        const token = ''

        const response = await axios({
            method: '',
            url: '',
            headers: {
                authorization: '',
                contentType: ""
            },
            data: form
        })
        return response

    } catch (error) {
        throw new Error(error)
    }



}