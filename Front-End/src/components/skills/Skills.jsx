// import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import "./Skills.scss";
import React, { useEffect, useState } from "react";
import $ from "jquery";


export default function Skills() {

  var [selectedOptions, setSelectedOptions] = useState();
  const [inputValue, setInputValue] = useState('');

  const handleOptionChange = (event, newValue) => {
    setSelectedOptions(newValue);
    selectedOptions = newValue;
    console.log(newValue);
    console.log(selectedOptions);
  };

  const submit = () => {
    $(".MuiIconButton-sizeMedium").click();
  }

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        className='skillsInput'
        multiple
        id="tags-outlined"
        options={top100Skills}
        getOptionLabel={(option) => option}
        value={selectedOptions}
        onChange={handleOptionChange}
        // onInputChange={handleInputChange}
        // onClose={handleCloseAutocomplete}
        // filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            placeholder="Add Skill"
          />
        )}
      />
    </Stack>
  );
}
const top100Skills = [
  "JavaScript",
  "HTML",
  "CSS",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "C#",
  "C++",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Flutter",
  "Docker",
  "AWS",
  "Azure",
  "Google Cloud Platform",
  "Git",
  "Jenkins",
  "Kubernetes",
  "HTML5",
  "CSS3",
  "Sass",
  "Less",
  "Bootstrap",
  "Tailwind CSS",
  "Redux",
  "GraphQL",
  "RESTful API",
  "GraphQL API",
  "TypeScript",
  "Next.js",
  "Gatsby",
  "Spring Framework",
  "Hibernate",
  "ASP.NET",
  "Entity Framework",
  "Ruby on Rails",
  "Django",
  "Flask",
  "TensorFlow",
  "PyTorch",
  "Numpy",
  "Pandas",
  "Matplotlib",
  "Scikit-learn",
  "JUnit",
  "Mockito",
  "Cypress",
  "Jest",
  "Mocha",
  "Enzyme",
  "Chai",
  "Selenium",
  "JIRA",
  "Confluence",
  "Trello",
  "Slack",
  'Logo Design',
  'Illustration',
  'Branding',
  'Packaging Design',
  'Photoshop Editing',
  'Business Cards & Stationery',
  'Poster Design',
  'Flyer Design',
  'Brochure Design',
  'Label & Package Design',
  'Video Editing',
  'Animation',
  'Motion Graphics',
  'Explainer Videos',
  'Whiteboard Animation',
  'Intro & Outro Videos',
  'Short Video Ads',
  'Lyric & Music Videos',
  'Subtitles & Captions',
  'Visual Effects',
  'Copywriting',
  'Content Writing',
  'Blog Writing',
  'Article Writing',
  'Editing & Proofreading',
  'Translation',
  'Creative Writing',
  'Technical Writing',
  'Resume Writing',
  'Scriptwriting',
  'Machine Learning',
  'Natural Language Processing (NLP)',
  'Chatbot Development',
  'AI Model Deployment',
  'Image Recognition',
  'Speech Recognition',
  'Sentiment Analysis',
  'Predictive Analytics',
  'Recommendation Systems',
  'AI Consulting',
  'Social Media Marketing',
  'Search Engine Optimization (SEO)',
  'Pay-Per-Click Advertising (PPC)',
  'Content Marketing',
  'Email Marketing',
  'Influencer Marketing',
  'Affiliate Marketing',
  'Marketing Strategy',
  'Web Analytics',
  'Conversion Rate Optimization (CRO)',
  'Music Production',
  'Audio Editing',
  'Mixing & Mastering',
  'Sound Design',
  'Voice Over',
  'Jingles & Intros',
  'Foley Artist',
  'Podcast Editing',
  'Audio Restoration',
  'Music Transcription',
  'Web Development',
  'Mobile App Development',
  'Software Development',
  'Database Development',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain Development',
  'Game Development',
  'UI/UX Design',
  'Business Strategy',
  'Business Development',
  'Market Research',
  'Financial Consulting',
  'Project Management',
  'Accounting',
  'Legal Consulting',
  'Business Plan Writing',
  'Virtual Assistance',
  'HR Consulting',
];
