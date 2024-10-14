import React, { useState } from "react";
import './ContactUs.scss';


const FormContact = () => { 

    const[name , setname] =useState("");


    const FormHandler = (event) => {
        event.preventDefault();
        if (name.length ==""){
            alert('Not Empty')
            return;
    }
}

    return (
        <form className="contact-form" onSubmit={FormHandler} >
            <div className='form-control'>
                <input placeholder='Your Name'  />
            </div>
            <div className='form-control'>
                <input placeholder='Email' />
            </div>
            <div className='form-control'>
                <input placeholder='Phone Numbers' />
            </div>
            <div className='form-control'>
                <textarea placeholder='Type Message'></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    )

}



export default FormContact;