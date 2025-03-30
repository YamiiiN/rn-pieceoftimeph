import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const Payment = (props) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [gcashNumber, setGcashNumber] = useState('');
    const navigation = useNavigation();
    const route = useRoute();

    const shippingData = props.route?.params?.shippingData || {};

    const selectedItemsFromRedux = useSelector(state => state.cart.selectedItemsForCheckout) || [];

    const selectedItems = route.params?.selectedItems || selectedItemsFromRedux;

    // useEffect(() => {
    //     console.log("Selected items in Payment screen:", selectedItems);
    // }, [selectedItems]); //pang debug incase

    const paymentMethods = [
        { id: 'credit_card', name: 'Credit Card', icon: '💳', description: 'Pay with Mastercard, Visa or JCB' },
        { id: 'gcash', name: 'GCash', icon: '📱', description: 'Pay using your GCash account' },
        { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' },
    ];

    const handleContinue = () => {
        if (selectedPaymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv || !cardholderName)) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Please fill in all credit card details',
            });
            return;
        } else if (selectedPaymentMethod === 'gcash' && !gcashNumber) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Please enter your GCash number',
            });
            return;
        } else if (!selectedPaymentMethod) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Please select a payment method',
            });
            return;
        }

        let paymentData = { method: selectedPaymentMethod };

        if (selectedPaymentMethod === 'credit_card') {
            paymentData = { ...paymentData, cardNumber, expiryDate, cvv, cardholderName };
        } else if (selectedPaymentMethod === 'gcash') {
            paymentData = { ...paymentData, gcashNumber };
        }

        navigation.navigate('Confirm', {
            shippingData,
            paymentData,
            selectedItems: route.params?.selectedItems || selectedItemsFromRedux,  
        });
    };

    const renderPaymentMethodSelector = () => {
        return (
            <View style={styles.methodSelector}>
                <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.methodOption,
                            selectedPaymentMethod === method.id && styles.methodOptionSelected
                        ]}
                        onPress={() => setSelectedPaymentMethod(method.id)}
                    >
                        <View style={styles.methodIconContainer}>
                            <Text style={styles.methodIcon}>{method.icon}</Text>
                        </View>
                        <View style={styles.methodDetails}>
                            <Text style={styles.methodName}>{method.name}</Text>
                            <Text style={styles.methodDescription}>{method.description}</Text>
                        </View>
                        <View style={styles.radioButton}>
                            {selectedPaymentMethod === method.id && <View style={styles.radioButtonSelected} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderCreditCardForm = () => {
        if (selectedPaymentMethod !== 'credit_card') return null;

        return (
            <View style={styles.paymentForm}>
                <Text style={styles.sectionTitle}>CREDIT CARD DETAILS</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>CARD NUMBER</Text>
                    <TextInput
                        style={styles.input}
                        value={cardNumber}
                        onChangeText={(text) => setCardNumber(text)}
                        placeholder="Enter your card number"
                        keyboardType="numeric"
                        maxLength={16}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                        <Text style={styles.inputLabel}>EXPIRY DATE</Text>
                        <TextInput
                            style={styles.input}
                            value={expiryDate}
                            onChangeText={(text) => setExpiryDate(text)}
                            placeholder="MM/YY"
                            maxLength={5}
                        />
                    </View>

                    <View style={[styles.inputContainer, styles.halfWidth]}>
                        <Text style={styles.inputLabel}>CVV</Text>
                        <TextInput
                            style={styles.input}
                            value={cvv}
                            onChangeText={(text) => setCvv(text)}
                            placeholder="123"
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>CARDHOLDER NAME</Text>
                    <TextInput
                        style={styles.input}
                        value={cardholderName}
                        onChangeText={(text) => setCardholderName(text)}
                        placeholder="Enter cardholder name"
                    />
                </View>
            </View>
        );
    };

    const renderGcashForm = () => {
        if (selectedPaymentMethod !== 'gcash') return null;

        return (
            <View style={styles.paymentForm}>
                <Text style={styles.sectionTitle}>GCASH DETAILS</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>GCASH NUMBER</Text>
                    <TextInput
                        style={styles.input}
                        value={gcashNumber}
                        onChangeText={(text) => setGcashNumber(text)}
                        placeholder="Enter your GCash number"
                        keyboardType="phone-pad"
                        maxLength={11}
                    />
                </View>
            </View>
        );
    };

    const renderCODInfo = () => {
        if (selectedPaymentMethod !== 'cod') return null;

        return (
            <View style={styles.paymentForm}>
                <Text style={styles.sectionTitle}>CASH ON DELIVERY</Text>
                <Text style={styles.codMessage}>
                    You will pay in cash when your order is delivered. Please have the exact amount ready.
                </Text>
            </View>
        );
    };

    const renderShippingDetails = () => {
        if (!selectedPaymentMethod) return null;

        return (

            <View style={styles.shippingSummary}>
                <View style={styles.shippingHeader}>
                    <Text style={styles.summaryTitle}>SHIPPING DETAILS</Text>
                </View>

                <View style={styles.shippingContent}>
                    <View style={styles.shippingItem}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📍</Text>
                        </View>
                        <View style={styles.shippingDetails}>
                            <Text style={styles.shippingLabel}>DELIVERY ADDRESS</Text>
                            <Text style={styles.shippingValue}>
                                {shippingData.address}, {shippingData.barangay}, {shippingData.city}, {shippingData.zipCode}
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
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.formContainer}>
                {renderPaymentMethodSelector()}

                {renderCreditCardForm()}
                {renderGcashForm()}
                {renderCODInfo()}

                {renderShippingDetails()}
            </ScrollView>

            <TouchableOpacity
                style={[
                    styles.continueButton,
                    !selectedPaymentMethod && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                disabled={!selectedPaymentMethod}
            >
                <Text style={styles.continueButtonText}>CONTINUE TO CONFIRMATION</Text>
            </TouchableOpacity>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    methodSelector: {
        marginBottom: 20,
    },
    methodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 10,
    },
    methodOptionSelected: {
        borderColor: '#4CAF50',
        backgroundColor: '#F1F8E9',
    },
    methodIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    methodIcon: {
        fontSize: 20,
    },
    methodDetails: {
        flex: 1,
    },
    methodName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    methodDescription: {
        fontSize: 12,
        color: '#666',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
    },
    paymentForm: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    codMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    shippingSummary: {
        marginTop: 20,
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
    divider: {
        height: 1,
        backgroundColor: '#eeeeee',
        marginVertical: 12,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        margin: 20,
        borderRadius: 8,
    },
    continueButtonDisabled: {
        backgroundColor: '#BDBDBD',
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Payment;