import React from 'react';
import '../App.css';

export default function Homepage() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center h-screen gap-10">
        <div className="flex flex-col gap-4">
          <input type="text" className="input-dark" placeholder="Input Dark" />
          <input type="text" className="input-light" placeholder="Input Light" />
        </div>
        <div className="flex flex-col gap-4">
          <button className="btn btn-primary">Primary Action</button>
          <button className="btn btn-secondary">Secondary Action</button>
          <button className="btn btn-modern">Modern Action</button>
          <button className="btn btn-danger">Danger Action</button>
        </div>
      </section>
    </div>
  );
}
