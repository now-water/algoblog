---
title: '(3) OSIV'
metaTitle: '만렙 개발자 키우기'
metaDescription: 'OSIV를 정리한 곳입니다.'
tags: ['Spring Boot JPA']
date: '2021-01-26'
---

## OSIV (Open Session In View)

OSIV 는 하이버네이트에서 사용하는 용어. JPA에서는 OEIV(Open EntityManager In View)라 한다. 하지만 관례상 모두 OSIV 로 부른다 !

결국 모든 문제는 엔티티가 프레젠테이션 계층에서 준영속 상태이기 때문에 발생한다.

따라서 **영속성 컨텍스트를 뷰까지 열어둠으로써 뷰에서도 지연 로딩을 사용할 수 있다.**

---

### 과거 OSIV : 요청 당 트랜잭션 방식

클라이언트의 요청이 들어오자마자 서블릿 필터나 스프링 인터셉터에서 영속성 컨텍스트를 만들면서 트랜잭션을 시작하고,
요청이 끝날 때 트랜잭션과 영속성 컨텍스트를 함께 끝내는 방법

이렇게하면 영속성 컨텍스트가 처음부터 끝까지 살아있으므로 조회한 엔티티도 영속 상태를 유지한다. -> **뷰에서 지연 로딩이 가능**하므로 엔티티를 미리 초기화할 필요 X, `FACADE 계층` 없이도 뷰에 독립적인 서비스 계층을 유지할 수있다.

### 문제점

> 컨트롤러나 뷰 같은 프레젠테이션 계층이 엔티티를 변경할 수 있다.

즉, 렌더링 이후 트랜잭션을 커밋해서 영속성 컨텍스트를 플러시한다. 이때 영속성 컨텍스트의 변경 감지 기능이 작동해서 변경된 엔티티를 데이터베이스에 반영해버린다.

`ex) 고객의 이름을 XXX로 변경해서 노출하길 원할 경우 member.setName("XXX") 를 하면 DB의 정보도 변경되버림!`

이렇게되면 애플리케이션을 유지보수하기 매우 힘들어진다. 따라서 프레젠테이션 계층에서 엔티티를 수정하지 못하게 막아야한다.

### 해결방법

- 엔티티를 읽기 전용 인터페이스로 제공

* 엔티티 레핑

- DTO만 반환

---

### 엔티티를 읽기 전용 인터페이스로 제공

: 엔티티를 직접 노출하는 대신 읽기 전용 메소드만 제공하는 인터페이스를 프레젠테이션 계층에 제공하는 방법

```java
interface MemberView {
    public String getName();
}

@Entity
class Member implements MemberView {
    ...
}

class MemberService {

    public MemberView getMember(id){
        return memberRepository.findById(id); // 프레젠테이션 계층에는 읽기 전용 메소드만 있는 인터페이스를 제공
    }
}
```

### 엔티티 레핑

: 엔티티의 읽기 전용 메소드만 가지고 있는 엔티티를 감싼 객체를 만들고 이를 프레젠테이션 계층에 반환

```java
class MemberWrapper {

    private Member member;

    public MemberWrapper (Member member){
        this.member = member;
    }

    // 읽기 전용 메소드만 제공
    public String getName(){
        return member.getName();
    }
}
```

### DTO만 반환

: 프레젠테이션 계층에 엔티티 대신에 단순히 데이터만 전달하는 객체인 DTO 를 생성해서 반환한다.

이 방법은 OSIV 를 사용하는 장점을 살릴 수 없고 엔티티를 거의 복사한 듯한 DTO 클래스도 하나 더 만들어야 한다.

```java
class MemberDTO {
    private String name;

    // Getter, Setter
}
...
MemberDTO memberDTO = new MemberDTO();
memberDTO.setName(member.getName());
return memberDTO;
```

엔티티와 거의 비슷한 `MemberDTO`를 만들고 엔티티 값을 여기에 채워서 반환

이러한 방법들은 모두 **코드량이 상당히 증가한다는 단점이 있다.**

따라서 최근에는 거의 사용하지 않는다.

문제점들을 보완해서 `비즈니스 계층에서만 트랜잭션을 유지`하는 방식의 OSIV를 사용한다 -> `스프링 OSIV`
