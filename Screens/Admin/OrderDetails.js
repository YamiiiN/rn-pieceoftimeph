import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from 'react-redux';
import Toast from "react-native-toast-message";
import { useAuth } from '../../Context/Auth';
import { updateOrderStatus } from '../../Redux/Actions/orderActions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderDetails = ({ route }) => {
    const { order } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { token } = useAuth();
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const getAvailableStatuses = (currentStatus) => {
        switch (currentStatus) {
            case "Pending":
                return ["Pending", "Confirmed", "Processed", "Dispatched", "Out For Delivery", "Delivered"];
            case "Confirmed":
                return ["Confirmed", "Processed", "Dispatched", "Out For Delivery", "Delivered"];
            case "Processed":
                return ["Processed", "Dispatched", "Out For Delivery", "Delivered"];
            case "Dispatched":
                return ["Dispatched", "Out For Delivery", "Delivered"];
            case "Out For Delivery":
                return ["Out For Delivery", "Delivered"];
            case "Delivered":
                return ["Delivered"];
            default:
                return ["Pending", "Confirmed", "Processed", "Dispatched", "Out For Delivery", "Delivered"];
        }
    };

    const handleUpdateOrder = () => {
        if (token && selectedStatus !== order.status) {
            dispatch(updateOrderStatus(order._id, selectedStatus, token));
            Toast.show({
                type: "success",
                position: "top",
                text1: "Order Status Updated",
                text2: "Status has been updated successfully",
            });

            setTimeout(() => {
                navigation.navigate('Orders');
            }, 2000);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "#FFA500";
            case "Confirmed": return "#3498DB";
            case "Processed": return "#9B59B6";
            case "Dispatched": return "#F1C40F";
            case "Out For Delivery": return "#E67E22";
            case "Delivered": return "#2ECC71";
            default: return "#95A5A6";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Order Information Section */}
                <View style={styles.infoCard}>
                    <View style={styles.rowBetween}>
                        <View style={styles.labelValueColumn}>
                            <Text style={styles.infoLabel}>Order ID</Text>
                            <Text style={styles.infoValue}>
                                {order._id ? order._id.slice(0, -8) : "D34261244667".slice(0, -8)}
                            </Text>
                        </View>
                        <View style={styles.labelValueColumn}>
                            <Text style={styles.infoLabel}>Ordered Date</Text>
                            <Text style={styles.infoValue}>
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) || "Wed May 22, 2024"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Customer Info Section */}
                <View style={styles.infoCard}>
                    <View style={styles.customerSection}>
                        <View style={styles.profileCircle}>
                            <Image
                                source={
                                    order.user?.images?.[0]?.url
                                        ? { uri: order.user.images[0].url }
                                        : require('../../assets/icon.png')
                                }
                                style={styles.avatar}
                            />
                        </View>
                        <Text style={styles.customerName}>
                            {order.user?.first_name} {order.user?.last_name}
                        </Text>
                    </View>

                    <View style={styles.contactInfoSection}>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>Phone</Text>
                            <Text style={styles.contactValue}>{order.contact_number || "09454058654"}</Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>Email</Text>
                            <Text style={styles.contactValue}>{order.user?.email || "tinverona@gmail.com"}</Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>Address</Text>
                            <Text style={styles.contactValue}>{order.shipping_address || "Blk 66 Lot 4 Phase 3 Upper Bicutan, Taguig City 1544"}</Text>
                        </View>
                    </View>
                </View>

                {/* Products Table */}
                <View style={styles.infoCard}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.noColumn]}>No.</Text>
                        <Text style={[styles.tableHeaderCell, styles.productColumn]}>Product</Text>
                        <Text style={[styles.tableHeaderCell, styles.quantityColumn]}>Quantity</Text>
                    </View>

                    {(order.order_items || [
                        { product: { name: "Rolex Datejust" }, quantity: 3 },
                        { product: { name: "Omega Speed Master OG" }, quantity: 1 },
                        { product: { name: "Rolex Daytona Silver" }, quantity: 2 }
                    ]).map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.noColumn]}>{index + 1}</Text>
                            <Text style={[styles.tableCell, styles.productColumn]}>
                                {item.product?.name || `Product ${index + 1}`}
                            </Text>
                            <Text style={[styles.tableCell, styles.quantityColumn]}>
                                {item.quantity}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Track Order Section */}
                <TouchableOpacity style={styles.trackOrderCard} onPress={() => { }}>
                    <Text style={styles.trackOrderText}>Track Order</Text>
                    <Icon name="keyboard-arrow-up" size={24} color="#333" />
                </TouchableOpacity>

                {/* Update Status Section */}
                <View style={styles.orderSection}>
                    <View style={styles.orderHeader}>
                        <Text style={styles.sectionTitle}>UPDATE STATUS</Text>
                    </View>

                    <View style={styles.orderContent}>
                        <Text style={styles.updateInstructions}>
                            Select a new status to update this order
                        </Text>

                        <View style={styles.pickerContainer}>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedStatus}
                                onValueChange={(value) => setSelectedStatus(value)}
                                mode="dropdown"
                            >
                                {getAvailableStatuses(order.status).map((status) => (
                                    <Picker.Item
                                        key={status}
                                        label={status}
                                        value={status}
                                        enabled={status !== "Pending" || order.status === "Pending"}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.updateButton,
                                selectedStatus === order.status ? styles.disabledButton : {}
                            ]}
                            onPress={handleUpdateOrder}
                            disabled={selectedStatus === order.status}
                        >
                            <Text style={styles.buttonText}>Update Status</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        elevation: 2,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333333",
    },
    placeholder: {
        width: 40,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelValueColumn: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#777777',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    customerSection: {
        alignItems: 'center',
        marginBottom: 15,
    },
    profileCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    contactInfoSection: {
        marginTop: 8,
    },
    contactRow: {
        marginBottom: 10,
    },
    contactLabel: {
        fontSize: 12,
        color: '#777777',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 14,
        color: '#333333',
    },
    // Products table styles
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        paddingBottom: 8,
        marginBottom: 8,
    },
    tableHeaderCell: {
        fontWeight: '600',
        fontSize: 12,
        color: '#777777',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    tableCell: {
        fontSize: 14,
        color: '#333333',
    },
    noColumn: {
        width: '10%',
    },
    productColumn: {
        width: '65%',
    },
    quantityColumn: {
        width: '25%',
        textAlign: 'right',
    },
    // Track order section
    trackOrderCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trackOrderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    // Update status section
    orderSection: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionTitle: {
        fontWeight: '700',
        fontSize: 14,
        color: '#555555',
    },
    orderContent: {
        padding: 15,
    },
    updateInstructions: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 15,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    updateButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#CCCCCC",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default OrderDetails;