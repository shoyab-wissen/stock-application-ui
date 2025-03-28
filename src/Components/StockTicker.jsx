import React from "react";
import { useStockWebSocket } from "../hooks/WebSocketHook.tsx";

const StockTicker = () => {
    const stockData = useStockWebSocket("ws://localhost:8083/ws/stocks");

    return (
        <div>
            <h2>Live Stock Prices</h2>
            {stockData ? (
                <div>
                    <p>Stock: {stockData.name}</p>
                    <p>Price: ${stockData.price.toFixed(2)}</p>
                    <p>Last Updated: {new Date(stockData.lastUpdated).toLocaleTimeString()}</p>
                </div>
            ) : (
                <p>Waiting for updates...</p>
            )}
        </div>
    );
};

export default StockTicker;
