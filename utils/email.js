const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, bookingDetails) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.from = `Bala Yogesh <${process.env.EMAIL_FROM}>`;
    this.doctorName = bookingDetails.doctorName;
    this.doctorSpeciality = bookingDetails.doctorSpeciality;
    this.userName = bookingDetails.userName;
    this.appointmentTime = bookingDetails.appointmentTime;
  }

  newTransport() {
    // console.log(process.env.SENDINBLUE_PASSWORD);
    // if (process.env.NODE_ENV === "development") {
    // sendinblue
    return nodemailer.createTransport({
      service: "SendinBlue",
      auth: {
        user: process.env.SENDINBLUE_USERNAME,
        pass: process.env.SENDINBLUE_PASSWORD
      }
    });
    // }
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template\
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      subject,
      doctorName: this.doctorName,
      doctorSpeciality: this.doctorSpeciality,
      userName: this.userName,
      appointmentTime: this.appointmentTime
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) create a transport and send mail
    const res = await this.newTransport().sendMail(mailOptions);
    return res;
  }

  async sendBookingConfirmation() {
    const res = await this.send("booking");
    return res;
  }
};
