const studentId = '41041225';  // 學號設定為 41041225

// 取得所有代辦事項
function fetchTodos() {
    fetch(`https://nfutest.pythonanywhere.com/todos?student_id=${studentId}`)
      .then(response => response.json())
      .then(data => {
        const todoItems = data.todos;
        const todoList = document.getElementById('todoItems');
        todoList.innerHTML = '';
  
        todoItems.forEach(todo => {
          const li = document.createElement('li');
  
          // 任務內容容器
          const taskContainer = document.createElement('div');
          taskContainer.classList.add('task-container');
          taskContainer.innerHTML = `<span>${todo.task}</span>`;
  
          // 已完成狀態
          const status = document.createElement('span');
          status.classList.add('status');
          status.classList.add(todo.completed ? 'completed' : 'not-completed');
          status.textContent = todo.completed ? '已完成' : '未完成';
  
          // 按鈕容器
          const buttons = document.createElement('div');
          buttons.classList.add('buttons');
          buttons.innerHTML = `
            <button class="edit" onclick="editTodo(${todo.id}, '${todo.task}', ${todo.completed})">編輯</button>
            <button class="delete" onclick="deleteTodo(${todo.id})">刪除</button>
          `;
  
          // 組合
          li.appendChild(taskContainer);
          li.appendChild(status);  // status 放在 taskContainer 和 buttons 之間
          li.appendChild(buttons);
  
          todoList.appendChild(li);
        });
      })
      .catch(error => console.error('取得代辦事項失敗:', error));
  }
  
// 新增代辦事項
function createTodo() {
  const taskInput = document.getElementById('taskInput');
  const task = taskInput.value.trim();

  if (!task) {
    alert('請輸入代辦事項。');
    return;
  }

  const newTodo = {
    student_id: studentId,
    task: task
  };

  fetch('https://nfutest.pythonanywhere.com/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTodo)
  })
    .then(response => response.json())
    .then(data => {
      alert('代辦事項新增成功！');
      taskInput.value = '';  // 清空輸入框
      fetchTodos();  // 重新載入代辦事項
    })
    .catch(error => console.error('新增代辦事項失敗:', error));
}

// 更新代辦事項
function editTodo(id, currentTask, currentCompleted) {
  // 提示框讓用戶編輯任務內容並選擇是否已完成
  const newTask = prompt('請輸入新的代辦事項:', currentTask);
  
  if (newTask === null || newTask === "") {
    alert('代辦事項不能為空');
    return;
  }

  // 創建勾選框
  const completed = confirm(`此代辦事項已完成嗎？（目前狀態：${currentCompleted ? "已完成" : "未完成"}）`);
  
  const updatedTodo = {
    student_id: studentId,
    task: newTask,
    completed: completed
  };

  fetch(`https://nfutest.pythonanywhere.com/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedTodo)
  })
    .then(response => response.json())
    .then(data => {
      alert('代辦事項更新成功！');
      fetchTodos();  // 重新載入代辦事項
    })
    .catch(error => console.error('更新代辦事項失敗:', error));
}

// 刪除代辦事項
function deleteTodo(id) {
  const confirmation = confirm('確定要刪除這個代辦事項嗎？');
  
  if (!confirmation) return;

  fetch(`https://nfutest.pythonanywhere.com/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ student_id: studentId })
  })
    .then(response => response.json())
    .then(data => {
      alert('代辦事項已刪除！');
      fetchTodos();  // 重新載入代辦事項
    })
    .catch(error => console.error('刪除代辦事項失敗:', error));
}

// 頁面載入時，獲取並顯示代辦事項
window.onload = function() {
  fetchTodos();
};
