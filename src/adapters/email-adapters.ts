import nodemailer from "nodemailer";

export const emailAdapters={
    async gmailAdapter(email:string,code:string){
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
            html: 'https://somesite.com/confirm-email?code='+code
        //"</h1>"+code+"<h1>"

        })
    }
}