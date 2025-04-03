// import React, { useState, useEffect } from "react";
// import {
//     View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert,
// } from "react-native";
// import { Surface } from "react-native-paper";
// import { Picker } from "@react-native-picker/picker";
// import { useDispatch } from 'react-redux';
// import FormContainer from "../Shared/FormContainer";
// import Input from "../Shared/Input";
// import Icon from "react-native-vector-icons/FontAwesome";
// import Toast from "react-native-toast-message";
// import Error from "../Shared/Error";
// import * as ImagePicker from "expo-image-picker";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import mime from "mime";
// import { useAuth } from "../../Context/Auth";
// import { createProduct, updateProduct } from '../../Redux/Actions/productActions';

// const ProductForm = (props) => {
//     const { user, token } = useAuth();
//     const dispatch = useDispatch();
//     const navigation = useNavigation();
    
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [category, setCategory] = useState('');
//     const [movement, setMovement] = useState('');
//     const [brand, setBrand] = useState('');
//     const [images, setImages] = useState([]);
//     const [sellPrice, setSellPrice] = useState('');
//     const [costPrice, setCostPrice] = useState('');
//     const [stockQuantity, setStockQuantity] = useState('');
//     const [categories, setCategories] = useState([]);
//     const [movements, setMovements] = useState(['Mechanical', 'Automatic', 'Quartz', 'Solar', 'Kinetic']);
//     const [brands, setBrands] = useState(['Seiko', 'Citizen', 'Rolex', 'Omega', 'Cartier', 'Breitling', 'Tudor', 'Grand Seiko']);
//     const [error, setError] = useState('');
//     const [item, setItem] = useState(null);
//     const [loading, setLoading] = useState(false);
    
//     // check if user is admin
//     useEffect(() => {
//         if (user && user.role !== 'admin') {
//             Alert.alert("Access Denied", "Only admin users can access this screen");
//             navigation.navigate('MainNavigator');
//         }
//     }, [user]);

//     useEffect(() => {
//         if (!props.route.params) {
//             setItem(null);
//         } else {
//             const itemData = props.route.params.item;
//             setItem(itemData);
//             setName(itemData.name);
//             setDescription(itemData.description);
//             setCategory(itemData.category);
//             setMovement(itemData.movement);
//             setBrand(itemData.brand);
//             setSellPrice(itemData.sell_price.toString());
//             setCostPrice(itemData.cost_price.toString());
//             setStockQuantity(itemData.stock_quantity.toString());
            
//             if (itemData.images && itemData.images.length > 0) {
//                 const formattedImages = itemData.images.map(img => ({
//                     uri: img.url,
//                     public_id: img.public_id
//                 }));
//                 setImages(formattedImages);
//             }
//         }
        
//         const categoryList = [
//             "Classic",
//             "Dive",
//             "Pilot",
//             "Field",
//             "Dress",
//             "Chronograph",
//             "Moon Phase",
//             "Vintage"
//         ];
//         setCategories(categoryList);
        
//         const movementList = [
//             "Mechanical",
//             "Automatic",
//             "Quartz",
//             "Solar",
//             "Kinetic"
//         ];
//         setMovements(movementList);
        
//         const brandList = [
//             "Seiko",
//             "Citizen",
//             "Rolex",
//             "Omega",
//             "Cartier",
//             "Breitling",
//             "Tudor",
//             "Grand Seiko"
//         ];
//         setBrands(brandList);

//         return () => {
//             setCategories([]);
//         }
//     }, [props.route.params]);

//     const pickImages = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsMultipleSelection: true,
//             aspect: [4, 3],
//             quality: 1
//         });

//         if (!result.canceled) {
//             const newImages = result.assets.map(asset => ({
//                 uri: asset.uri,
//                 type: mime.getType(asset.uri),
//                 name: asset.uri.split('/').pop()
//             }));
            
//             setImages([...images, ...newImages]);
//         }
//     };

//     const takePicture = async () => {
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
//         if (status !== 'granted') {
//             Alert.alert("Permission Denied", "Camera permission is required to take pictures");
//             return;
//         }
    
//         let result = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1
//         });
    
//         if (!result.canceled) {
//             const newImage = {
//                 uri: result.assets[0].uri,
//                 type: mime.getType(result.assets[0].uri),
//                 name: result.assets[0].uri.split('/').pop()
//             };
            
//             setImages([...images, newImage]);
//         }
//     };

//     const removeImage = (index) => {
//         let newImages = [...images];
//         newImages.splice(index, 1);
//         setImages(newImages);
//     };

//     const showImageOptions = () => {
//         Alert.alert(
//             "Add Image",
//             "Choose an option",
//             [
//                 {
//                     text: "Take Photo",
//                     onPress: takePicture
//                 },
//                 {
//                     text: "Choose from Gallery",
//                     onPress: pickImages
//                 },
//                 {
//                     text: "Cancel",
//                     style: "cancel"
//                 }
//             ],
//             { cancelable: true }
//         );
//     };

//     const validateForm = () => {
//         if (
//             name === "" ||
//             description === "" ||
//             category === "" ||
//             movement === "" ||
//             brand === "" ||
//             sellPrice === "" ||
//             costPrice === "" ||
//             stockQuantity === "" ||
//             images.length === 0
//         ) {
//             setError("Please fill in all fields and add at least one image");
//             return false;
//         }
//         return true;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) return;
        
//         setLoading(true);
//         const productData = new FormData();
        
//         productData.append("name", name);
//         productData.append("description", description);
//         productData.append("category", category);
//         productData.append("movement", movement);
//         productData.append("brand", brand);
//         productData.append("sell_price", sellPrice);
//         productData.append("cost_price", costPrice);
//         productData.append("stock_quantity", stockQuantity);
        
//         let imagesToUpload = [];
//         let existingImages = [];
        
//         images.forEach((image) => {
//             if (image.public_id) {
//                 // existing image
//                 existingImages.push({
//                     public_id: image.public_id,
//                     url: image.uri
//                 });
//             } else {
//                 // new image to upload
//                 const newImageUri = "file:///" + image.uri.split("file:/").join("");
//                 imagesToUpload.push({
//                     uri: newImageUri,
//                     type: mime.getType(newImageUri) || 'image/jpeg',
//                     name: newImageUri.split("/").pop()
//                 });
//             }
//         });
//         if (existingImages.length > 0) {
//             productData.append("existingImages", JSON.stringify(existingImages));
//         }
        
//         // add new images individually
//         imagesToUpload.forEach((img, index) => {
//             productData.append("images", img);
//         });

//             try {
//                 if (item !== null) {
//                     await dispatch(updateProduct(item._id, productData, token));
//                     Toast.show({
//                         topOffset: 60,
//                         type: "success",
//                         text1: "Product successfully updated",
//                         text2: ""
//                     });
//                 } else {
//                     await dispatch(createProduct(productData, token));
//                     Toast.show({
//                         topOffset: 60,
//                         type: "success",
//                         text1: "New product added",
//                         text2: ""
//                     });
//                 }
//                 setTimeout(() => {
//                     navigation.navigate("Products");
//                 }, 2000); // Short delay to show toast
//             } catch (error) {
//                 console.log(error);
//                 Toast.show({
//                     topOffset: 60,
//                     type: "error",
//                     text1: "Failed to process product",
//                     text2: "Please try again"
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };   

//     return (
//         <FormContainer title={item ? "Edit Product" : "Add Product"}>
//             <View style={styles.imagesContainer}>
//             <FlatList
//                 horizontal
//                 data={images}
//                 renderItem={({ item, index }) => (
//                     <View style={styles.imageContainer}>
//                         <Image source={{ uri: item.uri }} style={styles.image} />
//                         <TouchableOpacity style={styles.deleteBtn} onPress={() => removeImage(index)}>
//                             <Icon name="trash" size={20} color="white" />
//                         </TouchableOpacity>
//                     </View>
//                 )}
//                 keyExtractor={(item, index) => index.toString()}
//                 ListFooterComponent={
//                     <TouchableOpacity style={styles.addImageBtn} onPress={showImageOptions}>
//                         <Icon name="plus" size={40} color="#000" />
//                     </TouchableOpacity>
//                 }
//             />
//             </View>

//             {/* Input Fields */}
//             <Input
//                 label="Name"
//                 placeholder="Product Name"
//                 value={name}
//                 onChangeText={setName}
//             />

//             <Input
//                 label="Description"
//                 placeholder="Description"
//                 value={description}
//                 onChangeText={setDescription}
//                 multiline={true}
//                 numberOfLines={4}
//             />

//             <View style={styles.priceContainer}>
//                 <View style={styles.priceInputContainer}>
//                     <Input
//                         label="Sell Price"
//                         placeholder="Sell Price"
//                         value={sellPrice}
//                         keyboardType="numeric"
//                         onChangeText={(text) => setSellPrice(text)}
//                     />
//                 </View>

//                 <View style={styles.priceInputContainer}>
//                     <Input
//                         label="Cost Price"
//                         placeholder="Cost Price"
//                         value={costPrice}
//                         keyboardType="numeric"
//                         onChangeText={(text) => setCostPrice(text)}
//                     />
//                 </View>
//             </View>

//             <Input
//                 label="Stock Quantity"
//                 placeholder="Stock Quantity"
//                 keyboardType="numeric"
//                 value={stockQuantity}
//                 onChangeText={setStockQuantity}
//             />

//             <Text style={styles.inputLabel}>Category</Text>
//             <View style={styles.pickerContainer}>
//                 <Picker
//                     selectedValue={category}
//                     onValueChange={setCategory}
//                 >
//                     <Picker.Item label="Select a category" value="" />
//                     {categories.map((c) => (
//                         <Picker.Item key={c} label={c} value={c} />
//                     ))}
//                 </Picker>
//             </View>

//             <Text style={styles.inputLabel}>Movement</Text>
//             <View style={styles.pickerContainer}>
//                 <Picker
//                     selectedValue={movement}
//                     onValueChange={setMovement}
//                 >
//                     <Picker.Item label="Select a movement type" value="" />
//                     {movements.map((m) => (
//                         <Picker.Item key={m} label={m} value={m} />
//                     ))}
//                 </Picker>
//             </View>

//             <Text style={styles.inputLabel}>Brand</Text>
//             <View style={styles.pickerContainer}>
//                 <Picker
//                     selectedValue={brand}
//                     onValueChange={setBrand}
//                 >
//                     <Picker.Item label="Select a brand" value="" />
//                     {brands.map((b) => (
//                         <Picker.Item key={b} label={b} value={b} />
//                     ))}
//                 </Picker>
//             </View>

//             {error ? <Error message={error} /> : null}

//             <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//                 disabled={loading}
//             >
//                 <Text style={styles.submitButtonText}>
//                     {loading ? "Processing..." : item ? "Update" : "Create"}
//                 </Text>
//             </TouchableOpacity>
//         </FormContainer>
//     );
// };

// const styles = StyleSheet.create({
//     imagesContainer: {
//         width: '100%',
//         height: 140,
//         marginBottom: 20,
//         alignItems: 'center',
//     },
//     imageContainer: {
//         width: 120,
//         height: 120,
//         borderRadius: 15,
//         marginRight: 10,
//         borderWidth: 3,
//         borderColor: 'black',
//         overflow: 'hidden',
//         backgroundColor: 'rgba(217, 217, 217, 0.63)',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//     },
//     deleteBtn: {
//         position: 'absolute',
//         top: 5,
//         right: 5,
//         backgroundColor: '#ff3131',
//         borderRadius: 20,
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: 'white',
//     },
//     addImageBtn: {
//         width: 120,
//         height: 120,
//         borderRadius: 15,
//         borderWidth: 3,
//         borderStyle: 'dashed',
//         borderColor: 'black',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(217, 217, 217, 0.63)',
//     },
//     priceContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         width: "100%",
//     },
//     priceInputContainer: {
//         width: "48%",
//     },
//     inputLabel: {
//         fontWeight: 'bold',
//         marginBottom: 5,
//         fontSize: 16,
//         alignSelf: 'flex-start',
//     },
//     pickerContainer: {
//         width: '100%',
//         height: 50,
//         borderColor: 'black',
//         borderWidth: 3,
//         borderRadius: 15,
//         marginBottom: 15,
//         backgroundColor: 'rgba(217, 217, 217, 0.63)',
//         justifyContent: 'center',
//     },
//     submitButton: {
//         width: '100%',
//         height: 50,
//         borderColor: 'black',
//         borderWidth: 3,
//         backgroundColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 15,
//         marginTop: 10,
//         marginBottom: 20,
//     },
//     submitButtonText: {
//         color: 'black',
//         fontWeight: 'bold',
//         fontSize: 22,
//     },
// });

// export default ProductForm;



import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert,
    ActivityIndicator, ScrollView, SafeAreaView
} from "react-native";
import { Surface, Button, Divider, TextInput, Chip } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from 'react-redux';
import FormContainer from "../Shared/FormContainer";
import Input from "../Shared/Input";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import Error from "../Shared/Error";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import mime from "mime";
import { useAuth } from "../../Context/Auth";
import { createProduct, updateProduct } from '../../Redux/Actions/productActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ProductForm = (props) => {
    const { user, token } = useAuth();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [movement, setMovement] = useState('');
    const [brand, setBrand] = useState('');
    const [images, setImages] = useState([]);
    const [sellPrice, setSellPrice] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [categories, setCategories] = useState([]);
    const [movements, setMovements] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // check if user is admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            Alert.alert("Access Denied", "Only admin users can access this screen");
            navigation.navigate('MainNavigator');
        }
    }, [user]);

    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            const itemData = props.route.params.item;
            setItem(itemData);
            setName(itemData.name);
            setDescription(itemData.description);
            setCategory(itemData.category);
            setMovement(itemData.movement);
            setBrand(itemData.brand);
            setSellPrice(itemData.sell_price.toString());
            setCostPrice(itemData.cost_price.toString());
            setStockQuantity(itemData.stock_quantity.toString());
            
            if (itemData.images && itemData.images.length > 0) {
                const formattedImages = itemData.images.map(img => ({
                    uri: img.url,
                    public_id: img.public_id
                }));
                setImages(formattedImages);
            }
        }
        
        const categoryList = [
            "Classic",
            "Dive",
            "Pilot",
            "Field",
            "Dress",
            "Chronograph",
            "Moon Phase",
            "Vintage"
        ];
        setCategories(categoryList);
        
        const movementList = [
            "Mechanical",
            "Automatic",
            "Quartz",
            "Solar",
            "Kinetic"
        ];
        setMovements(movementList);
        
        const brandList = [
            "Seiko",
            "Citizen",
            "Rolex",
            "Omega",
            "Cartier",
            "Breitling",
            "Tudor",
            "Grand Seiko"
        ];
        setBrands(brandList);

        return () => {
            setCategories([]);
        }
    }, [props.route.params]);

    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => ({
                uri: asset.uri,
                type: mime.getType(asset.uri),
                name: asset.uri.split('/').pop()
            }));
            
            setImages([...images, ...newImages]);
        }
    };

    const takePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Camera permission is required to take pictures");
            return;
        }
    
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
    
        if (!result.canceled) {
            const newImage = {
                uri: result.assets[0].uri,
                type: mime.getType(result.assets[0].uri),
                name: result.assets[0].uri.split('/').pop()
            };
            
            setImages([...images, newImage]);
        }
    };

    const removeImage = (index) => {
        let newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const showImageOptions = () => {
        Alert.alert(
            "Add Image",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: takePicture
                },
                {
                    text: "Choose from Gallery",
                    onPress: pickImages
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ],
            { cancelable: true }
        );
    };

    const validateForm = () => {
        if (
            name === "" ||
            description === "" ||
            category === "" ||
            movement === "" ||
            brand === "" ||
            sellPrice === "" ||
            costPrice === "" ||
            stockQuantity === "" ||
            images.length === 0
        ) {
            setError("Please fill in all fields and add at least one image");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        const productData = new FormData();
        
        productData.append("name", name);
        productData.append("description", description);
        productData.append("category", category);
        productData.append("movement", movement);
        productData.append("brand", brand);
        productData.append("sell_price", sellPrice);
        productData.append("cost_price", costPrice);
        productData.append("stock_quantity", stockQuantity);
        
        let imagesToUpload = [];
        let existingImages = [];
        
        images.forEach((image) => {
            if (image.public_id) {
                // existing image
                existingImages.push({
                    public_id: image.public_id,
                    url: image.uri
                });
            } else {
                // new image to upload
                const newImageUri = "file:///" + image.uri.split("file:/").join("");
                imagesToUpload.push({
                    uri: newImageUri,
                    type: mime.getType(newImageUri) || 'image/jpeg',
                    name: newImageUri.split("/").pop()
                });
            }
        });
        if (existingImages.length > 0) {
            productData.append("existingImages", JSON.stringify(existingImages));
        }
        
        // add new images individually
        imagesToUpload.forEach((img, index) => {
            productData.append("images", img);
        });

        try {
            if (item !== null) {
                await dispatch(updateProduct(item._id, productData, token));
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Product successfully updated",
                    text2: ""
                });
            } else {
                await dispatch(createProduct(productData, token));
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "New product added",
                    text2: ""
                });
            }
            setTimeout(() => {
                navigation.navigate("Products");
            }, 2000); // Short delay to show toast
        } catch (error) {
            console.log(error);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Failed to process product",
                text2: "Please try again"
            });
        } finally {
            setLoading(false);
        }
    };   

    const renderCategory = (cat) => (
        <TouchableOpacity 
            key={cat} 
            style={[styles.categoryChip, category === cat && styles.selectedCategoryChip]} 
            onPress={() => setCategory(cat)}
        >
            <Text style={[styles.categoryText, category === cat && styles.selectedCategoryText]}>
                {cat}
            </Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAwareScrollView 
            contentContainerStyle={styles.container} 
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
        >
            <View style={styles.formHeader}>
                <Text style={styles.formTitle}>{item ? "Edit Product" : "Add New Product"}</Text>
                <Text style={styles.formSubtitle}>Complete all fields below to add your watch to inventory</Text>
                <Divider style={styles.divider} />
            </View>

            <Text style={styles.sectionTitle}>Product Images</Text>
            <View style={styles.imagesContainer}>
                <FlatList
                    horizontal
                    data={images}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.uri }} style={styles.image} />
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => removeImage(index)}>
                                <Icon name="trash" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.addImageBtn} onPress={showImageOptions}>
                            <Icon name="camera" size={30} color="#555" />
                            <Text style={styles.addImageText}>Add Photo</Text>
                        </TouchableOpacity>
                    }
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Product Name</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter product name"
                    value={name}
                    onChangeText={setName}
                    style={styles.textInput}
                    outlineColor="#ddd"
                    activeOutlineColor="#3498db"
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter product description"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                    style={[styles.textInput, styles.textAreaInput]}
                    outlineColor="#ddd"
                    activeOutlineColor="#3498db"
                />
            </View>

            <Text style={styles.sectionTitle}>Pricing & Inventory</Text>
            <View style={styles.priceContainer}>
                <View style={styles.priceInputContainer}>
                    <Text style={styles.inputLabel}>Sell Price ($)</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="0.00"
                        value={sellPrice}
                        keyboardType="numeric"
                        onChangeText={setSellPrice}
                        style={styles.textInput}
                        outlineColor="#ddd"
                        activeOutlineColor="#3498db"
                        left={<TextInput.Icon icon="cash" color="#555" />}
                    />
                </View>

                <View style={styles.priceInputContainer}>
                    <Text style={styles.inputLabel}>Cost Price ($)</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="0.00"
                        value={costPrice}
                        keyboardType="numeric"
                        onChangeText={setCostPrice}
                        style={styles.textInput}
                        outlineColor="#ddd"
                        activeOutlineColor="#3498db"
                        left={<TextInput.Icon icon="tag" color="#555" />}
                    />
                </View>
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Stock Quantity</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter quantity"
                    value={stockQuantity}
                    keyboardType="numeric"
                    onChangeText={setStockQuantity}
                    style={styles.textInput}
                    outlineColor="#ddd"
                    activeOutlineColor="#3498db"
                    left={<TextInput.Icon icon="package-variant" color="#555" />}
                />
            </View>

            <Text style={styles.sectionTitle}>Product Specifications</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                    {categories.map(renderCategory)}
                </ScrollView>
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Movement Type</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={movement}
                        onValueChange={setMovement}
                        dropdownIconColor="#555"
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a movement type" value="" />
                        {movements.map((m) => (
                            <Picker.Item key={m} label={m} value={m} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Brand</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={brand}
                        onValueChange={setBrand}
                        dropdownIconColor="#555"
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a brand" value="" />
                        {brands.map((b) => (
                            <Picker.Item key={b} label={b} value={b} />
                        ))}
                    </Picker>
                </View>
            </View>

            {error ? <Error message={error} /> : null}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
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
                            {item ? "Update Product" : "Add Product"}
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
    imagesContainer: {
        width: '100%',
        marginBottom: 24,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 12,
        marginRight: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ff3131',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    addImageBtn: {
        width: 120,
        height: 120,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    addImageText: {
        marginTop: 8,
        color: '#555',
        fontSize: 12,
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
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
    },
    priceInputContainer: {
        width: "48%",
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
    categoriesContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    categoryChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedCategoryChip: {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
    },
    categoryText: {
        color: '#555',
        fontSize: 14,
    },
    selectedCategoryText: {
        color: '#fff',
        fontWeight: '600',
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

export default ProductForm;