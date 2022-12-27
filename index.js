import express from "express";                                     //importando express que será util para a criação de rotas
import accountsRouter from "./routes/account.routes.js";
import winston from "winston";                                      //ferramanta para gravação de LOGs
import {promises as fs} from "fs";                                   //importa o FileSystem para as leituras. -> utiliza a {promises} para não precisar fazer calback
import cors from "cors";

const {readFile, writeFile} = fs;                                      //destruction para poder utilizar as variáveis sozinhas (pelo método)

global.fileName = "accounts.json";                                      //define de forma global

const {combine, timestamp, label, printf} = winston.format;             //destruction 
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})
global.logger = winston.createLogger({                                  //define de forma global o logger
    level: "silly",                                                     //"pega tudo"
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api.log"})
    ],
    format: combine(
        label({ label: "my-bank-api"}),
        timestamp(),
        myFormat
    )
});

const app =  express();                                                   //instanciando o express
app.use(express.json());                                                  //solicitando o uso do Json
app.use(cors());                                                          //cors ->(Cross-origin Resource Sharing) é um mecanismo usado para adicionar cabeçalhos HTTP que informam aos navegadores para permitir que uma aplicação Web seja executada em uma origem e acesse recursos de outra origem diferente.
app.use(express.static("public"));                                        //solicitando a página estática html
app.use("/account", accountsRouter);                                     //associando a instancia express
app.listen(3000, async () => {                                           //inciando a API
    try {
        await readFile(global.fileName);
        logger.info("API Started!");
    } catch (err) {
        const initialJson = {                                    //definindo estrutura básica
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            logger.info("API Started and File Created!");
        }).catch(err => {
            logger.error(err);
        })
    }
});
