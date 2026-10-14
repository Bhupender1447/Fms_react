import React from 'react';
import { Card } from './components';
import './workspace.css';

export default function WorkspaceSummary({ items, unavailable = false }) {
  return <section className="iso-workspace-summary" aria-label="Record summary">{items.map(([label, value]) => <Card as="article" key={label}><span>{label}</span><strong>{unavailable ? 'Not available' : value}</strong></Card>)}</section>;
}
