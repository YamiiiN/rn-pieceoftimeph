import React, { useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, toggleSelection, setSelectedItemsForCheckout } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';

const Cart = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cartItems) || [];

    // useEffect(() => {
    //     console.log("Cart Items with Selection Status:", cartItems.map(item => ({
    //         id: item.id,
    //         name: item.name,
    //         quantity: item.quantity,
    //         price: item.price,
    //         selected: item.selected
    //     })));
    // }, [cartItems]); // pang debug

    const subTotal = cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        const selectedItems = cartItems
            .filter(item => item.selected === true)
            .map(item => ({ 
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                category: item.category,
                selected: true
            }));
    
        // console.log("Items being passed to checkout:", selectedItems); // pang confirm
    
        if (selectedItems.length > 0) {
            dispatch(setSelectedItemsForCheckout(selectedItems));
            navigation.navigate('Checkout');
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
                onPress={() => dispatch(toggleSelection(item.id))}
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
                            onPress={() => {
                                if (item.quantity > 1) {
                                    dispatch(updateQuantity(item.id, item.quantity - 1));
                                }
                            }}
                        >
                            <Icon name="remove" size={20} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.circleButtonAdd}
                            onPress={() => dispatch(updateQuantity(item.id, item.quantity + 1))}
                        >
                            <Icon name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
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
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <View key={item.id || index}>
                            {renderCartItem(item)}
                        </View>
                    ))
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
                    <Text style={styles.orderTotalText}>₱{subTotal.toLocaleString()}</Text>
                </TouchableOpacity>
            </View>
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
        padding: 15,
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
        borderRadius: 30,
        alignItems: 'center',
    },
    placeOrderText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10
    },
    orderTotalText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 10
    },
    disabledButton: {
        backgroundColor: '#a9a9a9',
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