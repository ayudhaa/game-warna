import React, { useEffect, useState } from 'react'
import ColorGame from './components/ColorGame'

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('gw_theme') || 'light'
    } catch (e) { return 'light' }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('gw_theme', theme) } catch (e) {}
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-between transition-colors">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Game Warna — Cocokkan Warna
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Klik warna yang cocok dengan <span className="font-semibold">teks</span> (bukan kata).
              </p>
            </div>
          </div>

          <ColorGame />
        </div>
      </div>

      <footer className="w-full py-4 dark:bg-gray-800 text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          made with<span className="text-red-500">❤️</span>
        </p>
      </footer>
    </div>
  )
}