---
title: 'Exception'
metaTitle: '만렙 개발자 키우기'
metaDescription: 'CS를 놓치지 않기 위해 정리하고 있습니다.'
tags: ['CS']
date: '2021-07-11'
---

## 에러

`에러`란 컴퓨터 하드웨어의 오동작 또는 고장으로 인해 응용 프로그램 실행 오류가 발생하는 것을 자바에서 부르는 말이다.

주로 자바 가상머신에서 발생시키는 것이며, 예외와 반대로 애플리케이션에서 잡아낼 수 없다.

에러의 예로는 `OutOfMemoryError`, `ThreadDeath`, `StackOverflowError` 등이 있다.

## 예외

`예외`란 사용자의 잘못된 조작 또는 개발자의 잘못된 코딩으로 인해 발생하는 프로그램 오류를 말한다.

`예외`가 발생되면 프로그램은 곧바로 종료된다는 점에서 에러와 동일하지만, 예외는 `예외 처리`를 통해 프로그램을 종료하지 않고 정상 실행 상태가 유지되도록 할 수 있다.

### 예외 구분

예외는 `Checked Exception` 과 `Unchecked Exception`으로 구분할 수 있다.

이 둘은 간단하게 `RuntimeException` 을 상속하는지 여부로 구분할 수 있다.

- `Checked Exception` : `RuntimeException`을 상속하지 않는 클래스

- `Unchecked Exception` : `RuntimeException`을 상속하는 클래스

![image](https://user-images.githubusercontent.com/51476083/125185092-9126b100-e25d-11eb-91b9-7100753a8b2f.png)

**두 가지 예외는 컴파일 시 예외 처리를 확인하는 차이를 가질 뿐, 둘 다 예외 처리가 필요하다.**

| 구분 | Checked Exception | Unchecked Exception |
| :---: | :---: | :---: |
| 확인 시점 | 컴파일(Compile) 시점 | 런타임(Runtime) 시점 |
| 처리 여부 | 반드시 예외 처리해야 한다. | 명시적으로 처리하지 않아도 된다. |
| 트랜잭션 처리 | 예외 발생 시 롤백(rollback)하지 않음 | 예외 발생 시 롤백(rollback)해야 함 |
| 종류 | IOException, <br/> ClassNotFoundException 등 | NullPointerException, <br/> ClassCaseException 등 |


### 예외 처리

자바에서 예외 처리는 try~catch 구문과 throws를 통해 예외 처리를 한다.

**try 영역**` <br/>
예외가 발생할 수 있는 부분과 Exception 클래스를 상속하는 클래스의 객체를 생성하는 부분을 try로 감싸야 한다.

**catch 영역** <br/>
try에서 예외 발생 시 JVM은 해당 예외와 관련된 객체를 만들어서 catch 영역으로 던진다. 그렇기 때문에 catch에서는 예외와 관련된 객체를 받을 수 있도록 해당 예외 클래스와 변수를 적어주어야하며, catch문 안에서 예외에 대한 처리를 한다.

**finally 영역** <br/>
해당 영역은 try안으로 진입하면 무조건 실행된다. try에서 예외가 발생하건 안하건 catch가 실행되건 안되건 무조건 실행된다. 여기서는 반드시 실행되어야 하는 문장을 넣는다.
ex) 파일 닫아주는 작업, 리소스 정리

throws를 사용해서 해당 예외를 예외가 발생한 함수를 호출한 함수에게 떠넘길 수 있다.
try-catch 구문과 throws를 사용하지 않으면 결국 JVM이 해당 예외를 처리하게 된다.

**예외처리는 성능의 저하로 이어지기 때문에 꼭 필요한 곳에서만 예외처리를 해야한다.** <br/>

    일반적으로 try 구문 안에 위치한 코드가 try 밖에 위치한 코드보다 느리다

> 예외를 처리하는 방법에는 `예외 복구`, `예외 처리 회피`, `예외 전환` 방법이 있다.

#### 예외 복구

- 예외 상황을 파악하고 문제를 해결해서 정상 상태로 돌려놓는 방법

- 예외를 잡아서 일정 시간, 조건만큼 대기하고 다시 재시도를 반복한다.

- 최대 재시도 횟수를 넘기게 되는 경우 예외를 발생시킨다.

```java
final int MAX_RETRY = 100;
public Object someMethod() {
    int maxRetry = MAX_RETRY;
    while(maxRetry > 0) {
        try {
            ...
        } catch(SomeException e) {
            // 로그 출력. 정해진 시간만큼 대기한다.
        } finally {
            // 리소스 반납 및 정리 작업
        }
    }
    // 최대 재시도 횟수를 넘기면 직접 예외를 발생시킨다.
    throw new RetryFailedException();
}
```

#### 예외 처리 회피

- 예외 처리를 직접 담당하지 않고 호출한 쪽으로 던져 회피하는 방법

- 그래도 예외 처리의 필요성이 있다면 어느 정도는 처리하고 던지는 것이 좋다.

- 긴밀하게 역할을 분담하고 있는 경우 예외를 그냥 던지는 것은 무책임하다.

```java
// 예시 1
public void add() throws SQLException {
    // ...생략
}

// 예시 2
public void add() throws SQLException {
    try {
        // ... 생략
    } catch(SQLException e) {
        // 로그를 출력하고 다시 날린다!
        throw e;
    }
}
```

#### 예외 전환

- 예외 회피와 비슷하게 메서드 밖으로 예외를 던지지만, 그냥 던지지 않고 적절한 예외로 전환해서 넘기는 방법

- 조금 더 명확한 의미로 전달되기 위해 적합한 의미를 가진 예외로 변경한다.

- 예외 처리를 단순하게 만들기 위해 포장(Wrap)할 수도 있다.

```java
// 조금 더 명확한 예외로 던진다.
public void add(User user) throws DuplicateUserIdException, SQLException {
    try {
        // ...생략
    } catch(SQLException e) {
        if(e.getErrorCode() == MysqlErrorNumbers.ER_DUP_ENTRY) {
            throw DuplicateUserIdException();
        }
        else throw e;
    }
}

// 예외를 단순하게 포장한다.
public void someMethod() {
    try {
        // ...생략
    }
    catch(NamingException ne) {
        throw new EJBException(ne);
        }
    catch(SQLException se) {
        throw new EJBException(se);
        }
    catch(RemoteException re) {
        throw new EJBException(re);
        }
}
```
