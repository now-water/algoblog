---
title: 'CI/CD 무중단 배포'
metaTitle: '만렙 개발자 키우기'
order: 5
tags: ['Backend']
date: '2021-07-04'
---

## 구현 동기

`2021-1 학기 고급 웹프로그래밍` 수업을 들으면서 실시간 온라인 경매 사이트를 구축하였다.

이때 AMAZON EC2 환경에서 스프링 부트와 리액트, 깃허브를 사용하여 웹 애플리케이션을 제작하였다.

하지만 이때, 깃허브에 코드를 수정하여 푸시할 때마다 일일이 다시 서버에 접속해서 실행 중이던 인스턴스를 종료하고, 깃허브 pull 을 한 후, 다시 인스턴스를 실행시켜줬다.

이 과정에서 서버를 조금 손 볼때 마다 프론트엔드 개발을 진행하던 친구에게 `"나 서버 잠깐 내릴게?"` 라고 미리 얘기를 하고 서버를 중단시켰어야 했다. 그리고 프론트엔드 테스트를 하려면 서버 업데이트가 끝날 때까지 기다렸어야 했다.. 또, 매번 서버를 재시동하는 것도 여간 번거로운 일이 아니었다.

CI/CD 라는 기술이 있다는 것은 알고 있었지만, 당장 프로젝트 구현이 급해서 적용할 엄두가 나지 않아 시도하지도 못했었다.

현재 종강을 하고 시간적으로 조금 여유가 생겨서 DevOps 관련해서 한 번 정리할 필요성을 느꼈다. 그리고 방학동안 진행할 프로젝트인 `컴퓨터학부 강의실 자리 예약 어플리케이션`을 시작하기에 앞서 이전 프로젝트에서의 불편했던 경험을 다시 겪고 싶지 않은 마음이 컸다. 따라서 이번에 한 번 확실하게 정리를 하고자 결심하였다!


## 과정

### 1. EC2 인스턴스 생성 및 RDS 연동

- `Amazon cloud` 환경을 활용하여 EC2 서버를 구축하고 `Amazon RDS` 를 사용해 `MySQL` 데이터베이스를 연동하여 사용한다.


- 서버 내에 스프링 부트 Jar 2대를 구동하여 `ACTIVE 상태`와 `IDLE 상태` 로 관리한다.


### 2. Jenkins, NginX 설치

- `Jenkins` 를 사용하여 빌드 자동화를 구현한다.


- `NginX` 를 사용하여 리버스 프록시를 구현해 로드 밸런싱을 수행한다.

  - *리버스 프록시 : Nginx 가 외부의 요청을 받아 뒷단 서버로 요청을 전달하는 행위*

  - 실제 요청에 대한 처리는 뒷단의 웹 서버들이 처리한다.

  - **외부 요청을 뒷단의 서버들에게 골고루 분배**하거나, **한 번 요청왔던 정적 리소스들은 캐시**하여 리버스 프록시 서버에서 바로 응답해줄 수 있는 등의 장점이 있다.

### 3. CI / CD 무중단 배포 구축

- CI (Continuos Integrity) & CD (Continuos Deploy) pipeline을 구축하여 무중단 배포를 가능하게 한다.


### 서버 아키텍처



## 참고

다음의 참고 자료를 활용하여 본 포스팅으로 한 곳에 정리하였다.

[스프링 부트와 AWS로 혼자 구현하는 웹 서비스, 이동욱 저](http://www.yes24.com/Product/Goods/83849117)

[창천향로님의 블로그](https://jojoldu.tistory.com/267)

[갓현민의 블로그](https://hyunminh.github.io/nonstop-deploy/)

[Jenkins 설치](https://techviewleo.com/install-jenkins-server-on-amazon-linux/)

[Jenkins & Github 연동](https://goddaehee.tistory.com/258)

[리버스 프록시 관련](https://www.joinc.co.kr/w/man/12/proxy)

[Jenkins AWT 에러 관련](https://it00.tistory.com/39)

[Nginx 동적 프록시 에러 관련](https://stackoverflow.com/questions/5743609/dynamic-proxy-pass-to-var-with-nginx-1-0)

