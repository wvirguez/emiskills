-- Seed platforms
INSERT INTO `platforms` (`slug`, `name`) VALUES
('hotmart', 'Hotmart'),
('manual', 'Manual')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed categories
INSERT INTO `categories` (`slug`, `name`) VALUES
('curso', 'Curso'),
('ebook', 'Ebook'),
('plantilla', 'Plantilla'),
('membresia', 'Membresía')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Get platform and category IDs for products
-- We'll use subqueries to get the IDs

-- Seed products
INSERT INTO `products` (`slug`, `title`, `shortDescription`, `price`, `currency`, `language`, `imageGradient`, `affiliateUrl`, `categoryId`, `platformId`, `isActive`, `updatedAt`) VALUES
('desarrollo-java-fullstack', 'Desarrollo Java Full Stack', 'Domina el desarrollo de aplicaciones enterprise con Java y Spring Boot desde cero.', 45.99, 'USD', 'es', 'from-violet-500 to-purple-600', 'https://example.com/desarrollo-java-fullstack', (SELECT `id` FROM `categories` WHERE `slug` = 'curso'), (SELECT `id` FROM `platforms` WHERE `slug` = 'hotmart'), true, CURRENT_TIMESTAMP(3)),
('ebook-marketing-digital', 'Manual de Marketing Digital', 'Guía completa estratégica para campañas efectivas en redes y buscadores.', 29.99, 'USD', 'es', 'from-fuchsia-500 to-pink-600', 'https://example.com/ebook-marketing-digital', (SELECT `id` FROM `categories` WHERE `slug` = 'ebook'), (SELECT `id` FROM `platforms` WHERE `slug` = 'hotmart'), true, CURRENT_TIMESTAMP(3)),
('plantilla-contrato', 'Plantilla de Contrato', 'Plantilla jurídica lista para usar para la redacción de contratos laborales.', 19.99, 'USD', 'es', 'from-indigo-500 to-violet-600', 'https://example.com/plantilla-contrato', (SELECT `id` FROM `categories` WHERE `slug` = 'plantilla'), (SELECT `id` FROM `platforms` WHERE `slug` = 'manual'), true, CURRENT_TIMESTAMP(3)),
('membresia-diseno', 'Membresía de Diseño', 'Acceso mensual a recursos exclusivos de diseño gráfico y UI/UX.', 39.99, 'USD', 'es', 'from-teal-500 to-emerald-600', 'https://example.com/membresia-diseno', (SELECT `id` FROM `categories` WHERE `slug` = 'membresia'), (SELECT `id` FROM `platforms` WHERE `slug` = 'hotmart'), true, CURRENT_TIMESTAMP(3)),
('curso-photoshop-basico', 'Curso Básico de Photoshop', 'Aprenda edición de imágenes y diseño gráfico desde nivel principiante hasta intermedio.', 59.99, 'USD', 'es', 'from-orange-500 to-amber-600', 'https://example.com/curso-photoshop-basico', (SELECT `id` FROM `categories` WHERE `slug` = 'curso'), (SELECT `id` FROM `platforms` WHERE `slug` = 'manual'), true, CURRENT_TIMESTAMP(3)),
('plantilla-cv', 'Plantilla CV Moderno', 'Formato profesional para resúmenes ejecutivos y cartas de presentación.', 14.99, 'USD', 'es', 'from-rose-500 to-pink-600', 'https://example.com/plantilla-cv', (SELECT `id` FROM `categories` WHERE `slug` = 'plantilla'), (SELECT `id` FROM `platforms` WHERE `slug` = 'manual'), true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `shortDescription` = VALUES(`shortDescription`),
  `price` = VALUES(`price`),
  `currency` = VALUES(`currency`),
  `language` = VALUES(`language`),
  `imageGradient` = VALUES(`imageGradient`),
  `affiliateUrl` = VALUES(`affiliateUrl`),
  `categoryId` = VALUES(`categoryId`),
  `platformId` = VALUES(`platformId`),
  `isActive` = VALUES(`isActive`),
  `updatedAt` = CURRENT_TIMESTAMP(3);