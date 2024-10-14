import React, { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from "axios";

import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



const FreelancerChart = (data) => {

    console.log(data);

  const serviceLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Freelancer Services',
        font: {
          size: 28
        },
      },
    },
  };

  
  const servicesCount = [];
  const labels = [];


  for (let index = 0; index < data.data.length; index++) {
    labels.push(data.data[index].name);
    servicesCount.push(data.data[index].servicesCount);
  }

  const serviceLineChartData = {
    labels,
    datasets: [
      {
        label: 'Services',
        data: servicesCount,
        borderColor: 'rgb(16, 172, 215)',
        backgroundColor: 'rgb(77, 216, 255)',
      },
    ],
  };



  return (
    <>
        <Line options={serviceLineOptions} data={serviceLineChartData}></Line>
    </>

  );
};

export default FreelancerChart;