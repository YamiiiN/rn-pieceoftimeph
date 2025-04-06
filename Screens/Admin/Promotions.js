import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, 
    ActivityIndicator, RefreshControl, Alert
} from "react-native";
import { Surface, Badge, FAB, Searchbar, Divider } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-toast-message";
import { useAuth } from "../../Context/Auth";
import baseURL from '../../assets/common/baseUrl';
import { SafeAreaView } from "react-native-safe-area-context";

const Promotions = () => {
    const { token, user } = useAuth();
    const navigation = useNavigation();
    
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    
    const isAdmin = user && user.role === 'admin';

    const fetchPromotions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseURL}/promotions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (response.ok) {
                const sortedPromotions = data.promotions.sort((a, b) => {
                    // Sort by active status first, then by start date
                    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
                    return new Date(a.startDate) - new Date(b.startDate);
                });
                
                setPromotions(sortedPromotions);
                setFilteredPromotions(sortedPromotions);
            } else {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Failed to load promotions",
                    text2: data.message || "Please try again later"
                });
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Network error",
                text2: "Please check your connection"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    useFocusEffect(
        useCallback(() => {
            fetchPromotions();
        }, [fetchPromotions])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchPromotions();
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setFilteredPromotions(promotions);
        } else {
            const filtered = promotions.filter(
                item => 
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    (item.product && item.product.name && 
                     item.product.name.toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredPromotions(filtered);
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Promotion",
            "Are you sure you want to delete this promotion?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => deletePromotion(id)
                }
            ]
        );
    };

    const deletePromotion = async (id) => {
        try {
            const response = await fetch(`${baseURL}/promotions/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                setPromotions(promotions.filter(item => item._id !== id));
                setFilteredPromotions(filteredPromotions.filter(item => item._id !== id));
                
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Promotion deleted successfully"
                });
            } else {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Failed to delete promotion"
                });
            }
        } catch (error) {
            console.error("Error deleting promotion:", error);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Network error",
                text2: "Please check your connection"
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusStyle = (promotion) => {
        const currentDate = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        
        if (!promotion.isActive) {
            return styles.inactiveStatus;
        } else if (currentDate < startDate) {
            return styles.upcomingStatus;
        } else if (currentDate > endDate) {
            return styles.expiredStatus;
        } else {
            return styles.activeStatus;
        }
    };

    const getStatusText = (promotion) => {
        const currentDate = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        
        if (!promotion.isActive) {
            return "Inactive";
        } else if (currentDate < startDate) {
            return "Upcoming";
        } else if (currentDate > endDate) {
            return "Expired";
        } else {
            return "Active";
        }
    };

    const renderItem = ({ item }) => {
        const statusStyle = getStatusStyle(item);
        const statusText = getStatusText(item);
        
        return (
            <Surface style={styles.itemContainer}>
                <View style={styles.mainContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={[styles.statusBadge, statusStyle]}>
                            <Text style={styles.statusText}>{statusText}</Text>
                        </View>
                    </View>
                
                    <View style={styles.productRow}>
                        <Text style={styles.productLabel}>Category: </Text>
                        <Text style={styles.productName} numberOfLines={1}>
                            {item.category}
                        </Text>
                    </View>
                    
                    <View style={styles.detailsRow}>
                        <View style={styles.detail}>
                            <Icon name="percentage" size={12} color="#666" />
                            <Text style={styles.detailText}>
                                {item.discountPercentage}% Off
                            </Text>
                        </View>
                        
                        <View style={styles.detail}>
                            <Icon name="calendar-alt" size={12} color="#666" />
                            <Text style={styles.detailText}>
                                {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </Text>
                        </View>
                    </View>
                    
                    <Text style={styles.description} numberOfLines={2}>
                        {item.description || "No description provided."}
                    </Text>
                </View>
                
                {isAdmin && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => navigation.navigate("PromotionForm", { item })}
                        >
                            <Icon name="edit" size={16} color="#3498db" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => confirmDelete(item._id)}
                        >
                            <Icon name="trash-alt" size={16} color="#e74c3c" />
                        </TouchableOpacity>
                    </View>
                )}
            </Surface>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Promotions</Text>
                <Text style={styles.headerSubtitle}>
                    Manage special offers and discounts
                </Text>
            </View>
            
            <Searchbar
                placeholder="Search promotions..."
                onChangeText={handleSearch}
                value={searchQuery}
                style={styles.searchbar}
                inputStyle={styles.searchInput}
            />
            
            {loading && !refreshing ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#3498db" />
                </View>
            ) : filteredPromotions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="percentage" size={50} color="#ccc" />
                    <Text style={styles.emptyText}>No promotions found</Text>
                    {searchQuery ? (
                        <Text style={styles.emptySubtext}>
                            Try adjusting your search criteria
                        </Text>
                    ) : (
                        <Text style={styles.emptySubtext}>
                            Create your first promotion to get started
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContent}
                    data={filteredPromotions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#3498db"]}
                        />
                    }
                />
            )}
            
            {isAdmin && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    color="white"
                    onPress={() => navigation.navigate("PromotionForm")}
                    label="New Promotion"
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    header: {
        padding: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#666",
    },
    searchbar: {
        margin: 16,
        borderRadius: 8,
        elevation: 2,
    },
    searchInput: {
        fontSize: 14,
    },
    listContent: {
        padding: 16,
        paddingBottom: 86, // Space for FAB
    },
    itemContainer: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 2,
        flexDirection: "row",
    },
    mainContent: {
        flex: 1,
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginLeft: 8,
    },
    activeStatus: {
        backgroundColor: "#e8f7ed",
    },
    inactiveStatus: {
        backgroundColor: "#f0f0f0",
    },
    upcomingStatus: {
        backgroundColor: "#e8f4fc",
    },
    expiredStatus: {
        backgroundColor: "#feeced",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
    productRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    productLabel: {
        color: "#666",
        fontSize: 14,
    },
    productName: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500",
        flex: 1,
    },
    detailsRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    detail: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
    },
    detailText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    description: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
    actionsContainer: {
        justifyContent: "center",
        borderLeftWidth: 1,
        borderLeftColor: "#eeeeee",
    },
    actionButton: {
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    editButton: {
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 8,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#3498db",
        borderRadius: 28,
    },
});

export default Promotions;