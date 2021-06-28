---
title: '@Controller vs @RestController'
metaTitle: '만렙 개발자 키우기'
metaDescription: '스프링부트 관련 내용을 정리한 곳입니다.'
tags: ['Spring Boot']
date: '2021-06-28'
---

두 어노테이션의 가장 큰 차이점은 `HTTP Response Body`가 생성되는 방식이다.

# @Controller

## View 반환

전통적인 Spring MVC 의 컨트롤러이다. **주로 View를 반환하기 위해 사용한다.** 이때 `ViewResolver`가 적절한 View를 찾아서 렌더링해서 반환한다.

![image](https://user-images.githubusercontent.com/51476083/123594303-81a17400-d82a-11eb-99c8-647dd9b293c5.png)

## Data 반환

이때 `@ResponseBody` 어노테이션을 사용하면 View 말고 직접 Data를 반환시켜줄 수 있다.

```java
// 예시
private final UserService userService;

@PostMapping(value = "/info")
public @ResponseBody User info(@RequestBody User user){
	return userService.retrieveUserInfo(user);
}
```

`@ResponseBody`는 HTTP 규격에 맞는 응답을 만들어주기 위한 어노테이션이다.

![image](https://user-images.githubusercontent.com/51476083/123594386-9b42bb80-d82a-11eb-8267-8d5e091be6c9.png)

- `@ResponseStatus`를 사용해서 상태 코드를 설정해 줄 수 있다


- HTTP 요청을 객체로 변환하거나, 객체를 응답으로 변환하는 `HttpMessageConverter`를 사용한다.


- 하지만 헤더를 유연하게 설정할 수 없다.

<br/>

그러한 점을 보완하기 위해 `ResponseEntity` 객체를 활용할 수 있다.

`ResponseEntity` 객체를 만들어서 사용할 경우, Header와 Status code 를 유연하게 설정할 수 있다는 장점이 있다.

---

# @RestController

`@RestController` 를 붙이면 모든 메서드에서는 `@ResponseBody` 어노테이션이 기본으로 작동한다.

![image](https://user-images.githubusercontent.com/51476083/123595958-85ce9100-d82c-11eb-81ff-25f6a6fb2ae0.png)

주용도는 Json 형태로 객체 데이터를 반환하는 것이다. `@RestController` 가 Data를 반환하기 위해서는 `viewResolver` 대신에 `HttpMessageConverter`가 동작한다.

`HttpMessageConverter` 에는 여러 Converter가 등록되어 있고, 반환해야 하는 데이터에 따라 사용되는 Converter가 달라진다.

- 단순 문자열일 경우 `StringHttpMessageConverter` 사용

- 객체인 경우 `MappingJackson2HttpMessageConverter` 사용

Spring은 클라이언트의 HTTP Accept 헤더와 서버의 컨트롤러 반환 타입 정보 둘을 조합해 적합한 `HttpMessageConverter`를 선택해 이를 처리한다.


# 요약

> 기존에 내가 사용하던 방식으로 `@RestController` 어노테이션을 붙여서 DTO 객체를 반환하는 방식의 동작 과정을 알 수 있었다.
>
> 1. `@RestController` = `@Controller` + `@ResponseBody`
>
>
> 2. 헤더와 상태 코드를 좀 더 유연하게 반환하기 위해서 `ResponseEntity` 를 사용하면 좋다.
>
>
> 3. 하지만 공식 문서에서도 굳이 `ResponseEntity` 가 좀 더 유리한 상황이 아니면 많이 남발해서 쓰는 것을 추천하지는 않는다고 한다..

