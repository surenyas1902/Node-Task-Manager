const sgMail = require('@sendgrid/mail');
//const sendgridApiKey = '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';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'surenyas1902@gmail.com',
        subject: 'Welcome to the Task App',
        text: `Welcome to the App ${name}. Let us know the experience`
    })
}

const cancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'surenyas1902@gmail.com',
        subject: 'We are sorry to go away',
        text: `We are sorry for you to go away ${name}. Please join us if you change the mind`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancellationEmail
}