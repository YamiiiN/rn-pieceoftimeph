import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/Actions/cartActions';
import { 
    listReviewsByProduct, 
    checkUserReview, 
    checkCanReview 
} from '../../Redux/Actions/reviewActions';
import Toast from 'react-native-toast-message';
import { addToCartDB } from '../../Helper/cartDB';
import { useAuth } from '../../Context/Auth';
import FeedbackList from './FeedbackList';
import FeedbackForm from './FeedbackForm';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
const { width } = Dimensions.get('window');

const SingleProduct = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user, token } = useAuth();
    const { item } = route.params;
    const [selectedImage, setSelectedImage] = useState(item.images[0]?.url);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [discount, setDiscount] = useState(null);
    
    // Get review state from Redux
    const { 
        reviews, 
        userReview, 
        canReview, 
        loading: reviewsLoading 
    } = useSelector(state => state.reviews);
    
    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    // Calculate discounted price if applicable
    const discountedPrice = discount ? 
        item.sell_price - (item.sell_price * discount / 100) : 
        null;

    const formattedOriginalPrice = new Intl.NumberFormat('en-US').format(item.sell_price);
    const formattedDiscountedPrice = discountedPrice ? 
        new Intl.NumberFormat('en-US').format(discountedPrice) : null;

    useEffect(() => {
        dispatch(listReviewsByProduct(item._id));

        if (user && token) {
            dispatch(checkUserReview(item._id, token))
                .then(review => {
                    if (review) {
                        // user has already reviewed, don't show form
                        setShowReviewForm(false);
                    } else {
                        // user hasn't reviewed yet, check if they can
                        dispatch(checkCanReview(item._id, token))
                            .then(canReviewResult => {
                                // only show form if user can review
                                setShowReviewForm(canReviewResult);
                            });
                    }
                });
        }
        
        // Check for active promotions
        const fetchPromotions = async () => {
            try {
                const res = await axios.get(`${baseURL}/promotions`);
                if (res.data.success) {
                    const activePromotion = res.data.promotions.find(
                        promo => promo.product._id === item._id && new Date(promo.endDate) > new Date()
                    );
                    
                    if (activePromotion) {
                        setDiscount(activePromotion.discountPercentage);
                    }
                }
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        };
        
        fetchPromotions();
    }, [dispatch, item._id, user, token]);

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleReviewSubmitted = () => {
        setShowReviewForm(false);
        setEditingReview(null);
        // Refresh reviews
        dispatch(listReviewsByProduct(item._id));
    };

    const handleAddToCart = async () => {
        try {
            const userId = user?._id || user?.id;

            if (!userId) {
                console.error("No user ID found despite token existing", { user });
                Toast.show({
                    type: 'error',
                    text1: 'Login Error',
                    text2: 'User session found but ID is missing. Please login again.',
                    position: 'top',
                });
                return;
            }

            const finalPrice = discountedPrice || item.sell_price;
            
            const cartItem = {
                id: item._id,
                name: item.name,
                image: item.images[0]?.url,
                price: finalPrice,
                originalPrice: item.sell_price,
                discountPercentage: discount,
                quantity,
                category: item.category || "Uncategorized"
            };

            // Add to SQLite DB with the found user ID
            await addToCartDB(userId, cartItem, quantity);

            dispatch(addToCart(cartItem));

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

                {discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}% OFF</Text>
                    </View>
                )}

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
                    
                    {discount ? (
                        <View style={styles.priceWrapper}>
                            <Text style={styles.originalPrice}>₱ {formattedOriginalPrice}</Text>
                            <View style={styles.currentPriceRow}>
                                <Text style={styles.price}>₱ {formattedDiscountedPrice}</Text>
                                <View style={styles.discountTag}>
                                    <Text style={styles.discountTagText}>{discount}% OFF</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.price}>₱ {formattedOriginalPrice}</Text>
                    )}

                    <Text style={styles.description}>
                        {showFullDescription ? item.description : `${item.description.slice(0, 100)}...`}
                    </Text>

                    <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                        <Text style={styles.readMoreText}>{showFullDescription ? 'Read Less ...' : 'Read More ...'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Separator */}
                <View style={styles.separator} />

                {/* Feedback List */}
                {reviewsLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading reviews...</Text>
                    </View>
                ) : (
                    <FeedbackList 
                        onEditReview={handleEditReview}
                    />
                )}

                {/* Feedback Form - Only show if user can review or is editing */}
                {(user && showReviewForm) && (
                    <FeedbackForm 
                        productId={item._id}
                        existingReview={editingReview || userReview}
                        token={token}
                        onSubmitSuccess={handleReviewSubmitted}
                    />
                )}
                
                {/* Message if user cannot review */}
                {(user && !canReview && !userReview) && (
                    <View style={styles.cannotReviewContainer}>
                        <Text style={styles.cannotReviewText}>
                            You can only review products after receiving your order.
                        </Text>
                    </View>
                )}
                
                {/* Message if user is not logged in */}
                {!user && (
                    <View style={styles.loginPromptContainer}>
                        <Text style={styles.loginPromptText}>
                            Please log in to leave a review.
                        </Text>
                        <TouchableOpacity 
                            style={styles.loginButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                {/* Extra space at bottom */}
                <View style={styles.bottomSpace} />
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
    discountBadge: {
        position: 'absolute',
        top: 60,
        right: 0,
        backgroundColor: '#e74c3c',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        zIndex: 5,
    },
    discountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
    priceWrapper: {
        marginTop: 8,
    },
    currentPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 8,
    },
    originalPrice: {
        fontSize: 16,
        color: '#666',
        textDecorationLine: 'line-through',
    },
    discountTag: {
        marginLeft: 10,
        backgroundColor: '#e74c3c',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    discountTagText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
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
    separator: {
        height: 8,
        backgroundColor: '#f5f5f5',
        marginTop: 20,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
    },
    bottomSpace: {
        height: 40,
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
    addReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 20,
        marginVertical: 15,
    },
    addReviewText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    loginPromptContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loginPromptText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: '#584e51',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cannotReviewContainer: {
        padding: 20,
        alignItems: 'center',
    },
    cannotReviewText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default SingleProduct;



// SingleProduct.js
// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
//     Dimensions
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../../Redux/Actions/cartActions';
// import { 
//     listReviewsByProduct, 
//     checkUserReview, 
//     checkCanReview 
// } from '../../Redux/Actions/reviewActions';
// import Toast from 'react-native-toast-message';
// import { addToCartDB } from '../../Helper/cartDB';
// import { useAuth } from '../../Context/Auth';
// import FeedbackList from './FeedbackList';
// import FeedbackForm from './FeedbackForm';

// const { width } = Dimensions.get('window');

// const SingleProduct = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     const { user, token } = useAuth();
//     const { item } = route.params;
//     const [selectedImage, setSelectedImage] = useState(item.images[0]?.url);
//     const [quantity, setQuantity] = useState(1);
//     const [showFullDescription, setShowFullDescription] = useState(false);
//     const [editingReview, setEditingReview] = useState(null);
//     const [showReviewForm, setShowReviewForm] = useState(false);
    
//     // Get review state from Redux
//     const { 
//         reviews, 
//         userReview, 
//         canReview, 
//         loading: reviewsLoading 
//     } = useSelector(state => state.reviews);
    
//     const incrementQuantity = () => setQuantity(quantity + 1);
//     const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

//     // Fetch reviews and check user review status when component mounts
//     useEffect(() => {
//         dispatch(listReviewsByProduct(item._id));

//         if (user && token) {
//             dispatch(checkUserReview(item._id, token))
//                 .then(review => {
//                     if (review) {
//                         // User has already reviewed, don't show form
//                         setShowReviewForm(false);
//                     } else {
//                         // User hasn't reviewed yet, check if they can
//                         dispatch(checkCanReview(item._id, token))
//                             .then(canReviewResult => {
//                                 // Only show form if user can review
//                                 setShowReviewForm(canReviewResult);
//                             });
//                     }
//                 });
//         }
//     }, [dispatch, item._id, user, token]);

//     const handleEditReview = (review) => {
//         setEditingReview(review);
//         setShowReviewForm(true);
//     };

//     const handleReviewSubmitted = () => {
//         setShowReviewForm(false);
//         setEditingReview(null);
//         // Refresh reviews
//         dispatch(listReviewsByProduct(item._id));
//     };

//     const handleAddToCart = async () => {
//         try {
//             const userId = user?._id || user?.id;

//             if (!userId) {
//                 console.error("No user ID found despite token existing", { user });
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Login Error',
//                     text2: 'User session found but ID is missing. Please login again.',
//                     position: 'top',
//                 });
//                 return;
//             }

//             const cartItem = {
//                 id: item._id,
//                 name: item.name,
//                 image: item.images[0]?.url,
//                 price: item.sell_price,
//                 quantity,
//                 category: item.category || "Uncategorized"
//             };

//             // Add to SQLite DB with the found user ID
//             await addToCartDB(userId, cartItem, quantity);

//             // Also dispatch to Redux for state management
//             dispatch(addToCart(cartItem));

//             Toast.show({
//                 type: 'success',
//                 text1: 'Added to Cart',
//                 text2: `${item.name} has been added successfully!`,
//                 position: 'top',
//             });
//         } catch (error) {
//             console.error("Error adding to cart:", error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error',
//                 text2: 'Failed to add item to cart',
//                 position: 'top',
//             });
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-back" size={24} color="black" />
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.favoriteButton}>
//                     <Icon name="heart-outline" size={24} color="gray" />
//                 </TouchableOpacity>

//                 <Image source={{ uri: selectedImage }} style={styles.mainImage} resizeMode="contain" />

//                 <View style={styles.thumbnailContainer}>
//                     {item.images.map((img, index) => (
//                         <TouchableOpacity key={index} onPress={() => setSelectedImage(img.url)}>
//                             <Image source={{ uri: img.url }}
//                                 style={[styles.thumbnail, selectedImage === img.url && styles.selectedThumbnail]}
//                                 resizeMode="contain"
//                             />
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 <View style={styles.detailsContainer}>
//                     <View style={styles.titleContainer}>
//                         <Text style={styles.productName}>{item.name}</Text>
//                         <View style={styles.ratingContainer}>
//                             <Icon name="star" size={16} color="#FFC107" />
//                             <Text style={styles.rating}>{item.rating}</Text>
//                         </View>
//                     </View>
//                     <Text style={styles.brand}>{item.brand}</Text>
//                     <Text style={styles.price}>₱ {new Intl.NumberFormat('en-US').format(item.sell_price)}</Text>

//                     <Text style={styles.description}>
//                         {showFullDescription ? item.description : `${item.description.slice(0, 100)}...`}
//                     </Text>

//                     <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
//                         <Text style={styles.readMoreText}>{showFullDescription ? 'Read Less ...' : 'Read More ...'}</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Separator */}
//                 <View style={styles.separator} />

//                 {/* Feedback List */}
//                 {reviewsLoading ? (
//                     <View style={styles.loadingContainer}>
//                         <Text style={styles.loadingText}>Loading reviews...</Text>
//                     </View>
//                 ) : (
//                     <FeedbackList 
//                         onEditReview={handleEditReview}
//                     />
//                 )}

//                 {/* Feedback Form - Only show if user can review or is editing */}
//                 {(user && showReviewForm) && (
//                     <FeedbackForm 
//                         productId={item._id}
//                         existingReview={editingReview || userReview}
//                         token={token}
//                         onSubmitSuccess={handleReviewSubmitted}
//                     />
//                 )}
                
//                 {/* Message if user cannot review */}
//                 {(user && !canReview && !userReview) && (
//                     <View style={styles.cannotReviewContainer}>
//                         <Text style={styles.cannotReviewText}>
//                             You can only review products after receiving your order.
//                         </Text>
//                     </View>
//                 )}
                
//                 {/* Message if user is not logged in */}
//                 {!user && (
//                     <View style={styles.loginPromptContainer}>
//                         <Text style={styles.loginPromptText}>
//                             Please log in to leave a review.
//                         </Text>
//                         <TouchableOpacity 
//                             style={styles.loginButton}
//                             onPress={() => navigation.navigate('Login')}
//                         >
//                             <Text style={styles.loginButtonText}>Login</Text>
//                         </TouchableOpacity>
//                     </View>
//                 )}
                
//                 {/* Extra space at bottom */}
//                 <View style={styles.bottomSpace} />
//             </ScrollView>

//             <View style={styles.fixedBottom}>
//                 <View style={styles.quantityContainer}>
//                     <TouchableOpacity style={styles.circleButtonMinus} onPress={decrementQuantity}>
//                         <Icon name="remove" size={20} color="black" />
//                     </TouchableOpacity>
//                     <Text style={styles.quantity}>{quantity}</Text>
//                     <TouchableOpacity style={styles.circleButtonAdd} onPress={incrementQuantity}>
//                         <Icon name="add" size={20} color="white" />
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
//                     <Text style={styles.addToCartText}>Add to Cart</Text>
//                 </TouchableOpacity>
//             </View>

//             <Toast />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     scrollContainer: {
//         paddingBottom: 100,
//     },
//     backButton: {
//         position: 'absolute',
//         top: 20,
//         left: 16,
//         zIndex: 10,
//     },
//     favoriteButton: {
//         position: 'absolute',
//         top: 20,
//         right: 16,
//         zIndex: 10,
//     },
//     mainImage: {
//         width: width,
//         height: 300,
//         backgroundColor: '#f9f9f9',
//     },
//     thumbnailContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginVertical: 10,
//     },
//     thumbnail: {
//         width: 50,
//         height: 50,
//         marginHorizontal: 5,
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//         borderRadius: 8,
//     },
//     selectedThumbnail: {
//         borderColor: 'red',
//     },
//     detailsContainer: {
//         paddingHorizontal: 16,
//         paddingTop: 16,
//     },
//     titleContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     productName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         maxWidth: '70%',
//     },
//     ratingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rating: {
//         marginLeft: 4,
//         fontSize: 14,
//         color: '#666',
//     },
//     brand: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 4,
//     },
//     price: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: 'black',
//         marginTop: 8,
//     },
//     descriptionTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginTop: 10,
//     },
//     description: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 15,
//     },
//     readMoreText: {
//         fontSize: 14,
//         color: 'black',
//         marginTop: 5,
//         fontWeight: 'bold',
//         fontStyle: 'italic',
//     },
//     separator: {
//         height: 8,
//         backgroundColor: '#f5f5f5',
//         marginTop: 20,
//     },
//     loadingContainer: {
//         padding: 20,
//         alignItems: 'center',
//     },
//     loadingText: {
//         fontSize: 14,
//         color: '#666',
//     },
//     bottomSpace: {
//         height: 40,
//     },
//     fixedBottom: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         backgroundColor: 'white',
//         borderTopWidth: 2,
//         borderColor: '#e0e0e0',
//     },
//     quantityContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: '#d9d9d9',
//         paddingHorizontal: 5,
//         marginRight: 5,
//     },
//     circleButtonMinus: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#d9d9d9',
//         borderColor: 'black',
//         borderWidth: 2,
//     },
//     circleButtonAdd: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//     },
//     quantity: {
//         fontSize: 16,
//         textAlign: 'center',
//         marginHorizontal: 10,
//         minWidth: 25,
//     },
//     addToCartButton: {
//         backgroundColor: '#584e51',
//         paddingVertical: 15,
//         paddingHorizontal: 50,
//         borderRadius: 30,
//         alignItems: 'center',
//         marginLeft: 5,
//     },
//     addToCartText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     addReviewButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#4CAF50',
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         marginHorizontal: 20,
//         marginVertical: 15,
//     },
//     addReviewText: {
//         color: '#FFFFFF',
//         fontWeight: '600',
//         fontSize: 16,
//         marginLeft: 8,
//     },
// });

// export default SingleProduct;