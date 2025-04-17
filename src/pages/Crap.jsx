import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";
import styles from "./Crap.module.css";

//list name of buttons
const initialBtnStates = {
  interest: false,
  flush: false,
  schedule: false,
  agree: false,
  disagree: false,
  buyerReset: false,
  sellerReset: false,
  suggestion: false,
};
function checkIfMyCrap(token, crapDetail) {
  if (token && crapDetail) {
    //check if my crap
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const userId = JSON.parse(payloadJson).id;
    console.log(userId, "||", crapDetail.owner._id);

    if (userId === crapDetail.owner._id) {
      return true;
    }
    return false;
  }
}
function checkIfIAmBuyer(token, crapDetail) {
  if (token && crapDetail) {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const userId = JSON.parse(payloadJson).id;
    console.log(userId, "||", "buyer", crapDetail?.buyer?._id, crapDetail);

    if (userId === crapDetail?.buyer?._id) {
      return true;
    }
    return false;
  }
}

export default function Crap() {
  const token = Cookies.get("token");
  const isMyCrapRef = useRef(false);
  const amIbuyer = useRef(false);
  const [btnStates, setBtnStates] = useState(initialBtnStates);
  const [crapDetail, setCrapDetail] = useState({});
  const [error, setError] = useState("");
  //get crap id
  const { id } = useParams();
  //fetch single crap once
  const { fetchData } = useData();
  useEffect(() => {
    fetchData({
      method: "GET",
      req: id,
    }).then((res) => {
      isMyCrapRef.current = checkIfMyCrap(token, res);
      setCrapDetail(res);
    });
  }, []);

  //decide button states
  useEffect(() => {
    // prevent empty owen
    if (!(crapDetail && crapDetail?.owner?._id)) {
      return console.log("no crap!");
    }

    isMyCrapRef.current = checkIfMyCrap(token, crapDetail);
    amIbuyer.current = checkIfIAmBuyer(token, crapDetail);
    console.log("amIbuyer.current", amIbuyer.current);
    const status = crapDetail.status.toLowerCase();
    //clean the buttons
    setBtnStates({ initialBtnStates });

    if (isMyCrapRef.current) {
      // if (status === "available") {
      //   setBtnStates({ ...initialBtnStates, flush: true });
      // }
      if (status === "interested") {
        setBtnStates({ ...initialBtnStates, schedule: true });
      }
      if (status === "scheduled") {
        setBtnStates({
          ...initialBtnStates,
          buyerReset: true,
          suggestion: true,
        });
      }
      if (status === "agreed") {
        setBtnStates({ ...initialBtnStates, flush: true });
      }
    }
    //not my crap and I am the buyer
    if (!isMyCrapRef.current) {
      if (status === "available") {
        setBtnStates({ ...initialBtnStates, interest: true });
      }
      if (status === "interested" && amIbuyer.current) {
        setBtnStates({ ...initialBtnStates, buyerReset: true });
      }
      if (status === "scheduled" && amIbuyer.current) {
        setBtnStates({
          ...initialBtnStates,
          agree: true,
          disagree: true,
          suggestion: true,
        });
      }
    }
    //if flushed hide all buttons
    if (status === "flushed") {
      setBtnStates({ ...initialBtnStates });
    }
  }, [crapDetail]);

  function doFetch(request) {
    fetchData({
      req: request,
    }).then((res) => {
      if (!res?.title) return setError("invalid response data ");
      setCrapDetail({ ...res });
    });
  }
  function flush() {
    console.log("flush!");
    doFetch(`${id}/flush`);
  }
  function setInterest() {
    console.log("interested!");
    doFetch(`${id}/interested`);
  }
  function reset() {
    console.log("reset!");
    doFetch(`${id}/reset`);
  }
  function agree() {
    console.log("agree");
    doFetch(`${id}/agree`);
  }
  function disagree() {
    console.log("disagree");
    doFetch(`${id}/disagree`);
  }
  function schedule(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);
    const address = data.get("address");
    const date = data.get("date");
    const time = data.get("time");
    console.log(address, date, time);
    if (address && date && time) {
      fetchData({
        req: `${id}/suggest`,

        body: { address, date, time },
      }).then((res) => {
        if (!res?.title) return setError(" suggest response failed");
        setCrapDetail({ ...res });
        console.log("schedule submit!");
      });
    } else {
      return setError("Empty suggestion input! ");
    }
  }
  return (
    <>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {Object.keys(crapDetail).length > 0 ? (
        <div className={styles.page}>
          <img
            src={crapDetail.images[0]}
            alt="carp picture"
            className={styles.image}
          />
          <h2>{id}</h2>
          <h2>{crapDetail.title}</h2>
          <p>Owner:{crapDetail.owner.name}</p>
          <p>{isMyCrapRef.current ? "My Crap" : "Not My Crap"}</p>
          <p>{crapDetail.description}</p>
          <p>{crapDetail.status}</p>
          {btnStates.flush && <button onClick={flush}>Flush</button>}
          {btnStates.schedule && (
            <form
              onSubmit={(ev) => {
                schedule(ev);
              }}
              className={styles.form}
            >
              <h4>Set pickup address and time:</h4>
              <input
                type="text"
                name="address"
                placeholder="Pick up address"
                required
              />
              <input type="date" name="date" required />
              <input type="time" name="time" required />
              <button>Submit schedule</button>
            </form>
          )}
          {btnStates.suggestion && crapDetail?.suggestion?.address && (
            <div className={styles.suggestion}>
              <p>{"Pick Up Suggestion:"}</p>
              <p>{crapDetail.suggestion.address}</p>
              <p>{new Date(crapDetail.suggestion.date).toLocaleDateString()}</p>
              <p>{crapDetail.suggestion.time}</p>
            </div>
          )}

          {btnStates.buyerReset && (
            <button onClick={reset}>Cancel Deal </button>
          )}

          {btnStates.interest && (
            <button onClick={setInterest}>I Want It</button>
          )}
          {btnStates.sellerReset && (
            <button onClick={reset}>Anyway,I regret! </button>
          )}
          {btnStates.agree && <button onClick={agree}>Agree</button>}
          {btnStates.disagree && <button onClick={disagree}>Disagree</button>}
        </div>
      ) : (
        <div>Crap Not Found!</div>
      )}
    </>
  );
}
