---
title: '데이터베이스 샤딩'
metaTitle: '만렙 개발자 키우기'
order: 4
tags: ['Backend']
date: '2021-07-16'
---

# 정의

`샤딩(Sharding)`은 `horizontal partitioning`과 관련된 데이터베이스 설계 패턴이다. 
**한 테이블의 rows를 여러 개의 서로 다른 테이블, 즉 파티션으로 분리하는 것**을 말한다.

![image](https://user-images.githubusercontent.com/51476083/125953840-be3b1496-8f13-44b5-85f7-7bdc91000d71.png)

Shards 는 샤딩을 통해 나누어진 블록들을 의미한다.
샤딩은 데이터를 작은 덩어리(smaller chunks)로 쪼개는 것이고, 이 작은 덩어리를 `logical shards`라고 부른다. logical shards는 분리된 `physical shard`, 즉 database node에 뿌려진다.

> **database node** - [Master node와 Slave node](https://www.quora.com/What-does-node-mean-in-a-database-and-what-is-the-difference-between-a-master-node-and-slave-node)
> 
> 데이터베이스의 인스턴스를 말한다. main node(master)는 쓰기, 그 외의 노드(slave)는 읽기 전용으로 사용되는 것이 전형적이다. 
> 
> main node(master)를 변경했을 때 나머지 node(slave)들은 그에 따라 변하게 되는 구조다.

`shard` 들은 자립성이 강해 같은 데이터나 컴퓨터 자원을 공유하지 않는다.

---

# 구현

주로 `application level`에서 실행된다. 여기서 application이란 **어떤 shards에 읽기와 쓰기를 전송할지 정의하는 코드를 포함하고 있는 것**을 말한다.
어떤 데이터베이스 관리 시스템은 내장된 sharding 능력이 있어서 database level에서 바로 사용할 수도 있다.

> **Application level 과 Database level 에서 사용 가능**

---

# 장단점

## 장점

- **수평적 확장 (Scaling out) 이 가능하다.**

    서버의 하드웨어(RAM, CPU 등)를 업그레이드하는 Scaling up 과 다르게, 존재하는 stack 에 machine을 추가하는 방식으로 능력 향상 가능
  

- **스캔 범위를 줄여서 쿼리의 반응 속도를 빠르게 한다.**


- **application을 신뢰할 수 있게 만든다.**

  outage가 생겼을 때, un-sharded 데이터베이스와 다르게 단일 shard에만 영향을 줄 확률이 높다.


## 단점

- 잘못 사용 시 데이터 손실과 같은 위험이 크다


- 데이터가 한 쪽 shard에 쏠리면 sharding이 무의미해진다.


- 한 번 쪼개게 되면, 다시 un-sharded 구조로 돌리기 어렵다.


- 모든 데이터베이스 엔진에서 native하게 지원되지 않는다.

---

# 구조

데이터가 맞는 shard에 들어가는 것이 중요하다. 그렇지 않으면 데이터를 잃거나 쿼리가 매우 느려진다.
보편적인 sharding 방법은 다음과 같다.

## (1) Key Based Sharding

다른 말로 `hash based sharding`이라고도 불린다. 
새로 쓰인 데이터로부터 value를 받아 해당 데이터가 어느 shard로 갈지 결정하는 hash 함수와 연결하는 방식이다.

![image](https://user-images.githubusercontent.com/51476083/125955833-22a96326-257f-4870-b551-bb06b984fb88.png)

### Shard key

올바른 shard에 일관성 있는 방식으로 들어갈 수 있도록 entry를 위치시키기 위해, hash 함수에 들어가는 value들은 같은 column에서 나와야 한다.
이 colum을 `shard key`라고 부른다.

- **넓게 본다면 `shard key` 는 정적이어야 하고, 시간에 따라 바뀌면 안된다.**

    그렇지 않으면 업데이트에 필요한 작업이 증가하고 퍼포먼스를 느리게 할 수 있다.


- 각 행을 위한 고유 식별자를 생성한다는 측면에서 `shard key`는 PK와 비슷하다.

### 장점

이 전략의 가장 큰 장점은 `hotspots`를 방지하기 위해 데이터를 골고루 분배할 수 있고, 
알고리즘적으로 분배하기 때문에 `(2) range based sharding`이나 `(3) directory based sharding`와 다르게 모든 데이터가 어디에 위치하는지 말해주는 map을 가질 필요가 없다.

### 단점

`key based sharding`이 많이 쓰이긴 하지만, 데이터베이스에 서버를 동적으로 추가하거나 제거할 때 어려울 수 있다.

Cluster(그림에서 중간에 hash value를 저장하는 테이블) 가 포함하는 Node 개수를 변경시키면 Hash 크기가 변해 Hash Key 또한 변하게 된다. 결국 Resharding 이 필요해진다.

그럼 결과적으로 migration 하는 동안 애플리케이션은 새로운 데이터를 쓰지 못하고 쉴 수 밖에 없다.


## (2) Range Based Sharding

주어진 value의 범위를 기반으로 데이터를 쪼갠다.

![image](https://user-images.githubusercontent.com/51476083/125956007-37f1cb90-2390-444b-810e-3e95cf587bd5.png)

### 장점

가장 큰 장점은 실행이 비교적 간단하다는 것이다. 모든 shard들은 다른 데이터를 가지고 있고, 
original 데이터베이스 뿐 아니라 서로가 똑같은 스키마를 가지게 된다. 
`application code`는 그저 데이터가 어떤 범위인지 읽고 그에 상응하는 shard에 쓰면 된다.

### 단점

반면, 데이터베이스를 골고루 분배하지는 못하기 때문에 앞서 말한 데이터베이스 hotspots가 생길 수 있다. 위 그림 상으로는 모든 shard들이 같은 양의 데이터를 가지고 있지만, 
특정 데이터가 다른 데이터에 비해 더 많이 찾아질 수 있기 때문에 읽는 횟수가 불균형할 수 있다.


## (3) Directory Based Sharding

이 sharding을 실행하기 위해서는 반드시 **어떤 shard가 어떤 데이터를 갖고 있는지를 추적할 수 있는 shard key를 사용하는 `lookup table`을 만들고 유지해야 한다.**

> **Lookup table**
> 
> 특정 데이터를 찾을 수 있는 정적인 정보를 갖고 있는 테이블이다.
> 
> (마치 인덱스 테이블과 비슷한 것 같다.)

![image](https://user-images.githubusercontent.com/51476083/125956278-f2a459ef-2511-44da-887d-a48f735b12c9.png)

특정 column 이 shard key로 정의된다. shard key 로 부터 온 데이터는 각각의 행이 어떤 shard에 쓰여져야 하는지가 lookup 테이블과 함께 쓰여진다.
`range based sharding`과 비슷해 보이지만, 범위를 기준으로 shard key의 데이터를 내려주는 것과 다르게 각 키들은 각자 자신만의 특별한 shard에 들어가게 된다.

### 장점

**이 방법의 가장 큰 장점은 유연성이다**

- `range based sharding`은 범위에 국한되고, `key based sharding`은 만들고 난 뒤 바꾸기 매우 어려운 hash 함수에 국한된다.

    
- 반면 `directory based sharding`은 데이터를 쪼개기 위한 entry 들은 어떤 시스템이나 알고리즘에 상관없이 entry를 할당할 수 있게 해준다.

      
- 동적으로 shard를 추가하는 것도 비교적 쉽다.
    

### 단점
    
쿼리하거나 write 시에 `lookup table`에 연결이 필요해서 application 의 퍼포먼스에 안좋은 영향(detrimental impact)를 줄 수 있다.

게다가 `lookup table`은 실패 지점이 될 수 있다. `lookup table`이 손상되면 데이터를 새로 쓰거나 존재하는 데이터에 접근하는 것에 영향을 줄 수 있기 때문이다.

---

# 유용한 상황

여러 복잡성 때문에 sharding은 대규모의 데이터를 다룰 때 주로 사용된다.

- 애플리케이션 데이터의 양이 단일 database node의 스토리지 한계를 초과했을 때
  

- 쓰기 & 읽기 양이 단일 노드나 read replica가 핸들링할 수 있는 수준을 넘어서서 반응이 느려졌을 때
  

- 하나의 database node 또는 read replica에 가능한 네트워크 대역폭을 초과해 반응 속도가 느려졌을 때


---

# 가능한 다른 옵션

sharding을 하기 전, 데이터베이스를 최적화할 수 있는 모든 다른 옵션들을 검토해야 한다. 옵션 들은 다음과 같다.

- 데이터베이스를 자신만의 머신으로 옮겨 퍼포먼스를 향상 및 DB 수직 확장을 가능케한다
  

- 읽기 퍼포먼스가 문제라면 캐싱이 좋은 방법. 이미 요청된 데이터들을 일시적으로 메모리에 저장하고, 나중에 접근 시 훨씬 빠르게 접근 가능
  

- 추가적인 데이터베이스 서버를 둬서 읽기와 쓰기를 나누면 한 개의 머신에서 너무 많이 로드하는 것을 방지해주고, 느려지거나 충돌이 발생하는 것을 막아준다. 하지만 computing resource가 많이 요구된다.
  

- 대부분 더 많은 자원을 가진 머신으로 데이터베이스를 scale up 하는 것이 sharding 보다 더 쉽다.

---

# 결론 

`sharding`은 데이터베이스 수평 확장을 고려할 때 좋은 해결책이 될 수 있다. 하지만 복잡성과 잠재적 실패 지점을 만들 수도 있다. 
어떤 이에게는 필요할 수도 있지만, 다른 경우 `sharding`이 주는 이점보다 `sharded architecture`를 만들고 유지하는데 드는 시간과 비용이 압도적일 수도 있다.

앞으로 나아가기 위해, 정보를 최대한 찾아보고 application에 적용하는 것이 좋을 것이다.