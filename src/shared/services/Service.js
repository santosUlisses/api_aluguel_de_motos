const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sharp = require("sharp");
const fsSync = require("fs/promises");
const fs = require('fs')
const path = require("path");
const { v4: uuidv4 } = require("uuid");


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


    async processarImagem(imagem) {
        const novoNome = `moto-${uuidv4()}.webp`;
        const uploadPath = path.resolve("uploads");

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        const caminhoSaida = path.resolve("uploads", novoNome);


        const buffer = await sharp(imagem.path).resize(1200, 800, {
            fit: "cover"
        }).webp({ quality: 80 }).toBuffer();

        fsSync.writeFile(caminhoSaida, buffer);

        await new Promise(resolve =>
            setTimeout(resolve, 300)
        );
        try {
            await fsSync.unlink(imagem.path);
        } catch (error) {
            console.warn("Erro ao remover arquivo temporário.", error.message);
        }


        return `/uploads/${novoNome}`;
    }

}

module.exports = new Service();