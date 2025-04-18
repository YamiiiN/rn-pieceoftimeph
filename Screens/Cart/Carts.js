import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Context/Auth';
import {
    updateCartQuantity,
    removeCartProduct,
    toggleCartItem,
    loadCartItems,
    setSelectedItemsForCheckout,
} from '../../Redux/Actions/cartActions'

const Cart = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const cartItems = useSelector(state => state.cart.cartItems);

    const getUserId = (user) => {
        return user?.id || user?._id || user?.decodedUser?.id;
    };

    useEffect(() => {
        const userId = getUserId(user);
        if (userId) {
            dispatch(loadCartItems(userId));
            setLoading(false);
        } else {
            console.warn("User ID not found. Cannot load cart.");
            setLoading(false);
        }
    }, [user, dispatch]);

    const subTotal = cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity > 0) {
            const userId = getUserId(user);
            if (userId) {
                dispatch(updateCartQuantity(userId, productId, newQuantity));
            }
        }
    };

    const handleRemoveItem = (productId) => {
        const userId = getUserId(user);
        if (userId) {
            dispatch(removeCartProduct(userId, productId));
        }
    };

    const handleToggleSelection = (productId) => {
        const userId = getUserId(user);
        const item = cartItems.find(item => item.id === productId);
        if (userId && item) {
            dispatch(toggleCartItem(userId, productId, !item.selected));
        }
    };

    // const handleCheckout = () => {
    //     const selectedItems = cartItems.filter(item => item.selected);
    //     if (selectedItems.length > 0) {
    //         dispatch(setSelectedItemsForCheckout(selectedItems));
    //         navigation.navigate('Checkout');
    //     } else {
    //         Toast.show({
    //             type: 'error',
    //             position: 'bottom',
    //             text1: 'No items selected',
    //             text2: 'Please select at least one item to proceed to checkout.',
    //         });
    //     }
    // };
    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length > 0) {
            dispatch(setSelectedItemsForCheckout(selectedItems));
            navigation.navigate('Checkout', {
                onCheckoutComplete: () => {
                    // This will be called after successful checkout
                    const userId = getUserId(user);
                    if (userId) {
                        dispatch(removeSelectedItemsFromCart(userId));
                    }
                }
            });
        } else {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'No items selected',
                text2: 'Please select at least one item to proceed to checkout.',
            });
        }
    };
    const renderCartItem = (item) => (
        <View key={item.id} style={styles.cartItemContainer}>
            <CheckBox
                checked={item.selected}
                onPress={() => handleToggleSelection(item.id)}
                containerStyle={styles.checkboxContainer}
                checkedColor="black"
            />
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetailsContainer}>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category} Watch</Text>
                    <Text style={styles.itemPrice}>₱{item.price.toLocaleString()}</Text>
                </View>
                <View style={styles.quantityContainerWrapper}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.circleButtonMinus}
                            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                            <Icon name="remove" size={20} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.circleButtonAdd}
                            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                            <Icon name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Icon name="trash" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity>
                    <Icon name="ellipsis-horizontal" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <View style={styles.emptyCartContainer}>
                        <Text style={styles.emptyCartText}>Loading cart items...</Text>
                    </View>
                ) : cartItems.length > 0 ? (
                    cartItems.map(item => renderCartItem(item))
                ) : (
                    <View style={styles.emptyCartContainer}>
                        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[
                        styles.placeOrderButton,
                        cartItems.length === 0 || !cartItems.some(item => item.selected) ? styles.disabledButton : {},
                    ]}
                    disabled={cartItems.length === 0 || !cartItems.some(item => item.selected)}
                    onPress={handleCheckout}
                >
                    <Text style={styles.placeOrderText}>CHECKOUT</Text>
                    <Text style={styles.orderTotalText}>₱{(subTotal || 0).toLocaleString()}</Text>
                </TouchableOpacity>
            </View>

            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    scrollView: {
        flex: 1
    },
    checkboxContainer: {
        padding: 0,
        margin: 0
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15
    },
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    itemDetailsContainer: {
        flex: 1
    },
    itemDetails: {
        marginBottom: 10
    },
    quantityContainerWrapper: {
        alignItems: 'flex-end'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        borderRadius: 25,
        paddingHorizontal: 7,
        paddingVertical: 5,
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 15
    },
    itemCategory: {
        color: 'gray',
        fontSize: 10,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    itemPrice: {
        color: 'gray',
        fontSize: 15,
    },
    circleButtonMinus: {
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: '#d9d9d9',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButtonAdd: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        textAlign: 'center',
        minWidth: 25,
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        // backgroundColor: '#f5f5f5'
    },
    placeOrderButton: {
        backgroundColor: '#584e51',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        alignItems: 'center',
    },
    placeOrderText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10
    },
    orderTotalText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    emptyCartText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 20
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 10
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
});

export default Cart;