"use client"
import { useState } from "react"
import GuestList from "./components/Guestlist"
import Timeline from "./components/Timeline"
import TableMap from "./components/TableMap"

export default function Home() {
  const [guests, setGuests] = useState([
    { id: 1, name: "Jasmine Nieves", role: "Familiar" },
    { id: 2, name: "Jorge Cordova", role: "Amigo" },
  ])



  const [tables, setTables] = useState([
    { id: 1, name: "Mesa 1", x: 50, y: 50, cap: 8, shape: 'round', guests: [] },
    { id: 2, name: "Mesa 2", x: 200, y: 50, cap: 6, shape: 'round', guests: [] },
    { id: 3, name: "Mesa de honor", x: 120, y: 180, cap: 12, shape: 'rect', guests: [] },
  ])

  const [panel, setPanel] = useState(null) // 'guests' | 'timeline' | null

  function togglePanel(name) {
    setPanel(panel === name ? null : name)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800"> Wedding Planner</h1>
        <div className="flex gap-3">
          <button
            onClick={() => togglePanel('guests')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${panel === 'guests' ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'}`}
          >
            👥 Invitados ({guests.length})
          </button>
          <button
            onClick={() => togglePanel('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${panel === 'timeline' ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'}`}
          >
            📅 Timeline
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 p-6">
          <TableMap guests={guests} tables={tables} setTables={setTables} />
        </div>

        {panel && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto transition-all">
            {panel === 'guests' && (
              <GuestList guests={guests} setGuests={setGuests} tables={tables} />
            )}
            {panel === 'timeline' && (
              <Timeline />
            )}
          </div>
        )}

      </div>
    </div>
  )
}