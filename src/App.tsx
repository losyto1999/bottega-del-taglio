import { BottegaFooter } from './components/BottegaFooter'
import { BottegaNav } from './components/BottegaNav'
import { BottegaHome } from './pages/BottegaHome'

function App() {
    return (
        <div className="bottega-root min-h-screen">
            <BottegaNav />
            <main>
                <BottegaHome />
            </main>
            <BottegaFooter />
        </div>
    )
}

export default App
