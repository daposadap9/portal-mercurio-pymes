// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Upsert para el servicio "Software" con sus opciones
  const softwareService = await prisma.service.upsert({
    where: { name: 'Software' },
    update: {},
    create: {
      name: 'Software',
      icon: null,
      options: {
        create: [
          { label: '1 usuario', value: 3000000, startup: 750000 },
          { label: '5 usuarios', value: 9000000, startup: 3000000 },
          { label: '10 usuarios', value: 16200000, startup: 6750000 },
          { label: '20 usuarios', value: 24600000, startup: 8200000 },
          { label: '30 usuarios', value: 32400000, startup: 10800000 },
          { label: '50 usuarios', value: 42000000, startup: 14000000 },
        ]
      }
    }
  });

  // Upsert para el servicio "Custodia" con sus opciones
  const custodiaService = await prisma.service.upsert({
    where: { name: 'Custodia' },
    update: {},
    create: {
      name: 'Custodia',
      icon: null,
      options: {
        create: [
          { label: '5 cajas', value: 210000 },
          { label: '10 cajas', value: 384000 },
          { label: '20 cajas', value: 696000 },
          { label: '30 cajas', value: 936000 },
          { label: '40 cajas', value: 1104000 },
          { label: '50 cajas', value: 1200000 },
        ]
      }
    }
  });

  // Upsert para el servicio "Digitalización" con sus opciones
  const digitalService = await prisma.service.upsert({
    where: { name: 'Digitalización' },
    update: {},
    create: {
      name: 'Digitalización',
      icon: null,
      options: {
        create: [
          { label: '10667 imágenes', value: 1866666.67, startup: 0 },
          { label: '21333 imágenes', value: 3626666.67, startup: 0 },
          { label: '42667 imágenes', value: 7040000, startup: 0 },
          { label: '64000 imágenes', value: 10240000, startup: 0 },
          { label: '85333 imágenes', value: 13226666.67, startup: 0 },
          { label: '106667 imágenes', value: 16000000, startup: 0 },
        ]
      }
    }
  });

  console.log({ softwareService, custodiaService, digitalService });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
