import React from 'react';

const VerticalBarTransition = () => {
  return (
    <div className="fixed inset-0 z-40">
      <style jsx>{`
        @keyframes enterAnim {
          from { width: 0; }
          to { width: var(--enter-width); }
        }
        @keyframes exitAnim {
          from { width: var(--enter-width); }
          to { width: 0; }
        }
      `}</style>
      <div className="flex h-full">
        {/* Barra 1: se expande hasta 40% y se retrae con delay en la salida */}
        <div 
          className="bg-teal-600 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '40%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 0.5s ease-in-out forwards 0.4s'
          }}
        ></div>
        {/* Barra 2: se expande hasta 70% y se retrae */}
        <div 
          className="bg-blue-800 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '70%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 0.5s ease-in-out forwards 0.4s'
          }}
        ></div>
        {/* Barra 3: se expande hasta 100% y se retrae */}
        <div 
          className="bg-blue-400 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '100%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 0.5s ease-in-out forwards 0.4s'
          }}
        ></div>
      </div>
    </div>
  );
};

export default VerticalBarTransition;
