---
title: 'Interceptor'
metaTitle: '만렙 개발자 키우기'
order: 2
tags: ['Backend']
date: '2021-02-02'
---

### 인터셉터 (Interceptor)

컨트롤러에 들어오는 요청 `HttpRequest` 와 컨트롤러가 응답하는 `HttpResponse`를 가로채는 역할을 한다.

주로 **클라이언트로 들어오는 디테일한 처리(인증, 권한 등) 에 대해서 처리**한다

인터셉터는 `Spring Framework`가 제공하는 기능이다.

![Spring MVC Request Lifecycle](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F2564124C588F496C01B966)
[Spring MVC Request Lifecycle]

예를 들면 로그인을 처리하기 위해 사용될 수 있는데, 컨트롤러로 오는 모든 요청들을 컨트롤러가 처리하기 전에 가로채서 로직을 끼워 넣는 기능을 활용할 수 있다.
`Handler(Controller)`로 가기 전에 정보를 처리.

- 호출 시점 : `DispatcherServlet` 이 실행된 후

* 설정 위치 : `spring-servlet.xml`

- 구현 방식 : 메서드를 작성해 구현

#### 환경 설정

모든 요청을 가로채서 `com.gallery.interceptor` 패키지에 있는 `MyInterceptor` 객체를 실행한다.

```java
// spring-servlet.xml
<!-- Interceptors -->
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/**" />
        <bean class="com.gallery.interceptor.MyInterceptor" />
    </mvc:interceptor>
</mvc:interceptors>
```

---

#### 테스트

Interceptor를 구현하는 방법은 2가지가 존재한다.

1. `HandlerInterceptor` 인터페이스를 구현

2) `HandlerInterceptorAdapter` 클래스를 상속

상속을 받으면 메서드가 이미 구현되어 있어서 사용하기 편하므로 상속받는 방법을 주로 사용한다.

```java
// Interceptor 들이 동작할 수 있도록 spring 에 등록
@Configuration
public class CustomWebMvcConfigurer extends WebMvcConfigurationSupport {

   @Override
   protected void addInterceptors(InterceptorRegistry registry) {
      registry.addInterceptor(new AdminInterceptor())
            .addPathPatterns("/admin/**")
            .excludePathPatterns("/admin/myPage");

      registry.addInterceptor(new UserInterceptor())
            .addPathPatterns("/user/**");
   }
}
```

- addPathPatterns : 추가할 주소

* excludePathPatterns : 예외 처리할 주소

<br/> <br/>

```java
// 상속받은 클래스
public class MyInterceptor extends HandlerInterceptorAdapter {
  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    System.out.println("컨트롤러 요청 입니다.!!");
    return true;
  }

	// 필요한 메소드만 오버라이딩 해서 구현하면 된다!
  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    System.out.println("컨트롤러 응답 입니다.!!");
  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    System.out.println("컨트롤러 응답까지 완료 입니다.");
  }

  @Override
  public void afterConcurrentHandlingStarted(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    System.out.println("비동기 요청시 수행됩니다, postHandle, afterCompletion 수행 X");
  }
  ...
}
```

```java
@RestController
@RequestMapping("/inter")
public class myInterceptorController {

    @GetMapping("")
    public String index(){
        System.out.println("어드민 컨트롤러 입니다.");
        return "myInterceptor";
    }
}
```

### 메소드별 수행 순서

1. filter (존재할 경우)

2) preHandle

3. controller

4) postHandle

5. afterCompletion

---

### 필터 (Filter)

인코딩이나 보안 관련 처리와 같은 web app에서 전역적으로 처리해야 하는 로직을 구현하는데 주로 사용된다.

`Dispatcher servlet` 의 앞단에서 정보를 처리.

필터는 `J2EE` 표준 스펙에 정의되어 있는 기능이다.

- 호출 시점 : `DispatcherServlet` 이 실행되기 전

* 설정 위치 : `web.xml`

- 구현 방식 : `web.xml` 설정을 해서 구현
