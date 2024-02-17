const knex = require("../database/knex");
const {hash, compare} = require("bcryptjs");
const AppError = require("../utils/AppError");

class MoviesController {
    async create(req,res){
        const {title, description, rating, tags} = req.body;
        const {user_id} = req.params

        const [user] = await knex("users").where("id", user_id);
        
        if (!user) {
            throw new AppError("usuário não encontrado.");
        }

        const [movie_notes] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsToInsert = tags.map(name => {
            return {
                note_id: movie_notes,
                user_id,
                name
            }
        })

        await knex("movie_tags").insert(tagsToInsert);

        return res.status(201).json("nota criada com sucesso.");
    }

    async index(req,res){
        let {user_id, title, rating, tags} = req.query;
        let movieNotes;
        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim());
            if (title) {
                movieNotes = await knex("movie_tags")

                .select([
                    "movie_notes.id",
                    "movie_notes.title",
                    "movie_notes.description",
                    "movie_notes.rating",
                    "movie_notes.created_at"
                ])
                .where((builder) => {if (user_id) builder.where("movie_notes.user_id", user_id)})
                .where((builder) => {if (rating) builder.where("movie_notes.rating", rating)})
                .whereLike("movie_notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
                .groupBy("movie_notes.id")
                .orderBy("movie_notes.title")                

            }else {
                movieNotes = await knex("movie_notes")
                .where((builder) => {if (user_id) builder.where({user_id})})
                .where((builder) => {if (rating) builder.where({rating})})
            }

            movieNotes = await insertTagsIntoNotes(user_id, movieNotes);

        } else {
            if (title) {
                movieNotes = await knex("movie_notes")
                .where((builder) => {if (user_id) builder.where({user_id})})
                .where((builder) => {if (rating) builder.where({rating})})
                .whereLike("title", `%${title}%`);                

            }else {
                movieNotes = await knex("movie_notes")
                .where((builder) => {if (user_id) builder.where({user_id})})
                .where((builder) => {if (rating) builder.where({rating})})
            }
        }
       

        if (!movieNotes) {
            throw new AppError("nenhuma nota cadastrada");
        }
      
        return res.json(movieNotes)
    }

    async show(req,res) {
        const {note_id} = req.params;
        let movieNotes = await knex("movie_notes").where("id", note_id);
        if (movieNotes.length === 0) {
            throw new AppError("filme com o id " + note_id + " não encontrado.")
            
        }
        const user_id = movieNotes[0].user_id
        movieNotes = await insertTagsIntoNotes(user_id, movieNotes);
        return res.json(movieNotes);
    }

    async delete(req,res){
        const {note_id} = req.params;
        await knex("movie_notes").delete().where("id", note_id)
        res.json("nota id " + note_id + " deletada com sucesso.")

    }
}

async function insertTagsIntoNotes(user_id, movieNotes) {
    const userTags = await knex("movie_tags").where({user_id})
    const notesWithTags = movieNotes.map(note => {
        const notesTags = userTags.filter(tag => {
            return tag.note_id === note.id
        })
        return {
            ...note,
            tags: notesTags
        }
    })
    return notesWithTags
}

module.exports = MoviesController;