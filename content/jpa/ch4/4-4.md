---
title: '(4) DDL 생성 기능'
metaTitle: '만렙 개발자 키우기'
metaDescription: '4장 내용을 정리한 곳입니다.'
tags: ['Spring Boot JPA']
date: '2021-05-10'
---

DDL 생성 기능으로 제약조건을 추가할 수 있다.

```java
@Entity
@Table(name="MEMBER")
public class Member {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME", nullable = false, length = 10) //추가
    private String username;
    ...
}
```

```java
// 생성된 DDL
create table MEMBER (
    ID varchar(255) not null,
    NAME varchar(10) not null,
    ...
    primary key(ID)
)
```

- `nullable = false` : not null 제약조건 추가


- `length = 10` : 크기를 지정

<br/>

```java
// 유니크 제약조건
@Entity(name="Member")
@Table(name="MEMBER", uniqueConstraints = {@UniqueConstraint( // 추가
    name = "NAME_AGE_UNIQUE",
    columnNames = {"NAME", "AGE"} )})
public class Member {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME", nullable = false, length = 10) //추가
    private String username;
    ...
}
```

```java
// 생성된 DDL
ALTER TABLE MEMBER
    ADD CONSTRAINT NAME_AGE_UNIQUE UNIQUE (NAME, AGE)
```


**이런 기능들은 단지 DDL을 자동으로 생성할 때만 사용되고 JPA 실행 로직에는 영향을 주지 않는다.**

따라서 스키마 자동 생성 기능을 사용하지 않고 직접 DDL을 만든다면 사용할 이유가 없다.

이 기능을 사용하면 애플리케이션 개발자가 엔티티만 보고도 손쉽게 다양한 제약조건을 파악할 수 있는 장점이 있다.
