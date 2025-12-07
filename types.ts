import React from 'react';

export interface WishState {
  text: string;
  loading: boolean;
  error: string | null;
}

export interface OrnamentData {
  position: [number, number, number];
  color: string;
  scale: number;
}

export interface UserPhoto {
  id: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export enum OrnamentColor {
  ROSE_GOLD = '#F4C2C2',
  GOLD = '#FFD700',
  MIST_WHITE = '#F5F5F5',
  EMERALD = '#50C878',
  RUBY = '#E0115F', // Added for the "Red socks/ribbon" feel
}

// Augment JSX.IntrinsicElements to include React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      dodecahedronGeometry: any;
      boxGeometry: any;
      planeGeometry: any;
      octahedronGeometry: any;
      meshPhysicalMaterial: any;
      cylinderGeometry: any;
      meshBasicMaterial: any;
      torusGeometry: any;
    }
  }
}

// Augment React's JSX namespace for stricter setups (React 18+)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      dodecahedronGeometry: any;
      boxGeometry: any;
      planeGeometry: any;
      octahedronGeometry: any;
      meshPhysicalMaterial: any;
      cylinderGeometry: any;
      meshBasicMaterial: any;
      torusGeometry: any;
    }
  }
}