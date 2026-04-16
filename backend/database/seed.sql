-- USE inventech;

-- ─────────────────────────────────────────
-- Suppliers (10 records)
-- ─────────────────────────────────────────
INSERT INTO `suppliers` (`name`, `email`, `phone`, `address`) VALUES
('TechCorp S.A.',           'contacto@techcorp.mx',         '+52 55 1234 5678', 'Av. Insurgentes Sur 1234, CDMX'),
('GlobalTech Ltd.',         'ventas@globaltech.com',         '+1 800 555 0100',  '1000 Tech Blvd, Austin TX'),
('Componentes del Norte',   'info@compnorte.mx',             '+52 81 2345 6789', 'Blvd. Díaz Ordaz 456, Monterrey'),
('Electrónica Latina',      'soporte@electro-latina.com',    '+52 33 3456 7890', 'Av. López Mateos 789, Guadalajara'),
('SinoTech Imports',        'business@sinotech.cn',          '+86 10 6789 1234', 'ZhongGuanCun St. 88, Beijing'),
('Distribuidora Centro',    'pedidos@distcentro.mx',         '+52 55 9876 5432', 'Calz. de Tlalpan 567, CDMX'),
('Nordic Supplies AB',      'orders@nordicsupplies.se',      '+46 8 1234 5678',  'Kungsgatan 22, Stockholm'),
('Pacific Electronics',     'info@pacificelectronics.jp',    '+81 3 1234 5678',  '1-2-3 Akihabara, Tokyo'),
('Proveedor Nacional S.R.L.','ventas@provnacional.mx',       '+52 55 6543 2109', 'Eje Central 101, CDMX'),
('Omega Distribuciones',    'contacto@omegadist.mx',         '+52 33 7654 3210', 'Periférico Sur 990, Guadalajara');

-- ─────────────────────────────────────────
-- Products (10 records)
-- ─────────────────────────────────────────
INSERT INTO `products` (`name`, `sku`, `description`, `price`, `stock`, `supplier_id`) VALUES
('Laptop HP 15s',              'LP-HP-15S-001',  'Laptop HP 15s Intel Core i5, 8GB RAM, 256GB SSD',          12500.00, 25, 1),
('Monitor Samsung 24"',        'MN-SAM-24-002',  'Monitor Samsung Full HD 24 pulgadas IPS',                   3800.00, 40, 2),
('Teclado Mecánico RGB',       'KB-MEC-RGB-003', 'Teclado mecánico switches Blue retroiluminado RGB',          950.00, 60, 3),
('Mouse Inalámbrico Logitech', 'MS-LOG-WRL-004', 'Mouse inalámbrico Logitech M705 2.4 GHz',                   450.00, 80, 4),
('SSD Kingston 1TB',           'SSD-KNG-1TB-005','SSD Kingston A2000 NVMe M.2 1 TB',                         1800.00, 35, 5),
('Auriculares Sony WH-1000XM5','AU-SNY-WH5-006', 'Auriculares inalámbricos con cancelación de ruido activa', 7200.00, 20, 6),
('Webcam Logitech C920',       'WC-LOG-C920-007','Webcam Full HD 1080p con micrófono integrado',              1350.00, 45, 7),
('Router TP-Link AX3000',      'RT-TP-AX3-008',  'Router Wi-Fi 6 AX3000 doble banda',                        2100.00, 30, 8),
('Impresora Epson L3250',      'IP-EPS-L32-009', 'Impresora multifuncional sistema de tinta continua',        4500.00, 15, 9),
('UPS APC 1500VA',             'UP-APC-15K-010', 'UPS APC Back-UPS 1500VA 230V con AVR',                     3200.00, 22, 10);

-- ─────────────────────────────────────────
-- Movements (10 records)
-- user_id = 1 → Super Admin (creado en schema.sql)
-- ─────────────────────────────────────────
INSERT INTO `movements` (`product_id`, `user_id`, `movement_type`, `quantity`, `notes`) VALUES
(1,  1, 'IN',   25, 'Recepción inicial de laptops HP'),
(2,  1, 'IN',   40, 'Entrada de monitores Samsung desde proveedor'),
(3,  1, 'IN',   60, 'Compra de teclados mecánicos RGB'),
(4,  1, 'IN',   80, 'Entrada de mouse inalámbrico Logitech'),
(5,  1, 'IN',   35, 'Almacenamiento inicial de SSD Kingston'),
(6,  1, 'OUT',   5, 'Venta de auriculares Sony a cliente corporativo'),
(7,  1, 'OUT',   8, 'Distribución de webcams a sucursales'),
(8,  1, 'IN',   30, 'Reabastecimiento de routers TP-Link'),
(9,  1, 'OUT',   3, 'Entrega de impresoras Epson a cliente'),
(10, 1, 'IN',   22, 'Recepción de UPS APC para almacén central');
