'use client';
import dynamic from 'next/dynamic';

const Main1 = dynamic(() => import('./Main'));

export default function Client1() {
  return <Main1 />;
}
