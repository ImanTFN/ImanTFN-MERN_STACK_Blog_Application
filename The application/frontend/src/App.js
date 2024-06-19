import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from "./components/HomePage/HomePage"
import NavBar from "./components/Navigation/NavBar"
import Register from "./components/Users/Register/Register"
import Login from "./components/Users/Login/Login"
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";




function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/update-category/:id" element={<UpdateCategory/>} />
        <Route exact path="/add-category" element={<AddNewCategory/>}/>
        <Route exact path="/category-list" element={<CategoryList/>}/>
        <Route exact path='/' element={<HomePage/>} />
        <Route exact path='/register' element={<Register/>} />
        <Route exact path='/login' element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
