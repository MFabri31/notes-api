
const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

let notes = [
    {
        'id':1,
        'content':'run', 
        'important':false
    },
    {
        'id':2,
        'content':'read', 
   
        'important':true
    },
    {
        'id':3,
        'content':'Exercice', 
        'important':true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Notes App</h1>')
})

app.get('/api/notes', (request, response)=> { 
    response.json(notes)
})

app.get('/api/notes/:id', (request, response)=> {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if(note) response.json(note) 
    else response.status(404).end()
})

app.delete('/api/notes/:id', (request, response)=> {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end() 
})

app.post('/api/notes',(request, response) => {
    const note = request.body

    if(!note || !note.content) return response.status(400).json({
        error:'note.content is missing'
    })

    const ids = notes.map(note => note.id)    
    const maxId = Math.max(...ids)

    const newNote = {
        id: maxId + 1,
        important: typeof note.important !== 'undefined' ? note.important : false,
    }

    notes = [...notes, newNote]

    response.status(201).json(newNote)
})

app.use((request,response) => {
    response.status(404).json({
        error:'404 not found'
    })
})


const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})