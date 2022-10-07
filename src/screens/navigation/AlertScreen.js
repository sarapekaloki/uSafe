import * as React from 'react';
import { View, Text} from 'react-native';

export default function AlertScreen({navigation}){
    return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text
                onPress={()=>alert('This is the "Home" screen')}
                style={{fontSize:26,fontWeight:'bold'}}>Alert Screen</Text>
        </View>
    )
}
