import {createContext, useContext, useState, useEffect} from "react";
import { nextClient } from "@/lib/nextClient";

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children, mode = "first"}) => {
    const [formData, setFormData] = useState({
        storeName: "",
        businessNumber: "",
        accountNumber: "",
        bankCode: "020",
        location: "",
        latitude : 0,
        longitude : 0
    })
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState("");

    const steps = mode === 'first' 
    ? ['business', 'account', 'verification', 'pin', 'address']
    : ['business', 'account', 'pin', 'address'];
    
    const [verificationData, setVerificationData] = useState({
        name: "",
        email: "",
        pinNumber: "",
        verificationCode : ""
    })

    // 각 단계별 검증 상태
    // 3단계 인증 관련 state
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    // 4단계 인증 관련 state
    const [isPinVerified, setIsPinVerified] = useState(false);

  
    // currentStep이 변경될 때마다 실행되는 useEffect 추가
    useEffect(() => {
        console.log(`현재 스텝이 ${currentStep}로 변경되었습니다.`);
    }, [currentStep]);  // currentStep을 dependency로 지정


    // Step 1: 사업자 정보 확인 
    const validateBusinessInfo = async () => {
        try {
            const response = await nextClient.post('/store/registration/businesscheck', {
                businessNumber: formData.businessNumber,
                storeName: formData.storeName
            });
            
            console.log(response.data);
            
            if (response.data.success) {
                setError("");
                return true;
            } else {
                setError("사업자 정보 검증에 실패했습니다.");
                return false;
            }
          
        } catch (error) {
            console.error('next 서버 오류:', error.message);
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 2: 계좌 인증
    const validateAccount = async () => {
        try {
            // 계좌 인증 API 호출 (예시)
            const response = await nextClient.post('/store/registration/accountcheck', {
                bankCode: "020", //우리은행 고정 
                accountNumber: formData.accountNumber,
            });
            
            if (response.data) {
                setError(""); // 성공시 에러 초기화
                return true;
            }
            setError("계좌 인증에 실패했습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 3-1: 이메일 인증 코드 발송
    const sendVerificationEmail = async () => {
        try {
            const response = await nextClient.post('/store/registration/emailcheck', {
                email: verificationData.email,
                name: verificationData.name
            });
            
            console.log("스프링에서 프론트까지 전달",response.data);
            
            if (response.data) {
                setError("");
                return setIsEmailSent(true);
            }
            setError("인증 코드 발송에 실패했습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 3-2: 이메일 인증 코드 확인
    const verifyEmailCode = async () => {
        try {
            const response = await nextClient.post('/store/registration/emailpincheck', {
                email: verificationData.email,
                emailPinNumber: verificationData.verificationCode
            });
            if (response.data) {
                setError("");
                setIsEmailVerified(true);
                return true;
            }
            setError("인증 코드가 일치하지 않습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 3-3: 이메일 인증 완료 후 다음 단계 검증
    const validateEmailVerification = async () => {
        if (isEmailVerified) {
            return true;
        }
        setError("이메일 인증을 먼저 완료해주세요.");
        return false;
    };

    // Step 4-1: PIN 번호 등록 및 검증 -> PinStep에서 사용
    const registerPin = async () => {
        try {
            const response = await nextClient.post('/store/registration/pinnumbercheck', {
                email: verificationData.email,
                pinNumber: verificationData.pinNumber
            });
            
            if (response.data) {
                setError("");
                setIsPinVerified(true);
                return true;
            }
            setError("PIN 번호 등록에 실패했습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

  
    // Step 5: 최종 가게 등록
    const finalizeRegistration = async () => {
        try {
            const response = await nextClient.post('/user/store', {
                ...formData,
                // location과 coordinates는 주소 입력 시 설정됨
            });
            
            if (response.data) {
                setError("");
                return true;
            }
            setError("가게 등록에 실패했습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    return (
        <RegistrationContext.Provider value={{
            mode,
            formData,
            setFormData,
            currentStep,
            setCurrentStep,
            steps,
            verificationData,
            setVerificationData,
            validateBusinessInfo,
            validateAccount,
            verifyEmailCode,
            registerPin,
            sendVerificationEmail,
            finalizeRegistration, // 모든 함수 포함
            isEmailSent,
            setIsEmailSent,
            error,
            setError,
            validateEmailVerification,
            isEmailVerified,
            isPinVerified,
        }}>
            {children}
        </RegistrationContext.Provider>
    )
}


export const useRegistration = () => useContext(RegistrationContext)