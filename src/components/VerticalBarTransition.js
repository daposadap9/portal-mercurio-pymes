import React from 'react';

const VerticalBarTransition = () => {
  return (
    <div className="fixed inset-0 z-20">
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
        {/* Barra 1 */}
        <div 
          className="bg-teal-600 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '33.33%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 0.5s ease-in-out forwards 0.4s'
          }}
        ></div>
        {/* Barra 2: con imagen centrada */}
        <div 
          className="bg-blue-800 h-full transition-all ease-in-out flex items-center justify-center"
          style={{
            '--enter-width': '33.33%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 0.5s ease-in-out forwards 0.4s'
          }}
        >
          <img 
            src="/logo-servisoft-30years.png" 
            alt="Logo Servisoft" 
            className="max-h-full"
          />
        </div>
        {/* Barra 3 */}
        <div 
          className="bg-blue-400 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '33.33%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 0.5s ease-in-out forwards 0.4s'
          }}
        ></div>
      </div>
    </div>
  );
};

export default VerticalBarTransition;
