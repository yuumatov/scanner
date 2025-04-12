"use client"

import { useEffect, useRef, useState } from "react";

export default function LogViewer({ logs }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "INFO":
        return "text-blue-600 dark:text-blue-400"
      case "WARNING":
        return "text-yellow-600 dark:text-yellow-400"
      case "ERROR":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Автопрокрутка, если включена
  useEffect(() => {
    if (isAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, isAutoScroll])

  // Следим за скроллингом пользователя
  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return

    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 20 // с запасом
    setIsAutoScroll(atBottom)
  }

  return (
    <div className="border rounded-md bg-black text-gray-200 p-2 mt-4">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[500px] overflow-y-auto"
      >
        <pre className="font-mono text-sm leading-relaxed">
          {logs?.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap">
              <span className="text-gray-500">[{log.data.time}]</span>{" "}
              <span className={getStatusColor(log.data.status)}>{log.data.status.padEnd(7, " ")}</span>{" "}
              <span className={log.success ? "text-white" : "text-red-400"}>{log.data.msg.trim()}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </pre>
      </div>
    </div>
  )
}
