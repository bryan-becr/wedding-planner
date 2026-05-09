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
    { id: 1, name: "Mesa 1", x: 50, y: 50, cap: 8, guests: [] },
    { id: 2, name: "Mesa 2", x: 200, y: 50, cap: 6, guests: [] },
    { id: 3, name: "Mesa de honor", x: 120, y: 180, cap: 12, guests: [] },
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Wedding Planner</h1>
      </header>

      <main className="grid grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <GuestList guests={guests} setGuests={setGuests} tables={tables} />
        </div>
        <div className="bg-white rounded-xl shadow-sm col-span-1">
          <TableMap guests={guests} tables={tables} setTables={setTables} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Timeline />
        </div>
      </main>
    </div>
  )
}