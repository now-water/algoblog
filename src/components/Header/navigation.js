import React from 'react';
import styled from '@emotion/styled';
import { onMobile } from '../../styles/responsive';

const Navigation = styled(({ className, links }) => {
  return (
    <nav css={{display: 'flex'}}>
      <ul className={className}>
        {links
          ? links.map((link, key) => {
              const openRule = link.external ? '_blank' : '_self';
              if (link.link !== '' && link.text !== '') {
                return (
                  <li key={key}>
                    <a
                      href={link.link}
                      target={openRule}
                      rel="noopener"
                      //dangerouslySetInnerHTML={{ __html: link.text }}
                    >
                      <img style={{width: 13 + 'em', height: 30}} alt="asd" src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fnowwatersblog.com&count_bg=%239EA0A0&title_bg=%237EA1FF&icon=gradle.svg&icon_color=%23E1DEDE&title=Today/Total&edge_flat=false"/>
                    </a>
                  </li>
                );
              }
            })
          : null}
      </ul>
    </nav>
  );
})`
  display: flex;
  align-items: center;
  -webkit-overflow-scrolling: touch;
  float: left;
  ${onMobile} {
    width: 100%;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: 10px;
    li {
      height: 37px;

      a {
        font-size: 14px;
        padding: 10px 15px;
      }
    }
  }
  li {
    list-style-type: none;
    display: flex;
    & > a:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      bottom: 0;
      left: 0;
      background: ${(props) => props.theme.header.font.hover};
      visibility: hidden;
      border-radius: 4px;
      transform: scaleX(0);
      transition: 0.25s linear;
    }
    & > a:focus:before,
    & > a:hover:before {
      visibility: visible;
      transform: scaleX(1);
    }
    a {
      font-family: 'Roboto';
      position: relative;
      color: ${(props) => props.theme.header.font.base};
      font-size: 16px;
      font-weight: 500;
      line-height: 1em;
      opacity: 1;
      padding: 10px 15px;
      &:hover {
        color: ${(props) => props.theme.header.font.hover};
      }
    }
  }
`;

export default Navigation;
