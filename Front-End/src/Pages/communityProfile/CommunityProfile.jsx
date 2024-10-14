import React, { useEffect, useRef, useState } from 'react'
import "./CommunityProfile.scss";
import "../community/Community.scss";
import SideBar from '../../components/sidebar/SideBar';
import Feed from '../../components/feed/Feed';
import RightBar from '../../components/rightbar/RightBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getAuthUser, setAuthUser } from '../../localStorage/storage';
import { processDate } from '../messages/Messages';
import swal from 'sweetalert';
import Alert from '@mui/material/Alert';

const CommunityProfile = (data) => {

    const user = getAuthUser()

    const coverImage_url = useRef(null);

    const uploadCoverImage = (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.append("coverImage", coverImage_url.current.files[0]);
        axios
          .put("http://localhost:3000/api/communities/uploadCoverImage/" + user._id + "/" + user.role, formData)
          .then((resp) => {
            setAuthUser(resp.data.data)
            // image.current.value = null;
            // swal(resp.data.message, "", "success");
            console.log(resp);
            console.log(user.coverImage_url);
            window.location = "http://localhost:3001/communityProfile/" + user._id;
          })
          .catch((errors) => {
            // swal(errors.response.data.message, "", "error");
            console.log(errors);
            console.log("a7atayn");
            // console.log(errors.response.data.message);
          });
    }

    let { id } = useParams();

    const [commentOpen, setCommentOpen] = useState(false);

    const [like, setLike] = useState(0)

    const [isLiked, setIsLiked] = useState(false)

    const likeHandler = () => {
        setLike(isLiked ? like - 1 : like + 1)
        setIsLiked(!isLiked)
    }

    const [freelancer, setFreelancer] = useState({
        loading: true,
        results: null,
        err: null,
        reload: 0,
    });

    const [client, setClient] = useState({
        loading: true,
        results: null,
        err: null,
        reload: 0,
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/freelancers/getFreelancerById/" + id)
            .then((resp) => {
                setFreelancer({ results: resp.data.freelancer, loading: false, err: null });
                console.log(resp);
                console.log(resp.data.freelancer);
            })
            .catch((err) => {
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [freelancer.reload]);


    useEffect(() => {
        axios
            .get("http://localhost:3000/api/clients/getClientById/" + id)
            .then((resp) => {
                setClient({ results: resp.data.client, loading: false, err: null });
                // console.log(resp);
                // console.log(resp.data.client);
            })
            .catch((err) => {
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [client.reload]);

    const [post, setPost] = useState({
        loading: true,
        err: null,
        caption: "",
        posterType: "",
        posterId: "",
        communityId: "",
        reload: 0
    });

    const [posts, setPosts] = useState({
        loading: true,
        results: [],
        err: null,
        caption: "",
        reload: 0
    });

    const media = useRef(null);

    const uploadMedia = (id) => {

        const formData = new FormData();
        formData.append("media", media.current.files[0]);

        // for (let i = 0; i < coverImage.current.files.length; i++) {
        //   formData.append("images", coverImage.current.files[i]);
        // }

        axios
            .put("http://localhost:3000/api/posts/uploadPostMedia/" + id, formData)
            .then((resp) => {
                // image.current.value = null;
                // swal(resp.data.message, "", "success");
                // console.log(resp);
                document.querySelector("#addPostForm").reset();
                document.getElementById("selectCategory").value = "";
                setPosts({ reload: posts.reload + 1 });
            })
            .catch((errors) => {
                // swal(errors.response.data.message, "", "error");
                console.log(errors);
                // console.log(errors.response.data.message);
            });
    }

    const addPostData = async (e) => {
        e.preventDefault();

        setPost({ ...post, loading: true, err: null });
        axios
            .post("http://localhost:3000/api/posts/addPost", {
                caption: post.caption,
                posterType: user.role,
                posterId: user._id,
                communityId: post.communityId,
            })
            .then((resp) => {
                setPosts({ reload: posts.reload + 1 });
                const postId = resp.data.savePost._id
                uploadMedia(postId);
                // console.log(resp);
            })
            .catch((errors) => {
                console.log(errors);
            });
    };

    const [communities, setCommunities] = useState({
        loading: true,
        results: [],
        err: null,
        communityName: "",
        communityDesc: "",
        reload: 0
    });

    useEffect(() => {
        setCommunities({ ...communities, loading: true })
        axios.get("http://localhost:3000/api/communities/getAllCommunities")
            .then(
                resp => {
                    // console.log(resp.data.allCommunities);
                    setCommunities({ results: resp.data.allCommunities, loading: false, err: null });
                    // console.log(resp);
                }
            ).catch(err => {
                setCommunities({ ...communities, loading: false, err: err.response.data.msg });
                console.log(err);
            })
    }, [communities.reload]);

    useEffect(() => {
        setPosts({ ...posts, loading: true })
        axios.get("http://localhost:3000/api/posts/getUserPosts/" + id)
            .then(
                resp => {
                    // console.log(resp.data.posts);
                    setPosts({ results: resp.data.posts.reverse(), loading: false, err: null });
                    // console.log(resp);
                }
            ).catch(err => {
                setPosts({ ...posts, loading: false, err: err.response.data.message });
                console.log(err);
            })
    }, [posts.reload]);

    const deletePost = (e) => {
        e.preventDefault();
        const post_id = e.target.attributes.value.nodeValue;
        axios.delete("http://localhost:3000/api/posts/deletePost/" + post_id)
            .then(
                resp => {
                    // console.log(resp);
                    swal(resp.data.msg, "", "success");
                    setPosts({ reload: posts.reload + 1 });
                }
            ).catch(error => {
                console.log(error);
            })
    }



    function Panel({ data }) {
        const [isActive, setIsActive] = useState(false);
        return (
            <>
                {user && user._id == data.posterId._id &&
                    <section className="panel">
                        <img
                            onClick={() => setIsActive(!isActive)}
                            className="postTopRightImg"
                            src="/img/option.png"
                        />

                        {isActive ? (
                            <ul className="deletePostContainer">
                                <li
                                    variant="contained"
                                    className="sidebarDeleteList"
                                    value={data._id}
                                    onClick={deletePost}
                                >
                                    Delete Post
                                </li>
                            </ul>
                        ) : null}
                    </section>
                }
            </>
        );
    }

    function LikeHandler({ data }) {
        const [isLiked, setIsLiked] = useState(false);

        useEffect(() => {
            if (user) {
                const checkIfLiked = data.likes.some(id => id === user._id);
                setIsLiked(checkIfLiked);
            }
        }, [data.likes]);

        const likeHandling = (e) => {
            const postId = e.target.attributes.value.nodeValue;
            if (!user) {
                window.location = "http://localhost:3001/login"
            }
            if (isLiked == false) {
                axios
                    .put("http://localhost:3000/api/posts/addLike/" + postId + "/" + user._id + "/" + user.role)
                    .then((resp) => {
                        // console.log(resp);
                        setIsLiked(!isLiked);
                        setPosts({ reload: posts.reload + 1 });
                    })
                    .catch((errors) => {
                        console.log(errors);
                    });
            } else {
                axios
                    .put("http://localhost:3000/api/posts/removeLike/" + postId + "/" + user._id + "/" + user.role)
                    .then((resp) => {
                        // console.log(resp);
                        setIsLiked(!isLiked);
                        setPosts({ reload: posts.reload + 1 });
                    })
                    .catch((errors) => {
                        console.log(errors);
                    });
            }
        };

        return (
            <>
                <img
                    value={data._id}
                    className={isLiked ? "redHeartIcon" : "heartIcon"}
                    src={isLiked ? "/img/redHeart.png" : "/img/heart.png"}
                    onClick={likeHandling}
                />

                <span className="postLikeCounter">{data.likes.length} Likes</span>
            </>
        );
    }

    function CommentsPanel({ data }) {
        // console.log(data);
        const [isActive, setIsActive] = useState(false);
    
        const [comment, setComment] = useState({
          loading: true,
          err: null,
          commentDesc: "",
          reload: 0,
          results: data.comments
        });
    
        const addCommentData = async (e) => {
          e.preventDefault();
          const postId = e.target.attributes.value.nodeValue;
          console.log(postId);
          setComment({ ...comment, loading: true, err: null });
          axios
            .put("http://localhost:3000/api/posts/addComment/" + postId + "/" + user._id + "/" + user.role, {
              comment: comment.commentDesc,
            })
            .then((resp) => {
              setComment({ results: resp.data.allComments});
              // setComment({ ...comment, commentDesc: ""});
              for (let index = 0; index < document.querySelectorAll("#addCommentForm").length; index++) {
                document.querySelectorAll("#addCommentForm")[index].reset();
              }
              // document.querySelectorAll("#addCommentForm")[0].reset();
              // console.log(document.querySelectorAll("#addCommentForm"));
              // document.getElementsByClassName("commentListForm").reset();
              // e.target.value = ""
              // document.getElementById("addCommentForm").reset();
    
            })
            .catch((errors) => {
              console.log(errors);
            });
        };
    
        const deleteComment = (e) => {
          e.preventDefault();
          const postId = e.target.attributes.data.nodeValue;
          const commentText = e.target.attributes.value.nodeValue;
          // console.log(e);
          axios.put("http://localhost:3000/api/posts/deleteComment/" + postId + "/" + commentText )
            .then(
              resp => {
                setComment({ results: resp.data.newCommentsData });
                console.log(resp);
              }
            ).catch(error => {
              console.log(error);
            })
        }
    
        return (
          <div className="postBottom">
            <div className={isActive ? "activePostBottomLeft" : "postBottomLeft"}>
              <div>
                <LikeHandler data={data}></LikeHandler>
              </div>
              <div className={isActive ? "activeItem" : "item"} onClick={() => setIsActive(!isActive)}>
                <img className="commentsImg" src="/img/comment.png" alt="" />
                <span>{comment.results.length} Comments</span>
              </div>
            </div>
            <div className='postBottomRight'>
              {isActive ? (
                <>
                  {comment.results &&
                    <ul className="commentList">
                      {comment?.results.map((userComment) => (
                        <li>
                          <div className='userInfoCommentList'>
                            <Link className='userInfoCommentListLink' reloadDocument to={"/communityProfile/" + userComment?._id}>
                              <img
                                className="profileImgCommentList"
                                src={userComment?.image_url}
                              />
                              {/* <img className="onlineImg" src={userComment.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/> */}
                              {/* <img className="onlineImg" src={"/img/" + userComment.activityStatus + ".png"}/> */}
                              {userComment.activityStatus == "online" && <img className="onlineImg" src="/img/online.png"/>}
                              {userComment.activityStatus == "offline" && <img className="onlineImg" src="/img/offline.png"/>}
                            </Link>
                          </div>
                          <div className='nameCommentContainer'>
                            <div className='commentInfoAndDeleteComment'>
                              <Link className='userInfoCommentListLink' reloadDocument to={"/communityProfile/" + userComment?._id}>
                                <span className='commentListUsername'>{userComment?.name}</span>
                                <span className="commentSpecialization">{userComment?.specialization}</span>
                              </Link>
                            </div>
                            <p className='commentContent'>{userComment.comment}</p>
                          </div>
                          {processDate(userComment.commentDate) == "Just now" ? 
                                <div className='commentListDateJustNow'>
                                    <div className='dateContainer'><span className='commentListDate'>{processDate(userComment.commentDate)}</span></div>
                                    <div>{user && user._id == userComment._id && <img onClick={deleteComment} value={userComment.comment} data={data._id} className='deleteCommentImg' src="../img/delete.png"/>}</div>
                                </div>
                                :
                                <div className={parseInt(processDate(userComment.commentDate).substring(0, 2)) >= 10 ? "commentListDateAndDeleteTwo" : 'commentListDateAndDelete'}>
                                    <div className='dateContainer'><span className='commentListDate'>{processDate(userComment.commentDate)}</span></div>
                                    <div>{user && user._id == userComment._id && <img onClick={deleteComment} value={userComment.comment} data={data._id} className='deleteCommentImg' src="../img/delete.png"/>}</div>
                                </div>
                            }
                        </li>
                      ))}
                    </ul>
                  }
                  {user &&
                    <div className={isActive ? "activeWrite" : "write"}>
                      <form id='addCommentForm' value={data._id} onSubmit={addCommentData} className='commentListForm'>
                        <Link reloadDocument to={"/communityProfile/" + data?.posterId._id}>
                          <img
                            className="profileImgComment"
                            src={user?.image_url}
                            alt=""
                          />
                          <img className="onlineImg" src={user?.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                        </Link>
                        <input
                          type="text"
                          placeholder="Write a comment"
                          required
                          onChange={(e) =>
                            setComment({ ...comment, commentDesc: e.target.value })
                          }
                        />
                        <button type='submit' className='sendCommentButton'><img className="sendCommentImg" src="/img/sendComment.png" alt="" /></button>
    
                      </form>
                    </div>
                  }
                </>
              ) : null}
            </div>
          </div>
        );
      }
      

    const checkMedia = (data) => {
        const processedData = data.split(".");
        console.log(processedData);
        if (processedData[1] == "mp4") {
            return "video"
        }
        else {
            return "image"
        }
    }

    return (
        <div className="communityContainer">
            <div className="communityProfile">
                <SideBar />
                <div className="communityProfileRight">
                    {freelancer?.loading == false && (
                        <>
                            <div className="communityProfileRightTop">
                                <div className="profileCover">
                                {user && user._id !== id && freelancer && freelancer.results.coverImage_url !== "http://localhost:3000/undefined" &&
                                        <img
                                            className="profileCoverImg"
                                            src={freelancer.results.coverImage_url}
                                            alt=""
                                        />
                                    }

                                     {user && user._id == id && user.coverImage_url !== undefined &&
                                        <img
                                            className="profileCoverImg"
                                            src={user.coverImage_url}
                                            alt=""
                                        />
                                    }
                                    {user && user._id == id && user.coverImage_url == undefined &&
                                        <form onSubmit={uploadCoverImage}>
                                            <div className="addCoverImgInputContainer">
                                                <div>
                                                    <div className='addCoverImgInput'>
                                                        <input
                                                            className="addCoverImage"
                                                            required
                                                            type="file"
                                                            accept="video/,image/"
                                                            ref={coverImage_url}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="addCoverImgInputLabel">
                                                            Upload Cover Image
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type='submit' className='addCoverImageBtn'>Add Image</button>
                                                </div>
                                            </div>
                                        </form>
                                    }
                                    <img
                                        className="profileUserImg"
                                        src={freelancer?.results.image_url}
                                        alt=""
                                    />
                                </div>
                                <div className="profileInfo">
                                    <h4 className="profileInfoName">{freelancer?.results.name}</h4>
                                </div>
                            </div>
                            <div className="communityProfileRightBottom">
                                <div className="feed">
                                    <div className="feedContainer">
                                        {user && user._id == id ?
                                            <form
                                                className="postFormContainer"
                                                onSubmit={addPostData}
                                            >
                                                <div className="share">
                                                    <div className="shareContainer">
                                                        <div className="shareTop">
                                                            {freelancer.results && (
                                                                <Link
                                                                    reloadDocument
                                                                    to={"/communityProfile/" + freelancer?.results._id}
                                                                >
                                                                    <img
                                                                        className="shareProfileImg"
                                                                        src={freelancer?.results.image_url}
                                                                    />
                                                                    <img className="onlineImg" src={freelancer?.results.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                                                                </Link>
                                                            )}
                                                            <input
                                                                placeholder={"What's on your mind " + user?.name + " ?"}
                                                                className="shareInput"
                                                                required
                                                                onChange={(e) =>
                                                                    setPost({ ...post, caption: e.target.value })
                                                                }
                                                            />
                                                        </div>
                                                        <hr className="shareHr" />
                                                        <div className="shareBottom">
                                                            <div className="shareOptions">
                                                                <div className="shareOptionImg">
                                                                    <img
                                                                        className="shareIcon"
                                                                        src="/img/photo.png"
                                                                        alt=""
                                                                    />
                                                                    <div className="fileInputContainer">
                                                                        <input
                                                                            className="addPostImg"
                                                                            required
                                                                            type="file"
                                                                            accept="video/,image/"
                                                                            ref={media}
                                                                        />
                                                                        <span className="fileInputLabel">
                                                                            Upload Media
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="shareOption">
                                                                    <img
                                                                        className="shareIcon"
                                                                        src="/img/groups.png"
                                                                        onClick={() =>
                                                                            setCommentOpen(!commentOpen)
                                                                        }
                                                                    />

                                                                    <select
                                                                        name="serviceCategoryId"
                                                                        required
                                                                        onChange={(e) =>
                                                                            setPost({
                                                                                ...post,
                                                                                communityId: e.target.value,
                                                                            })
                                                                        }
                                                                        id="selectCategory"
                                                                    >
                                                                        <option value={""} disabled selected>
                                                                            Select Community
                                                                        </option>
                                                                        {communities.loading == false &&
                                                                            communities.err == null &&
                                                                            communities.results &&
                                                                            communities.results.length > 0 &&
                                                                            communities.results.map((community) => (
                                                                                <>
                                                                                    <option value={community._id}>
                                                                                        {community.communityName}
                                                                                    </option>
                                                                                </>
                                                                            ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <button type="submit" className="shareButton">
                                                                Post
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            : null
                                        }
                                        {posts.loading == false &&
                                            posts.results &&
                                            posts.results.map((post, index) => (
                                                <>
                                                    <div key={index} className='post'>
                                                        <div className="postContainer">
                                                            <div className="postTop">
                                                                <div className="postTopLeft">
                                                                    <Link reloadDocument to={"/communityProfile/" + post?.posterId._id}>
                                                                        <img className='postProfileImg' src={post?.posterId.image_url} />
                                                                        <img className="onlineImg" src={post?.posterId.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                                                                        </Link>
                                                                    <Link className='link' reloadDocument to={"/communityProfile/" + post?.posterId._id}><span className="postUsername">{post?.posterId.name}</span></Link>
                                                                    <span className="postSpecialization">{post?.posterId.specialization}</span>
                                                                    <span className="postDate">{processDate(post?.creationDate)}</span>
                                                                </div>
                                                                <div className="postTopRight">
                                                                    <Panel data={post} title={index}></Panel>
                                                                </div>
                                                            </div>
                                                            <div className="postCenter">
                                                                <span className="postText">{post?.caption}</span>
                                                                {checkMedia(post?.media_url) == "image" ?
                                                                    <img className='postImg' src={post?.media_url} />
                                                                    :
                                                                    <video className='postImg' src={post.media_url} controls></video>
                                                                }
                                                            </div>
                                                            <CommentsPanel data={post} title={index}></CommentsPanel>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                    </div>
                                    {posts.err !== null &&
                                        <div className='communityProfileAlert'>
                                            <Alert severity="info">{posts.err}</Alert>
                                        </div>
                                    }
                                </div>

                                <RightBar profile item={freelancer.results} />
                            </div>
                        </>
                    )}

                    {client?.loading == false && (
                        <>
                            <div className="communityProfileRightTop">
                            <div className="profileCover">
                                    {user && user._id !== id && client && client.results.coverImage_url !== "http://localhost:3000/undefined" &&
                                        <img
                                            className="profileCoverImg"
                                            src={client.results.coverImage_url}
                                            alt=""
                                        />
                                    }

                                     {user && user._id == id && user.coverImage_url !== undefined &&
                                        <img
                                            className="profileCoverImg"
                                            src={user.coverImage_url}
                                            alt=""
                                        />
                                    }

                                    {user && user._id == id && user.coverImage_url == undefined &&
                                        <form onSubmit={uploadCoverImage}>
                                            <div className="addCoverImgInputContainer">
                                                <div>
                                                    <div className='addCoverImgInput'>
                                                        <input
                                                            className="addCoverImage"
                                                            required
                                                            type="file"
                                                            accept="video/,image/"
                                                            ref={coverImage_url}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="addCoverImgInputLabel">
                                                            Upload Cover Image
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type='submit' className='addCoverImageBtn'>Add Image</button>
                                                </div>
                                            </div>
                                        </form>
                                    }
                                    <img
                                        className="profileUserImg"
                                        src={client?.results.image_url}
                                        alt=""
                                    />
                                </div>
                                <div className="profileInfo">
                                    <h4 className="profileInfoName">{client?.results.name}</h4>
                                </div>
                            </div>
                            <div className="communityProfileRightBottom">


                                <div className="feed">
                                    <div className="feedContainer">
                                        {user && user._id == id ?
                                            <form
                                                className="postFormContainer"
                                                onSubmit={addPostData}
                                            >
                                                <div className="share">
                                                    <div className="shareContainer">
                                                        <div className="shareTop">
                                                            {client.results && (
                                                                <Link
                                                                    reloadDocument
                                                                    to={"/communityProfile/" + client?.results._id}
                                                                >
                                                                    <img
                                                                        className="shareProfileImg"
                                                                        src={client?.results.image_url}
                                                                    />
                                                                    <img className="onlineImg" src={client?.results.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                                                                </Link>
                                                            )}
                                                            <input
                                                                placeholder="What's on your mind?"
                                                                className="shareInput"
                                                                required
                                                                onChange={(e) =>
                                                                    setPost({ ...post, caption: e.target.value })
                                                                }
                                                            />
                                                        </div>
                                                        <hr className="shareHr" />
                                                        <div className="shareBottom">
                                                            <div className="shareOptions">
                                                                <div className="shareOptionImg">
                                                                    <img
                                                                        className="shareIcon"
                                                                        src="/img/photo.png"
                                                                        alt=""
                                                                    />
                                                                    {/* <input id="fileInput" className='addPostImg' required type="file" ref={media} /> */}
                                                                    <div className="fileInputContainer">
                                                                        <input
                                                                            className="addPostImg"
                                                                            required
                                                                            type="file"
                                                                            accept="video/,image/"
                                                                            ref={media}
                                                                        />
                                                                        <span className="fileInputLabel">
                                                                            Upload Media
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="shareOption">
                                                                    <img
                                                                        className="shareIcon"
                                                                        src="/img/groups.png"
                                                                    />

                                                                    <select
                                                                        name="serviceCategoryId"
                                                                        required
                                                                        onChange={(e) =>
                                                                            setPost({
                                                                                ...post,
                                                                                communityId: e.target.value,
                                                                            })
                                                                        }
                                                                        id="selectCategory"
                                                                    >
                                                                        <option value={""} disabled selected>
                                                                            Select Community
                                                                        </option>
                                                                        {communities.loading == false &&
                                                                            communities.err == null &&
                                                                            communities.results &&
                                                                            communities.results.length > 0 &&
                                                                            communities.results.map((community) => (
                                                                                <>
                                                                                    <option value={community._id}>
                                                                                        {community.communityName}
                                                                                    </option>
                                                                                </>
                                                                            ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <button type="submit" className="shareButton">
                                                                Post
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            : null
                                        }

                                        {posts.loading == false &&
                                            posts.results &&
                                            posts.results.map((post, index) => (
                                                <>
                                                    <div key={index} className='post'>
                                                        <div className="postContainer">
                                                            <div className="postTop">
                                                                <div className="postTopLeft">
                                                                    <Link reloadDocument to={"/communityProfile/" + post?.posterId._id}>
                                                                        <img className='postProfileImg' src={post?.posterId.image_url} />
                                                                        <img className="onlineImg" src={post?.posterId.activityStatus == "online" ? "/img/online.png" : "/img/offline.png"}/>
                                                                        </Link>
                                                                    <Link className='link' reloadDocument to={"/communityProfile/" + post?.posterId._id}><span className="postUsername">{post?.posterId.name}</span></Link>
                                                                    <span className="postDate">{processDate(post?.creationDate)} ago</span>
                                                                </div>
                                                                <div className="postTopRight">
                                                                    <Panel data={post} title={index}></Panel>
                                                                </div>
                                                            </div>
                                                            <div className="postCenter">
                                                                <span className="postText">{post?.caption}</span>
                                                                {checkMedia(post?.media_url) == "image" ?
                                                                    <img className='postImg' src={post?.media_url} />
                                                                    :
                                                                    <video className='postImg' src={post.media_url} controls></video>
                                                                }
                                                            </div>
                                                            <CommentsPanel data={post} title={index}></CommentsPanel>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                    </div>
                                    {posts.err !== null &&
                                        <div className='communityProfileAlert'>
                                            <Alert severity="info">{posts.err}</Alert>
                                        </div>
                                    }
                                </div>

                                <RightBar profile item={client.results} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommunityProfile