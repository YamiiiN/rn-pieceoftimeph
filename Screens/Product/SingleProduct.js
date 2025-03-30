import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import { addToCartDB } from '../../Helper/cartDB';
import { useAuth } from '../../Context/Auth';

const { width } = Dimensions.get('window');

const SingleProduct = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { item } = route.params;
    const [selectedImage, setSelectedImage] = useState(item.images[0]?.url);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    const handleAddToCart = async () => {
        try {
            const userId = user?._id || user?.id || decodedUser?.id;

            if (!userId) {
                console.error("No user ID found despite token existing", { user, decodedUser });
                Toast.show({
                    type: 'error',
                    text1: 'Login Error',
                    text2: 'User session found but ID is missing. Please login again.',
                    position: 'top',
                });
                return;
            }

            const cartItem = {
                id: item._id,
                name: item.name,
                image: item.images[0]?.url,
                price: item.sell_price,
                quantity,
                category: item.category || "Uncategorized"
            };

            // Add to SQLite DB with the found user ID
            await addToCartDB(userId, cartItem, quantity);
            // console.log("Item added to SQLite cart:", {
            //     userId,
            //     productId: item._id,
            //     name: item.name,
            //     quantity
            // });

            // Also dispatch to Redux for state management
            dispatch(addToCart(cartItem));

            // console.log("Adding to Cart with User ID:", userId);
            // console.log("Cart Item:", cartItem);


            Toast.show({
                type: 'success',
                text1: 'Added to Cart',
                text2: `${item.name} has been added successfully!`,
                position: 'top',
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to add item to cart',
                position: 'top',
            });
        }
    };
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.favoriteButton}>
                    <Icon name="heart-outline" size={24} color="gray" />
                </TouchableOpacity>

                <Image source={{ uri: selectedImage }} style={styles.mainImage} resizeMode="contain" />

                <View style={styles.thumbnailContainer}>
                    {item.images.map((img, index) => (
                        <TouchableOpacity key={index} onPress={() => setSelectedImage(img.url)}>
                            <Image source={{ uri: img.url }}
                                style={[styles.thumbnail, selectedImage === img.url && styles.selectedThumbnail]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={16} color="#FFC107" />
                            <Text style={styles.rating}>{item.rating}</Text>
                        </View>
                    </View>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.price}>₱ {new Intl.NumberFormat('en-US').format(item.sell_price)}</Text>

                    <Text style={styles.description}>
                        {showFullDescription ? item.description : `${item.description.slice(0, 100)}...`}
                    </Text>

                    <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                        <Text style={styles.readMoreText}>{showFullDescription ? 'Read Less ...' : 'Read More ...'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.fixedBottom}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.circleButtonMinus} onPress={decrementQuantity}>
                        <Icon name="remove" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <TouchableOpacity style={styles.circleButtonAdd} onPress={incrementQuantity}>
                        <Icon name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>

            <Toast />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        paddingBottom: 100,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        zIndex: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 16,
        zIndex: 10,
    },
    mainImage: {
        width: width,
        height: 300,
        backgroundColor: '#f9f9f9',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    thumbnail: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
    },
    selectedThumbnail: {
        borderColor: 'red',
    },
    detailsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        maxWidth: '70%',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    brand: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 8,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 15,
    },
    readMoreText: {
        fontSize: 14,
        color: 'black',
        marginTop: 5,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    fixedBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderColor: '#e0e0e0',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#d9d9d9',
        paddingHorizontal: 5,
        marginRight: 5,
    },
    circleButtonMinus: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        borderColor: 'black',
        borderWidth: 2,
    },
    circleButtonAdd: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    quantity: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 10,
        minWidth: 25,
    },
    addToCartButton: {
        backgroundColor: '#584e51',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        alignItems: 'center',
        marginLeft: 5,
    },
    addToCartText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SingleProduct;
