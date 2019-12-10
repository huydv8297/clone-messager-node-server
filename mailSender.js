var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
module.exports =  function(){

    let clientId = '16735166254-1l19ofghdauj1071dinera1gcrcnrcvj.apps.googleusercontent.com'
    let clientSecret = 'mffcGgFVG3XJ2_DC52u8L2VT'
    var smtpTransport = mailer.createTransport({
        service: "Yandex",
        auth: {
            user: "lupacexi@yandex.com",
            pass: "huyoilahuy"
        }
    });
    
    var mail = {
        from: "lupacexi@yandex.com",
        to: "lupacexi@gmail.com",
        subject: "Send Email Using Node.js",
        text: "Node.js New world for me",
        html: "<b>Node.js New world for me</b>"
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