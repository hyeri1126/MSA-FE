import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function StoreInfoStep(){
    const {formData, setFormData, error} = useRegistration();

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>사업자정보 입력</h2>
            <div className={styles.description}>
              <p>• 실제 사업자등록증의 정보와 동일하게 입력해주세요</p>
              <p>• 입력하신 정보는 국세청 정보와 대조됩니다</p>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>사업장 상호명</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className={styles.input}
                placeholder="상호명을 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>사업자 번호</label>
              <input
                type="text"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="사업자 번호를 입력하세요"
              />
            </div>
            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
          </div>
    )
}