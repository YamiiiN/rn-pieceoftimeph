import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert,
    ScrollView, Modal
} from "react-native";
import { TextInput, Divider, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Error from "../Shared/Error";
import { useAuth } from "../../Context/Auth";
import baseURL from '../../assets/common/baseUrl';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from "react-native-vector-icons/FontAwesome";

const JSDatePicker = ({ isVisible, onClose, onSelect, initialDate, minDate }) => {
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date());

    // Generate year options (current year + 5 years ahead)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

    // Month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Calculate days in selected month
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
    const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());

    // Update days when month/year changes
    useEffect(() => {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [selectedMonth, selectedYear]);

    // Handle confirm selection
    const handleConfirm = () => {
        const newDate = new Date(selectedYear, selectedMonth, selectedDay);

        // Check if the date is before minDate
        if (minDate && newDate < minDate) {
            Alert.alert("Invalid Date", "Please select a date after the minimum allowed date.");
            return;
        }

        onSelect(newDate);
        onClose();
    };

    if (!isVisible) return null;

    // Generate day options based on selected month/year
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={jsDatePickerStyles.modalOverlay}>
                <View style={jsDatePickerStyles.modalContent}>
                    <Text style={jsDatePickerStyles.modalTitle}>Select Date</Text>

                    <View style={jsDatePickerStyles.pickerRow}>
                        {/* Month Picker */}
                        <View style={jsDatePickerStyles.pickerColumn}>
                            <Text style={jsDatePickerStyles.pickerLabel}>Month</Text>
                            <ScrollView
                                style={jsDatePickerStyles.scrollPicker}
                                showsVerticalScrollIndicator={false}
                            >
                                {months.map((month, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            jsDatePickerStyles.pickerItem,
                                            selectedMonth === index && jsDatePickerStyles.selectedItem
                                        ]}
                                        onPress={() => setSelectedMonth(index)}
                                    >
                                        <Text
                                            style={[
                                                jsDatePickerStyles.pickerItemText,
                                                selectedMonth === index && jsDatePickerStyles.selectedItemText
                                            ]}
                                        >
                                            {month}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Day Picker */}
                        <View style={jsDatePickerStyles.pickerColumn}>
                            <Text style={jsDatePickerStyles.pickerLabel}>Day</Text>
                            <ScrollView
                                style={jsDatePickerStyles.scrollPicker}
                                showsVerticalScrollIndicator={false}
                            >
                                {days.map((day) => (
                                    <TouchableOpacity
                                        key={day}
                                        style={[
                                            jsDatePickerStyles.pickerItem,
                                            selectedDay === day && jsDatePickerStyles.selectedItem
                                        ]}
                                        onPress={() => setSelectedDay(day)}
                                    >
                                        <Text
                                            style={[
                                                jsDatePickerStyles.pickerItemText,
                                                selectedDay === day && jsDatePickerStyles.selectedItemText
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Year Picker */}
                        <View style={jsDatePickerStyles.pickerColumn}>
                            <Text style={jsDatePickerStyles.pickerLabel}>Year</Text>
                            <ScrollView
                                style={jsDatePickerStyles.scrollPicker}
                                showsVerticalScrollIndicator={false}
                            >
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            jsDatePickerStyles.pickerItem,
                                            selectedYear === year && jsDatePickerStyles.selectedItem
                                        ]}
                                        onPress={() => setSelectedYear(year)}
                                    >
                                        <Text
                                            style={[
                                                jsDatePickerStyles.pickerItemText,
                                                selectedYear === year && jsDatePickerStyles.selectedItemText
                                            ]}
                                        >
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={jsDatePickerStyles.buttonRow}>
                        <TouchableOpacity
                            style={[jsDatePickerStyles.button, jsDatePickerStyles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={jsDatePickerStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[jsDatePickerStyles.button, jsDatePickerStyles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={jsDatePickerStyles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const PromotionForm = (props) => {
    const { user, token } = useAuth();
    const navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week later
    const [error, setError] = useState('');
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // JS Date Picker visibility states
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Check if user is admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            Alert.alert("Access Denied", "Only admin users can access this screen");
            navigation.navigate('MainNavigator');
        }
    }, [user]);

    // Fetch products for dropdown
    // Fetch products for dropdown
    // Fetch products for dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const response = await fetch(`${baseURL}/product/get/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const result = await response.json();
                // console.log('API Response:', result);

                if (response.ok) {
                    // Access the products array from the response
                    setProducts(result.products || []); // Use result.products instead of result
                } else {
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Failed to load products",
                        text2: result.message || "Please try again later"
                    });
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Network error",
                    text2: "Please check your connection"
                });
                setProducts([]); // Ensure products is always an array
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [token]);

    // Load promotion data if editing
    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            const itemData = props.route.params.item;
            setItem(itemData);
            setTitle(itemData.title);
            setDescription(itemData.description || '');
            setProduct(itemData.product ? itemData.product._id : '');
            setDiscountPercentage(itemData.discountPercentage.toString());
            setStartDate(new Date(itemData.startDate));
            setEndDate(new Date(itemData.endDate));
        }
    }, [props.route.params]);

    // Date handlers
    const handleStartDateSelect = (date) => {
        setStartDate(date);

        // If end date is before start date, update end date
        if (endDate < date) {
            setEndDate(new Date(date.getTime() + 24 * 60 * 60 * 1000)); // Next day
        }
    };

    const handleEndDateSelect = (date) => {
        setEndDate(date);
    };

    const validateForm = () => {
        if (
            title === "" ||
            product === "" ||
            discountPercentage === ""
        ) {
            setError("Please fill in all required fields");
            return false;
        }

        const discountValue = parseFloat(discountPercentage);
        if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
            setError("Discount percentage must be between 1 and 100");
            return false;
        }

        if (startDate >= endDate) {
            setError("End date must be after start date");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const promotionData = {
            title,
            description,
            product,
            discountPercentage: parseFloat(discountPercentage),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            isActive: true
        };

        try {
            if (item !== null) {
                // Update existing promotion
                await fetch(`${baseURL}/promotions/${item._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(promotionData)
                });

                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Promotion successfully updated",
                    text2: ""
                });
            } else {
                // Create new promotion
                await fetch(`${baseURL}/promotions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(promotionData)
                });

                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "New promotion added",
                    text2: ""
                });
            }

            setTimeout(() => {
                navigation.navigate("Promotions");
            }, 2000); // Short delay to show toast
        } catch (error) {
            console.log(error);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Failed to process promotion",
                text2: "Please try again"
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
        >
            <View style={styles.formHeader}>
                <Text style={styles.formTitle}>{item ? "Edit Promotion" : "Add New Promotion"}</Text>
                <Text style={styles.formSubtitle}>Create special offers and discounts for your products</Text>
                <Divider style={styles.divider} />
            </View>

            <Text style={styles.sectionTitle}>Promotion Details</Text>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Promotion Title *</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter promotion title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.textInput}
                    outlineColor="#ddd"
                    activeOutlineColor="#3498db"
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter promotion description"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                    style={[styles.textInput, styles.textAreaInput]}
                    outlineColor="#ddd"
                    activeOutlineColor="#3498db"
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Select Product *</Text>
                <View style={styles.pickerContainer}>
                    {loadingProducts ? (
                        <ActivityIndicator size="small" color="#555" />
                    ) : (
                        <Picker
                            selectedValue={product}
                            onValueChange={setProduct}
                            dropdownIconColor="#555"
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a product" value="" />
                            {products && products.length > 0 ? (
                                products.map((prod) => (
                                    <Picker.Item
                                        key={prod._id}
                                        label={prod.name}
                                        value={prod._id}
                                    />
                                ))
                            ) : (
                                <Picker.Item label="No products available" value="" enabled={false} />
                            )}
                        </Picker>
                    )}
                </View>
            </View>


            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Discount Percentage *</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter discount percentage"
                    value={discountPercentage}
                    keyboardType="numeric"
                    onChangeText={setDiscountPercentage}
                    style={styles.textInput}
                    outlineColor="#ddd"
                    activeOutlineColor="#3498db"
                    left={<TextInput.Icon icon="percent" color="#555" />}
                />
            </View>

            <Text style={styles.sectionTitle}>Promotion Duration</Text>

            <View style={styles.dateContainer}>
                <View style={styles.dateInputContainer}>
                    <Text style={styles.inputLabel}>Start Date *</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowStartDatePicker(true)}
                    >
                        <Icon name="calendar" size={16} color="#555" style={styles.dateIcon} />
                        <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                    </TouchableOpacity>

                    {/* Custom JS Date Picker for Start Date */}
                    <JSDatePicker
                        isVisible={showStartDatePicker}
                        onClose={() => setShowStartDatePicker(false)}
                        onSelect={handleStartDateSelect}
                        initialDate={startDate}
                        minDate={new Date()}
                    />
                </View>

                <View style={styles.dateInputContainer}>
                    <Text style={styles.inputLabel}>End Date *</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowEndDatePicker(true)}
                    >
                        <Icon name="calendar" size={16} color="#555" style={styles.dateIcon} />
                        <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                    </TouchableOpacity>

                    {/* Custom JS Date Picker for End Date */}
                    <JSDatePicker
                        isVisible={showEndDatePicker}
                        onClose={() => setShowEndDatePicker(false)}
                        onSelect={handleEndDateSelect}
                        initialDate={endDate}
                        minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                    />
                </View>
            </View>

            {error ? <Error message={error} /> : null}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.navigate('Promotions')}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {item ? "Update Promotion" : "Add Promotion"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    formHeader: {
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    divider: {
        backgroundColor: '#ddd',
        height: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 12,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    inputLabel: {
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 14,
        color: '#555',
    },
    textInput: {
        backgroundColor: '#fff',
        fontSize: 14,
    },
    textAreaInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        color: '#333',
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
    },
    dateInputContainer: {
        width: "48%",
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    dateIcon: {
        marginRight: 8,
    },
    dateText: {
        color: '#333',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 36,
    },
    cancelButton: {
        width: '48%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#555',
        fontWeight: '600',
        fontSize: 16,
    },
    submitButton: {
        width: '48%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#3498db',
        elevation: 2,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

const jsDatePickerStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    scrollPicker: {
        height: 180,
        backgroundColor: '#f7f7f7',
        borderRadius: 5,
    },
    pickerItem: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedItem: {
        backgroundColor: '#e6f2ff',
    },
    pickerItemText: {
        fontSize: 16,
    },
    selectedItemText: {
        fontWeight: 'bold',
        color: '#3498db',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#555',
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#3498db',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default PromotionForm;