import { useEffect, useRef } from 'react';

/**
 * A custom hook to detect clicks outside of a specified element.
 * @param {function} handler - The function to call when a click outside is detected.
 * @returns {React.MutableRefObject} A ref to attach to the element you want to monitor.
 */
export const useClickOutside = (handler) => {
  const domNodeRef = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (domNodeRef.current && !domNodeRef.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  }, [handler]);

  return domNodeRef;
};