-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: teresarides
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `invoice_number` int NOT NULL AUTO_INCREMENT,
  `id_payment` int NOT NULL,
  `date_emision` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `detail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`invoice_number`),
  KEY `id_payment` (`id_payment`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`id_payment`) REFERENCES `payment` (`id_payment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id_notification` int NOT NULL AUTO_INCREMENT,
  `email_subject` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `shipping_date` datetime NOT NULL,
  `attachment_path` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Low',
  `type` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PAYMENT_CONFIRMATION',
  PRIMARY KEY (`id_notification`),
  CONSTRAINT `notification_chk_1` CHECK ((`priority` in (_utf8mb4'High',_utf8mb4'Low')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id_payment` int NOT NULL AUTO_INCREMENT,
  `id_reservation` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `date_payment` date NOT NULL,
  `transaction_code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `currency` char(3) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'USD',
  PRIMARY KEY (`id_payment`),
  KEY `id_reservation` (`id_reservation`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id_reservation`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `id_document` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_trip` int DEFAULT NULL,
  `license_plate` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_reservacion` date NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `final_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `id_document` (`id_document`),
  KEY `id_trip` (`id_trip`),
  KEY `license_plate` (`license_plate`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_document`) REFERENCES `user` (`id_document`) ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`id_trip`) REFERENCES `trip` (`id_trip`) ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`license_plate`) REFERENCES `vehicle` (`license_plate`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id_review` int NOT NULL AUTO_INCREMENT,
  `id_reservation` int NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci NOT NULL,
  `rating` tinyint NOT NULL,
  `date_review` date NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Trip',
  PRIMARY KEY (`id_review`),
  KEY `id_reservation` (`id_reservation`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id_reservation`),
  CONSTRAINT `review_chk_1` CHECK ((`type` in (_utf8mb4'Trip',_utf8mb4'Vehicle')))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trip`
--

DROP TABLE IF EXISTS `trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip` (
  `id_trip` int NOT NULL AUTO_INCREMENT,
  `origin` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `destination` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `start_date` datetime NOT NULL,
  `final_date` datetime NOT NULL,
  `people_count` tinyint NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_trip`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_document` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nationality` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_document`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_notification`
--

DROP TABLE IF EXISTS `user_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_notification` (
  `id_document` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_notification` int NOT NULL,
  `type` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PAYMENT_CONFIRMATION',
  PRIMARY KEY (`id_document`,`id_notification`),
  KEY `id_notification` (`id_notification`),
  CONSTRAINT `user_notification_ibfk_1` FOREIGN KEY (`id_document`) REFERENCES `user` (`id_document`) ON DELETE CASCADE,
  CONSTRAINT `user_notification_ibfk_2` FOREIGN KEY (`id_notification`) REFERENCES `notification` (`id_notification`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `license_plate` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `brand` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `capacity` tinyint NOT NULL,
  `image` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `model_year` smallint NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  PRIMARY KEY (`license_plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16  3:13:23
