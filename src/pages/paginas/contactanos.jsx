import React from 'react';
import Image from 'next/image';
import { FaBriefcase, FaMapMarkerAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const contacts = [
  {
    name: "SANDRA PEÑA",
    department: "CUENTAS CORPORATIVAS",
    city: "BOGOTÁ D.C",
    phone: "3002187751",
    email: "SPENA@SERVISOFT.COM.CO"
  },
  {
    name: "FREDY PEÑA",
    department: "CUENTAS CORPORATIVAS",
    city: "BOGOTÁ D.C",
    phone: "3008676350",
    email: "FPENA@SERVISOFT.COM.CO"
  },
  {
    name: "ERIKA CORTÉS",
    department: "CUENTAS CORPORATIVAS",
    city: "BOGOTÁ D.C",
    phone: "3134850593",
    email: "ECORTES@SERVISOFT.COM.CO"
  },
  {
    name: "SIMÓN ESCOBAR",
    department: "CUENTAS CORPORATIVAS",
    city: "MEDELLÍN",
    phone: "3008676122",
    email: "SESCOBAR@SERVISOFT.COM.CO"
  },
  {
    name: "LICETH MONTOYA",
    department: "SERVICIO AL CLIENTE",
    city: "MEDELLÍN",
    phone: "3005675429",
    email: "LMONTOYA@SERVISOFT.COM.CO"
  }
];

const images = [
  '/sandra.png',
  '/fredy.png',
  '/erika.png',
  '/simon.png',
  '/lizeth.png'
];

const Contactanos = () => {
  return (
    <div className="min-h-full max-w-6xl mx-auto flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">Contáctanos</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {contacts.map((contact, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-2xl p-10 flex flex-col items-center transition-transform hover:scale-105 overflow-hidden"
          >
            <div className="w-40 h-40 relative mb-4">
              <Image 
                src={images[index]} 
                alt={contact.name} 
                layout="fill" 
                objectFit="cover" 
                quality={100}
                className="rounded-full shadow-xl"
              />
            </div>
            <h3 className="text-2xl font-bold text-teal-600 mb-2 text-center">
              {contact.name}
            </h3>
            <div className="w-full px-1">
              <div className="flex items-center mb-1 break-words">
                <FaBriefcase className="text-teal-500 mr-2" />
                <span className="text-gray-700 text-sm font-bold">{contact.department}</span>
              </div>
              <div className="flex items-center mb-1 break-words">
                <FaMapMarkerAlt className="text-teal-500 mr-2" />
                <span className="text-gray-700 text-sm font-bold">{contact.city}</span>
              </div>
              <div className="flex items-center mb-1 break-words">
                <FaWhatsapp className="text-teal-500 mr-2" />
                <a 
                  href={`https://wa.me/${contact.phone}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 text-sm font-bold hover:text-teal-600"
                >
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center break-words">
                <FaEnvelope className="text-teal-500 mr-2" />
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-gray-700 text-sm font-bold hover:text-teal-600"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contactanos;
