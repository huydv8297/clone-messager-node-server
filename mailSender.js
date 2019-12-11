var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
module.exports =  function(sendContent){

    let clientId = '16735166254-1l19ofghdauj1071dinera1gcrcnrcvj.apps.googleusercontent.com'
    let clientSecret = 'mffcGgFVG3XJ2_DC52u8L2VT'
    var smtpTransport = mailer.createTransport({
        service: "SendPulse",
        auth: {
            user: "lupacexi@gmail.com",
            pass: "huydv12345"
        }
    });
    
    var mail = {
        from: "lupacexi@yandex.com",
        // to: sendContent.to,
        // subject: sendContent.subject,
        // text: sendContent.text,
        // html: sendContent.html
        to: "lupacexi@gmail.com",
        subject: "",
        text: "",
        html: ""
    }
    
    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log('error');
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    
        smtpTransport.close();
    });
}