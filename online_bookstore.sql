-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2025 at 04:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `firstname`, `lastname`, `email`, `phone_no`, `password`, `avatar`) VALUES
(4, 'nadine', 'mohamed', 'nn@g.com', NULL, '$2b$10$BCas22M2KDu53z5cpaw7wOzKU/wN6RDpfKcga8PJ/M69KnLP6H4Su', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

CREATE TABLE `author` (
  `author_id` int(11) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL COMMENT 'Author profile picture URL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `author`
--

INSERT INTO `author` (`author_id`, `author_name`, `avatar`) VALUES
(11, 'Matthew Walker', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROKriFwxzwyMQw88NT-lV8K6lmZ0M1ao4j7pqLz12fcNJnCx34TdNksT5nr1fTXPSvGuk_5VpSon0fIqVq0DcIlsQRYq-J4oRQ9bwDY7aC_Q&s=10'),
(12, 'Stephen Hawking', 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg'),
(13, 'James Nestor', 'https://csq.com/wp-content/uploads/2020/08/DC2B992F-68BA-4935-BCE2-61D8C0005F3A_1_201_a-e1597858303720-450x450.jpeg'),
(14, 'Anna Lembke', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nytimes.com%2F2025%2F02%2F01%2Fmagazine%2Fanna-lembke-interview.html&psig=AOvVaw2pV19d6A0PWojxUZPXxgGs&ust=1766256724501000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJiRnpipypEDFQAAAAAdAAAAABAE'),
(15, 'Susan Magsamen', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.artsandmindlab.org%2Fpeople%2Fsusan-magsamen%2F&psig=AOvVaw3oDdIlxmJm7muH7yXsXv4w&ust=1766256775986000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLDE766pypEDFQAAAAAdAAAAABAZ'),
(16, 'Ivy Ross', 'https://www.artsandmindlab.org/wp-content/uploads/2017/12/Ivy_Ross.png'),
(17, 'Don Norman', 'https://www.scad.edu/sites/default/files/styles/swarm1x1_258/public/media/Events/SCADstyle/2014/Don-Norman_headshot_1000.jpg?itok=ksKmpAPf&timestamp=1394739492'),
(18, 'Elizabeth Gilbert', 'https://womensprize.com/app/uploads/2024/02/Elizabeth-Gilbert-1-683x1024.jpeg'),
(19, 'Donna Tartt', 'https://thequeensreadingroom.co.uk/wp-content/uploads/2023/10/Donna-Tartt-800x800-c-default.webp'),
(20, 'John Green', 'https://bookmovement.com/bestbooksindex/wp-content/uploads/2018/01/JOHN-HEADSHOT-BW-1-Aug-2_1200x800.png'),
(21, 'Pete Earley', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Frfkhumanrights.org%2Fperson%2Fpete-earley%2F&psig=AOvVaw0_P1KNnNhzyVcCNVLGXcZs&ust=1766257103388000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIj6s82qypEDFQAAAAAdAAAAABAE'),
(22, 'Jeffery Kluger', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dinnerpartydownload.org%2Fnarcissism%2Findex.html&psig=AOvVaw0HYJ4n4FnXFb8uoFd6EYcU&ust=1766257316281000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDl-LGrypEDFQAAAAAdAAAAABAE'),
(23, 'Sun Tzu', '');

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
  `Publisher_id` int(11) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`ISBN`, `Title`, `Publication_year`, `stock_quantity`, `threshold`, `Category`, `sellingPrice`, `Publisher_id`, `avatar`, `rating`, `rating_count`) VALUES
('9780316055437', 'The Goldfinch', 2013, 90, 20, 'Art', 35.99, 3, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1378710146i/17333223.jpg', 4.4, 11234),
('9780465050659', 'The Design of Everyday Things', 1988, 85, 18, 'Art', 26.99, 2, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1442460745i/840.jpg', 5.0, 6543),
('9780553052893', 'Family of Spies', 1988, 55, 10, 'History', 24.99, 2, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1750966099i/222376793.jpg', 5.0, 1131),
('9780553380163', 'A Brief History of Time', 1988, 95, 20, 'Science', 24.99, 2, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg', 4.7, 15234),
('9780593448168', 'Your Brain on Art: How the Arts Transform Us', 2023, 60, 12, 'Art', 32.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1661865041i/61358662.jpg', 3.9, 4155),
('9780593653210', 'Gemini', 2024, 65, 12, 'History', 31.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1745876622i/222376666.jpg', 4.5, 249),
('9780735213616', 'Breath: The New Science Of A Lost Art', 2020, 70, 12, 'Science', 27.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1575339793i/48890486.jpg', 4.8, 10234),
('9781501144318', 'Why We Sleep: Unlocking the Power of Sleep and Dreams', 2017, 80, 15, 'Science', 28.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1556604137i/34466963.jpg', 4.4, 223839),
('9781524714215', 'The Anthropocene Reviewed', 2021, 70, 15, 'History', 29.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1616514130i/55145261.jpg', 4.9, 172192),
('9781590302255', 'The Art of War', 2005, 100, 20, 'History', 19.99, 2, 'https://m.media-amazon.com/images/I/61lBRY5h+NL._SY466_.jpg', 5.0, 565710),
('9781594634727', 'Big Magic: Creative Living Beyond Fear', 2015, 75, 15, 'Art', 28.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1451446242i/24453082.jpg', 4.0, 233008),
('9781984868930', 'Dopamine Nation: Finding Balance in the Age of Indulgence', 2021, 65, 15, 'Science', 29.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1629679336i/55723020.jpg', 4.9, 81559);

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

INSERT INTO `book_author` (`ISBN`, `author_id`) VALUES
('9780316055437', 19),
('9780465050659', 17),
('9780553052893', 21),
('9780553380163', 12),
('9780593448168', 15),
('9780593448168', 16),
('9780593653210', 22),
('9780735213616', 13),
('9781501144318', 11),
('9781524714215', 20),
('9781590302255', 23),
('9781594634727', 18),
('9781984868930', 14);

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

INSERT INTO `cart` (`cart_id`, `customer_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `cart_id` int(11) NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `Buying_quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `firstname`, `lastname`, `email`, `phone_no`, `shipping_address`, `password`, `avatar`) VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', '123 Main St, Boston, MA 02101', 'hashed_password_1', 'https://i.pravatar.cc/150?img=33'),
(2, 'Emma', 'Johnson', 'emma.j@email.com', '+1-555-0102', '456 Oak Ave, Seattle, WA 98101', 'hashed_password_2', 'https://i.pravatar.cc/150?img=10'),
(3, 'Michael', 'Williams', 'michael.w@email.com', '+1-555-0103', '789 Pine Rd, Austin, TX 78701', 'hashed_password_3', 'https://i.pravatar.cc/150?img=15'),
(4, 'Sarah', 'Brown', 'sarah.b@email.com', '+1-555-0104', '321 Elm St, Chicago, IL 60601', 'hashed_password_4', 'https://i.pravatar.cc/150?img=20'),
(5, 'David', 'Davis', 'david.d@email.com', '+1-555-0105', '654 Maple Dr, Denver, CO 80201', 'hashed_password_5', 'https://i.pravatar.cc/150?img=51'),
(6, 'John', 'Doe', 'test@example.com', '+1-555-1234', '123 Test St, City, State', '$2b$10$i/KxNPTnnIFPEu7YDqinZujSOJGxhGey2YmmPTgJMpfKjfzgpgqWa', NULL),
(7, 'nadine', 'mohamed', 'nn@g.com', NULL, NULL, '$2b$10$06cfBjiLbbnvJ1UC9Pzx6ueacXEEEd8EvkJRBvHDHx35hKGjJ8CM6', NULL);

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

INSERT INTO `order` (`order_id`, `customer_id`, `order_date`, `total_amount`, `status`) VALUES
(1, 1, '2024-11-15 10:30:00', 94.97, 'Delivered'),
(2, 2, '2024-11-20 14:15:00', 52.98, 'Shipped'),
(3, 3, '2024-12-01 09:45:00', 87.96, 'Processing'),
(4, 4, '2024-12-05 16:20:00', 30.99, 'Pending'),
(5, 1, '2024-12-10 11:00:00', 64.98, 'Processing');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `order_id` int(11) NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

INSERT INTO `order_pub` (`order_pub_id`, `admin_id`, `publisher_id`, `order_date`, `status`, `constant_quantity`) VALUES
(1, NULL, 1, '2024-11-01 08:00:00', 'Completed', 50),
(2, NULL, 2, '2024-11-10 09:30:00', 'Completed', 75),
(3, NULL, 3, '2024-11-25 10:15:00', 'In Transit', 60),
(4, NULL, 5, '2024-12-05 14:00:00', 'Pending', 40),
(5, NULL, 2, '2024-12-12 11:30:00', 'Pending', 100);

-- --------------------------------------------------------

--
-- Table structure for table `order_pub_item`
--

CREATE TABLE `order_pub_item` (
  `order_pub_id` int(11) NOT NULL,
  `ISBN` varchar(13) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

INSERT INTO `publisher` (`Publisher_id`, `name`) VALUES
(1, 'Penguin Random House'),
(2, 'HarperCollins'),
(3, 'Simon & Schuster'),
(4, 'Hachette Book Group'),
(5, 'Macmillan Publishers');

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

INSERT INTO `publisher_address` (`publisher_id`, `address`) VALUES
(1, '1745 Broadway, New York, NY 10019, USA'),
(2, '195 Broadway, New York, NY 10007, USA'),
(3, '1230 Avenue of the Americas, New York, NY 10020, USA'),
(4, '1290 Avenue of the Americas, New York, NY 10104, USA'),
(5, '120 Broadway, New York, NY 10271, USA');

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

INSERT INTO `publisher_phone` (`Publisher_id`, `phone_no`) VALUES
(1, '+1-212-366-2000'),
(1, '+1-212-366-2001'),
(2, '+1-212-207-7000'),
(3, '+1-212-698-7000'),
(4, '+1-212-364-1100'),
(5, '+1-646-307-5151');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

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
  ADD KEY `Publisher_id` (`Publisher_id`);

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
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

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
  ADD KEY `publisher_id` (`publisher_id`);

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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `author`
--
ALTER TABLE `author`
  MODIFY `author_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
