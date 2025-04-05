import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../../Redux/Actions/productActions';

const { width } = Dimensions.get("window");

// const CategoryProducts = ({ route, navigation }) => {
//     const { category } = route.params;
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const dispatch = useDispatch();
//     const { categoryProducts, productsLoading } = useSelector(state => state.products);

//     useEffect(() => {
//         dispatch(fetchProductsByCategory(category));
//     }, [dispatch, category]);


//     return (
//         <View style={styles.container}>
//             {loading ? (
//                 <ActivityIndicator size="large" color="red" />
//             ) : (
//                 <FlatList
//                     data={products}
//                     keyExtractor={(item) => item._id}
//                     numColumns={2}
//                     columnWrapperStyle={styles.row}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity
//                             style={styles.card}
//                             onPress={() => navigation.navigate("SingleProduct", { item })}
//                         >
//                             <Image
//                                 style={styles.image}
//                                 resizeMode="contain"
//                                 source={{ uri: item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/100' }}
//                             />
//                             <View style={styles.favoriteContainer}>
//                                 <TouchableOpacity style={styles.favoriteButton}>
//                                     <Icon name="heart-outline" size={18} color="gray" />
//                                 </TouchableOpacity>
//                             </View>
//                             <View style={styles.cardBody}>
//                                 <View style={styles.priceContainer}>
//                                     <Text style={styles.price}>₱ {new Intl.NumberFormat('en-US').format(item.sell_price)}</Text>
//                                     <View style={styles.ratingContainer}>
//                                         <Icon name="star" size={12} color="#FFC107" />
//                                         <Text style={styles.rating}>{item.rating}</Text>
//                                     </View>
//                                 </View>
//                                 <Text style={styles.title}>{item.name}</Text>
//                                 <Text style={styles.brand}>{item.brand}</Text>
//                             </View>
//                         </TouchableOpacity>

//                     )}
//                 />
//             )}
//         </View>
//     );
// };
const CategoryProducts = ({ route, navigation }) => {
    const { category } = route.params;
    const dispatch = useDispatch();

    const { categoryProducts, productsLoading } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProductsByCategory(category));
    }, [dispatch, category]);

    return (
        <View style={styles.container}>
            {productsLoading ? (
                <ActivityIndicator size="large" color="red" />
            ) : (
                <FlatList
                    data={categoryProducts}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate("SingleProduct", { item })}
                        >
                            <Image
                                style={styles.image}
                                resizeMode="contain"
                                source={{ uri: item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/100' }}
                            />
                            <View style={styles.favoriteContainer}>
                                <TouchableOpacity style={styles.favoriteButton}>
                                    <Icon name="heart-outline" size={18} color="gray" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardBody}>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.price}>₱ {new Intl.NumberFormat('en-US').format(item.sell_price)}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Icon name="star" size={12} color="#FFC107" />
                                        <Text style={styles.rating}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.brand}>{item.brand}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
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

export default CategoryProducts;




// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import baseURL from '../../assets/common/baseUrl';

// const { width } = Dimensions.get("window");

// const CategoryProducts = ({ route, navigation }) => {
//     const { category } = route.params;
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchProductsByCategory();
//     }, []);

//     const fetchProductsByCategory = async () => {
//         try {
//             const response = await axios.get(`${baseURL}/product/get/productsByCategory/${category}`);
//             setProducts(response.data.products);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {loading ? (
//                 <ActivityIndicator size="large" color="red" />
//             ) : (
//                 <FlatList
//                     data={products}
//                     keyExtractor={(item) => item._id}
//                     numColumns={2}
//                     columnWrapperStyle={styles.row}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity
//                             style={styles.card}
//                             onPress={() => navigation.navigate("SingleProduct", { item })}
//                         >
//                             <Image
//                                 style={styles.image}
//                                 resizeMode="contain"
//                                 source={{ uri: item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/100' }}
//                             />
//                             <View style={styles.favoriteContainer}>
//                                 <TouchableOpacity style={styles.favoriteButton}>
//                                     <Icon name="heart-outline" size={18} color="gray" />
//                                 </TouchableOpacity>
//                             </View>
//                             <View style={styles.cardBody}>
//                                 <View style={styles.priceContainer}>
//                                     <Text style={styles.price}>₱ {new Intl.NumberFormat('en-US').format(item.sell_price)}</Text>
//                                     <View style={styles.ratingContainer}>
//                                         <Icon name="star" size={12} color="#FFC107" />
//                                         <Text style={styles.rating}>{item.rating}</Text>
//                                     </View>
//                                 </View>
//                                 <Text style={styles.title}>{item.name}</Text>
//                                 <Text style={styles.brand}>{item.brand}</Text>
//                             </View>
//                         </TouchableOpacity>

//                     )}
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//         backgroundColor: 'white',
//     },
//     header: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     row: {
//         justifyContent: 'space-between',
//     },
//     card: {
//         width: (width - 40) / 2,
//         marginBottom: 16,
//         backgroundColor: 'white',
//         borderRadius: 10,
//         overflow: 'hidden',
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//     },
//     image: {
//         height: 130,
//         width: '100%',
//         backgroundColor: '#f9f9f9',
//     },
//     favoriteContainer: {
//         position: 'absolute',
//         right: 8,
//         top: 8,
//     },
//     favoriteButton: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         backgroundColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 1,
//     },
//     cardBody: {
//         padding: 10,
//     },
//     priceContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 4,
//     },
//     price: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: 'red',
//     },
//     ratingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rating: {
//         fontSize: 12,
//         marginLeft: 2,
//         color: '#666',
//     },
//     title: {
//         fontSize: 14,
//         fontWeight: '500',
//         marginBottom: 2,
//     },
//     brand: {
//         fontSize: 12,
//         color: '#666',
//     },
// });

// export default CategoryProducts;