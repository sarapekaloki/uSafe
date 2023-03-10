import {useState} from "react";

export const useTogglePasswordVisibility = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('ios-eye-off-outline');

    const handlePasswordVisibility = () => {
        if(rightIcon === 'ios-eye-outline'){
            setRightIcon('ios-eye-off-outline');
            setPasswordVisibility(!passwordVisibility);
        } else if(rightIcon === 'ios-eye-off-outline'){
            setRightIcon('ios-eye-outline');
            setPasswordVisibility(!passwordVisibility);
        }
    };

    return {
        passwordVisibility,
        rightIcon,
        handlePasswordVisibility
    };
};
