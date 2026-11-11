import { useState } from 'react'
import { BottegaFooter } from './components/BottegaFooter'
import { BottegaNav } from './components/BottegaNav'
import { BottegaHome } from './pages/BottegaHome'
import { BackToPortfolio } from './portfolio/BackToPortfolio'
import { cameFromPortfolio } from './portfolio/fromPortfolio'

function App() {
    const [showBack] = useState(cameFromPortfolio)

    return (
        <div className="bottega-root min-h-screen">
            {showBack && <BackToPortfolio />}
            <BottegaNav />
            <main>
                <BottegaHome />
            </main>
            <BottegaFooter />
        </div>
    )
}

export default App
