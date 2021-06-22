---
title: '(2) Converter'
metaTitle: '만렙 개발자 키우기'
metaDescription: 'Converter를 정리한 곳입니다.'
tags: ['Spring Boot JPA']
date: '2021-01-28'
---

# @Converter

컨버터를 사용하면 엔티티의 데이터를 변환해서 데이터베이스에 저장할 수 있다.

ex) 회원의 VIP 여부를 자바의 `boolean` 타입으로 저장하길 원한다. DB에 저장 시 0 또는 1로 저장되는데, 숫자 대신 문자 Y 또는 N 로 저장하고 싶은 경우

```java
@Entity
public class Member {

  @Id
  private String id;
  private String username;

  @Convert(converter = BooleanToYNConverter.class)
  private boolean vip;

  // Getter, Setter..
}

@Converter
public class BooleanTOYNConverter implements AttributeConverter<Boolean, String> { // Boolean 타입을 String 타입으로 변환

    @Override
    public String convertToDatabaseColumn(Boolean attribute) {
        return (attribute != null && attribute) ? "Y" : "N" ;
    }

    @Override
    public Boolean convertToEntityAttribute(String dbData) {
        return "Y".equals(dbData);
    }
}
```

- convertToDatabaseColumn() : 엔티티의 데이터를 데이터베이스 컬럼에 저장할 데이터로 변환. 예제에선 `true`면 `Y`, `false`면 `N`을 반환

* convertToEntityAttribute() : DB에서 조회한 컬럼 데이터를 엔티티의 데이터로 변환.`Y`면 `true`, `N` 이면 `false` 반환

---

# 글로벌 설정

모든 `Boolean` 타입에 컨버터를 적용하려면 `@Converter(autoApply = true)` 옵션을 적용한다.

```java
@Converter(autoAPply = true) // 이 부분 추가
public class BooleanTOYNConverter implements AttributeConverter<Boolean, String> { // Boolean 타입을 String 타입으로 변환

    @Override
    public String convertToDatabaseColumn(Boolean attribute) {
        return (attribute != null && attribute) ? "Y" : "N" ;
    }

    @Override
    public Boolean convertToEntityAttribute(String dbData) {
        return "Y".equals(dbData);
    }
}
```

## 속성

- converter : 사용할 컨버터를 지정

* attributeName : 컨버터를 적용할 필드를 지정

- disableConversion : 글로벌 컨버터나 상속 받은 컨버터를 사용하지 않는다.
