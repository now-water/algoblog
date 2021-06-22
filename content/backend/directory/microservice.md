---
title: '마이크로서비스 아키텍처'
metaTitle: '만렙 개발자 키우기'
metaDescription: '마이크로서비스 아키텍처를 정리한 곳입니다.'
tags: ['Backend']
date: '2021-05-14'
---

# 마이크로서비스 아키텍처

대규모 소프트웨어 프로젝트의 기능들을 작고 독립적이며 느슨하게 결합된 모듈로 분해하여 서비스를 제공하는 아키텍처이다.

모듈형 아키텍처 스타일은 클라우드 기반 환경에 적합하다.

각 개별 모듈은 개별적인 작업을 담당하며 간단하고 보편적으로 엑세스할 수 있는 API를 통해 다른 모듈과 통신한다.

웹 기반의 복잡한 응용 프로그램을 설계하기 위한 아키텍처.

일반적으로 SOA와 비슷하게 바라보는 시각도 존재하지만, 엄연히 다른 아키텍처이다.

## SOA(Service Oriented Architecture)

> **Java로 기존 웹 프로그램을 만들 때의 과정**
>
> 가장 먼저 `Presentation layer(사용자 인터페이스)`를 디자인한다.
>
> 그리고 Business logic을 처리하는 `Application Layer`를 구현한다.
>
> 구성 요소 간의 느슨한 결합을 가능하게 하는 `Integration Layer`를 디자인한다.
>
> 마지막으로 데이터에 접근이 가능하도록 하는 `Persistence Layer`를 디자인하고 구현해야 한다.

어플리케이션을 구동하기 위해 war or ear 패키지를 생성하고 이를 Tomcat or JBoss 와 같은 Application server에 배포한다.

모든 모듈이 war or ear 로 패키징되었기에 `Monolithic` 이라고 부른다.

즉, 별도의 구현 가능한 구성 요소가 모두 하나의 지붕 아래에 패키징되어 있다.

![image](https://user-images.githubusercontent.com/51476083/118242201-08e39400-b4d8-11eb-97d4-23cb2095a8af.png)

## SOA 의 문제점

**1. 어플리케이션이 커질수록 코드도 방대해지고 로드 시 IDE에 과부하**
=> 개발자의 생산성 저하 요인

**2. 하나의 war or ear에 모든 것을 포함하여서 어플리케이션의 기술 스택을 변경하는 것을 주저하게됨**
=> 어떤 side-effect가 발생할지 예측하기 어려워서 리팩토링 하기가 어렵다.

**3. 어플리케이션 내의 특정 기능이 실패하면 전체 어플리케이션에 영향**
=> 퍼포먼스가 나쁜 특정 함수/메소드의 영향이 전체 어플리케이션에 고통을 준다.

**4. 모든 것이 하나로 묶여 있기 때문에 개발자가 독립적으로 모듈 개발.배포 불가능**
협업으로 진행되기 때문에 다른 개발자의 의존성 때문에 개발 시간이 길어진다.

**5. scaling은 서버마다 동일한 war or ear을 배포해 수행해야 한다.**
각각의 서버는 동일한 리소스를 사용하게 되므로 효율적인 방법이 아니다.

## 마이크로서비스

아키텍처의 중요한 포인트는 확장성이다.

![image](https://user-images.githubusercontent.com/51476083/118242492-5cee7880-b4d8-11eb-95f8-294bda99b06f.png)

> **Scaling 세 가지 정의 – (The Art of Scalability 책 인용)**
>
> - X축 : horizontal application scaling (Monolithic 아키텍처에서도 가능) <br/>
> - Y축 : functional decomposition (가장 중요함) <br/>
>
>   - Monolithic에 포함되어 있는 다양한 기능을 독립적인 서비스로 바라보는 전략 <br/>
>   - 모든 기능을 어플리케이션에 배포하지 않고 각각 서비스를 독립적으로 배포 <br/>
>
> - Z축 : data partitioning <br/>
>   - 데이터를 분할하여 어플리케이션을 스케일링. <br/>
>   - 사용자의 요청에 따라 해당 샤드에 redirect하는 샤딩 개념으로 이해하면 된다. <br/>

**=> 이렇게 하면 개발자의 생산성 향상, 기능 변경 시 side-effect 걱정 없이 변경/배포 할 수 있는 유연성을 제공한다.**

![image](https://user-images.githubusercontent.com/51476083/118242812-accd3f80-b4d8-11eb-9380-7129e7f7f1d9.png)

## 마이크로 서비스의 장점

벤더사 중심의 SOA에 비해서 마이크로서비스는 Amazon, Netflix, eBay와 같은 글로벌 서비스 플레이어가 사용할 만큼 강력하다.

**1. Improve fault isolation**
단일 모듈의 장애에 대해 전체 어플리케이션은 크게 영향을 받지 않는다.

**2. Eliminates long-term commitment to a single technology stack**

- 각 개별 서비스에서 새로운 기술 스택을 바로 시험해볼 수 있다. <br/>

- 의존 관계가 기존 Monolithic 아키텍처보다 적고 유연하다.

**3. 기능 단위로 서비스가 가능해서 새로 조인한 개발자가 기능을 더 쉽게 이해할 수 있다.**

## 마이크로 서비스의 배포 및 가상화

마이크로 서비스 기반의 어플리케이션을 배포하는 가장 좋은 방법은 `컨테이너 가상화`를 이용하는 것 (Docker)

AWS와 같은 IaaS 업체의 VM을 이용하여 마이크로 서비스를 배포할 수 있지만, 작은 단위의 마이크로 서비스는 VM의 리소스를 전부 활용하지 못해 비용 효율성을 저하시킬 수 있다.

=> _따라서 컨테이너 기반으로 배포하는 것이 유리하다._

`OGSI(Open Service Gateway Initiative)`번들을 사용하여 코드를 배포할 수도 있지만,

이 경우에는 `management and isolation tradeoff`와 관련된 단점이 존재한다.

> **OGSI**
>
> 모듈 소프트웨어 프로그램과 라이브러리를 개발하고 배포하기 위한 자바 프레임워크

## 마이크로 서비스의 약점

**1. 분산 시스템 개발은 일반 개발보다 복잡하다.**

- 모든 것이 독립적인 서비스여서 각 모듈간 인터페이스를 신중하게 처리해야 한다.

* 서비스 중 하나가 응답하지 않게 될 경우에 대한 방어 코드도 작성해야 한다.

- 호출 대기 시간이 발생하면 복잡한 상황이 발생할 수 있다.

**2. Multiple Databases 및 트랜잭션 관리가 어려울 수 있다.**

**3. 마이크로 서비스 기반의 어플리케이션을 테스트하는 것은 번거로울 수 있다.**

- 테스트 시작 전 의존성이 있는 서비스를 미리 확인해야 한다.

**4. 마이크로 서비스의 배포는 복잡할 수 있다.**

- 각 서비스 간 조정이 필요할 수 있다.

> 하지만 이런 부분들은 자동화 도구를 사용하면 해결할 수 있다!

<hr/>

# 마무리

마이크로 서비스는 벤더사 중심이 아닌 서비스사 중심의 아키텍처이고, 이미 글로벌 플레이어에 의해 검증이 되어 있다.

하지만 좋은 아키텍처도 상황과 사람에 의해 달라지게 된다.

# 참조

- [Advantages and Disadvantages of Microservices Architecture](https://cloudacademy.com/blog/microservices-architecture-challenge-advantage-drawback/)

* [Red Hat 공식 레퍼런스](https://www.redhat.com/ko/topics/microservices)
