import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';
import './StockDetail.css';

function StockDetail() {
  const { stockId } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockResponse = await axios.get(`http://localhost:8083/api/stocks/search?query=${stockId}`);
        if (stockResponse.data.data && stockResponse.data.data.length > 0) {
          const stock = stockResponse.data.data[0];
          setStockData(stock);
          
          drawCandlestickChart(stock.history);
        } else {
          setError('Stock not found');
        }
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (stockId) {
      fetchStockData();
    }
  }, []);

  const formatHistoryData = (historyData) => {
    if (!historyData) return [];
    
    // Convert the data into an array of price points with timestamps
    const pricePoints = Object.entries(historyData).map(([timestamp, price]) => ({
      date: new Date(timestamp),
      price: price
    })).sort((a, b) => a.date - b.date);

    // Group data into 5-minute intervals
    const groupedData = [];
    let currentGroup = [];
    
    for (let i = 0; i < pricePoints.length; i++) {
      currentGroup.push(pricePoints[i]);
      
      // Check if we need to create a new candlestick
      const isLastItem = i === pricePoints.length - 1;
      const nextItemNewGroup = !isLastItem && 
        Math.floor(pricePoints[i].date.getTime() / (5 * 60000)) !== 
        Math.floor(pricePoints[i + 1].date.getTime() / (5 * 60000));

      if (isLastItem || nextItemNewGroup) {
        const prices = currentGroup.map(p => p.price);
        groupedData.push({
          date: currentGroup[0].date,
          open: currentGroup[0].price,
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: currentGroup[currentGroup.length - 1].price
        });
        currentGroup = [];
      }
    }

    return groupedData;
  };

  const drawCandlestickChart = (historyData) => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const data = formatHistoryData(historyData);
    if (!data.length) return;

    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.low) * 0.999,
        d3.max(data, d => d.high) * 1.001
      ])
      .range([height, 0]);

    // Custom time format
    const customTimeFormat = d3.timeFormat("%H:%M");

    // Add X axis
    const xAxis = g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(customTimeFormat)
        .ticks(10));

    // Rotate x-axis labels
    xAxis.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add Y axis
    const yAxis = g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale)
        .tickFormat(d => `$${d.toFixed(2)}`));

    // Calculate candlestick width
    const candlestickWidth = Math.min(
      (width / data.length) * 0.8,
      15
    );

    // Add candlesticks
    g.selectAll(".candlestick")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "candlestick")
      .each(function(d) {
        const g = d3.select(this);
        
        // Draw the vertical line (high-low)
        g.append("line")
          .attr("class", "candlestick-line")
          .attr("x1", xScale(d.date) + candlestickWidth / 2)
          .attr("x2", xScale(d.date) + candlestickWidth / 2)
          .attr("y1", yScale(d.high))
          .attr("y2", yScale(d.low))
          .attr("stroke", d.close >= d.open ? "green" : "red")
          .attr("stroke-width", 1);

        // Draw the candlestick body
        g.append("rect")
          .attr("x", xScale(d.date))
          .attr("y", yScale(Math.max(d.open, d.close)))
          .attr("width", candlestickWidth)
          .attr("height", Math.abs(yScale(d.open) - yScale(d.close)))
          .attr("fill", d.close >= d.open ? "green" : "red")
          .on("mouseover", function(event) {
            // Show tooltip
            const tooltip = d3.select(chartRef.current)
              .append("div")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("background-color", "white")
              .style("padding", "5px")
              .style("border", "1px solid black")
              .style("border-radius", "5px")
              .style("pointer-events", "none");

            tooltip.html(`
              Time: ${customTimeFormat(d.date)}<br/>
              Open: $${d.open.toFixed(2)}<br/>
              High: $${d.high.toFixed(2)}<br/>
              Low: $${d.low.toFixed(2)}<br/>
              Close: $${d.close.toFixed(2)}
            `)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px");
          })
          .on("mouseout", function() {
            // Remove tooltip
            d3.select(".tooltip").remove();
          });
      });

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 20])
      .extent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        const newXScale = event.transform.rescaleX(xScale);
        const newYScale = event.transform.rescaleY(yScale);

        // Update axes
        xAxis.call(d3.axisBottom(newXScale).tickFormat(customTimeFormat));
        yAxis.call(d3.axisLeft(newYScale).tickFormat(d => `$${d.toFixed(2)}`));

        // Update candlesticks
        g.selectAll(".candlestick").each(function(d) {
          const candlestick = d3.select(this);
          
          candlestick.select("line")
            .attr("x1", newXScale(d.date) + candlestickWidth / 2)
            .attr("x2", newXScale(d.date) + candlestickWidth / 2)
            .attr("y1", newYScale(d.high))
            .attr("y2", newYScale(d.low));

          candlestick.select("rect")
            .attr("x", newXScale(d.date))
            .attr("y", newYScale(Math.max(d.open, d.close)))
            .attr("height", Math.abs(newYScale(d.open) - newYScale(d.close)));
        });

        // Maintain rotated labels
        xAxis.selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)");
      });

    // Apply zoom
    svg.call(zoom);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stockData) return <div>No data available</div>;

  return (
    <div className="stock-detail">
      <h2>{stockData.name} ({stockData.symbol})</h2>
      <div className="chart" ref={chartRef}></div>
    </div>
  );
}

export default StockDetail;





