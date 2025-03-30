import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
const Confirm = (props) => {
    const navigation = useNavigation();
    const route = useRoute();

    const shippingData = props.route?.params?.shippingData || {};
    const paymentData = props.route?.params?.paymentData || {};
    const selectedItemsFromRedux = useSelector(state => state.cart.selectedItemsForCheckout) || [];

    const selectedItems = route.params?.selectedItems || selectedItemsFromRedux;

    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 4.99;
    const tax = subtotal * 0.07;
    const total = subtotal + shippingCost + tax;

    const handlePlaceOrder = () => {
        // Submit order to backend API
        // ...


        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Order placed successfully!',
            text2: 'You will receive a confirmation email shortly.',
        });

        navigation.reset({
            index: 0,
            routes: [{ name: 'Carts', params: { orderPlaced: true } }],
        });

    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView contentContainerStyle={styles.formContainer}>

                <View style={styles.shippingSummary}>
                    <View style={styles.shippingHeader}>
                        <Text style={styles.summaryTitle}>SHIPPING DETAILS</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Shipping')}>
                            <Text style={styles.editButton}>EDIT</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.shippingContent}>
                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>📍</Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>DELIVERY ADDRESS</Text>
                                <Text style={styles.shippingValue}>
                                    {shippingData.address}, {shippingData.barangay},
                                    {shippingData.city}, {shippingData.zipCode}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>📱</Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>CONTACT NUMBER</Text>
                                <Text style={styles.shippingValue}>{shippingData.phone}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>🚚</Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>DELIVERY METHOD</Text>
                                <Text style={styles.shippingValue}>Standard Delivery (3-5 days)</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.shippingSummary}>
                    <View style={styles.shippingHeader}>
                        <Text style={styles.summaryTitle}>PAYMENT METHOD</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
                            <Text style={styles.editButton}>EDIT</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.shippingContent}>
                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>
                                    {paymentData.method === 'gcash' ? '📱' :
                                        paymentData.method === 'cod' ? '💵' : '💳'}
                                </Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>
                                    {paymentData.method === 'gcash' ? 'GCASH' :
                                        paymentData.method === 'cod' ? 'CASH ON DELIVERY' : 'CREDIT CARD'}
                                </Text>

                                {paymentData.method === 'credit_card' && (
                                    <>
                                        <Text style={styles.shippingValue}>
                                            **** **** **** {paymentData.cardNumber?.slice(-4)}
                                        </Text>
                                        <Text style={styles.shippingSubValue}>
                                            {paymentData.cardholderName} | Expires: {paymentData.expiryDate}
                                        </Text>
                                    </>
                                )}

                                {paymentData.method === 'gcash' && (
                                    <Text style={styles.shippingValue}>
                                        GCash Number: {paymentData.gcashNumber}
                                    </Text>
                                )}

                                {paymentData.method === 'cod' && (
                                    <Text style={styles.shippingValue}>
                                        Pay when you receive your order
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.shippingSummary}>
                    <View style={styles.shippingHeader}>
                        <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
                    </View>
                    <View style={styles.shippingContent}>
                        {selectedItems.length > 0 ? (
                            selectedItems.map(item => (
                                <View key={item.id} style={styles.orderItem}>
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>₱{(item.price * item.quantity).toFixed(2)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noItemsText}>No items selected</Text>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Subtotal</Text>
                            <Text style={styles.costValue}>₱{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Shipping</Text>
                            <Text style={styles.costValue}>₱{shippingCost.toFixed(2)}</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Tax</Text>
                            <Text style={styles.costValue}>₱{tax.toFixed(2)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.policyText}>
                    <Text style={styles.policyTextContent}>
                        By placing your order, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={[
                    styles.placeOrderButton,
                    selectedItems.length === 0 ? styles.disabledButton : {}
                ]}
                onPress={handlePlaceOrder}
                disabled={selectedItems.length === 0}
            >
                <Text style={styles.placeOrderButtonText}>PLACE ORDER</Text>
            </TouchableOpacity>

            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    // Shipping Summary Styles 
    shippingSummary: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    shippingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    summaryTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
    },
    editButton: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 13,
    },
    shippingContent: {
        padding: 15,
    },
    orderContent: {
        padding: 15,
    },
    shippingItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 18,
    },
    shippingDetails: {
        flex: 1,
    },
    shippingLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 3,
    },
    shippingValue: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    shippingSubValue: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#eeeeee',
        marginVertical: 12,
    },
    // Order items
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    itemQuantity: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    // Cost summary
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    costLabel: {
        fontSize: 14,
        color: '#777',
    },
    costValue: {
        fontSize: 14,
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    policyText: {
        marginBottom: 20,
        alignItems: 'center',
    },
    policyTextContent: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    placeOrderButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        margin: 20,
        borderRadius: 8,
    },
    placeOrderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Confirm;