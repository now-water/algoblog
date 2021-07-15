---
title: '@Modifying'
metaTitle: '만렙 개발자 키우기'
metaDescription: '스프링부트 관련 내용을 정리한 곳입니다.'
tags: ['Spring Boot']
date: '2021-07-14'
---

# @Modifying + @Transactional

기본적으로 CrudRepository 를 상속받는 레포지토리는 다음에서 알 수 있듯이 `@Transactional(readOnly = true)` 가 적용되어 있다.

![image](https://user-images.githubusercontent.com/51476083/125461512-eeae43d1-4ede-42a9-b61d-8453dfc3dc8f.png)

따라서 수정/삭제를 하는 쿼리에서는 readOnly 가 true가 되도록 해줘야하기 때문에 `@Transactional` 을 붙여준다. 일종의 Override 개념인 셈이다.

참고로 `@Transactional` 은 default가 `readOnly = false` 이다.

![image](https://user-images.githubusercontent.com/51476083/125462623-1365f455-319e-48bb-97b2-c9f0c024b3e7.png)

그리고 벌크성 수정 쿼리를 사용하기 위해서 `@Modifying` 어노테이션을 사용한다. 해당 어노테이션이 붙은 쿼리는 `executeUpdate()` 를 실행한다.

[JPA 10장-(5) 객체지향 쿼리 심화](https://www.nowwatersblog.com/jpa/ch10/10-5) 에서도 정리했듯이, `executeUpdate()` 메소드를 사용하면 영속성 컨텍스트를 거치지 않고 바로 데이터베이스에 직접 쿼리한다.

이때, 영속성 컨텍스트와 데이터베이스 간에 동기화 문제가 발생할 수 있다. 위의 링크에서 3가지 해결 방법을 정리해두었다. 여기선 영속성 컨텍스트의 내용을 모두 flush한 후, 비워주는 방식을 사용한다.

그러기 위해서는 `@Modifying(clearAutomatically = true)` 처럼 속성값을 줘서 그러한 동작을 수행하도록 해야 한다.
영속성 컨텍스트를 플러시하는 것은, flush 디폴트 모드에 의해 JPQL 쿼리 사용 시 커밋 직전에 자동으로 flush를 하도록되어 있기 때문에 자동으로 수행된다.

