import nodemailer from "nodemailer";

export const emailAdapters={
    async gmailSendEmailRegistration(email:string, code:string){
        const transport= await nodemailer.createTransport({
            service:'gmail',
            auth:
                {
                    user:'rustamincubator@gmail.com',
                    pass:'poznkvwenjowduaq'
                }
        })

        const info= await transport.sendMail({
            from:'admin <rustamincubator@gmail.com>',
            to:email,
            subject:'Registration in platform',
            html: ' <h1>Thank for your registration</h1>\n' +
                '       <p>To finish registration please follow the link below:\n' +
                '          <a href=\'https://somesite.com/confirm-email?code='+code+'\'>complete registration</a>\n' +
                '      </p>'


        })
    },
    async gmailSendEmailPasswordRecovery(email:string,code:string){
        const transport= await nodemailer.createTransport({
            service:'gmail',
            auth:
                {
                    user:'rustamincubator@gmail.com',
                    pass:'poznkvwenjowduaq'
                }
        })

        const info=await transport.sendMail({
                from:'admin <rustamincubator@gmail.com>',
                to:email,
                subject:'Password recovery in platform',
            html: '<h1>Password recovery</h1>'+
            '<p>To finish password recovery please follow the link below:'+
                ' <a href=\'https://somesite.com/password-recovery?recoveryCode=' + code + '>recovery password</a>'+
             '</p>'

    })
    }
}