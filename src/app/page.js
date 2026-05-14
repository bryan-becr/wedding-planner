"use client"
import { useState, useEffect } from "react"
import GuestList from "./components/Guestlist"
import Timeline from "./components/Timeline"
import TableMap from "./components/TableMap"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import { supabase } from "./lib/supabase"
import Auth from "./components/Auth"
import WeddingList from "./components/WeddingList"



export default function Home() {
  const [guests, setGuests] = useState([])

  const [tables, setTables] = useState([])


  const [panel, setPanel] = useState(null) // 

  const [activeGuest, setActiveGluest] = useState(null)

  const [session, setSession] = useState(null)

  const [selectedWedding, setSelectedWedding] = useState(null)


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  function togglePanel(name) {
    setPanel(panel === name ? null : name)
  }



  function handleDragStart(event) {
    const guest = guests.find(g => g.id === event.active.id)
    setActiveGuest(guest)
  }

  function handleDragEnd(event) {
    setActiveGuest(null)
    const { active, over } = event
    if (!over) return

    const guestId = active.id
    const tableId = over.id

    const guest = guests.find(g => g.id === guestId)
    if (!guest) return

    setTables(tables.map(t => {
      const sinInvitado = t.guests.filter(g => g.id !== guestId)
      if (t.id === tableId) {
        return { ...t, guests: [...sinInvitado, guest] }
      }
      return { ...t, guests: sinInvitado }
    }))
  }


  if (!session) return <Auth />

  if (!selectedWedding) return <WeddingList session={session} onSelect={setSelectedWedding} />
  return (


    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 flex flex-col">

        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800"> Arvide.wp</h1>
          <div className="flex gap-3">
            <button
              onClick={() => togglePanel('guests')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${panel === 'guests' ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'}`}
            >
              Invitados ({guests.length})
            </button>
            <button
              onClick={() => togglePanel('timeline')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${panel === 'timeline' ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'}`}
            >
              Timeline
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => setSelectedWedding(null)}
              className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
               Mis bodas
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

      <DragOverlay>
        {activeGuest ? (
          <div className="p-3 bg-white rounded-lg border border-pink-200 shadow-xl cursor-grabbing">
            <p className="text-sm font-medium text-gray-800">{activeGuest.name}</p>
            <p className="text-xs text-gray-400">{activeGuest.role}</p>
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  )
}