import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const Input = (props) => {
    return (
        <View style={styles.inputContainer}>
            {props.label && (
                <Text style={styles.inputLabel}>{props.label}</Text>
            )}
            <TextInput
                style={[
                    styles.input, 
                    props.multiline && styles.textArea,
                    props.style
                ]}
                placeholder={props.placeholder}
                name={props.name}
                id={props.id}
                value={props.value}
                autoCorrect={props.autoCorrect}
                onChangeText={props.onChangeText}
                onFocus={props.onFocus}
                secureTextEntry={props.secureTextEntry}
                keyboardType={props.keyboardType}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 15,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(217, 217, 217, 0.63)',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
    }
});

export default Input;