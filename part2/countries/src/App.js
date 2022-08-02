import { useState, useEffect } from "react"
import axios from 'axios'

const Button = ({ onClick, value }) => (
  <button onClick={onClick}>show</button>
)

const App = () => {

  const [newCountries, setNewCountries] = useState('')
  const [countries, setCountries] = useState([])

  const handleCountriesChange = (event) => {
    setNewCountries(event.target.value)

    console.log(countries.map(c => c.name.common));
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const displayCountries = () => {
    if (newCountries === '') return "";

    const filtered = countries.filter(c => c.name.common.toLowerCase().includes(newCountries.toLowerCase()))
    console.log(filtered);
    if (filtered.length > 10) {
      return "Too many matches, please specify the filter"
    } else if (filtered.length === 1) {
      const c = filtered[0]
      return (
        <div>
          <h2>{c.name.common}</h2>
          <div>capital {c.capital[0]}</div>
          <div>area {c.area}</div>
          <h4>languages</h4>
          <ul>
            {Object.entries(c.languages).map((l) => <li>{l[1]}</li>)}
          </ul>
          <img src={c.flags.png} alt={`${c.flags.png}`} />
        </div>
      )
    } else {
      return filtered.map(c => 
      <div>
        {c.name.common}
        <Button onClick={() => handleButtonPress(c.name.common)} />
      </div>
      )
    }
  }

  const handleButtonPress = (name) => setNewCountries(name)

  return (
    <div>
      <div>
        find countries 
        <input onChange={handleCountriesChange} value={newCountries}/>
      </div>
      <div>
        countries
        {displayCountries()}
      </div>
    </div>
  );
}

export default App;
