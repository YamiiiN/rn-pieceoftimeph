import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FeedbackList = ({ feedbacks }) => {
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

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.feedbackDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>
      <View style={styles.overallRating}>
        <Text style={styles.ratingNumber}>
          {feedbacks.length > 0
            ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length).toFixed(1)
            : "0.0"}
        </Text>
        <View style={styles.ratingStars}>
          {renderStars(
            feedbacks.length > 0
              ? Math.round(feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length)
              : 0
          )}
        </View>
        <Text style={styles.totalReviews}>({feedbacks.length} reviews)</Text>
      </View>
      
      {feedbacks.length > 0 ? (
        <FlatList
          data={feedbacks}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item.id.toString()}
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