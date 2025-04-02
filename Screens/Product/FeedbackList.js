// frontend/Screens/Product/FeedbackList
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const FeedbackList = () => {
  const { reviews, loading } = useSelector(state => state.reviews);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={14} 
          color={i <= rating ? "#FFC107" : "#D1D1D1"} 
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get user name - handle different user object formats
  const getUserName = (user) => {
    if (!user) return 'Anonymous';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.name) {
      return user.name;
    } else if (user.email) {
      // Return email but hide part of it for privacy
      const emailParts = user.email.split('@');
      if (emailParts.length === 2) {
        const username = emailParts[0];
        const domain = emailParts[1];
        if (username.length > 2) {
          return `${username.substring(0, 2)}***@${domain}`;
        }
      }
      return user.email;
    }
    
    return 'User';
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{getUserName(item.user)}</Text>
          <Text style={styles.feedbackDate}>{formatDate(item.createdAt || item.date)}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Customer Reviews</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>
      <View style={styles.overallRating}>
        <Text style={styles.ratingNumber}>
          {reviews.length > 0
            ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)
            : "0.0"}
        </Text>
        <View style={styles.ratingStars}>
          {renderStars(
            reviews.length > 0
              ? Math.round(reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length)
              : 0
          )}
        </View>
        <Text style={styles.totalReviews}>({reviews.length} reviews)</Text>
      </View>
      
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item._id ? item._id.toString() : item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.noFeedback}>
          <Text style={styles.noFeedbackText}>No reviews yet. Be the first to review this product!</Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  feedbackItem: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  feedbackDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noFeedback: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  noFeedbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});

export default FeedbackList;