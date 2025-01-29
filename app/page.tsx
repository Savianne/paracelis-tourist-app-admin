import Image from "next/image";
import styles from "./page.module.css";

//Componets
import WelcomeAdmin from "./components/WelcomeAdmin";

export default function Home() {
  return (
    <div className={styles.maincontainer}>
      <WelcomeAdmin />
    </div>
  );
}
