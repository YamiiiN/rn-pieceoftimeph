import React, { useState } from 'react';
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
    Image
} from 'react-native';
import { MaterialIcons, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState({
        firstName: 'Kristine Mae',
        lastName: 'Verona',
        fullName: 'Kristine Mae Verona',
        email: 'kristinemae@gmail.com',
        password: '••••••••••••••••••••',
        confirmPassword: '••••••••••••••••••••'
    });

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const saveProfile = () => {
        // Update fullName when saving
        setUserData({
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`
        });
        setIsEditing(false);
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

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <Feather name="lock" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.password}
                        onChangeText={(text) => setUserData({ ...userData, password: text })}
                        secureTextEntry={!showPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <Feather name="lock" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.confirmPassword}
                        onChangeText={(text) => setUserData({ ...userData, confirmPassword: text })}
                        secureTextEntry={!showConfirmPassword}
                        placeholder="Confirm your password"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                        <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#555" />
                    </TouchableOpacity>
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

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputRow}>
                    <View style={styles.iconContainer}>
                        <Feather name="lock" size={20} color="#555" />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={userData.password}
                        secureTextEntry={!showPassword}
                        editable={false}
                        placeholder="Your password"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#555" />
                    </TouchableOpacity>
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
                <TouchableOpacity style={styles.editProfileButton} onPress={toggleEditing}>
                    <Text style={styles.editProfileText}>EDIT PROFILE</Text>
                </TouchableOpacity>
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

                        {/* Only show camera button when editing */}
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

                        {/* Only show change photo button when editing */}
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
});

export default Profile;