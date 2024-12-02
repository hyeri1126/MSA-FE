'use client'

import { useState, useEffect } from 'react';
import styles from './business-dropdown.module.css';
import { nextClient } from '@/lib/nextClient';
import { useAuth } from '@/contexts/AuthProvider';

const BusinessSelectDropdown = () => {
    const [allBusinesses, setAllBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const {storeId, setStoreId} = useAuth();

    useEffect(()=>{
        async function fetchStores() {
            try{
                const response = await nextClient.get('/store/storelist');
                console.log("api 응답 데이터:",response.data);
                // 필요한 데이터만 추출
                const business = response.data.map(({id,storeName}) =>({
                    storeId: id,
                    storeName,
                }));
                console.log(business)
                setAllBusinesses(business);

                // 첫 번째 가게를 기본 선택
                if (response.data.length > 0) {
                    setSelectedBusiness(business[0]);
                    setStoreId(business[0].storeId);
                }
            } catch(error){
                console.error('Error fetching store list:', error);
            }
        }
        fetchStores();
    }, [setStoreId]);


    const filteredBusinesses = allBusinesses.filter(business => business !== selectedBusiness);

    const handleSelect = (business) => {
        setSelectedBusiness(business);
        setStoreId(business.storeId);
        setIsOpen(false);
        console.log("선택된 storeId:", business.storeId);
    };

    return (
        <div className={styles.dropdown}>
            <button 
                className={`${styles.dropbtn} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.businessName}>
                    {selectedBusiness?selectedBusiness.storeName : '가게를 선택하세요'}
                </span>
                <span className={styles.arrow}>▼</span>
            </button>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    {filteredBusinesses.map((business) => (
                        <div 
                            key={business.storeId}
                            onClick={() => handleSelect(business)}
                            className={styles.dropdownItem}
                        >
                           {business.storeName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusinessSelectDropdown;