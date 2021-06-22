---
title: '(4) WEB 확장'
metaTitle: '만렙 개발자 키우기'
metaDescription: 'WEB 확장을 정리한 곳입니다.'
tags: ['Spring Boot JPA']
date: '2021-01-24'
---

# WEB 확장

- 스프링 데이터 프로젝트는 스프링 MVC에서 사용할 수 있는 편리한 기능을 제공한다.


- `@EnableSpringDataWebSupport` 어노테이션을 사용해 도메인 클래스 컨버터와 페이징과 정렬을 위한 기능 적용

## 도메인 클래스 컨버터 기능

: 식별자로 도메인 클래스를 바로 바인딩해주는 기능.

```java
@Controller
public class MemberController {

    @RequestMapping("member/memberUpdateForm")
    public String memberUpdateForm(@RequestParam("id") Member member, Model model){
        model.addAttribute("member", member);
        return "member/memberSaveForm";
    }
}
```

`@RequestParam("id") Member member` 부분에서 id를 넘겨받지만, `도메인 클래스 컨버터`가 중간에 동작해서 id를 회원 엔티티 객체로 변환해서 넘겨준다.

 해당 엔티티와 관련된 리포지토리를 사용해서 엔티티를 찾는다.
> 여기서는 회원 리포지토리를 통해서 회원 id로 회원 엔티티를 찾는다.

---

## 페이징과 정렬 기능

```java
// 페이징과 정렬 예제
@RequestMapping(value = "/members", method = RequestMethod.GET)
public String list(Pageable pageable, Model model){ // 파라미터로 Pageable을 받는다. Pageable은 요청 파라미터 정보로 만들어진다.

    Page<Member> page = memberService.findMembers(pageable);
    model.addAttribute("members", page.getContent());
    return "members/memberList";

}
```
<br/>

### Pageable의 요청 파라미터
- page : 현재 페이지, 0부터 시작

- size : 한 페이지에 노출할 데이터 건수

- sort 정렬 조건을 정의한다.


    /members?page=0&size=20&sort=name&desc&sort=address.city


- 접두사

  사용해야 할 페이징 정보가 둘 이상이면 접두사를 사용해 구분 가능 `@Qualifier` 사용. `접두사명_` 으로 구분

  ```java
  public String list(
    @Qualifier("member") Pageable memberPageable,
    @Qualifier("order") Pageable orderPageable, ...
  )
  ```
  `/members?member_page=0&order_page=1`
