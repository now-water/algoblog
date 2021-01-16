import React from 'react';
const githubIcon = require('./components/images/github.svg');

const GithubLink = ({ link, text }) => {
  return (
    <a href={"https://github.com/nowwater/algoblog/"} className="githubSection">
      <img className="githubIcon" src={githubIcon} alt="github" />
      {text}
    </a>
  );
};

export default GithubLink;
