import { useState } from 'react'

const Button = ({ onClick, state, text }) => 
  <button onClick={() => onClick(state + 1)}>{text}</button>

const StatisticLine = ({ text, value }) => (
<tr>
  <th>{text}</th>
  <th>{value}</th>
</tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (good - bad)/(total)
  const positive = (good*100)/(total)

  if (total === 0) {
    return (<p>No feedback given</p>)
  }

  return(
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={positive}/>
      </tbody>
    </table>)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={setGood} state={good} text={"good"}/>
      <Button onClick={setNeutral} state={neutral} text={"neutral"}/>
      <Button onClick={setBad} state={bad} text={"bad"}/>

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App