---
title: 'Test 코드 작성하기'
metaTitle: '만렙 개발자 키우기'
order: 4
tags: ['Backend']
date: '2021-03-22'
---

# 테스트 코드

### TDD, Test-Driven Development

매우 짧은 개발 사이클을 반복하는 SW 개발 프로세스 중 하나이다.

TDD 는 테스트가 주도하는 개발이다. 따라서 테스트 코드를 먼저 작성하는 것부터 시작한다.

![image](https://user-images.githubusercontent.com/51476083/111969395-8674ce80-8b3d-11eb-8248-ab5d1de8b9a9.png)
**레드 그린 사이클**

- Red : 항상 실패하는 테스트를 먼저 작성

- Green : 테스트가 통과하는 프로덕션 코드를 작성

- Refactor : 테스트가 통과하면 프로덕션 코드를 리팩토링

---

### 단위 테스트

모듈이나 애플리케이션 안에 있는 개별적인 코드 단위가 예상대로 작동하는지 확인하는 반복적인 행위이다.

테스트 코드들은 서로 분리되어 있으며, 테스트 되고 있는 코드와도 분리된다. 덕분에 문제를 쉽게 해결할 수 있다.

즉, 단위 테스트는 TDD 의 첫 번째 단계인 **기능 단위의 테스트 코드를 작성하는 것**을 의미한다.

TDD 와 다르게 테스트 코드를 먼저 작성할 필요가 없으며, 리팩토링도 반드시 포함되지는 않는다.

#### 단위 테스트의 장점

> - 개발 단계 초기에 문제를 발견하게 도와준다.
>
> - 개발자가 나중에 코드를 리팩토링하거나 라이브러리 업그레이드 등에서 기존 기능이 올바르게 작동하는지 확인할 수 있다 -> `회귀 테스트`
>
> - 기능에 대한 불확실성을 감소시킬 수 있다.
>
> - 시스템에 대한 실제 문서를 제공한다. -> 단위 테스트 자체가 문서로 사용 가능하다.

**요약**

1. 톰캣 서버를 내렸다가 다시 올릴 필요가 없다

2. 작성한 코드 자동 검증

3. 개발자가 만든 기능을 안전하게 보호

---

### 테스트 프레임워크

**xUnit**

- JUnit - Java

- DBUnit - DB

- CppUnit - C++

- NUNIT - .net

---

### 테스트 코드 작성

#### SpringWebserviceApplication

```java

// 앞으로 만들 프로젝트의 메인 클래스
package com.nowwater.board.springwebservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// 이 어노테이션이 있는 위치부터 설정을 읽어간다.
@SpringBootApplication // 스프링 부트의 자동 설정, 스프링 Bean 읽기,생성 모두 자동 설정,
public class SpringWebserviceApplication {

    public static void main(String[] args) {
        // 내장 WAS(웹 어플리케이션 서버)를 실행 -> 언제 어디서나 같은 환경에서 스프링 부트 배포 가능
        SpringApplication.run(SpringWebserviceApplication.class, args);
    }

}
```

#### HelloController

```java
@RestController // 컨트롤러를 JSON을 반환하는 컨트롤러로 바꿔줌
public class HelloController {

  @GetMapping("/hello")
  public String hello() {
    return "hello";
  }
}
```

#### HelloControllerTest

```java
package com.nowwater.board.springwebservice;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.nowwater.board.springwebservice.posting.HelloController;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class) // 테스트를 진행 시 JUnit 에 내장된 실행자 외에 다른 실행자 실행 - SpringRunner 라는 스프링 실행자 사용
@WebMvcTest(controllers = HelloController.class) // 웹에 집중할 수 있는 테스트 어노테이션
public class HelloControllerTest {

  @Autowired
  private MockMvc mvc; // 웹 API 테스트 시 사용, 스프링 MVC 테스트의 시작점.
  // HTTP GET, POST 등에 대한 API 테스트 가능

  @Test
  public void hello가_리턴된다() throws Exception {
    String hello = "hello";

    mvc.perform(get("/hello")) // /hello 주소로 GET 요청
      .andExpect(status().isOk()) // HTTP Header 의 Status 를 검증
      .andExpect(
        content().string(hello)); // 응답 본문의 내용 검증, Controller 에서 "hello"를 리턴하기 때문에 값이 맞는지 검증

    // andExpect : mvc.perform의 결과를 검증,

  }
}
```

#### HelloControllerTest 실행 결과

![image](https://user-images.githubusercontent.com/51476083/111971898-2fbcc400-8b40-11eb-9b25-1c4014e53713.png)

성공적으로 테스트가 실행된다.

---

### Lombok 사용 테스트 코드 작성

이제 Lombok 라이브러리를 사용하여 테스트 코드를 작성해본다.

#### Lombok 라이브러리 적용 및 문제 해결

먼저 Lombok 라이브러리를 프로젝트에 적용시켜보자.

다음과 같은 순서대로 적용해준다.

(참고로 lombok 적용과 테스트가 바로 작동하지 않아서 한참 찾아보면서 헤맸다..)

1. lombok plugin 설치

2) Setting > Build, Execution, Deployment > Compiler > Annotation Processors > "Enable annotation processing" 체크

3. Setting > Build, Execution, Deployment > Compiler > Java Compiler > user compiler > "javac" 선택

4) `build.gradle` 에서 아래와 같이 의존성 추가

   ```java
   dependencies{
   ...

   implementation 'org.projectlombok:lombok'
   annotationProcessor 'org.projectlombok:lombok'

   ...
   }
   ```

#### 테스트 코드가 실행이 안된다면

만약 이렇게 적용하고 테스트 코드가 실행이 안된다면

`Setting > Build, Execution, Deployment > Build Tools > Gradle > Build and Run Using "IntelliJ" 선택`

해주면 된다 !

#### HelloResponseDto

```java
package com.nowwater.board.springwebservice.posting.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

// Lombok 라이브러리의 어노테이션들
@Getter // 선언된 모든 필드의 getter 메소드를 생성
@RequiredArgsConstructor // 선언된 모든 final 필드가 생성된 생성자를 생성해줌.
public class HelloResponseDto {

    private final String name;
    private final int amount;

}

```

#### HelloResponseDtoTest

```java
package com.nowwater.board.springwebservice.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.nowwater.board.springwebservice.posting.dto.HelloResponseDto;
import org.junit.Test;

public class HelloResponseDtoTest {

    @Test
    public void 롬복_기능_테스트(){
        //given
        String name = "test";
        int amount = 1000;

        // when
        HelloResponseDto dto = new HelloResponseDto(name, amount);

        // then
        assertThat(dto.getName()).isEqualTo(name); // assertj 의 메소드
        assertThat(dto.getAmount()).isEqualTo(amount);

        // < Junit 의 메소드가 아니라 assertj 의 assetThat 메소드를 사용하는 이유 >
        // 1. CoreMatchers와 달리 추가적으로 라이브러리가 필요하지 않다.
        // 2. 자동완성이 좀 더 확실하게 지원된다.

        // assertThat : assertj 라는 테스트 검증 라이브러리의 검증 메소드. 검증하고 싶은 대상을 메소드 인자로 받는다. 메소드 체이닝 지원
        // isEqualTo : assertj의 동등 비교 메소드. assertThat에 있는 값과 isEqualTo 값을 비교해서 같을 때만 성공
    }
}

```

#### HelloResponseDtoTest 실행 결과

![image](https://user-images.githubusercontent.com/51476083/111973974-63005280-8b42-11eb-91cf-6c2c580ace88.png)

**성공적으로 테스트가 실행된다.**

---

### HelloController 에서 DTO 사용하는 테스트

#### HelloController

```java
package com.nowwater.board.springwebservice.posting;

import com.nowwater.board.springwebservice.posting.dto.HelloResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController // 컨트롤러를 JSON을 반환하는 컨트롤러로 바꿔줌
public class HelloController {

    @GetMapping("/hello/dto")
    public HelloResponseDto helloDto(@RequestParam("name") String name, @RequestParam("amount") int amount){
        // 외부에서 API 로 넘긴 파라미터를 가져오는 어노테이션
        // API 반환 시, 엔티티 객체를 바로 넘기기 보다는 Dto 객체를 만들어서 반환하는 것이 좋다.
        return new HelloResponseDto(name, amount);
    }
}
```

#### HelloControllerTest

```java
package com.nowwater.board.springwebservice;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.nowwater.board.springwebservice.posting.HelloController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class) // 테스트를 진행 시 JUnit 에 내장된 실행자 외에 다른 실행자 실행 - SpringRunner 라는 스프링 실행자 사용
@WebMvcTest(controllers = HelloController.class) // 웹에 집중할 수 있는 테스트 어노테이션
public class HelloControllerTest {

    @Autowired
    private MockMvc mvc; // 웹 API 테스트 시 사용, 스프링 MVC 테스트의 시작점.
    // HTTP GET, POST 등에 대한 API 테스트 가능

    @Test
    public void helloDto가_리턴된다() throws Exception{
        String name = "hello";
        int amount = 1000;

        // param : API 테스트 시 사용될 요청 파라미터 설정
        // 값은 String 만 허용, 따라서 숫자/날짜 데이터 등록 시 문자열로 변경해야한다.

        // jsonPath : JSON 응답값을 필드별로 검증할 수 있는 메소드
        // $ 를 기준으로 필드명을 명시
        mvc.perform(
                get("/hello/dto")
                    .param("name", name)
                    .param("amount", String.valueOf(amount))
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is(name)))
            .andExpect(jsonPath("$.amount", is(amount)));
        System.out.println(name + " " + amount);
    }
}

```

#### HelloControllerTest 테스트 결과

![image](https://user-images.githubusercontent.com/51476083/111974743-1cf7be80-8b43-11eb-8281-b13a6d008862.png)

**JSON 이 리턴되는 API 도 정상적을 테스트를 통과한다.**

---

> 참고 - 스프링 부트와 AWS로 혼자 구현하는 웹 서비스, 이동욱 님 저서
