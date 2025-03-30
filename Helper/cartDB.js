import * as SQLite from 'expo-sqlite';

const getDatabase = async () => {
    return await SQLite.openDatabaseAsync('ecommerce.db');
};

export const initDatabase = async () => {
    try {
        const db = await getDatabase();
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id TEXT, 
        product_id TEXT, 
        product_name TEXT, 
        product_category TEXT, 
        product_price REAL, 
        product_image TEXT, 
        quantity INTEGER, 
        selected INTEGER DEFAULT 1, 
        UNIQUE(user_id, product_id)
      )
    `);
        // console.log('Cart table created or already exists');
    } catch (error) {
        console.error('Error creating cart table:', error);
        throw error;
    }
};

export const addToCartDB = async (userId, product, quantity) => {
    if (!userId) {
        console.error('No user ID provided for cart operation');
        throw new Error('User not logged in');
    }

    try {
        const db = await getDatabase();

        const existing = await db.getAllAsync(
            `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
            [userId, product.id]
        );

        // console.log('Existing item check:', existing);

        if (existing.length > 0) {
            const updateQuery = `UPDATE cart SET quantity = quantity + ?, selected = 1 
                                 WHERE user_id = ? AND product_id = ?`;
            await db.runAsync(updateQuery, [quantity, userId, product.id]);

            // console.log('Updated quantity in cart:', {
            //     userId,
            //     productId: product.id,
            //     quantity
            // });
        } else {

            const insertQuery = `INSERT INTO cart 
                (user_id, product_id, product_name, product_category, product_price, product_image, quantity, selected) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;

            // console.log('Inserting with values:', {
            //     userId,
            //     productId: product.id,
            //     name: product.name,
            //     category: product.category || 'Uncategorized',
            //     price: product.price,
            //     image: product.image,
            //     quantity
            // });

            await db.runAsync(insertQuery, [
                userId,
                product.id,
                product.name,
                product.category || 'Uncategorized',
                product.price,
                product.image,
                quantity
            ]);

            // console.log('Inserted new item into cart.');
        }

        const afterInsert = await db.getAllAsync(
            `SELECT * FROM cart WHERE user_id = ?`,
            [userId]
        );

        console.log('After insert verification:', afterInsert);

        return afterInsert;
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
};
export const getCartItems = async (userId) => {
    if (!userId) {
        console.error('No user ID provided for fetching cart');
        throw new Error('User not logged in');
    }

    try {
        // console.log('Getting cart items for userId:', userId);
        const db = await getDatabase();

        const countResult = await db.getAllAsync(
            `SELECT COUNT(*) as count FROM cart WHERE user_id = ?`,
            [userId]
        );
        // console.log('Count result:', countResult);

        const result = await db.getAllAsync(`SELECT * FROM cart WHERE user_id = ?`, [userId]);
        // console.log('Raw query result:', result);

        const items = result.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.product_category,
            price: item.product_price,
            image: item.product_image,
            quantity: item.quantity,
            selected: item.selected === 1
        }));

        // console.log('Fetched cart items from SQLite:', items);
        return items;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};
export const updateCartItemQuantity = async (userId, productId, quantity) => {
    try {
        const db = await getDatabase();

        const existingItem = await db.getFirstAsync(
            `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );

        if (!existingItem) {
            console.error(`Cart item not found for userId: ${userId}, productId: ${productId}`);
            return false;
        }

        const result = await db.runAsync(
            `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`,
            [quantity, userId, productId]
        );

        // console.log(`UPDATE result:`, result);

        return result.changes > 0;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return false;
    }
};
export const removeCartItem = async (userId, productId) => {
    try {
        const db = await getDatabase();

        const existingItem = await db.getFirstAsync(
            `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );

        if (!existingItem) {
            console.warn(`Cart item not found for userId: ${userId}, productId: ${productId}`);
            return false;
        }

        const result = await db.runAsync(
            `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );

        console.log(`DELETE result:`, result);

        if (result.changes === 0) {
            console.warn('Delete operation did not remove any rows. Item may not exist.');
            return false;
        }

        console.log('Item successfully removed from SQLite cart:', { userId, productId });
        return true;
    } catch (error) {
        console.error('Error removing cart item:', error);
        return false;
    }
};
export const toggleCartItemSelection = async (userId, productId, selected) => {
    if (!userId) {
        console.error('No user ID provided for toggling cart item selection');
        throw new Error('User not logged in');
    }

    try {
        const selectedValue = selected ? 1 : 0;
        const db = await getDatabase();
        
        const result = await db.runAsync(
            `UPDATE cart SET selected = ? WHERE user_id = ? AND product_id = ?`,
            [selectedValue, userId, productId]
        );
        
        // console.log('Toggled selection in SQLite cart:', { 
        //     userId, 
        //     productId, 
        //     selected: selectedValue,
        //     changes: result.changes 
        // });
        
        return result.changes > 0;
    } catch (error) {
        console.error('Error toggling cart item selection:', error);
        throw error;
    }
};

export const getSelectedCartItems = async (userId) => {
    if (!userId) {
        console.error('No user ID provided for fetching selected cart items');
        throw new Error('User not logged in');
    }

    try {
        const db = await getDatabase();
        const result = await db.getAllAsync(
            `SELECT * FROM cart WHERE user_id = ? AND selected = 1`,
            [userId]
        );

        const items = result.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.product_category,
            price: item.product_price,
            image: item.product_image,
            quantity: item.quantity,
            selected: true
        }));

        // console.log('Fetched selected cart items from SQLite:', items);
        return items;
    } catch (error) {
        console.error('Error fetching selected cart items:', error);
        throw error;
    }
};

export const clearCart = async (userId) => {
    if (!userId) {
        console.error('No user ID provided for clearing cart');
        throw new Error('User not logged in');
    }

    try {
        const db = await getDatabase();
        
        const result = await db.runAsync(
            `DELETE FROM cart WHERE user_id = ?`, 
            [userId]
        );
        
        console.log('Cleared SQLite cart for user:', userId, 'Rows deleted:', result.changes);
        return result.changes > 0;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};