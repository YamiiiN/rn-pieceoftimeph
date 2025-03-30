import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const citiesWithBarangays = require('../../../assets/data/cities.json');

const Checkout = () => {
    const [address, setAddress] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [availableBarangays, setAvailableBarangays] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();

    const selectedItems = useSelector(state => state.cart.selectedItemsForCheckout) || [];

    useEffect(() => {
        if (city) {
            setAvailableBarangays(citiesWithBarangays[city]);
            setBarangay('');
        }
    }, [city]);

    useEffect(() => {
        const isValid = address && barangay && city && zipCode && phone;
        setIsFormValid(isValid);
    }, [address, barangay, city, zipCode, phone]);

    const handleContinue = () => {
        if (!isFormValid) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'All fields are required!',
                text2: 'Please fill all the required fields to proceed to payment.',
                visibilityTime: 4000,
            });
            return;
        }
        
        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('Payment', {
                shippingData: { address, barangay, city, zipCode, phone },
                selectedItems: selectedItems
            });
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shipping Details</Text>
                <Text style={styles.headerSubtitle}>Please enter your delivery information</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.formContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>ADDRESS</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📍</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                            placeholder="Enter your street address"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>CITY</Text>
                    <View style={styles.pickerRow}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>🏙️</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={city}
                                style={styles.picker}
                                onValueChange={(itemValue) => setCity(itemValue)}
                                dropdownIconColor="#333"
                            >
                                <Picker.Item label="Select City" value="" />
                                {Object.keys(citiesWithBarangays).map((cityName) => (
                                    <Picker.Item key={cityName} label={cityName} value={cityName} />
                                ))}
                            </Picker>
                            <View style={styles.pickerUnderline}></View>
                        </View>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>BARANGAY</Text>
                    <View style={styles.pickerRow}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>🏘️</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={barangay}
                                style={styles.picker}
                                onValueChange={(itemValue) => setBarangay(itemValue)}
                                enabled={city !== ''}
                                dropdownIconColor="#333"
                            >
                                <Picker.Item label="Select Barangay" value="" />
                                {availableBarangays.map((barangayName, index) => (
                                    <Picker.Item key={index} label={barangayName} value={barangayName} />
                                ))}
                            </Picker>
                            <View style={[
                                styles.pickerUnderline, 
                                city === '' && {backgroundColor: '#ddd'}
                            ]}></View>
                        </View>
                    </View>
                    {city === '' && (
                        <Text style={styles.helperText}>Please select a city first</Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>ZIPCODE</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>✉️</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={zipCode}
                            onChangeText={(text) => setZipCode(text)}
                            placeholder="Enter your ZIP code"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>PHONE NO.</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📱</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={(text) => setPhone(text)}
                            placeholder="Enter your phone number"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <View style={[styles.iconContainer, styles.infoIconContainer]}>
                        <Text style={styles.icon}>ℹ️</Text>
                    </View>
                    <Text style={styles.infoText}>
                        Your phone number will be used to contact you for delivery coordination.
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !isFormValid && styles.continueButtonDisabled
                    ]}
                    onPress={handleContinue}
                    disabled={!isFormValid || isLoading}
                    activeOpacity={0.7}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.continueButtonText}>CONTINUE TO PAYMENT</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    formContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    infoIconContainer: {
        backgroundColor: '#E3F2FD',
    },
    icon: {
        fontSize: 18,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1.5,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        flex: 1,
        borderBottomWidth: 1.5,
        borderBottomColor: '#ddd',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333',
    },
    pickerUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1.5,
        backgroundColor: '#ddd',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        marginLeft: 51, 
        fontStyle: 'italic',
    },
    infoBox: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    continueButtonDisabled: {
        backgroundColor: '#BDBDBD',
        elevation: 0,
        shadowOpacity: 0,
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Checkout;