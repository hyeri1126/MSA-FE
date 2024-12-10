import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function AccountStep(){

    const {formData, setFormData, error} = useRegistration();

    const handleInputChange = (e) => {
        const value = e.target.value;
        // 숫자와 하이픈만 입력 가능하도록
        if (/^[0-9-]*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                accountNumber: value
            }));
        }
    };
    
    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>계좌 정보 입력</h2>
            <div className={styles.description}>
                <p style={{ color: '#3b82f6', fontWeight: 500 }}>*  우리은행 계좌만 등록 가능합니다.</p>
                <p>사업자 명의의 계좌를 입력해 주세요.</p>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>계좌번호</label>
                <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="계좌번호를 입력하세요"
                />
            </div>

            <div className={styles.agreementSection}>
                <h3>약관 동의</h3>
                <div className={styles.agreementItem}>
                    <input type="checkbox" id="bankTerms" />
                    <label htmlFor="bankTerms">계좌 인증 약관 동의 (필수)</label>
                    <button className={styles.viewTerms}>내용보기</button>
                </div>
                <div className={styles.agreementItem}>
                    <input type="checkbox" id="personalInfo" />
                    <label htmlFor="personalInfo">개인정보 수집 및 이용 동의 (필수)</label>
                    <button className={styles.viewTerms}>내용보기</button>
                </div>
            </div>            
            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
        </div>
    )
}