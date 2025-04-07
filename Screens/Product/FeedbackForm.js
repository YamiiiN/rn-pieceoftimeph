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
} from '../../Redux/Actions/reviewActions';

const FeedbackForm = ({ productId, existingReview, onSubmitSuccess }) => {
    const { user, token } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reviewId, setReviewId] = useState(null);
    
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.reviews);

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
            setReviewId(existingReview._id);
            setIsEditing(true);
        } else {
            setRating(0);
            setComment('');
            setReviewId(null);
            setIsEditing(false);
        }
    }, [existingReview]);

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
                await dispatch(updateReview(productId, reviewId, reviewData, token));
                Toast.show({
                    type: 'success',
                    text1: 'Review Updated',
                    text2: 'Your review has been updated successfully',
                    position: 'top',
                });
            } else {
                await dispatch(createReview(productId, reviewData, token));
                Toast.show({
                    type: 'success',
                    text1: 'Thank You!',
                    text2: 'Your review has been submitted successfully',
                    position: 'top',
                });
            }
            
            // notify parent component that submission was successful
            if (onSubmitSuccess) {
                onSubmitSuccess();
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

    const handleCancel = () => {
        if (onSubmitSuccess) {
            onSubmitSuccess();
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

    // If loading
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{isEditing ? 'Updating Review' : 'Submitting Review'}</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={styles.loadingText}>Processing...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{isEditing ? 'Edit Your Review' : 'Write a Review'}</Text>
                {isEditing && (
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={handleCancel}
                    >
                        <Icon name="close-outline" size={24} color="#666" />
                    </TouchableOpacity>
                )}
            </View>
            
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
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    ratingContainer: {
        marginBottom: 15,
    },
    ratingLabel: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    starSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        marginRight: 5,
    },
    commentContainer: {
        marginBottom: 20,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#584e51',
        paddingVertical: 15,
        borderRadius: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#666',
        marginTop: 10,
        fontSize: 16,
    },
});

export default FeedbackForm;