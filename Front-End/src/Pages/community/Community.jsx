import React from 'react'
import "./Community.scss"
import SideBar from '../../components/sidebar/SideBar'
import Feed from '../../components/feed/Feed'
import RightBar from '../../components/rightbar/RightBar'
import { getAuthUser } from '../../localStorage/storage'

const Community = () => {
    const user = getAuthUser()

    return (
        <div className='communityPage'>
            <h1 className="userCommunityHeader">Community</h1>
            <div className="communityContainer">
                <SideBar />
                <Feed data={user}/>
                <RightBar />
            </div>
        </div>
    )
}

export default Community