"use client"
import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"

function DraggableGuest({ guest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: guest.id,
  })

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between cursor-grab active:cursor-grabbing"
    >
      <div>
        <p className="text-sm font-medium text-gray-800">{guest.name}</p>
        <p className="text-xs text-gray-400">{guest.role}</p>
      </div>
    </div>
  )
}
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
            <div key={guest.id} className="flex flex-col gap-1">
              <div className="relative">
                <DraggableGuest guest={guest} />
                <button
                  onClick={() => {
                    setGuests(guests.filter(g => g.id !== guest.id))
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-white border border-red-200 rounded-full flex items-center justify-center hover:bg-red-50"
                >
                  <span className="text-red-400 text-xs">✕</span>
                </button>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full text-center ${mesaAsignada ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
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