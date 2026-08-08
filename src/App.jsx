import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import IssueBooks from "./pages/IssueBooks";
import ReturnBooks from "./pages/ReturnBooks";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/members" element={<Members />} />
      <Route path="/issues" element={<IssueBooks />} />
      <Route path="/return" element={<ReturnBooks />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default App;