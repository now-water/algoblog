---
title: 'Advice'
metaTitle: '만렙 개발자 키우기'
order: 1
tags: ['Backend']
date: '2021-02-02'
---

## Advice

공통 관심 기능을 핵심 로직에 언제 적용할 지 정의한다.

**`Target 클래스`의 조인 포인트에 삽입되어 동작(적용할 기능)할 수 있는 코드이다.**

(`Pointcut`에서 지정한 `Joinpoint`에서 실행되어야 하는 코드이다.)

AOP에서는 관점으로서 분리되고 실행 시 모듈에 위빙된 구체적인 처리를`Advice` 라고 한다.

### Advice 타입

- Around Advice : Joinpoint 앞과 뒤에서 실행되는 advice

* Before Advice : Joinpoint 앞에서 실행되는 advice

- After Returning Advice : Joinpoint 메소드 호출이 정상적으로 종료된 후에 실행되는 advice

* After Throwing Advice : 예외가 던져질 때 실행되는 advice

- Introduction : 클래스에 인터페이스와 구현을 추가하는 특수한 advice

### 용어 정리

- Aspect : 여러 객체에 공통으로 적용되는 공통 관심 사항을 뜻한다.
  - AOP의 중심단위이며, Advice와 Pointcut을 합한 것이다. (Advisor) <br/> <br/>
  - ex) 트랜잭션, 보안<br/>

* Target : 핵심 로직을 구현하는 클래스,
  - `Advice`를 받는 클래스를 `target, 대상` 이라고 한다. <br/> <br/>
  - 별도의 기능을 추가하고자 하는 써드파티 클래스가 될 수 있다. <br/>

- Advisor : `Advice`와 `Pointcut`을 하나로 묶어 취급하는 것
  - 스프링 AOP 에만 있다. <br/> <br/>
  - 관점 지향에서 관점을 나타내는 개념이다.<br/>

* Weaving
  - Advice를 핵심 로직 코드에 적용하는 것. <br/> <br/>
  - 즉 공통 코드를 핵심 로직 코드에 삽입하는 것 <br/> <br/>
  - `Aspect`를 `target` 객체에 제공하여 새로운 프록시 객체를 생성하는 과정을 말한다.

- JoinPoint : 클래스의 인스턴스 생성 시점, 메소드 호출 시점, 예외 발생 시점과 같이 어플리케이션을 실행할 때 **특정 작업이 시작되는 시점**
  - `Advice`를 적용할 수 있는 지점. <br/> <br/>
  - 실행 시의 처리 플로우에서 **`Advice`를 위빙하는 포인트** <br/>

* Pointcut : `Joinpoint` 의 부분 집합으로서 실제로 Advice 가 적용되는 `Joinpoint` 를 나타낸다. (Advice를 어디서 위빙하는지를 정의하는 단위)

- 대상 객체 : `Advice` 가 위빙되는 인스턴스
