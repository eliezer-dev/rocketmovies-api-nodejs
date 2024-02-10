const knex = require("../database/knex");
const {hash, compare} = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
    async create(req,res) {
        const {name, email, password, avatar} = req.body;
        const hashedpassword = await hash (password, 8);

        const [userFound] = await knex("users")
            .where("email", email);

        if (userFound) {
            throw new AppError("O email " + email + " já foi utilizando em outro cadastro.");
        }

        const user = await knex ("users").insert({
            name,
            email,
            password: hashedpassword,
            avatar
        })
        return res.status(201).json("usuário(a) " + name + " criado com sucesso.");
    }

    async update(req,res) {
        const {name, email, password, avatar, oldpassword} = req.body;
        const {user_id} = req.params;
        const [userToUpdate] = await knex("users").where("id", user_id );

        if(!userToUpdate) {
            throw new AppError("usuário com id " + user_id + " não encontrado." );
        }
        
        if (password && !oldpassword) {
            throw new AppError("Você deve informar a senha antiga.");
        }

        if (password  && oldpassword) {
            const checkOldpassword = await compare(oldpassword, userToUpdate.password)
            if (checkOldpassword) {
                userToUpdate.password = await hash(password,8);
            } else {
                throw new AppError("a senha antiga não corresponde a senha atual.")
            }
                  
        }      

        userToUpdate.name = name ?? userToUpdate.name;
        userToUpdate.email = email ?? userToUpdate.email;
        userToUpdate.avatar = avatar ?? userToUpdate.avatar;
        
        await knex("users")
        .update(userToUpdate)
        .update("updated_at", knex.fn.now())
        .where("id",user_id);

        return res.json("usuario atualizado.");
    }

    async show (req, res) {
        const {user_id} = req.params;
        const [user] = await knex("users").where("id", user_id)

        if (!user) {
            throw new AppError("usuário com id " + user_id + " não encontrado.");
        }

        return res.json(user);
    }

    async index (req, res) {
        const users = await knex("users");
        if (users.length === 0) {
            throw new AppError ("nenhum usuário cadastrado.");
        }

        return res.json(users);

    }

    async delete (req,res) {
        const {user_id} = req.params;
        const userDeleted = await knex("users").delete().where("id", user_id);
        if (userDeleted === 0 ) {
            throw new AppError ("usuário id " + user_id + " não encontrado.");
        } 
        return res.json("usuário id " + user_id + " deletado com sucesso.");
    }

}

module.exports = UsersController;