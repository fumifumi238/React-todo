import React,{useState} from "react";
import './index.css';

type Todo = {
  value: string,
  id: number,
  delete: boolean,
  checked: boolean
}

type Filter = 'all' | 'checked' | 'delete'

function App(){

  const [text,setText] = useState("")
  const [todos,setTodos] = useState<Todo[]>([])
  const [id,setId] = useState<number>(1)
  const [filter,setFilter] = useState<Filter>("all")
  let btn;

  const filterTodos = todos.filter((todo)=>{
    switch(filter){
      case 'all':
        return !todo.delete
      case 'checked':
        return todo.checked && !todo.delete
      case 'delete':
        return todo.delete
      default:
        return todo
    }
  })

  const setInputValue = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value)
    console.log(text)
  }

  const addTodos = () =>{
    if(!text){
      return
    }

    const newTodo: Todo = {
      value: text,
      id: id,
      delete: false,
      checked: false
    }

    setTodos([newTodo,...todos])
    setId(id + 1)
    setText('')

    console.log(todos)
  }

  const handleOnRestore = ()=>{
      const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos))
      const newTodos = deepCopy.map((todo)=>{
        if(todo.delete){
          todo.delete = false;
        }

        return todo
      })

      setTodos(newTodos)
  }

  const handleOnEdit = (id:number,value: string) =>{
    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos))
    const newTodos = deepCopy.map((todo) =>{

      if(todo.id === id){
        todo.value = value
      }

      return todo
    })

    setTodos(newTodos)
  }

  const handleOnDelete = (id: number) =>{
    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos));
    const newTodos = deepCopy.map((todo)=>{
      if(todo.id === id){
        todo.delete = !todo.delete
      }
      return todo
    })

    setTodos(newTodos)
  }

  const deleteCompletely = () =>{
    let check = window.confirm("本当に削除しますか?")
    if(!check){
      return 
    }
    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos))
    const newTodos =  deepCopy.filter((todo)=>!todo.delete)

    setTodos(newTodos)
  }
  const handleOnChecked = (id:number) =>{
    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos))
    const newTodos = deepCopy.map((todo)=>{
      if(todo.id === id){
        todo.checked = !todo.checked
      }
      return todo
    })

    setTodos(newTodos)
  }

  if(todos.filter((todo)=>todo.delete).length === 0 && filter === 'delete'){
    btn = <p>ゴミ箱は空です</p>
  }else if(filter === 'delete'){
    btn = <>
    <button　onClick={handleOnRestore}>すべて復元する</button>
    <button　onClick={deleteCompletely}>完全に削除する</button>
    </>
  }


  return (
    <div>
      <form onSubmit={e => {e.preventDefault(); addTodos();}}>
      <input type="text" value={text} onChange={(e)=>setInputValue(e)}/>
      <input onSubmit={addTodos} type="submit" value="追加"/>
      </form>
      <select defaultValue="all" onChange={e=>setFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">チェックしたタスク</option>
        <option value="delete">削除したタスク</option>
      </select>
      <ul>
      {filterTodos.map((todo)=>{
        return(
          <li key={todo.id}>{todo.id}:
          <input type="checkbox" checked={todo.checked} onChange={(e)=>handleOnChecked(todo.id)}/>
            <input type="text" value={todo.value} onChange={(e)=>handleOnEdit(todo.id,e.target.value)} disabled={todo.checked}/>
            <button onClick={() => handleOnDelete(todo.id)}>{todo.delete?'復元':'削除'}</button>
          </li>
        )
      })}
      </ul>
      {btn}
    </div>
  )
}

export default App
