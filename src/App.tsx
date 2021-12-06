import React,{ useState } from "react"

type Todo = {
  value: string,
  readonly id: number,
  checked: boolean,
  removed: boolean,
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed'

const App = () =>{
  const [text,setText] = useState("")
  const [todos,setTodos] = useState<Todo[]>([])

  const [filter,setFilter] = useState<Filter>('all')

  const filteredTodos = todos.filter((todo)=>{
    switch(filter){
      case 'all':
        return !todo.removed
      case 'checked':
        return todo.checked && !todo.removed
      case 'unchecked':
        return !todo.checked && !todo.removed
      case 'removed':
        return todo.removed
      default:
        return todo
    }
  })

  const handleOnSubmit = () => {
    if(!text) return

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    }

    setTodos([newTodo,...todos])
    setText('')

    console.log(todos)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setText(e.target.value)
  }

  const handleOnEdit = (id:number,value:string) =>{

    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos));

    const newTodos = deepCopy.map((todo)=>{
      if(todo.id === id){
        todo.value = value
      }

      return todo
    })

     setTodos(newTodos);
  }

  const handleOnCheck = (id:number,checked:boolean) =>{
    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos))

    const newTodos = deepCopy.map((todo)=>{
      if(todo.id === id){
        todo.checked = !checked
      }

      return todo
    })

     setTodos(newTodos);
  }

    const handleOnRemove = (id: number, removed: boolean) => {
    const deepCopy: Todo[] = JSON.parse(JSON.stringify(todos));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });

    setTodos(newTodos);
  };


  return(
    <div>
      <form  onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}>
        <input type="text" value={text} onChange={(e)=>handleOnChange(e)} disabled={filter === 'checked' || filter === 'removed'} />
        <input type="submit" value="追加" onSubmit={handleOnSubmit} disabled={filter === 'checked' || filter === 'removed'} />
      </form>
      <ul>
        {filteredTodos.map((todo)=>{
          return (<li key={todo.id}>
            <input type="checkbox" disabled={todo.removed} checked={todo.checked} onChange={(e)=> handleOnCheck(todo.id,todo.checked)}/>
                         <input
                type="text"
                value={todo.value}
                disabled={todo.checked || todo.removed}
                onChange={(e) => handleOnEdit(todo.id,e.target.value)}
              />
                 <button onClick={() => handleOnRemove(todo.id, todo.removed)}>
      {todo.removed ? '復元' : '削除'}
    </button>
          </li>)
        })}
      </ul>

            <div>
      <select defaultValue="all" onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
    </div>
    </div>
  )
}

export default App
