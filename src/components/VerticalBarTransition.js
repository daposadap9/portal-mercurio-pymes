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
        /* Estilos para la sombra solo en el lado derecho de la barra 3 */
        .bar-shadow {
          position: relative;
        }
        .bar-shadow::after {
          content: "";
          position: absolute;
          top: 0;
          right: -5px; /* Ajusta este valor para posicionar la sombra */
          width: 5px;  /* Ancho de la sombra */
          height: 100%;
          /* Sombra solo en el lado derecho */
          box-shadow: -5px 0 5px rgba(0, 0, 0, 0.3);
          pointer-events: none;
        }
      `}</style>
      <div className="flex h-full">
        {/* Barra 1 */}
        <div 
          ref={bar1Ref}
          className="bg-white h-full transition-all ease-in-out"
          style={{
            '--enter-width': '25%',
            animation: 'enterAnim 1.2s ease-in-out forwards, exitAnim 1.2s ease-in-out forwards 1.2s'
          }}
        ></div>
        {/* Barra 2 */}
        <div 
          ref={bar2Ref}
          className="bg-white h-full transition-all ease-in-out flex items-center justify-center"
          style={{
            '--enter-width': '50%',
            animation: 'enterAnim 1.2s ease-in-out forwards, exitAnim 1.2s ease-in-out forwards 1.2s'
          }}
        >
          <img 
            src="/logo-servisoft-30years.webp" 
            alt="Logo Servisoft" 
            className="w-[40rem] h-[40rem] object-contain"
          />
        </div>
        {/* Barra 3: Con sombra solo a la derecha */}
        <div 
          ref={bar3Ref}
          className="bg-white h-full transition-all ease-in-out bar-shadow"
          style={{
            '--enter-width': '25%',
            animation: 'enterAnim 1.2s ease-in-out forwards, exitAnim 1.2s ease-in-out forwards 1.2s'
          }}
        ></div>
      </div>
    </div>
  );
};

export default VerticalBarTransition;
