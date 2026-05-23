import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text, speed = 50, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    indexRef.current = 0;

    let interval;
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          setIsDone(true);
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

export function useAnimatedNumber(target, duration = 1500, startDelay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [target, duration, startDelay]);

  return value;
}
