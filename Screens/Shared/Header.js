import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../Context/Auth';
import Toast from 'react-native-toast-message';

const Header = ({ searchQuery, onSearchChange }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-280)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const navigation = useNavigation();
    const { logout } = useAuth();

    const toggleDrawer = () => {
        if (drawerVisible) {
            closeDrawer();
        } else {
            openDrawer();
        }
    };

    const openDrawer = () => {
        setDrawerVisible(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0.5,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closeDrawer = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -280,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setDrawerVisible(false);
        });
    };

    // const handleLogout = async () => {
    //     try {
    //         // Call logout function from AuthContext
    //         await logout();

    //         // Navigate to MainNavigator after logout
    //         navigation.navigate('MainNavigator'); // Adjust this according to your navigation structure

    //         // Log success and show the toast
    //         console.log("Logout success");

    //         Toast.show({
    //             type: 'success',
    //             text1: 'Logout Successful',
    //             text2: 'You have successfully logged out. Please come again!',
    //             position: 'top',
    //         });
    //     } catch (error) {
    //         console.error("Logout Error:", error);

    //         // Show error toast if something goes wrong
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Logout Failed',
    //             text2: 'An error occurred while logging out. Please try again.',
    //             position: 'top',
    //         });
    //     }
    // };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
                <Icon name="menu-outline" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={18} color="gray" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search here..."
                    placeholderTextColor="gray"
                    value={searchQuery}
                    onChangeText={(text) => onSearchChange(text)}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearButton}>
                        <Icon name="close-circle" size={18} color="gray" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="grid-outline" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="notifications-outline" size={22} color="black" />
                </TouchableOpacity>
            </View>


            {drawerVisible && (
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>
            )}

            {/* Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX: slideAnim }],
                    }
                ]}
            >
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Menu</Text>
                    <TouchableOpacity onPress={closeDrawer}>
                        <Icon name="close-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.drawerContent}>
                    <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('User', { screen: 'Profile' })}>
                        <Icon name="person-outline" size={22} color="#555" />
                        <Text style={styles.drawerItemText}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Icon name="heart-outline" size={22} color="#555" />
                        <Text style={styles.drawerItemText}>Favourites</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('User', { screen: 'MyOrder' })}>
                        <Icon name="receipt-outline" size={22} color="#555" />
                        <Text style={styles.drawerItemText}>Orders</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.drawerItem}>
                        <Icon name="log-out-outline" size={22} color="#e74c3c" />
                        <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        zIndex: 10,
    },
    menuButton: {
        marginRight: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        height: '100%',
    },
    clearButton: {
        marginLeft: 8,
    },
    rightIcons: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    iconButton: {
        marginLeft: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 100,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 250,
        height: height,
        backgroundColor: 'white',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    drawerContent: {
        flex: 1,
        paddingTop: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    drawerItemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    logoutText: {
        color: '#e74c3c',
    },
});

export default Header;