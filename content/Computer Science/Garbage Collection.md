---
title: '가비지 컬렉션'
metaTitle: '만렙 개발자 키우기'
metaDescription: 'CS를 놓치지 않기 위해 정리하고 있습니다.'
tags: ['CS']
date: '2021-03-30'
---

# 가비지 컬렉션(Garbage Collection)

자바 이전에는 프로그래머가 모든 프로그램 메모리를 관리했다. 하지만, 자바에서는 JVM이 가비지 컬렉션이라는 프로세스를 통해 프로그램 메모리를 관리한다.

가비지 컬렉션은 자바 프로그램에서 사용되지 않는 메모리를 지속적으로 찾아내서 제거하는 역할을 한다.

### 실행순서
참조되지 않은 객체들을 탐색 후 삭제 → 삭제된 객체의 메모리 반환 → 힙 메모리 재사용

<hr/>

## stop-the-world
GC를 실행하기 위해 JVM이 애플리케이션 실행을 멈추는 것

어떤 GC 알고리즘을 사용하더라도 `stop-the-world` 는 발생하게 되는데, 대개의 경우 GC 튜닝은 이 `stop-the-world` 시간을 줄이는 것이다.

GC를 해도 더 이상 사용 가능한 메모리 영역이 없는데 계속 메모리를 할당하려고 하면, `OutOfMemoryError`가 발생하여 WAS가 다운될 수도 있다.

`행(Hang)` 즉, 서버가 요청을 처리 못하고 있는 상태가 된다.

<hr/>

## GC 의 대상
1. **객체가 NULL인 경우 (ex. String str = null)**


2. **블럭 실행 종료 후, 블럭 안에서 생성된 객체**


3. **부모 객체가 NULL인 경우, 포함하는 자식 객체**

<hr/>

## GC 의 메모리 해제 과정

> **1. Marking** <br/>
  프로세스는 마킹을 호출, GC는 모든 오브젝트를 스캔해서 참조되지 않는 객체를 마킹한다. 모든 오브젝트를 스캔하기 때문에 매우 많은 시간을 소모한다.


> **2. Normal Deletion** <br/>
   참조되지 않는 객체를 제거하고, 메모리를 반환한다. 메모리 Allocator는 반환되어 비어진 블록의 참조 위치를 저장해뒀다가, 새로운 오브젝트가 선언되면 할당되도록 한다.

> **3. Compacting** <br/>
   퍼포먼스 향상을 위해, 참조되지 않는 객체를 제거하고 또한 남은 참조되어지는 객체들을 묶는다. 이들을 묶음으로써 공간이 생기므로 새로운 메모리 할당 시에 더 쉽고 빠르게 진행할 수 있다.

<hr/>

## Weak Generational Hypothesis
신규로 생성한 객체의 대부분은 금방 사용하지 않는 상태가 되고, 오래된 객체에서 신규 객체로의 참조는 매우 적게 존재한다는 가설.

이 가설에 기반하여 자바는 `Young 영역`과 `Old 영역`으로 메모리를 분할하고, 신규로 생성되는 객체는 `Young 영역`에 보관하고, 오랫동안 살아남은 객체는 `Old 영역`에 보관한다.

<hr/>

## Generational Garbage Collection

> **1. Young 영역(Young Generation 영역)**
> - `eden`(새로 들어오는 객체가 저장되는 space), `S0, S1`(Survivor Space)
> - 새롭게 생성한 객체의 대부분이 여기에 위치한다. 대부분의 객체가 금방 접근 불가능 상태가 되기 때문에 매우 많은 객체가 `Young 영역`에 생성되었다가 사라진다. <br/>
> - 이 영역에서 객체가 사라질때 `Minor GC` 가 발생한다고 말한다.

> **2. Old 영역(Old Generation 영역)**
> - 접근 불가능 상태로 되지 않아 `Young 영역`에서 살아남은 객체가 여기로 복사된다.
> - 대부분 Young 영역보다 크게 할당하며, 크기가 큰 만큼 Young 영역보다 GC는 적게 발생한다.
> - 이 영역에서 객체가 사라질 때 `Major GC`(혹은 Full GC) 가 발생한다고 말한다.

> **3. Permanent 영역**
> - `Method Area`라고도 한다. JVM이 클래스들과 메소드들을 설명하기 위해 필요한 메타데이터들을 포함하고 있다.
> - JDK8부터는 `PermGen`은 `Metaspace`로 교체된다.

<hr/>

## Generational Garbage Collection 과정

1. 어떠한 새로운 객체가 들어오면 `Eden Space`에 할당한다.

2. `Eden space`가 가득 차게 되면, `minor garbage collection`이 시작된다.

3. 참조되는 객체들은 `첫 번째 survivor(S0)`로 이동되어지고, 비 참조 객체는 `Eden space`가 clear 될 때 반환된다.

4. 다음 `minor GC` 때, 비 참조 객체는 삭제되고 참조 객체는` 두 번째 survivor space`로 이동하게 된다. <br/>
   게다가 최근 `minor GC`에서 `S0`로 이동된 객체들도 `age`가 증가하고 `S1` 공간으로 이동한다. <br/>
   한번 모든 `surviving` 객체들이 `S1`으로 이동하게 되면 `S0`와 `Eden` 공간은 Clear 된다. <br/>
   주의해야 할 점은 이제는 다른 aged 객체들을 `Survivor space`에 가지게 되었다는 것이다.

5. 다음 `minor GC` 때, 같은 과정이 반복된다. 참조되는 객체들은 `S0`로 이동한다. <br/>
   살아남은 객체들은 aged된다. 그리고 `Eden`과 `S1` 공간은 Clear 된다.

6. `minor GC` 후 aged 오브젝트들이 일정한 `age threshold(문지방)`을 넘게 되면 그들은 `young generation`에서 `old`로 `promotion` 된다.

7. `minor GC`가 계속되고 계속해서 객체들이 `Old Generation`으로 이동한다.

8. 결국 `major GC`가 `old Generation`에 시행되고, `old Generation`은 Clear 되고, 공간이 Compact 된다.
