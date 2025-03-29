import React from 'react';
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
import { removeFromCart, updateQuantity, toggleSelection } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';

const Cart = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cartItems);

    const deliveryFee = 250;
    const subTotal = cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.quantity), 0);

    const total = subTotal > 0 ? subTotal + deliveryFee : 0;

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




            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Sub Total</Text>
                    <Text style={styles.summaryValue}>₱{subTotal.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    <Text style={styles.summaryValue}>₱{deliveryFee.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₱{total.toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.checkoutButton,
                        cartItems.length === 0 ? styles.disabledButton : {}
                    ]}
                    disabled={cartItems.length === 0}
                >
                    <Text style={styles.checkoutButtonText}>Check out</Text>
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
    summaryContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    summaryLabel: {
        color: 'gray'
    },
    summaryValue: {
        fontWeight: 'bold'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 16
    },
    totalValue: {
        fontWeight: 'bold',
        fontSize: 16
    },
    checkoutButton: {
        backgroundColor: '#584e51',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center'
    },
    checkoutButtonText: {
        color: 'white',
        fontWeight: 'bold'
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
    }
});

export default Cart;
