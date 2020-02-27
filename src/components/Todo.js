import React, { useState, useRef } from "react"
import { useTodos } from "../hooks"

export default props => {
  const { todos, add, del, toggle, count, filter, clear } = useTodos()
  const [todo, setTodo] = useState("")
  const inputEl = useRef(null)
  const [view, setView] = useState("all")

  function handleSubmit(e) {
    e.preventDefault()
    add(todo)
    setTodo("")
    inputEl.current.focus()
  }

  function changeView(status) {
    setView(status)
    filter(status)
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputEl}
          type="text"
          onChange={e => setTodo(e.target.value)}
          placeholder="What're todays tasks?"
          value={todo}
        />
        <button className="submitbutton" type="submit">
          +
        </button>
      </form>
      <ul>
        {todos.map(todo => (
          <li
            key={"todo" + todo.id}
            classname={todo.status === "completed" ? "completed" : ""}
            onClick={e => toggle(todo.id)}
          >
            {todo.text} <button onClick={e => del(todo.id)}>X</button>{" "}
          </li>
        ))}
      </ul>
      <p>Count: {count} items left</p>
      <div className="statusbuttons">
        <button
          onClick={view === "all" ? true : false}
          onChange={e => changeView("all")}
          name="view"
          id="all"
        >
          All
        </button>
        <br />

        <button
          onClick={view === "active" ? true : false}
          onChange={e => changeView("active")}
          name="view"
          id="active"
        >
          Active
        </button>
        <br />

        <button
          onClick={view === "completed" ? true : false}
          onChange={e => changeView("completed")}
          name="view"
          id="comepleted"
        >
          Completed
        </button>
      </div>
      <button className="compClear" onClick={e => clear()}>
        Clear Completed
      </button>
    </div>
  )
}
