import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.0.103:4000'
: baseURL = 'http://192.168.0.103:4000'
}

export default baseURL;