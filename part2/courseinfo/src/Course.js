const Header = (props) => (
    <h1>{props.course.name}</h1>
  )

const Content = ({ parts }) => (
  <div>
    {parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
  </div>
)

const Total = ({ parts }) => {
    const total = parts.map(part => part.exercises)
    const sum = total.reduce((p1, p2) => p1 + p2, 0)
  
    return (
      <h4>
        total of {sum} exercises
      </h4>
    )
  }

const Part = (props) => (
    <p>
      {props.part} {props.exercises}
    </p>
  )

const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
}

export default Course