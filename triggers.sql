CREATE TRIGGER `after_book_update_threshold` AFTER UPDATE ON `book`
 FOR EACH ROW BEGIN
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

CREATE TRIGGER `before_book_update_stock` BEFORE UPDATE ON `book`
 FOR EACH ROW BEGIN
    IF NEW.stock_quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock cannot be negative';
    END IF;
END


