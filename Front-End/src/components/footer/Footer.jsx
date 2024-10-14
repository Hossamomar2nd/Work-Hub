import React, { useEffect, useState } from "react";
import "./Footer.scss";
import { Link } from 'react-router-dom'
import axios from "axios";
import { getAuthUser } from "../../localStorage/storage";

function Footer() {

  const user = getAuthUser();

  const [categories, setCategories] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setCategories({ ...categories, loading: true })
    axios.get("http://localhost:3000/api/categories/getAllCategories")
      .then(
        resp => {
          // console.log(resp.data);
          setCategories({ results: resp.data, loading: false, err: null });
          // console.log(resp);
        }
      ).catch(err => {
        setCategories({ ...categories, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [categories.reload]);




  return (
    <>
      {user && user.role !== "admin" &&
        <div className="footer">
          <div className="footerContainer">
            <div className="top">
              <div className="item">
                <h2>Categories</h2>
                {categories.loading == false && categories.err == null && (
                  categories.results.map((category => (
                    <>
                      <Link reloadDocument className='footerCategories' to="/gigs/:category">
                        <div className='category'>{category.categoryName}</div>
                      </Link>
                    </>

                  )))
                )
                }
              </div>
              <div className="item">
                <h2>About</h2>
                <Link reloadDocument className='link' to="/privacyPolicy"><span>Privacy Policy</span></Link>
                <Link reloadDocument className='link' to="/contactUs"><span>Contact Us</span></Link>
              </div>
              <div className="item">
                <h2>Support</h2>
                <span>Selling on WorkHub</span>
                <span>Buying on WorkHub</span>
              </div>
              <div className="item">
                <h2>Community</h2>
                <Link reloadDocument className='link' to="/community"><span>Community hub</span></Link>
              </div>
              <div className="item">
                <h2>Learn</h2>
                <Link reloadDocument className='link' to="/learn"><span>Learn</span></Link>
              </div>
            </div>
            <hr />
            <div className="bottom">
              <div className="left">
                <h2>WorkHub</h2>
                <span>© WorkHub International Ltd. 2024</span>
              </div>
              <div className="right">
                <div className="social">
                  <Link reloadDocument><img src="/img/tiktok.png" alt="" /> </Link>
                  <Link reloadDocument><img src="/img/instagram.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/linkedin.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/facebook.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/pinterest.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/twitter.png" alt="" /></Link>
                </div>
                <div className="link">
                  <img src="/img/language.png" alt="" />
                  <span>English</span>
                </div>
                <div className="link">
                  <img src="/img/coin.png" alt="" />
                  <span>USD</span>
                </div>
                <img src="/img/accessibility.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      }

      {!user &&
        <div className="footer">
          <div className="footerContainer">
            <div className="top">
              <div className="item">
                <h2>Categories</h2>
                {categories.loading == false && categories.err == null && (
                  categories.results.map((category => (
                    <>
                      <Link reloadDocument className='footerCategories' to="/gigs/:category">
                        <div className='category'>{category.categoryName}</div>
                      </Link>
                    </>

                  )))
                )
                }
                {/* <span>Graphics & Design</span>
            <span>Digital Marketing</span>
            <span>Writing & Translation</span>
            <span>Video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
            <span>Photography</span>
            <span>Sitemap</span> */}
              </div>
              <div className="item">
                <h2>About</h2>
                <Link reloadDocument className='link' to="/privacyPolicy"><span>Privacy Policy</span></Link>
                <Link reloadDocument className='link' to="/contactUs"><span>Contact Us</span></Link>
              </div>
              <div className="item">
                <h2>Support</h2>
                <span>Selling on WorkHub</span>
                <span>Buying on WorkHub</span>
              </div>
              <div className="item">
                <h2>Community</h2>
                <Link reloadDocument className='link' to="/community"><span>Community hub</span></Link>
              </div>
              <div className="item">
                <h2>Learn</h2>
                <Link reloadDocument className='link' to="/learn"><span>Learn</span></Link>
              </div>
            </div>
            <hr />
            <div className="bottom">
              <div className="left">
                <h2>WorkHub</h2>
                <span>© WorkHub International Ltd. 2024</span>
              </div>
              <div className="right">
                <div className="social">
                  <Link reloadDocument><img src="/img/tiktok.png" alt="" /> </Link>
                  <Link reloadDocument><img src="/img/instagram.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/linkedin.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/facebook.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/pinterest.png" alt="" /></Link>
                  <Link reloadDocument><img src="/img/twitter.png" alt="" /></Link>
                </div>
                <div className="link">
                  <img src="/img/language.png" alt="" />
                  <span>English</span>
                </div>
                <div className="link">
                  <img src="/img/coin.png" alt="" />
                  <span>USD</span>
                </div>
                <img src="/img/accessibility.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
export default Footer;
