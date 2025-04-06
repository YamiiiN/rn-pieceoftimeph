import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { MaterialIcons, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../Context/Auth';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        role: '',
    });
    const navigation = useNavigation();
    const { token, user, logout } = useAuth();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseURL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.user) {
                setUserData({
                    firstName: data.user.first_name,
                    lastName: data.user.last_name,
                    fullName: `${data.user.first_name} ${data.user.last_name}`,
                    email: data.user.email,
                    role: data.user.role || 'user',
                });

                if (data.user.images && data.user.images.length > 0) {
                    setImage(data.user.images[0].url);
                }
            } else {
                setError(data.message || 'Failed to load profile');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const saveProfile = async () => {
        try {
            setLoading(true);

            console.log('Data ready to send:', {
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                images: image,  // Debugging
            });

            const formData = new FormData();
            formData.append('first_name', userData.firstName);
            formData.append('last_name', userData.lastName);
            formData.append('email', userData.email);

            if (Array.isArray(image) && image.length > 0) {
                image.forEach((img, index) => {
                    if (img.uri && img.uri.startsWith('file://')) {
                        const fileName = img.uri.split('/').pop();
                        const fileType = fileName.split('.').pop();

                        formData.append(`images`, {
                            uri: img.uri,
                            name: fileName,
                            type: `image/${fileType}`,
                        });
                    }
                });
            } else if (image?.uri && image.uri.startsWith('file://')) {
                // If it's a single image, convert it into an array before sending
                const fileName = image.uri.split('/').pop();
                const fileType = fileName.split('.').pop();

                formData.append('images', {
                    uri: image.uri,
                    name: fileName,
                    type: `image/${fileType}`,
                });
            }

            console.log('FormData before sending:', formData);

            const response = await axios.put(`${baseURL}/user/profile/update`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Server response:', response.data);

            // Ensure images array is updated correctly
            setUserData({
                ...userData,
                firstName: response.data.user.first_name,
                lastName: response.data.user.last_name,
                email: response.data.user.email,
                images: response.data.user.images || userData.images, // ✅ Ensure updated images are reflected
            });

            Alert.alert('Success', 'Profile updated successfully.');

            setTimeout(fetchUserProfile, 2000);

        } catch (err) {
            console.error('Profile update error:', err.response?.data || err.message);
            setError('Network error. Please try again later.');
            Alert.alert('Error', err.response?.data?.message || 'Network error. Please try again later.');
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        logout();
                        navigation.navigate('User', { screen: 'Login' });
                    }
                }
            ]
        );
    };


    const pickImage = async () => {
        if (!isEditing) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        if (!isEditing) return;

        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status === "granted") {
            let result = await ImagePicker.launchCameraAsync({
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
    };

    if (loading && !isEditing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#757575" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderEditForm = () => (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>FIRST NAME</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="person" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.firstName}
                        onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                        placeholder="Enter your first name"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>LAST NAME</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="person" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.lastName}
                        onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                        placeholder="Enter your last name"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="email-outline" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.email}
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                        keyboardType="email-address"
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>



            <View style={styles.spacer} />
        </ScrollView>
    );

    const renderProfileView = () => (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="person" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.fullName}
                        editable={false}
                        placeholder="Your full name"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="email-outline" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.email}
                        editable={false}
                        placeholder="Your email"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>


            <View style={styles.spacer} />
        </ScrollView>
    );
       const renderButtons = () => (
        <View style={styles.footer}>
            {isEditing ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={toggleEditing}>
                        <Text style={styles.cancelButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                        <Text style={styles.saveButtonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.verticalButtonContainer}>
                    <TouchableOpacity 
                        style={styles.editProfileButton} 
                        onPress={toggleEditing}
                    >
                        <Text style={styles.editProfileText}>EDIT PROFILE</Text>
                    </TouchableOpacity>
    
                    {userData.role === 'admin' && (
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.logoutButtonText}>LOGOUT</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#757575" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <MaterialIcons name="person" size={30} color="black" />
                        )}


                        {isEditing && (
                            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                                <View style={styles.cameraIconContainer}>
                                    <Feather name="camera" size={16} color="white" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userData.fullName}</Text>
                        <Text style={styles.profileEmail}>{userData.email}</Text>

                        {isEditing && (
                            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                                <Text style={styles.galleryButtonText}>Change Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {isEditing ? renderEditForm() : renderProfileView()}

                {renderButtons()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#757575',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'white',
    },
    profileImage: {
        width: 66,
        height: 66,
        borderRadius: 33,
    },
    cameraButton: {
        position: 'absolute',
        bottom: -5,
        right: -5,
    },
    cameraIconContainer: {
        backgroundColor: '#555',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    galleryButton: {
        marginTop: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    galleryButtonText: {
        color: 'white',
        fontSize: 12,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        color: 'white',
        fontSize: 14,
    },
    formContainer: {
        flex: 1,
        padding: 20,
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
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1.5,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        padding: 5,
    },
    spacer: {
        height: 20,
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    verticalButtonContainer: {
        flexDirection: 'column',
        gap: 10, // Adds space between buttons
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#757575',
        padding: 15,
        borderRadius: 8,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    editProfileButton: {
        width: '100%', // Takes full width
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    editProfileText: {
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        width: '100%', // Takes full width
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Profile;