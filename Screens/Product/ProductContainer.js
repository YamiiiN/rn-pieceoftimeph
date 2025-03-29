import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Modal, Text, TouchableOpacity } from 'react-native';
import Header from '../Shared/Header';
import ProductList from './ProductList';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

const ProductContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [tempMinPrice, setTempMinPrice] = useState(0);
    const [tempMaxPrice, setTempMaxPrice] = useState(10000);

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
        let filtered = products;

        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

       
        filtered = filtered.filter(product => 
            Number(product.sell_price) >= priceRange.min && Number(product.sell_price) <= priceRange.max
        );
        

        setFilteredProducts(filtered);
    }, [searchQuery, products, priceRange]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const applyPriceFilter = () => {
        setPriceRange({ min: tempMinPrice, max: tempMaxPrice });
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

            <ProductList products={filteredProducts} priceRange={priceRange} setModalVisible={setModalVisible} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Price Range</Text>

                        <Text style={styles.priceText}>₱{tempMinPrice.toLocaleString()}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10000}
                            step={500}
                            value={tempMinPrice}
                            onValueChange={(value) => setTempMinPrice(value)}
                            minimumTrackTintColor="#FF0000"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#FF0000"
                        />

                        <Text style={styles.priceText}>₱{tempMaxPrice.toLocaleString()}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={tempMinPrice}
                            maximumValue={10000}
                            step={500}
                            value={tempMaxPrice}
                            onValueChange={(value) => setTempMaxPrice(value)}
                            minimumTrackTintColor="#FF0000"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#FF0000"
                        />

                        <TouchableOpacity style={styles.applyButton} onPress={applyPriceFilter}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        marginVertical: 10,
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    applyButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductContainer;
