import React from "react";

const statusColor = {
  OFF: "#6c757d",   // gray
  SB: "#17a2b8",    // teal
  D: "#ffc107",     // yellow
  ON: "#28a745",    // green
};

const yLevels = ["OFF", "SB", "D", "ON"];

const ELDChart = ({ blocks, showTotals = false }) => {
  return (
    <div className="eld-chart-container">
      {/* Y-axis labels with totals */}
      <div className="position-relative" style={{ height: "160px" }}>
        {showTotals && (
          <div className="eld-y-axis">
            {yLevels.map((lvl) => {
              const mins = blocks.reduce((total, b) => 
                b.status === lvl ? total + (b.end - b.start) * 60 : total, 0);
              const hrs = Math.floor(mins / 60);
              const rem = mins % 60;
              return (
                <div key={lvl} className="eld-y-label">
                  <strong>{lvl}</strong> {hrs}h {rem}m
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline blocks */}
        <div className="eld-timeline">
          {/* Horizontal lines */}
          {yLevels.map((lvl, i) => (
            <div 
              key={`line-${lvl}`}
              className="eld-horizontal-line"
              style={{ top: `${(i / yLevels.length) * 100}%` }}
            />
          ))}
          
          {/* Status blocks */}
          {blocks.map((b, i) => {
            const top = (yLevels.indexOf(b.status) / yLevels.length) * 100;
            const height = 100 / yLevels.length;
            const left = (b.start / 24) * 100;
            const width = ((b.end - b.start) / 24) * 100;

            return (
              <div
                key={i}
                className="eld-status-block"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  height: `${height}%`,
                  width: `${width}%`,
                  backgroundColor: statusColor[b.status],
                  borderColor: statusColor[b.status],
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Time ruler */}
      <div className="eld-time-ruler">
        {Array.from({ length: 13 }).map((_, i) => (
          <span key={i}>{i * 2}h</span>
        ))}
      </div>
    </div>
  );
};

export default ELDChart;