import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const FormContainer = ({ children, title }) => {
    return (
        <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                {children}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    }
});

export default FormContainer;