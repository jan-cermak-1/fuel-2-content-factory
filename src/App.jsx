import { FuelProvider } from './context/FuelContext'
import AppLayout from './components/layout/AppLayout'

function App() {
  return (
    <FuelProvider>
      <AppLayout />
    </FuelProvider>
  )
}

export default App
