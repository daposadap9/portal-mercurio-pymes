// /pages/inicioPrueba.js
import React from 'react'
import Image from 'next/image'

export default function InicioPrueba() {
  return (
    <>
      <section className="heroSection">
        {/* Fondo degradado principal */}
        <div className="heroSection__gradient"></div>

        {/* BARRAS DE COLOR */}
        <div className="heroSection__barTeal"></div>
        <div className="heroSection__barDarkBlue"></div>
        <div className="heroSection__barYellow"></div>

        {/* Imagen 1 (trabajoEnEquipo.png) */}
        <div className="heroSection__imageColor">
          <Image
            src="/trabajoEnEquipo.png"
            alt="Imagen de fondo a color"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="heroSection__imageColor--rounded"
          />
        </div>

        {/* Imagen 2 (trabajoEnEquipo2.png) en gris */}
        <div className="heroSection__imageGray">
          <Image
            src="/trabajoEnEquipo2.png"
            alt="Imagen en gris con efecto periódico"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="heroSection__imageGray--rounded"
          />
        </div>

        {/* Logo */}
        <div className="heroSection__logo">
          <Image
            src="/logo-servisoft-30years-dark.png"
            alt="Logo Servisoft"
            width={300}
            height={50}
          />
        </div>

        {/* Texto pequeño a la izquierda */}
        <div className="heroSection__smallTextLeft">
          <span>Lorem Ipsum</span>
        </div>

        {/* Texto grande a la derecha */}
        <div className="heroSection__bigTextRight">
          <h1>Lorem ipsum dolor sit ame</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Risus commodo viverra
            maecenas accumsan lacus vel facilisis.
          </p>
        </div>

        {/* Imagen del gerente */}
        <div className="heroSection__manager">
          <Image
            src="/gerente.png"
            alt="Gerente"
            width={500}
            height={450}
            objectFit="contain"
            priority
          />
        </div>

        {/* Contenedor blanco abajo */}
        <div className="heroSection__whiteContainer">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Contenedor azul oscuro detrás del blanco */}
        <div className="heroSection__blueContainer"></div>
      </section>

      <style jsx global>{`
        .heroSection {
          position: relative;
          width: 100%;
          min-height: 700px;
          overflow: hidden;
          font-family: sans-serif;
        }

        /* Fondo degradado */
        .heroSection__gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #19199A 0%, #0aafb3 70%);
          z-index: 1;
        }

        /* BARRA VERTICAL TEAL */
        .heroSection__barTeal {
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;       /* Ajusta el grosor */
          height: 600px;     /* Ajusta la altura */
          background-color: #0AAFB3;
          
          z-index: 5;        /* Para que quede sobre el degradado */
        }

        /* BARRA HORIZONTAL AZUL OSCURO */
        .heroSection__barDarkBlue {
          position: absolute;
          top: 0;
          left: 0;        /* Comienza donde termina la barra teal */
          width: 50px;      /* Ajusta el ancho */
          height: 70px;      /* Ajusta el alto */
          background-color: #FFD300;
          z-index: 5;
          
        }

        /* BLOQUE AMARILLO */
        .heroSection__barYellow {
          position: absolute;
          top: 0;
          left: 50;       /* Comienza donde termina la barra azul */
          width: 900px;       /* Ajusta el ancho */
          height: 70px;      /* Ajusta el alto */
          background-color: #19199A;
          z-index: 6;  
        }

        /* IMAGEN A COLOR (trabajoEnEquipo.png) */
        .heroSection__imageColor {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 90%;
          z-index: 2;
          overflow: hidden; 
        }
        .heroSection__imageColor--rounded {
          border-bottom-right-radius: 80px;
        }
        .heroSection__imageColor::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background: linear-gradient(
            to bottom,
            rgba(6, 163, 170, 0.8),
            rgba(6, 163, 170, 0.5)
          );
        }

        /* IMAGEN GRIS (trabajoEnEquipo2.png) */
        .heroSection__imageGray {
          position: absolute;
          top: 210px;
          right: 0;
          width: 60%;
          height: 70%;
          z-index: 3;
          filter: grayscale(100%);
          overflow: hidden;
        }
        .heroSection__imageGray--rounded {
          border-top-left-radius: 80px;
        }

        /* LOGO */
        .heroSection__logo {
          position: absolute;
          top: 0px;
          right: 20px;
          z-index: 10;
          transform: translateY(-20%);
        }

        /* TEXTO PEQUEÑO IZQUIERDA */
        .heroSection__smallTextLeft {
          position: absolute;
          font-size: 50px;
          top: 50%;
          left: 5%;
          transform: translateY(-50%);
          z-index: 10;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }
        .heroSection__smallTextLeft span {
          color: #fff;
          font-weight: 600;
        }

        /* TEXTO GRANDE DERECHA */
        .heroSection__bigTextRight {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 1.5rem;
          border-radius: 8px;
          top: 45%;
          right: 5%;
          max-width: 350px;
          color: #fff;
          z-index: 10;
        }
        .heroSection__bigTextRight h1 {
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        .heroSection__bigTextRight p {
          line-height: 1.4;
        }

        /* IMAGEN DEL GERENTE */
        .heroSection__manager {
          position: absolute;
          bottom: 73px;
          left: 38%;
          transform: translateX(-50%);
          z-index: 11;
        }

        /* CONTENEDOR BLANCO ABAJO */
        .heroSection__whiteContainer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60%;
          padding: 1.5rem;
          background-color: #fff;
          color: #333;
          border-top-right-radius: 60px;
          z-index: 9;
        }

        /* CONTENEDOR AZUL OSCURO DETRÁS DEL BLANCO */
        .heroSection__blueContainer {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 20%;
          height: 700px;
          background-color: #19199A;
          z-index: 2;
        }

        @media (max-width: 992px) {
          .heroSection__barTeal {
            height: 80px;
          }
          .heroSection__barDarkBlue {
            left: 80px;
            width: 200px;
          }
          .heroSection__barYellow {
            left: 280px;
          }
          .heroSection__imageColor {
            width: 60%;
            height: 50%;
          }
          .heroSection__imageGray {
            width: 60%;
            height: 50%;
          }
        }

        @media (max-width: 768px) {
          .heroSection__barTeal,
          .heroSection__barDarkBlue,
          .heroSection__barYellow {
            display: none; /* Oculta las barras si no caben */
          }
          .heroSection__smallTextLeft {
            display: none;
          }
          .heroSection__bigTextRight {
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }
          .heroSection__manager {
            width: 60%;
          }
          .heroSection__whiteContainer {
            width: 100%;
            border-top-right-radius: 0;
            border-top-left-radius: 60px;
          }
          .heroSection__blueContainer {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
