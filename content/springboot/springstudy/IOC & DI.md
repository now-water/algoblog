---
title: 'IOC & DI'
metaTitle: '만렙 개발자 키우기'
metaDescription: '스프링 관련 개념들을 정리한 곳입니다.'
tags: ['Spring Boot']
date: '2021-04-05'
---

# IOC (Inversion of Control)

스프링을 쓰기 전에는 개발자가 프로그램의 흐름(애플리케이션 코드)을 제어하는 주체였다.

하지만 스프링에서는 프로그램의 흐름을 프레임워크가 주도한다. **객체의 생성부터 생명주기 관리를 컨테이너가 도맡아서 한다.**

즉, 제어권이 컨테이너로 넘어가게 되고, 이것을 제어권의 흐름이 바뀌었다고 해서 `IoC(Inversion of Control: 제어의 역전)` 이라고 한다.

제어권이 컨테이너로 넘어옴으로써 `DI(의존성 주입)`, `AOP(관점 지향 프로그래밍)` 등이 가능해졌다.

**의존성을 역전시켜 객채 간에 결합도를 줄이고, 유연한 코드를 작성**할 수 있게 됨에 따라 **가독성 및 코드 중복, 유지 보수를 편하게** 할 수 있게 해준다.


### 기존의 객체 생성 과정

> 1. 객체 생성
>
> 2. 의존성 객체 생성 -> 클래스 내부에서 생성
>
> 3. 의존성 객체 메소드 호출

### 스프링에서 객체 생성 과정

> 1. 객체 생성
>
> 2. 의존성 객체 주입 -> 스스로 만드는 것이 아니라 제어권을 스프링에게 위임하여 스프링이 만들어놓은 객체를 주입
>
> 3. 의존성 객체 메소드 호출


**스프링이 실행될 때 모든 의존성 객체를 다 만들어주고 필요한 곳에 주입시켜준다.**

> `Bean`들은 `싱글턴 패턴`의 특징을 가지며, 제어의 흐름을 사용자가 컨트롤하는 것이 아니라 스프링에게 맡겨 작업을 처리하게 된다.

<hr/>

# DI (Dependency Injection)

스프링이 다른 프레임워크와 차별화되어 제공하는 의존 관계 주입 기능.

**객체를 직접 생성하는게 아니라 외부에서 생성한 후 주입시켜주는 방식**이다.

이를 통해 **모듈 간의 결합도가 낮아지고 유연성이 높아진다.**

## DI 유형
> **1. Setter Injection** <br/>
> 의존성을 입력 받는 setter 메서드를 만들고 이를 통해서 의존성을 주입한다.
> ```java
> @Component
> public class SampleController {
>    private SampleRepository sampleRepository;
>
>    @Autowired // 있어도 되고, 없어도 됨
>    public void setSampleRepository(SampleRepository sampleRepository) {
>        this.sampleRepository = sampleRepository;
>    }
> }
> ```
>
> **2. Contructor Injection** <br/>
> 필요한 의존성을 포함하는 클래스의 생성자를 만들고 이를 통해 의존성을 주입한다.
>
> ```java
> @Component
> public class SampleController {
>    private SampleRepository sampleRepository;
>
>    public SampleController(SampleRepository sampleRepository) {
>        this.sampleRepository = sampleRepository;
>    }
> }
> ```
>
> **3. Field Injection** <br/>
> 의존성을 주입할 변수에 `@Autowired` 어노테이션을 붙인다.
> ```java
> @Component
> public class SampleController {
>     @Autowired
>     private SampleRepository sampleRepository;
> }
> ```
>

이 외에도 Lombok 라이브러리를 사용해 `@AllArgsConstructor`, `@RequiredArgsConstructor` 어노테이션을 통해 자동 생성자 메소드를 사용할 수 있다.

특히 `@RequiredArgsConstructor` 의 경우, 의존성을 주입받을 객체를 `private final` 로 선언되어 생성 시점에 딱 한번만 주입받을 수 있도록 하기 때문에 불필요한 변경점이 발생하지 않아 안전하다.

## 권장하는 방법
Spring Framework Reference 에서 권장하는 방법은 `생성자를 통한 주입`이다.

> 필수적으로 사용해야하는 의존성 없이는 인스턴스를 만들지 못하도록 강제할 수 있다.

A 클래스와 B 클래스가 서로를 참조하는 순환 참조 관계이고 둘 다 생성자 주입을 사용한다면 A와 B 중 어떤 인스턴스도 생성할 수 없고, 결과적으로 어플리케이션이 실행되지도 않는다.

가장 좋은 방법은 순환 참조를 피하는 것이지만, 어쩔 수 없다면 `필드 주입`이나 `Setter 주입`을 사용해서 해결할 수 있다!

<hr/>

## Bean
`Spring Bean Container` 에서 생성되는 객체를 의미한다. `Bean container`는 의존성 주입을 통해 Bean 객체를 사용할 수 있도록 해준다.

`Bean`은 우리가 컨테이너에 공급하는 `설정 메타 데이터(XML 파일)` 혹은 `자바 설정파일`에 의해 생성된다.

> **최근 추세는 자바 설정파일을 좀 더 많이 사용한다 !**

`Bean Factory` : `Bean`을 관리하는 컨테이너

`Application Context` : `Bean Factory`에 여러 가지 컨테이너 기능을 추가한 컨테이너

- `new 연산자`로 객체 생성 -> Bean X

- `ApplicationContext.getBean()` 으로 얻는 객체 -> Bean O

<hr/>

### 스프링 컨테이너에 Bean 생성 방법

> **1. Component Scan**
>
> `@ComponentScan` 이 붙은 위치에서 자동으로 **하위 클래스**들을 스캔하면서 `@Component`, `stereotype(@Service, @Controller, @Repository 등)` 어노테이션이 부여된 class 를 찾아 자동으로 `Bean`으로 등록해준다.
>
> `@SpringBootApplication` 내부에 포함되어 있다.
>
>  `@Service`, `@Controller`, `@Repository` 내부에도 `@Component` 가 있다.
>
>  추가적으로 `Bean`으로 등록하고 싶은 class 가 있으면 `@Component` 어노테이션을 붙여줄 수 있다.

> **2. @Configuraion에서 @Bean 으로 등록 (자바 설정파일)**
>
> 일반적으로 `xxxxConfiguration` 과 같은 네이밍으로 자바 클래스를 생성해 작성한다.
>
> `@Configuration` 어노테이션을 사용해서 직접 `@Bean`을 등록해준다.
>
> `@Bean` 어노테이션을 사용하면 자동으로 빈으로 등록된다.
>
> ```java
> @Configuration // 내부에 @Component 가 붙어 있다.
> public class HttpConfig {
>   @Bean
>   public RestTemplate createRestTemplate(){
>     return new RestTemplate(); // 리턴되는 객체가 스프링 IoC 컨테이너 안에 빈으로 등록
>   }
> }
> ```
