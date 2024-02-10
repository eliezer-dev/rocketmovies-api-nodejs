const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class TagsController {
    async index (req,res) {
        const {user_id, name} = req.query
        let tags;
        if(name){
            tags = await knex("movie_tags") 
            .where((builder) => {if (user_id) builder.where({user_id})})
            .whereLike('name', `%${name}%`)

            
        }else {
            tags = await knex("movie_tags") 
            .where((builder) => {if (user_id) builder.where({user_id})})
        }

        if (tags.length === 0) {
            throw new AppError("nenhuma tag encontrada")
        }
        
        return res.json(tags)

    }

    async show (req,res) {
        const {tag_id} = req.params
        const [tag] = await knex("movie_tags").where("id", tag_id)

        if (!tag) {
            throw new AppError("tag com id " + tag_id + " não encontrada")
        }

        return res.json(tag)
    }
}

module.exports = TagsController