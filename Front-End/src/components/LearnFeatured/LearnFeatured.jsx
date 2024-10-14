import React from 'react'
import "./LearnFeatured.scss"


const LearnFeatured = () => {
    return (
        <div className='learnFeatured'>
            <div className='topLearn'>
                <img src="../img/learnFeatured.jpg" />
            </div>
            <div className='firstText'>
                <h1>
                    In-Demand Skills,
                    <br />
                    On-Demand Courses
                    <span>.</span>
                </h1>
                <h2>Online professional courses, led by the world’s top experts.</h2>
            </div>
            <div className="learnSearchContainer">
                <div className="searchLearn">
                    <div className="searchInputLearn">
                        <img src="../img/search.png" alt="" />
                        <input type="text" placeholder='Search for any service...' />
                    </div>
                    <button>Search</button>
                </div>
                <div className="popularLearn">
                    <span>Popular:</span>
                    <button>Web Design</button>
                    <button>Wordpress</button>
                    <button>Logo Design</button>
                    <button>AI Services</button>
                </div>
            </div>
        </div>
    )
}

export default LearnFeatured