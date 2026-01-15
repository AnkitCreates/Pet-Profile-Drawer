import { useState } from 'react'
import LeftPanel from '../components/layout/LeftPanel'
import PetDrawer from '../components/layout/PetDrawer'

export default function Home() {
  const [selectedPet, setSelectedPet] = useState<any>(null)

  return (
    <div className="flex h-screen">
      <LeftPanel onSelectPet={setSelectedPet} />
      <div className="flex-1 bg-gray-50" />
      <PetDrawer pet={selectedPet} onClose={() => setSelectedPet(null)} />
    </div>
  )
}