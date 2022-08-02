import { useEffect, useState } from 'react'
import personService from './services/persons'

// npx json-server --port 3001 --watch db.json
const Filter = ({ newFilter, onFilterChange }) => (
  <div>
    filter shown with <input value={newFilter} onChange={onFilterChange}/>
  </div>
)

const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => (
    <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={onNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={onNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Persons = ({ persons, filter, handleDelete }) => (
  persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => 
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.name)}>delete</button>
        </div>)
)

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const ErrorMessage = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).includes(newName)) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return

      const id = persons.find(p => p.name === newName).id
      const personObject = {name: newName, number: newNumber}
      personService.update(id, personObject)
      .then(returnedPerson => {
        const copy = persons.filter(p => p.id !== id)
        setPersons(copy.concat(returnedPerson))

        setSuccessMessage(`Updated Number of '${returnedPerson.name}' in phonebook`)
        setTimeout(() => {setSuccessMessage(null)}, 5000)
      })
      .catch(error => {
        setErrorMessage(`${newName} does not exist in phonebook, try again adding`)
        setPersons(persons.filter(n => n.id !== id))
        setTimeout(() => {setErrorMessage(null)}, 5000)
      })


    } else {
      const personObject = {name: newName, number: newNumber}
      personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')

        setSuccessMessage(`Added '${returnedPerson.name}' to phonebook`)
        setTimeout(() => {setSuccessMessage(null)}, 5000)
      })
    }
  }

  const deletePerson = (name) => {
    if (!window.confirm(`Delete ${name}?`)) return

    const id = persons.find(p => p.name === name).id
    console.log("delete ", id)
    personService.remove(id)
    .then(_ => {
      const copy = persons.filter(p => p.id !== id)
      setPersons(copy)
    })
    .catch(error => {
      setErrorMessage(`${name} was already deleted from phonebook`)
      setPersons(persons.filter(n => n.id !== id))
      setTimeout(() => {setErrorMessage(null)}, 5000)
    })
  }

  useEffect(() => {
    console.log('effect')
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} />
      <ErrorMessage message={errorMessage} />

      <Filter newFilter={newFilter} onFilterChange={handleFilterChange}/>

      <h2>add a new</h2>
      
      <PersonForm onSubmit={addPerson} newName={newName} onNameChange={handleNameChange} newNumber={newNumber} onNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>

      <Persons persons={persons} filter={newFilter} handleDelete={deletePerson}/>
    </div>
  )
}

export default App