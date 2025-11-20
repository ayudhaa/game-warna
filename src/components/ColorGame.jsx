import React, { useEffect, useState, useRef } from 'react'

const BASE_COLORS = [
  { name: 'Merah', hex: '#ef4444' },
  { name: 'Biru', hex: '#3b82f6' },
  { name: 'Hijau', hex: '#10b981' },
  { name: 'Kuning', hex: '#f59e0b' },
  { name: 'Ungu', hex: '#8b5cf6' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
]

function shuffle(array) {
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ColorGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [target, setTarget] = useState({})
  const [options, setOptions] = useState([])
  const [paused, setPaused] = useState(false)

  const [timeLeft, setTimeLeft] = useState(7)
  const timerRef = useRef(null)
  const feedbackTimer = useRef(null)

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [notificationType, setNotificationType] = useState('correct')

  useEffect(() => {
    startRound(true)
    return () => {
      clearInterval(timerRef.current)
      clearTimeout(feedbackTimer.current)
    }
  }, [])

  function startTimer(sec) {
    clearInterval(timerRef.current)
    setTimeLeft(sec)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current)
          onTimeUp()
          return 0
        }
        return +(t - 0.1).toFixed(2)
      })
    }, 100)
  }

  function onTimeUp() {
    showFeedback('Oops! Waktu habis nih, coba lagi yukk😅', 'wrong')
  }

  function showFeedback(msg, type) {
    setNotificationMsg(msg)
    setNotificationType(type)
    setShowNotification(true)
    setPaused(true)

    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => {
      setShowNotification(false)
      setRound(r => r + 1)
      setPaused(false)
      startRound()
    }, 1000)
  }

  function difficultyForLevel(lv) {
    const optionsCount = Math.min(4 + Math.floor((lv - 1) / 1), BASE_COLORS.length)
    const timeLimit = Math.max(3, 7 - Math.floor((lv - 1) * 0.7))
    return { optionsCount, timeLimit }
  }

  function startRound(first = false) {
    const level = 1 + Math.floor(score / 5)
    const { optionsCount, timeLimit } = difficultyForLevel(level)
    const shuffled = shuffle(BASE_COLORS)

    const wordOption = shuffled[Math.floor(Math.random() * shuffled.length)]
    const colorOption = shuffled[Math.floor(Math.random() * shuffled.length)]
    const word = wordOption.name
    const colorHex = colorOption.hex

    let opts = shuffle(BASE_COLORS).slice(0, optionsCount)
    if (!opts.find(o => o.hex === colorHex)) {
      opts[Math.floor(Math.random() * opts.length)] = colorOption
    }
    opts = shuffle(opts)

    setTarget({ word, colorHex })
    setOptions(opts)
    setPaused(false)
    startTimer(timeLimit)
  }

  function handleChoose(opt) {
    if (paused) return
    clearInterval(timerRef.current)
    const isCorrect = opt.hex === target.colorHex
    showFeedback(isCorrect ? 'Yeayy kamu benar🎉' : 'Oops kamu coba lagi yaa😅', isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)
  }

  return (
    <div className="relative min-h-[300px]">
        {showNotification && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`px-8 py-6 rounded-2xl text-white font-bold text-2xl shadow-2xl transition-transform transform ${
                notificationType === 'correct' 
                  ? 'bg-green-500 animate-scale-fade' 
                  : 'bg-red-500 animate-scale-fade'
              }`}
            >
              {notificationMsg}
            </div>
          </div>
        )}

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-700 dark:text-gray-200">Skor: <span className="font-semibold">{score}</span></div>
        {/* <div className="text-sm text-gray-700 dark:text-gray-200">Round: <span className="font-semibold">{round}</span></div> */}
      </div>

      <div className="mb-6 flex flex-col items-center">
        <div
          className="text-5xl font-extrabold select-none transition-colors"
          style={{ color: target.colorHex || '#000' }}
        >
          {target.word || '---'}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-300 mt-2">
          Klik warna yang sesuai yaaa☺️
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ width: `${Math.max(0, (timeLeft / difficultyForLevel(1).timeLimit) * 100)}%`, background: 'linear-gradient(90deg,#34d399,#60a5fa)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => (
          <button
            key={opt.name + opt.hex}
            onClick={() => handleChoose(opt)}
            className="py-3 rounded-xl font-semibold shadow-md focus:outline-none transition-transform active:scale-95 border-2"
            style={{ backgroundColor: opt.hex, color: 'white' }}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  )
}