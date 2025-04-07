import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://172.20.10.12:4000'
: baseURL = 'http://172.20.10.12:4000'
}

export default baseURL;