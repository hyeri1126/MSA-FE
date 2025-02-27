import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import { useState } from "react";

export default function VerificationStep(){
    const { 
        verificationData, 
        setVerificationData, 
        sendVerificationEmail, 
        isEmailSent, 
        verifyEmailCode, 
        error,
        success,
        isEmailErrored,
        isEmailNumSuccess
    } = useRegistration()

    // 성공 메시지를 위한 상태 추가
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    // verifyEmailCode를 호출하고 성공 메시지를 처리하는 함수
    const handleVerification = async () => {
        const response = await verifyEmailCode();
        if (response) {
            setVerificationSuccess(true);
        }
    };
    
    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>본인 인증</h2>
            <div className={styles.description}>
                <p>사업자 본인 확인을 위한 인증 절차입니다.</p>
                <p>입력하신 이메일로 인증번호가 발송됩니다.</p>
            </div>
            <div className={styles.verificationBox}>
           
                <>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>이름</label>
                        <input
                        type="text"
                        value={verificationData.name}
                        onChange={(e) => setVerificationData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        className={styles.input}
                        placeholder="이름을 입력하세요"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>이메일</label>
                        <input
                        type="email"
                        value={verificationData.email}
                        onChange={(e) => setVerificationData(prev => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        className={styles.input}
                        placeholder="이메일을 입력하세요"
                        />
                    </div>
                    
                    {/* 인증 메일 발송 버튼 */}
                    {!isEmailSent && (
                        <button
                            onClick={sendVerificationEmail}
                            className={`${styles.button} ${styles.primaryButton}`}
                        >
                            인증 메일 발송
                        </button>
                    )}
                   
                    {error && (
                        <div className={styles.errorText}>
                            {error}
                        </div>
                    )}
                </>
                {isEmailSent && (
                    <>
                      <div className={styles.formGroup}>
                       
                        <button
                            onClick={sendVerificationEmail}
                            className={`${styles.button} ${styles.primaryButton}`}
                        >
                            인증번호 재발송
                        </button>
                        {success && (
                            <div className={styles.successText}>
                                {success}
                            </div>
                        )}
                        <label className={styles.label}>인증 코드</label>
                        <input
                            type="text"
                            value={verificationData.verificationCode}
                            onChange={(e) => setVerificationData(prev => ({
                                ...prev,
                                verificationCode: e.target.value
                            }))}
                            className={styles.input}
                            placeholder="인증 코드 6자리"
                            maxLength={6}
                        />
                      </div>
              
                      <button
                          onClick={handleVerification}
                          className={`${styles.button} ${styles.primaryButton}`}
                      >
                          확인
                      </button>
                        {isEmailNumSuccess && (
                            <div className={styles.successText}>
                                {isEmailNumSuccess}
                            </div>
                        )}
                        {isEmailErrored && (
                            <div className={styles.errorText}>
                                {isEmailErrored}
                            </div>
                        )}
                    </>
                )}
              
            </div>
        </div>
    )
}