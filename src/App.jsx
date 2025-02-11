import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AppLayout from "./components/AppLayout"
import DetailsPage from "./pages/DetailsPage"
import CreatePage from "./pages/CreatePage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/:id" element={<DetailsPage />} />
            <Route path="/create" element={<CreatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
