import React from 'react';
import { getStopProgress } from './routePlanningModel';

export default function RouteProgress({ stops = [] }) {
  const progress = getStopProgress(stops);
  return (
    <div className="route-progress" aria-label={`Verified stop progress: ${progress.completed} of ${progress.total}`}>
      <div className="route-progress-heading"><strong>{progress.completed} / {progress.total} stops</strong><span>{progress.percent}%</span></div>
      <div className="progress" role="progressbar" aria-label="Verified stop completion" aria-valuenow={progress.percent} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar" style={{ width: `${progress.percent}%` }} />
      </div>
      <small>Only verified driver completion evidence counts. Distance progress is unavailable until a trusted tracking feed is connected.</small>
    </div>
  );
}
