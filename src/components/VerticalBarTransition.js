import React, { useRef, useEffect } from 'react';

const VerticalBarTransition = ({ onComplete }) => {
  const bar1Ref = useRef(null);
  const bar2Ref = useRef(null);
  const bar3Ref = useRef(null);
  const completedAnimations = useRef(0);

  useEffect(() => {
    const bars = [bar1Ref.current, bar2Ref.current, bar3Ref.current];
    
    const handleAnimationEnd = (e) => {
      if (e.animationName === 'exitAnim') {
        completedAnimations.current += 1;
        if (completedAnimations.current === 3) {
          onComplete?.();
        }
      }
    };

    bars.forEach(bar => {
      bar?.addEventListener('animationend', handleAnimationEnd);
    });

    return () => {
      bars.forEach(bar => {
        bar?.removeEventListener('animationend', handleAnimationEnd);
      });
    };
  }, [onComplete]);

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
          ref={bar1Ref}
          className="bg-blue-400 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '25%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 1s ease-in-out forwards 0.4s'
          }}
        ></div>
        {/* Barra 2 */}
        <div 
          ref={bar2Ref}
          className="bg-blue-800 h-full transition-all ease-in-out flex items-center justify-center"
          style={{
            '--enter-width': '50%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 1s ease-in-out forwards 0.4s'
          }}
        >
          <img 
            src="/logo-servisoft-30years.png" 
            alt="Logo Servisoft" 
            className="w-[40rem] h-[40rem] object-contain"
          />
        </div>
        {/* Barra 3 */}
        <div 
          ref={bar3Ref}
          className="bg-blue-400 h-full transition-all ease-in-out"
          style={{
            '--enter-width': '25%',
            animation: 'enterAnim 0.5s ease-in-out forwards, exitAnim 1s ease-in-out forwards 0.4s'
          }}
        ></div>
      </div>
    </div>
  );
};

export default VerticalBarTransition;