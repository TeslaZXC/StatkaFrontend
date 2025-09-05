import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Background from "./components/Background";
import Home from "./pages/Home";
import MissionList from "./pages/MissionList";

function App() {
  return (
    <Router>
      <Background enableCursorEffect={true} />
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MissionList" element={<MissionList />} />
      </Routes>
    </Router>
  );
}

export default App;
