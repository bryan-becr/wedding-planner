"use client"
import { useState } from "react"

export default function Timeline() {
    const [events, setEvents] = useState([
        { id: 1, time: "13:00", name: "Llegada de invitados", desc: "Recepción en el jardín" },
        { id: 2, time: "14:00", name: "Ceremonia civil", desc: "Salón principal" },
        { id: 3, time: "16:00", name: "Banquete", desc: "Comida y brindis" },
        { id: 4, time: "18:00", name: "Primer baile", desc: "Pista central" },
    ])

    const [newTime, setNewTime] = useState("")
    const [newName, setNewName] = useState("")
    const [newDesc, setNewDesc] = useState("")

    function addEvent() {
        if (!newTime || !newName) return
        const newEvent = { id: Date.now(), time: newTime, name: newName, desc: newDesc }
        const sorted = [...events, newEvent].sort((a, b) => a.time.localeCompare(b.time))
        setEvents(sorted)
        setNewTime("")
        setNewName("")
        setNewDesc("")
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline del evento</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
                />
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre del evento"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
                />
                <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Lugar o descripción"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-300"
                />

                <button
                    onClick={addEvent}
                    className="bg-pink-400 hover:bg-pink-500 text-white text-sm px-4 py-2 rounded-lg"
                >
                    +
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {events.map((event) => (
                    <div key={event.id} className="flex gap-3 items-start">
                        <span className="text-xs font-mono text-gray-400 pt-1 min-w-10">{event.time}</span>
                        <div className="w-2 h-2 rounded-full bg-pink-300 mt-2 flex-shrink-0"></div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{event.name}</p>
                            {event.desc && <p className="text-xs text-gray-400">{event.desc}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}