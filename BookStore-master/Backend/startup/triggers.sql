DELIMITER //

-- 1. Trigger: Prevent Negative Stock (Requirement 2c - Integrity)
CREATE TRIGGER before_book_update_stock
BEFORE UPDATE ON BOOK
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity < 0 THEN
        -- Throws a custom error that Node.js can catch
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock. Cannot complete transaction.';
    END IF;
END //

-- 2. Trigger: Auto-Restock Order (Requirement 3 - Automation)
CREATE TRIGGER after_book_update_threshold
AFTER UPDATE ON BOOK
FOR EACH ROW
BEGIN
    -- Check if stock crossed below the threshold
    IF OLD.stock_quantity >= OLD.threshold AND NEW.stock_quantity < NEW.threshold THEN
        -- Insert into ORDER_PUB (assuming admin_id 1 is the default ordering account)
        INSERT INTO ORDER_PUB (admin_id, publisher_id, status, constant_quantity)
        VALUES (1, NEW.Publisher_id, 'Pending', 50); -- Fixed qty 50

        -- Insert into ORDER_PUB_ITEM for the specific book
        INSERT INTO ORDER_PUB_ITEM (order_pub_id, ISBN, quantity)
        VALUES (LAST_INSERT_ID(), NEW.ISBN, 50);
    END IF;
END //

-- 3. Stored Procedure: Atomic Checkout (Requirement 4 - Transaction)
CREATE PROCEDURE checkout_cart(IN p_customer_id INT, IN p_card VARCHAR(20), IN p_expiry VARCHAR(10))
BEGIN
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
END //

DELIMITER ;