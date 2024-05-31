import { useEffect, useState } from "react";
import "./styles.css";
import { useDebounce } from "./useDebounce";

export default function App() {
  const [todosList, setTodosList] = useState([]);
  const [todosListOriginal, setTodosListOriginal] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTitleSorted, setIsTitleSorted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce(searchTerm, 300);
  const [todosListCopy, setTodosListCopy] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          setTodosListOriginal(result);
          setTodosList(result.slice(0, 10));
          setTodosListCopy(result.slice(0, 10));
        }
      });
  }, []);

  //==========pagination============
  let pageSize = 10;
  let totalPageCount = Math.ceil(todosList.length / pageSize);

  useEffect(() => {
    let startIndex = currentPage * pageSize;
    let endIndex = currentPage * pageSize + 10;
    let result = [];
    todosListOriginal.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        result.push(item);
      }
    });
    setTodosList(result);
  }, [currentPage]);

  const pageChangeHandler = (str) => {
    if (str == "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    if (str == "next") {
      setCurrentPage(currentPage + 1);
    }
  };

  //==========sorting================
  const handleSorting = (str) => {
    if (isTitleSorted) {
      if (str == "title") {
        let sorted = todosList.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        console.log(sorted);
        // console.log(todosList.sort((a, b) => a.title.localeCompare(b.title)));
        setTodosList(sorted);
        setIsTitleSorted(false);
      }
    }
    if (isTitleSorted == false) {
      let startIndex = currentPage * pageSize;
      let endIndex = currentPage * pageSize + 10;
      let result = [];
      todosListOriginal.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
          result.push(item);
        }
      });
      setTodosList(result);
      setIsTitleSorted(true);
    }
  };

  //=======Search Filter ===================
  const handleSearchingInput = (e) => {
    setSearchTerm(e.target.value);
  };

  let originalData = JSON.parse(JSON.stringify(todosList));
  const handleSearchFilter = (str) => {
    const result = todosListCopy.filter((todo) => todo.title.includes(str));
    setTodosList(result);
  };

  useEffect(() => {
    handleSearchFilter(debounceSearch);
  }, [debounceSearch]);

  return (
    <div>
      <div>CurrentPage:{currentPage}</div>
      <input
        type="text"
        placeholder="Search by Title..."
        value={searchTerm}
        onChange={handleSearchingInput}
      />
      <table>
        <thead>
          <th>
            <td
              style={{ width: "20px", cursor: "pointer" }}
              onClick={() => {
                handleSorting("userId");
              }}
            >
              Id
            </td>
            <td
              onClick={() => {
                handleSorting("title");
              }}
              style={{ cursor: "pointer" }}
            >
              Title
            </td>
          </th>
        </thead>
        <tbody>
          {todosList.map((todo, i) => (
            <tr key={i}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => pageChangeHandler("prev")}>Prev</button>
      <button onClick={() => pageChangeHandler("next")}>Next</button>
    </div>
  );
}
