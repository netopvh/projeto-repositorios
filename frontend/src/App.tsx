/* eslint-disable react/react-in-jsx-scope */
import { Suspense } from "react"
import MainRouter from "./routes"
import ContentLoader from "./components/ui/content-loader"

function App() {
  return (
    <>
      <Suspense fallback={ContentLoader}>
        <MainRouter />
      </Suspense>
    </>
  )
}
export default App
