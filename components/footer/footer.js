import styles from "./footer.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.links}>
                    <img src="/images/logo.png"  alt="집계리아" className={styles.logo} />
                    <a href="/service-terms">서비스이용약관</a>
                    <a href="/privacy">개인정보처리방침</a>
                    <a href="/marketing">오픈뱅킹 서비스 이용약관</a>
                    <a href="/data-policy" style={{marginRight:"150px"}}>마이데이터 서비스 이용약관</a>
                    <div className={styles.copyright}>
                        Copyright 2024 집계리아. All rights reserved.
                    </div>
                </div>
             
            </div>
        </footer>
    );
}