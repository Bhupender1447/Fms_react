import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DailyLogDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const totalsRef = useRef(null);

  useEffect(() => {
    if (!state || !state.blocks) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chartWidth = canvas.width;
    const rowHeight = 50;
    const gridHeight = rowHeight * 4;

    // Convert blocks to the format expected by the chart
    const logs = state.blocks.map(block => {
      let status;
      switch(block.status) {
        case 'SB': status = 1; break;
        case 'D': status = 2; break;
        case 'ON': status = 3; break;
        default: status = 0; // OFF
      }
      return { from: block.start, to: block.end, status };
    });

    const minHour = 0;
    const maxHour = 24;
    const hourRange = maxHour - minHour;
    const pxPerHour = chartWidth / hourRange;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * rowHeight);
      ctx.lineTo(chartWidth, i * rowHeight);
      ctx.strokeStyle = '#888';
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let i = 0; i <= hourRange * 4; i++) {
      const x = i * (pxPerHour / 4);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gridHeight);
      ctx.strokeStyle = i % 4 === 0 ? '#000' : '#ccc';
      ctx.stroke();
    }

    // Draw the status lines
    ctx.beginPath();
    logs.forEach((log, i) => {
      const x1 = (log.from - minHour) * pxPerHour;
      const y1 = log.status * rowHeight + rowHeight / 2;
      const x2 = (log.to - minHour) * pxPerHour;

      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);

      ctx.lineTo(x2, y1);
    });
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Calculate and display totals
    const totals = [0, 0, 0, 0];
    logs.forEach(log => totals[log.status] += (log.to - log.from));
    
    if (totalsRef.current) {
      totalsRef.current.innerHTML = totals.map(total => {
        const hrs = Math.floor(total);
        const mins = Math.round((total - hrs) * 60);
        return `<div><strong>${hrs}:${mins.toString().padStart(2, '0')}</strong></div>`;
      }).join('');
    }
  }, [state]);

  const renderTimeScale = () => {
    const hours = [];
    for (let h = 0; h <= 24; h++) {
      hours.push(<div key={h}>{h}</div>);
    }
    return hours;
  };

  if (!state || !state.blocks) {
    return (
      <div className="container py-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h4>No log data available.</h4>
      </div>
    );
  }

  const { date, blocks } = state;

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h4 className="mb-3">
        Log Detail:{" "}
        {new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h4>

      {/* HOS Timeline Chart */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
        HOUR AT WHICH DAY BEGINS (Midnight)
      </div>
      <div className="chart-wrapper">
        <div className="time-labels">
          <div className="time-scale">
            {renderTimeScale()}
          </div>
        </div>
        <div className="d-flex">
          <div className="labels">
            <div>Off-duty time<br />other than in sleeper berth</div>
            <div>Off-duty time<br />in sleeper berth</div>
            <div>Driving time</div>
            <div>On-duty time<br />other than driving time</div>
          </div>
          <canvas ref={canvasRef} id="hosCanvas" width="960" height="200"></canvas>
          <div className="totals" ref={totalsRef}></div>
        </div>
        <div className="time-labels">
          <div className="time-scale">
            {renderTimeScale()}
          </div>
        </div>
      </div>

      {/* Detailed block list */}
      <h5 className="mt-4">Activity Details:</h5>
      <ul className="list-group">
        {blocks.map((b, i) => (
          <li
            key={i}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{b.status}</strong>
            </span>
            <span>
              {Math.floor(b.start)}:{String(Math.round((b.start % 1) * 60)).padStart(2, "0")} —{" "}
              {Math.floor(b.end)}:{String(Math.round((b.end % 1) * 60)).padStart(2, "0")} (
              {Math.round((b.end - b.start) * 60)} min)
            </span>
          </li>
        ))}
      </ul>

      <style>{`
        .chart-wrapper {
          overflow-x: auto;
          margin-bottom: 20px;
        }
        
        .labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 200px;
          margin-right: 10px;
          font-size: 12px;
          text-align: right;
          min-width: 120px;
        }
        
        .totals {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 200px;
          margin-left: 10px;
          font-size: 12px;
          min-width: 50px;
        }
        
        .time-labels {
          font-size: 10px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        
        .time-scale {
          display: flex;
          justify-content: space-between;
          width: 960px;
          margin: 0 auto;
        }
        
        .time-scale div {
          width: 40px;
          text-align: center;
        }
        
        canvas {
          border: 1px solid #000;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default DailyLogDetail;