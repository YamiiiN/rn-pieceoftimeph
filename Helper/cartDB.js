import * as SQLite from 'expo-sqlite';

let dbInstance = null;

const getDatabase = async () => {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync('ecommerce.db');
    }
    return dbInstance;
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

        if (existing.length > 0) {
            const updateQuery = `UPDATE cart SET quantity = quantity + ?, selected = 1 
                                 WHERE user_id = ? AND product_id = ?`;
            await db.runAsync(updateQuery, [quantity, userId, product.id]);
        } else {
            const insertQuery = `INSERT INTO cart 
                (user_id, product_id, product_name, product_category, product_price, product_image, quantity, selected) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;

            await db.runAsync(insertQuery, [
                userId,
                product.id,
                product.name,
                product.category || 'Uncategorized',
                product.price,
                product.image,
                quantity
            ]);
        }

        return await getCartItems(userId);
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
        const db = await getDatabase();
        const result = await db.getAllAsync(`SELECT * FROM cart WHERE user_id = ?`, [userId]);

        const items = result.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.product_category,
            price: item.product_price,
            image: item.product_image,
            quantity: item.quantity,
            selected: item.selected === 1
        }));

        return items;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
    if (!userId) {
        console.error('No user ID provided for updating cart');
        throw new Error('User not logged in');
    }
    
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`,
            [quantity, userId, productId]
        );

        return result.changes > 0;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
};

export const removeCartItem = async (userId, productId) => {
    if (!userId) {
        console.error('No user ID provided for removing cart item');
        throw new Error('User not logged in');
    }
    
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );

        return result.changes > 0;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
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
        
        return result.changes >= 0;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};