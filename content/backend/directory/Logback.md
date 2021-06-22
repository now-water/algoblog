---
title: 'Logback'
metaTitle: '만렙 개발자 키우기'
order: 3
tags: ['Backend']
date: '2021-03-05'
---

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

* `log4j`, `log4j2` 등과 성능을 비교하였을 때 더 훌륭한 성능을 보여준다.

- `spring-boot-starter-web` 안에 `spring-boot-starter-logging` 에 구현체가 있다.

* 필요한 주요 설정 요소 :
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

### 로그 레벨 순서 및 사용 방법

> TRACE < DEBUG < INFO < WARN < ERROR

1. ERROR : 요청을 처리하는 중 오류가 발생한 경우 표시

2) WARN : 처리 가능한 문제, 향후 시스템 에러의 원인이 될 수 있는 경고성 메시지를 나타낸다.

3. INFO : 상태 변경과 같은 정보성 로그를 표시

4) DEBUG : 프로그램을 디버깅하기 위한 정보를 표시

5. TRACE : 추적 레벨은 Debug 보다 훨씬 상세한 정보를 나타낸다.

위에서부터 순서대로 높은 레벨을 가진다.

출력 레벨의 설정에 따라 설정 레벨 이상의 로그를 출력한다. `ex) INFO 설정 시 TRACE, DEBUG 레벨은 무시한다.`

`application.properties` 에 `logging.level.root=레벨` 과 같이 값을 세팅해놓고 설정 가능.

패키지별로 로깅 레벨 지정 가능

- 상위 패키지의 디폴트 레벨을 설정하고, 하퓌 패키지들에 대한 각각의 로깅 레벨을 별도로 설정 가능

      logging.level.root = info
      logging.level.com.~.service = info
      logging.level.com.~.controller=debug

<br/>

#### logger 등록 및 사용 방법

`LoggerFactory` 에서 로거 객체를 불러온 후, 로거 객체를 이용해서 코드의 원하는 부분에 로그를 찍으면 된다.

```java
@Controller
public class HomeController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/")
    public ModelAndView test() throws Exception{
        logger.info("INFO 로그");
        logger.warn("WARN 로그");
        logger.error("ERROR 로그");
        return mav;
    }
}
```

![image](https://user-images.githubusercontent.com/51476083/107900225-be5b8580-6f83-11eb-9bae-6c7e2b7cce6e.png)

---

### 기본 특징

- 대소문자를 구별하지 않는다. `ex) <logger> == <LOGGER>`

* name attribute 를 반드시 지정해야 한다.

- `Logback-spring.xml` 은 `appender` 와 `logger` 로 크게 구분된다.

* `Dynamic Reloading` 기능을 지원한다.

  ex) 60초 주기마다 로그파일(logback-spring.xml) 이 바뀌었는지 검사하고 바뀌었으면 프로그램 갱신

  ```java
  <?xml version="1.0" encoding="UTF-8"?>
  <!-- 60초마다 설정 파일의 변경을 확인 하여 변경시 갱신 -->
  <configuration scan="true" scanPeriod="60 seconds">
   로그백 설정 부분
  </configuration>
  ```

---

#### appender

log 의 형태를 설정, 로그 메세지가 출력될 대상을 결정하는 요소

(콘솔에 출력할지, 파일로 출력할지 등의 설정)

- ch.qos.logback.core.ConsoleAppender : 콘솔에 로그를 찍는다. 로그를 `OutputStream` 에 작성하여 콘솔에 출력

* ch.qos.logback.core.FileAppender : 파일에 로그를 찍는다. 최대 보관 일수 등을 지정할 수 있다.

- ch.qos.logback.core.rolling.RollingFileAppender : 여러 개의 파일을 롤링, 순회하면서 로그를 찍는다. (FileAppender를 상속받음) -> 지정 용량이 넘어간 Log File을 넘버링하여 나눠서 저장 가능.

* ch.qos.logback.classic.net.SMTPAppender : 로그를 메일에 찍어 보낸다.

- ch.qos.logback.classic.db.DBAppender : DB에 로그를 찍는다.

---

### root, logger

설정한 `appender` 를 참조하여 `package` 와 `level`을 설정

<br/>

#### root

- 전역 설정이라고 볼 수 있다.

- 지역적으로 선언된 `logger` 설정이 있다면 해당 logger 설정이 default로 적용

#### logger

- 지역 설정이라고 볼 수 있다.

- `additivity` 값은 root 설정 상속 유무 설정 (default = true)

### property

설정 파일에서 사용될 변수값 선언

### layout, encoder

#### layout

- 로그의 출력 포맷을 지정. `log4j`에서 설정할 때 많이 사용했음.

#### encoder

- `Appender`에 포함되어 사용자가 지정한 형식으로 표현될 로그 메세지를 변환하는 역할 담당
  <br/>
- 바이트를 소유하고 있는 `appender`가 관리하는 `OutputStream`에 쓸 시간과 내용을 제어할 수 있다.
  <br/>
- `FileAppender` 와 하위 클래스는 `encoder`를 필요로하므로 `layout` 대신 `encoder`를 사용하면 된다.

---

### pattern

**[패턴에 사용되는 요소]**

|      요소       | 내용                                                                 |
| :-------------: | -------------------------------------------------------------------- |
| %Logger{length} | Logger name을 축약할 수 있다. {length}는 최대 자리 수, ex)logger{35} |
|    %-5level     | 로그 레벨, -5는 출력의 고정폭 값(5글자)                              |
|      %msg       | 로그 메시지 (=%message)                                              |
|    \${PID:-}    | 프로세스 아이디                                                      |
|       %d        | 로그 기록시간                                                        |
|       %p        | 로깅 레벨                                                            |
|       %F        | 로깅이 발생한 프로그램 파일명                                        |
|       %M        | 로깅일 발생한 메소드의 명                                            |
|       %l        | 로깅이 발생한 호출지의 정보                                          |
|       %L        | 로깅이 발생한 호출지의 라인 수                                       |
|     %thread     | 현재 Thread 명                                                       |
|       %t        | 로깅이 발생한 Thread 명                                              |
|       %c        | 로깅이 발생한 카테고리                                               |
|       %C        | 로깅이 발생한 클래스 명                                              |
|       %m        | 로그 메시지                                                          |
|       %n        | 줄바꿈(new line)                                                     |
|       %%        | %를 출력                                                             |
|       %r        | 애플리케이션 시작 이후부터 로깅이 발생한 시점까지의 시간(ms)         |

---

### ETC

#### file

기록할 파일명과 경로를 설정한다.

#### rollingPolicy class

ch.qos.logback.core.rolling.TimeBasedRollingPolicy => 일자별 적용
ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP => 일자별 + 크기별 적용

#### fileNamePattern

파일 쓰기가 종료된 log 파일명의 패턴을 지정. `.gz`, `.zip`으로 자동 압축 가능

#### maxFileSize

- 한 파일당 최대 파일 용량을 지정

* log 내용 크기도 IO 성능에 영향을 미치기 때문에 최대 10MB 내외 권장

- 용량 단위는 `KB`, `MB`, `GB` 3가지 지정 가능

#### maxHistory

최대 파일 생성 개수

`ex) maxHistory 가 30이고, Rolling 정책을 일 단위로 하면 30일동안만 저장되고, 월 단위로 하면 30개월간 저장

#### Filter

해당 패키지에 반드시 로그를 찍지 않고 필터링이 필요한 경우에 사용하는 기능

`ex) 레벨 필터를 추가해서 error 단계인 로그만 찍도록 설정 가능`

```java

<?xml version="1.0" encoding="UTF-8"?>
<!-- 60초마다 설정 파일의 변경을 확인 하여 변경시 갱신 -->
<configuration scan="true" scanPeriod="60 seconds">
    <!--springProfile 태그를 사용하면 logback 설정파일에서 복수개의 프로파일을 설정할 수 있다.-->
    <springProfile name="local">
        <property resource="logback-local.properties"/>
    </springProfile>
    <springProfile name="dev">
        <property resource="logback-dev.properties"/>
    </springProfile>
    <!--Environment 내의 프로퍼티들을 개별적으로 설정할 수도 있다.-->
    <springProperty scope="context" name="LOG_LEVEL" source="logging.level.root"/>

    <!-- log file path -->
    <property name="LOG_PATH" value="${log.config.path}"/>
    <!-- log file name -->
    <property name="LOG_FILE_NAME" value="${log.config.filename}"/>
    <!-- err log file name -->
    <property name="ERR_LOG_FILE_NAME" value="err_log"/>
    <!-- pattern -->
    <property name="LOG_PATTERN" value="%-5level %d{yy-MM-dd HH:mm:ss}[%thread] [%logger{0}:%line] - %msg%n"/>


    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- File Appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 파일경로 설정 -->
        <file>${LOG_PATH}/${LOG_FILE_NAME}.log</file>


        <!-- 출력패턴 설정-->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>

        <!-- Rolling 정책 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- .gz,.zip 등을 넣으면 자동 일자별 로그파일 압축 -->
            <fileNamePattern>${LOG_PATH}/${LOG_FILE_NAME}.%d{yyyy-MM-dd}_%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <!-- 파일당 최고 용량 kb, mb, gb -->
                    <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!-- 일자별 로그파일 최대 보관주기(~일), 해당 설정일 이상된 파일은 자동으로 제거-->
            <maxHistory>30</maxHistory>
            <!--<MinIndex>1</MinIndex>
           <MaxIndex>10</MaxIndex>-->
        </rollingPolicy>
    </appender>


    <!-- 에러의 경우 파일에 로그 처리 -->
    <appender name="Error" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>error</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <file>${LOG_PATH}/${ERR_LOG_FILE_NAME}.log</file>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>

        <!-- Rolling 정책 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- .gz,.zip 등을 넣으면 자동 일자별 로그파일 압축 -->
            <fileNamePattern>${LOG_PATH}/${ERR_LOG_FILE_NAME}.%d{yyyy-MM-dd}_%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <!-- 파일당 최고 용량 kb, mb, gb -->
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!-- 일자별 로그파일 최대 보관주기(~일), 해당 설정일 이상된 파일은 자동으로 제거-->
            <maxHistory>60</maxHistory>
        </rollingPolicy>
    </appender>


    <!-- root레벨 설정 -->
    <root level="${LOG_LEVEL}">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="Error"/>
    </root>


    <!-- 특정패키지 로깅레벨 설정 -->
    <logger name="org.apache.ibatis" level="DEBUG" additivity="false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="Error"/>
    </logger>
</configuration>

```
