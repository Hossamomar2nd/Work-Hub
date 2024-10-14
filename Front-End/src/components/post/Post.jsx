import React, { useEffect, useState } from 'react'
import "./Post.scss"
import axios from 'axios'
import { Link } from 'react-router-dom'

const Post = () => {
  const [like, setLike] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false);


  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const [posts, setPosts] = useState({
    loading: true,
    results: [],
    err: null,
    caption: "",
    reload: 0
  });

  useEffect(() => {
    setPosts({ ...posts, loading: true })
    axios.get("http://localhost:3000/api/posts/getAllPosts")
      .then(
        resp => {
          console.log(resp.data.posts);
          setPosts({ results: resp.data.posts, loading: false, err: null });
          // console.log(resp);
        }
      ).catch(err => {
        setPosts({ ...posts, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [posts.reload]);

  return (
    <div className='post'>
      <div className="postContainer">
        {posts.loading == false &&
          posts.results.map((post) => (
            <>
              <div className="postTop">
                <div className="postTopLeft">
                  <img className='postProfileImg' src={post?.posterId.image_url}/>
                  <span className="postUsername">{post?.posterId.name}</span>
                  <span className="postDate">5 mins ago</span>
                </div>
                <div className="postTopRight">
                  <img className='postTopRightImg' src="/img/option.png" />
                </div>
              </div>
              <div className="postCenter">
                <span className="postText">{post?.caption}</span>
                <img className='postImg' src={post?.media_url} alt="" />
              </div>
              <div className="postBottom">
                <div className="postBottomLeft">
                  <img className='likeIcon' src="/img/likeReaction.png" onClick={likeHandler} />
                  <span className="postLikeCounter">{like} people like it</span>
                </div>
                <div className="postBottomRight">
                  <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                    {/* <TextsmsOutlinedIcon /> */}
                    <Link><img className='commentsImg' src="/img/comment.png" alt="" /></Link>  
                    <span>Comments</span>
                  </div>
                </div>
              </div>
              {commentOpen &&
                <div className="write">
                  <img className='profileImgComment' src="./img/profile.jpg" alt="" />
                  <input
                    type="text"
                    placeholder="Write a comment"
                  // value={desc}
                  // onChange={(e) => setDesc(e.target.value)}
                  />
                  <img className='sendCommentImg' src="/img/sendComment.png" alt="" />
                  {/* <button>Send</button> */}
                  {/* onClick={handleClick} */}
                </div>
              }
            </>
          ))}
      </div>
    </div>
  )
}

export default Post