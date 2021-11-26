const sgMail = require('@sendgrid/mail')
// const config = require('../../../config')
// const sengridApiKey = config.keys.SENDGRID_KEY


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ieva.aleksandravica@gmail.com',
        subject: 'Welcome to the Task App.',
        text: `${name}, thank you for joining!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ieva.aleksandravica@gmail.com',
        subject: 'We are sorry to see you go..',
        text: `Hey, ${name}, so sorry to see you go. Could you let us know what can we do better next time?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
// sgMail.send({
//     to: 'ieva.aleksandravica@gmail.com',
//     from: 'ieva.aleksandravica@gmail.com',
//     subject: 'This is my second creation!',
//     text: 'I hope this one actually gets to you.'
// })
