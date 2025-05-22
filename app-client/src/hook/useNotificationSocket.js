import { useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const useNotificationSocket = (userId, onMessage) => {
    useEffect(() => {
        if (!userId || !onMessage) return

        const stompClient = new Client({
            webSocketFactory: () =>
                new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            reconnectDelay: 3000,
            onConnect: () => {
                stompClient.subscribe(
                    `/topic/notifications/${userId}`,
                    (msg) => {
                        const data = JSON.parse(msg.body)
                        onMessage(data)
                    }
                )
            },
            onStompError: (frame) => {
                console.error('Broker error: ', frame.headers['message'])
            },
        })

        stompClient.activate()

        return () => {
            stompClient.deactivate()
        }
    }, [userId, onMessage])
}

export default useNotificationSocket
