---
title: 'ITES'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['자료 구조']
date: '2021-01-17'
---

# 문제

- [ITES](https://www.algospot.com/judge/problem/read/ITES)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <queue>

using namespace std;

struct RNG {
	unsigned signal;
	//문제 입력에 따라 초기값을 1983 적용
	RNG() : signal(1983u) {}
	unsigned next() {

		//현재 신호를 10000으로 나눈 나머지에 1을 더해서 출력신호 생성
		unsigned out = signal % 10000u + 1;

		//다음 신호 생성
		signal = (signal * 214013u + 2531011u);
		return out;
	}
};

int main() {
	int tc; cin >> tc;
	while (tc-- > 0) {
		RNG rng;
		unsigned rangeSum = 0;
		int n, k, cnt = 0;
		cin >> k >> n;
		queue<int> q;

		for (int i = 0; i < n; ++i)
		{
			unsigned value = rng.next();
			rangeSum += value;
			q.push(value);
			while(rangeSum > k) {
				rangeSum -= q.front();
				q.pop();
			}
			if(rangeSum == k)
				cnt += 1;
		}
		cout << cnt << '\n';
	}
}
```

</details>

## ⭐️느낀점⭐️

> 인라인 입력을 받는 문제였다. BOJ의 수열과 쿼리 문제에서 인라인 알고리즘으로 머지소트 트리를 사용했던 기억이 나서 다시 한번 보러가야겠다.

<hr/>

## 풀이 📣

1️⃣ 주어진 규칙대로 신호를 만든다.

2️⃣ 연속되는 수열의 합이 K 를 만드는 경우를 카운트한다.

3️⃣ 만약 합이 K 보다 커진다면, 앞쪽부터 제거하여 합이 K 미만으로 되게 한다.

4️⃣ 위의 과정을 반복한다.

<hr/>

## 실수 😅

- 2^32 의 숫자로 나눠야 하는 부분을 unsigned 로 표시함으로써 과정을 생략할 수 있다 !!
- 오버플로우가 날까봐 걱정했는데 그냥 범위를 넘어가는 부분은 잘린다.
