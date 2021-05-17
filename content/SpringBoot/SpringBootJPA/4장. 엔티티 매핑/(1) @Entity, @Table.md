---
title: '(1) @Entity, @Table'
metaTitle: '만렙 개발자 키우기'
metaDescription: '4장 내용을 정리한 곳입니다.'
tags: ['Spring Boot JPA']
date: '2021-05-10'
---

# 4.1.1 @Entity

JPA를 사용해서 테이블과 매핑할 클래스는 `@Entity` 어노테이션을 필수로 붙여야 한다.

`@Entity` 가 붙은 클래스는 JPA가 관리한다.

## 속성

**1. name**

- JPA에서 사용할 엔티티 이름 지정. 보통 기본값인 클래스 이름을 사용한다. <br/>

- 만약 다른 패지키에 이름이 같은 엔티티 클래스가 있다면 이름을 지정해서 충돌하지 않도록 해야 한다.


## @Entity 적용 시 주의 사항

- 기본 생성자는 필수이다.(파라미터가 없는 public 또는 protected 생성자)


- `final` 클래스, `enum`, `interface`, `inner` 클래스에는 사용할 수 없다.


- 저장할 필드에 final을 사용하면 안된다.

```java
public Member() {}  // 기본 생성자

public Member(String name) {
    this.name = name;
}
```

자바는 생성자가 하나도 없으면 파라미터가 없는 기본 생성자를 자동으로 만들지만, 생성자가 하나 이상 존재하면 기본 생성자를 자동으로 만들지 않는다.


이때는 기본 생성자를 직접 만들어야 한다.

왜냐면 **JPA가 엔티티 객체를 생성할 때 기본 생성자를 사용하기 때문이다.**


<hr/>

# 4.1.2 @Table

엔티티와 매핑할 테이블을 지정한다. 생략 시 매핑한 엔티티 이름을 테이블 이름으로 사용한다.

```java
@Entity
@Table(name="MEMBER")
public class Member {
    ...
}
```
