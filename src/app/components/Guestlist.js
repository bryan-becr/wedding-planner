"use client"
import { useState } from "react"


export default function Guestlist({ guests, setGuests, tables }) {
  const [newName, setNewName] = useState("")

  function addGuest() {
    if (!newName) return
    const newGuest = { id: Date.now(), name: newName, role: "Invitado" }
    setGuests([...guests, newGuest])
    setNewName("")
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Lista de invitados</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del invitado"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
        />
        <button
          onClick={addGuest}
          className="bg-pink-400 hover:bg-pink-500 text-white text-sm px-4 py-2 rounded-lg"
        >
          Agregar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {guests.map((guest) => {
          const mesaAsignada = tables.find(t => t.guests.find(g => g.id === guest.id))
          return (
            <div key={guest.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{guest.name}</p>
                <p className="text-xs text-gray-400">{guest.role}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${mesaAsignada ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {mesaAsignada ? mesaAsignada.name : 'Sin mesa'}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">{guests.length} invitados en total</p>
    </div>
  )
}