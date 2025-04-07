import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useAuth, token } from '../../Context/Auth';
import { deleteReview } from '../../Redux/Actions/reviewActions';

const FeedbackList = ({ onEditReview }) => {
  const { reviews, loading } = useSelector(state => state.reviews);
  const { user, token } = useAuth();
  const dispatch = useDispatch();

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getUserName = (user) => {
    if (!user) return 'Anonymous';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.name) {
      return user.name;
    } else if (user.email) {
      // return email but hide part of it for privacy
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

  // check if review belongs to current user
  const isUserReview = (reviewUserId) => {
    const currentUserId = user?._id || user?.id;
    return currentUserId && currentUserId === reviewUserId;
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

  const renderHiddenItem = ({ item }) => {
    if (!isUserReview(item.user?._id || item.user)) {
      return <View style={styles.hiddenItemContainer} />;
    }

    return (
      <View style={styles.hiddenItemContainer}>
        <TouchableOpacity 
          style={[styles.hiddenButton, styles.editButton]}
          onPress={() => onEditReview(item)}
        >
          <Icon name="create-outline" size={24} color="#fff" />
          <Text style={styles.hiddenButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.hiddenButton, styles.deleteButton]}
          onPress={() => {
            if (user && token) {
              Alert.alert(
                "Delete Review",
                "Are you sure you want to delete this review?",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  { 
                    text: "Delete", 
                    onPress: () => {
                      const reviewId = item._id;
                      const productId = item.product?._id || item.product;
                      
                      dispatch(deleteReview(productId, reviewId, token));
                    },
                    style: "destructive"
                  }
                ]
              );
            }
          }}
        >
          <Icon name="trash-outline" size={24} color="#fff" />
          <Text style={styles.hiddenButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        <SwipeListView
          data={reviews}
          renderItem={renderFeedbackItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item._id ? item._id.toString() : item.id.toString()}
          leftOpenValue={0}
          rightOpenValue={-155}
          disableRightSwipe={true}
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
    backgroundColor: 'white',
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
  },
  hiddenItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '90%',
    paddingRight: 5
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '95%',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  hiddenButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default FeedbackList;