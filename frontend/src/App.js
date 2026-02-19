import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import './App.css';
import InteractiveBoard from './InteractiveBoard';

useEffect(() => {
  AOS.init({ duration: 1000, once: true });
}, []);