import axios from "axios"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

const get_Todos = "todo/get_Todos"
const set_Count = "todo/set_Count"

const initialState = {
  todos: [],
  count: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case get_Todos:
      return { ...state, todos: action.payload }
    case set_Count:
      return { ...state, count: action.payload }
    default:
      return state
  }
}

function getTodos() {
  return dispatch => {
    axios.get("/todos").then(resp => {
      dispatch(getCount())
      dispatch({
        type: get_Todos,
        payload: resp.data
      })
    })
  }
}

function addTodo(text) {
  return dispatch => {
    axios.post("/todos", { text, status: "active" }).then(resp => {
      dispatch(getTodos())
    })
  }
}

function toggleTodo(id) {
  return dispatch => {
    axios.get("/todos" + id).then(resp => {
      const todo = resp.data
      if (todo.status === "completed") {
        axios.patch("/todos/" + id, { status: "active" }).then(resp => {
          dispatch(getTodos())
        })
      } else {
        axios.patch("/todos/" + id, { status: "completed" }).then(resp => {
          dispatch(getTodos())
        })
      }
    })
  }
}

function deleteTodos(id) {
  return dispatch => {
    axios.delete("/todos/" + id).then(resp => {
      dispatch(getTodos())
    })
  }
}

function filterTodos(filter) {
  return dispatch => {
    let query = ""
    if (filter === "all") {
      query = ""
    } else if (filter === "completed") {
      query = "?status=completed"
    } else if (filter === "active") {
      query = "?status=active"
    }
    axios.get(`/todos${query}`).then(resp => {
      dispatch({
        type: get_Todos,
        payload: resp.data
      })
      dispatch(getCount)
    })
  }
}
function getCount() {
  return dispatch => {
    axios.get("/todos?status=active").then(resp => {
      dispatch({
        type: set_Count,
        payload: resp.data.length
      })
    })
  }
}

function clearTodos() {
  return dispatch => {
    axios.get("/todos?status=completed").then(resp => {
      Promise.all(
        resp.data.map(
          todo =>
            new Promise((resolve, reject) => {
              axios.delete("/todos/" + todo.id).then(resp => {
                resolve()
              })
            })
        )
      ).then(values => {
        dispatch(getTodos())
      })
    })
  }
}

export function useTodos() {
  const dispatch = useDispatch()
  const todos = useSelector(appState => appState.todoState.todos)
  const count = useSelector(appState => appState.todoState.count)
  const add = text => dispatch(addTodo(text))
  const del = id => dispatch(deleteTodos(id))
  const toggle = id => dispatch(toggleTodo(id))
  const filter = filter => dispatch(filterTodos(filter))
  const clear = () => dispatch(clearTodos())
  useEffect(() => {
    dispatch(getTodos())
  }, [dispatch])
  return { todos, add, del, toggle, count, filter, clear }
}
