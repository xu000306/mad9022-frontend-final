import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Notice.module.css";
import { useData, DataProvider } from "../context/DataContext";
import { Link } from "react-router-dom";

export default function Notice() {
  const { notice } = useData();
  console.log(notice);

  return (
    <div>
      <h3>
        Notice for my crap is interested or agreed, scheduled crap as I am
        buyer,please check the button for details:
      </h3>
      {notice?.length > 0 ? (
        notice.map((item) => (
          <p key={item._id} className={styles.item}>
            Crap: {item.title} in status {item.status} require your response:
            <Link to={`/crap/${item._id}`} className={styles.viewButton}>
              View Details
            </Link>
          </p>
        ))
      ) : (
        <h4>Nothing update!</h4>
      )}
    </div>
  );
}
