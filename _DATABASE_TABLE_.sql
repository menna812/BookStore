-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2025 at 03:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_bookstore`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` VALUES(1, 'Alice', 'Anderson', 'alice.admin@bookstore.com', '+1-555-1001', 'admin_password_1');
INSERT INTO `admin` VALUES(2, 'Bob', 'Roberts', 'bob.admin@bookstore.com', '+1-555-1002', 'admin_password_2');
INSERT INTO `admin` VALUES(3, 'Carol', 'Martinez', 'carol.admin@bookstore.com', '+1-555-1003', 'admin_password_3');

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

CREATE TABLE `author` (
  `author_id` int(11) NOT NULL,
  `author_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `author`
--

INSERT INTO `author` VALUES(1, 'J.K. Rowling');
INSERT INTO `author` VALUES(2, 'George R.R. Martin');
INSERT INTO `author` VALUES(3, 'Stephen King');
INSERT INTO `author` VALUES(4, 'Agatha Christie');
INSERT INTO `author` VALUES(5, 'Dan Brown');
INSERT INTO `author` VALUES(6, 'Margaret Atwood');
INSERT INTO `author` VALUES(7, 'Neil Gaiman');
INSERT INTO `author` VALUES(8, 'Isaac Asimov');
INSERT INTO `author` VALUES(9, 'Terry Pratchett');
INSERT INTO `author` VALUES(10, 'Brandon Sanderson');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `ISBN` varchar(20) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Publication_year` int(11) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `threshold` int(11) DEFAULT 0,
  `Category` varchar(100) DEFAULT NULL,
  `sellingPrice` decimal(10,2) DEFAULT NULL,
  `Publisher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` VALUES('9780060853983', 'American Gods', 2001, 90, 15, 'Fantasy', 30.99, 2);
INSERT INTO `book` VALUES('9780062073488', 'Murder on the Orient Express', 1934, 95, 20, 'Mystery', 24.99, 2);
INSERT INTO `book` VALUES('9780062225672', 'Good Omens', 1990, 80, 12, 'Fantasy', 29.99, 2);
INSERT INTO `book` VALUES('9780307474278', 'The Da Vinci Code', 2003, 110, 15, 'Thriller', 32.99, 1);
INSERT INTO `book` VALUES('9780385490818', 'The Handmaid\'s Tale', 1985, 75, 10, 'Fiction', 28.99, 1);
INSERT INTO `book` VALUES('9780439708180', 'Harry Potter and the Sorcerer\'s Stone', 1997, 150, 20, 'Fantasy', 29.99, 1);
INSERT INTO `book` VALUES('9780553103540', 'A Game of Thrones', 1996, 85, 15, 'Fantasy', 34.99, 2);
INSERT INTO `book` VALUES('9780553293357', 'Foundation', 1951, 65, 10, 'Science Fiction', 26.99, 2);
INSERT INTO `book` VALUES('9780553380958', 'A Clash of Kings', 1998, 70, 15, 'Fantasy', 34.99, 2);
INSERT INTO `book` VALUES('9780765326355', 'The Way of Kings', 2010, 100, 18, 'Fantasy', 35.99, 5);
INSERT INTO `book` VALUES('9781501142970', 'The Shining', 1977, 120, 25, 'Horror', 27.99, 3);
INSERT INTO `book` VALUES('9781982127794', 'The Institute', 2019, 55, 10, 'Horror', 31.99, 3);

-- --------------------------------------------------------

--
-- Table structure for table `book_author`
--

CREATE TABLE `book_author` (
  `ISBN` varchar(13) NOT NULL,
  `author_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_author`
--

INSERT INTO `book_author` VALUES('9780060853983', 7);
INSERT INTO `book_author` VALUES('9780062073488', 4);
INSERT INTO `book_author` VALUES('9780062225672', 7);
INSERT INTO `book_author` VALUES('9780062225672', 9);
INSERT INTO `book_author` VALUES('9780307474278', 5);
INSERT INTO `book_author` VALUES('9780385490818', 6);
INSERT INTO `book_author` VALUES('9780439708180', 1);
INSERT INTO `book_author` VALUES('9780553103540', 2);
INSERT INTO `book_author` VALUES('9780553293357', 8);
INSERT INTO `book_author` VALUES('9780553380958', 2);
INSERT INTO `book_author` VALUES('9780765326355', 10);
INSERT INTO `book_author` VALUES('9781501142970', 3);
INSERT INTO `book_author` VALUES('9781982127794', 3);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` VALUES(1, 1);
INSERT INTO `cart` VALUES(2, 2);
INSERT INTO `cart` VALUES(3, 3);
INSERT INTO `cart` VALUES(4, 4);
INSERT INTO `cart` VALUES(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `cart_id` int(11) NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `Buying_quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_item`
--

INSERT INTO `cart_item` VALUES(1, '9780439708180', 2);
INSERT INTO `cart_item` VALUES(1, '9780553103540', 1);
INSERT INTO `cart_item` VALUES(2, '9780062073488', 3);
INSERT INTO `cart_item` VALUES(2, '9781501142970', 1);
INSERT INTO `cart_item` VALUES(3, '9780307474278', 1);
INSERT INTO `cart_item` VALUES(4, '9780060853983', 1);
INSERT INTO `cart_item` VALUES(4, '9780385490818', 2);
INSERT INTO `cart_item` VALUES(5, '9780765326355', 1);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `shipping_address` varchar(500) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` VALUES(1, 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', '123 Main St, Boston, MA 02101', 'hashed_password_1');
INSERT INTO `customer` VALUES(2, 'Emma', 'Johnson', 'emma.j@email.com', '+1-555-0102', '456 Oak Ave, Seattle, WA 98101', 'hashed_password_2');
INSERT INTO `customer` VALUES(3, 'Michael', 'Williams', 'michael.w@email.com', '+1-555-0103', '789 Pine Rd, Austin, TX 78701', 'hashed_password_3');
INSERT INTO `customer` VALUES(4, 'Sarah', 'Brown', 'sarah.b@email.com', '+1-555-0104', '321 Elm St, Chicago, IL 60601', 'hashed_password_4');
INSERT INTO `customer` VALUES(5, 'David', 'Davis', 'david.d@email.com', '+1-555-0105', '654 Maple Dr, Denver, CO 80201', 'hashed_password_5');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` VALUES(1, 1, '2024-11-15 10:30:00', 94.97, 'Delivered');
INSERT INTO `order` VALUES(2, 2, '2024-11-20 14:15:00', 52.98, 'Shipped');
INSERT INTO `order` VALUES(3, 3, '2024-12-01 09:45:00', 87.96, 'Processing');
INSERT INTO `order` VALUES(4, 4, '2024-12-05 16:20:00', 30.99, 'Pending');
INSERT INTO `order` VALUES(5, 1, '2024-12-10 11:00:00', 64.98, 'Processing');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `order_id` int(11) NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` VALUES(1, '9780439708180', 2);
INSERT INTO `order_item` VALUES(1, '9780553103540', 1);
INSERT INTO `order_item` VALUES(2, '9780062073488', 1);
INSERT INTO `order_item` VALUES(2, '9781501142970', 1);
INSERT INTO `order_item` VALUES(3, '9780307474278', 1);
INSERT INTO `order_item` VALUES(3, '9780385490818', 2);
INSERT INTO `order_item` VALUES(4, '9780060853983', 1);
INSERT INTO `order_item` VALUES(5, '9780553380958', 1);
INSERT INTO `order_item` VALUES(5, '9781982127794', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_pub`
--

CREATE TABLE `order_pub` (
  `order_pub_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `publisher_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'Pending',
  `constant_quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_pub`
--

INSERT INTO `order_pub` VALUES(1, 1, 1, '2024-11-01 08:00:00', 'Completed', 50);
INSERT INTO `order_pub` VALUES(2, 1, 2, '2024-11-10 09:30:00', 'Completed', 75);
INSERT INTO `order_pub` VALUES(3, 2, 3, '2024-11-25 10:15:00', 'In Transit', 60);
INSERT INTO `order_pub` VALUES(4, 3, 5, '2024-12-05 14:00:00', 'Pending', 40);
INSERT INTO `order_pub` VALUES(5, 1, 2, '2024-12-12 11:30:00', 'Pending', 100);

-- --------------------------------------------------------

--
-- Table structure for table `order_pub_item`
--

CREATE TABLE `order_pub_item` (
  `order_pub_id` int(11) NOT NULL,
  `ISBN` varchar(13) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_pub_item`
--

INSERT INTO `order_pub_item` VALUES(1, '9780307474278', 50);
INSERT INTO `order_pub_item` VALUES(1, '9780385490818', 50);
INSERT INTO `order_pub_item` VALUES(1, '9780439708180', 50);
INSERT INTO `order_pub_item` VALUES(2, '9780060853983', 75);
INSERT INTO `order_pub_item` VALUES(2, '9780062073488', 75);
INSERT INTO `order_pub_item` VALUES(2, '9780062225672', 75);
INSERT INTO `order_pub_item` VALUES(2, '9780553103540', 75);
INSERT INTO `order_pub_item` VALUES(2, '9780553380958', 75);
INSERT INTO `order_pub_item` VALUES(3, '9781501142970', 60);
INSERT INTO `order_pub_item` VALUES(3, '9781982127794', 60);
INSERT INTO `order_pub_item` VALUES(4, '9780765326355', 40);
INSERT INTO `order_pub_item` VALUES(5, '9780553293357', 100);

-- --------------------------------------------------------

--
-- Table structure for table `publisher`
--

CREATE TABLE `publisher` (
  `Publisher_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publisher`
--

INSERT INTO `publisher` VALUES(1, 'Penguin Random House');
INSERT INTO `publisher` VALUES(2, 'HarperCollins');
INSERT INTO `publisher` VALUES(3, 'Simon & Schuster');
INSERT INTO `publisher` VALUES(4, 'Hachette Book Group');
INSERT INTO `publisher` VALUES(5, 'Macmillan Publishers');

-- --------------------------------------------------------

--
-- Table structure for table `publisher_address`
--

CREATE TABLE `publisher_address` (
  `publisher_id` int(11) NOT NULL,
  `address` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publisher_address`
--

INSERT INTO `publisher_address` VALUES(1, '1745 Broadway, New York, NY 10019, USA');
INSERT INTO `publisher_address` VALUES(2, '195 Broadway, New York, NY 10007, USA');
INSERT INTO `publisher_address` VALUES(3, '1230 Avenue of the Americas, New York, NY 10020, USA');
INSERT INTO `publisher_address` VALUES(4, '1290 Avenue of the Americas, New York, NY 10104, USA');
INSERT INTO `publisher_address` VALUES(5, '120 Broadway, New York, NY 10271, USA');

-- --------------------------------------------------------

--
-- Table structure for table `publisher_phone`
--

CREATE TABLE `publisher_phone` (
  `Publisher_id` int(11) NOT NULL,
  `phone_no` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publisher_phone`
--

INSERT INTO `publisher_phone` VALUES(1, '+1-212-366-2000');
INSERT INTO `publisher_phone` VALUES(1, '+1-212-366-2001');
INSERT INTO `publisher_phone` VALUES(2, '+1-212-207-7000');
INSERT INTO `publisher_phone` VALUES(3, '+1-212-698-7000');
INSERT INTO `publisher_phone` VALUES(4, '+1-212-364-1100');
INSERT INTO `publisher_phone` VALUES(5, '+1-646-307-5151');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_admin_email` (`email`);

--
-- Indexes for table `author`
--
ALTER TABLE `author`
  ADD PRIMARY KEY (`author_id`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`ISBN`),
  ADD KEY `idx_book_category` (`Category`),
  ADD KEY `idx_book_publisher` (`Publisher_id`);

--
-- Indexes for table `book_author`
--
ALTER TABLE `book_author`
  ADD PRIMARY KEY (`ISBN`,`author_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`cart_id`,`ISBN`),
  ADD KEY `ISBN` (`ISBN`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_customer_email` (`email`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_order_customer` (`customer_id`),
  ADD KEY `idx_order_date` (`order_date`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`order_id`,`ISBN`),
  ADD KEY `ISBN` (`ISBN`);

--
-- Indexes for table `order_pub`
--
ALTER TABLE `order_pub`
  ADD PRIMARY KEY (`order_pub_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `idx_order_pub_publisher` (`publisher_id`);

--
-- Indexes for table `order_pub_item`
--
ALTER TABLE `order_pub_item`
  ADD PRIMARY KEY (`order_pub_id`,`ISBN`),
  ADD KEY `ISBN` (`ISBN`);

--
-- Indexes for table `publisher`
--
ALTER TABLE `publisher`
  ADD PRIMARY KEY (`Publisher_id`);

--
-- Indexes for table `publisher_address`
--
ALTER TABLE `publisher_address`
  ADD PRIMARY KEY (`publisher_id`,`address`);

--
-- Indexes for table `publisher_phone`
--
ALTER TABLE `publisher_phone`
  ADD PRIMARY KEY (`Publisher_id`,`phone_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `author`
--
ALTER TABLE `author`
  MODIFY `author_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_pub`
--
ALTER TABLE `order_pub`
  MODIFY `order_pub_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `publisher`
--
ALTER TABLE `publisher`
  MODIFY `Publisher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`Publisher_id`) REFERENCES `publisher` (`Publisher_id`) ON DELETE SET NULL;

--
-- Constraints for table `book_author`
--
ALTER TABLE `book_author`
  ADD CONSTRAINT `book_author_ibfk_1` FOREIGN KEY (`ISBN`) REFERENCES `book` (`ISBN`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_author_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `author` (`author_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`ISBN`) REFERENCES `book` (`ISBN`) ON DELETE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE SET NULL;

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`ISBN`) REFERENCES `book` (`ISBN`) ON DELETE CASCADE;

--
-- Constraints for table `order_pub`
--
ALTER TABLE `order_pub`
  ADD CONSTRAINT `order_pub_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_pub_ibfk_2` FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`Publisher_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_pub_item`
--
ALTER TABLE `order_pub_item`
  ADD CONSTRAINT `order_pub_item_ibfk_1` FOREIGN KEY (`order_pub_id`) REFERENCES `order_pub` (`order_pub_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_pub_item_ibfk_2` FOREIGN KEY (`ISBN`) REFERENCES `book` (`ISBN`) ON DELETE CASCADE;

--
-- Constraints for table `publisher_address`
--
ALTER TABLE `publisher_address`
  ADD CONSTRAINT `publisher_address_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`Publisher_id`) ON DELETE CASCADE;

--
-- Constraints for table `publisher_phone`
--
ALTER TABLE `publisher_phone`
  ADD CONSTRAINT `publisher_phone_ibfk_1` FOREIGN KEY (`Publisher_id`) REFERENCES `publisher` (`Publisher_id`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
