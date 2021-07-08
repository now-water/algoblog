---
title: '문제 풀면서 알게된 내용'
metaTitle: '만렙 개발자 키우기'
metaDescription: '문제를 풀면서 알게된 점과 느낀점, 팁 등을 정리한 곳입니다.'
tags: ['TIP']
date: '2021-06-30'
---

## Collections.sort() vs Arrays.sort()

참고 : [언어 별 정렬 속도 차이 비교](https://www.acmicpc.net/blog/view/58) <br/>
알게된 경로 : [BOJ 7453. 합이 0인 네 정수](https://www.acmicpc.net/problem/7453)

### Collections.sort()

- merge sort 수행.

- java 11 기준 1,000 만개 랜덤 데이터 정렬 시 Collections.sort() 는 3308ms 의 시간이 걸린다.


### Arrays.sort()

- dual pivot quick sort 수행.

- java 11 기준 1,000 만개 랜덤 데이터 정렬 시 Arrays.sort() 는 983.55ms 의 시간이 걸린다.

> 일반적으로 Arrays.sort() 가 Collections.sort() 보다 훨씬 빠르다. => 최적화가 필요할 경우 배열 자료구조를 활용해야 한다.


---

## HashMap 의 비효율성

알게된 경로 : [BOJ 7453. 합이 0인 네 정수](https://www.acmicpc.net/problem/7453)


일반적으로 HashMap은 O(1) 의 시간복잡도로 해쉬값을 찾아낼 수 있다.

하지만 대량의 데이터를 처리할 경우, 또는 의도적으로 해시 충돌을 겨냥한 데이터를 처리할 때는 최악의 경우 연산을 수행할 때마다 O(N) 의 시간복잡도가 소요될 수 있다.

따라서 많은 양의 데이터 (가령 1,000 만 이상의 데이터) 를 처리할 경우 다른 접근법으로 문제를 해결해야 한다.

> 코드포스같은 커뮤니티에서는 되도록 트리맵으로 처리가 가능한 범위까지만 맵/셋 사용을 고려하고 수가 너무 많이 주어진다 싶으면 다른 방법을 찾으라고 권하고 있다.
