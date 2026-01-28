import React from 'react';
import '../App.css';

export default function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-4">
      <button className="btn btn-primary">Primary Action</button>
        <button className="btn btn-secondary">Secondary Action</button>
        <button className="btn btn-modern">Modern Action</button>
        <button className="btn btn-danger">Danger Action</button>
        <button className="btn btn-info">Info Action</button>

      </div>
    </div>
  );
}
