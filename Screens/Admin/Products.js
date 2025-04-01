import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from "../../Context/Auth";
import { listProducts, deleteProduct } from "../../Redux/Actions/productActions";

const Products = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Get products from Redux store
  const { products, loading: reduxLoading, error } = useSelector(state => state.products);
  
  // Local state
  const [productFilter, setProductFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products on focus
  useFocusEffect(
    useCallback(() => {
      dispatch(listProducts());
      return () => {};
    }, [dispatch])
  );

  // Update filtered products when products or search query changes
  useEffect(() => {
    if (products) {
      if (searchQuery === "") {
        setProductFilter(products);
      } else {
        setProductFilter(
          products.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }
  }, [products, searchQuery]);

  // Handle product deletion
  const handleDelete = (id) => {
    dispatch(deleteProduct(id, token));
  };

  // Refresh control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(listProducts()).then(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  // List header component
  const ListHeader = () => {
    return (
      <View style={styles.listHeader}>
        <View style={styles.headerItem}>
          <Text style={{ fontWeight: '600' }}>Name</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={{ fontWeight: '600' }}>Brand</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={{ fontWeight: '600' }}>Category</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={{ fontWeight: '600' }}>Price</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={{ fontWeight: '600' }}>Actions</Text>
        </View>
      </View>
    );
  };

  // Render each product item
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemName}>
        <Text>{item.name}</Text>
      </View>
      <View style={styles.itemBrand}>
        <Text>{item.brand}</Text>
      </View>
      <View style={styles.itemCategory}>
        <Text>{item.category}</Text>
      </View>
      <View style={styles.itemPrice}>
        <Text>${item.sell_price}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("ProductForm", { item: item })}
          style={styles.editButton}
        >
          <Icon name="edit" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item._id)}
          style={styles.deleteButton}
        >
          <Icon name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("ProductForm")}
        >
          <Icon name="plus" size={18} color="white" />
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Loading Indicator */}
      {reduxLoading && !refreshing ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        /* Product List */
        <FlatList
          data={productFilter}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  searchBar: {
    margin: 10,
  },
  listHeader: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemBrand: {
    flex: 1,
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    alignItems: 'center',
  },
  itemCategory: {
    flex: 1,
    alignItems: 'center',
  },
  itemPrice: {
    flex: 1,
    alignItems: 'center',
  },
  itemActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 5,
    borderRadius: 3,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 3,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Products;