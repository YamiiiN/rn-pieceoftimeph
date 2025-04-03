// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   RefreshControl,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { Searchbar } from 'react-native-paper';
// import { useDispatch, useSelector } from 'react-redux';
// import { useAuth } from "../../Context/Auth";
// import { listProducts, deleteProduct } from "../../Redux/Actions/productActions";

// const Products = () => {
//   const { user, token } = useAuth();
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   // Get products from Redux store
//   const { products, loading: reduxLoading, error } = useSelector(state => state.products);

//   // Local state
//   const [productFilter, setProductFilter] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch products on focus
//   useFocusEffect(
//     useCallback(() => {
//       dispatch(listProducts());
//       return () => { };
//     }, [dispatch])
//   );

//   useEffect(() => {
//     if (user && user.role !== 'admin') {
//       Alert.alert("Access Denied", "Only admin users can access this screen");
//       navigation.navigate('MainNavigator');
//     }
//   }, [user]);

//   // Update filtered products when products or search query changes
//   useEffect(() => {
//     if (products) {
//       if (searchQuery === "") {
//         setProductFilter(products);
//       } else {
//         setProductFilter(
//           products.filter((product) =>
//             product.name.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         );
//       }
//     }
//   }, [products, searchQuery]);

//   // Handle product deletion
//   const handleDelete = (id) => {
//     dispatch(deleteProduct(id, token));
//   };

//   // Refresh control
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     dispatch(listProducts()).then(() => {
//       setRefreshing(false);
//     });
//   }, [dispatch]);

//   // List header component
//   const ListHeader = () => {
//     return (
//       <View style={styles.listHeader}>
//         <View style={styles.headerItem}>
//           <Text style={{ fontWeight: '600' }}>Name</Text>
//         </View>
//         <View style={styles.headerItem}>
//           <Text style={{ fontWeight: '600' }}>Brand</Text>
//         </View>
//         <View style={styles.headerItem}>
//           <Text style={{ fontWeight: '600' }}>Category</Text>
//         </View>
//         <View style={styles.headerItem}>
//           <Text style={{ fontWeight: '600' }}>Price</Text>
//         </View>
//         <View style={styles.headerItem}>
//           <Text style={{ fontWeight: '600' }}>Actions</Text>
//         </View>
//       </View>
//     );
//   };

//   // Render each product item
//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <View style={styles.itemName}>
//         <Text>{item.name}</Text>
//       </View>
//       <View style={styles.itemBrand}>
//         <Text>{item.brand}</Text>
//       </View>
//       <View style={styles.itemCategory}>
//         <Text>{item.category}</Text>
//       </View>
//       <View style={styles.itemPrice}>
//         <Text>${item.sell_price}</Text>
//       </View>
//       <View style={styles.itemActions}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate("ProductForm", { item: item })}
//           style={styles.editButton}
//         >
//           <Icon name="edit" size={18} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => handleDelete(item._id)}
//           style={styles.deleteButton}
//         >
//           <Icon name="trash" size={18} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header Buttons */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.navButton}
//           onPress={() => navigation.navigate("ProductForm")}
//         >
//           <Icon name="plus" size={18} color="white" />
//           <Text style={styles.buttonText}>Add Product</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <Searchbar
//         placeholder="Search products..."
//         onChangeText={setSearchQuery}
//         value={searchQuery}
//         style={styles.searchBar}
//       />

//       {/* Loading Indicator */}
//       {reduxLoading && !refreshing ? (
//         <View style={styles.spinner}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       ) : error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>Error: {error}</Text>
//         </View>
//       ) : (
//         /* Product List */
//         <FlatList
//           data={productFilter}
//           renderItem={renderItem}
//           keyExtractor={(item) => item._id}
//           ListHeaderComponent={ListHeader}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//             />
//           }
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
// };

// const { width } = Dimensions.get("window");

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 10,
//     backgroundColor: '#f8f8f8',
//   },
//   navButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     marginLeft: 5,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   searchBar: {
//     margin: 10,
//   },
//   listHeader: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   headerItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     alignItems: 'center',
//   },
//   itemBrand: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   itemName: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   itemCategory: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   itemPrice: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   itemActions: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   editButton: {
//     backgroundColor: '#28a745',
//     padding: 5,
//     borderRadius: 3,
//   },
//   deleteButton: {
//     backgroundColor: '#dc3545',
//     padding: 5,
//     borderRadius: 3,
//   },
//   spinner: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });

// export default Products;


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
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from "../../Context/Auth";
import { listProducts, deleteProduct } from "../../Redux/Actions/productActions";

const Products = () => {
  const { user, token } = useAuth();
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
      return () => { };
    }, [dispatch])
  );

  useEffect(() => {
    if (user && user.role !== 'admin') {
      Alert.alert("Access Denied", "Only admin users can access this screen");
      navigation.navigate('MainNavigator');
    }
  }, [user]);

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

  // Handle product deletion with confirmation
  const handleDelete = (id, name) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteProduct(id, token));
          },
          style: "destructive"
        }
      ]
    );
  };

  // Refresh control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(listProducts()).then(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  // Render each product item
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <View style={styles.imageContainer}>
          {/* <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/50' }} 
            style={styles.productImage}
            // defaultSource={require('../../assets/placeholder-image.png')}
          /> */}
          <Image
            source={{ uri: item.images?.length ? item.images[0]?.url : 'https://via.placeholder.com/50' }}
            style={styles.productImage}
          />

        </View>
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.productMetaInfo}>
            <View style={styles.brandChip}>
              <Text style={styles.brandText}>{item.brand}</Text>
            </View>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.productPrice}>${item.sell_price}</Text>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductForm", { item: item })}
          style={styles.editButton}
        >
          <Icon name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id, item.name)}
          style={styles.deleteButton}
        >
          <Icon name="trash-alt" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty list placeholder
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="box-open" size={60} color="#dddddd" />
      <Text style={styles.emptyText}>No products found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Try a different search term' : 'Add your first product'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.addEmptyButton}
          onPress={() => navigation.navigate("ProductForm")}
        >
          <Icon name="plus" size={16} color="white" />
          <Text style={styles.addEmptyButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("ProductForm")}
        >
          <Icon name="plus" size={16} color="white" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#4CAF50"
        placeholderTextColor="#777"
      />

      {/* Loading Indicator */}
      {reduxLoading && !refreshing ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={40} color="#dc3545" />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRefresh}
          >
            <Icon name="sync" size={14} color="white" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Product List */
        <FlatList
          data={productFilter}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={EmptyListComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4CAF50"]}
              tintColor="#4CAF50"
            />
          }
          contentContainerStyle={
            productFilter.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 6,
    color: 'white',
    fontWeight: '600',
  },
  searchBar: {
    margin: 12,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productMetaInfo: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  brandChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  brandText: {
    fontSize: 12,
    color: '#1976d2',
  },
  categoryChip: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#9c27b0',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4CAF50',
  },
  itemActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginRight: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 8,
    borderRadius: 6,
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
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    marginLeft: 6,
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
  },
  addEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 24,
  },
  addEmptyButtonText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '600',
  },
});

export default Products;