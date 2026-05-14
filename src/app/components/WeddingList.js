"use client"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function WeddingList({ session, onSelect }) {
  const [weddings, setWeddings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newNombre, setNewNombre] = useState("")
  const [newFecha, setNewFecha] = useState("")
  const [newLugar, setNewLugar] = useState("")

  useEffect(() => {
    loadWeddings()
  }, [])

  async function loadWeddings() {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('fecha', { ascending: true })

    if (!error) setWeddings(data)
    setLoading(false)
  }

  async function createWedding() {
    if (!newNombre) return
    const { data, error } = await supabase
      .from('weddings')
      .insert([{ 
        user_id: session.user.id,
        nombre: newNombre,
        fecha: newFecha || null,
        lugar: newLugar || null
      }])
      .select()

    if (!error) {
      setWeddings([...weddings, data[0]])
      setShowModal(false)
      setNewNombre("")
      setNewFecha("")
      setNewLugar("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">💍 Wedding Planner</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Mis bodas</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-pink-400 hover:bg-pink-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            + Nueva boda
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : weddings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3"></p>
            <p className="text-sm">No tienes bodas aún. ¡Crea la primera!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {weddings.map(w => (
              <div
                key={w.id}
                onClick={() => onSelect(w)}
                className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:border-pink-200 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-800 mb-1">{w.nombre}</p>
                <p className="text-xs text-gray-400">{w.fecha || 'Sin fecha'}</p>
                <p className="text-xs text-gray-400">{w.lugar || 'Sin lugar'}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Nueva boda</h3>

            <label className="text-xs text-gray-500 block mb-1">Nombre de la boda</label>
            <input
              type="text"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Boda García - López"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-pink-300"
            />

            <label className="text-xs text-gray-500 block mb-1">Fecha</label>
            <input
              type="date"
              value={newFecha}
              onChange={(e) => setNewFecha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-pink-300"
            />

            <label className="text-xs text-gray-500 block mb-1">Lugar</label>
            <input
              type="text"
              value={newLugar}
              onChange={(e) => setNewLugar(e.target.value)}
              placeholder="Salón Los Pinos"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-pink-300"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={createWedding}
                className="flex-1 py-2 rounded-lg bg-pink-400 hover:bg-pink-500 text-white text-sm"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}