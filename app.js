const express = require('express') 
const morgan = require('morgan')
const favicon = require('serve-favicon')
//Récup body-parser pour convertir les datas JSON en string et inversement
const bodyParser = require('body-parser')
//ORM pour se connecter à la BDD MariaDb 
const { Sequelize } = require('sequelize')
//Récupérer les méthods
const { success, getUniqueId } = require('./helper.js')
//Importer la BDD créée manuellement
let pokemons = require('./mock-pokemon')

//Créer une instance d'une app Express -> serveur web sur lequel fonctionne l'API Rest
const app = express() 

//Définir le port sur lequel on démarre l'API Rest
const port = 3000 

// ------------ Connecter ORM à la BDD MariaDB -------------------------
const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timzezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
.then(_ => console.log('La connexion a la BDD a bien été établie.'))
.catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

//------------ CREER UN MIDDLEWARE ------------------------------------
// app.use((req, res, next) => {
//     console.log(`URL : ${req.url}`)
//     next()
// })

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev')) //middleware qui permet d'afficher l'URL
    .use(bodyParser.json()) 


// ------------- POINTS DE TERMINAISON -> routes du projet ------------

app.get('/', (req, res) => res.send('Hello again Express 2 !')) 

app.get('/api/pokemons/:id', (req, res) => {
    //convertir id en nombre pour éviter d'avoir une chaîne string retournée par le router Express
    const id = parseInt(req.params.id) 
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    // res.send(`Vous avez demandé le pokemon ${pokemon.name}`)
    const message = 'Un pokémon a bien été trouvé'
    // res.json(pokemon)
    // res.json(helper.success(message, pokemon))
    res.json(success(message, pokemon))
})

//Afficher les 12 pokemons au format JSON
app.get('/api/pokemons', (req, res) => {
    const message = `La liste des pokemons a bien été retournée. Il y a ${pokemons.length} pokémons dans la pokedex.`
    res.json(success(message, pokemons))
})

//Ajouter un Pokémon à l'API Rest
app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien été ajouté.`
    res.json(success(message, pokemonCreated))
})

//Moifier les données d'un Pokémon
app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    //Créer un nouveau pokémon
    const pokemonUpdated = {...req.body, id: id}
    //Parcourir le tableau pokemon pour remplacer le pokemon avec le même id
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié`
    res.json(success(message, pokemonUpdated))
})

//Supprimer un Pokémon
app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé`
    res.json(success(message, pokemonDeleted))
})


// -------------------------------------------------------------------

app.listen(port, () => console.log(`Notre application Node est démarée sur : http://localhost:${port}`)) //Démarrer l'API sur le port 3000 et afficher un message dans la ligne de commande

