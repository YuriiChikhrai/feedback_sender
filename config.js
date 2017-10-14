"use strict";

module.exports = {
    sender: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: '@gmail.com',
            pass: ''
        }
    },
    receiver: {
        email: '',
        subject: (site) => {
            return `New feedback from user on ${site}`;
        }
    }
};