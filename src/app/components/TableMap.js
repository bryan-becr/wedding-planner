"use client"
import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"


function DroppableTable({ table, selectedTable, onMouseDown, onClick }) {
    const { isOver, setNodeRef } = useDroppable({
        id: table.id,
    })

    return (
        <div
            ref={setNodeRef}
            className={`absolute cursor-grab select-none ${selectedTable === table.id ? 'ring-2 ring-pink-400' : ''}`}
            style={{ left: table.x, top: table.y }}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            <div className={`bg-white border-2 flex flex-col items-center justify-center shadow-md transition-all
        ${isOver ? 'border-green-400 bg-green-50 scale-110' : 'border-pink-200'}
        ${table.shape === 'round' ? 'rounded-full w-24 h-24' : 'rounded-xl w-32 h-20'}`}>
                <p className="text-xs font-semibold text-gray-700 text-center px-2">{table.name}</p>
                <p className="text-xs text-gray-400">{table.guests.length}/{table.cap}</p>
            </div>
        </div>
    )
}

export default function TableMap({ guests, tables, setTables }) {
    const [dragging, setDragging] = useState(null)

    const [selectedTable, setSelectedTable] = useState(null)

    const [showModal, setShowModal] = useState(false)
    const [newTableName, setNewTableName] = useState("")
    const [newTableCap, setNewTableCap] = useState(8)
    const [newTableShape, setNewTableShape] = useState("round")
    const [showElementMenu, setShowElementMenu] = useState(false)
    const [elements, setElements] = useState([])
    


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

    function addTable() {
        const newTable = {
            id: Date.now(),
            name: newTableName || `Mesa ${tables.length + 1}`,
            x: 100,
            y: 100,
            cap: newTableCap,
            shape: newTableShape,
            guests: []
        }
        setTables([...tables, newTable])
        setShowModal(false)
        setNewTableName("")
        setNewTableCap(8)
        setNewTableShape("round")
    }

    function addElement(type) {
        const tipos = {
            escenario: { label: 'Escenario', emoji: '🎭', w: 160, h: 80, color: 'bg-purple-100 border-purple-300' },
            pista: { label: 'Pista de baile', emoji: '💃', w: 150, h: 150, color: 'bg-yellow-100 border-yellow-300' },
            barra: { label: 'Barra de bebidas', emoji: '🍹', w: 120, h: 60, color: 'bg-blue-100 border-blue-300' },
            banos: { label: 'Baños', emoji: '🚻', w: 80, h: 80, color: 'bg-green-100 border-green-300' },
            entrada: { label: 'Entrada', emoji: '🚪', w: 80, h: 50, color: 'bg-orange-100 border-orange-300' },
        }
        const tipo = tipos[type]
        const newElement = {
            id: Date.now(),
            type,
            ...tipo,
            x: 150,
            y: 150,
        }
        setElements([...elements, newElement])
        setShowElementMenu(false)
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Plano de mesas</h2>
            <div
                className="relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
                style={{ height: "calc(100vh - 80px)" }}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                {tables.map(table => (
                    <DroppableTable
                        key={table.id}
                        table={table}
                        selectedTable={selectedTable}
                        onMouseDown={(e) => onMouseDown(e, table.id)}
                        onClick={() => setSelectedTable(table.id)}
                    />
                ))}


                {elements.map(el => (
                    <div
                        key={el.id}
                        className={`absolute border-2 rounded-xl flex flex-col items-center justify-center select-none cursor-grab ${el.color}`}
                        style={{ left: el.x, top: el.y, width: el.w, height: el.h }}
                        onMouseDown={(e) => {
                            const offsetX = e.clientX - el.x
                            const offsetY = e.clientY - el.y
                            const onMove = (ev) => {
                                setElements(prev => prev.map(item =>
                                    item.id === el.id
                                        ? { ...item, x: ev.clientX - offsetX, y: ev.clientY - offsetY }
                                        : item
                                ))
                            }
                            const onUp = () => {
                                document.removeEventListener('mousemove', onMove)
                                document.removeEventListener('mouseup', onUp)
                            }
                            document.addEventListener('mousemove', onMove)
                            document.addEventListener('mouseup', onUp)
                        }}
                    >
                        <span className="text-2xl">{el.emoji}</span>
                        <span className="text-xs font-medium text-gray-600 mt-1">{el.label}</span>
                    </div>
                ))}

                


                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-400">{tables.length} mesas en total</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-pink-400 hover:bg-pink-500 text-white text-sm px-4 py-2 rounded-lg"
                        >
                            + Agregar mesa
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowElementMenu(!showElementMenu)}
                                className="bg-white border border-gray-200 hover:border-pink-300 text-gray-600 text-sm px-4 py-2 rounded-lg"
                            >
                                + Elemento ▾
                            </button>
                            {showElementMenu && (
                                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                    {[
                                        { type: 'escenario', label: 'Escenario', emoji: '🎭' },
                                        { type: 'pista', label: 'Pista de baile', emoji: '💃' },
                                        { type: 'barra', label: 'Barra de bebidas', emoji: '🍹' },
                                        { type: 'banos', label: 'Baños', emoji: '🚻' },
                                        { type: 'entrada', label: 'Entrada', emoji: '🚪' },
                                    ].map(el => (
                                        <button
                                            key={el.type}
                                            onClick={() => addElement(el.type)}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                                        >
                                            <span>{el.emoji}</span>
                                            <span>{el.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
            {selectedTable && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Asignar invitado a {tables.find(t => t.id === selectedTable)?.name}
                    </p>
                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={() => setTables(tables.map(t => t.id === selectedTable ? { ...t, shape: 'round' } : t))}
                            className={`flex-1 py-2 rounded-lg border-2 text-xs flex flex-col items-center gap-1 ${tables.find(t => t.id === selectedTable)?.shape === 'round' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-current"></div>
                            Redonda
                        </button>
                        <button
                            onClick={() => setTables(tables.map(t => t.id === selectedTable ? { ...t, shape: 'rect' } : t))}
                            className={`flex-1 py-2 rounded-lg border-2 text-xs flex flex-col items-center gap-1 ${tables.find(t => t.id === selectedTable)?.shape === 'rect' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`}
                        >
                            <div className="w-6 h-4 rounded border-2 border-current"></div>
                            Rectangular
                        </button>
                    </div>
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">Nueva mesa</h3>

                        <label className="text-xs text-gray-500 block mb-1">Nombre</label>
                        <input
                            type="text"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            placeholder={`Mesa ${tables.length + 1}`}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-pink-300"
                        />

                        <label className="text-xs text-gray-500 block mb-1">Capacidad</label>
                        <input
                            type="number"
                            value={newTableCap}
                            onChange={(e) => setNewTableCap(parseInt(e.target.value))}
                            min={2}
                            max={20}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-pink-300"
                        />

                        <label className="text-xs text-gray-500 block mb-2">Forma</label>
                        <div className="flex gap-3 mb-4">
                            <button
                                onClick={() => setNewTableShape('round')}
                                className={`flex-1 py-3 rounded-lg border-2 text-sm flex flex-col items-center gap-1 ${newTableShape === 'round' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`}
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-current"></div>
                                Redonda
                            </button>
                            <button
                                onClick={() => setNewTableShape('rect')}
                                className={`flex-1 py-3 rounded-lg border-2 text-sm flex flex-col items-center gap-1 ${newTableShape === 'rect' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`}
                            >
                                <div className="w-8 h-5 rounded border-2 border-current"></div>
                                Rectangular
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={addTable}
                                className="flex-1 py-2 rounded-lg bg-pink-400 hover:bg-pink-500 text-white text-sm"
                            >
                                Crear mesa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>





    )
}