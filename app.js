//Récupérer le paquet Express dans le paquet node_modules
const express = require('express') 
// const helper = require('./helper.js')
const { success } = require('./helper.js') //Récupérer uniquement la méthode success et pas le module helper complet

let pokemons = require('./mock-pokemon')

//Créer une instance d'une app Express -> serveur web sur lequel fonctionne l'API Rest
const app = express() 

//Définir le port sur lequel on démarre l'API Rest
const port = 3000 

//CREER UN MIDDLEWARE
app.use((req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
})

// POINTS DE TERMINAISON -> routes du projet

app.get('/', (req, res) => res.send('Hello again Express 2 !')) 

app.get('/api/pokemons/:id', (req, res) => {
    //convertir id en nombre pour éviter d'avoir une chaîne string retournée par le router Express
    const id = parseInt(req.params.id) 
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    // res.send(`Vous avez demandé le pokemon ${pokemon.name}`)
    const message = 'Un pokémon a bien été trouvé'
    // res.json(pokemon)
    // res.json(helper.success(message, pokemon)) //Si on utilise la ligne 3
    res.json(success(message, pokemon)) //Si on utilise la ligne 4
})

//Afficher nombre total de Pokemons dans l'API
// app.get('/api/pokemons', (req, res) => {
//     res.send(`Il y a ${pokemons.length} dans le pokedex`)
// })

//Afficher les 12 pokemons au format JSON
app.get('/api/pokemons', (req, res) => {
    const message = 'La liste des pokemons a bien été retournée'
    res.json(success(message, pokemons))
})

app.listen(port, () => console.log(`Notre application Node est démarée sur : http://localhost:${port}`)) //Démarrer l'API sur le port 3000 et afficher un message dans la ligne de commande

