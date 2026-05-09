"use client"
import { useState } from "react"

export default function TableMap({ guests, tables, setTables }) {
    const [dragging, setDragging] = useState(null)

    const [selectedTable, setSelectedTable] = useState(null)

    function onMouseDown(e, tableId) {
        const table = tables.find(t => t.id === tableId)
        setDragging({
            id: tableId,
            offsetX: e.clientX - table.x,
            offsetY: e.clientY - table.y,
        })
    }

    function onMouseMove(e) {
        if (!dragging) return
        setTables(tables.map(t =>
            t.id === dragging.id
                ? { ...t, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY }
                : t
        ))
    }

    function onMouseUp() {
        setDragging(null)
    }

    function assignGuest(guestId) {
        const guest = guests.find(g => g.id === parseInt(guestId))
        setTables(tables.map(t => {

            const sinInvitado = t.guests.filter(g => g.id !== guest.id)

            if (t.id === selectedTable) {
                return { ...t, guests: [...sinInvitado, guest] }
            }
            return { ...t, guests: sinInvitado }
        }))
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Plano de mesas</h2>
            <div
                className="relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
                style={{ height: "400px" }}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                {tables.map(table => (
                    <div
                        key={table.id}
                        className="absolute bg-white border-2 border-pink-200 rounded-xl p-3 cursor-grab shadow-sm select-none"
                        style={{ left: table.x, top: table.y, width: "110px" }}
                        onMouseDown={(e) => onMouseDown(e, table.id)}
                        onClick={() => setSelectedTable(table.id)}
                    >
                        <p className="text-xs font-semibold text-gray-700">{table.name}</p>
                        <p className="text-xs text-gray-400">{table.guests.length}/{table.cap}</p>
                    </div>

                ))}
            </div>
            {selectedTable && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Asignar invitado a {tables.find(t => t.id === selectedTable)?.name}
                    </p>
                    <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => assignGuest(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona un invitado</option>
                        {guests
                            .filter(g => {
                                const mesaActual = tables.find(t => t.guests.find(tg => tg.id === g.id))

                                return !mesaActual || mesaActual.id !== selectedTable
                            })
                            .map(g => {
                                const mesaActual = tables.find(t => t.guests.find(tg => tg.id === g.id))
                                return (
                                    <option key={g.id} value={g.id}>
                                        {g.name} {mesaActual ? `(mover de ${mesaActual.name})` : ''}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
            )}
        </div>
    )
}