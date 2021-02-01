### 스프링 부트의 로깅

태초에 스프링은 JCL (Jakarta Commons Logging) 을 사용해서 로깅(Logging)을 구현했다.

그리고 현재의 스프링 부트의 로그 구현체로 사용된 것 중에서 대표적인 것이 Log4j와 Logback이다.

**JCL이 구현체를 선택하는 시점은 런타임**이며 따라서 클래스 로더에 의존적이다.

이러한 JCL의 치명적인 문제점은 `가비지 컬렉션` 이 제대로 동작하지 않는다는 것이다.

문제 해결을 위해 클래스 로더 대신에 **컴파일 시점에 구현체를 선택하도록 변경한다**

> 이 때 도입되는 것이 `SLF4J` 이다


`SLF4J`는 `Bridging`, `API`, `Binding` 모듈을 제공하여 컴파일 시점에 로깅 구현체를 결정한다.


---

### Logback

#### 정의

- 자바 오픈소스 로깅 프레임워크, `SLF4J` 의 구현체


- `log4j`, `log4j2` 등과 성능을 비교하였을 때 더 훌륭한 성능을 보여준다.


- `spring-boot-starter-web` 안에 `spring-boot-starter-logging` 에 구현체가 있다.


- 필요한 주요 설정 요소 :
  - `Logger` <br/>
  - `Appender` <br/>
  - `Encoder` <br/>

---

### 스프링 부트 logback 설정

- `logback-spring.xml` 파일을 `resources` 디렉토리에 만들어서 참조한다.

  <br/>

- 참조 순서

  - `classpath(resources 디렉토리 밑)` 에 `logback-spring.xml`이 있으면 설정파일을 읽어간다.
  - `logback-spring.xml` 이 없다면 `.yml(.properties) 파일` 의 설정을 읽어간다.
  - `logback-spring.xml` 과 `.yml(.properties) 파일` 이 동시에 있으면 `.yml(.properties) 파일` 을 적용한 후 `.xml` 파일이 적용된다.

  <br/>

- 스프링 부트에서는 `logback-spring.xml` 을 사용해 Spring이 logback을 구동할 수 있도록 지원해준다.

- 이를 이용하여 profile, 즉 배포 환경에 따른(spring.profiles.active 활용) `apllication.xml` 에 설정된 `properties` 를 읽어올 수 있다.


    ex)
    spring.profiles.active=local
    logback-local.properties => console-logging
    logback-dev.properties => file-logging
    logback-prod.properties => file-logging,remote-logging


---

