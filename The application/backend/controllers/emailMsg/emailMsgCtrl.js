const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const Filter = require("bad-words");
const EmailMsg = require("../../model/EmailMessaging/EmailMessaging");


const sendEmailMsgCtrl = expressAsyncHandler(async (req,res)=>{
    console.log(req.user);
    const {to, subject, message} = req.body;
    // get the message
    const emailMessage = subject + " " +message;
    //prevent profanity/bad words
    const filter = new Filter();

    const isProfane = filter.isProfane(emailMessage);
    if(isProfane) throw new Error("Email sent failed, because it contains bad words")
    try{
        //build up msg
        const msg = {
            to,
            subject,
            text: message,
            from: "imantoufani@gmail.com",
        };
        //send msg
        await sgMail.send(msg);
        //save to our db
        await EmailMsg.create({
            sentBy: req?.user?._id,
            from: req?.user?.email,
            to, 
            message,
            subject,
        });
        res.json("Mail sent");
    } catch(error){
        res.json(error);
    }
});

module.exports = { sendEmailMsgCtrl };