import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert,
} from "react-native";
import { Surface } from "react-native-paper";
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
    const [movements, setMovements] = useState(['Mechanical', 'Automatic', 'Quartz', 'Solar', 'Kinetic']);
    const [brands, setBrands] = useState(['Seiko', 'Citizen', 'Rolex', 'Omega', 'Cartier', 'Breitling', 'Tudor', 'Grand Seiko']);
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
    }, []);

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

    const removeImage = (index) => {
        let newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
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
        
        images.forEach((image, index) => {
            if (image.uri) {
                const newImageUri = "file:///" + image.uri.split("file:/").join("");
                productData.append("images", {
                    uri: newImageUri,
                    type: mime.getType(newImageUri) || 'image/jpeg',
                    name: newImageUri.split("/").pop()
                });
            }
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
            navigation.navigate("Products");
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

    return (
        <FormContainer title={item ? "Edit Product" : "Add Product"}>
            <View style={styles.imagesContainer}>
                <FlatList
                    horizontal
                    data={images}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.uri }} style={styles.image} />
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => removeImage(index)}>
                                <Icon name="trash" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
                            <Icon name="plus" size={40} color="#000" />
                        </TouchableOpacity>
                    }
                />
            </View>

            {/* Input Fields */}
            <Input
                label="Name"
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
            />

            <Input
                label="Description"
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
            />

            <View style={styles.priceContainer}>
                <View style={styles.priceInputContainer}>
                    <Input
                        label="Sell Price"
                        placeholder="Sell Price"
                        value={sellPrice}
                        keyboardType="numeric"
                        onChangeText={(text) => setSellPrice(text)}
                    />
                </View>

                <View style={styles.priceInputContainer}>
                    <Input
                        label="Cost Price"
                        placeholder="Cost Price"
                        value={costPrice}
                        keyboardType="numeric"
                        onChangeText={(text) => setCostPrice(text)}
                    />
                </View>
            </View>

            <Input
                label="Stock Quantity"
                placeholder="Stock Quantity"
                keyboardType="numeric"
                value={stockQuantity}
                onChangeText={setStockQuantity}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={setCategory}
                >
                    <Picker.Item label="Select a category" value="" />
                    {categories.map((c) => (
                        <Picker.Item key={c} label={c} value={c} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Movement</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={movement}
                    onValueChange={setMovement}
                >
                    <Picker.Item label="Select a movement type" value="" />
                    {movements.map((m) => (
                        <Picker.Item key={m} label={m} value={m} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Brand</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={brand}
                    onValueChange={setBrand}
                >
                    <Picker.Item label="Select a brand" value="" />
                    {brands.map((b) => (
                        <Picker.Item key={b} label={b} value={b} />
                    ))}
                </Picker>
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? "Processing..." : item ? "Update" : "Create"}
                </Text>
            </TouchableOpacity>
        </FormContainer>
    );
};

const styles = StyleSheet.create({
    imagesContainer: {
        width: '100%',
        height: 140,
        marginBottom: 20,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 3,
        borderColor: 'black',
        overflow: 'hidden',
        backgroundColor: 'rgba(217, 217, 217, 0.63)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    deleteBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#ff3131',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    addImageBtn: {
        width: 120,
        height: 120,
        borderRadius: 15,
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(217, 217, 217, 0.63)',
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    priceInputContainer: {
        width: "48%",
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
        alignSelf: 'flex-start',
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 15,
        marginBottom: 15,
        backgroundColor: 'rgba(217, 217, 217, 0.63)',
        justifyContent: 'center',
    },
    submitButton: {
        width: '100%',
        height: 50,
        borderColor: 'black',
        borderWidth: 3,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    submitButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 22,
    },
});

export default ProductForm;