"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError("Revisa tu correo para confirmar tu cuenta")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">💍 Wedding Planner</h1>
        <p className="text-sm text-gray-400 mb-6">{isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}</p>

        <label className="text-xs text-gray-500 block mb-1">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-pink-300"
        />

        <label className="text-xs text-gray-500 block mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-pink-300"
        />

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-lg text-sm font-medium mb-3"
        >
          {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-xs text-gray-400 hover:text-gray-600"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  )
}