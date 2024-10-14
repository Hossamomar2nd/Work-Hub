import React from "react" ;
import FormContact from './FormContact';
import './ContactUs.scss';

const ContactUs = () => {
  return(
      <section className='contactus-page'>
        <div className='banner'>
          <div className='ContactUsContainer'>
            <div className='row'>
              <div className='col-lg-6 col-md-6'>
                <h1>Contact Us</h1>
              </div>
            </div>
          </div>
        </div>
    
        <div className='contact-us'>
          <div className='container1'>
                <FormContact/>
                <div className='side'>
                  <div className='overlay'>
                    <h2>Contact Us For Any Informations</h2>
                    <li className='locationIcon'><img src='img/location.png' /> Location</li>
                    <hr/>
                    <h3>2005 Stokes Isle Apt. 896, Venaville 10010, USA</h3>
                    <li className='emailIcon'><img src='img/email.png'/> Email & Phone</li>
                    <hr/>
                    <h3>info@yourdomain.com </h3> 
                    <h3>(+68) 120034509</h3>
                    <li className='worldIcon'><img src='img/world1.png' /> Follow Us</li>
                    <hr/>
                  <ul> 
                    <li className='facebookIcon'><a href="https://www.facebook.com/" target='_blank'><img src='img/contFacebook.png' /></a></li>
                    <li className='linkedinIcon'><a href="https://www.linkedin.com/" target='_blank'><img src='img/contLinkedin.png'/></a></li>
                    <li className='twitterIcon'><a href="https://www.twitter.com/" target='_blank'><img src ='img/contTwitter.png'/></a></li>
                  </ul>
                  </div>
              </div>
          </div>
        </div>
        <img className='plus' src='img/plus.jpeg'/>
        <img className='wave1' src='img/wave.jpeg'/>
        <img className='wave2' src='img/wave.jpeg'/>
        <img className='circle' src='img/circle.jpeg'/>
      </section> 
      
  )

}


export default ContactUs;
