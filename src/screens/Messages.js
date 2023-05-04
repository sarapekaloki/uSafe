import React, {useState, useEffect, useRef} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ScrollView
} from "react-native";
import {auth} from "../../firebase";
import {doc, getFirestore, setDoc} from "firebase/firestore";
import {Ionicons} from "@expo/vector-icons";
import {Message} from "../components/Message";
import {getCurrentUser} from "../hooks/getCurrentUser";
import { useIsFocused } from '@react-navigation/native';


export default function Messages(props) {

    const db = getFirestore();
    const [alreadyScrolled, setAlreadyScrolled] = useState(false);
    const scrollViewRef = useRef();

    const [text, setText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [gotInfo, setGotInfo] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if(!gotInfo || !currentUser){
            getCurrentUser(setCurrentUser).then();
            setGotInfo(true);
        }});

    useEffect(()=>{
    },[currentUser]);

    useEffect(()=>{
        if(isFocused){
            props.changeCurrentScreen("Chat");
        }
    })

    useEffect(()=>{
        if(isFocused){
            const messages = props.currentChat.messages;
            if(messages.length <= 0){
                return;
            }
            for(let i=0;i<messages[messages.length-1].seenBy.length;i++){
                if(messages[messages.length-1].seenBy[i].email === auth.currentUser.email){
                    return;
                }
            }
            applySeen(messages);
        }
    },[isFocused,props.currentChat.messages])

    const applySeen = (messages)=>{
        if(currentUser){
            const currentUserObject = {
                email: auth.currentUser.email,
                pictureUrl:currentUser.pictureUrl
            }

            messages.forEach(message => {
                message.seenBy = message.seenBy.filter(seenByObject => {
                    return seenByObject.email !== auth.currentUser.email;
                });
            });

            messages[messages.length-1].seenBy.push(currentUserObject);


            modifyChat({
                user:props.currentChat.user,
                members:props.currentChat.members,
                messages:messages,
            }).then();
            setTimeout(()=>{scrollViewRef.current.scrollToEnd({ animated: true })},500);
        }
    }

    const scrollToEnd = () => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }
    const scrollAtRender = ()=>{
        if(!alreadyScrolled){
            scrollViewRef.current.scrollToEnd({ animated: true });
            setTimeout(()=>{setAlreadyScrolled(true)},500)
        }
    }

    async function modifyChat(messages) {
        const docRef = doc(db, "chat", props.currentChat.user);
        await setDoc(docRef, messages);
    }

    const handleSend = () => {
        if(text === ''){
            Keyboard.dismiss();
            return;
        }
        const time = Date.now();

        const message = {
            sender: auth.currentUser.email,
            content: text,
            time: time,
            consecutive: false,
            first:true,
            seenBy:[]
        }
        const messages = props.currentChat.messages;

        if(messages.length !== 0 && messages[messages.length-1].sender === message.sender){
            messages[messages.length-1].consecutive = true;
            message.first = false;
        }
        messages.push(message);
        modifyChat({
            user:props.currentChat.user,
            members:props.currentChat.members,
            messages:messages,
        }).then();
        setText('');
        Keyboard.dismiss();
        scrollToEnd();
    };

    const renderMessages = ()=>{
        return props.currentChat.messages.map((message,index) =>{
                return <Message
                    key={index}
                    message={message}
                    victim={props.currentChat.user}
                    currentChat={props.currentChat}
                />
            }
        )
    }

    useEffect(() => {},[props.currentChat, alreadyScrolled]);
    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
           <ScrollView
               style={styles.messages}
               ref={scrollViewRef}
               onContentSizeChange={scrollAtRender}
           >
               {
                   renderMessages()
               }

           </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={text}
                    onChangeText={setText}
                    placeholder="Escribe tu mensaje..."
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                />
                <View style={styles.sendButton}>
                    <TouchableOpacity onPress={handleSend}>
                        <Ionicons name={'paper-plane-outline'} size={24} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    messages: {
        flex: 1,
        marginBottom:70,
        padding:15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        // position: "absolute",
        bottom: '16%',
        width: "100%",
        height:'16%',
        backgroundColor: "#ffffff",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textInput: {
        flex: 1,
        height: 50,
        borderWidth: 0,
        borderColor: 'transparent',
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: '#f7f5f5',
        bottom:'4%'
    },
    sendButton: {
        backgroundColor:'#FF66C4',
        fontWeight: "bold",
        borderRadius:50,
        height: 50,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        bottom:'4%'
    }
})
