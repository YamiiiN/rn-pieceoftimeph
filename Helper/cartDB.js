import { openDatabaseAsync } from 'expo-sqlite';
// import * as SQLite from 'expo-sqlite';

let db;

// Initialize database asynchronously
export const initializeDatabase = async () => {
    try {
        db = await openDatabaseAsync('cart.db');
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                name TEXT NOT NULL,
                category TEXT,
                price REAL NOT NULL,
                image TEXT,
                quantity INTEGER NOT NULL
            );`
        );
        console.log("Cart table created successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

// Add item to cart asynchronously
export const addToCartDB = async (userId, product) => {
    try {
        await db.runAsync(
            `INSERT INTO cart (user_id, product_id, name, category, price, image, quantity) 
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [userId, product.id, product.name, product.category, product.price, product.image, product.quantity]
        );
        console.log("Item added to cart!");
    } catch (error) {
        console.error("Error adding item:", error);
    }
};

// Get all cart items for a specific user
export const getCartItems = async (userId) => {
    try {
        const result = await db.getAllAsync(`SELECT * FROM cart WHERE user_id = ?;`, [userId]);
        return result;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return [];
    }
};

// Clear cart after checkout
export const clearCart = async (userId) => {
    try {
        await db.runAsync(`DELETE FROM cart WHERE user_id = ?;`, [userId]);
        console.log("Cart cleared!");
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
};
