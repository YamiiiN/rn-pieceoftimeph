import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const ProductCard = ({ item }) => {
    const navigation = useNavigation();

    const formattedPrice = new Intl.NumberFormat('en-US').format(item.sell_price);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SingleProduct", { item: item })}
        >
            <Image
                style={styles.image}
                resizeMode="contain"
                source={{ uri: item.images[0]?.url }}
            />
            {/* <View style={styles.favoriteContainer}>
                <TouchableOpacity style={styles.favoriteButton}>
                    <Icon name="heart-outline" size={18} color="gray" />
                </TouchableOpacity>
            </View> */}
            <View style={styles.cardBody}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₱ {formattedPrice}</Text>
                    <View style={styles.ratingContainer}>
                        <Icon name="star" size={12} color="#FFC107" />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.brand}>{item.brand}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: (width - 40) / 2,  
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    image: {
        height: 130,
        width: '100%',
        backgroundColor: '#f9f9f9',
    },
    favoriteContainer: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    favoriteButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    cardBody: {
        padding: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'red',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 12,
        marginLeft: 2,
        color: '#666',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    brand: {
        fontSize: 12,
        color: '#666',
    },
});

export default ProductCard;