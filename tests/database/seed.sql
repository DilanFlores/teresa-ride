SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `review`;
TRUNCATE TABLE `notification`;
TRUNCATE TABLE `payment`;
TRUNCATE TABLE `reservation`;
TRUNCATE TABLE `trip`;
TRUNCATE TABLE `vehicle`;
DELETE FROM `user` WHERE `email` IN ('dilan.fl25@gmail.com', 'juan@gmail.com');

SET FOREIGN_KEY_CHECKS = 1;

-- Usuario normal para crear reseñas
INSERT INTO `user` (
  `id_document`, `name`, `email`, `password`, `nationality`, `role`, `image_path`
) VALUES (
  '703160299', 'Dilan Flores', 'dilan.fl25@gmail.com', '$2b$10$hi6UGcq7gPKBUpAs/aT/gOwWA1bDqOBUzAZcb.9XY55fo2hn9GyFK', 'Costa Rica', 'user', NULL
);

INSERT INTO `notification` (
  `id_notification`, `email_subject`, `description`, `shipping_date`, `attachment_path`, `priority`, `type`
) VALUES
  (1, 'Selenium Test Pago', 'selenium confirmación de pago', NOW(), 'pdf.pdf', 'Low', 'PAYMENT_CONFIRMATION'),
  (2, 'Selenium Test Pago - Eliminar', 'selenium notificación para eliminar', NOW(), NULL, 'Low', 'PAYMENT_CONFIRMATION'),
  (3, 'Selenium Test Pago - editar', 'selenium notificación para editar', NOW(), NULL, 'Low', 'PAYMENT_CONFIRMATION');

-- Usuario admin
INSERT INTO `user` (
  `id_document`, `name`, `email`, `password`, `nationality`, `role`, `image_path`
) VALUES (
  '101110111', 'Juan Perez', 'juan@gmail.com', '$2b$10$hi6UGcq7gPKBUpAs/aT/gOwWA1bDqOBUzAZcb.9XY55fo2hn9GyFK', 'Costa Rica', 'admin', '101110111-1761621993812.jpg'
);

-- Viaje de prueba
INSERT INTO `trip` (
    `id_trip`, `origin`, `destination`, `price`, `start_date`, `final_date`, `people_count`, `description`, `image`
) VALUES 
(2, 'San José', 'Puerto Viejo', 120.50, '2025-11-15 08:00:00', '2025-11-17 18:00:00', 2, 'Viaje de fin de semana a la playa caribeña con aguas cristalinas y ambiente relajado.', 'puerto_viejo.jpg'),
(3, 'Alajuela', 'La Fortuna', 200.00, '2025-11-20 09:00:00', '2025-11-22 20:00:00', 4, 'Escapada al Volcán Arenal con tour de aventura y aguas termales.', 'la_fortuna.jpg'),
(4, 'Cartago', 'Turrialba', 150.75, '2025-11-25 07:30:00', '2025-11-27 18:30:00', 3, 'Excursión a la región del café y rafting en río Pacuare.', 'turrialba.jpg'),
(5, 'Heredia', 'Monteverde', 180.00, '2025-12-01 06:00:00', '2025-12-03 19:00:00', 2, 'Viaje a los bosques nubosos con canopy y caminatas ecológicas.', 'monteverde.jpg');

-- Vehículo de prueba
INSERT INTO `vehicle` (
    `license_plate`, `brand`, `model`, `capacity`, `image`, `is_active`, `model_year`, `description`, `price_per_day`
) VALUES (
    'ABC123', 'Toyota', 'Corolla', 5, 'corolla.jpg', 1, 2020, 'Sedán cómodo y eficiente para ciudad y carretera.', 35.50
);

-- Reservación 1: CON reseña (para tests de listado)
INSERT INTO `reservation` (
  `id_reservation`,
  `id_document`,
  `id_trip`,
  `license_plate`,
  `date_reservacion`,
  `total_amount`,
  `is_active`,
  `final_date`
) VALUES (
  1,
  '703160299',
  2,               
  'ABC123',
  DATE_SUB(CURDATE(), INTERVAL 2 DAY),  
  120.50,
  0,
  DATE_SUB(CURDATE(), INTERVAL 2 DAY)
);

INSERT INTO `payment` (
  `id_payment`, `id_reservation`, `amount`, `payment_method`, `date_payment`, `transaction_code`, `currency`
) VALUES (
  1, 1, 120.50, 'CARD', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'TEST-TX-001', 'USD'
);

INSERT INTO `review` (
  `id_review`, `id_reservation`, `comment`, `rating`, `date_review`, `type`
) VALUES (
  1, 1, 'Excelente servicio, muy recomendado!', 5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Trip'
);

-- Reservación 2: SIN reseña (para test de crear reseña)
INSERT INTO `reservation` (
  `id_reservation`,
  `id_document`,
  `id_trip`,
  `license_plate`,
  `date_reservacion`,
  `total_amount`,
  `is_active`,
  `final_date`
) VALUES (
  2,
  '703160299',
  2,               
  'ABC123',
  DATE_SUB(CURDATE(), INTERVAL 1 DAY),  
  120.50,
  0,
  DATE_SUB(CURDATE(), INTERVAL 1 DAY)
);

INSERT INTO `payment` (
  `id_payment`, `id_reservation`, `amount`, `payment_method`, `date_payment`, `transaction_code`, `currency`
) VALUES (
  2, 2, 120.50, 'CARD', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'TEST-TX-002', 'USD'
);
