const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');



class Service {
    async criarSenha(senha) {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        return senhaHash;
    }

    async enviarEmail(email) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ulisses.santoos@gmail.com",
                pass: process.env.senha_email,
            }
        });
        const configEmail = {
            from: "ulisses.santoos@gmail.com",
            to: email,
            subject: "Criação de conta",
            text: "VOCÊ CRIOU SUA CONTA COM SUCESSO"
        }
        try {
            await transporter.sendMail(configEmail, (error, info) => {
                if (error) {
                    console.log(error);
                }
                console.log("email enviado com sucesso");
            });


        } catch (error) {
            console.log(`falha ao enviar : ${error}`);


        }
    }

}

module.exports = new Service();