import React from 'react';
import { useParams } from 'react-router-dom';
import EldHosWorkspace from '../eld/EldHosWorkspace';
export default function DriverHOS(){const {id}=useParams();return <EldHosWorkspace initialTab="logbook" initialDriverId={id || ''}/>;}
