import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AppLayout from "./components/AppLayout"
import DetailsPage from "./pages/DetailsPage"
import CreatePage from "./pages/CreatePage"
import SearchPage from "./pages/SearchPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/:slug" element={<DetailsPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
