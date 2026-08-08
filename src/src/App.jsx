import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import IssueBooks from "./pages/IssueBooks";
import Reports from "./pages/Reports";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/books" element={<Books />} />

        <Route path="/members" element={<Members />} />

        <Route path="/issues" element={<IssueBooks />} />

        <Route path="/reports" element={<Reports />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;