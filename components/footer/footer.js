import Image from 'next/image';
import styles from "./footer.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/images/logo.png"
                            alt="집계리아"
                            width={70}
                            height={20}
                            priority
                        />
                    </div>
                    <nav className={styles.links}>
                        <a href="/service-terms">서비스이용약관</a>
                        <a href="/privacy">개인정보처리방침</a>
                        <a href="/marketing">오픈뱅킹 서비스 이용약관</a>
                        <a href="/data-policy">마이데이터 서비스 이용약관</a>
                    </nav>
                    <div className={styles.copyright}>
                        Copyright 2024 집계리아. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}