import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './StockDetail.css';

function StockDetail() {
    const { stockId } = useParams();
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [timeframe, setTimeframe] = useState('minute');
    const [displayData, setDisplayData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStockHistory();
    }, [stockId]);

    const fetchStockHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const resp = await axios.get(`http://localhost:8083/api/stocks/search?query=${stockId}`);
            const response = resp.data.data[0];
            console.log("Stock history data:", response.history);
            
            // First, group data points by minute
            const minuteGroups = {};
            Object.entries(response.history).forEach(([timestamp, price]) => {
                const date = new Date(timestamp);
                // Create key by truncating seconds and milliseconds
                const minuteKey = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes()
                ).getTime();

                if (!minuteGroups[minuteKey]) {
                    minuteGroups[minuteKey] = {
                        prices: [],
                        date: new Date(minuteKey)
                    };
                }
                minuteGroups[minuteKey].prices.push(price);
            });

            // Transform grouped data into OHLC format
            const transformedData = Object.values(minuteGroups).map(group => {
                const prices = group.prices;
                return {
                    date: group.date,
                    open: prices[0], // First price in the minute
                    high: Math.max(...prices), // Highest price in the minute
                    low: Math.min(...prices), // Lowest price in the minute
                    close: prices[prices.length - 1], // Last price in the minute
                    volume: 100 * prices.length // Approximate volume based on number of trades
                };
            });

            // Sort by date
            const sortedData = transformedData.sort((a, b) => a.date - b.date);
            console.log("Transformed data:", sortedData);
            setData(sortedData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch stock history');
            console.error('Error fetching stock history:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data.length > 0) {
            const newDisplayData = aggregateDataByTimeframe(data, timeframe);
            setDisplayData(newDisplayData);
        }
    }, [data, timeframe]);

    useEffect(() => {
        if (displayData.length > 0) {
            drawChart();
        }
    }, [displayData]);

    const aggregateDataByTimeframe = (data, timeframe) => {
        if (timeframe === 'minute') return data;

        const aggregatedData = {};
        
        data.forEach(item => {
            // Create a key for each hour by setting minutes to 0
            const hourKey = new Date(
                item.date.getFullYear(),
                item.date.getMonth(),
                item.date.getDate(),
                item.date.getHours()
            ).getTime();
            
            if (!aggregatedData[hourKey]) {
                // Initialize the first data point for this hour
                aggregatedData[hourKey] = {
                    date: new Date(hourKey),
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                    volume: item.volume
                };
            } else {
                // Update the aggregated data for this hour
                aggregatedData[hourKey].high = Math.max(aggregatedData[hourKey].high, item.high);
                aggregatedData[hourKey].low = Math.min(aggregatedData[hourKey].low, item.low);
                aggregatedData[hourKey].close = item.close; // Last price becomes close
                aggregatedData[hourKey].volume += item.volume;
            }
        });

        return Object.values(aggregatedData).sort((a, b) => a.date - b.date);
    };

    const drawChart = () => {
        // Increase bottom margin to accommodate time scale
        const margin = { top: 20, right: 50, bottom: 50, left: 50 };
        
        // Adjust height calculation to account for margins
        const width = chartRef.current.clientWidth - margin.left - margin.right;
        const height = (chartRef.current.clientHeight || 600) - margin.top - margin.bottom;

        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        // Create SVG with adjusted dimensions
        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("background-color", "#131722");

        // Update background rect dimensions
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "#131722");

        // Create a group for the chart content
        const chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const x = d3.scaleTime()
            .domain(d3.extent(displayData, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([
                d3.min(displayData, d => d.low) * 0.999,
                d3.max(displayData, d => d.high) * 1.001
            ])
            .range([height, 0]);

        // Create a clip path
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Add grid
        const grid = chartGroup.append("g")
            .attr("class", "grid")
            .attr("clip-path", "url(#clip)");

        // Add X axis
        const xAxis = chartGroup.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickFormat(d => {
                    if (timeframe === 'hour') {
                        return d3.timeFormat('%b %d %H:00')(d);
                    }
                    return d3.timeFormat('%H:%M')(d);
                }));

        // Add Y axis
        const yAxis = chartGroup.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Create a group for candlesticks with clip path
        const candlestickGroup = chartGroup.append("g")
            .attr("clip-path", "url(#clip)");

        function updateChart(transform) {
            // Update scales with zoom transform
            const zoomedX = transform.rescaleX(x);
            const zoomedY = transform.rescaleY(y);
            
            // Update axes with appropriate time format
            xAxis.call(d3.axisBottom(zoomedX)
                .tickFormat(d => {
                    if (timeframe === 'hour') {
                        return d3.timeFormat('%b %d %H:00')(d);
                    }
                    return d3.timeFormat('%H:%M')(d);
                })
                .ticks(width > 800 ? 10 : 5)); // Adjust number of ticks based on width

            yAxis.call(d3.axisLeft(zoomedY)
                .ticks(10));

            // Update grid lines
            grid.call(d3.axisLeft(zoomedY)
                .ticks(10)
                .tickSize(-width)
                .tickFormat(""));

            // Calculate candlestick width based on timeframe
            const candlestickWidth = timeframe === 'hour' ? 8 : 4;

            // Update candlesticks
            candlestickGroup.selectAll(".candlestick").remove();
            const candlesticks = candlestickGroup.selectAll(".candlestick")
                .data(displayData)
                .enter()
                .append("g")
                .attr("class", "candlestick");

            // Draw wicks
            candlesticks.append("line")
                .attr("class", "wick")
                .attr("x1", d => zoomedX(d.date))
                .attr("x2", d => zoomedX(d.date))
                .attr("y1", d => zoomedY(d.high))
                .attr("y2", d => zoomedY(d.low))
                .attr("stroke", d => d.open > d.close ? "#ff4444" : "#4CAF50");

            // Draw candlestick bodies
            candlesticks.append("rect")
                .attr("x", d => zoomedX(d.date) - candlestickWidth / 2)
                .attr("y", d => zoomedY(Math.max(d.open, d.close)))
                .attr("width", candlestickWidth)
                .attr("height", d => Math.abs(zoomedY(d.open) - zoomedY(d.close)))
                .attr("fill", d => d.open > d.close ? "#ff4444" : "#4CAF50");

            // Update tooltip
            candlesticks.on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`
                    ${timeframe === 'hour' ? 'Hour' : 'Time'}: ${timeframe === 'hour' 
                        ? d3.timeFormat('%b %d %H:00')(d.date) 
                        : d.date.toLocaleTimeString()}<br/>
                    Date: ${d.date.toLocaleDateString()}<br/>
                    Open: ₹${d.open.toFixed(2)}<br/>
                    Close: ₹${d.close.toFixed(2)}<br/>
                    High: ₹${d.high.toFixed(2)}<br/>
                    Low: ₹${d.low.toFixed(2)}<br/>
                    Volume: ${d.volume.toLocaleString()}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        }

        // Add tooltip
        const tooltip = d3.select(chartRef.current)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Initialize zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 20])
            .extent([[0, 0], [width, height]])
            .on("zoom", (event) => {
                updateChart(event.transform);
            });

        // Apply zoom to SVG
        svg.call(zoom);

        // Initial render
        updateChart(d3.zoomIdentity);
    };

    // Add handler for timeframe change
    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };

    return (
        <div className="stock-detail-container">
            <div className="stock-detail-header">
                <h1>{stockId} Stock Chart</h1>
                <div className="chart-controls">
                    <select 
                        value={timeframe}
                        onChange={handleTimeframeChange}
                        className="timeframe-selector"
                    >
                        <option value="minute">Minute</option>
                        <option value="hour">Hour</option>
                    </select>
                    <p className="chart-instructions">Use mouse wheel to zoom in/out and drag to pan</p>
                </div>
            </div>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading stock data...</p>
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <div className="chart-container" ref={chartRef}></div>
        </div>
    );
}

export default StockDetail;




