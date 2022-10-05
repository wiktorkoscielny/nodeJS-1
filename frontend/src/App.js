import {
  Heading,
  IconButton,
  VStack,
  useColorMode,
  useToast,
  Spinner
} from "@chakra-ui/react";
import TaskList from "./components/tasks";
import AddTask from "./components/AddTask";
import { FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";

function App() {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true)
    getTodosFromServer();
  }, []);


  // backend functions
  const getTodosFromServer = async () => {
   
    try {
      const response = await fetch("http://localhost:5000/todos");
      const data = await response.json();
      setTasks(data.todoList);
    } catch (e) {
      console.log(e);
    }
    setVisible(false)
  };
  function deleteItemFromBackend(id) {
    return fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });
   
  }

  function patchItemToBackEnd(update) {
    const id = update.id;
    return fetch(`http://localhost:5000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: {
        "Content-type": "application/json",
      },
    });
  }

  function deleteAllTodosFromBackend() {
    return fetch("http://localhost:5000/todos", {
      method: "DELETE",
    });
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => {
      return task.id !== id;
    });
    deleteItemFromBackend(id);
    setTasks(newTasks);
  }

  function deleteTaskAll() {
    deleteAllTodosFromBackend();
    setTasks([]);
  }

  function checkTask(id) {
    const newTasksCheck = tasks.map((task, index, array) => {
      if (task.id === id) {
        task.check = !task.check;
        if (task !== undefined) {
          patchItemToBackEnd(task);
        }
      }
      return task;
    });

    setTasks(newTasksCheck);

  }

  function updateTask(id, body, onClose) {
    const info = body.trim();

    if (!info) {
      toast({
        title: "Enter your task",
        position: "top",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    const newTasksUpdate = tasks.map((task, index, array) => {
      if (task.id === id) {
        task.body = body;
        task.check = false;
        if (task !== undefined) {
          patchItemToBackEnd(task);
        }
      }
      return task;
    });

    setTasks(newTasksUpdate);
    onClose();
  }

  function addTask(task) {
    setTasks([...tasks, task]);
  }
  

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <VStack p={4} minH="100vh" pb={28}>
      <IconButton
        icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
        isRound="true"
        size="md"
        alignSelf="flex-end"
        onClick={toggleColorMode}
        aria-label="toogle-dark-mode"
      />

      <Heading
        p="5"
        fontWeight="extrabold"
        size="xl"
        bgGradient="linear(to-r, red.500, yellow.500)"
        bgClip="text"
      >
        Todo list
      </Heading>
      <div style={{position: "relative"}}>
        <AddTask addTask={addTask}/>
        <div style={{position: "absolute", top: "23px", right: "120px", visibility: visible === true ? "visible" : "hidden"}}>
          <Spinner
            thickness="4px"
            speed="1s"
            emptyColor="gray.200"
            color="blue.200"
            size="lg"
          />
        </div>
      </div>
      <TaskList
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        deleteTaskAll={deleteTaskAll}
        checkTask={checkTask}
      />
    </VStack>
    </div>
  );
}

export default App;
