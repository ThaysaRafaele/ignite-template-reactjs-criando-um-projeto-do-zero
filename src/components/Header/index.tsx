import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image src="/Logo.svg" className={styles.logo} alt="logo" />
        </a>
      </Link>
    </header>
  );
}
