import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
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
    const [localSelectedItems, setLocalSelectedItems] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();

    const selectedItems = useSelector(state => state.cart.selectedItemsForCheckout) || [];

    // useEffect(() => {
    //     console.log("Selected items from Redux:", selectedItems);
    // }, [selectedItems]); // pang debug incase

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
            });
            return;
        }
        navigation.navigate('Payment', {
            shippingData: { address, barangay, city, zipCode, phone },
            selectedItems: selectedItems
        });
    };
    const renderDebugInfo = () => (
        <View style={{ padding: 10, backgroundColor: '#f8f8f8', marginBottom: 10 }}>
            <Text>Selected Items Count: {localSelectedItems.length}</Text>
            {localSelectedItems.map((item, index) => (
                <Text key={index}>{item.name} - ₱{item.price}</Text>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>ADDRESS</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                        placeholder="Enter your address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>CITY</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={city}
                            style={styles.picker}
                            onValueChange={(itemValue) => setCity(itemValue)}
                        >
                            <Picker.Item label="Select City" value="" />
                            {Object.keys(citiesWithBarangays).map((cityName) => (
                                <Picker.Item key={cityName} label={cityName} value={cityName} />
                            ))}
                        </Picker>
                        <View style={styles.pickerUnderline}></View>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>BARANGAY</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={barangay}
                            style={styles.picker}
                            onValueChange={(itemValue) => setBarangay(itemValue)}
                            enabled={city !== ''}
                        >
                            <Picker.Item label="Select Barangay" value="" />
                            {availableBarangays.map((barangayName, index) => (
                                <Picker.Item key={index} label={barangayName} value={barangayName} />
                            ))}
                        </Picker>
                        <View style={styles.pickerUnderline}></View>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>ZIPCODE</Text>
                    <TextInput
                        style={styles.input}
                        value={zipCode}
                        onChangeText={(text) => setZipCode(text)}
                        placeholder="Enter your ZIP code"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>PHONE NO.</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={(text) => setPhone(text)}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={[styles.continueButton,
                !isFormValid && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                disabled={!isFormValid}
            >
                <Text style={styles.continueButtonText}>CONTINUE TO PAYMENT</Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 10,
    },
    pickerContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 0,
        color: '#333',
        marginBottom: 5
    },
    pickerUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#ccc',
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        margin: 20,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
    },
    continueButtonDisabled: {
        backgroundColor: '#BDBDBD',
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Checkout;
