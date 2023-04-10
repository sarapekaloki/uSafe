import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { uploadBytesResumable, ref, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import {getFirestore, doc, updateDoc} from 'firebase/firestore';
import { Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
  } from '@expo-google-fonts/open-sans';


const UpdateProfilePicture = () => {
    const navigation = useNavigation();
    const firestore = getFirestore();
    const route = useRoute();
    const storage = getStorage();
    const currentEmail = auth.currentUser.email;
    const [image, setImage] = useState(null);
    const userData = route.params.userData;
    const [disableButton, setDisableButton] = useState(true);

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
      });

//Change profile picture
 const changeProfilePic = async() =>  {
    if(userData.pictureUrl != ""){
        await deleteObject(ref(storage,`users-images/${currentEmail}`))
    }
    const storageRef = ref(storage, `users-images/${currentEmail}`);
    try {
      // Here we transform our uri into a blob image
      fetch(image).then((res) => {
        setDisableButton(false);
        res.blob().then(async (myBlob) => {
            const uploadTask = uploadBytesResumable(storageRef, myBlob);
            // When executing our opload
            uploadTask.on(
                "state_changed",
                // Here we can see our upload progress
                (snapshot) => {},
                // Here we will log the error in case we got any
                (error) => console.log(error),
                // Then, when we know everything went great, we will create a download URL and put it into the pictureUrl property of our user
                () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    const newDoc = {
                        coordinates: userData.coordinates,
                        email: userData.email,
                        helpResponses: userData.helpResponses,
                        pictureUrl: url,
                        username: userData.username,
                        token: userData.token
                    };
                
                    const docRef = doc(firestore, "users2", currentEmail);
                    updateDoc(docRef, newDoc).then(() => {
                        navigation.goBack()                    
                    });       
                    }
                );
                }
            );
        })
      });  
    } catch (error) {
        console.log(error);
    }
  }
    
    const onImageLibraryPress =  async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(permissionResult.granted === false){
            alert("Esta app no tiene permiso para acceder a tus fotos");
        }
        else{
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                selectionLimit: 1,
                aspect: [4, 3],
                quality: 0,
              });
            if (!pickerResult.cancelled) {
                setImage(pickerResult.uri);
              }
        }
       
  }
    
      const onCameraPress = async () => {
       

        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        
            if (permissionResult.granted === false) {
            alert("Esta app no tiene permiso para acceder a tu camara");
    
            } else {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                selectionLimit: 1,
                aspect: [4, 3],
                quality: 0,
              });
            if (!result.cancelled) {
            setImage(result.uri);
          }
        }
    
      }

    if (!fontsLoaded) {
        return null;
    }

    return( 
    <KeyboardAvoidingView style={styles.container}>
         <View style = {styles.header}>
                <Image style = {styles.headerImg} source={require('../../assets/img/clearLogo.png')}></Image>
        </View>

       
        <View style={styles.sectionTitle}>
                <TouchableOpacity  onPress={() => {navigation.goBack()} }>
                    <Entypo name="chevron-left" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.sectionTitleText}>CAMBIAR CONTRASEÑA</Text>
        </View>
        
  


        <Image style={styles.previewImage} source={image? {uri: image} :  require('../../assets/img/initial-profile-picture.jpeg')}></Image>
        <Text style={styles.previewImageText}> Vista previa</Text>

        <View style = {styles.buttonSectionImageModal}>
            <TouchableOpacity style = {styles.button} onPress={onImageLibraryPress}>
                <Text style={styles.buttonImageText} >Desde el carrete</Text>
                <Feather style = {styles.icon}name="image" size={20} color="grey" />
            </TouchableOpacity>
            <View style= {styles.divider}></View>
            <TouchableOpacity style = {styles.button} onPress={onCameraPress}>
                <Text style={styles.buttonImageText} >Desde la cámara</Text>
                <Feather style = {styles.icon} name="camera" size={20} color="grey" />
            </TouchableOpacity>
        </View>
      
        <TouchableOpacity style = {image && disableButton? styles.confirmButton: styles.disabledButton} onPress={changeProfilePic} disabled={image&& disableButton? false: true}>
            <Text style={styles.buttonText} >Confirmar</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
    )
}

export default UpdateProfilePicture

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    header: {
        width: '20%',
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerImg: {
        width:150,
        height: 60
    },
    sectionTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width:'100%',
        marginTop: 20
    },  
    sectionTitleText: {
        marginLeft: 10,
        fontFamily:'OpenSans_500Medium',
        fontSize: 15,
    }, 
  
    previewImage: {
        width: 150,
        height: 150,
        marginTop: 10,
        borderRadius: 100
    },
      buttonSectionImageModal: {
        width: '90%',
        height: '13%',
        marginTop: "5%",
        backgroundColor: "#F1F1F1",
        borderRadius: 15,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 15
    },
    button: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '33.3%',
       
    },
    buttonImageText: {
        fontFamily: 'OpenSans_500Medium',
        fontSize: 16,
        paddingLeft: 20,
    },
    icon: {
        right: 20
    },
    divider: {
        width: '90%',
        height: '1%',
        backgroundColor: '#d4d2d2',
    },
    disabledButton:{
        marginTop: 10,
        width:'60%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#CACACA'
        
    },
    confirmButton:{
        marginTop: 10,
        width:'60%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#4C11CB'
        
    },
    buttonText: {
        fontFamily:'OpenSans_400Regular',
        fontSize: 15,
        color: 'white' 
    },

})