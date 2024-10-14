import axios from 'axios';
import React, { useEffect, useState } from 'react';

let cardsData = [];

export function getCardsData() {
  return cardsData;
}

export default function Data() {

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
          console.log(resp.data);
          setCategories({ results: resp.data, loading: false, err: null });
          console.log(resp);
        }
      ).catch(err => {
        setCategories({ ...categories, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [categories.reload]);

  if (categories.results[0]) {

    const cards1 = [
      {
        id: categories.results[0]._id,
        title: categories.results[0].categoryName,
        desc: categories.results[0].categoryDesc,
        img: "https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      },
      {
        id: categories.results[1]._id,
        title: categories.results[1].categoryName,
        desc: categories.results[1].categoryDesc,
        img: "https://images.pexels.com/photos/11295165/pexels-photo-11295165.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      },
      {
        id: categories.results[2]._id,
        title: categories.results[2].categoryName,
        desc: categories.results[2].categoryDesc,
        img: "https://images.pexels.com/photos/4371669/pexels-photo-4371669.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      },
      {
        id: categories.results[3]._id,
        title: categories.results[3].categoryName,
        desc: categories.results[3].categoryDesc,
        img: "https://images.pexels.com/photos/7608079/pexels-photo-7608079.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      },
    ];

    cardsData = cards1;

    console.log(cardsData);
    
    return cardsData; // Since this component doesn't render anything
  }


  // return (
  //   <div>data</div>
  // )
  
}


// export const cards2 = [
//   {
//     id: 5,
//     title: "Video Explainer",
//     desc: "Engage your audience",
//     img: "https://images.pexels.com/photos/13388047/pexels-photo-13388047.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//   },
//   {
//     id: 6,
//     title: "Social Media",
//     desc: "Reach more customers",
//     img: "https://images.pexels.com/photos/11378899/pexels-photo-11378899.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//   },
//   {
//     id: 7,
//     title: "SEO",
//     desc: "Unlock growth online",
//     img: "https://images.pexels.com/photos/4820241/pexels-photo-4820241.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//   },
//   {
//     id: 8,
//     title: "Illustration",
//     desc: "Color you dreams",
//     img: "https://images.pexels.com/photos/15032623/pexels-photo-15032623.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//   },
// ];

// export const projects1 = [
//   {
//     id: 1,
//     img: "https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Web and Mobile Design",
//     username: "Anna Bell",
//   },
//   {
//     id: 2,
//     img: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Logo Design",
//     username: "Morton Green",
//   },
//   {
//     id: 3,
//     img: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Animated GIFs",
//     username: "Emmett Potter",
//   },
//   {
//     id: 4,
//     img: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Packaging Design",
//     username: "Freddie Johnston",
//   },
// ];
//   export const projects2 = [

//   {
//     id: 5,
//     img: "https://images.pexels.com/photos/4458554/pexels-photo-4458554.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Social Media Design",
//     username: "Audrey Richards",
//   },
//   {
//     id: 6,
//     img: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Illustration",
//     username: "Dalton Hudson",
//   },
//   {
//     id: 7,
//     img: "https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Book Design",
//     username: "Hannah Dougherty",
//   },
//   {
//     id: 8,
//     img: "https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     cat: "Digital Marketing",
//     username: "Ward Brewer",
//   },
// ];

// export const gigs = [
//   {
//     id: 1,
//     img: "https://images.pexels.com/photos/580151/pexels-photo-580151.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/720598/pexels-photo-720598.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will create ai art character from your images and prompts",
//     price: 59,
//     star: 5,
//     username: "Anna Bell",
//   },
//   {
//     id: 2,
//     img: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will create ultra high quality character art with ai",
//     price: 79,
//     star: 5,
//     username: "Lannie Coleman",
//   },
//   {
//     id: 3,
//     img: "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1062280/pexels-photo-1062280.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will creating unique ai generated artworks mid journey ai artist",
//     price: 112,
//     star: 5,
//     username: "Carol Steve",
//   },
//   {
//     id: 4,
//     img: "https://images.pexels.com/photos/5708069/pexels-photo-5708069.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will create custom ai generated artwork using your photos",
//     price: 99,
//     star: 4,
//     username: "Don Weber",
//   },
//   {
//     id: 5,
//     img: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1771383/pexels-photo-1771383.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will recreate your dreams in high quality pictures",
//     price: 59,
//     star: 5,
//     username: "Audrey Richards",
//   },
//   {
//     id: 6,
//     img: "https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/715546/pexels-photo-715546.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will create ai digital art illustration hyper realistic painting",
//     price: 79,
//     star: 4,
//     username: "Walton Shepard ",
//   },
//   {
//     id: 7,
//     img: "https://images.pexels.com/photos/6039245/pexels-photo-6039245.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/720606/pexels-photo-720606.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will generate images with your prompts using ai dalle",
//     price: 89,
//     star: 5,
//     username: "Waverly Schaefer",
//   },
//   {
//     id: 8,
//     img: "https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     pp: "https://images.pexels.com/photos/1699159/pexels-photo-1699159.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     desc: "I will create custom art using midjourney generator",
//     price: 110,
//     star: 4,
//     username: "Wilton Hunt",
//   },
// ];
