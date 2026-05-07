import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initSocket() {
  if (socket) return socket

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
  
  socket = io(backendUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Connected to real-time server')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from real-time server')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export function getSocket(): Socket | null {
  if (!socket) {
    return initSocket()
  }
  return socket
}

export function emitLineupUpdate(data: any) {
  getSocket()?.emit('updateLineup', data)
}

export function emitStatusUpdate(data: any) {
  getSocket()?.emit('updateStatus', data)
}

export function onLineupChanged(callback: (data: any) => void) {
  getSocket()?.on('lineupChanged', callback)
}

export function onStatusChanged(callback: (data: any) => void) {
  getSocket()?.on('statusChanged', callback)
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
