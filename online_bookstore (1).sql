-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2025 at 03:03 AM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `checkout_cart` (IN `p_customer_id` INT, IN `p_card` VARCHAR(20), IN `p_expiry` VARCHAR(10))   BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_order_id INT;

    -- Get Cart and Calculate Total Price
    SELECT cart_id INTO v_cart_id FROM CART WHERE customer_id = p_customer_id LIMIT 1;
    
    SELECT SUM(b.sellingPrice * ci.Buying_quantity) INTO v_total
    FROM CART_ITEM ci JOIN BOOK b ON ci.ISBN = b.ISBN
    WHERE ci.cart_id = v_cart_id;
    
    -- Check if cart is empty
    IF v_total IS NULL OR v_total = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot checkout an empty cart.';
    END IF;

    START TRANSACTION;
        -- A. Create Order
        INSERT INTO `ORDER` (customer_id, total_amount, status) 
        VALUES (p_customer_id, v_total, 'Confirmed');
        SET v_order_id = LAST_INSERT_ID();

        -- B. Move Items to ORDER_ITEM
        INSERT INTO ORDER_ITEM (order_id, ISBN, quantity)
        SELECT v_order_id, ISBN, Buying_quantity FROM CART_ITEM WHERE cart_id = v_cart_id;

        -- C. Reduce Stock (This will trigger the BEFORE UPDATE for stock check)
        -- Note: If stock is insufficient, the BEFORE UPDATE trigger will fail the transaction here.
        UPDATE BOOK b
        JOIN CART_ITEM ci ON b.ISBN = ci.ISBN
        SET b.stock_quantity = b.stock_quantity - ci.Buying_quantity
        WHERE ci.cart_id = v_cart_id;

        -- D. Clear Cart Items
        DELETE FROM CART_ITEM WHERE cart_id = v_cart_id;
        
        -- E. (Optional) Log credit card transaction to a separate table
        -- INSERT INTO PAYMENT_LOG (order_id, card_number, expiry) VALUES (v_order_id, p_card, p_expiry);

    COMMIT;
END$$

DELIMITER ;

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
('1234567890150', 'Prisoners of Geography', 2025, 0, 60, 'Geography', 20.00, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1432827094i/25135194.jpg', 4.0, 50),
('1234567890155', 'The War for Middle-earth', 2025, 47, 19, 'Religion', 20.00, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1757720874i/210137478.jpg', 4.0, 50),
('9780316055437', 'The Goldfinch', 2013, 59, 20, 'Art', 35.99, 3, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1378710146i/17333223.jpg', 4.4, 11234),
('9780465050659', 'The Design of Everyday Things', 1988, 100, 18, 'Art', 26.99, 2, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1442460745i/840.jpg', 5.0, 6543),
('9780553052893', 'Family of Spies', 1988, 55, 10, 'History', 24.99, 2, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1750966099i/222376793.jpg', 5.0, 1131),
('9780553380163', 'A Brief History of Time', 1988, 142, 20, 'Science', 24.99, 2, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg', 4.7, 15234),
('9780593448168', 'Your Brain on Art: How the Arts Transform Us', 2023, 59, 12, 'Art', 32.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1661865041i/61358662.jpg', 3.9, 4155),
('9780593653210', 'Gemini', 2024, 65, 12, 'History', 31.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1745876622i/222376666.jpg', 4.5, 249),
('9780735213616', 'Breath: The New Science Of A Lost Art', 2020, 70, 12, 'Science', 27.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1575339793i/48890486.jpg', 4.8, 10234),
('9781501144318', 'Why We Sleep: Unlocking the Power of Sleep and Dreams', 2017, 178, 15, 'Science', 28.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1556604137i/34466963.jpg', 4.4, 223839),
('9781524714215', 'The Anthropocene Reviewed', 2021, 68, 15, 'History', 29.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1616514130i/55145261.jpg', 4.9, 172192),
('9781590302255', 'The Art of War', 2005, 98, 20, 'History', 19.99, 2, 'https://m.media-amazon.com/images/I/61lBRY5h+NL._SY466_.jpg', 5.0, 565710),
('9781594634727', 'Big Magic: Creative Living Beyond Fear', 2015, 74, 15, 'Art', 28.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1451446242i/24453082.jpg', 4.0, 233008),
('9781984868930', 'Dopamine Nation: Finding Balance in the Age of Indulgence', 2021, 105, 15, 'Science', 29.99, 1, 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1629679336i/55723020.jpg', 4.9, 81559);

--
-- Triggers `book`
--
DELIMITER $$
CREATE TRIGGER `after_book_update_threshold` AFTER UPDATE ON `book` FOR EACH ROW BEGIN
    -- Check if stock crossed below the threshold
    IF OLD.stock_quantity >= OLD.threshold AND NEW.stock_quantity < NEW.threshold THEN
        -- Only insert if there is no pending order for this book and publisher
        IF NOT EXISTS (
            SELECT 1
            FROM ORDER_PUB op
            JOIN ORDER_PUB_ITEM opi ON op.order_pub_id = opi.order_pub_id
            WHERE op.publisher_id = NEW.Publisher_id
              AND opi.ISBN = NEW.ISBN
              AND op.status = 'Pending'
        ) THEN
            INSERT INTO ORDER_PUB (admin_id, publisher_id, status, constant_quantity)
            VALUES (1, NEW.Publisher_id, 'Pending', 50);

            INSERT INTO ORDER_PUB_ITEM (order_pub_id, ISBN, quantity)
            VALUES (LAST_INSERT_ID(), NEW.ISBN, 50);
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_book_update_stock` BEFORE UPDATE ON `book` FOR EACH ROW BEGIN
    IF NEW.stock_quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock cannot be negative';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_auto_order_from_publisher` AFTER UPDATE ON `book` FOR EACH ROW BEGIN
    DECLARE v_order_pub_id INT;
    DECLARE v_constant_qty INT DEFAULT 50;
    
    IF OLD.stock_quantity >= OLD.threshold 
       AND NEW.stock_quantity < NEW.threshold 
       AND NEW.Publisher_id IS NOT NULL THEN
        
        INSERT INTO order_pub (admin_id, publisher_id, order_date, status, constant_quantity)
        VALUES (4, NEW.Publisher_id, NOW(), 'Pending', v_constant_qty);
        
        SET v_order_pub_id = LAST_INSERT_ID();
        
        INSERT INTO order_pub_item (order_pub_id, ISBN, quantity)
        VALUES (v_order_pub_id, NEW.ISBN, v_constant_qty);
        
    END IF;
END
$$
DELIMITER ;

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
('1234567890150', 11),
('1234567890155', 11),
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
(6, 6),
(13, 7);

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

INSERT INTO `cart_item` (`cart_id`, `ISBN`, `Buying_quantity`) VALUES
(13, '1234567890150', 1);

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
(7, 'nadine', 'mohamed', 'nn@g.com', '01224830037', 'Alexandria,egypt', '$2b$10$06cfBjiLbbnvJ1UC9Pzx6ueacXEEEd8EvkJRBvHDHx35hKGjJ8CM6', NULL);

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
(28, 7, '2025-11-27 00:56:53', 49.17, 'Paid'),
(29, 7, '2025-12-27 01:00:12', 126.32, 'Paid'),
(30, 7, '2025-12-27 01:20:14', 37.30, 'Paid'),
(31, 7, '2025-12-27 03:40:23', 59.38, 'Paid'),
(32, 7, '2025-12-27 03:48:02', 44.86, 'Paid'),
(33, 7, '2025-12-27 03:50:07', 27.59, 'Paid');

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

INSERT INTO `order_item` (`order_id`, `ISBN`, `quantity`) VALUES
(28, '9781590302255', 2),
(29, '9780553380163', 1),
(29, '9780593448168', 1),
(29, '9781524714215', 1),
(29, '9781594634727', 1),
(30, '9781501144318', 1),
(31, '9780553380163', 1),
(31, '9781524714215', 1),
(32, '9780316055437', 1),
(33, '1234567890150', 1);

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
(46, 4, 3, '2025-12-27 02:51:06', 'Received', 50),
(47, 4, 3, '2025-12-27 02:51:06', 'Received', 50),
(48, 4, 3, '2025-12-27 02:54:57', 'Received', 50),
(49, 4, 1, '2025-12-27 03:34:16', 'Received', 50),
(50, 4, 3, '2025-12-27 03:35:26', 'Received', 50),
(51, 4, 1, '2025-12-27 03:49:27', 'Pending', 50);

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

INSERT INTO `order_pub_item` (`order_pub_id`, `ISBN`, `quantity`) VALUES
(46, '9780316055437', 50),
(47, '9780316055437', 50),
(48, '9780316055437', 50),
(49, '1234567890150', 50),
(50, '9780316055437', 50),
(51, '1234567890150', 50);

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
  ADD KEY `publisher_id` (`publisher_id`),
  ADD KEY `order_pub_ibfk_1` (`admin_id`);

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `order_pub`
--
ALTER TABLE `order_pub`
  MODIFY `order_pub_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

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
  ADD CONSTRAINT `order_pub_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
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
