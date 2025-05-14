# Chino - Sistema de Ofertas y Productos

Un sistema web moderno para gestionar y mostrar ofertas y productos, construido con Next.js, TypeScript, y Tailwind CSS.

## 🌟 Características

### Sistema de Ofertas en Video
- Reproductor de video personalizado con controles intuitivos
- Reproducción automática con detección de capacidades del navegador
- Transiciones suaves entre videos
- Controles de sonido y reproducción
- Sistema de badges para destacar ofertas
- Soporte para videos verticales y horizontales

### Interfaz de Usuario
- Diseño responsive y moderno
- Animaciones fluidas con Framer Motion
- Componentes reutilizables con Shadcn/ui
- Temas personalizables
- Interfaz adaptable a diferentes dispositivos

## 🚀 Tecnologías

- **Frontend:**
  - Next.js 14+
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Shadcn/ui
  - Lucide Icons

- **Backend:**
  - Next.js API Routes
  - Sistema de autenticación incorporado
  - Gestión de archivos multimedia
  - API RESTful

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o pnpm

## 🛠️ Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone https://github.com/tu-usuario/chino.git
cd chino
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
# o
pnpm install
\`\`\`

3. Configurar las variables de entorno:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
# o
pnpm dev
\`\`\`

## 📁 Estructura de Archivos

- \`/app\` - Rutas y páginas de la aplicación (Next.js App Router)
- \`/components\` - Componentes reutilizables
- \`/public\` - Archivos estáticos
- \`/types\` - Definiciones de tipos TypeScript
- \`/lib\` - Utilidades y funciones helpers
- \`/data\` - Datos estáticos y configuraciones

## 💼 Uso

### Gestión de Videos
Los videos deben colocarse en \`/public/media/videos/\` y configurarse en el archivo \`data/offers.json\`.

### Estructura de una Oferta
\`\`\`json
{
  "id": "1",
  "title": "Título de la Oferta",
  "description": "Descripción de la oferta",
  "videoUrl": "/media/videos/ejemplo.mp4",
  "thumbnailUrl": "/media/thumbnails/ejemplo.jpg",
  "isActive": true,
  "displayOptions": {
    "autoplay": true,
    "loop": true,
    "muted": true,
    "showBadge": true,
    "badgeText": "Nuevo",
    "badgeColor": "bg-red-600"
  }
}
\`\`\`

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

- Papiweb - Desarrollador Full Stack
- GitHub: [@papiweb](https://github.com/papiweb)
- Web: [papiweb.dev](https://papilink.github.io/papilink)
- Email: mgenialive@gmail.com

## ⚡ Desarrollado por Papiweb

Este proyecto ha sido desarrollado por Papiweb, especialista en:
- Desarrollo de aplicaciones web modernas
- Soluciones de comercio electrónico
- Sistemas de gestión de contenido multimedia
- Interfaces de usuario interactivas y responsivas

## 🙏 Agradecimientos

- Shadcn por los componentes UI
- Vercel por Next.js
- La comunidad de código abierto

---

© 2025 Papiweb. Todos los derechos reservados.

Built with 💙 by [Papiweb](https://github.com/papiweb)
