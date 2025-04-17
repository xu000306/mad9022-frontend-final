import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export default function Crap() {
  const [details, setDetails] = useState();
  // get fetch function from context provider
  const { fetchData } = useData();
  const { id } = useParams();
  const items = useData().data;
  //first time switch detail page set the details once
  useEffect(() => {
    //find the specific id
    const item = items.find((el) => el._id === id);
    setDetails(item);
  }, []);

  const token = Cookies.get("token");
  const [isMyCrap, setIsMyCrap] = useState(false);
  const [buttonStates, setButtonStates] = useState({
    flush: false,
    interest: false,
    reset: false,
    agree: false,
    disagree: false,
    schedule: false,
  });

  // dynamically show buttons when detail  update
  useEffect(() => {
    if (token && details) {
      //check if my crap
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const userId = JSON.parse(payloadJson).id;

      if (userId === details.owner._id) {
        setIsMyCrap(true);
      }
      const status = details.status.toLowerCase();

      //reset all btn states
      const newStates = {
        flush: false,
        interest: false,
        reset: false,
        agree: false,
        disagree: false,
        schedule: false,
      };
      if (isMyCrap) {
        if (status === "available") {
          newStates.flush = true;
        } else if (status === "schedule") {
          newStates.reset = true;
        }
      } else {
        if (status === "available") {
          newStates.interest = true;
        }
      }

      setButtonStates(newStates);
    }
  }, [details]);

  function flush() {
    console.log("Flush clicked");
    fetchData({}).then((res) => {
      console.log("flush back details", res);
      setDetails(res);
    });
  }
  //localhost:5000/api/crap/67f3389bc90e479ae7be4ab2/interested
  function setInterest() {
    console.log("Interest clicked");
    fetchData({
      method: "POST",
      req: `${id}/interested`,
      url: "http://localhost:5000/api/crap/67f3389bc90e479ae7be4ab2/interested",
    }).then((res) => {
      console.log("interest back details", res);
      setDetails(res);
    });
  }

  return (
    <>
      {details ? (
        <div>
          <img src={details.images[0]} alt="crap picture" />
          <h2>{id}</h2>
          <h2>{details.title}</h2>
          <p>{details.description}</p>
          <p>{details.status}</p>
          <p>{isMyCrap ? "My Crap" : "Not My Crap"}</p>
          {buttonStates.flush && <button onClick={flush}>Flush</button>}
          {buttonStates.interest && (
            <button onClick={setInterest}>I Want It</button>
          )}
          {buttonStates.reset && <button>Reset To Available</button>}
          {buttonStates.agree && <button>Agree</button>}
        </div>
      ) : (
        <div>Crap Not Found!</div>
      )}
    </>
  );
}
