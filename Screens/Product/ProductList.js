import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import ProductCard from './ProductCard';
import Banner from '../Shared/Banner';
import CategoryFilter from './CategoryFilter';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get("window");

const ProductList = ({ products, priceRange, setModalVisible }) => {
    const renderItem = ({ item }) => <ProductCard item={item} />;

    const ListHeader = () => (
        <View>
            <Banner />
            <CategoryFilter />
            <View style={styles.headerContainer}>
                <Text style={styles.header}>All Products</Text>

                <TouchableOpacity style={styles.priceContainer} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="tags" size={16} color="red" />
                    <Text style={styles.priceText}>
                        ₱{priceRange.min.toLocaleString()} - ₱{priceRange.max.toLocaleString()}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            numColumns={2}
            ListHeaderComponent={ListHeader}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
   
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAll: {
        fontSize: 14,
        color: 'red',
    },
    listContainer: {
        paddingBottom: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    priceText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default ProductList;
