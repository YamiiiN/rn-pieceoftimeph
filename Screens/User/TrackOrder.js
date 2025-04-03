import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

const TrackOrder = ({ route, navigation }) => {
    const { order } = route.params;

    const formatDate = (dateString) => {
        return moment(dateString).format('ddd MMMM DD, YYYY');
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.productItem}>
            <View style={styles.productDetails}>
                <Text style={styles.productName}>
                    {item.product?.name || 'Product'}
                </Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>
                ₱{(item.product?.sell_price * item.quantity).toFixed(2)}
            </Text>
        </View>
    );

    const getTrackingStatus = (status) => {
        const allStatuses = ['Pending', 'Confirmed', 'Processed', 'Dispatched', 'Out for Delivery', 'Delivered'];
        const currentIndex = allStatuses.indexOf(status);

        return allStatuses.map((step, index) => ({
            label: step,
            isCompleted: index <= currentIndex,
            isCurrent: index === currentIndex,
            icon: getStatusIcon(step)
        }));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return '⏳';
            case 'Confirmed': return '✓';
            case 'Processed': return '📦';
            case 'Dispatched': return '🚚';
            case 'Out for Delivery': return '🏃';
            case 'Delivered': return '🏠';
            default: return '•';
        }
    };

    const trackingSteps = getTrackingStatus(order.status || 'Pending');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#4CD964';
            case 'Confirmed': return '#4CD964';
            case 'Processed': return '#4CD964';
            case 'Dispatched': return '#4CD964';
            case 'Out for Delivery': return '#4CD964';
            case 'Delivered': return '#4CD964';
            default: return '#4CD964';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Current Status Banner */}
                <View style={[styles.statusBanner, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusBannerText}>
                        {order.status || 'Pending'}
                    </Text>
                    <Text style={styles.statusDescription}>
                        {getStatusDescription(order.status)}
                    </Text>
                </View>

                {/* Order Info */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>ORDER INFORMATION</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Order Number:</Text>
                            <Text style={styles.infoValue}>{order._id}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Order Date:</Text>
                            <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Payment Method:</Text>
                            <Text style={styles.infoValue}>{order.payment_method || 'Not specified'}</Text>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>ORDER ITEMS</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <FlatList
                            data={order.order_items || []}
                            renderItem={renderOrderItem}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                        />

                        <View style={styles.divider} />

                        <View style={styles.totalSection}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal:</Text>
                                <Text style={styles.totalValue}>
                                    ₱{order.totalPrice ? (order.totalPrice - (order.shippingFee || 0)).toFixed(2) : '0.00'}
                                </Text>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Shipping Fee:</Text>
                                <Text style={styles.totalValue}>₱{order.shippingFee?.toFixed(2) || '0.00'}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabelBold}>Total:</Text>
                                <Text style={styles.totalValueBold}>₱{order.totalPrice?.toFixed(2) || '0.00'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tracking Progress */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>TRACKING PROGRESS</Text>
                    </View>

                    <View style={styles.cardContent}>
                        {trackingSteps.map((step, index) => (
                            <View key={index} style={styles.progressStep}>
                                <View style={[
                                    styles.iconContainer,
                                    step.isCompleted ? { backgroundColor: getStatusColor(step.label) } : styles.pendingIconContainer,
                                    step.isCurrent ? styles.currentIconContainer : null
                                ]}>
                                    <Text style={styles.statusIcon}>{step.icon}</Text>
                                </View>

                                <View style={styles.stepInfoContainer}>
                                    <Text style={[
                                        styles.progressLabel,
                                        step.isCurrent ? { fontWeight: 'bold', color: getStatusColor(step.label) } : null,
                                        step.isCompleted && !step.isCurrent ? { color: '#333' } : null
                                    ]}>
                                        {step.label}
                                    </Text>

                                </View>

                                {index < trackingSteps.length - 1 && (
                                    <View style={[
                                        styles.progressLine,
                                        step.isCompleted ? { backgroundColor: getStatusColor(step.label) } : styles.pendingLine
                                    ]} />
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Shipping Address */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>SHIPPING DETAILS</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>📍</Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>DELIVERY ADDRESS</Text>
                                <Text style={styles.addressText}>{order.shipping_address || 'No address provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>📱</Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>CONTACT NUMBER</Text>
                                <Text style={styles.contactText}>{order.contact_number || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.shippingItem}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>🚚</Text>
                            </View>
                            <View style={styles.shippingDetails}>
                                <Text style={styles.shippingLabel}>DELIVERY METHOD</Text>
                                <Text style={styles.contactText}>Standard Delivery (3-5 days)</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// Helper function to get status descriptions
const getStatusDescription = (status) => {
    switch (status) {
        case 'Pending':
            return 'Your order has been received';
        case 'Confirmed':
            return 'Your order has been confirmed';
        case 'Processed':
            return 'Your order is being prepared';
        case 'Dispatched':
            return 'Your order has left our warehouse';
        case 'Out for Delivery':
            return 'Your order is on its way to you';
        case 'Delivered':
            return 'Your order has been delivered';
        default:
            return 'Your order is being processed';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'white',
        elevation: 2,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    statusBanner: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
    },
    statusBannerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusDescription: {
        color: 'white',
        fontSize: 14,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardHeader: {
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContent: {
        padding: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#777',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    progressStep: {
        position: 'relative',
        flexDirection: 'row',
        marginBottom: 30,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    pendingIconContainer: {
        backgroundColor: '#e0e0e0',
    },
    currentIconContainer: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    statusIcon: {
        fontSize: 16,
    },
    stepInfoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    progressLabel: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
    },
    timestampText: {
        fontSize: 12,
        color: '#999',
    },
    progressLine: {
        position: 'absolute',
        left: 18,
        top: 36,
        width: 2,
        height: 30,
        backgroundColor: '#4CAF50',
    },
    pendingLine: {
        backgroundColor: '#e0e0e0',
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    productQuantity: {
        fontSize: 13,
        color: '#777',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#eeeeee',
        marginVertical: 12,
    },
    totalSection: {
        paddingTop: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#777',
    },
    totalValue: {
        fontSize: 14,
        color: '#333',
    },
    totalLabelBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValueBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    shippingItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    shippingDetails: {
        flex: 1,
    },
    shippingLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    contactText: {
        fontSize: 14,
        color: '#333',
    },
    icon: {
        fontSize: 18,
    },
    actionButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 8,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default TrackOrder;