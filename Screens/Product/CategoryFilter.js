import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { listCategories } from '../../Redux/Actions/productActions';
const CategoryFilter = () => {
    const navigation = useNavigation(); 
    const dispatch = useDispatch();
    const { categories, loading } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(listCategories());
    }, [dispatch]);


    if (loading) {
        return <ActivityIndicator size="large" color="red" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Categories</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {categories.length > 0 ? (
                    categories.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.categoryItem}
                            onPress={() => navigation.navigate('CategoryProducts', { category: item.category })} 
                        >
                            <View style={styles.categoryImageContainer}>
                                <Image
                                    source={{ uri: item.firstImage || 'https://via.placeholder.com/60' }}
                                    style={styles.categoryImage}
                                />
                            </View>
                            <Text style={styles.categoryName}>{item.category}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noCategories}>No categories available.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAll: {
        fontSize: 14,
        color: 'red',
    },
    categoriesContainer: {
        paddingHorizontal: 12,
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 4,
        width: 80,
    },
    categoryImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryName: {
        fontSize: 12,
        textAlign: 'center',
    },
    noCategories: {
        fontSize: 14,
        textAlign: 'center',
        color: 'gray',
        marginTop: 10,
    },
});

export default CategoryFilter;
