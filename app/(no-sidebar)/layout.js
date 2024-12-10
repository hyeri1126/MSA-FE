import GuestHeader from '@/components/header/guest-header/guest-header';
import classes from './layout.module.css';
import { Footer } from '@/components/footer/footer';

export default function NoSidebarLayout({ children }) {
  return (
    <div className={classes.no_sidebar_layout}>
          
        <header className={classes.no_side_header}>
            <GuestHeader />
        </header>
        
        <div className={classes.no_side_main}>
            {children}  
        </div>

        <footer className={classes.no_side_footer}>
          <Footer />
        </footer>

    </div>
  );
}
