import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    TouchableWithoutFeedback 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Context/Auth';

const FeedbackForm = ({ productId, onFeedbackSubmitted }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user) {
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

        setIsSubmitting(true);

        try {
            // Here you would add API call to submit feedback
            // const response = await fetch('your-api-url/feedback', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         productId,
            //         userId: user._id,
            //         rating,
            //         comment,
            //         date: new Date()
            //     }),
            // });
            
            // Mock successful submission for now
            setTimeout(() => {
                // Create a mock feedback object that would normally come from your API
                const newFeedback = {
                    id: Math.floor(Math.random() * 10000),
                    productId,
                    userId: user._id || user.id,
                    userName: user.name || 'User',
                    rating,
                    comment,
                    date: new Date().toISOString()
                };
                
                if (onFeedbackSubmitted) {
                    onFeedbackSubmitted(newFeedback);
                }

                // Reset form
                setRating(0);
                setComment('');
                
                Toast.show({
                    type: 'success',
                    text1: 'Thank You!',
                    text2: 'Your review has been submitted successfully',
                    position: 'top',
                });
                
                setIsSubmitting(false);
            }, 1000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to submit your review',
                position: 'top',
            });
            setIsSubmitting(false);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Write a Review</Text>
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
                style={[styles.submitButton, isSubmitting && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
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
});

export default FeedbackForm;