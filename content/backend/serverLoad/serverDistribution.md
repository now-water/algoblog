---
title: '서버 부하 분산'
metaTitle: '만렙 개발자 키우기'
order: 3
tags: ['Backend']
date: '2021-05-24'
---

# 부하 분산

컴퓨터 네트워크 기술의 일종으로 둘 혹은 셋 이상의 중앙처리장치 혹은 저장장치와 같은 컴퓨터 자원들에게 작업을 나누는 것을 의미한다. 이로써 가용성 및 응답 시간을 최적화시킬 수 있다.

1. VLAN을 이용한 Layer2 부하 분산

2) Routing Protocol을 이용한 Layer3 부하 분산, IP와 Port를 사용한 Layer 4 서버 부하 분산

# 서버 부하 분산(Server Load Balancing)

외부의 사용자로부터 들어오는 다수의 요청(도메인 접속 등)을 서버들에게 적절히 배분하여 서버들로 하여금 요청을 처리케하는 것을 뜻한다.

분산 처리는 부하 분산 `Network Switch` 혹은 `소프트웨어`가 담당한다.

이런 서버 부하 분산을 담당하는 `Network Switch`를 `L4/L7 Switch(Layer 4)` 라고 부르며, Cloud 에서는 `Load Balancer` 라고 부른다.
또한 현업에서는 서버 부하 분산(Server Load Balancing)을 부르기 편하게 `로드밸런싱` 혹은 `LB(Load Balancing)` 라고 부른다.

## 서버 부하 분산 방법

서버에게 부하를 고르게 분산하는 것도 다양한 방법이 존재한다. 서버의 능려글 고려하여 분배해야지 서버가 Down 되지 않기 때문에 서버의 상황에 맞춰 적절한 방법을 선택해야 한다. <br/>
보통 `Load Balancing Method` 라고 부른다.

**1. Round robin**

![image](https://user-images.githubusercontent.com/51476083/119260719-fc191b80-bc0e-11eb-94bd-046648678b61.png)

- 로드 밸런서가 다수의 서버에게 순서대로 요청을 할당하는 방법이다.

* 가장 단순한 방법으로 서버군에 차례로 요청을 할당하여 분산한다.

**2. Least Connection**

![image](https://user-images.githubusercontent.com/51476083/119260733-0d622800-bc0f-11eb-834e-99aeead21af5.png)

- 로드밸런서가 서버에게 요청을 전달한 뒤, 사용자와 서버가 정상적인 연결을 맺으면 사용자와 서버는 `Connection` 을 생성한다.

  - 로드밸런서 또한 중간자로서 `Connection` 정보를 갖는다.

* `Connection`이 가장 적은 서버, 즉 부하가 가장 덜한 서버에게 요청을 전달한다.

**3. Ratio(가중치)**

![image](https://user-images.githubusercontent.com/51476083/119260737-14893600-bc0f-11eb-987f-dad3acede960.png)

- 서버의 처리 능력을 고려하여 할당될 수 있는 각 서버가 가질 수 있는 `Connection`의 비율을 미리 정해둔다.

* 서버의 부하 분산 비율이 100% 라고 했을 때 성능이 가장 떨어지는 서버에게 10%를, 나머지 서버 3대에게 30%씩 할당할 수 있다.

**4. Fastest(Response Time)**

- 응답속도가 가장 빠른 서버에게 우선적으로 할당하는 방식

  - 예를 들어, 서버에 할당된 `Connection`이 5개인데, 서버가 보내오는 `Response`가 5개라면 갖고 있는 `Connection`에 대해 모두 응답하고 있으므로 성능이 충분하다고 판단하고 추가 요청을 보낸다. <br/>

  - 또 다른 서버에 할당된 `Connection`이 10개인데, 서버가 보내오는 `Response`가 5개 뿐이라면 현재 성능이 충분하지 않아 제대로 답변하지 못하는 것으로 판단하고 추가 요청을 해당 서버로 보내지 않는다.
