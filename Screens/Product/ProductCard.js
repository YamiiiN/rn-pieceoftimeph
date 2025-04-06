// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get("window");

// const ProductCard = ({ item }) => {
//     const navigation = useNavigation();

//     const formattedPrice = new Intl.NumberFormat('en-US').format(item.sell_price);

//     return (
//         <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate("SingleProduct", { item: item })}
//         >
//             <Image
//                 style={styles.image}
//                 resizeMode="contain"
//                 source={{ uri: item.images[0]?.url }}
//             />
//             {/* <View style={styles.favoriteContainer}>
//                 <TouchableOpacity style={styles.favoriteButton}>
//                     <Icon name="heart-outline" size={18} color="gray" />
//                 </TouchableOpacity>
//             </View> */}
//             <View style={styles.cardBody}>
//                 <View style={styles.priceContainer}>
//                     <Text style={styles.price}>₱ {formattedPrice}</Text>
//                     <View style={styles.ratingContainer}>
//                         <Icon name="star" size={12} color="#FFC107" />
//                         <Text style={styles.rating}>{item.rating}</Text>
//                     </View>
//                 </View>
//                 <Text style={styles.title}>{item.name}</Text>
//                 <Text style={styles.brand}>{item.brand}</Text>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     card: {
//         width: (width - 40) / 2,  
//         marginBottom: 16,
//         backgroundColor: 'white',
//         borderRadius: 10,
//         overflow: 'hidden',
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//     },
//     image: {
//         height: 130,
//         width: '100%',
//         backgroundColor: '#f9f9f9',
//     },
//     favoriteContainer: {
//         position: 'absolute',
//         right: 8,
//         top: 8,
//     },
//     favoriteButton: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         backgroundColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 1,
//     },
//     cardBody: {
//         padding: 10,
//     },
//     priceContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 4,
//     },
//     price: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: 'red',
//     },
//     ratingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rating: {
//         fontSize: 12,
//         marginLeft: 2,
//         color: '#666',
//     },
//     title: {
//         fontSize: 14,
//         fontWeight: '500',
//         marginBottom: 2,
//     },
//     brand: {
//         fontSize: 12,
//         color: '#666',
//     },
// });

// export default ProductCard;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
const { width } = Dimensions.get("window");

const ProductCard = ({ item }) => {
  const navigation = useNavigation();
  const [discount, setDiscount] = useState(null);
  
  useEffect(() => {
    // Fetch active promotions for this product
    const fetchPromotions = async () => {
        try {
            const res = await axios.get(`${baseURL}/promotions`);
            if (res.data.success) {
                const activePromotion = res.data.promotions.find(
                    promo => promo.product._id === item._id && new Date(promo.endDate) > new Date()
                );
                
                if (activePromotion) {
                    setDiscount(activePromotion.discountPercentage);
                }
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };
    
    fetchPromotions();
}, [item._id]);

  const formattedPrice = new Intl.NumberFormat('en-US').format(item.sell_price);
  
  // Calculate discounted price if there's a promotion
  const discountedPrice = discount ? 
    (item.sell_price - (item.sell_price * discount / 100)).toFixed(2) : null;
  const formattedDiscountedPrice = discountedPrice ? 
    new Intl.NumberFormat('en-US').format(discountedPrice) : null;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate("SingleProduct", { item: item })}
    >
      <Image 
        style={styles.image} 
        resizeMode="contain" 
        source={{ uri: item.images[0]?.url }} 
      />
      
      {discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}% OFF</Text>
        </View>
      )}
      
      <View style={styles.cardBody}>
        <View style={styles.priceContainer}>
          {discount ? (
            <View style={styles.priceWrapper}>
              <Text style={styles.originalPrice}>₱ {formattedPrice}</Text>
              <Text style={styles.price}>₱ {formattedDiscountedPrice}</Text>
            </View>
          ) : (
            <Text style={styles.price}>₱ {formattedPrice}</Text>
          )}
          
          <View style={styles.ratingContainer}>
            <Icon name="star" size={12} color="#FFC107" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.brand}>{item.brand}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 40) / 2,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  image: {
    height: 130,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardBody: {
    padding: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceWrapper: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  originalPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 2,
    color: '#666',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  brand: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProductCard;