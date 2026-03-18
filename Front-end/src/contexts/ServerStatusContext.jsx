import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import API_URL from '../api/config'

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
  const [serverDown, setServerDown] = useState(false)

  const checkServer = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      await fetch(API_URL, { method: 'GET', signal: controller.signal })
      clearTimeout(timeout)
      setServerDown(false)
    } catch (err) {
      setServerDown(true)
    }
  }, [])

  useEffect(() => {
    checkServer()
    const iv = setInterval(checkServer, 10000)
    return () => clearInterval(iv)
  }, [checkServer])

  return (
    <ServerStatusContext.Provider value={{ serverDown, checkServer }}>
      {children}
    </ServerStatusContext.Provider>
  )
}

export const useServerStatus = () => useContext(ServerStatusContext)
