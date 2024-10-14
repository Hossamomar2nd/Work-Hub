import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Messages.scss";
import { getAuthUser } from "../../localStorage/storage";
import axios from "axios";
import Alert from "@mui/material/Alert";

export const processDate = (messageTime) => {

  const getDate = new Date();

  const currentTime = getDate.getTime();

  const timeDifference = Math.abs(currentTime - messageTime);

  // For example, to get the difference in minutes:
  const differenceInMinutes = timeDifference / (1000 * 60);

  // To get the difference in hours:
  const differenceInHours = timeDifference / (1000 * 60 * 60);

  // To get the difference in days:
  const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);

  const differenceInMonths = timeDifference / (1000 * 60 * 60 * 24 * 30);

  // To get the difference in seconds:
  const differenceInSeconds = timeDifference / 1000;

  if(Math.round(differenceInSeconds) >= 60) {
    if(Math.round(differenceInMinutes) >= 60) {
      if(Math.round(differenceInHours) >= 24) {
        if(Math.round(differenceInDays) >= 30) {
          return Math.round(differenceInMonths) + "mos";
        }
        return Math.round(differenceInDays) + "d";
      }
      return Math.round(differenceInHours) + "h";
    }
    return Math.round(differenceInMinutes) + "m";
  }
  return "Just now";
};

const Messages = () => {
  
  const user = getAuthUser();

  const navigate = useNavigate();

  const [conversations, setConversations] = useState({
    loading: true,
    results: null,
    err: null,
    status: null,
    id: "",
    reload: 0
  });

  useEffect(() => {
    axios.get("http://localhost:3000/api/conversations/getConversationsByUserId/" + user._id)
      .then(
        resp => {
          // console.log(resp);
          console.log(resp.data);
          console.log(resp.data.result);
          let data = resp.data.result

          if(!Array.isArray(data)) {
            data = [resp.data.result];
          }

          setConversations({ results: data, loading: false, err: null });
        }
      ).catch(err => {
        console.log(err);
        setConversations({ ...conversations, loading: false, err: err.response.data.msg });
      })
  }, [conversations.reload]);


  const message = (e) => {
    // console.log(e.target.value);
    const freelancerId = e.target.value;

    axios
      .post("http://localhost:3000/api/conversations/addConversation", {
        freelancer: freelancerId,
        client: user._id
      })
      .then((resp) => {
        const conversationId = resp.data.newConversationData[0]._id;
        // console.log(resp.data.newConversationData[0]._id);
        // navigate("/message/" + conversationId);
      })
      .catch((errors) => {
        console.log(errors);
        // navigate("/messages");
      });
  }




  const openChat = (e) => {
    const conservationId = e.target.id;

    // axios.put("http://localhost:3000/api/messages/updateMessagesStatus/:id/:role" + user._id)
    //   .then(
    //     resp => {
    //       console.log(resp);
    //       // console.log(resp);
    //       // console.log(resp.data);
    //       // console.log(resp.data.result);
    //       // let data = resp.data.result

    //       // if(!Array.isArray(data)) {
    //       //   data = [resp.data.result];
    //       // }

    //       // setConversations({ results: data, loading: false, err: null });
    //     }
    //   ).catch(err => {
    //     console.log(err);
    //     // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
    //   })
    window.location.replace("http://localhost:3001/message/" + conservationId);

    // navigate("/message/" + conservationId);
  }


  // const message = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
  // maxime cum corporis esse aspernatur laborum dolorum? Animi
  // molestias aliquam, cum nesciunt, aut, ut quam vitae saepe repellat
  // nobis praesentium placeat.`;

  return (
    <div className="messages">
      <div className="messagesContainer">
        <div className="title">
          <h1>Messages</h1>
        </div>
        <table>
          <tr>
          <th className="userImg">Image</th>
            <th className="userName">{user.role == "freelancer" ? "Client" : "Freelancer"}</th>
            <th className="lastMessage">Last Message</th>
            <th className="date">Date</th>
            <th className="action">Action</th>
          </tr>

          {conversations.loading == false &&
            conversations.err == null &&
            conversations.results &&
            conversations.results.length > 0 &&
            conversations.results.map((conversation) => (
              <>
                <tr className={conversation.lastMessage.senderId !== user._id ? "active" : null}>
                <td>
                    <Link reloadDocument to={user.role == "client" ? "/profile/" + conversation?.freelancer._id : "/profile/" + conversation?.client._id}>
                        <img
                            className="image"
                            src={user.role == "client" ? conversation?.freelancer.image_url : conversation?.client.image_url}
                            alt=""
                        />
                    </Link> 
                </td>
                <td className="userNameData"><Link reloadDocument className="link" to={user.role == "client" ? "/profile/" + conversation?.freelancer._id : "/profile/" + conversation?.client._id }><p>{user.role == "freelancer" ? conversation.client.name : conversation.freelancer.name}</p></Link></td>
                  <td className="lastMessageData">
                    <Link id={conversation._id} onClick={openChat} className="link">
                      {conversation.lastMessage.messageContent.substring(0, 100)}...
                    </Link>
                  </td>
                  <td className="dateData">{processDate(conversation.lastMessage.creationDate)}</td>
                  <td className="actionBtn">
                    {conversation.lastMessage.senderId !== user._id ? <button>Mark as Read</button> : null}
                  </td>
                </tr>
              </>
            ))}
        </table>
        {conversations.err !== null &&
                <div className='communityFilterAlert'>
                  <Alert severity="info">{conversations.err}</Alert>
                </div>
        }
      </div>
    </div>
  );
};

export default Messages;
