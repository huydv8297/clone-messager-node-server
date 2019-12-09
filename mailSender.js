var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
module.exports =  function(){
    var smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: "lupacexi2@gmail.com",
            pass: "huyoilahuy97"
        }
    });
    
    var mail = {
        from: "Yashwant Chavan <from@gmail.com>",
        to: "lupacexi3@gmail.com",
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