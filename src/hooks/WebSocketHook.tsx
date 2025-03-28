import { useEffect, useState } from "react";

export const useStockWebSocket = (url: string) => {
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => console.log("Connected to WebSocket");
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);
            setStockData(data);
        };
        socket.onclose = () => console.log("WebSocket closed");

        return () => socket.close();
    }, [url]);

    return stockData;
};
