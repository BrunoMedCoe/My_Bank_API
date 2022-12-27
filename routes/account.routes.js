//Rotas: encaminhamento de requisições
import express from "express";      //importancia de criar um roteador para separar e organizar o projeto
import AccountController from "../controllers/account.controller.js"

const router = express.Router();        //criar um objeto pro roteador

router.post("/", AccountController.createAccount);        //criando as rotas ao nivel do roteador que está associando ao express
router.get("/", AccountController.getAccounts);
router.get("/:id", AccountController.getAccount);
router.delete("/:id", AccountController.deleteAccount);
router.put("/", AccountController.updateAccount);               //atualização de recurso integral
router.patch("/updateBalance", AccountController.updateBalance);            //atualização parcial do recursos

router.use((err, req, res, next) => {               //tratamento de erros -> utilizar o next. Definiu um tratamento de erros genérico para todos os endpoints
    global.logger.error(`${err.message}`);
    res.status(400).send({error: err.message});
});

export default router;          //exportando por default, significa que pode por qq nome quando ele for importado no projeto principal (index.js)
