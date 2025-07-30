
import { Wrench } from 'lucide-react';
import React from 'react'

export default function InDevMode({devMode}) {
  return (
    <div
      className={`fixed right-4 top-4 z-50 ${devMode
		? 'flex'
		: 'hidden'} items-center font-semibold gap-2 rounded-xl bg-yellow-800 px-3 py-0.5 text-white shadow-xl shadow-white`}
    >
      <div>
        <Wrench />
      </div>
      <p>In Development</p>
    </div>
  );
}
