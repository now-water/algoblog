import styled from '@emotion/styled';

export const StyledSearchWrapper = styled('div')`
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

$cub: cubic-bezier(0.73, 0.14, 0.4, 1.58);
$step1: 0.2s;
$step2: 0.4s;
$delayClose1: 0.2s;
$delayClose2: 0.4s;
$totalAnim: $step1 + $step2;
$w: 18rem;
$h: 1.8rem;
$borderW: 0.4rem;

.search {
  position: absolute;
  top: 45%;
  left: 50%;
  margin-left: $w/-2;
  margin-top: $h/-2;
  width: $w;
  height: $h;

  &__border {
    position: absolute;
    top: 50%;
    left: 50%;
    width: $h;
    height: 100%;
    border: $borderW solid #fff;
    border-radius: 10rem;
    transform: translate(-50%, -50%);
    transition: width $step2 $delayClose2;
    opacity: 0.7;

    #trigger:checked ~ & {
      transition: width $step2 $step1;
      width: 100%;

      &:after {
        width: 0;
        transition: width $step1 cubic-bezier(0.42, -0.7, 0.62, 1.25);
      }
    }

    &:after {
      content: '';
      position: absolute;
      bottom: -2.3rem;
      right: -2.2rem;
      width: $h/1.3;
      height: $borderW;
      background: #fff;
      border-radius: $h/10;
      transform-origin: 100% 50%;
      transform: rotate(225deg) translateX(3rem);
      transition: width $step1 $delayClose2 + $step2;
    }
  }

  &__input {
    position: relative;
    width: $w - $h;
    height: $h;
    padding: $h * 0.15 0 $h * 0.15 $h * 0.4;
    background: transparent;
    outline: none;
    border: none;
    font-size: $h * 0.4;
    color: #fff;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s;

    #trigger:checked ~ & {
      opacity: 1;
      z-index: auto;
      transition: opacity 0.2s $totalAnim;
    }
  }

  &__checkbox {
    position: absolute;
    top: -9999px;
    left: -9999px;
    opacity: 0;
    z-index: -10;
  }
  &__label-init {
    z-index: 2;
    position: absolute;
    top: 0;
    left: $w * 0.41;
    width: $w * 0.2125;
    height: $w * 0.2;
    cursor: pointer;

    #trigger:checked ~ & {
      transform: scale(0);
    }
  }
  &__label-active {
    z-index: 3;
    position: absolute;
    top: $h/4;
    right: $h/4;
    width: $h/2;
    height: $h/2;
    cursor: pointer;
    transform: scale(0);

    #trigger:checked ~ & {
      tranition: transform 0 $totalAnim;
      transform: scale(1);
    }
  }

  &__close {
    position: absolute;
    top: $h/4;
    right: $h/4;
    width: $h/2;
    height: $h/2;
    cursor: pointer;
    z-index: -1;

    #trigger:checked ~ & {
      z-index: auto;

      &:before {
        transform: rotate(-45deg);
        opacity: 1;
        transition: transform 0.2s $totalAnim $cub, opacity 0.1s $totalAnim;
      }
      &:after {
        transform: rotate(45deg);
        opacity: 1;
        transition: transform 0.2s ($totalAnim + $delayClose1) $cub,
          opacity 0.1s ($totalAnim + $delayClose1);
      }
    }

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: $h/5;
      left: 0;
      width: 100%;
      height: $h/10;
      background: #fff;
      border-radius: 0.5rem;
      opacity: 0;
    }
    &:before {
      transform: rotate(-45deg) translateX(2rem);
      transition: transform 0.2s, opacity 0.1s 0.1s;
    }
    &:after {
      transform: rotate(45deg) translateX(2rem);
      transition: transform 0.2s 0.2s, opacity 0.1s 0.3s;
    }
  }
}

.search_result {
  position: absolute;
  z-index: 20;
}

.search-article {
  background-color: white;
  border-bottom: 2px solid black;

  z-index: 20;
  width: $w;

  h2 {
    font-size: 1rem;
  }

  p.search-description {
    color: black;
  }

  p.search-date {
    color: rgba(52, 223, 171, 0.753);
  }
}
`;
