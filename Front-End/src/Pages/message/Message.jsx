import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Message.scss";
import axios from "axios";
import swal from "sweetalert";
import { getAuthUser } from "../../localStorage/storage";

const Message = () => {

  let { id } = useParams();

  const [message, setMessage] = useState({
    err: null,
    loading: false,
    data: "",
  });

  const [messages, setMessages] = useState({
    loading: true,
    results: null,
    err: null,
    status: null,
    reload: 0
  });

  const [conversationData, setConversationData] = useState({
    loading: true,
    results: null,
    err: null,
    status: null,
    reload: 0
  });


  useEffect(() => {
    axios.get("http://localhost:3000/api/conversations/getConversationById/" + id)
      .then(
        resp => {
          console.log(resp);
          console.log(resp.data);
          setConversationData({ results: resp.data.conversationData, loading: false, err: null });
        }
      ).catch(err => {
        console.log(err);
        // setConversationData({ ...conversationData, loading: false, err: err.response.data.errors });
      })
  }, [conversationData.reload]);


  const user = getAuthUser();

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/messages/addMessage", {
        conversation: id,
        senderId: user._id,
        senderType: user.role,
        messageContent: message.data
      })
      .then((resp) => {
        console.log(resp);
        setMessages({ ...messages, reload: messages.reload + 1 });
        setMessage({ ...messages, data: "" });
        // window.scrollBy(0, -200);
        // alert(window.scrollX + window.scrollY);

        var elem = document.getElementById("chatScroll");
        elem.scrollBy(0, 8000);
        // elem.scrollIntoView()
        // elem.scroll(0, 1000)
        // elem.scroll(0, elem.scrollHeight)
        // elem.scrollTo(0, elem.scrollHeight)
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  useEffect(() => {
    axios.get("http://localhost:3000/api/messages/getConversationMessages/" + id)
      .then(
        resp => {
          console.log(resp);
          console.log(resp.data);
          setMessages({ results: resp.data, loading: false, err: null });
          var elem = document.getElementById("chatScroll");
          elem.scrollBy(0, elem.scrollHeight);
          window.scrollTo(0, 200)
        }
      ).catch(err => {
        // setMessages({ ...messages, loading: false, err: err.response.data.errors });
      })
  }, [messages.reload]);

  return (
    <div className="message">
      {conversationData.results &&
        <>
          <span className="messageTitle">
            <Link className="messagePath" reloadDocument to="/messages">Messages</Link> {'>'} <Link reloadDocument className="messageSenderNameLink" to={user.role == "client" ? "/profile/" +  conversationData.results.freelancer._id : "/profile/" + conversationData.results.client._id}>{user.role == "client" ? conversationData.results.freelancer.name : conversationData.results.client.name}</Link> {'>'}
          </span>
          <div className="chatPage">
            <div id="chatScroll" className="messageContainer">
              <div className="messages">
                {
                  messages.loading == false && messages.err == null && messages.results && messages.results.length > 0 && (
                    messages.results.map((message) => (
                      <>
                        <div className={message.senderType == "client" ? "item owner" : "item"}>
                          <Link reloadDocument to={message.senderType == "client" ? "/profile/" +  conversationData.results.client._id : "/profile/" + conversationData.results.freelancer._id}>
                              <img
                                src={message.senderType == "client" ? conversationData.results.client.image_url : conversationData.results.freelancer.image_url}
                              />
                          </Link>
                          <p>
                            {message.messageContent}
                            <img
                              className="seen"
                              src="/img/read.png"
                            />
                          </p>
                        </div>
                      </>
                    ))
                  )
                }
              </div>
            </div>
            <hr />
            <div className="sendContainer">
              <div className="write">
                <textarea value={message.data} type="text" placeholder="Write a message" onChange={(e) =>
                  setMessage({ ...message, data: e.target.value })
                } />
              </div>
              <>
                <button className="sendButton" onClick={sendMessage}>Send</button>
              </>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default Message;
