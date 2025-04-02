// frontend/Screens/Product/FeedbackForm
// frontend/Screens/Product/FeedbackForm
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput,
    StyleSheet,
    TouchableOpacity, 
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Context/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { 
    createReview, 
    updateReview, 
    checkUserReview,
    checkCanReview
} from '../../Redux/Actions/reviewActions';

const FeedbackForm = ({ productId }) => {
    const { user, token } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reviewId, setReviewId] = useState(null);
    
    const dispatch = useDispatch();
    const { loading, error, userReview, canReview } = useSelector(state => state.reviews);

    useEffect(() => {
        if (user && token && productId) {
            // Check if user has already reviewed this product
            dispatch(checkUserReview(productId, token))
                .then(existingReview => {
                    if (existingReview) {
                        setRating(existingReview.rating);
                        setComment(existingReview.comment);
                        setReviewId(existingReview._id);
                        setIsEditing(true);
                    } else {
                        // If no review exists, check if user can review
                        dispatch(checkCanReview(productId, token));
                    }
                });
        }
    }, [dispatch, user, token, productId]);

    // Update form if userReview changes in Redux store
    useEffect(() => {
        if (userReview) {
            setRating(userReview.rating);
            setComment(userReview.comment);
            setReviewId(userReview._id);
            setIsEditing(true);
        }
    }, [userReview]);

    const handleSubmit = async () => {
        if (!user || !token) {
            Toast.show({
                type: 'error',
                text1: 'Login Required',
                text2: 'Please login to submit a review',
                position: 'top',
            });
            return;
        }
        
        if (rating === 0) {
            Toast.show({
                type: 'error',
                text1: 'Rating Required',
                text2: 'Please select a rating from 1-5 stars',
                position: 'top',
            });
            return;
        }

        if (comment.trim().length < 3) {
            Toast.show({
                type: 'error',
                text1: 'Comment Required',
                text2: 'Please enter a comment with at least 3 characters',
                position: 'top',
            });
            return;
        }

        const reviewData = {
            rating,
            comment
        };

        try {
            if (isEditing && reviewId) {
                // Update existing review
                await dispatch(updateReview(productId, reviewId, reviewData, token));
                Toast.show({
                    type: 'success',
                    text1: 'Review Updated',
                    text2: 'Your review has been updated successfully',
                    position: 'top',
                });
            } else {
                // Create new review
                await dispatch(createReview(productId, reviewData, token));
                Toast.show({
                    type: 'success',
                    text1: 'Thank You!',
                    text2: 'Your review has been submitted successfully',
                    position: 'top',
                });
            }
        } catch (err) {
            console.error("Error handling review:", err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error || 'Failed to submit your review',
                position: 'top',
            });
        }
    };

    const renderStarSelector = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableWithoutFeedback key={i} onPress={() => setRating(i)}>
                    <Icon 
                        name={i <= rating ? "star" : "star-outline"} 
                        size={30} 
                        color={i <= rating ? "#FFC107" : "#D1D1D1"} 
                        style={styles.starIcon}
                    />
                </TouchableWithoutFeedback>
            );
        }
        return stars;
    };

    // If user is not logged in, show login prompt
    if (!user || !token) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Write a Review</Text>
                <Text style={styles.loginPrompt}>
                    Please login to write a review for this product
                </Text>
            </View>
        );
    }

    // If system is checking if user can review
    if (loading && !isEditing) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Write a Review</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={styles.loadingText}>Checking review eligibility...</Text>
                </View>
            </View>
        );
    }

    // If user cannot review the product
    if (!isEditing && !canReview) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Write a Review</Text>
                <Text style={styles.notEligibleText}>
                    You can only review products you have purchased and received.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isEditing ? 'Edit Your Review' : 'Write a Review'}</Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Your Rating:</Text>
                <View style={styles.starSelector}>
                    {renderStarSelector()}
                </View>
            </View>
            <View style={styles.commentContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Share your thoughts about this product..."
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                />
            </View>
            <TouchableOpacity 
                style={[styles.submitButton, loading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        marginTop: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    checkingText: {
        marginLeft: 10,
        color: '#666',
    },
    infoContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
    },
    infoText: {
        color: '#666',
        textAlign: 'center',
    },
    ratingContainer: {
        marginBottom: 16,
    },
    ratingLabel: {
        fontSize: 14,
        marginBottom: 8,
        color: '#666',
    },
    starSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    starIcon: {
        marginHorizontal: 5,
    },
    commentContainer: {
        marginBottom: 16,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        textAlignVertical: 'top',
        minHeight: 100,
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#584e51',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#a8a8a8',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userReviewContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 16,
    },
    ratingDisplayContainer: {
        marginBottom: 12,
    },
    starDisplay: {
        flexDirection: 'row',
        marginTop: 8,
    },
    userComment: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#584e51',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        flex: 3,
        marginRight: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ff4d4d',
        flex: 1,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#ff4d4d',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default FeedbackForm;