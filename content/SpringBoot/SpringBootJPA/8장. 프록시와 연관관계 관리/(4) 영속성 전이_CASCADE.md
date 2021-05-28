---
title: '(4) 영속성 전이_CASCADE'
metaTitle: '만렙 개발자 키우기'
metaDescription: '8장 내용을 정리한 곳입니다.'
tags: ['Spring Boot JPA']
date: '2021-05-28'
---

특정 엔티티를 영속 상태로 만들 때 연관된 엔티티도 함께 영속 상태로 만들고 싶을 경우

JPA는 `CASCADE 옵션` 으로 영속성 전이 제공

쉽게 말해서 영속성 전이를 사용하면 부모 엔티티를 저장할 때 자식 엔티티도 함께 저장할 수 있다.

> 만약 해당 옵션을 사용하지 않으면 엔티티를 저장할 때, 연관된 모든 엔티티는 영속 상태여야 한다.
>
> ex) 부모 먼저 `em.persist()` 로 영속 상태로 만든 후, 자식을 생성해 연관관계를 맺고 자식도 `em.persist()` 로 영속화시켜줘야한다.

# 8.4.1 영속성 전이 : 저장

```java
@Entity
public class Parent {
    ...
    @OneToMany(mappedBy = "parent", cascade = CascadeType.PERSIST) // 부모 영속화할 때 연관된 자식들도 함께 영속화 시키는 옵션
    private List<Child> children = new ArrayList<Child>();
    ...
}
```

## CASCADE 사용 코드

```java
private static void saveWithCascade(EntityManager em) {

    Child child1 = new Child();
    Child child2 = new Child();

    Parent parent = new Parent();
    child1.setParent(parent);       //연관관계 추가
    child2.setParent(parent);       //연관관계 추가
    parent.getChildren().add(child1);
    parent.getChildren().add(child2);

    // 부모 저장, 연관된 자식들 저장
    em.persist(parent);
}
```

이는 연관관계를 매핑하는 것과는 아무 관련이 없다. 단지 엔티티를 영소고하할 때 연관된 엔티티도 같이 영속화하는 편리함을 제공한다.

<hr/>

# 8.4.2 영속성 전이: 삭제

부모 엔티티만 삭제하면 자식 엔티티도 함께 삭제한다.

`cascade = CascadeType=REMOVE` 옵션 추가.

## 예전 코드

```java
Parent findParent = em.find(Parent.class, 1L);
Child findChild1 = em.find(Child.class, 1L);
Child findChild2 = em.find(Child.class, 2L);

em.remove(findChild1); // 외래 키 제약조건 고려해서 자식 먼저 삭제
em.remove(findChild2);
em.remove(findParent);
```

## CASCADE 사용 코드

```java
Parent findParent = em.find(Parent.class, 1L);
em.remove(findParent);
```

참고로 `CascadeType.PERSIST`, `CascadeType.REMOVE` 는 em.persist(), em.remove() 를 실행할 때 바로 전이가 발생하지 않고, 플러시를 호출할 때 전이가 발생한다.
