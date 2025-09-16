import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Background from "./components/Background";
import Home from "./pages/Home";
import MissionList from "./pages/MissionList";
import MissionPage from "./pages/MissionPage"; 

function App() {
  return (
    <Router>
      <Background enableCursorEffect={true} />
      <Menu />
      <h1>goidaaa</h1>
      {/* отступ равный высоте меню */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MissionList" element={<MissionList />} />
          <Route path="/mission/:id" element={<MissionPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
