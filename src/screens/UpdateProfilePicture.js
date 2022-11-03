import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { uploadBytesResumable, ref, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import {getFirestore, doc, updateDoc} from 'firebase/firestore';
import { Image, StyleSheet, Text, TextInput, Pressable, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import * as ImagePicker from 'expo-image-picker';



const UpdateProfilePicture = () => {
    const navigation = useNavigation();
    const firestore = getFirestore();
    const route = useRoute();
    const storage = getStorage();
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const [pickerResponse, setPickerResponse] = useState(null);
    const [image, setImage] = useState(null);
    const userData = route.params.userData;


//Change profile picture
 const changeProfilePic = () =>  {
    if(userData.pictureUrl != ""){
        deleteObject(ref(storage,`users-images/${currentEmail}`))
    }
    const storageRef = ref(storage, `users-images/${currentEmail}`);
    try {
      // Here we transform our uri into a blob image
      fetch(image).then((res) => {
        res.blob().then((myBlob) => {
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
                        username: userData.username
                    };
                
                    const docRef = doc(firestore, "users2", currentEmail);
                    updateDoc(docRef, newDoc).then(() => {
                        navigation.navigate('Tabs', { screen: 'Configuracion' })                    
                    });       
                    }
                );
                }
            );
        })
      });
      // Then we get the reference of WHERE exactly in our bucket we want to store the image
  
      // Then we create our job
  
     
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
                quality: 1,
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
                quality: 1,
              });
            if (!result.cancelled) {
            setImage(result.uri);
          }
        }
    
      }


    return( 
    <KeyboardAvoidingView style={styles.usernameModalContainer}>
        
        <View style={styles.modalHeader}>
            <Image style={styles.modalLogo} source={require('../../assets/img/longLogoPurple.png')}></Image>
        </View>
        
        <View style={styles.modalContentsContainer}>
        <TouchableOpacity onPress={() =>navigation.navigate('Tabs', { screen: 'Configuracion' })}>
            <Image style={styles.leftArrow} source={require('../../assets/icons/leftArrow.png')}></Image>
        </TouchableOpacity>
            
            <Text style = {styles.modalPasswordText} >Cambiar foto de perfil</Text>
        </View>
        <View style= {styles.dividerModal}></View>


        <Image style={styles.previewImage} source={image? {uri: image} : require('../../assets/img/initial-profile-picture.jpeg')}></Image>
        <Text style={styles.previewImageText}> Vista previa</Text>

        <View style = {styles.buttonSectionImageModal}>
            <TouchableOpacity style = {styles.button} onPress={onImageLibraryPress}>
                <Text style={styles.buttonImageText} >Desde el carrete</Text>
                <Image style={styles.icon} source={require('../../assets/icons/photo-icon.png')}></Image>
            </TouchableOpacity>
            <View style= {styles.divider}></View>
            <TouchableOpacity style = {styles.button} onPress={onCameraPress}>
                <Text style={styles.buttonImageText} >Desde la cámara</Text>
                <Image style={styles.icon} source={require('../../assets/icons/camera-icon.png')}></Image>
            </TouchableOpacity>
        </View>
        <View style = {styles.infoContainer}>
                <Image style={styles.infoIcon} source={require('../../assets/icons/infoIcon.png')}></Image>
                <Text style ={styles.reminderMessage}>Recuerda que será visible para todos los usuarios</Text>
            </View>
        <TouchableOpacity style = {image? styles.confirmButton: styles.disabledButton} onPress={changeProfilePic} disabled={image? false: true}>
            <Text style={styles.deleteText} >Confirmar</Text>
        </TouchableOpacity>
        
    </KeyboardAvoidingView>
    )
}

export default UpdateProfilePicture

const styles = StyleSheet.create({
    usernameModalContainer: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: '100%'
        // justifyContent: 'center'
    },
    modalHeader: {
        backgroundColor: '#D4B2EF',
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowOffset: {width: -2, height: 4},  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 3,  
    },
    modalLogo: {
        marginTop:25,
        width: 180,
        height: 68
        
    },
    modalContentsContainer: {
        flexDirection: "row",
        marginTop: 15,
        width:"100%",
        justifyContent:"flex-start"
    },
    leftArrow: {
        width:20,
        height:20,
        left: 10,
    },
    modalPasswordText: {
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 80

    },
    dividerModal: {
        width: '70%',
        height: '0.2%',
        backgroundColor: '#d4d2d2',
        marginTop: 10
    },
    previewImage: {
        width: 150,
        height: 150,
        marginTop: 10,
        borderRadius: 60
    },
      buttonSectionImageModal: {
        width: '90%',
        height: '15%',
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
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 20,
    },
    icon: {
        width:20,
        height:20,
        right: 20
    },
    divider: {
        width: '90%',
        height: '1%',
        backgroundColor: '#d4d2d2',
    },
    infoContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 30
    },
    infoIcon: {
        width:15,
        height:15,
        right: 30
    },
    reminderMessage: {
        fontWeight: '300',
        fontSize: 12,
        color:'#A5A5A5',
        right:25
    },

    confirmButton: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'#28194C',
        width: '90%',
        borderRadius: 10,
    },
    disabledButton: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'#b8b8b8',
        width: '90%',
        borderRadius: 10,
    },
    deleteText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16
     
    },

})