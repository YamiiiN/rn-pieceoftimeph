import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import Header from '../Shared/Header';
import ProductList from './ProductList';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

const ProductContainer = ({ route }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${baseURL}/product/get/all`);
                setProducts(res.data.products);
                setFilteredProducts(res.data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(product =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header searchQuery={searchQuery} onSearchChange={handleSearch} />
            <ProductList products={filteredProducts} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

export default ProductContainer;