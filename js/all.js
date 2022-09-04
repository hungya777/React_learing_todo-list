const { useState, useEffect } = React;

const TodoInput = function ({inputTodo, setInputTodo, todos, setTodos}) {
    const addTodo = () => {
        if(inputTodo.trim() === "") {
            swal("新增失敗", "點擊新增待辦事項，欄位內容不可空白!", "error");
        } else {
            swal("新增成功!", "", "success");
            setInputTodo("");  //清空輸入待辦欄位
            //將新增的待辦事項加入todos陣列中
            setTodos([...todos, { tID:Date.now(), content:inputTodo, done:false}]);  
        }
    }
    return (
        <div className="inputBox">
            <input type="text" placeholder="請輸入待辦事項" value={inputTodo} onChange={(e) =>setInputTodo(e.target.value)} />
            <a href="#" onClick={() => addTodo()}>
                <i className="fa fa-plus"></i>
            </a>
        </div>
    )
}

const TodoItem = function ({todo, todos, setTodos}) {
    const {tID, content, done} = todo;
    const deleteTodo = (tID) => {
        swal({
            title: "請再次確認是否刪除此項目",
            text: "項目一但刪除後，將無法再復原!",
            icon: "warning",
            buttons: ["取消", "確認"],  //buttons: ["cancel", "confirm"]
            })
            .then((willDelete) => {
                if (willDelete) {
                    setTodos(todos.filter((item) => {return item.tID !== tID} ));
                    swal("成功刪除所選項目!", {
                        icon: "success",
                    });
                } else {
                    swal("取消刪除項目!");
                }
            });
    }
    const doneTodo = () => {
        setTodos(
            todos.map((item) => 
                item.tID == tID ? {...item, done: !item.done} : item
            )
        )
        // 另一種寫法: 
        // const newTodos = [...todos];
        // newTodos.forEach((data) => {
        //     if(data.tID === tID) {
        //         data.done = !data.done
        //     }
        // })
        // setTodos(newTodos);\
    }
    return (
        <>
            <li className="d-flex align-items-center">
                <label className="todoList_label">
                    <input 
                        className="todoList_input" 
                        type="checkbox" 
                        checked={done ? "checked" : ""}
                        onChange={()=>{doneTodo(tID)}} 
                    />
                    <span>{content}</span>
                </label>
                <a href="#" onClick={()=>{deleteTodo(tID)}}>
                    <i className="fa fa-times"></i>
                </a>
            </li>
        </>
    )
}

const Todolist = function ({filterTodos, todos, setTodos}) {
    return (
        <ul className="todoList_item">
            {filterTodos.map((todo) =>
                <TodoItem key={todo.tID} todo={todo} todos={todos} setTodos={setTodos} />
            )}
        </ul>
    )
}

const TodoStatus = function ({todoState, setTodoState}) {
    const btnStatus = (e) => {
        setTodoState(e.target.dataset.staus);
    }
    return (
        <ul className="todoList_tab">
            <li>
                <a href="#" 
                data-staus="all" 
                className={todoState==="all" ? "active" : ""} 
                onClick={btnStatus}>
                    全部
                </a>
            </li>
            <li>
                <a href="#" 
                data-staus="undone" 
                className={todoState==="undone" ? "active" : ""} 
                onClick={btnStatus}>
                    待完成
                </a>
            </li>
            <li>
                <a href="#" 
                data-staus="done" 
                className={todoState==="done" ? "active" : ""} 
                onClick={btnStatus}>
                    已完成
                </a>
            </li>
        </ul>
    )
}

const App = function () {
    const [inputTodo, setInputTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [filterTodos, setFilterTodos] = useState([]);
    const [todoState, setTodoState] = useState("all");
    useEffect(() => {
        filterTodo(todoState, todos);
    }, [todos, todoState]);

    // todo狀態分類
    const filterTodo = (todoState, todos) => {
        if(todoState === "undone") {
            setFilterTodos(
                todos.filter((todo) => {
                    return todo.done === false;
                })
            );
        } else if (todoState === "done") {
            setFilterTodos(
                todos.filter((todo) => {
                    return todo.done === true;
                })
            );
        } else {
            setFilterTodos(todos);
        }
    }
    //清除所有已完成項目
    const deleteAll = () => {
        swal({
            title: "請再次確認是否刪除所有已完成項目",
            text: "項目一但刪除後，將無法再復原!",
            icon: "warning",
            buttons: ["取消", "確認"],  //buttons: ["cancel", "confirm"]
            })
            .then((willDelete) => {
                if (willDelete) {
                    setTodos(todos.filter((item)=> item.done == false));
                    swal("成功刪除所有已完成項目!", {
                        icon: "success",
                    });
                } else {
                    swal("取消刪除已完成項目!");
                }
            }
        );
    }

    return (
        <div id="todoListPage" className="bg-half">
            <nav>
                <h1><a href="#">ONLINE TODO LIST</a></h1>
                <ul>
                    <li className="todo_sm"><a href="#"><span>王小明的代辦</span></a></li>
                    <li><a href="#loginPage">登出</a></li>
                </ul>
            </nav>
            <div className="conatiner todoListPage vhContainer">
                <div className="todoList_Content">
                    <TodoInput inputTodo={inputTodo} setInputTodo={setInputTodo} todos={todos} setTodos={setTodos} />
                    <div className="todoList_list">
                        <TodoStatus todoState={todoState} setTodoState={setTodoState} />
                        <div className="todoList_items">
                            <Todolist filterTodos={filterTodos} todos={todos} setTodos={setTodos} />
                            <div className="todoList_statistics">
                                {todos.length > 0 ? (
                                    <>
                                        <p> 
                                            {todos.filter((item) => item.done === false).length}
                                            個待完成項目
                                        </p>
                                        <a href="#" onClick={deleteAll}>清除已完成項目</a>
                                    </>
                                ):( <div className="emptyTodo"><p>目前尚無待辦事項</p></div> )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
