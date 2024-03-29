const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', get_data = (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const contact_count = persons.length
    const info = `<p>Phonebook has info for ${contact_count} people</p>
    <p>${Date()}</p>`
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
      response.status(404).end()
    }
}
)

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
}
)

app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = Math.floor(Math.random() * 999999999999999)

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }

  if (persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})