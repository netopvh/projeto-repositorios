/* eslint-disable react/react-in-jsx-scope */
import { lazy } from "react"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"

const Home = lazy(() => import("@/pages/home"))
const Import = lazy(() => import("@/pages/import"))

const MainRouter: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/import" element={<Import />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default MainRouter
